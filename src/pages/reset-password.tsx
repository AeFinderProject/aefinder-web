'use client';
import { Button, Form, Input, message } from 'antd';

import { useDebounceCallback } from '@/lib/utils';

export default function ResetPassword() {
  const [form] = Form.useForm();
  const FormItem = Form.Item;
  const [messageApi, contextHolder] = message.useMessage();

  const handleResetPassword = useDebounceCallback(async () => {
    // const res = await queryAuthApi({
    //   username: form.getFieldValue('username'),
    //   password: form.getFieldValue('password'),
    // });
    messageApi.open({
      type: 'info',
      content: 'need password, please retry',
    });
  }, []);

  return (
    <div className='flex h-[80vh] w-full flex-col items-center justify-center pb-10 text-center'>
      {contextHolder}
      <div className='mx-auto w-[450px]'>
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
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input placeholder='Password' className='rounded-md' />
              <div className='text-gray-80 mt-3 text-left text-xs leading-5'>
                Your password should be at least 6 characters long and include
                an uppercase letter, a lowercase letter, a number, and a special
                character.
              </div>
            </FormItem>
            <FormItem
              name='password-2'
              label='Repeat new password'
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
                Confirm
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  );
}
