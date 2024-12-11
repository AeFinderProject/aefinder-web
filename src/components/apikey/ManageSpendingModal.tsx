import { Button, InputNumber, Modal, Switch } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import { useCallback, useState } from 'react';

import { useAppSelector } from '@/store/hooks';

import { setSpendingLimit } from '@/api/requestAPIKeys';

interface ManageSpendingProps {
  readonly messageApi: MessageInstance;
  readonly isShowManageSpendingModal: boolean;
  readonly setIsShowManageSpendingModal: (
    isShowManageSpendingModal: boolean
  ) => void;
}

export default function ManageSpendingModal({
  messageApi,
  isShowManageSpendingModal,
  setIsShowManageSpendingModal,
}: ManageSpendingProps) {
  const apikeyDetail = useAppSelector((state) => state.app.apikeyDetail);

  const [currentIsEnableSpendingLimit, setCurrentIsEnableSpendingLimit] =
    useState(apikeyDetail.isEnableSpendingLimit);
  const [currentSpendingLimit, setCurrentSpendingLimit] = useState<
    number | null
  >(apikeyDetail.spendingLimitUsdt);

  const handleCancel = useCallback(() => {
    setIsShowManageSpendingModal(false);
  }, [setIsShowManageSpendingModal]);

  const handleSwitchChange = useCallback((checked: boolean) => {
    setCurrentIsEnableSpendingLimit(checked);
  }, []);

  const handleManageSpendingApiKey = useCallback(async () => {
    const res = await setSpendingLimit({
      id: apikeyDetail.id,
      isEnableSpendingLimit: currentIsEnableSpendingLimit,
      spendingLimitUsdt: currentSpendingLimit || 0,
    });
    if (res) {
      messageApi.success('API Key setSpendingLimit successfully');
      setTimeout(() => {
        setIsShowManageSpendingModal(false);
      }, 500);
    }
  }, [
    messageApi,
    setIsShowManageSpendingModal,
    apikeyDetail,
    currentIsEnableSpendingLimit,
    currentSpendingLimit,
  ]);

  return (
    <Modal
      title=''
      open={isShowManageSpendingModal}
      onCancel={handleCancel}
      width={475}
      footer={false}
      className='p-[50px]'
    >
      <div className='text-gray-80 mt-[24px] text-xs'>test</div>
      <div className='text-dark-normal my-[4px] font-medium'>
        Manage Spending Limit
      </div>
      <div className='text-gray-80 mb-[24px] text-xs leading-5'>
        When the period cost of the queries reaches the spending limit for this
        API Key, new queries will be blocked.
      </div>
      <div className='border-gray-E0 mb-[24px] flex items-center justify-between rounded-md border p-[12px]'>
        <div>
          <div className='text-gray-80 text-xs'>Period Cost</div>
          <div className='text-dark-normal text-sm'>- USD</div>
        </div>
        <div className='border-gray-D6 border-l pl-[30px]'>
          <div className='text-gray-80 text-xs'>Renews in</div>
          <div className='text-dark-normal text-sm'>23 Days</div>
        </div>
        <div></div>
      </div>
      <div className='my-[24px]'>
        <Switch
          defaultValue={currentIsEnableSpendingLimit}
          onChange={(e) => handleSwitchChange(e)}
        />
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
        value={currentSpendingLimit}
        placeholder='monthly with billing period'
        addonAfter='USDT'
        min={0}
        disabled={!currentIsEnableSpendingLimit}
        onChange={(value) => setCurrentSpendingLimit(value)}
      />
      <div className='text-gray-80 mb-[24px] mt-[4px] text-xs'>
        We recommend 20% buffer to prevent unexpected outages.
      </div>
      <div className='mt-[24px] flex items-center  justify-between'>
        <Button className='w-[48%]' size='large' onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          className='w-[48%]'
          size='large'
          type='primary'
          onClick={handleManageSpendingApiKey}
        >
          Update
        </Button>
      </div>
    </Modal>
  );
}
