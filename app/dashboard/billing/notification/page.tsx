'use client';
import { IssuesCloseOutlined, LeftOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { message, Switch, Table } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { useThrottleCallback } from '@/lib/utils';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUserInfo } from '@/store/slices/commonSlice';

import { getUsersInfo } from '@/api/requestApp';
import { setNotification } from '@/api/requestMarket';

export default function Notification() {
  const isMobile = window?.innerWidth < 640;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const userInfo = useAppSelector((state) => state.common.userInfo);

  const alertList = [
    {
      email: userInfo.email,
      verified: userInfo.emailConfirmed,
      alerts: userInfo.notification,
    },
  ];

  const getUsersInfoTemp = useCallback(async () => {
    const res = await getUsersInfo();
    if (res.userName) {
      dispatch(setUserInfo(res));
    }
  }, [dispatch]);

  const handleSwitchChange = useThrottleCallback(
    async (checked: boolean) => {
      const res = await setNotification({
        email: userInfo.email,
        notification: checked,
      });
      if (res) {
        messageApi.success('set notification success');
        getUsersInfoTemp();
      }
    },
    [userInfo?.email, messageApi, getUsersInfoTemp]
  );

  const columns: TableColumnsType = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Verified',
      dataIndex: 'verified',
      key: 'verified',
      render: (record) => (
        <div className='relative'>
          {record ? (
            <Image
              src='/assets/svg/checkCircle.svg'
              alt='checkCircle'
              width={24}
              height={24}
            />
          ) : (
            <IssuesCloseOutlined className='text-gray-80 text-2xl' />
          )}
        </div>
      ),
    },
    {
      title: 'Billing Alerts',
      dataIndex: 'alerts',
      key: 'alerts',
      render: () => <Switch defaultChecked onChange={handleSwitchChange} />,
    },
  ];

  return (
    <div className='px-[16px] pb-[40px] sm:px-[40px]'>
      {contextHolder}
      <div className='border-gray-F0 flex h-[120px] flex-col items-start justify-center border-b'>
        <div>
          <LeftOutlined
            className='relative top-[-7px] mr-[16px] cursor-pointer align-middle text-sm'
            onClick={() => router.back()}
          />
          <span className='text-3xl text-black'>Notification</span>
        </div>
        <div className='text-gray-80 text-xs'>
          Manage your emails & notifications
        </div>
      </div>
      <div className='mt-[24px]'>
        <Table
          id='notification'
          rowKey='email'
          columns={columns}
          dataSource={alertList}
          className='w-full'
          size={isMobile ? 'small' : 'middle'}
          pagination={false}
        />
      </div>
    </div>
  );
}
