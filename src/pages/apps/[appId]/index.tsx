'use client';
import { message, Tabs } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import DeployDrawer from '@/components/appDetail/DeployDrawer';
import DetailBox from '@/components/appDetail/DetailBox';
import DownloadTempFile from '@/components/appDetail/DownloadTempFile';
import HeaderHandle from '@/components/appDetail/HeaderHandle';
import Logs from '@/components/appDetail/Logs';
import Playground from '@/components/appDetail/Playground';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setCurrentAppDetail,
  setCurrentVersion,
} from '@/store/slices/appSlice';

import { queryAuthToken } from '@/api/apiUtils';
import { getAppDetail } from '@/api/requestApp';

import { AppStatusType } from '@/types/appType';

export default function AppDetail() {
  const [deployDrawerVisible, setDeployDrawerVisible] = useState(false);
  const router = useRouter();
  const { appId, currentTab } = router.query;
  // currentTable default playground -> click change logs
  const [currentTable, setCurrentTable] = useState<string>(
    typeof currentTab === 'string' ? currentTab : 'playground'
  );
  const { currentAppDetail } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const getAppDetailTemp = async () => {
      await queryAuthToken();
      if (appId) {
        const res = await getAppDetail({ appId: String(appId) });
        dispatch(setCurrentAppDetail(res));
        // set default version
        dispatch(setCurrentVersion(res.versions?.currentVersion));
      }
    };
    getAppDetailTemp();
  }, [dispatch, deployDrawerVisible, router.query, appId]);

  const handleTabChange = (key: string) => {
    // change url tab params
    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, currentTab: key },
      },
      undefined,
      { shallow: true }
    );
    setCurrentTable(key);
  };

  return (
    <div className='px-[16px] pb-[30px] sm:px-[40px] sm:pb-[60px]'>
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
          centered
          size='large'
          className='mt-[12px] min-h-[600px]'
          items={[
            {
              key: 'playground',
              label: 'Playground',
              children: <Playground />,
            },
            {
              key: 'logs',
              label: 'Logs',
              children: <Logs messageApi={messageApi} />,
              forceRender: true,
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
          title='Deploy app'
          deployDrawerVisible={deployDrawerVisible}
          setDeployDrawerVisible={setDeployDrawerVisible}
          messageApi={messageApi}
        />
      )}
    </div>
  );
}
