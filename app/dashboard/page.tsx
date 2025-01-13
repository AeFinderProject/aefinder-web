'use client';

import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { GetRef, TourProps } from 'antd';
import { Button, message, Tooltip, Tour } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { getRemainingDays, useThrottleCallback } from '@/lib/utils';

import AppItemCard from '@/components/dashboard/AppItemCard';
import CreateAppDrawer from '@/components/dashboard/CreateAppDrawer';
import TourStep from '@/components/dashboard/TourStep';
import Seo from '@/components/Seo';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setApikeySummary,
  setAppList,
  setCurrentAppDetail,
  setCurrentVersion,
  setSubscriptions,
} from '@/store/slices/appSlice';

import { queryAuthToken } from '@/api/apiUtils';
import { getSummary } from '@/api/requestAPIKeys';
import { getAppList } from '@/api/requestApp';

import { CurrentTourStepEnum } from '@/types/appType';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const createRef = useRef<GetRef<typeof Button>>(null);
  const [createAppDrawerVisible, setCreateAppDrawerVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [openTour, setOpenTour] = useState<boolean>(false);
  const [openCreateTour, setOpenCreateTour] = useState(false);
  const currentTourStep = localStorage.getItem('currentTourStep');
  const isMobile = window?.innerWidth < 640;
  const appList = useAppSelector((state) => state.app.appList);
  const apikeySummary = useAppSelector((state) => state.app.apikeySummary);

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

  const getSummaryTemp = useThrottleCallback(async () => {
    const res = await getSummary();
    console.log('getSummaryRes', res);
    dispatch(setApikeySummary(res));
  }, [dispatch]);

  useEffect(() => {
    getSummaryTemp();
  }, [getSummaryTemp]);

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
                router.push('/dashboard/billing/upgrade');
              }}
              className='ml-[20px] hidden h-[40px] w-[148px] text-sm sm:inline-block'
            >
              <Image
                src='/assets/svg/shopping-cart.svg'
                alt='shopping'
                width={14}
                height={14}
                className='mr-2 inline-block'
              />
              Purchase
            </Button>
          </div>
        </div>
        <div className='border-gray-E0 mb-[31px] flex h-[98px] items-center justify-between rounded-lg border p-[24px]'>
          <div className='flex flex-col items-start'>
            <div className='text-gray-80 text-base'>
              Queries made
              <Tooltip
                title='The apikey has been used to query data from the aeindexer.'
                className='relative top-[-3px] ml-[4px]'
              >
                <InfoCircleOutlined />
              </Tooltip>
            </div>
            <div className='text-dark-normal mt-[2px] text-base font-medium'>
              {apikeySummary.query}/{apikeySummary.queryLimit}
            </div>
          </div>
          <div className='flex flex-col items-start'>
            <div className='text-gray-80 text-base'>
              Renews in
              <Tooltip
                title='Remaining days before the trial period ends.'
                className='relative top-[-3px] ml-[4px]'
              >
                <InfoCircleOutlined />
              </Tooltip>
            </div>
            <div className='text-dark-normal mt-[2px] text-base font-medium'>
              {getRemainingDays()} Days
            </div>
          </div>
          <div className='flex flex-col items-start'>
            <div className='text-gray-80 text-base'>
              API Keys
              <Tooltip
                title='There are currently active API keys.'
                className='relative top-[-3px] ml-[4px]'
              >
                <InfoCircleOutlined />
              </Tooltip>
            </div>
            <div className='text-dark-normal mt-[2px] text-base font-medium'>
              {apikeySummary.apiKeyCount}/{apikeySummary.maxApiKeyCount || 10}
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <div className='px-[20px] sm:px-[40px]'>
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
