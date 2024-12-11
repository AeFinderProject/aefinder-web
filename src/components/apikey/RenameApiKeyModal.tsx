import { Button, Input, Modal } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import { useCallback, useState } from 'react';

import { useAppSelector } from '@/store/hooks';

import { renameApiKey } from '@/api/requestAPIKeys';

interface RenameApiKeyModalProps {
  readonly messageApi: MessageInstance;
  readonly isShowRenameModal: boolean;
  readonly setIsShowRenameModal: (isShowRenameModal: boolean) => void;
}

export default function RenameApiKeyModal({
  messageApi,
  isShowRenameModal,
  setIsShowRenameModal,
}: RenameApiKeyModalProps) {
  const apikeyDetail = useAppSelector((state) => state.app.apikeyDetail);

  const [apiKeyName, setApiKeyName] = useState('');

  const handleCancel = useCallback(() => {
    setIsShowRenameModal(false);
  }, [setIsShowRenameModal]);

  const handleRenameApiKey = useCallback(async () => {
    // step 1 check apiKeyName, step 2 renameApiKey
    if (!apiKeyName) {
      messageApi.open({
        type: 'info',
        content: 'Please input api key name',
        duration: 3,
      });
      return;
    }

    const res = await renameApiKey({
      id: apikeyDetail.id,
      name: apiKeyName,
    });
    if (res) {
      messageApi.success('Rename API key successfully');
      // have time to close modal
      setTimeout(() => {
        setIsShowRenameModal(false);
      }, 1000);
      setApiKeyName('');
    }
  }, [messageApi, setIsShowRenameModal, apiKeyName, apikeyDetail]);

  return (
    <Modal
      title=''
      open={isShowRenameModal}
      onCancel={handleCancel}
      width={475}
      className='p-[50px]'
      destroyOnClose
      footer={false}
    >
      <div className='text-dark-normal my-[24px] font-medium'>
        Rename API Key
      </div>
      <div className='border-gray-E0 mb-[4px] rounded-md border p-[12px]'>
        <div className='text-gray-80 text-sm'>{apikeyDetail.name}</div>
        <div className='text-dark-normal'>{apikeyDetail?.key}</div>
      </div>
      <div className='text-gray-80 mb-[24px] text-xs'>
        Changing the name of your API Key will not disrupt usage
      </div>
      <div className='mb-[4px] flex items-center justify-between'>
        <div className='text-dark-normal text-sm font-medium'>API Key Name</div>
        <div className='text-gray-80 text-xs'>{apiKeyName?.length}/30</div>
      </div>
      <Input
        placeholder='API Key Name'
        className='border-gray-E0 w-full rounded-md border'
        value={apiKeyName}
        onChange={(e) => setApiKeyName(e.target.value)}
        maxLength={30}
      />
      <div className='mt-[24px] flex items-center  justify-between'>
        <Button className='w-[48%]' size='large' onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          className='w-[48%]'
          size='large'
          type='primary'
          onClick={handleRenameApiKey}
        >
          Update
        </Button>
      </div>
    </Modal>
  );
}
