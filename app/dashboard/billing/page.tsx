'use client';

import type { TableColumnsType } from 'antd';
import { Button, Table } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { useThrottleCallback } from '@/lib/utils';

import Copy from '@/components/Copy';

import { useAppDispatch } from '@/store/hooks';

import { getBillingsList } from '@/api/requestMarket';

import { BillingEnum, BillingItem } from '@/types/marketType';

export default function Billing() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [billingsList, setBillingsList] = useState<BillingItem[]>([]);
  const [skipCount, setSkipCount] = useState(1);
  const [maxResultCount, setMaxResultCount] = useState(10);
  const [totalCountItems, setTotalCountItems] = useState(0);

  const getBillingsListTemp = useThrottleCallback(async () => {
    const { items, totalCount } = await getBillingsList({
      sortType: 1,
      skipCount: (skipCount - 1) * maxResultCount,
      maxResultCount: maxResultCount,
    });
    console.log('getBillingsListTemp items', items);
    setBillingsList(items);
    setTotalCountItems(totalCount);
  }, [dispatch]);

  useEffect(() => {
    getBillingsListTemp();
  }, [getBillingsListTemp]);

  const tableOnChange = useCallback(
    (page: number, pageSize: number) => {
      if (page !== skipCount) {
        setSkipCount(page);
      }
      if (maxResultCount !== pageSize) {
        // pageSize change and skipCount need init 1
        setSkipCount(1);
        setMaxResultCount(pageSize);
      }
    },
    [skipCount, maxResultCount]
  );

  const columns: TableColumnsType = [
    {
      title: 'Billing ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => (
        <div>
          <Copy label='' content={text} isShowCopy={true} showLittle={true} />
        </div>
      ),
    },
    {
      title: 'Begin Time',
      dataIndex: 'beginTime',
      key: 'beginTime',
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text: number) => <div>{BillingEnum[text]}</div>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: number) => <div>{text}</div>,
    },
    {
      title: 'Merchandises Details',
      dataIndex: 'details',
      key: 'details',
      render: () => <div>todo : details Drawer </div>,
    },
    {
      title: 'RefundAmount',
      dataIndex: 'refundAmount',
      key: 'refundAmount',
      render: (text: number) => (
        <div>
          {text}
          <span className='ml-[4px] text-sm'>USDT</span>
        </div>
      ),
    },
    {
      title: 'PaidAmount',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      render: (text: number) => (
        <div>
          {text}
          <span className='ml-[4px] text-sm'>USDT</span>
        </div>
      ),
    },
    {
      title: 'TransactionId',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: (text: string) => (
        <div>
          <Copy label='' content={text} isShowCopy={true} showLittle={true} />
        </div>
      ),
    },
    {
      title: 'CreateTime',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: 'PaymentTime',
      dataIndex: 'paymentTime',
      key: 'paymentTime',
    },
    {
      title: 'Billing Detail',
      dataIndex: 'action',
      key: 'action',
      render: () => <div>todo : Action Drawer </div>,
    },
  ];

  return (
    <div className='overflow-hidden px-[16px] pb-[40px] sm:px-[40px]'>
      {billingsList?.length === 0 && (
        <div>
          <div className='border-gray-F0 flex flex-wrap items-center justify-between border-b sm:h-[120px]'>
            <div className='my-[20px] text-3xl text-black sm:my-[0px]'>
              Billing
            </div>
            <div>
              <Button
                type='primary'
                className='h-[40px] w-[160px] text-sm'
                onClick={() => {
                  router.push('/dashboard/billing/notification');
                }}
              >
                <Image
                  src='/assets/svg/notifications.svg'
                  alt='notification'
                  width={16}
                  height={16}
                  className='mr-2 inline-block'
                />
                Notification
              </Button>
              <Button
                type='primary'
                className='ml-[10px] h-[40px] w-[148px] text-sm'
                onClick={() => {
                  router.push('/dashboard/billing/upgrade');
                }}
              >
                <Image
                  src='/assets/svg/shopping-cart.svg'
                  alt='shopping'
                  width={14}
                  height={14}
                  className='mr-2 inline-block'
                />
                Purchase
              </Button>
              <Button
                type='primary'
                className='my-[20px] ml-[0px] h-[40px] w-[148px] text-sm sm:my-[0px] sm:ml-[10px]'
                onClick={() => {
                  router.push('/dashboard/billing/manage');
                }}
              >
                <Image
                  src='/assets/svg/manage-accounts.svg'
                  alt='manage'
                  width={14}
                  height={14}
                  className='mr-2 inline-block'
                />
                Manage Billing
              </Button>
            </div>
          </div>
          <div className='flex flex-col items-center'>
            <Image
              src='/assets/svg/billing-empty.svg'
              alt='billing'
              width={410}
              height={292}
              className='mt-[100px]'
            />
            <div className='text-dark-normal my-[22px] text-2xl'>
              Account ready to query the network
            </div>
            <div className='text-gray-80'>
              With a positive billing balance you are ready to query the
              network.
            </div>
            <div className='text-gray-80 mb-[22px]'>
              Create an API key to get started.
            </div>
            <Button
              className='bg-gray-F5 mb-[22px] h-[40px] w-[148px] border-none font-medium'
              onClick={() => router.push('/dashboard/apikey')}
            >
              Create API Key
            </Button>
            <div
              className='text-blue-link cursor-pointer'
              onClick={() =>
                window.open(
                  'https://docs.aefinder.io/docs/quick-start',
                  '_blank'
                )
              }
            >
              View documentation
              <Image
                src='/assets/svg/right-arrow.svg'
                alt='arrow'
                width={24}
                height={24}
                className='relative top-[-1px] ml-[8px] inline-block'
              />
            </div>
          </div>
        </div>
      )}
      {billingsList?.length > 0 && (
        <div className='mt-[4px]'>
          <Table
            rowKey='id'
            columns={columns}
            dataSource={billingsList}
            className='w-full'
            scroll={{ x: 'max-content' }}
            pagination={{
              current: skipCount,
              pageSize: maxResultCount,
              total: totalCountItems,
              onChange: tableOnChange,
              showSizeChanger: true,
              showTitle: true,
              showTotal: (total) => `Total ${total} Billings`,
              pageSizeOptions: ['10', '20', '50'],
            }}
          />
        </div>
      )}
    </div>
  );
}
