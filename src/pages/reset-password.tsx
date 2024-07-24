'use client';
import { Button, Form, Input, message } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useDebounceCallback } from '@/lib/utils';

import { useAppSelector } from '@/store/hooks';

import { queryAuthToken } from '@/api/apiUtils';
import { resetPassword } from '@/api/requestApp';
export default function ResetPassword() {
  const [form] = Form.useForm();
  const router = useRouter();
  const FormItem = Form.Item;
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const username = useAppSelector((state) => state.common.username);

  useEffect(() => {
    const checkAuthToken = async () => {
      await queryAuthToken();
    };
    checkAuthToken();
  }, []);

  const handleResetPassword = useDebounceCallback(async () => {
    const password = form.getFieldValue('password');
    const confirmPassword = form.getFieldValue('confirmPassword');
    // step 1 check password is equal
    if (password !== confirmPassword) {
      messageApi.open({
        type: 'warning',
        content: 'The two inputs of passwords are not equal',
      });
      return;
    }
    // step 2 check password is valid
    const passwordRegExp =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%^&*()_+])[A-Za-z\d~!@#$%^&*()_+]+$/;
    if (!passwordRegExp.test(password)) {
      messageApi.open({
        type: 'warning',
        content:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      });
      return;
    }
    // step 3 reset password
    try {
      setIsShowLoading(true);
      const res = await resetPassword({
        userName: username,
        newPassword: password,
      });
      // res no content
      if (!res) {
        messageApi.open({
          type: 'success',
          content: 'Password reset successfully, please login again',
        });
        setTimeout(() => {
          setIsShowLoading(false);
          router.back();
        }, 1000);
      }
    } finally {
      setIsShowLoading(false);
    }
  }, [form, messageApi, isShowLoading]);

  return (
    <div className='flex h-[80vh] w-full flex-col items-center justify-center pb-10 text-center'>
      {contextHolder}
      <div className='mx-auto w-[380px] sm:w-[450px]'>
        <div className='text-xl'>Reset password</div>
        <div className='border-gray-F0 mt-4 rounded-md border px-[24px] pt-[24px]'>
          <Form
            form={form}
            layout='vertical'
            onFinish={() => handleResetPassword()}
          >
            <FormItem
              name='password'
              label='New password'
              rules={[
                {
                  required: true,
                  message:
                    'Please input your new password by the required format!',
                },
              ]}
            >
              <Input.Password
                placeholder='Password'
                className='rounded-md'
                size='large'
                minLength={6}
              />
            </FormItem>
            <div className='text-gray-80 mb-5 text-left text-xs leading-5'>
              Your password should be at least 6 characters long and include an
              uppercase letter, a lowercase letter, a number, and a special
              character.
            </div>
            <FormItem
              name='confirmPassword'
              label='Repeat new password'
              rules={[
                { required: true, message: 'Please repeat your password!' },
              ]}
            >
              <Input.Password
                placeholder='Password'
                className='rounded-md'
                size='large'
                minLength={6}
              />
            </FormItem>
            <FormItem>
              <Button
                className='mx-auto h-[48px] w-full'
                type='primary'
                htmlType='submit'
                loading={isShowLoading}
              >
                Confirm
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  );
}
