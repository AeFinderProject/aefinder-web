import type { TableColumnsType } from 'antd';
import { Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { useThrottleCallback } from '@/lib/utils';

import Copy from '@/components/Copy';

import { useAppDispatch } from '@/store/hooks';

import { getBillingsList } from '@/api/requestMarket';

import { BillingEnum, BillingItem } from '@/types/marketType';

export default function BillingTab() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [billingsList, setBillingsList] = useState<BillingItem[]>([]);
  const [skipCount, setSkipCount] = useState(1);
  const [maxResultCount, setMaxResultCount] = useState(10);
  const [totalCountItems, setTotalCountItems] = useState(0);

  const getBillingsListTemp = useThrottleCallback(async () => {
    setIsLoading(true);
    try {
      const { items, totalCount } = await getBillingsList({
        sortType: 1,
        skipCount: (skipCount - 1) * maxResultCount,
        maxResultCount: maxResultCount,
      });
      console.log('getBillingsListTemp items', items);
      setBillingsList(items);
      setTotalCountItems(totalCount);
    } finally {
      setIsLoading(false);
    }
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
      render: (text: string) => (
        <div>
          {text !== '0001-01-01T00:00:00Z'
            ? dayjs(text).format('YYYY/MM/DD HH:mm:ss')
            : ''}
        </div>
      ),
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (text: string) => (
        <div>
          {text !== '0001-01-01T00:00:00Z'
            ? dayjs(text).format('YYYY/MM/DD HH:mm:ss')
            : ''}
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text: number) => {
        return (
          <div>
            {text === 0 && <Tag color='success'>{BillingEnum[text]}</Tag>}
            {text === 1 && <Tag color='processing'>{BillingEnum[text]}</Tag>}
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: number) => (
        <div>
          {text === 0 && <Tag color='volcano'>Unpaid</Tag>}
          {text === 1 && <Tag color='processing'>Payment Pending</Tag>}
          {text === 2 && <Tag color='success'>Payment Confirmed</Tag>}
          {text === 3 && <Tag color='orange'>Payment Failed</Tag>}
        </div>
      ),
    },
    {
      title: 'Refund Amount',
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
      title: 'Paid Amount',
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
      title: 'Transaction Id',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: (text: string) => (
        <div>
          {text ? (
            <Copy label='' content={text} isShowCopy={true} showLittle={true} />
          ) : (
            '--'
          )}
        </div>
      ),
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text: string) => (
        <div>
          {text !== '0001-01-01T00:00:00Z'
            ? dayjs(text).format('YYYY/MM/DD HH:mm:ss')
            : '--'}
        </div>
      ),
    },
    {
      title: 'Payment Time',
      dataIndex: 'paymentTime',
      key: 'paymentTime',
      render: (text: string) => (
        <div>
          {text !== '0001-01-01T00:00:00Z'
            ? dayjs(text).format('YYYY/MM/DD HH:mm:ss')
            : '--'}
        </div>
      ),
    },
    {
      title: 'Billing Details',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => (
        <div
          className='text-blue-link cursor-pointer'
          onClick={() =>
            router.push(`/dashboard/billing/billingDetail?billingId=${text}`)
          }
        >
          Details
        </div>
      ),
    },
  ];

  return (
    <div className='mt-[4px]'>
      <Table
        rowKey='id'
        columns={columns}
        dataSource={billingsList}
        className='w-full'
        scroll={{ x: 'max-content' }}
        loading={isLoading}
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
  );
}
