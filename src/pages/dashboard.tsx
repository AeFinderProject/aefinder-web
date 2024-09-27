'use client';
import { PlusOutlined } from '@ant-design/icons';
import type { GetRef, TourProps } from 'antd';
import { Button, message, Tour } from 'antd';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import AppItemCard from '@/components/dashboard/AppItemCard';
import CreateAppDrawer from '@/components/dashboard/CreateAppDrawer';
import TourStep from '@/components/dashboard/TourStep';
import Seo from '@/components/Seo';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setAppList,
  setCurrentAppDetail,
  setCurrentVersion,
  setSubscriptions,
} from '@/store/slices/appSlice';

import { queryAuthToken } from '@/api/apiUtils';
import { getAppList } from '@/api/requestApp';

import { CurrentTourStepEnum } from '@/types/appType';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const createRef = useRef<GetRef<typeof Button>>(null);
  const [createAppDrawerVisible, setCreateAppDrawerVisible] = useState(false);
  const appList = useAppSelector((state) => state.app.appList);
  const [messageApi, contextHolder] = message.useMessage();
  const [openTour, setOpenTour] = useState<boolean>(false);
  const [openCreateTour, setOpenCreateTour] = useState(false);
  const isGuest = sessionStorage.getItem('isGuest');
  const currentTourStep = localStorage.getItem('currentTourStep');
  const isMobile = window?.innerWidth < 640;

  const steps: TourProps['steps'] = [
    {
      title: null,
      description: <TourStep step={1} />,
      style: {
        width: isMobile ? '380px' : '780px',
      },
    },
    {
      title: null,
      description: <TourStep step={2} />,
      style: {
        width: isMobile ? '380px' : '780px',
      },
    },
    {
      title: null,
      description: <TourStep step={3} />,
      style: {
        width: isMobile ? '380px' : '780px',
      },
    },
  ];

  const createSteps: TourProps['steps'] = [
    {
      title: (
        <div className='text-dark-normal font-semibold'>Create AeIndexer</div>
      ),
      description: 'Get started by creating an AeIndexer.',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      target: () => createRef.current!,
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
    if (
      isGuest === 'true' &&
      currentTourStep === CurrentTourStepEnum.InitTour
    ) {
      setOpenTour(true);
    }
    if (
      isGuest === 'true' &&
      currentTourStep === CurrentTourStepEnum.CreateAeIndexer
    ) {
      setOpenCreateTour(true);
    }
  }, [isGuest, currentTourStep]);

  useEffect(() => {
    const getAppListTemp = async () => {
      await queryAuthToken();
      const { items = [] } = await getAppList();
      dispatch(setAppList(items));
      // set appList and init currentAppDetail currentVersion subscriptions
      dispatch(setCurrentAppDetail({}));
      dispatch(setCurrentVersion(''));
      dispatch(setSubscriptions({}));
    };
    getAppListTemp();
  }, [dispatch, createAppDrawerVisible]);

  const handleCloseTour = useCallback(() => {
    localStorage.setItem(
      'currentTourStep',
      CurrentTourStepEnum.CreateAeIndexer
    );
    setOpenTour(false);
  }, []);

  const handleCreateCloseTour = useCallback(() => {
    if (
      isGuest === 'true' &&
      currentTourStep === CurrentTourStepEnum.CreateAeIndexer
    ) {
      localStorage.setItem(
        'currentTourStep',
        CurrentTourStepEnum.HaveCreateAeIndexer
      );
    }
    setOpenCreateTour(false);
  }, [isGuest, currentTourStep]);

  return (
    <div>
      {contextHolder}
      <Seo templateTitle='Dashboard' />
      <div className='px-[16px] sm:px-[40px]'>
        <div className='border-gray-F0 flex h-[140px] items-center justify-between border-b'>
          <div>
            <div className='text-3xl text-black'>My Dashboard</div>
            <div className='text-gray-80 relative top-6'>
              ALL ({appList.length})
            </div>
          </div>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => {
              handleCreateCloseTour();
              setCreateAppDrawerVisible(true);
            }}
            className='h-[40px] w-[160px] text-sm'
            ref={createRef}
          >
            Create AeIndexer
          </Button>
        </div>
      </div>
      {appList.length === 0 && (
        <div className='flex min-h-[450px] w-full flex-col items-center justify-center'>
          <Image
            src='/assets/svg/no-app.svg'
            alt='No app'
            width={165}
            height={190}
          />
          <div className='mb-2 mt-6 text-2xl text-black'>
            No AeIndexer created yet
          </div>
          <div className='text-gray-80 w-[380px] text-center sm:w-[580px]'>
            AeFinder is a powerful decentralised protocol used for indexing and
            querying the data of the blockchain. It makes it possible to query
            data that are difficult to query directly.
          </div>
        </div>
      )}
      {appList.length > 0 && <AppItemCard appList={appList} />}
      {createAppDrawerVisible && (
        <CreateAppDrawer
          type={0}
          createAppDrawerVisible={createAppDrawerVisible}
          setCreateAppDrawerVisible={setCreateAppDrawerVisible}
          messageApi={messageApi}
        />
      )}
      <Tour
        open={openTour}
        onClose={() => handleCloseTour()}
        steps={steps}
        prefixCls='custom-tour-popover'
      />
      <Tour
        open={openCreateTour}
        onClose={() => handleCreateCloseTour()}
        steps={createSteps}
        onFinish={() => {
          setOpenCreateTour(false);
        }}
      />
    </div>
  );
}
