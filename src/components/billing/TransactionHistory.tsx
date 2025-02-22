import type { TableColumnsType } from 'antd';
import { Spin, Table } from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';

import { useThrottleCallback } from '@/lib/utils';

import Copy from '@/components/Copy';

import { getTransactionHistory } from '@/api/requestMarket';

import { TransactionHistoryItem } from '@/types/marketType';

export default function TransactionHistory() {
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHistoryList, setTransactionHistoryList] = useState<
    TransactionHistoryItem[]
  >([]);
  const [skipCount, setSkipCount] = useState(1);
  const [maxResultCount, setMaxResultCount] = useState(10);
  const [totalCountItems, setTotalCountItems] = useState(0);

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

  const getTransactionHistoryList = useThrottleCallback(async () => {
    setIsLoading(true);
    try {
      const { items, totalCount } = await getTransactionHistory({
        skipCount: (skipCount - 1) * maxResultCount,
        maxResultCount: maxResultCount,
      });
      setTransactionHistoryList(items);
      setTotalCountItems(totalCount);
    } finally {
      setIsLoading(false);
    }
  }, [skipCount, maxResultCount]);

  useEffect(() => {
    getTransactionHistoryList();
  }, [getTransactionHistoryList]);

  const columns: TableColumnsType = [
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: (text: string) => (
        <div>
          <Copy label='' content={text} isShowCopy={true} showLittle={true} />
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      render: (text: string) => (
        <div>{dayjs(text).format('YYYY/MM/DD HH:mm:ss')}</div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'transactionDescription',
      key: 'transactionDescription',
    },
    {
      title: 'Amount',
      dataIndex: 'transactionAmount',
      key: 'transactionAmount',
      render: (text: number) => (
        <div>
          {text}
          <span className='ml-[4px] text-sm'>USDT</span>
        </div>
      ),
    },
    {
      title: 'Balance After',
      dataIndex: 'balanceAfter',
      key: 'balanceAfter',
      render: (text: number) => (
        <div>
          {text}
          <span className='ml-[4px] text-sm'>USDT</span>
        </div>
      ),
    },
  ];

  return (
    <div>
      {transactionHistoryList.length === 0 && (
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/assets/svg/transaction-history.svg'
            alt='history'
            width={220}
            height={186}
            className='mt-[170px]'
          />
          <div className='text-dark-normal mb-[14px] mt-[45px] text-2xl font-medium'>
            No billing transaction
          </div>
          <div className='text-gray-80'>
            As you add and remove USDT from the billing contract, a record of
            those transaction will show up here
          </div>
          {isLoading && (
            <div className='flex items-center justify-center'>
              <Spin size='large' />
            </div>
          )}
        </div>
      )}
      {transactionHistoryList.length > 0 && (
        <div className='mt-[4px]'>
          <Table
            rowKey='transactionId'
            columns={columns}
            dataSource={transactionHistoryList}
            className='w-full'
            scroll={{ x: 'max-content' }}
            pagination={{
              current: skipCount,
              pageSize: maxResultCount,
              total: totalCountItems,
              onChange: tableOnChange,
              showSizeChanger: true,
              showTitle: true,
              showTotal: (total) => `Total ${total} transaction`,
              pageSizeOptions: ['10', '20', '50'],
            }}
          />
        </div>
      )}
    </div>
  );
}
