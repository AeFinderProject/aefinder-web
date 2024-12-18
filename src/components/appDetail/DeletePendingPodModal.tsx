import { Button, Modal } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import Image from 'next/image';
import { useCallback } from 'react';

import { useThrottleCallback } from '@/lib/utils';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setCurrentAppDetail,
  setCurrentVersion,
} from '@/store/slices/appSlice';

import { getAppDetail } from '@/api/requestApp';
import { destroyPending } from '@/api/requestMarket';

type DeletePendingPodModalProps = {
  readonly isShowDeletePendingPodModal: boolean;
  readonly setIsShowDeletePendingPodModal: (visible: boolean) => void;
  readonly messageApi: MessageInstance;
};

export default function DeletePendingPodModal({
  isShowDeletePendingPodModal,
  setIsShowDeletePendingPodModal,
  messageApi,
}: DeletePendingPodModalProps) {
  const dispatch = useAppDispatch();
  const currentAppDetail = useAppSelector(
    (state) => state.app.currentAppDetail
  );
  console.log(currentAppDetail);

  const handleClose = useCallback(() => {
    setIsShowDeletePendingPodModal(false);
  }, [setIsShowDeletePendingPodModal]);

  const getAppDetailTemp = useThrottleCallback(async () => {
    if (currentAppDetail?.appId) {
      const res = await getAppDetail({ appId: currentAppDetail?.appId });
      dispatch(setCurrentAppDetail(res));
      // set default version
      if (res.versions?.currentVersion) {
        dispatch(setCurrentVersion(res.versions?.currentVersion));
      }
    }
  }, [dispatch, currentAppDetail?.appId]);

  const handleDelete = useCallback(async () => {
    const res = await destroyPending({
      appId: currentAppDetail?.appId,
    });
    if (res) {
      messageApi.open({
        type: 'success',
        content: 'Successfully delete pending pod',
      });
      setTimeout(() => {
        getAppDetailTemp();
      }, 500);
      handleClose();
    }
  }, [messageApi, handleClose, getAppDetailTemp, currentAppDetail?.appId]);

  return (
    <Modal
      title=''
      onCancel={handleClose}
      open={isShowDeletePendingPodModal}
      destroyOnClose
      footer={false}
      width={430}
    >
      <Image
        src='/assets/svg/emergency.svg'
        alt='emergency'
        width={49}
        height={48}
        className='mt-[24px]'
      />
      <div className='text-dark-normal my-[16px] text-xl font-medium'>
        Delete the pending version: {currentAppDetail?.versions?.pendingVersion}
        ?
      </div>
      <div className='text-gray-80'>
        Are you sure you want to delete this subscription? This action cannot be
        undone. Please confirm to proceed.
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
