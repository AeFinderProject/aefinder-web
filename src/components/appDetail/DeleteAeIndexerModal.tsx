import { Button, Modal } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { useAppSelector } from '@/store/hooks';

import { appDeployObliterate } from '@/api/requestMarket';

type DeleteIndexerModalProps = {
  readonly isShowDeleteIndexerModal: boolean;
  readonly setIsShowDeleteIndexerModal: (visible: boolean) => void;
  readonly messageApi: MessageInstance;
};

export default function DeleteIndexerModal({
  isShowDeleteIndexerModal,
  setIsShowDeleteIndexerModal,
  messageApi,
}: DeleteIndexerModalProps) {
  const router = useRouter();
  const currentAppDetail = useAppSelector(
    (state) => state.app.currentAppDetail
  );
  const orgUserAll = useAppSelector((state) => state.app.orgUserAll);
  console.log(currentAppDetail);

  const handleClose = useCallback(() => {
    setIsShowDeleteIndexerModal(false);
  }, [setIsShowDeleteIndexerModal]);

  const handleDelete = useCallback(async () => {
    const res = await appDeployObliterate({
      appId: currentAppDetail?.appId,
      organizationId: orgUserAll?.id,
    });
    if (res) {
      messageApi.open({
        type: 'success',
        content: 'Successfully delete aeIndexer',
      });
      handleClose();
      router.replace('/dashboard');
    }
  }, [
    messageApi,
    handleClose,
    router,
    currentAppDetail?.appId,
    orgUserAll?.id,
  ]);

  return (
    <Modal
      title=''
      onCancel={handleClose}
      open={isShowDeleteIndexerModal}
      destroyOnClose
      footer={false}
      width={400}
    >
      <Image
        src='/assets/svg/emergency.svg'
        alt='emergency'
        width={49}
        height={48}
        className='mt-[24px]'
      />
      <div className='text-dark-normal my-[16px] text-xl font-medium'>
        Delete {currentAppDetail?.appName} ?
      </div>
      <div className='text-gray-80'>
        Are you sure you want to delete the current AeIndexer? This action
        cannot be undone. Please confirm to proceed.
      </div>
      <div className='mt-[24px] flex justify-between'>
        <Button className='w-[48%]' onClick={handleClose} size='large'>
          Cancel
        </Button>
        <Button
          className='bg-danger-normal w-[48%] text-white'
          onClick={handleDelete}
          size='large'
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}
