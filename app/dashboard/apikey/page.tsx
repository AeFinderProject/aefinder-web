'use client';

import type { TableColumnsType } from 'antd';
import { Button, Table, Tag, Tooltip } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { getQueryFee } from '@/lib/utils';

import CreateApiKeyModal from '@/components/apikey/CreateApiKeyModal';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setApikeyList,
  setApikeySummary,
  setRegularData,
} from '@/store/slices/appSlice';

import { queryAuthToken } from '@/api/apiUtils';
import { getApiKeysList, getSummary } from '@/api/requestAPIKeys';
import { getMarketRegular } from '@/api/requestMarket';

import { ApikeyItemType } from '@/types/apikeyType';

export default function Apikey() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const apikeyList = useAppSelector((state) => state.app.apikeyList);
  const apikeySummary = useAppSelector((state) => state.app.apikeySummary);
  const regularData = useAppSelector((state) => state.app.regularData);

  const [loading, setLoading] = useState(false);
  const [isShowCreateModal, setIsShowCreateModal] = useState(false);

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
      title: 'Period Cost',
      dataIndex: '',
      key: 'periodQuery',
      render: (record) => (
        <span>
          ${getQueryFee(record?.periodQuery, regularData?.monthlyUnitPrice)}
          <span className='text-gray-80 ml-[4px]'>USDT</span>
        </span>
      ),
    },
    {
      title: 'Spending Limit',
      dataIndex: 'spendingLimitUsdt',
      key: 'spendingLimitUsdt',
    },
    { title: 'Total Queries', dataIndex: 'totalQuery', key: 'totalQuery' },
    {
      title: 'Total Query Fees',
      dataIndex: '',
      key: 'totalQuery',
      render: (record) => (
        <span>
          ${getQueryFee(record?.totalQuery, regularData?.monthlyUnitPrice)}
          <span className='text-gray-80 ml-[4px]'>USDT</span>
        </span>
      ),
    },
  ];

  const getSummaryTemp = useCallback(async () => {
    await queryAuthToken();
    const res = await getSummary();
    console.log('res', res);
    dispatch(setApikeySummary(res));
  }, [dispatch]);

  useEffect(() => {
    getSummaryTemp();
  }, [isShowCreateModal, getSummaryTemp]);

  const getMarketRegularTemp = useCallback(async () => {
    const res = await getMarketRegular();
    dispatch(setRegularData(res));
  }, [dispatch]);

  useEffect(() => {
    getMarketRegularTemp();
  }, [getMarketRegularTemp]);

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

  return (
    <div className='px-[16px] pb-[40px] sm:px-[40px]'>
      <div className='text-dark-normal mb-[31px] mt-[48px] text-3xl font-medium'>
        API Keys
      </div>
      <div className='border-gray-E0 bg-gray-F5 mb-[48px] flex items-center justify-between rounded-lg border p-[24px]'>
        <div>
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
        </div>
        <div>
          <div className='mb-[4px]'>
            <span className='text-gray-80 mr-[8px] text-sm'>
              Total Query fees
            </span>
            <Tooltip
              title='The total fees paid by your API keys.'
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
            $
            {getQueryFee(
              apikeySummary?.totalQuery,
              regularData?.monthlyUnitPrice
            )}
            <span className='text-gray-80 ml-[4px] font-medium'>USDT</span>
          </div>
        </div>
        <div>
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
            $40.00
            <span className='text-gray-80 ml-[4px] mr-[12px] font-medium'>
              USDT
            </span>
            <span
              className='text-blue-link cursor-pointer text-sm'
              onClick={() => router.push('/dashboard/billing')}
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
        </div>
        <div>
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
        </div>
        <Button
          onClick={() => setIsShowCreateModal(true)}
          className='text-blue-link border-blue-link w-[180px] border'
        >
          Create New API Key
        </Button>
      </div>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={apikeyList}
        loading={loading}
        pagination={false}
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
