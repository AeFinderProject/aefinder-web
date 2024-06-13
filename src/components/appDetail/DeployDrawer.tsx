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
    } else {
      messageApi.open({
        type: 'error',
        content: 'Deploy Failed',
        duration: 1,
      });
    }
  }, [
    form,
    currentAppDetail?.appId,
    currentAppDetail?.deployKey,
    messageApi,
    setDeployDrawerVisible,
  ]);

  const handleUpdate = useCallback(async () => {
    // type === 1 update deploy  Manifest
    const Manifest = form.getFieldValue('Manifest');
    const Code = form.getFieldValue('code') && form.getFieldValue('code')[0];
    // check value not null both
    if (!Manifest && !Code) {
      messageApi.open({
        type: 'info',
        content: 'Please update Manifest or Code',
        duration: 3,
      });
      return;
    }

    if (Manifest && !isValidJSON(Manifest)) {
      messageApi.open({
        type: 'info',
        content: 'Manifest need JSON',
        duration: 3,
      });
      return;
    }

    if (Manifest) {
      setDeployLoading(true);
      const haveUpdateManifestOk = await updateSubscription({
        appId: currentAppDetail?.appId,
        deployKey: currentAppDetail?.deployKey || '',
        version: version || '',
        Manifest: form.getFieldValue('Manifest'),
      });
      setDeployLoading(false);
      if (haveUpdateManifestOk) {
        messageApi.open({
          type: 'success',
          content: 'Update Manifest Successfully',
          duration: 2,
        });
        setDeployDrawerVisible(false);
      } else {
        messageApi.open({
          type: 'error',
          content: 'Update Manifest Failed',
          duration: 2,
        });
      }
    }

    // type === 1 update deploy Code
    if (Code) {
      setDeployLoading(true);
      const haveUpdateCodeOk = await updateCode({
        appId: currentAppDetail?.appId,
        deployKey: currentAppDetail?.deployKey || '',
        version: version || '',
        Code: Code,
      });
      setDeployLoading(false);
      if (haveUpdateCodeOk) {
        messageApi.open({
          type: 'success',
          content: 'Update Code Successfully',
          duration: 1,
        });
        setDeployDrawerVisible(false);
      } else {
        messageApi.open({
          type: 'error',
          content: 'Update Code Failed',
          duration: 1,
        });
      }
    }
  }, [
    version,
    currentAppDetail?.appId,
    currentAppDetail?.deployKey,
    messageApi,
    setDeployDrawerVisible,
    form,
  ]);

  const beforeUpload = async (e: File) => {
    if (e.size > 50 * 1024 * 1024) {
      messageApi.open({
        type: 'error',
        content:
          'File upload failed. Please choose a file within the size limit.',
      });
      return false;
    }
  };

  return (
    <Drawer
      title={title}
      open={deployDrawerVisible}
      onClose={() => setDeployDrawerVisible(false)}
      closeIcon={null}
      destroyOnClose={true}
      width='80%'
    >
      <Form
        form={form}
        layout='vertical'
        className='mt-6'
        onFinish={() => (type === 0 ? handleDeploy() : handleUpdate())}
      >
        <FormItem
          name='Manifest'
          label='Upload Json'
          rules={[
            { required: type === 0, message: 'Please input upload json!' },
          ]}
        >
          <TextArea
            placeholder='add subscriptions'
            className='rounded'
            autoSize={{ minRows: 8, maxRows: 14 }}
          />
        </FormItem>
        <FormItem
          name='code'
          label='Upload DLL file'
          valuePropName='fileList'
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          }}
          extra='Format supported: DLL. Max size 50MB.'
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
        <FormItem className='text-center'>
          <Button
            size='large'
            className='border-blue-link text-blue-link mr-[4%] w-[48%]'
            onClick={() => setDeployDrawerVisible(false)}
          >
            Cancel
          </Button>
          <Button
            size='large'
            className='w-[48%]'
            type='primary'
            htmlType='submit'
            loading={deployLoading}
          >
            Deploy
          </Button>
        </FormItem>
      </Form>
    </Drawer>
  );
}
