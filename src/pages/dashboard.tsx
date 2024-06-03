'use client';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';

import logger from '@/lib/logger';

import AppItemCard from '@/components/dashboard/AppItemCard';
import CreateAppDrawer from '@/components/dashboard/CreateAppDrawer';
import Seo from '@/components/Seo';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAppList } from '@/store/slices/appSlice';

import { getAppList } from '@/api/requestApp';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const [createAppDrawerVisible, setCreateAppDrawerVisible] = useState(false);
  const appList = useAppSelector((state) => state.app.appList);
  logger(appList);

  const getAppListTemp = useCallback(async () => {
    const list = await getAppList();
    dispatch(setAppList(list));
  }, [dispatch]);

  useEffect(() => {
    getAppListTemp();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Seo templateTitle='Dashboard' />
      <div className='px-[40px]'>
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
            onClick={() => setCreateAppDrawerVisible(true)}
          >
            Create app
          </Button>
        </div>
      </div>
      {appList.length === 0 && (
        <div className='flex min-h-[450px] w-full flex-col items-center justify-center'>
          <Image src='/svg/no-app.svg' alt='No app' width={165} height={190} />
          <div className='mb-2 mt-6 text-2xl text-black'>
            No apps created yet
          </div>
          <div className='text-gray-80 w-[670px] text-center'>
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
          title='Create app'
          createAppDrawerVisible={createAppDrawerVisible}
          setCreateAppDrawerVisible={setCreateAppDrawerVisible}
        />
      )}
    </div>
  );
}
