import { EditOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import Image from 'next/image';
import React, { useCallback, useState } from 'react';

import DeployDrawer from '@/components/appDetail/DeployDrawer';
import CreateAppDrawer from '@/components/dashboard/CreateAppDrawer';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCurrentVersion } from '@/store/slices/appSlice';

import { AppStatusType } from '@/types/appType';

type HeaderHandleProps = {
  setDeployDrawerVisible: (visible: boolean) => void;
  messageApi: MessageInstance;
};

export default function HeaderHandle({
  setDeployDrawerVisible,
  messageApi,
}: HeaderHandleProps) {
  const dispatch = useAppDispatch();
  const username = useAppSelector((state) => state.common.username);
  const [editAppDrawerVisible, setEditAppDrawerVisible] = useState(false);
  const [updateDeployDrawerVisible, setUpdateDeployDrawerVisible] =
    useState(false);
  const { currentAppDetail, currentVersion } = useAppSelector(
    (state) => state.app
  );

  const handleChangeVersion = useCallback(
    (currentVersion: string) => {
      dispatch(setCurrentVersion(currentVersion));
    },
    [dispatch]
  );

  return (
    <div className='border-gray-F0 flex h-[130px] items-center justify-between border-b pt-[14px]'>
      <div>
        <Image
          src='/assets/svg/app-default-bg.svg'
          alt='logo'
          width={32}
          height={32}
          className='mb-3 mr-3 mt-3 inline-block'
        />
        <div className='relative inline-block'>
          <div className='text-block relative top-[4px] mr-3 text-3xl font-medium'>
            {currentAppDetail?.appName}
          </div>
          <div className='text-gray-80 absolute left-[-40px] top-[-20px] min-w-[100px] text-sm'>
            <Image
              src='/assets/svg/user.svg'
              alt='user'
              width={18}
              height={18}
              className='text-gray-80 mr-3 inline-block'
            />
            <span>{username}</span>
          </div>
        </div>
        <div className='inline-block'>
          <Button
            className='border-blue-link text-blue-link mr-3'
            onClick={() => setEditAppDrawerVisible(true)}
          >
            <EditOutlined className='align-middle' />
            Edit
          </Button>
          <Button type='primary' onClick={() => setDeployDrawerVisible(true)}>
            Deploy...
          </Button>
        </div>
      </div>
      {currentAppDetail.status === AppStatusType.Deployed && (
        <div className='text-right'>
          <Select
            onChange={(value) => handleChangeVersion(value)}
            className='mb-3 w-[200px]'
            defaultValue={currentVersion}
          >
            <Select.Option value={currentAppDetail?.versions?.currentVersion}>
              {currentAppDetail?.versions?.currentVersion}
            </Select.Option>
            {currentAppDetail?.versions?.pendingVersion && (
              <Select.Option value={currentAppDetail?.versions?.pendingVersion}>
                {currentAppDetail?.versions?.pendingVersion}
              </Select.Option>
            )}
          </Select>
          <Button
            className='text-blue-link ml-3'
            icon={<SyncOutlined />}
            type='text'
            iconPosition='start'
            onClick={() => setUpdateDeployDrawerVisible(true)}
          >
            Update
          </Button>
        </div>
      )}
      {currentAppDetail.status === AppStatusType.UnDeployed && (
        <Button type='text' size='small' className='bg-gray-D6 relative top-1'>
          UnDeployed
        </Button>
      )}
      {editAppDrawerVisible && (
        <CreateAppDrawer
          type={1}
          title='Edit App'
          appDetail={currentAppDetail}
          createAppDrawerVisible={editAppDrawerVisible}
          setCreateAppDrawerVisible={setEditAppDrawerVisible}
          messageApi={messageApi}
        />
      )}
      {updateDeployDrawerVisible && (
        <DeployDrawer
          type={1}
          title='Update app'
          version={currentVersion}
          deployDrawerVisible={updateDeployDrawerVisible}
          setDeployDrawerVisible={setUpdateDeployDrawerVisible}
          messageApi={messageApi}
        />
      )}
    </div>
  );
}
