import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { CheckboxProps } from 'antd';
import { Button, Checkbox, Modal, Tag } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import { useCallback, useState } from 'react';

import { useAppSelector } from '@/store/hooks';

import { regenerateApiKey } from '@/api/requestAPIKeys';

interface RegenerateApiKeyModalProps {
  readonly messageApi: MessageInstance;
  readonly isShowRegenerateModal: boolean;
  readonly setIsShowRegenerateModal: (isShowRegenerateModal: boolean) => void;
}

export default function RegenerateApiKeyModal({
  messageApi,
  isShowRegenerateModal,
  setIsShowRegenerateModal,
}: RegenerateApiKeyModalProps) {
  const apikeyDetail = useAppSelector((state) => state.app.apikeyDetail);

  const [isConfirm, setIsConfirm] = useState(false);

  const onCheckboxChange: CheckboxProps['onChange'] = (e) => {
    setIsConfirm(e.target.checked);
  };

  const handleCancel = useCallback(() => {
    setIsShowRegenerateModal(false);
  }, [setIsShowRegenerateModal]);

  const handleRegenerateApiKey = useCallback(async () => {
    if (!isConfirm) {
      return;
    }
    const res = await regenerateApiKey({
      id: apikeyDetail.id,
    });
    if (res?.key) {
      messageApi.success('Regenerate API Key successfully');
      setTimeout(() => {
        setIsShowRegenerateModal(false);
      }, 1000);
    }
  }, [messageApi, setIsShowRegenerateModal, isConfirm, apikeyDetail]);

  return (
    <Modal
      title=''
      open={isShowRegenerateModal}
      onCancel={handleCancel}
      width={475}
      className='p-[50px]'
      destroyOnClose
      footer={false}
    >
      <div className='text-dark-normal my-[24px] font-medium'>
        Regenerate API Key
      </div>
      <Tag
        icon={<ExclamationCircleOutlined className='relative top-[-3px]' />}
        className='text-danger-normal bg-danger-bg border-danger-normal mb-[8px] border'
      >
        Attention
      </Tag>
      <div className='text-gray-80 mb-[24px] text-xs leading-5'>
        Regenerating on API Key will require updates to all apps where it is
        being used. The old key will stop working immediately and this action
        cannot be undone.
      </div>
      <div className='border-gray-E0 mb-[4px] rounded-md border p-[12px]'>
        <div className='text-danger-normal text-sm'>{apikeyDetail.name}</div>
        <div className='text-dark-normal'>{apikeyDetail.key}</div>
      </div>
      <div className='my-[24px]'>
        <Checkbox value={isConfirm} onChange={onCheckboxChange}>
          <span className='text-gray-80 text-xs'>
            I confirm I want to regenerate this API key.
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
          onClick={handleRegenerateApiKey}
          disabled={!isConfirm}
        >
          Regenerate
        </Button>
      </div>
    </Modal>
  );
}
