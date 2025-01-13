'use client';
// eslint-disable-next-line
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { TWalletInfo } from '@aelf-web-login/wallet-adapter-base';

import { Button, Divider, Form, Input, message } from 'antd';

import { useDebounceCallback } from '@/lib/utils';
import { queryAuthApi, resetLocalJWT } from '@/api/apiUtils';

import { CurrentTourStepEnum } from '@/types/appType';

import LogInButton from '@/components/wallet/LoginButton';

export default function LogIn() {
  const [form] = Form.useForm();
  const FormItem = Form.Item;
  const router = useRouter();
  const pathname = usePathname();
  const [messageApi, contextHolder] = message.useMessage();
  const currentTourStep = localStorage.getItem('currentTourStep');
  const [loading, setLoading] = useState(false);

  const { walletInfo, isConnected } = useConnectWallet();

  const walletInfoRef = useRef<TWalletInfo>();
  walletInfoRef.current = walletInfo;
  const isConnectedRef = useRef<boolean>();
  isConnectedRef.current = isConnected;

  const initialTourValues = useCallback(() => {
    // check first isTourDashboard isTourCreateApp isTourHaveCreateApp
    if (currentTourStep === null) {
      localStorage.setItem('currentTourStep', CurrentTourStepEnum.InitTour);
    }
  }, [currentTourStep]);

  useEffect(() => {
    // clear localStorage jwt
    if (pathname === '/login') {
      resetLocalJWT();
      initialTourValues();
    }
  }, [pathname, initialTourValues]);

  const loginSuccessActive = useCallback(() => {
    messageApi.open({
      type: 'success',
      content: 'login success',
    });
    router.push('/dashboard');
  }, [router, messageApi]);

  const handleLogin = useDebounceCallback(async () => {
    setLoading(true);
    try {
      const res = await queryAuthApi({
        username: form.getFieldValue('username'),
        password: form.getFieldValue('password'),
      });
      if (res?.access_token) {
        loginSuccessActive();
      } else {
        messageApi.open({
          type: 'error',
          content: 'Wrong user name or password, please retry',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  return (
    <div className='flex w-full flex-col items-center justify-center pb-10 text-center'>
      {contextHolder}
      <Image
        src='/assets/svg/login-logo.svg'
        alt='logo'
        width={240}
        height={240}
        className='sm:h-[320px] sm:w-[320px]'
      />
      <div className='mx-auto w-[342px] sm:w-[442px]'>
        <div className='text-xl'>Welcome, please sign in to continue</div>
        <div className='border-gray-F0 mt-4 rounded-md border px-[24px] pt-[24px]'>
          <Form form={form} layout='vertical' onFinish={() => handleLogin()}>
            <FormItem
              name='username'
              label='User name or email'
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input placeholder='User name' className='rounded-md' />
            </FormItem>
            <FormItem
              name='password'
              label='Password'
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input
                placeholder='Password'
                type='password'
                className='rounded-md'
              />
            </FormItem>
            <FormItem>
              <Button
                className='mx-auto h-[48px] w-full'
                type='primary'
                htmlType='submit'
                loading={loading}
              >
                Sign In
              </Button>
            </FormItem>
            <Divider style={{ color: '#808080', fontSize: '12px' }}>OR</Divider>
            <FormItem>
              <LogInButton className='mx-auto h-[48px] w-full' />
            </FormItem>
            <div className='mb-[16px]'>
              Don’t have an account yet?
              <span
                className='text-blue-link cursor-pointer font-medium'
                onClick={() => router.push('/login/signup')}
              >
                {' '}
                Sign up
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
