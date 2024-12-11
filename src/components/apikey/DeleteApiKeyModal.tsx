import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { CheckboxProps } from 'antd';
import { Button, Checkbox, Modal, Tag } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { useAppSelector } from '@/store/hooks';

import { deleteApiKey } from '@/api/requestAPIKeys';

interface DeleteApiKeyModalProps {
  readonly messageApi: MessageInstance;
  readonly isShowDeleteModal: boolean;
  readonly setIsShowDeleteModal: (isShowDeleteModal: boolean) => void;
}

export default function DeleteApiKeyModal({
  messageApi,
  isShowDeleteModal,
  setIsShowDeleteModal,
}: DeleteApiKeyModalProps) {
  const router = useRouter();

  const apikeyDetail = useAppSelector((state) => state.app.apikeyDetail);

  const [isConfirm, setIsConfirm] = useState(false);

  const onCheckboxChange: CheckboxProps['onChange'] = (e) => {
    setIsConfirm(e.target.checked);
  };

  const handleCancel = useCallback(() => {
    setIsShowDeleteModal(false);
  }, [setIsShowDeleteModal]);

  const handleDeleteApiKey = useCallback(async () => {
    if (!isConfirm) {
      return;
    }
    const res = await deleteApiKey({
      id: apikeyDetail.id,
    });
    if (res) {
      messageApi.success('Delete API Key successfully');
      setTimeout(() => {
        setIsShowDeleteModal(false);
        router.back();
      }, 500);
    }
  }, [messageApi, router, setIsShowDeleteModal, isConfirm, apikeyDetail]);

  return (
    <Modal
      title=''
      open={isShowDeleteModal}
      onCancel={handleCancel}
      width={475}
      className='p-[50px]'
      destroyOnClose
      footer={false}
    >
      <div className='text-dark-normal my-[24px] font-medium'>
        Delete API Key
      </div>
      <Tag
        icon={<ExclamationCircleOutlined className='relative top-[-3px]' />}
        className='text-danger-normal bg-danger-bg border-danger-normal mb-[8px] border'
      >
        Attention
      </Tag>
      <div className='text-gray-80 mb-[24px] text-xs leading-5'>
        Deleted API keys are not recoverable, all queries using this API key
        will stop working immediately. You can still view its query data in your
        dashboard.
      </div>
      <div className='border-gray-E0 mb-[4px] rounded-md border p-[12px]'>
        <div className='text-danger-normal text-sm'>{apikeyDetail?.name}</div>
        <div className='text-dark-normal'>{apikeyDetail?.key}</div>
      </div>
      <div className='my-[24px]'>
        <Checkbox value={isConfirm} onChange={onCheckboxChange}>
          <span className='text-gray-80 text-xs'>
            I understand I will not be able to recover this key.
          </span>
        </Checkbox>
      </div>
      <div className='mt-[24px] flex items-center  justify-between'>
        <Button className='w-[48%]' size='large' onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          className='w-[48%]'
          size='large'
          type='primary'
          onClick={handleDeleteApiKey}
          disabled={!isConfirm}
        >
          Delete API key
        </Button>
      </div>
    </Modal>
  );
}
