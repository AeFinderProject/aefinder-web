'use client';

import { Line } from '@ant-design/charts';
import { Col, Row, Slider, Statistic } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';

import { useDebounceCallback } from '@/lib/utils';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setApikeySummary } from '@/store/slices/appSlice';

import { getSnapshots, getSummary } from '@/api/requestAPIKeys';

import { SnapshotsItemType } from '@/types/apikeyType';

export default function Overview() {
  const dispatch = useAppDispatch();

  const [snapshotsData, setSnapshotsData] = useState<SnapshotsItemType[]>([]);

  const apikeyDetail = useAppSelector((state) => state.app.apikeyDetail);
  const apikeySummary = useAppSelector((state) => state.app.apikeySummary);

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
    console.log('res', res);
    dispatch(setApikeySummary(res));
  }, [dispatch]);

  useEffect(() => {
    getSummaryTemp();
  }, [getSummaryTemp]);

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
  }, [apikeyDetail?.id]);

  useEffect(() => {
    getSnapshotsData();
  }, [getSnapshotsData, apikeyDetail?.id]);

  return (
    <div>
      <Row
        gutter={24}
        className='border-gray-E0 bg-gray-F5 my-[30px] rounded-lg border p-[24px]'
      >
        <Col span={6}>
          <Statistic
            title='Remaining Balance'
            value='$40.00 USDT'
            valueStyle={{ fontSize: '16px', fontWeight: 500 }}
          />
          <div className='text-gray-80 mt-[6px] text-sm'>($20.00 Locked)</div>
        </Col>
        <Col span={6}>
          <Statistic
            title='Daily Cost Average'
            value='$1.02 USDT'
            valueStyle={{ fontSize: '16px', fontWeight: 500 }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title='Monthly Cost Average'
            value='$32.80 USDT'
            valueStyle={{ fontSize: '16px', fontWeight: 500 }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title='Renews in'
            value='24 Days , 1 December 2024'
            valueStyle={{ fontSize: '16px', fontWeight: 500 }}
          />
        </Col>
      </Row>
      <Row gutter={24} className='gap-[14px]'>
        <Col span={8} className='border-gray-E0 rounded-lg border p-[24px]'>
          <div className='items-top flex justify-between'>
            <Statistic
              title='Queries made'
              value={`${apikeySummary.query}/${apikeySummary.queryLimit}`}
              valueStyle={{ fontSize: '16px', fontWeight: 500 }}
            />
            <div className='text-gray-80 relative top-[4px] text-xs'>
              Est. $0.4/daily
            </div>
          </div>
          <Slider
            value={apikeySummary.query}
            min={0}
            max={apikeySummary.queryLimit}
            disabled
          />
        </Col>
        <Col span={8} className='border-gray-E0 rounded-lg border p-[24px]'>
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
