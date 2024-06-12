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
  // currentTable default playground -> click change logs
  const [currentTable, setCurrentTable] = useState<string>('playground');
  const { currentAppDetail } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  useEffect(() => {
    const getAppDetailTemp = async () => {
      await queryAuthToken();
      const { appId } = router.query;
      if (appId) {
        const res = await getAppDetail({ appId: String(appId) });
        dispatch(setCurrentAppDetail(res));
        // set default version
        dispatch(setCurrentVersion(res.versions?.currentVersion));
      }
    };
    getAppDetailTemp();
  }, [dispatch, deployDrawerVisible, router.query]);

  return (
    <div className='px-[40px] pb-[60px]'>
      {contextHolder}
      <HeaderHandle
        setDeployDrawerVisible={setDeployDrawerVisible}
        messageApi={messageApi}
      />
      <DetailBox currentAppDetail={currentAppDetail} />
      {currentAppDetail.status === AppStatusType.Deployed && (
        <Tabs
          defaultActiveKey={currentTable}
          onChange={(key) => setCurrentTable(key)}
          centered
          size='large'
          className='mt-[12px] min-h-[500px]'
          items={[
            {
              key: 'playground',
              label: 'Playground',
              children: <Playground messageApi={messageApi} />,
            },
            {
              key: 'logs',
              label: 'Logs',
              children: <Logs messageApi={messageApi} />,
            },
          ]}
        />
      )}
      {currentAppDetail.status === AppStatusType.UnDeployed && (
        <DownloadTempFile messageApi={messageApi} />
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
