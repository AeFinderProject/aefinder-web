'use client';
import type { TourProps } from 'antd';
import { message, Tabs, Tour } from 'antd';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import DeployDrawer from '@/components/appDetail/DeployDrawer';
import DetailBox from '@/components/appDetail/DetailBox';
import DownloadTempFile from '@/components/appDetail/DownloadTempFile';
import HeaderHandle from '@/components/appDetail/HeaderHandle';
import Logs from '@/components/appDetail/Logs';
import Manifest from '@/components/appDetail/Manifest';
import Playground from '@/components/appDetail/Playground';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setCurrentAppDetail,
  setCurrentVersion,
  setSubscriptions,
} from '@/store/slices/appSlice';

import { queryAuthToken } from '@/api/apiUtils';
import { getAppDetail } from '@/api/requestApp';
import { getSubscriptions } from '@/api/requestSubscription';

import { CurrentTourStepEnum } from '@/types/appType';
import { AppStatusType } from '@/types/appType';

export default function AppDetail() {
  const dispatch = useAppDispatch();
  const router = useRouter();
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
  const { appId } = router.query;
  const isGuest = sessionStorage.getItem('isGuest');
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
    const getAppDetailTemp = async () => {
      await queryAuthToken();
      if (appId) {
        const res = await getAppDetail({ appId: String(appId) });
        dispatch(setCurrentAppDetail(res));
        // set default version
        if (res.versions?.currentVersion) {
          dispatch(setCurrentVersion(res.versions?.currentVersion));
        }
      }
    };
    getAppDetailTemp();
  }, [dispatch, deployDrawerVisible, appId]);

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
    if (
      isGuest === 'true' &&
      currentTourStep === CurrentTourStepEnum.UpdateAeIndexer
    ) {
      setOpenPlaygroundTour(true);
    }
  }, [isGuest, currentTourStep, isNeedRefresh]);

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
