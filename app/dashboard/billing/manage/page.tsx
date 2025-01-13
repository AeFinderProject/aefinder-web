'use client';

import { LeftOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import { Button, Tabs } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import OrderList from '@/components/billing/OrderList';
import Overview from '@/components/billing/Overview';
import TransactionHistory from '@/components/billing/TransactionHistory';

export default function BillingManage() {
  const router = useRouter();

  const [activeTabKey, setActiveTabKey] = useState(
    localStorage.getItem('billingTabKey') || 'overview'
  );

  const onTabChange = (key: string) => {
    localStorage.setItem('billingTabKey', key);
    setActiveTabKey(key);
  };

  const items: TabsProps['items'] = [
    {
      key: 'overview',
      label: 'Overview',
      children: <Overview />,
    },
    {
      key: 'order',
      label: 'Order',
      children: <OrderList />,
    },
    {
      key: 'transactionHistory',
      label: 'Transaction History',
      children: <TransactionHistory />,
    },
  ];

  return (
    <div className='px-[16px] pb-[40px] sm:px-[40px]'>
      <div className='flex flex-wrap items-center justify-between sm:h-[120px]'>
        <div className='my-[20px] flex items-center sm:my-[0px]'>
          <LeftOutlined
            className='relative top-[-2px] mr-[16px] cursor-pointer align-middle text-sm'
            onClick={() => router.back()}
          />
          <div className='text-3xl text-black'>Billing</div>
        </div>
        <div>
          <Button
            type='primary'
            className='h-[40px] w-[148px]  text-sm'
            onClick={() => {
              router.push('/dashboard/billing/upgrade');
            }}
          >
            <PlusOutlined className='relative top-[-3px] mr-2 inline-block text-lg text-white' />
            Purchase
          </Button>
          <Button
            type='primary'
            className='mx-[10px] h-[40px] w-[148px] text-sm'
            onClick={() => {
              router.push('/dashboard/billing/deposit');
            }}
          >
            <Image
              src='/assets/svg/wallet.svg'
              alt='wallet'
              width={20}
              height={20}
              className='mr-2 inline-block'
            />
            Deposit
          </Button>
          <Button
            type='primary'
            className='my-[10px] h-[40px] w-[148px] text-sm sm:my-[0px]'
            onClick={() => {
              router.push('/dashboard/billing/withdraw');
            }}
          >
            <UploadOutlined className='relative top-[-3px] mr-2 inline-block text-lg text-white' />
            Withdraw
          </Button>
        </div>
      </div>
      <Tabs
        defaultActiveKey={activeTabKey}
        items={items}
        onChange={onTabChange}
      />
    </div>
  );
}
