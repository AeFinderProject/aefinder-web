import { Button, Modal } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import Image from 'next/image';
import { useCallback } from 'react';

import { openWithBlank } from '@/lib/utils';

import { useAppSelector } from '@/store/hooks';

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
  const orgUser = useAppSelector((state) => state.common.orgUser);

  const handleClose = useCallback(() => {
    setIsShowDeactivatedModal(false);
  }, [setIsShowDeactivatedModal]);

  const handleShowUpdateCapacity = useCallback(() => {
    setIsShowDeactivatedModal(false);
    setIsShowUpdateCapacityModal(true);
  }, [setIsShowDeactivatedModal, setIsShowUpdateCapacityModal]);

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
        AeIndexer Deactivated
      </div>
      <div className='text-gray-80'>
        Your AeIndexer is currently deactivated due to insufficient balance. To
        reactivate your AeIndexer and continue enjoying our services, please add
        funds to your Balance or contact us.
      </div>
      <div className='mt-[24px] flex justify-between'>
        <Button className='w-[48%]' onClick={handleClose} size='large'>
          Cancel
        </Button>
        {orgUser?.organizationStatus === 1 && (
          <Button
            className='w-[48%]'
            onClick={() => openWithBlank('https://form.aefinder.io/contact')}
            size='large'
            type='primary'
          >
            Contact us
          </Button>
        )}
        {orgUser?.organizationStatus === 0 && (
          <Button
            className='w-[48%]'
            onClick={handleShowUpdateCapacity}
            size='large'
            type='primary'
          >
            Set Capacity
          </Button>
        )}
      </div>
    </Modal>
  );
}
