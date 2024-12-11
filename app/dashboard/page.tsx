'use client';

import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { GetRef, TourProps } from 'antd';
import { Button, message, Tag, Tooltip, Tour } from 'antd';
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
    if (currentTourStep === CurrentTourStepEnum.InitTour) {
      setOpenTour(true);
    }
    if (currentTourStep === CurrentTourStepEnum.CreateAeIndexer) {
      setOpenCreateTour(true);
    }
  }, [currentTourStep]);

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
    if (currentTourStep === CurrentTourStepEnum.CreateAeIndexer) {
      localStorage.setItem(
        'currentTourStep',
        CurrentTourStepEnum.HaveCreateAeIndexer
      );
    }
    setOpenCreateTour(false);
  }, [currentTourStep]);

  return (
    <div>
      {contextHolder}
      <Seo templateTitle='Dashboard' />
      <div className='px-[16px] sm:px-[40px]'>
        <div className='flex h-[120px] items-center justify-between'>
          <div>
            <div className='text-3xl text-black'>My Dashboard</div>
          </div>
          <div>
            <Button
              type='primary'
              icon={<PlusOutlined className='relative top-[-3px]' />}
              onClick={() => {
                handleCreateCloseTour();
                setCreateAppDrawerVisible(true);
              }}
              className='h-[40px] w-[160px] text-sm'
              ref={createRef}
            >
              Create AeIndexer
            </Button>
            <Button
              type='primary'
              onClick={() => {
                console.log('Upgrade Plan click');
              }}
              className='ml-[40px] h-[40px] w-[148px] text-sm'
            >
              <Image
                src='/assets/svg/shopping-cart.svg'
                alt='shopping'
                width={14}
                height={14}
                className='mr-2 inline-block'
              />
              Upgrade Plan
            </Button>
          </div>
        </div>
        <div className='border-gray-E0 mb-[31px] flex h-[98px] items-center justify-between rounded-lg border p-[24px]'>
          <Tag color='#9DCBFF'>Free Trial</Tag>
          <div className='flex flex-col items-start'>
            <div className='text-gray-80 text-base'>
              Queries made
              <Tooltip
                title='prompt text todo'
                className='relative top-[-3px] ml-[4px]'
              >
                <InfoCircleOutlined />
              </Tooltip>
            </div>
            <div className='text-dark-normal mt-[2px] text-base font-medium'>
              0/100,000
            </div>
          </div>
          <div className='flex flex-col items-start'>
            <div className='text-gray-80 text-base'>
              Renews in
              <Tooltip
                title='prompt text todo'
                className='relative top-[-3px] ml-[4px]'
              >
                <InfoCircleOutlined />
              </Tooltip>
            </div>
            <div className='text-dark-normal mt-[2px] text-base font-medium'>
              24 Days
            </div>
          </div>
          <div className='flex flex-col items-start'>
            <div className='text-gray-80 text-base'>
              API Keys
              <Tooltip
                title='prompt text todo'
                className='relative top-[-3px] ml-[4px]'
              >
                <InfoCircleOutlined />
              </Tooltip>
            </div>
            <div className='text-dark-normal mt-[2px] text-base font-medium'>
              0
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <div className='px-[40px]'>
        <div className='border-gray-70 border-b'></div>
      </div>
      <div className='text-gray-80 ml-[40px] mt-[31px]'>
        My AeIndexer ({appList.length})
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
