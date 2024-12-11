import { Button, Input, InputNumber, message, Modal, Switch } from 'antd';
import { useCallback, useState } from 'react';

import { addApiKey } from '@/api/requestAPIKeys';

interface CreateApiKeyProps {
  readonly isShowCreateModal: boolean;
  readonly setIsShowCreateModal: (isShowCreateModal: boolean) => void;
}

export default function CreateApiKeyModal({
  isShowCreateModal,
  setIsShowCreateModal,
}: CreateApiKeyProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const [name, setName] = useState('');
  const [isEnableSpendingLimit, setIsEnableSpendingLimit] = useState(false);
  const [spendingLimitValue, setSpendingLimitValue] = useState<number | null>(
    0
  );

  const handleCancel = useCallback(() => {
    setIsShowCreateModal(false);
  }, [setIsShowCreateModal]);

  const onSwitchChange = useCallback((checked: boolean) => {
    setIsEnableSpendingLimit(checked);
  }, []);

  const handleCreateApiKey = useCallback(async () => {
    // step 1 check value, step2 addApiKey
    if (!name) {
      messageApi.info('Please input name!');
      return;
    }
    if (isEnableSpendingLimit && !spendingLimitValue) {
      messageApi.info('Please input spending limit!');
      return;
    }

    const res = await addApiKey({
      name,
      isEnableSpendingLimit,
      spendingLimitUsdt: spendingLimitValue || 0,
    });
    console.log('handleCreateApiKey', res);
    if (res?.id) {
      messageApi.success('Create API key successfully');
      setTimeout(() => {
        setIsShowCreateModal(false);
      }, 1000);
      // reset value when create success
      setName('');
      setIsEnableSpendingLimit(false);
      setSpendingLimitValue(0);
    }
  }, [
    messageApi,
    setIsShowCreateModal,
    name,
    isEnableSpendingLimit,
    spendingLimitValue,
  ]);

  return (
    <Modal
      title=''
      open={isShowCreateModal}
      onCancel={handleCancel}
      footer={false}
      className='p-[50px]'
    >
      {contextHolder}
      <div className='text-dark-normal mb-[4px] mt-[24px] font-medium'>
        Create a New API Key
      </div>
      <div className='text-gray-80 mb-[24px] text-xs leading-5'>
        You can restrict usage of this API Key to specific domains and
        AeIndexers after creations.
      </div>
      <div className='mb-[4px] flex items-center justify-between'>
        <div className='text-dark-normal text-sm font-medium'>API Key Name</div>
        <div className='text-gray-80 text-xs'>{name.length}/30</div>
      </div>
      <Input
        placeholder='Name'
        className='border-gray-E0 w-full rounded-md border'
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={30}
      />
      <div className='my-[24px]'>
        <Switch value={isEnableSpendingLimit} onChange={onSwitchChange} />
        <span className='text-dark-normal ml-[10px] text-sm font-medium'>
          Enable period spending limit
        </span>
      </div>
      <div className='text-dark-normal mb-[4px] text-sm font-medium'>
        Spending Limit
      </div>
      <div className='text-gray-80 mb-[4px] text-xs'>
        Resets monthly with billing period.
      </div>
      <InputNumber
        placeholder='monthly with billing period'
        addonAfter='USDT'
        value={spendingLimitValue}
        disabled={!isEnableSpendingLimit}
        onChange={(value) => setSpendingLimitValue(value)}
        min={0}
      />
      <div className='text-gray-80 mb-[24px] mt-[4px] text-xs'>
        We recommend 20% buffer to prevent unexpected outages.
      </div>
      <Button
        className='w-full'
        size='large'
        type='primary'
        onClick={handleCreateApiKey}
      >
        Create API key
      </Button>
    </Modal>
  );
}
