'use client';

import {
  TWalletInfo,
  WalletTypeEnum,
} from '@aelf-web-login/wallet-adapter-base';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { Button, Form, Input, message } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useRef, useState } from 'react';

import { useDebounceCallback } from '@/lib/utils';

export default function Signup() {
  const [form] = Form.useForm();
  const FormItem = Form.Item;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // default step 0: connect wallet, step 1 : set up detail, step 2 : verify email
  const [currentStep, setCurrentStep] = useState(0);
  const [countdown, setCountdown] = useState(60);
  const [messageApi, contextHolder] = message.useMessage();

  const { connectWallet, walletInfo, walletType, isConnected } =
    useConnectWallet();

  const walletInfoRef = useRef<TWalletInfo>();
  walletInfoRef.current = walletInfo;
  const walletTypeRef = useRef<WalletTypeEnum>();
  walletTypeRef.current = walletType;
  const isConnectedRef = useRef<boolean>();
  isConnectedRef.current = isConnected;

  const handleCountdown = useCallback(() => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((pre) => pre - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVerifyEmail = useDebounceCallback(async () => {
    setLoading(true);
    try {
      // todo: VerifyEmail api
      handleCountdown();
      setCurrentStep(2);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const connectWalletFirst = useCallback(async () => {
    let res;
    if (!walletInfoRef.current || !walletTypeRef.current) {
      try {
        res = await connectWallet();
        // eslint-disable-next-line
      } catch (error: any) {
        messageApi.open({
          type: 'error',
          content: `${error?.message}` || 'connectWallet error',
        });
      }
    }
    if (res?.address || walletInfoRef.current?.address) {
      messageApi.open({
        type: 'success',
        content: 'connectWallet success',
      });
      setCurrentStep(1);
    }
  }, [connectWallet, messageApi]);

  const handleResendEmail = useCallback(() => {
    handleCountdown();
    // todo: ResendEmail api
  }, [handleCountdown]);

  return (
    <div className='mt-[80px] flex w-full flex-col items-center justify-center text-center'>
      {contextHolder}
      {currentStep === 0 && (
        <Image
          src='/assets/svg/login-logo.svg'
          alt='logo'
          width={240}
          height={240}
          className='sm:h-[320px] sm:w-[320px]'
        />
      )}
      <div className='mx-auto w-[342px] sm:w-[442px]'>
        <div className='text-xl'>
          {currentStep === 0 && 'Connect your wallet to get started'}
          {currentStep === 1 && 'Complete your account setup'}
          {currentStep === 2 && 'Verify your email'}
        </div>
        <div className='border-gray-F0 mt-4 rounded-md border px-[24px] pt-[24px]'>
          {currentStep === 0 && (
            <Form form={form} layout='vertical'>
              <FormItem>
                <Button
                  className='mx-auto h-[48px] w-full'
                  type='primary'
                  loading={loading}
                  onClick={() => connectWalletFirst()}
                >
                  Connect wallet
                </Button>
              </FormItem>
              <div className='mb-[16px]'>
                Already have an account?
                <span
                  className='text-blue-link cursor-pointer font-medium'
                  onClick={() => router.push('/login')}
                >
                  {' '}
                  Log in
                </span>
              </div>
            </Form>
          )}
          {currentStep === 1 && (
            <Form
              form={form}
              layout='vertical'
              onFinish={() => handleVerifyEmail()}
            >
              <FormItem
                name='username'
                label='User name'
                rules={[
                  { required: true, message: 'Please input your user name!' },
                ]}
              >
                <Input placeholder='User name' className='rounded-md' />
              </FormItem>
              <FormItem
                name='organization'
                label='Organization name'
                rules={[
                  {
                    required: true,
                    message: 'Please input your organization name!',
                  },
                ]}
              >
                <Input placeholder='Organization name' className='rounded-md' />
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
              <FormItem
                name='repeat-password'
                label='Repeat password'
                rules={[
                  {
                    required: true,
                    message: 'Please input your password again!',
                  },
                ]}
              >
                <Input
                  placeholder='Password'
                  type='password'
                  className='rounded-md'
                />
              </FormItem>
              <FormItem
                name='email'
                label='Email address'
                rules={[
                  {
                    required: true,
                    message: 'Please input your email address!',
                  },
                ]}
              >
                <Input
                  placeholder='Email address'
                  type='email'
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
                  Verify email
                </Button>
              </FormItem>
            </Form>
          )}
          {currentStep === 2 && (
            <Form form={form} layout='vertical'>
              <div className='mb-[24px] text-left'>
                We've sent a verification email to your inbox at
                <span className='text-blue-link'> username@email.com </span>.
                Please check your email to complete the process.
              </div>
              <FormItem>
                <Button
                  className='mx-auto h-[48px] w-full'
                  disabled={countdown > 0}
                  onClick={() => handleResendEmail()}
                >
                  {countdown > 0
                    ? `Resend in ${countdown}s`
                    : 'Resend verification email'}
                </Button>
              </FormItem>
              <FormItem>
                <Button className='mx-auto h-[48px] w-full' type='primary'>
                  Done
                </Button>
              </FormItem>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
