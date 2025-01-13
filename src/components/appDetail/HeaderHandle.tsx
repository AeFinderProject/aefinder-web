import { EditOutlined, MoreOutlined, SyncOutlined } from '@ant-design/icons';
import type { GetRef, MenuProps, TourProps } from 'antd';
import { Button, Dropdown, Select, Tour } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useDebounceCallback } from '@/lib/utils';

import DeactivatedModal from '@/components/appDetail/DeactivatedModal';
import DeleteIndexerModal from '@/components/appDetail/DeleteAeIndexerModal';
import DeletePendingPodModal from '@/components/appDetail/DeletePendingPodModal';
import DeployDrawer from '@/components/appDetail/DeployDrawer';
import UpdateCapacityDrawer from '@/components/appDetail/UpdateCapacityDrawer';
import CreateAppDrawer from '@/components/dashboard/CreateAppDrawer';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setCurrentVersion,
  setProcessorAssetListSlice,
} from '@/store/slices/appSlice';

import { getAssetsList, getIsCustomApp } from '@/api/requestMarket';

import { AppStatusType, CurrentTourStepEnum } from '@/types/appType';
import { AssetsItem } from '@/types/marketType';

type HeaderHandleProps = {
  readonly setDeployDrawerVisible: (visible: boolean) => void;
  readonly messageApi: MessageInstance;
  readonly isNeedRefresh: boolean;
  readonly setIsNeedRefresh: (isNeedRefresh: boolean) => void;
  readonly isShowUpdateCapacityModal: boolean;
  readonly setIsShowUpdateCapacityModal: (visible: boolean) => void;
};

