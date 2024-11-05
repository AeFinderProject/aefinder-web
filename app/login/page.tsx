'use client';
// eslint-disable-next-line
import React, { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

import { Button, Divider, Form, Input, message } from 'antd';

import { useDebounceCallback } from '@/lib/utils';
import { queryAuthApi, resetLocalJWT } from '@/api/apiUtils';

import { useAppDispatch } from '@/store/hooks';
import { setUsername } from '@/store/slices/commonSlice';

import { CurrentTourStepEnum } from '@/types/appType';

import LogInButton from '@/components/wallet/LoginButton';

export default function LogIn() {
  const [form] = Form.useForm();
  const FormItem = Form.Item;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [messageApi, contextHolder] = message.useMessage();
  const currentTourStep = localStorage.getItem('currentTourStep');
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

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
      sessionStorage.setItem('isGuest', 'false');
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
    sessionStorage.setItem('isGuest', 'false');
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

  const handleGuestLogin = useDebounceCallback(async () => {
    setGuestLoading(true);
    // if Guest Login, set isGuest to true
    sessionStorage.setItem('isGuest', 'true');
    await queryAuthApi({
      username: 'Guest',
      password: 'Guest',
    });
    dispatch(setUsername('Guest'));
    setGuestLoading(false);
    router.push('/dashboard');
  }, [setGuestLoading]);

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
              label='Username'
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
              <LogInButton className='mx-auto mb-[16px] h-[48px] w-full md:mr-[2%] md:w-[48%]' />
              <Button
                className='mx-auto h-[48px] w-full md:w-[48%]'
                onClick={handleGuestLogin}
                loading={guestLoading}
              >
                Continue as Guest
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  );
}
