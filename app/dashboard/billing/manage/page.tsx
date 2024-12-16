'use client';

import { LeftOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import { Button, Tabs, Tag } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import Invoices from '@/components/billing/Invoices';
import Overview from '@/components/billing/Overview';
import TransactionHistory from '@/components/billing/TransactionHistory';

export default function BillingManage() {
  const router = useRouter();

  const [activeTabKey, setActiveTabKey] = useState('overview');

  const onTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const items: TabsProps['items'] = [
    {
      key: 'overview',
      label: 'Overview',
      children: <Overview />,
    },
    {
      key: 'invoices',
      label: 'Invoices',
      children: <Invoices />,
    },
    {
      key: 'transactionHistory',
      label: 'Transaction History',
      children: <TransactionHistory />,
    },
  ];

  return (
    <div className='px-[16px] pb-[40px] sm:px-[40px]'>
      <div className='flex h-[120px] items-center justify-between'>
        <div className='flex items-center'>
          <LeftOutlined
            className='relative top-[-2px] mr-[16px] cursor-pointer align-middle text-sm'
            onClick={() => router.back()}
          />
          <div className='text-3xl text-black'>Billing</div>
          <Tag color='#9DCBFF' className='ml-[16px]'>
            Paid Plan
          </Tag>
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
            Upgrade
          </Button>
          <Button
            type='primary'
            className='ml-[10px] h-[40px] w-[148px] text-sm'
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
            className='ml-[10px] h-[40px] w-[148px] text-sm'
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