export default function HeaderHandle({
  setDeployDrawerVisible,
  messageApi,
  isNeedRefresh,
  setIsNeedRefresh,
  isShowUpdateCapacityModal,
  setIsShowUpdateCapacityModal,
}: HeaderHandleProps) {
  const dispatch = useAppDispatch();
  const DeployRef = useRef<GetRef<typeof Button>>(null);
  const UpdateRef = useRef<GetRef<typeof Button>>(null);
  const [deployLoading, setDeployLoading] = useState(false);
  const [openDeployTour, setOpenDeployTour] = useState(false);
  const [openUpdateTour, setOpenUpdateTour] = useState(false);
  const username = useAppSelector((state) => state.common.username);
  const [editAppDrawerVisible, setEditAppDrawerVisible] = useState(false);
  const [updateDeployDrawerVisible, setUpdateDeployDrawerVisible] =
    useState(false);
  const [isShowDeleteAeIndexModal, setIsShowDeleteAeIndexModal] =
    useState(false);
  const [isShowDeletePendingPodModal, setIsShowDeletePendingPodModal] =
    useState(false);
  const [isShowDeactivatedModal, setIsShowDeactivatedModal] = useState(true);
  const { currentAppDetail, currentVersion } = useAppSelector(
    (state) => state.app
  );
  const currentTourStep = localStorage.getItem('currentTourStep');
  const [processorAssetList, setProcessorAssetList] = useState<AssetsItem[]>(
    []
  );
  const [storageAssetList, setStorageAssetList] = useState<AssetsItem[]>([]);

  const DeploySteps: TourProps['steps'] = [
    {
      title: (
        <div className='text-dark-normal font-semibold'>Deploy AeIndexer</div>
      ),
      description:
        'After setting up an AeIndexer, you can click on “Deploy...” button to deploy the AeIndexer.',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      target: () => DeployRef.current!,
      nextButtonProps: {
        children: 'Ok',
        className: 'w-[290px] h-[40px] relative right-[10px]',
      },
      style: {
        width: '320px',
      },
    },
  ];

  const UpdateSteps: TourProps['steps'] = [
    {
      title: (
        <div className='text-dark-normal font-semibold'>Update AeIndexer</div>
      ),
      description: 'You can update the AeIndexer after it has been deployed.',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      target: () => UpdateRef.current!,
      nextButtonProps: {
        children: 'Ok',
        className: 'w-[290px] h-[40px] relative right-[10px]',
      },
      style: {
        width: '320px',
      },
    },
  ];

  useEffect(() => {
    if (currentTourStep === CurrentTourStepEnum.DeployAeIndexer) {
      setTimeout(() => {
        setOpenDeployTour(true);
      }, 2000);
    }
    if (
      currentTourStep === CurrentTourStepEnum.HaveDeployAeIndexer &&
      currentAppDetail.status === AppStatusType.Deployed
    ) {
      setOpenUpdateTour(true);
    }
  }, [currentTourStep, currentAppDetail, currentAppDetail.appName]);

  const handleChangeVersion = useCallback(
    (currentVersion: string) => {
      dispatch(setCurrentVersion(currentVersion));
      return () => {
        dispatch(setCurrentVersion(''));
      };
    },
    [dispatch]
  );

  const handleDeployCloseTour = useCallback(() => {
    if (currentTourStep === CurrentTourStepEnum.DeployAeIndexer) {
      localStorage.setItem(
        'currentTourStep',
        CurrentTourStepEnum.HaveDeployAeIndexer
      );
    }
    setOpenDeployTour(false);
  }, [currentTourStep]);

  const handleUpdateCloseTour = useCallback(() => {
    if (currentTourStep === CurrentTourStepEnum.HaveDeployAeIndexer) {
      localStorage.setItem(
        'currentTourStep',
        CurrentTourStepEnum.UpdateAeIndexer
      );
      setIsNeedRefresh(!isNeedRefresh);
    }
    setOpenUpdateTour(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTourStep]);

  const handleClickUpdateCapacity = useCallback(() => {
    if (currentAppDetail?.isLocked) {
      messageApi.warning('You have unfinished order, Please wait.');
      return;
    }
    setIsShowUpdateCapacityModal(true);
  }, [currentAppDetail?.isLocked, messageApi, setIsShowUpdateCapacityModal]);

  const dropdownItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Button
          className='text-blue-link w-full'
          onClick={() => handleClickUpdateCapacity()}
        >
          Update capacity
        </Button>
      ),
    },
    {
      key: '2',
      label: (
        <Button
          className='text-danger-normal'
          onClick={() => setIsShowDeleteAeIndexModal(true)}
        >
          Delete AeIndexer
        </Button>
      ),
    },
  ];

  const getAssetsListTemp = useCallback(async () => {
    const getProcessorAssetListRes = await getAssetsList({
      appId: currentAppDetail?.appId,
      type: 1,
      skipCount: 0,
      maxResultCount: 100,
    });
    console.log('getProcessorAssetListRes', getProcessorAssetListRes);
    setProcessorAssetList(getProcessorAssetListRes?.items);
    dispatch(setProcessorAssetListSlice(getProcessorAssetListRes?.items));

    const getStorageAssetListRes = await getAssetsList({
      appId: currentAppDetail?.appId,
      type: 2,
      skipCount: 0,
      maxResultCount: 100,
    });
    console.log('getStorageAssetListRes', getStorageAssetListRes);
    setStorageAssetList(getStorageAssetListRes?.items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAppDetail?.appId, isShowUpdateCapacityModal, dispatch]);

  useEffect(() => {
    getAssetsListTemp();
  }, [getAssetsListTemp]);

  const handleClickDeploy = useDebounceCallback(async () => {
    if (!currentAppDetail?.appId) return;

    // need to check the aeindexer has buy cpu and memory or not
    // if yes, then deploy the aeindexer and show the updateCapacity drawer
    try {
      setDeployLoading(true);
      handleDeployCloseTour();

      // for custom app, show the deploy drawer always
      const getIsCustomAppRes = await getIsCustomApp({
        appId: currentAppDetail?.appId,
      });
      console.log('getIsCustomAppRes', getIsCustomAppRes);
      if (getIsCustomAppRes) {
        setDeployDrawerVisible(true);
        return;
      }

      if (currentAppDetail?.isLocked) {
        messageApi.warning('You have unfinished order, Please wait.');
        return;
      }

      if (
        processorAssetList.length &&
        storageAssetList.length &&
        !currentAppDetail?.isLocked
      ) {
        setDeployDrawerVisible(true);
      } else {
        messageApi.info('Please update capacity first: Processor and Storage');
        setIsShowUpdateCapacityModal(true);
      }
    } finally {
      setDeployLoading(false);
    }
  }, [
    currentAppDetail?.appId,
    currentAppDetail?.isLocked,
    processorAssetList,
    storageAssetList,
  ]);

  return (
    <div className='border-gray-F0 flex h-[130px] items-center justify-between border-b pt-[14px]'>
      <div>
        <Image
          src='/assets/svg/app-default-bg.svg'
          alt='logo'
          width={32}
          height={32}
          className='mb-3 mr-3 mt-3 inline-block'
        />
        <div className='relative inline-block'>
          <div className='text-block relative top-[4px] mr-3 text-3xl font-medium'>
            {currentAppDetail?.appName}
          </div>
          <div className='text-gray-80 absolute left-[-40px] top-[-20px] min-w-[100px] text-sm'>
            <Image
              src='/assets/svg/user.svg'
              alt='user'
              width={18}
              height={18}
              className='text-gray-80 mr-3 inline-block'
            />
            <span>{username}</span>
          </div>
        </div>
        <div className='inline-block'>
          <Button
            className='border-blue-link text-blue-link mr-3'
            onClick={() => setEditAppDrawerVisible(true)}
          >
            <EditOutlined className='relative top-[-4px]' />
            Edit
          </Button>
          <Button
            ref={DeployRef}
            type='primary'
            onClick={handleClickDeploy}
            loading={deployLoading}
            disabled={currentAppDetail?.status === AppStatusType.Deactivated}
          >
            {currentAppDetail?.status === AppStatusType.Deactivated
              ? 'Deactivated'
              : 'Deploy...'}
          </Button>
          <Dropdown
            menu={{ items: dropdownItems }}
            trigger={['click']}
            className='ml-3'
          >
            <Button className='text-blue-link border-blue-link'>
              <MoreOutlined className='relative top-[-2px]' />
            </Button>
          </Dropdown>
        </div>
      </div>
      {currentAppDetail.status === AppStatusType.Deployed && (
        <div className='text-right'>
          <Select
            onChange={(value) => handleChangeVersion(value)}
            className='mb-3 h-[40px] w-[100px] sm:mb-0 sm:w-[200px]'
            value={currentVersion}
          >
            <Select.Option value={currentAppDetail?.versions?.currentVersion}>
              (Current) {currentAppDetail?.versions?.currentVersion}
            </Select.Option>
            {currentAppDetail?.versions?.pendingVersion && (
              <Select.Option value={currentAppDetail?.versions?.pendingVersion}>
                <div className='relative w-full truncate pr-[22px]'>
                  {currentAppDetail?.versions?.pendingVersion}
                  <span
                    className='absolute right-[-4px] cursor-pointer py-[2px] pl-[2px] pr-[6px] hover:bg-gray-100'
                    onClick={() => setIsShowDeletePendingPodModal(true)}
                  >
                    <Image
                      src='/assets/svg/delete.svg'
                      alt='delete'
                      width={22}
                      height={22}
                    />
                  </span>
                </div>
              </Select.Option>
            )}
          </Select>
          <Button
            className='text-blue-link ml-3'
            icon={<SyncOutlined />}
            type='text'
            iconPosition='start'
            onClick={() => {
              handleUpdateCloseTour();
              setUpdateDeployDrawerVisible(true);
            }}
            ref={UpdateRef}
          >
            Update
          </Button>
        </div>
      )}
      {currentAppDetail.status === AppStatusType.UnDeployed && (
        <Button
          type='text'
          size='small'
          className='bg-gray-D6 relative top-[-2px] h-[32px]'
        >
          UnDeployed
        </Button>
      )}
      {editAppDrawerVisible && (
        <CreateAppDrawer
          type={1}
          appDetail={currentAppDetail}
          createAppDrawerVisible={editAppDrawerVisible}
          setCreateAppDrawerVisible={setEditAppDrawerVisible}
          messageApi={messageApi}
        />
      )}
      {updateDeployDrawerVisible && (
        <DeployDrawer
          type={1}
          title='Update AeIndexer'
          version={currentVersion}
          deployDrawerVisible={updateDeployDrawerVisible}
          setDeployDrawerVisible={setUpdateDeployDrawerVisible}
          messageApi={messageApi}
        />
      )}
      {isShowUpdateCapacityModal && (
        <UpdateCapacityDrawer
          isShowUpdateCapacityModal={isShowUpdateCapacityModal}
          setIsShowUpdateCapacityModal={setIsShowUpdateCapacityModal}
          messageApi={messageApi}
        />
      )}
      {isShowDeleteAeIndexModal && (
        <DeleteIndexerModal
          isShowDeleteIndexerModal={isShowDeleteAeIndexModal}
          setIsShowDeleteIndexerModal={setIsShowDeleteAeIndexModal}
          messageApi={messageApi}
        />
      )}
      {isShowDeletePendingPodModal && (
        <DeletePendingPodModal
          isShowDeletePendingPodModal={isShowDeletePendingPodModal}
          setIsShowDeletePendingPodModal={setIsShowDeletePendingPodModal}
          messageApi={messageApi}
        />
      )}
      {currentAppDetail?.status === AppStatusType.Deactivated && (
        <DeactivatedModal
          isShowDeactivatedModal={isShowDeactivatedModal}
          setIsShowDeactivatedModal={setIsShowDeactivatedModal}
          setIsShowUpdateCapacityModal={setIsShowUpdateCapacityModal}
          messageApi={messageApi}
        />
      )}
      <Tour
        open={openDeployTour}
        onClose={() => handleDeployCloseTour()}
        steps={DeploySteps}
        onFinish={() => handleDeployCloseTour()}
      />
      <Tour
        open={openUpdateTour}
        onClose={() => handleUpdateCloseTour()}
        steps={UpdateSteps}
        onFinish={() => handleUpdateCloseTour()}
      />
    </div>
  );
}
