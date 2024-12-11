'use client';

import { Button, Tag } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
export default function Billing() {
  // const [haveUpgrade, setHaveUpgrade] = useState(true);
  const haveUpgrade = true;
  const router = useRouter();

  return (
    <div className='px-[16px] pb-[40px] sm:px-[40px]'>
      <div className='border-gray-F0 flex h-[120px] items-center justify-between border-b'>
        <div className='flex items-center'>
          <div className='text-3xl text-black'>Billing</div>
          {!haveUpgrade && (
            <Tag color='#9DCBFF' className='ml-[16px]'>
              Free Trial
            </Tag>
          )}
          {haveUpgrade && (
            <Tag color='#9DCBFF' className='ml-[16px]'>
              Paid Plan
            </Tag>
          )}
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
          {!haveUpgrade && (
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
              Upgrade Plan
            </Button>
          )}
          {haveUpgrade && (
            <Button
              type='primary'
              className='ml-[10px] h-[40px] w-[148px] text-sm'
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
              Manage Plan
            </Button>
          )}
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
          With a positive billing balance you are ready to query the network.
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
            window.open('https://docs.aefinder.io/docs/quick-start', '_blank')
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
  );
}
