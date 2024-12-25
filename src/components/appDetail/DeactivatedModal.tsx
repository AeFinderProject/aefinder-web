import { Button, Modal } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

import { getPendingBills } from '@/api/requestMarket';

import { PendingBillsItem } from '@/types/marketType';

type DeactivatedModalProps = {
  readonly isShowDeactivatedModal: boolean;
  readonly setIsShowDeactivatedModal: (visible: boolean) => void;
  readonly setIsShowUpdateCapacityModal: (visible: boolean) => void;
  readonly messageApi: MessageInstance;
};

export default function DeactivatedModal({
  isShowDeactivatedModal,
  setIsShowDeactivatedModal,
  setIsShowUpdateCapacityModal,
}: DeactivatedModalProps) {
  const [pendingBills, setPendingBills] = useState<PendingBillsItem[]>([]);

  const getPendingBillsTemp = useCallback(async () => {
    const res = await getPendingBills();
    if (res?.length > 0) {
      setPendingBills(res);
    }
  }, []);

  useEffect(() => {
    getPendingBillsTemp();
  }, [getPendingBillsTemp]);

  const handleClose = useCallback(() => {
    setIsShowDeactivatedModal(false);
  }, [setIsShowDeactivatedModal]);

  const handleShowUpdateCapacity = useCallback(() => {
    setIsShowDeactivatedModal(false);
    if (pendingBills?.length === 0) {
      setIsShowUpdateCapacityModal(true);
    }
  }, [setIsShowDeactivatedModal, setIsShowUpdateCapacityModal, pendingBills]);

  return (
    <Modal
      title=''
      onCancel={handleClose}
      open={isShowDeactivatedModal}
      destroyOnClose
      footer={false}
      width={400}
    >
      <Image
        src='/assets/svg/emergency-yellow.svg'
        alt='emergency-yellow'
        width={49}
        height={48}
        className='mt-[24px]'
      />
      <div className='text-dark-normal my-[16px] text-xl font-medium'>
        {pendingBills?.length === 0
          ? 'AeIndexer Deactivated'
          : 'Await Pending Bill Finish'}
      </div>
      <div className='text-gray-80'>
        {pendingBills?.length === 0
          ? `Your AeIndexer is currently deactivated due to insufficient balance. To
            reactivate your AeIndexer and continue enjoying our services, please add
            funds to your Billing Balance.`
          : 'There have pending bill, please await finish plan first, thank you'}
      </div>
      <div className='mt-[24px] flex justify-between'>
        <Button className='w-[48%]' onClick={handleClose} size='large'>
          Cancel
        </Button>
        <Button
          className='w-[48%]'
          onClick={handleShowUpdateCapacity}
          size='large'
          type='primary'
        >
          {pendingBills?.length === 0 ? 'Update Capacity' : 'Confirm Await'}
        </Button>
      </div>
    </Modal>
  );
}
