'use client';
import { Button, Form, Input, message } from 'antd';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect } from 'react';

import { useDebounceCallback } from '@/lib/utils';

import { useAppDispatch } from '@/store/hooks';
import { setUsername } from '@/store/slices/commonSlice';

import { queryAuthApi, resetLocalJWT } from '@/api/apiUtils';

export default function LogIn() {
  const [form] = Form.useForm();
  const FormItem = Form.Item;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    // clear localStorage jwt
    if (pathname === '/login') {
      resetLocalJWT();
    }
  }, [pathname]);

  const loginSuccessActive = useCallback(() => {
    dispatch(setUsername(form.getFieldValue('username')));
    messageApi.open({
      type: 'success',
      content: 'login success',
    });
    router.push('/dashboard');
  }, [dispatch, form, router, messageApi]);

  const handleLogin = useDebounceCallback(async () => {
    const res = await queryAuthApi({
      username: form.getFieldValue('username'),
      password: form.getFieldValue('password'),
    });
    if (res.access_token) {
      loginSuccessActive();
    } else {
      messageApi.open({
        type: 'error',
        content: 'Wrong user name or password, please retry',
      });
    }
  }, []);

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
              >
                Sign In
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  );
}
