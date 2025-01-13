'use client';

import { Line } from '@ant-design/charts';
import { Col, Row, Slider, Statistic } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';

import { getRemainingDays, useDebounceCallback } from '@/lib/utils';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setApikeySummary } from '@/store/slices/appSlice';
import { setOrgBalance } from '@/store/slices/commonSlice';

import { getSnapshots, getSummary } from '@/api/requestAPIKeys';
import { getOrgBalance } from '@/api/requestMarket';

import { SnapshotsItemType } from '@/types/apikeyType';

export default function Overview() {
  const dispatch = useAppDispatch();

  const [snapshotsData, setSnapshotsData] = useState<SnapshotsItemType[]>([]);

  const apiMerchandisesItem = useAppSelector(
    (state) => state.app.apiMerchandisesItem
  );
  const apikeySummary = useAppSelector((state) => state.app.apikeySummary);
  const orgBalance = useAppSelector((state) => state.common.orgBalance);

  const config = {
    data: snapshotsData,
    xField: 'time',
    yField: 'query',
    padding: 'auto',
    forceFit: true,
    smooth: true,
  };

  const getSummaryTemp = useCallback(async () => {
    const res = await getSummary();
    console.log('getSummaryRes', res);
    dispatch(setApikeySummary(res));
  }, [dispatch]);

  const getSnapshotsData = useDebounceCallback(async () => {
    const currentDate = dayjs();
    const currentDateISO = currentDate.toISOString();
    const oneMonthAgoISO = currentDate.subtract(1, 'month').toISOString();

    const params = {
      beginTime: oneMonthAgoISO,
      endTime: currentDateISO,
      type: 0,
    };
    const { items } = await getSnapshots(params);
    setSnapshotsData(items);
  }, []);

  useEffect(() => {
    getSummaryTemp();
    getSnapshotsData();
  }, [getSummaryTemp, getSnapshotsData]);

  const getOrgBalanceTemp = useCallback(async () => {
    const getOrgBalanceRes = await getOrgBalance();
    console.log('getOrgBalance', getOrgBalanceRes);
    if (getOrgBalanceRes?.balance !== null) {
      dispatch(setOrgBalance(getOrgBalanceRes));
    }
  }, [dispatch]);

  useEffect(() => {
    getOrgBalanceTemp();
  }, [getOrgBalanceTemp]);

  return (
    <div>
      <Row
        gutter={24}
        className='border-gray-E0 bg-gray-F5 mb-[30px] rounded-lg border p-[24px] pt-[14px]'
      >
        <Col sm={8} md={8} className='my-[10px]'>
          <Statistic
            title='Remaining Balance'
            value={`${orgBalance?.balance} USDT`}
            valueStyle={{ fontSize: '16px', fontWeight: 500 }}
          />
        </Col>
        <Col sm={8} md={8} className='my-[10px]'>
          <Statistic
            title='Locked'
            value={`${orgBalance?.lockedBalance} USDT`}
            valueStyle={{ fontSize: '16px', fontWeight: 500 }}
          />
        </Col>
        <Col sm={8} md={8} className='my-[10px]'>
          <Statistic
            title='Renews in'
            value={`${getRemainingDays()} Days`}
            valueStyle={{ fontSize: '16px', fontWeight: 500 }}
          />
        </Col>
      </Row>
      <Row gutter={24} className='gap-[14px]'>
        <Col
          sm={16}
          md={8}
          className='border-gray-E0 rounded-lg border p-[24px]'
        >
          <div className='items-top flex justify-between'>
            <Statistic
              title='Queries made'
              value={`${apikeySummary.query}/${apikeySummary.queryLimit}`}
              valueStyle={{ fontSize: '16px', fontWeight: 500 }}
            />
            <div className='text-gray-80 relative top-[4px] text-xs'>
              {apiMerchandisesItem?.price}
              <span className='text-gray-80 ml-[4px] mr-[12px] font-medium'>
                USDT/Query
              </span>
            </div>
          </div>
          <Slider
            value={apikeySummary.query}
            min={0}
            max={apikeySummary.queryLimit}
            disabled
          />
        </Col>
        <Col
          sm={8}
          md={8}
          className='border-gray-E0 rounded-lg border p-[24px]'
        >
          <Statistic
            title='API Keys'
            value={`${apikeySummary.apiKeyCount}/${apikeySummary.maxApiKeyCount}`}
            valueStyle={{ fontSize: '16px', fontWeight: 500 }}
          />
          <div></div>
        </Col>
      </Row>
      <div>
        <div className='text-dark-normal mt-[32px]'>Current period queries</div>
        {snapshotsData.length === 0 && (
          <div className='text-gray-80 border-gray-E0 mt-[6px] h-[120px] rounded-lg border bg-gradient-to-b from-[#F5F7FF] to-[#E6EBF5] p-[24px] text-center text-sm leading-[85px]'>
            Chart will be visible when we have enough data
          </div>
        )}
        {snapshotsData.length > 0 && <Line {...config} />}
      </div>
    </div>
  );
}
