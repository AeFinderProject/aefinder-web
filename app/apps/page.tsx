'use client';
// eslint-disable-next-line
import React, { useCallback, useEffect, useRef, useState } from 'react';

import type { TourProps } from 'antd';
import { message, Tabs, Tour } from 'antd';

import DeployDrawer from '@/components/appDetail/DeployDrawer';
import DetailBox from '@/components/appDetail/DetailBox';
import DownloadTempFile from '@/components/appDetail/DownloadTempFile';
import HeaderHandle from '@/components/appDetail/HeaderHandle';
import Logs from '@/components/appDetail/Logs';
import Manifest from '@/components/appDetail/Manifest';
import Playground from '@/components/appDetail/Playground';
import Capacity from '@/components/appDetail/Capacity';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setCurrentAppDetail,
  setCurrentVersion,
  setSubscriptions,
} from '@/store/slices/appSlice';

import { queryAuthToken } from '@/api/apiUtils';
import { getAppDetail } from '@/api/requestApp';
import { getSubscriptions } from '@/api/requestSubscription';

import { CurrentTourStepEnum, AppStatusType } from '@/types/appType';
import { useThrottleCallback } from '@/lib/utils';

export default function AppDetail() {
  const dispatch = useAppDispatch();
  const PlaygroundRef = useRef<HTMLDivElement>(null);
  const LogRef = useRef<HTMLDivElement>(null);
  const [openPlaygroundTour, setOpenPlaygroundTour] = useState(false);
  const [deployDrawerVisible, setDeployDrawerVisible] = useState(false);
  // currentTable default playground -> click change logs
  const [currentTable, setCurrentTable] = useState<string>(
    localStorage.getItem('currentTab') ?? 'playground'
  );
  const [isNeedRefresh, setIsNeedRefresh] = useState(false);
  const { currentAppDetail, currentVersion } = useAppSelector(
    (state) => state.app
  );
  const [messageApi, contextHolder] = message.useMessage();

  const searchParams = new URLSearchParams(window.location.search);
  const [appId, setAppId] = useState(searchParams.get('appId'));

  const currentTourStep = localStorage.getItem('currentTourStep');

  const PlaygroundSteps: TourProps['steps'] = [
    {
      title: <div className='text-dark-normal font-semibold'>Playground</div>,
      description:
        'Playground allows you to explore AeIndexer data through the web interface.',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      target: () => PlaygroundRef.current!,
      prevButtonProps: {
        className: 'w-[82px] h-[26px] relative right-[10px]',
      },
      nextButtonProps: {
        className: 'w-[82px] h-[26px] relative right-[10px]',
      },
      style: {
        width: '320px',
      },
      placement: 'top',
    },
    {
      title: <div className='text-dark-normal font-semibold'>Logs</div>,
      description: 'You can use the Logs tab to investigate errors and debug.',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      target: () => LogRef.current!,
      prevButtonProps: {
        className: 'w-[82px] h-[26px] relative right-[10px]',
      },
      nextButtonProps: {
        className: 'w-[82px] h-[26px] relative right-[10px]',
      },
      style: {
        width: '320px',
      },
      placement: 'top',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!appId) {
        const searchParams = new URLSearchParams(window.location.search);
        setAppId(searchParams.get('appId'));
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [appId]);

  const getAppDetailTemp = useThrottleCallback(async () => {
    await queryAuthToken();
    if (appId) {
      const res = await getAppDetail({ appId: String(appId) });
      dispatch(setCurrentAppDetail(res));
      // set default version
      if (res.versions?.currentVersion) {
        dispatch(setCurrentVersion(res.versions?.currentVersion));
      }
    }
  }, [dispatch, deployDrawerVisible, appId]);

  useEffect(() => {
    getAppDetailTemp();
  }, [getAppDetailTemp]);

  useEffect(() => {
    // when currentVersion is null, it means the app is not deployed
    if (!currentVersion) return;
    const getSubscriptionsRes = async () => {
      if (appId && currentAppDetail?.deployKey) {
        const res = await getSubscriptions({
          appId: String(appId),
          deployKey: currentAppDetail?.deployKey,
        });
        dispatch(setSubscriptions(res));
      }
    };
    getSubscriptionsRes();
  }, [dispatch, currentVersion, appId, currentAppDetail?.deployKey]);

  const handleTabChange = useCallback((key: string) => {
    localStorage.setItem('currentTab', key);
    setCurrentTable(key);
  }, []);

  useEffect(() => {
    // mobile change tab to logs and playground disable
    if (window?.innerWidth < 640) {
      handleTabChange('logs');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentTourStep === CurrentTourStepEnum.UpdateAeIndexer) {
      setOpenPlaygroundTour(true);
    }
  }, [currentTourStep, isNeedRefresh]);

  const handlePlaygroundCloseTour = useCallback(() => {
    localStorage.setItem(
      'currentTourStep',
      CurrentTourStepEnum.PlaygroundAeIndexer
    );
    setOpenPlaygroundTour(false);
  }, []);

  return (
    <div className='px-[16px] pb-[20px] sm:px-[40px] sm:pb-[40px]'>
      {contextHolder}
      <HeaderHandle
        setDeployDrawerVisible={setDeployDrawerVisible}
        messageApi={messageApi}
        isNeedRefresh={isNeedRefresh}
        setIsNeedRefresh={setIsNeedRefresh}
      />
      <DetailBox currentAppDetail={currentAppDetail} />
      {currentAppDetail.status === AppStatusType.Deployed && (
        <Tabs
          defaultActiveKey={currentTable}
          onChange={(key) => handleTabChange(key)}
          centered={window?.innerWidth > 640}
          size='large'
          className='mt-[12px] min-h-[600px] overflow-hidden'
          items={[
            {
              key: 'playground',
              label: <div ref={PlaygroundRef}>Playground</div>,
              children: <Playground />,
              disabled: window?.innerWidth < 640,
              forceRender: true,
            },
            {
              key: 'logs',
              label: <div ref={LogRef}>Logs</div>,
              children: <Logs messageApi={messageApi} />,
              forceRender: true,
            },
            {
              key: 'manifest',
              label: 'Manifest',
              children: <Manifest />,
            },
            {
              key: 'capacity',
              label: 'Capacity',
              children: <Capacity />,
            },
          ]}
        />
      )}
      {currentAppDetail.status === AppStatusType.UnDeployed && (
        <DownloadTempFile />
      )}
      {deployDrawerVisible && (
        <DeployDrawer
          type={0}
          title='Deploy AeIndexer'
          deployDrawerVisible={deployDrawerVisible}
          setDeployDrawerVisible={setDeployDrawerVisible}
          messageApi={messageApi}
        />
      )}
      <Tour
        open={openPlaygroundTour}
        onClose={() => handlePlaygroundCloseTour()}
        steps={PlaygroundSteps}
        onFinish={() => handlePlaygroundCloseTour()}
        placement='top'
      />
    </div>
  );
}
