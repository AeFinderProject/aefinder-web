import { Button, Divider, Form, Input } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import React, { useCallback, useState } from 'react';

import Copy from '@/components/Copy';

import { useAppDispatch } from '@/store/hooks';
import { setCurrentAppDetail } from '@/store/slices/appSlice';

import { modifyApp } from '@/api/requestApp';

import { CreateAppResponse } from '@/types/appType';

type CreateAppStep2Props = {
  readonly type: 0 | 1; // 0: create, 1: modify
  readonly currentAppDetail: CreateAppResponse;
  setCreateAppDrawerVisible: (value: boolean) => void;
  readonly messageApi: MessageInstance;
};

export default function CreateAppStep2({
  type,
  currentAppDetail,
  setCreateAppDrawerVisible,
  messageApi,
}: CreateAppStep2Props) {
  const [form] = Form.useForm();
  const FormItem = Form.Item;
  const dispatch = useAppDispatch();
  const [description, setDescription] = useState<string>(
    currentAppDetail.description
  );
  const [sourceCodeUrl, setSourceCodeUrl] = useState<string>(
    currentAppDetail.sourceCodeUrl
  );

  const handleModify = useCallback(async () => {
    const res = await modifyApp({
      appId: currentAppDetail.appId,
      description: description,
      sourceCodeUrl: sourceCodeUrl,
    });
    if (res) {
      messageApi.open({
        type: 'success',
        content: 'edit app success',
      });
      dispatch(setCurrentAppDetail(res));
      setCreateAppDrawerVisible(false);
    }
  }, [
    currentAppDetail.appId,
    setCreateAppDrawerVisible,
    messageApi,
    dispatch,
    description,
    sourceCodeUrl,
  ]);

  return (
    <Form
      form={form}
      layout='vertical'
      className={type === 0 ? 'mt-6' : 'mt-0'}
      onFinish={() => handleModify()}
    >
      <FormItem name='appName' label='App Name'>
        <Copy
          className='relative top-[-6px]'
          content={currentAppDetail?.appName}
          isShowCopy={true}
        />
      </FormItem>
      <FormItem name='appId' label='AppId'>
        <Copy
          className='relative top-[-6px]'
          content={currentAppDetail?.appId}
          isShowCopy={true}
        />
      </FormItem>
      <FormItem
        name='description'
        label='Description'
        initialValue={description}
      >
        <Input
          value={description}
          placeholder='App description'
          className='rounded-md'
          maxLength={500}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormItem>
      <FormItem
        name='sourceCodeUrl'
        label='Repository URL'
        initialValue={sourceCodeUrl}
      >
        <Input
          value={sourceCodeUrl}
          placeholder='App sourceCodeUrl'
          className='rounded-md'
          maxLength={200}
          onChange={(e) => setSourceCodeUrl(e.target.value)}
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
          Save changes
        </Button>
      </FormItem>
    </Form>
  );
}
