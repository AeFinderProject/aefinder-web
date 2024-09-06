import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { Button, Collapse, Divider, Drawer, Form, Input, Upload } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import { RcFile } from 'antd/es/upload/interface';
import { useCallback, useEffect, useState } from 'react';

import { isValidJSON } from '@/lib/utils';

import { useAppSelector } from '@/store/hooks';

import {
  addSubscription,
  getSubscriptionsAttachments,
  updateCode,
  updateSubscription,
  updateSubscriptionAttachments,
} from '@/api/requestSubscription';

type DeployDrawerProps = {
  readonly type: 0 | 1; // 0: deploy, 1: modify
  readonly title: string;
  readonly version?: string;
  readonly deployDrawerVisible: boolean;
  readonly setDeployDrawerVisible: (visible: boolean) => void;
  readonly messageApi: MessageInstance;
};

const TextArea = Input.TextArea;
const Panel = Collapse.Panel;

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
  const [additionalJSONFileListLoading, setAdditionalJSONFileListLoading] =
    useState<boolean>(false);
  const [additionalJSONFileList, setAdditionalJSONFileList] = useState<
    UploadFile[]
  >([]);
  const [attachmentDeleteFileKeyList, setAttachmentDeleteFileKeyList] =
    useState<string[]>([]);
  const { currentAppDetail, subscriptions, currentVersion } = useAppSelector(
    (state) => state.app
  );

  useEffect(() => {
    let defaultManifest = '';
    if (subscriptions?.currentVersion?.version === currentVersion) {
      defaultManifest = JSON.stringify(
        subscriptions?.currentVersion?.subscriptionManifest,
        null,
        2
      );
    } else if (subscriptions?.pendingVersion?.version === currentVersion) {
      defaultManifest = JSON.stringify(
        subscriptions?.pendingVersion?.subscriptionManifest,
        null,
        2
      );
    }

    if (type) {
      form.setFieldsValue({
        Manifest: defaultManifest,
      });
    }
  }, [currentVersion, subscriptions, form, type]);

  const getAttachments = useCallback(async () => {
    const response = await getSubscriptionsAttachments({
      appId: currentAppDetail?.appId,
      deployKey: currentAppDetail?.deployKey || '',
      version: currentVersion ?? '',
    });

    // set additionalJSONFileList
    const temp = response?.map((item) => {
      return {
        uid: item.fileKey,
        name: item.fileName,
        size: item.fileSize,
      } as UploadFile;
    });
    setAdditionalJSONFileList(temp);
  }, [currentAppDetail?.appId, currentAppDetail?.deployKey, currentVersion]);

  useEffect(() => {
    if (type === 1) {
      getAttachments();
    }
  }, [currentVersion, type, getAttachments]);

  const handleDeploy = useCallback(async () => {
    // type === 0 create deploy
    messageApi.open({
      type: 'loading',
      content: 'Deploying...',
      duration: 2,
    });
    try {
      setDeployLoading(true);
      const haveOk = await addSubscription({
        appId: currentAppDetail?.appId,
        deployKey: currentAppDetail?.deployKey || '',
        Manifest: form.getFieldValue('Manifest'),
        Code: form.getFieldValue('code')[0],
        additionalJSONFileList: additionalJSONFileList,
      });
      setDeployLoading(false);
      if (haveOk) {
        messageApi.open({
          type: 'success',
          content: 'Deploy Successfully',
          duration: 1,
        });
        setDeployDrawerVisible(false);
        setAdditionalJSONFileList([]);
        setAttachmentDeleteFileKeyList([]);
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
    setAdditionalJSONFileList,
    setAttachmentDeleteFileKeyList,
    additionalJSONFileList,
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
        version: version ?? '',
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

  const beforeUpload = useCallback(
    (e: File) => {
      if (e.size > 12 * 1024 * 1024) {
        messageApi.open({
          type: 'error',
          content:
            'File upload failed. Please choose a file within the size limit.',
        });
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    [messageApi]
  );

  const handleUpdateCode = useCallback(async () => {
    const Code = form.getFieldValue('code') && form.getFieldValue('code')[0];
    const isGuest = sessionStorage.getItem('isGuest');
    const tempAdditionalJSONFileList = additionalJSONFileList?.filter(
      (file) => {
        if (isGuest) {
          // if isGuest -> upload all
          return true;
        }
        return file?.uid?.startsWith('rc-upload');
      }
    );
    const tempAttachmentDeleteFileKeyList =
      attachmentDeleteFileKeyList.join(',');
    // check code tempAdditionalJSONFileList tempAttachmentDeleteFileKeyList value not null
    if (
      !Code &&
      tempAdditionalJSONFileList?.length === 0 &&
      tempAttachmentDeleteFileKeyList === ''
    ) {
      messageApi.open({
        type: 'warning',
        content: 'Please update Code or Attachment',
        duration: 3,
      });
      return;
    }

    if (Code && Code?.size > 12 * 1024 * 1024) {
      messageApi.open({
        type: 'error',
        content:
          'File upload failed. Please choose a file within the size limit.',
      });
      return;
    }

    try {
      setUpdateCodeLoading(true);
      const haveUpdateCodeOk = await updateCode({
        appId: currentAppDetail?.appId,
        deployKey: currentAppDetail?.deployKey || '',
        version: version ?? '',
        Code: Code,
        additionalJSONFileList: tempAdditionalJSONFileList,
        AttachmentDeleteFileKeyList: tempAttachmentDeleteFileKeyList,
      });
      setUpdateCodeLoading(false);
      if (haveUpdateCodeOk) {
        messageApi.open({
          type: 'success',
          content: 'Update Code Successfully',
          duration: 3,
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
    additionalJSONFileList,
    attachmentDeleteFileKeyList,
  ]);

  const additionalJSONBeforeUpload = useCallback(
    (e: RcFile) => {
      // single file size  check < 120M
      if (e.size > 120 * 1024 * 1024) {
        messageApi.open({
          type: 'error',
          content:
            'File upload failed. Please choose a file within the size limit 120M.',
          duration: 3,
        });
        return Upload.LIST_IGNORE;
      }
      // check all file: the total maximum size is 120M.
      // let totalSize = e.size;
      // additionalJSONFileList.forEach((item) => {
      //   if (item.uid?.startsWith('rc-upload')) {
      //     totalSize += item?.size || 0;
      //   }
      // });
      // if (totalSize > 120 * 1024 * 1024) {
      //   messageApi.open({
      //     type: 'error',
      //     content:
      //       'File upload failed. Please choose a file within the size limit 120M.',
      //     duration: 3,
      //   });
      //   return Upload.LIST_IGNORE;
      // }
      // name check
      const regRule = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
      if (!regRule.test(e.name.split('.')[0])) {
        messageApi.open({
          type: 'error',
          content: 'File upload failed. Please choose a valid file name.',
          duration: 3,
        });
        return Upload.LIST_IGNORE;
      }
      // the same name will be covered
      const index = additionalJSONFileList.findIndex(
        (item) => item.name === e.name
      );
      // delete have uploaded attachment
      if (
        additionalJSONFileList[index]?.uid &&
        !additionalJSONFileList[index]?.uid.startsWith('rc-upload')
      ) {
        setAttachmentDeleteFileKeyList([
          ...attachmentDeleteFileKeyList,
          additionalJSONFileList[index]?.uid,
        ]);
      }
      if (index !== -1) {
        setAdditionalJSONFileList(
          additionalJSONFileList.filter((item) => {
            return item.name !== e.name;
          })
        );
      }

      return false;
    },
    [
      messageApi,
      additionalJSONFileList,
      setAdditionalJSONFileList,
      attachmentDeleteFileKeyList,
    ]
  );

  const handleAdditionalJSONChange = useCallback(
    (file: UploadFile, fileList: UploadFile[]) => {
      if (file.status === 'done') {
        messageApi.open({
          type: 'info',
          content: 'JSON have uploaded to Local stage',
          duration: 3,
        });
      }
      setAdditionalJSONFileList(fileList);
    },
    [messageApi]
  );

  const handleDeleteAdditionalJSON = useCallback(
    (file: UploadFile) => {
      setAdditionalJSONFileList(
        additionalJSONFileList.filter((item) => item.name !== file.name)
      );
      // delete have uploaded attachment
      if (!file.uid.startsWith('rc-upload')) {
        setAttachmentDeleteFileKeyList([
          ...attachmentDeleteFileKeyList,
          file.uid,
        ]);
      }
    },
    [
      additionalJSONFileList,
      attachmentDeleteFileKeyList,
      setAttachmentDeleteFileKeyList,
    ]
  );

  const handleAttachmentUpdate = useCallback(async () => {
    try {
      setAdditionalJSONFileListLoading(true);
      const res = await updateSubscriptionAttachments({
        appId: currentAppDetail?.appId,
        deployKey: currentAppDetail?.deployKey || '',
        version: currentVersion ?? '',
        additionalJSONFileList: additionalJSONFileList,
        attachmentDeleteFileKeyList: attachmentDeleteFileKeyList.join(','),
      });
      if (res) {
        messageApi.open({
          type: 'success',
          content: 'Update attachment successfully',
          duration: 3,
        });
        setDeployDrawerVisible(false);
        setAdditionalJSONFileList([]);
        setAttachmentDeleteFileKeyList([]);
      }
    } finally {
      setAdditionalJSONFileListLoading(false);
    }
  }, [
    currentAppDetail?.appId,
    currentAppDetail?.deployKey,
    currentVersion,
    messageApi,
    setDeployDrawerVisible,
    additionalJSONFileList,
    setAdditionalJSONFileList,
    attachmentDeleteFileKeyList,
    setAttachmentDeleteFileKeyList,
  ]);

  return (
    <Drawer
      title={title}
      open={deployDrawerVisible}
      onClose={() => setDeployDrawerVisible(false)}
      destroyOnClose={true}
      width={window?.innerWidth > 640 ? '80%' : 640}
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
            placeholder='Add subscriptions'
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
        <Collapse defaultActiveKey={[]} size='small'>
          <Panel header='Attachment upload' key='1'>
            <FormItem
              name='additionalJSON'
              label=''
              valuePropName='fileList'
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              }}
              extra='Format supported: JSON. Max size 120MB.'
            >
              <div className='relative flex'>
                <Upload
                  listType='text'
                  accept='.json'
                  beforeUpload={additionalJSONBeforeUpload}
                  maxCount={5}
                  fileList={additionalJSONFileList}
                  onChange={({ file, fileList }) =>
                    handleAdditionalJSONChange(file, fileList)
                  }
                  onRemove={(file) => handleDeleteAdditionalJSON(file)}
                  className='mt-[10px] w-[300px]'
                >
                  <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
                <span className='absolute left-[170px] top-[16px] ml-[8px] text-[14px] text-gray-400'>
                  {additionalJSONFileList?.length ?? 0}/5 upload limit
                </span>
              </div>
            </FormItem>
            {type === 1 && (
              <Button
                size='large'
                className='hidden w-[180px]'
                type='primary'
                loading={additionalJSONFileListLoading}
                onClick={() => handleAttachmentUpdate()}
              >
                Update Attachment
              </Button>
            )}
          </Panel>
        </Collapse>
        {type === 1 && (
          <FormItem>
            <Button
              size='large'
              className='mt-[20px] w-[180px]'
              type='primary'
              loading={updateCodeLoading}
              onClick={() => handleUpdateCode()}
            >
              Update code
            </Button>
          </FormItem>
        )}
        <Divider />
        <FormItem>
          {type === 0 && (
            <Button
              size='large'
              className='border-blue-link text-blue-link mr-[10px] w-[100px] sm:w-[180px]'
              onClick={() => setDeployDrawerVisible(false)}
            >
              Cancel
            </Button>
          )}
          {type === 0 && (
            <Button
              size='large'
              className='w-[100px] sm:w-[180px]'
              type='primary'
              htmlType='submit'
              loading={deployLoading}
            >
              Deploy
            </Button>
          )}
        </FormItem>
      </Form>
    </Drawer>
  );
}
