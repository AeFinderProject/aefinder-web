'use client';
import { BellOutlined, UploadOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import { Button, Tabs } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import BillingTab from '@/components/billing/BillingTab';
import OrderList from '@/components/billing/OrderList';
import Overview from '@/components/billing/Overview';
import TransactionHistory from '@/components/billing/TransactionHistory';

export default function Billing() {
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
      key: 'billing',
      label: 'Billing',
      children: <BillingTab />,
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
    <div className='overflow-hidden px-[16px] pb-[40px] sm:px-[40px]'>
      <div className='flex flex-wrap items-center justify-between sm:h-[120px]'>
        <div className='my-[20px] text-3xl text-black sm:my-[0px]'>
          Billing Management
        </div>
        <div>
          <BellOutlined
            className='hover:text-blue-link mr-[16px] cursor-pointer text-xl text-black'
            onClick={() => {
              router.push('/dashboard/billing/notification');
            }}
          />
          <Button
            type='primary'
            className='mx-[10px] h-[40px] w-[160px] text-sm'
            onClick={() => {
              router.push('/dashboard/billing/upgrade');
            }}
          >
            <Image
              src='/assets/svg/shopping-cart.svg'
              alt='shopping'
              width={14}
              height={14}
              className='relative top-[-2px] mr-2 inline-block'
            />
            Purchase Queries
          </Button>
          <Button
            type='primary'
            className='mx-[10px] h-[40px] w-[120px] text-sm'
            onClick={() => {
              router.push('/dashboard/billing/deposit');
            }}
          >
            <Image
              src='/assets/svg/wallet.svg'
              alt='wallet'
              width={20}
              height={20}
              className='relative top-[-2px] mr-2 inline-block'
            />
            Deposit
          </Button>
          <Button
            type='primary'
            className='my-[10px] h-[40px] w-[120px] text-sm sm:my-[0px]'
            onClick={() => {
              router.push('/dashboard/billing/withdraw');
            }}
          >
            <UploadOutlined className='relative top-[-3px] mr-[2px] inline-block text-lg text-white' />
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
