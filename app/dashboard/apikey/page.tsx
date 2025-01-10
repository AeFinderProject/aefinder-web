'use client';

import type { TableColumnsType } from 'antd';
import { Button, Col, Row, Table, Tag, Tooltip } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { useDebounceCallback, useThrottleCallback } from '@/lib/utils';

import CreateApiKeyModal from '@/components/apikey/CreateApiKeyModal';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setApikeyList,
  setApikeySummary,
  setApiMerchandisesItem,
} from '@/store/slices/appSlice';
import { setOrgBalance } from '@/store/slices/commonSlice';

import { queryAuthToken } from '@/api/apiUtils';
import { getApiKeysList, getSummary } from '@/api/requestAPIKeys';
import { getMerchandisesList, getOrgBalance } from '@/api/requestMarket';

import { ApikeyItemType } from '@/types/apikeyType';

export default function Apikey() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const apikeyList = useAppSelector((state) => state.app.apikeyList);
  const apikeySummary = useAppSelector((state) => state.app.apikeySummary);
  const orgBalance = useAppSelector((state) => state.common.orgBalance);
  const apiMerchandisesItem = useAppSelector(
    (state) => state.app.apiMerchandisesItem
  );

  const [loading, setLoading] = useState(false);
  const [isShowCreateModal, setIsShowCreateModal] = useState(false);

  const getMerchandisesListTemp = useCallback(async () => {
    const { items } = await getMerchandisesList({
      type: 0,
      category: 0,
    });
    console.log('getMerchandisesList items', items);
    if (items?.length > 0) {
      dispatch(setApiMerchandisesItem(items[0]));
    }
  }, [dispatch]);

  useEffect(() => {
    getMerchandisesListTemp();
  }, [getMerchandisesListTemp]);

  const columns: TableColumnsType<ApikeyItemType> = [
    {
      title: 'Key name',
      dataIndex: '',
      key: 'name',
      render: (record) => (
        <div
          className='cursor-pointer'
          onClick={() =>
            router.push(`/dashboard/apikey/detail?id=${record?.id}`)
          }
        >
          <span className='text-dark-normal'>{record?.name}</span>
          <Image
            src='/assets/svg/right-arrow.svg'
            alt='arrow'
            width={20}
            height={20}
            className='relative top-[-1px] ml-[8px] inline-block'
          />
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (record) =>
        record ? (
          <Tag color='green'>Active</Tag>
        ) : (
          <Tag color='#f50'>unActive</Tag>
        ),
    },
    {
      title: 'Period Query',
      dataIndex: 'periodQuery',
      key: 'periodQuery',
    },
    {
      title: 'Period Cost',
      dataIndex: 'periodQuery',
      key: 'periodCost',
      render: (text) => (
        <span>
          {(apiMerchandisesItem?.price || 0) * text}
          <span className='ml-[4px]'>USDT</span>
        </span>
      ),
    },
    {
      title: 'Spending Limit',
      dataIndex: 'spendingLimitUsdt',
      key: 'spendingLimitUsdt',
      render: (text) => {
        return (
          <div>
            {text}
            <span className='ml-[4px]'>USDT</span>
          </div>
        );
      },
    },
    { title: 'Total Queries', dataIndex: 'totalQuery', key: 'totalQuery' },
    {
      title: 'Total Query Fees',
      dataIndex: 'totalQuery',
      key: 'totalQueryFee',
      render: (text) => (
        <span>
          {(apiMerchandisesItem?.price || 0) * text}
          <span className='ml-[4px]'>USDT</span>
        </span>
      ),
    },
  ];

  const getSummaryTemp = useThrottleCallback(async () => {
    await queryAuthToken();
    const res = await getSummary();
    console.log('res', res);
    dispatch(setApikeySummary(res));
  }, [dispatch]);

  useEffect(() => {
    getSummaryTemp();
  }, [isShowCreateModal, getSummaryTemp]);

  const getApikeyListTemp = useCallback(async () => {
    const param = {
      skipCount: 0,
      maxResultCount: 1000,
    };
    setLoading(true);
    const { items = [] } = await getApiKeysList(param);
    console.log('item', items);
    setLoading(false);
    dispatch(setApikeyList(items));
  }, [dispatch]);

  useEffect(() => {
    getApikeyListTemp();
  }, [isShowCreateModal, getApikeyListTemp]);

  const getOrgBalanceTemp = useDebounceCallback(async () => {
    const getOrgBalanceRes = await getOrgBalance();
    console.log('getOrgBalance', getOrgBalanceRes);
    if (getOrgBalanceRes?.balance !== null) {
      dispatch(setOrgBalance(getOrgBalanceRes));
    }
  }, [getOrgBalance]);

  useEffect(() => {
    getOrgBalanceTemp();
  }, [getOrgBalanceTemp]);

  return (
    <div className='overflow-hidden px-[16px] pb-[40px] sm:px-[40px]'>
      <div className='text-dark-normal mb-[31px] mt-[48px] text-3xl font-medium'>
        API Keys
      </div>
      <Row
        gutter={24}
        className='border-gray-E0 bg-gray-F5 mb-[48px] flex items-center justify-between rounded-lg border p-[24px]'
      >
        <Col sm={12} md={6} className='my-[10px] sm:my-[0px]'>
          <div className='mb-[4px]'>
            <span className='text-gray-80 mr-[8px] text-sm'>Total Queries</span>
            <Tooltip
              title='The total volume of queries made by your API keys'
              className='inline-block align-middle'
            >
              <Image
                src='/assets/svg/info-filled.svg'
                alt='info'
                width={16}
                height={16}
                className='relative'
              />
            </Tooltip>
          </div>
          <div className='text-dark-normal font-medium'>
            {apikeySummary.totalQuery}
          </div>
        </Col>
        <Col sm={12} md={6} className='my-[10px] sm:my-[0px]'>
          <div className='mb-[4px]'>
            <span className='text-gray-80 mr-[8px] text-sm'>
              Billing Balance
            </span>
            <Tooltip
              title='GRT currently available in your billing contract. Withdraw at any time.'
              className='inline-block align-middle'
            >
              <Image
                src='/assets/svg/info-filled.svg'
                alt='info'
                width={16}
                height={16}
                className='relative'
              />
            </Tooltip>
          </div>
          <div className='text-dark-normal font-medium'>
            {orgBalance?.balance}
            <span className='text-gray-80 ml-[4px] mr-[12px] font-medium'>
              USDT
            </span>
            <span
              className='text-blue-link cursor-pointer text-sm'
              onClick={() => router.push('/dashboard/billing/deposit')}
            >
              Add
              <Image
                src='/assets/svg/right-arrow.svg'
                alt='arrow'
                width={16}
                height={16}
                className='relative top-[-1px] ml-[4px] inline-block'
              />
            </span>
          </div>
        </Col>
        <Col sm={12} md={6} className='my-[10px] sm:my-[0px]'>
          <div className='mb-[4px]'>
            <span className='text-gray-80 mr-[8px] text-sm'>
              Total API Keys
            </span>
            <Tooltip
              title='The amount spent in the current billing period for a given API key'
              className='inline-block align-middle'
            >
              <Image
                src='/assets/svg/info-filled.svg'
                alt='info'
                width={16}
                height={16}
                className='relative'
              />
            </Tooltip>
          </div>
          <div className='text-dark-normal font-medium'>
            {apikeySummary.apiKeyCount}/{apikeySummary.maxApiKeyCount || 10}
            <span className='text-gray-80 ml-[4px] font-medium'>Used</span>
          </div>
        </Col>
        <Col sm={12} md={6} className='mt-[20px] sm:my-[0px]'>
          <Button
            onClick={() => setIsShowCreateModal(true)}
            className='text-blue-link border-blue-link w-[180px] border'
          >
            Create New API Key
          </Button>
        </Col>
      </Row>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={apikeyList}
        loading={loading}
        pagination={false}
        scroll={{ x: 'max-content' }}
        className='w-full'
        locale={{
          emptyText: (
            <div className='flex flex-col items-center justify-center'>
              <Image
                src='/assets/svg/billing-empty.svg'
                alt='info'
                width={409}
                height={192}
                className='mb-[36px] mt-[80px]'
              />
              <div className='text-dark-normal mb-[100px] text-2xl font-medium'>
                No API Keys Yet
              </div>
            </div>
          ),
        }}
      />
      <CreateApiKeyModal
        isShowCreateModal={isShowCreateModal}
        setIsShowCreateModal={setIsShowCreateModal}
      />
    </div>
  );
}
