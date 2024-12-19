import type { TableColumnsType } from 'antd';
import { Table } from 'antd';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { useThrottleCallback } from '@/lib/utils';

import Copy from '@/components/Copy';

import { useAppSelector } from '@/store/hooks';

import { getTransactionHistory } from '@/api/requestMarket';

import { TransactionHistoryItem } from '@/types/marketType';

export default function TransactionHistory() {
  const orgUserAll = useAppSelector((state) => state.app.orgUserAll);
  const [transactionHistoryList, setTransactionHistoryList] = useState<
    TransactionHistoryItem[]
  >([]);

  const getTransactionHistoryList = useThrottleCallback(async () => {
    const { items } = await getTransactionHistory({
      organizationId: orgUserAll?.id,
    });
    setTransactionHistoryList(items);
  }, [orgUserAll?.id]);

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
          <Copy
            className='ml-[32px]'
            label=''
            content={text}
            isShowCopy={true}
            showLittle={true}
          />
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
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
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    // {
    //   title: 'View',
    //   dataIndex: '',
    //   key: 'View',
    //   render: (_, record: TransactionHistoryItem) => {
    //     return (
    //       <div
    //         className='text-blue-link cursor-pointer'
    //         onClick={() => {
    //           openWithBlank(
    //             `${aelfscanAddress}/${CHAIN_ID}/tx/${record?.transactionId}`
    //           );
    //         }}
    //       >
    //         Detail
    //       </div>
    //     );
    //   },
    // },
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
        </div>
      )}
      {transactionHistoryList.length > 0 && (
        <div className='mt-[24px]'>
          <Table
            rowKey='transactionId'
            columns={columns}
            dataSource={transactionHistoryList}
            className='w-full'
          />
        </div>
      )}
    </div>
  );
}
