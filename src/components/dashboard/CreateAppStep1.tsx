import { Button, Divider, Form, Input } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import React, { useCallback } from 'react';

import { createApp } from '@/api/requestApp';

import { CreateAppResponse } from '@/types/appType';

type CreateAppStep1Props = {
  readonly setCurrent: (value: 0 | 1) => void;
  readonly setCreateAppDrawerVisible: (visible: boolean) => void;
  readonly currentAppDetail: CreateAppResponse;
  readonly setCurrentAppDetail: (value: CreateAppResponse) => void;
  readonly messageApi: MessageInstance;
};

export default function CreateAppStep1({
  setCurrent,
  setCreateAppDrawerVisible,
  currentAppDetail,
  setCurrentAppDetail,
  messageApi,
}: CreateAppStep1Props) {
  const [form] = Form.useForm();
  const FormItem = Form.Item;

  const handleCreate = useCallback(async () => {
    // "appName": "My App" // A-Z|a-z|0-9 blank
    const res = await createApp({
      appName: form.getFieldValue('appName'),
    });
    setCurrentAppDetail(res);
    messageApi.open({
      type: 'success',
      content: 'Create AeIndexer success, next edit detail',
    });
    setCurrent(1);
  }, [setCurrent, form, setCurrentAppDetail, messageApi]);

  return (
    <Form
      form={form}
      layout='vertical'
      className='mt-6'
      onFinish={() => handleCreate()}
    >
      <FormItem
        name='appName'
        label='AeIndexer Name'
        rules={[{ required: true, message: 'Please input AeIndexer name!' }]}
      >
        <Input
          value={currentAppDetail?.appName}
          placeholder='AeIndexer name'
          className='rounded-md'
          minLength={2}
          maxLength={20}
        />
      </FormItem>
      <Divider />
      <FormItem className='text-center'>
        <Button
          size='large'
          className='border-blue-link text-blue-link mr-[4%] w-[48%]'
          onClick={() => setCreateAppDrawerVisible(false)}
        >
          Cancel
        </Button>
        <Button
          size='large'
          className='w-[48%]'
          type='primary'
          htmlType='submit'
        >
          Create
        </Button>
      </FormItem>
    </Form>
  );
}
