'use client';
import { message, Tabs } from 'antd';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

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

import { AppStatusType } from '@/types/appType';

export default function AppDetail() {
  const [deployDrawerVisible, setDeployDrawerVisible] = useState(false);
  const router = useRouter();
  const { appId } = router.query;
  // currentTable default playground -> click change logs
  const [currentTable, setCurrentTable] = useState<string>(
    localStorage.getItem('currentTab') ?? 'playground'
  );
  const { currentAppDetail, currentVersion } = useAppSelector(
    (state) => state.app
  );
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();

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

  return (
    <div className='px-[16px] pb-[20px] sm:px-[40px] sm:pb-[40px]'>
      {contextHolder}
      <HeaderHandle
        setDeployDrawerVisible={setDeployDrawerVisible}
        messageApi={messageApi}
      />
      <DetailBox currentAppDetail={currentAppDetail} />
      {currentAppDetail.status === AppStatusType.Deployed && (
        <Tabs
          defaultActiveKey={currentTable}
          onChange={(key) => handleTabChange(key)}
          centered={window?.innerWidth > 640}
          size='large'
          className='mt-[12px] min-h-[600px]'
          items={[
            {
              key: 'playground',
              label: 'Playground',
              children: <Playground />,
              disabled: window?.innerWidth < 640,
            },
            {
              key: 'logs',
              label: 'Logs',
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
    </div>
  );
}
