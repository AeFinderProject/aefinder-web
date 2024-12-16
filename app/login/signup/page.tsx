'use client';

import { Button, Form, Input, message } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';

import { useDebounceCallback } from '@/lib/utils';

import { register, resend } from '@/api/requestApp';

export default function Signup() {
  const [form] = Form.useForm();
  const FormItem = Form.Item;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // default step 1 : set up detail, step 2 : verify email
  const [currentStep, setCurrentStep] = useState(1);
  const [currentEmail, setCurrentEmail] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [messageApi, contextHolder] = message.useMessage();

  const handleCountdown = useCallback(() => {
    setCountdown(60);
    const timer = setInterval(() => {
      if (countdown <= 0) {
        clearInterval(timer);
      }
      setCountdown((pre) => pre - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const checkoutFormValue = useCallback(() => {
    const values = form.getFieldsValue();
    const { username, password, repeatPassword, organization } = values;
    const normalRegex = /^[a-zA-Z0-9\-_]*$/;
    if (!normalRegex.test(username)) {
      messageApi.open({
        type: 'warning',
        content:
          'Username can only contain letters, numbers, hyphens, and underscores',
      });
      return false;
    }
    if (password !== repeatPassword) {
      messageApi.open({
        type: 'warning',
        content: 'Password and repeat password must be the same',
      });
      return false;
    }
    const passwordRegExp =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%^&*()_+.])[A-Za-z\d~!@#$%^&*()_+.]+$/;
    if (!passwordRegExp.test(password)) {
      messageApi.open({
        type: 'warning',
        content:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      });
      return;
    }
    if (!normalRegex.test(organization)) {
      messageApi.open({
        type: 'warning',
        content: 'organization format is incorrect',
      });
      return false;
    }
    return true;
  }, [form, messageApi]);

  const handleVerifyEmail = useDebounceCallback(async () => {
    if (!checkoutFormValue()) return;
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      const { username, password, email, organization } = values;

      const res = await register({
        userName: username,
        organizationName: organization,
        password: password,
        email: email,
      });
      if (res) {
        handleCountdown();
        setCurrentEmail(email);
        setCurrentStep(2);
      }
    } finally {
      setLoading(false);
    }
  }, [setLoading, form]);

  const handleResendEmail = useDebounceCallback(async () => {
    setLoading(true);
    try {
      const res = await resend({
        email: currentEmail,
      });
      if (res) {
        messageApi.open({
          type: 'success',
          content: 'email has been sent',
        });
        handleCountdown();
      }
    } finally {
      setLoading(false);
    }
  }, [handleCountdown, checkoutFormValue]);

  return (
    <div className='mt-[80px] flex w-full flex-col items-center justify-center text-center'>
      {contextHolder}
      <div className='mx-auto w-[342px] sm:w-[442px]'>
        <div className='text-xl'>
          {currentStep === 1 && 'Complete your account setup'}
          {currentStep === 2 && 'Verify your email'}
        </div>
        <div className='border-gray-F0 mt-4 rounded-md border px-[24px] pt-[24px]'>
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
                <Input
                  placeholder='User name'
                  className='rounded-md'
                  maxLength={50}
                />
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
                <Input
                  placeholder='Organization name'
                  className='rounded-md'
                  maxLength={50}
                />
              </FormItem>
              <FormItem
                name='password'
                label='Password'
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}
              >
                <Input
                  placeholder='password'
                  type='password'
                  className='rounded-md'
                  minLength={8}
                  maxLength={50}
                />
              </FormItem>
              <FormItem
                name='repeatPassword'
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
                  minLength={8}
                  maxLength={50}
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
                <span className='text-blue-link'> {currentEmail} </span>. Please
                check your email to complete the process.
              </div>
              <FormItem>
                <Button
                  className='mx-auto h-[48px] w-full'
                  disabled={countdown > 0}
                  onClick={() => handleResendEmail()}
                  loading={loading}
                  type='primary'
                >
                  {countdown > 0
                    ? `Resend in ${countdown}s`
                    : 'Resend verification email'}
                </Button>
              </FormItem>
              <FormItem>
                <Button
                  className='mx-auto h-[48px] w-full'
                  type='default'
                  onClick={() => router.push('/login')}
                >
                  Return Login
                </Button>
              </FormItem>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
