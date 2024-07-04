'use client';
import { Button, Col, Row } from 'antd';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { AppStatusType, CreateAppResponse } from '@/types/appType';

type AppItemProps = {
  appList: CreateAppResponse[];
};

export default function AppItemCard({ appList }: AppItemProps) {
  const router = useRouter();

  const handleAppDetail = (appId: string) => {
    router.push(`/apps/${appId}?currentTab=playground`);
  };

  return (
    <div className='px-[16px] pb-[30px] sm:px-[40px] sm:py-[24px]'>
      <Row gutter={24}>
        {appList.map((item) => (
          <Col
            key={item.appId}
            className='gutter-row p-[16px]'
            xs={12}
            sm={8}
            lg={6}
          >
            <div
              onClick={() => handleAppDetail(item.appId)}
              className='border-gray-E0 bg-gray-F5 flex h-[280px] cursor-pointer flex-col items-center justify-center border'
            >
              <Button
                size='small'
                className={clsx(
                  'absolute left-6 top-6 h-[30px] text-white',
                  item.status === 0 ? 'bg-gray-D6' : 'bg-blue-link'
                )}
              >
                {AppStatusType[item.status]}
              </Button>
              <Image
                src='/assets/svg/app-default-bg.svg'
                alt='app-bg'
                width={120}
                height={120}
                className='mt-7'
              />
              <div className='text-block mb-2 mt-4 max-w-[80%] truncate text-2xl'>
                {item.appName}
              </div>
              <div className='text-gray-80 max-w-[80%] truncate text-center text-sm'>
                {item.description}
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
