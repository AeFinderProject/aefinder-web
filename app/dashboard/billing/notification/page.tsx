'use client';

import {
  CheckCircleOutlined,
  IssuesCloseOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { Switch, Table } from 'antd';
import { useRouter } from 'next/navigation';

export default function Notification() {
  const isMobile = window?.innerWidth < 640;
  const router = useRouter();

  const alertList = [
    {
      email: 'test@gmail.com',
      verified: true,
      alerts: true,
    },
  ];

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
            <CheckCircleOutlined className='text-blue-link text-2xl' />
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
      render: (record) => (
        <Switch
          defaultChecked
          onChange={() => console.log(`onChange email alerts ${record}`)}
        />
      ),
    },
  ];

  return (
    <div className='px-[16px] pb-[40px] sm:px-[40px]'>
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
