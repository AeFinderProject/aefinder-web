'use client';

import { LeftOutlined, MoreOutlined } from '@ant-design/icons';
import type { MenuProps, TabsProps } from 'antd';
import { Button, Dropdown, message, Tabs } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import ApikeyOverview from '@/components/apikey/ApikeyOverview';
import DeleteApiKeyModal from '@/components/apikey/DeleteApiKeyModal';
import ManageSpendingModal from '@/components/apikey/ManageSpendingModal';
import RegenerateApiKeyModal from '@/components/apikey/RegenerateApiKeyModal';
import RenameApiKeyModal from '@/components/apikey/RenameApiKeyModal';
import Security from '@/components/apikey/Security';
import Copy from '@/components/Copy';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setApikeyDetail } from '@/store/slices/appSlice';

import { queryAuthToken } from '@/api/apiUtils';
import { getApiKeyDetail } from '@/api/requestAPIKeys';

export default function ApikeyDetail() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const [activeTabKey, setActiveTabKey] = useState('overview');
  const [isShowRenameModal, setIsShowRenameModal] = useState(false);
  const [isShowRegenerateModal, setIsShowRegenerateModal] = useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isShowManageSpendingModal, setIsShowManageSpendingModal] =
    useState(false);

  const id = searchParams.get('id');
  const apikeyDetail = useAppSelector((state) => state.app.apikeyDetail);

  const dropdownItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div
          className='text-dark-normal h-[30px] text-xs font-medium leading-8'
          onClick={() => setIsShowRenameModal(true)}
        >
          Rename API Key
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div
          className='text-dark-normal h-[30px] text-xs font-medium leading-8'
          onClick={() => setIsShowRegenerateModal(true)}
        >
          Regenerate API Key
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div
          className='text-dark-normal h-[30px] text-xs font-medium leading-8'
          onClick={() => setIsShowDeleteModal(true)}
        >
          Delete API key
        </div>
      ),
    },
    {
      key: '4',
      label: (
        <div
          className='text-dark-normal h-[30px] text-xs font-medium leading-8'
          onClick={() => setIsShowManageSpendingModal(true)}
        >
          Manage Spending Limit
        </div>
      ),
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: 'overview',
      label: 'Overview',
      children: <ApikeyOverview />,
      forceRender: true,
    },
    {
      key: 'security',
      label: 'Security',
      children: <Security />,
    },
  ];

  const getApiKeyDetailTemp = useCallback(async () => {
    if (!id) {
      return;
    }
    await queryAuthToken();
    const res = await getApiKeyDetail({ id });
    console.log('res', res);
    dispatch(setApikeyDetail(res));
  }, [dispatch, id]);

  useEffect(() => {
    getApiKeyDetailTemp();
  }, [
    getApiKeyDetailTemp,
    id,
    isShowRenameModal,
    isShowRegenerateModal,
    isShowManageSpendingModal,
  ]);

  return (
    <div className='px-[16px] pb-[40px] sm:px-[40px]'>
      {contextHolder}
      <div className='flex h-[120px] items-center justify-between'>
        <div>
          <LeftOutlined
            className='relative top-[-7px] mr-[16px] cursor-pointer align-middle text-sm'
            onClick={() => router.back()}
          />
          <span className='mr-[16px] text-3xl text-black'>
            {apikeyDetail.name}
          </span>
          <div className='border-gray-E0 relative top-[10px] inline-block h-[40px] truncate rounded-md border px-[20px] leading-10'>
            <Copy
              content={apikeyDetail.key}
              isShowCopy={true}
              showLittle={true}
            />
          </div>
        </div>
        <Dropdown
          menu={{ items: dropdownItems }}
          trigger={['click']}
          className='ml-3'
        >
          <Button
            className='bg-blue-link border-blue-link text-white'
            size='large'
          >
            <MoreOutlined className='relative top-[-2px]' />
          </Button>
        </Dropdown>
      </div>
      <Tabs
        defaultActiveKey={activeTabKey}
        items={items}
        onChange={setActiveTabKey}
      />
      <RenameApiKeyModal
        messageApi={messageApi}
        isShowRenameModal={isShowRenameModal}
        setIsShowRenameModal={setIsShowRenameModal}
      />
      <RegenerateApiKeyModal
        messageApi={messageApi}
        isShowRegenerateModal={isShowRegenerateModal}
        setIsShowRegenerateModal={setIsShowRegenerateModal}
      />
      <DeleteApiKeyModal
        messageApi={messageApi}
        isShowDeleteModal={isShowDeleteModal}
        setIsShowDeleteModal={setIsShowDeleteModal}
      />
      <ManageSpendingModal
        messageApi={messageApi}
        isShowManageSpendingModal={isShowManageSpendingModal}
        setIsShowManageSpendingModal={setIsShowManageSpendingModal}
      />
    </div>
  );
}
