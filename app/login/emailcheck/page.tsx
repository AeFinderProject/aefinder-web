'use client';

import { LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useEffectOnce } from 'react-use';

import { useThrottleCallback } from '@/lib/utils';

import { emailVerification } from '@/api/requestApp';

export default function EmailCheck() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [currentStatus, setCurrentStatus] = useState('loading');

  const code = searchParams.get('code');

  const checkEmailVerification = useThrottleCallback(async () => {
    if (!code) return;
    const res = await emailVerification({ code });
    if (res) {
      setCurrentStatus('success');
      setTimeout(() => {
        router.push('/login');
      }, 60000);
    } else {
      setCurrentStatus('fail');
    }
  }, [code]);

  useEffectOnce(() => {
    checkEmailVerification();
  });

  return (
    <div className='px-[16px] pb-[40px] sm:px-[40px]'>
      {currentStatus === 'loading' && (
        <div className='mt-[80px] flex flex-col items-center justify-center'>
          <LoadingOutlined className='text-gray-80 text-[40px]' />
        </div>
      )}
      {currentStatus === 'success' && (
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/assets/svg/success.svg'
            alt='success'
            width={162}
            height={120}
            className='mb-[48px] mt-[80px]'
          />
          <div className='text-dark-normal mb-[16px] text-center text-[20px] font-medium'>
            Email Verification Successful
          </div>
          <div className='text-gray-80 text-center'>
            You'll be automatically redirected to the login page in 60 seconds.
          </div>
        </div>
      )}
      {currentStatus === 'fail' && (
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/assets/svg/failed.svg'
            alt='failed'
            width={120}
            height={120}
            className='mb-[48px] mt-[80px]'
          />
          <div className='text-dark-normal mb-[16px] text-center text-[20px] font-medium'>
            Email Verification Failed
          </div>
          <div className='text-gray-80 text-center'>
            We couldn't verify your email. Please try again or contact support
            for assistance.
          </div>
        </div>
      )}
    </div>
  );
}
