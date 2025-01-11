'use client';
import { Drawer, Steps } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import React, { useState } from 'react';

import CreateAppStep1 from '@/components/dashboard/CreateAppStep1';
import CreateAppStep2 from '@/components/dashboard/CreateAppStep2';

import { CreateAppResponse } from '@/types/appType';

type CreateAppDrawerProps = {
  readonly type: 0 | 1; // 0 create AeIndexer, 1 modify AeIndexer
  readonly createAppDrawerVisible: boolean;
  readonly setCreateAppDrawerVisible: (visible: boolean) => void;
  readonly appDetail?: CreateAppResponse;
  readonly messageApi: MessageInstance;
};

export default function CreateAppDrawer({
  type,
  createAppDrawerVisible,
  setCreateAppDrawerVisible,
  appDetail,
  messageApi,
}: CreateAppDrawerProps) {
  const [current, setCurrent] = useState(type);
  // crate app step 1 detail
  const [currentAppDetail, setCurrentAppDetail] = useState<CreateAppResponse>(
    appDetail || {
      appId: '',
      appName: '',
      imageUrl: '',
      description: '',
      sourceCodeUrl: '',
      status: 0,
      createTime: 0,
      updateTime: 0,
      isLock: false,
    }
  );

  return (
    <Drawer
      title={current === 0 ? 'Create AeIndexer' : 'Edit AeIndexer'}
      open={createAppDrawerVisible}
      onClose={() => setCreateAppDrawerVisible(false)}
      destroyOnClose={true}
      width={window?.innerWidth > 640 ? 380 : 640}
    >
      {type === 0 && (
        <Steps
          current={current}
          items={[
            {
              title: 'AeIndexer Name',
            },
            {
              title: 'Enter Detail',
            },
          ]}
        />
      )}
      {current === 0 && (
        <CreateAppStep1
          setCurrent={setCurrent}
          setCreateAppDrawerVisible={setCreateAppDrawerVisible}
          currentAppDetail={currentAppDetail}
          setCurrentAppDetail={setCurrentAppDetail}
          messageApi={messageApi}
        />
      )}
      {current === 1 && (
        <CreateAppStep2
          type={type}
          currentAppDetail={currentAppDetail}
          setCreateAppDrawerVisible={setCreateAppDrawerVisible}
          messageApi={messageApi}
        />
      )}
    </Drawer>
  );
}
