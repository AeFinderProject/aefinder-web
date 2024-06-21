import { UploadOutlined } from '@ant-design/icons';
import { Button, Divider, Drawer, Form, Input, Upload } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import { useCallback, useState } from 'react';

import { isValidJSON } from '@/lib/utils';

import { useAppSelector } from '@/store/hooks';

import {
  addSubscription,
  updateCode,
  updateSubscription,
} from '@/api/requestSubscription';

type DeployDrawerProps = {
  type: 0 | 1; // 0: deploy, 1: modify
  title: string;
  version?: string;
  deployDrawerVisible: boolean;
  setDeployDrawerVisible: (visible: boolean) => void;
  messageApi: MessageInstance;
};

const TextArea = Input.TextArea;

export default function DeployDrawer({
  type,
  title,
  version,
  deployDrawerVisible,
  setDeployDrawerVisible,
  messageApi,
}: DeployDrawerProps) {
  const [form] = Form.useForm();
  const FormItem = Form.Item;
  const [deployLoading, setDeployLoading] = useState<boolean>(false);
  const [updateManifestLoading, setUpdateManifestLoading] =
    useState<boolean>(false);
  const [updateCodeLoading, setUpdateCodeLoading] = useState<boolean>(false);
  const currentAppDetail = useAppSelector(
    (state) => state.app.currentAppDetail
  );

  const handleDeploy = useCallback(async () => {
    // type === 0 create deploy
    messageApi.open({
      type: 'loading',
      content: 'Deploying...',
      duration: 1,
    });
    try {
      setDeployLoading(true);
      const haveOk = await addSubscription({
        appId: currentAppDetail?.appId,
        deployKey: currentAppDetail?.deployKey || '',
        Manifest: form.getFieldValue('Manifest'),
        Code: form.getFieldValue('code')[0],
      });
      setDeployLoading(false);
      if (haveOk) {
        messageApi.open({
          type: 'success',
          content: 'Deploy Successfully',
          duration: 1,
        });
        setDeployDrawerVisible(false);
      }
    } catch (error) {
      console.log(error);
      setDeployLoading(false);
    }
  }, [
    form,
    currentAppDetail?.appId,
    currentAppDetail?.deployKey,
    messageApi,
    setDeployDrawerVisible,
  ]);

  const handleUpdateManifest = useCallback(async () => {
    // type === 1 update deploy  Manifest
    const Manifest = form.getFieldValue('Manifest');
    if (!Manifest) {
      messageApi.open({
        type: 'warning',
        content: 'Please update Manifest',
        duration: 3,
      });
      return;
    }

    if (Manifest && !isValidJSON(Manifest)) {
      messageApi.open({
        type: 'warning',
        content: 'Manifest need JSON',
        duration: 3,
      });
      return;
    }

    try {
      setUpdateManifestLoading(true);
      const haveUpdateManifestOk = await updateSubscription({
        appId: currentAppDetail?.appId,
        deployKey: currentAppDetail?.deployKey || '',
        version: version || '',
        Manifest: form.getFieldValue('Manifest'),
      });
      setUpdateManifestLoading(false);
      if (haveUpdateManifestOk) {
        messageApi.open({
          type: 'success',
          content: 'Update Manifest Successfully',
          duration: 2,
        });
        setDeployDrawerVisible(false);
      }
    } catch (error) {
      console.log(error);
      setUpdateManifestLoading(false);
    }
  }, [
    form,
    currentAppDetail?.appId,
    currentAppDetail?.deployKey,
    messageApi,
    setDeployDrawerVisible,
    version,
  ]);

  const beforeUpload = (e: File) => {
    if (e.size > 12 * 1024 * 1024) {
      messageApi.open({
        type: 'error',
        content:
          'File upload failed. Please choose a file within the size limit.',
      });
      return false;
    }
    return true;
  };

  const handleUpdateCode = useCallback(async () => {
    const Code = form.getFieldValue('code') && form.getFieldValue('code')[0];
    // check code value not null
    if (!Code) {
      messageApi.open({
        type: 'warning',
        content: 'Please update Code',
        duration: 3,
      });
      return;
    }

    if (!beforeUpload(Code)) return;

    try {
      setUpdateCodeLoading(true);
      const haveUpdateCodeOk = await updateCode({
        appId: currentAppDetail?.appId,
        deployKey: currentAppDetail?.deployKey || '',
        version: version || '',
        Code: Code,
      });
      setUpdateCodeLoading(false);
      if (haveUpdateCodeOk) {
        messageApi.open({
          type: 'success',
          content: 'Update Code Successfully',
          duration: 1,
        });
        setDeployDrawerVisible(false);
      }
    } catch (error) {
      console.log(error);
      setUpdateCodeLoading(false);
    }
  }, [
    version,
    currentAppDetail?.appId,
    currentAppDetail?.deployKey,
    messageApi,
    setDeployDrawerVisible,
    form,
  ]);

  return (
    <Drawer
      title={title}
      open={deployDrawerVisible}
      onClose={() => setDeployDrawerVisible(false)}
      destroyOnClose={true}
      width='80%'
    >
      <Form
        form={form}
        layout='vertical'
        className='mt-6'
        onFinish={() => handleDeploy()}
      >
        <FormItem
          name='Manifest'
          label='Upload manifest (JSON)'
          rules={[
            { required: type === 0, message: 'Please input upload Manifest!' },
          ]}
        >
          <TextArea
            placeholder='add subscriptions'
            className='rounded'
            autoSize={{ minRows: 8, maxRows: 14 }}
          />
        </FormItem>
        {type === 1 && (
          <FormItem>
            <Button
              size='large'
              className='w-[180px]'
              type='primary'
              loading={updateManifestLoading}
              onClick={() => handleUpdateManifest()}
            >
              Update manifest
            </Button>
            <Divider />
          </FormItem>
        )}
        <FormItem
          name='code'
          label='Upload code (DLL)'
          valuePropName='fileList'
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          }}
          extra='Format supported: DLL. Max size 12MB.'
          rules={[{ required: type === 0, message: 'Please upload code DLL!' }]}
        >
          <Upload
            listType='text'
            accept='.dll'
            beforeUpload={beforeUpload}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </FormItem>
        <Divider />
        <FormItem>
          {type === 0 && (
            <Button
              size='large'
              className='border-blue-link text-blue-link mr-[10px] w-[180px]'
              onClick={() => setDeployDrawerVisible(false)}
            >
              Cancel
            </Button>
          )}
          {type === 0 && (
            <Button
              size='large'
              className='w-[180px]'
              type='primary'
              htmlType='submit'
              loading={deployLoading}
            >
              Deploy
            </Button>
          )}
          {type === 1 && (
            <Button
              size='large'
              className='w-[180px]'
              type='primary'
              loading={updateCodeLoading}
              onClick={() => handleUpdateCode()}
            >
              Update code
            </Button>
          )}
        </FormItem>
      </Form>
    </Drawer>
  );
}
