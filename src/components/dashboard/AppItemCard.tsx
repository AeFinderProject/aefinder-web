'use client';
import type { TourProps } from 'antd';
import { Col, Row, Tour } from 'antd';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  AppStatusType,
  CreateAppResponse,
  CurrentTourStepEnum,
} from '@/types/appType';

type AppItemProps = {
  readonly appList: CreateAppResponse[];
};

export default function AppItemCard({ appList }: AppItemProps) {
  const router = useRouter();
  const listRef = useRef<HTMLDivElement>(null);
  const [openListTour, setOpenListTour] = useState(false);
  const currentTourStep = localStorage.getItem('currentTourStep');

  const ListSteps: TourProps['steps'] = [
    {
      title: (
        <div className='text-dark-normal font-semibold'>AeIndexer list</div>
      ),
      description: 'You can find all your AeIndexers here.',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      target: () => listRef.current!,
      nextButtonProps: {
        children: 'Ok',
        className: 'w-[290px] h-[40px] relative right-[10px]',
      },
      style: {
        width: '320px',
      },
      placement: 'top',
    },
  ];

  useEffect(() => {
    if (currentTourStep === CurrentTourStepEnum.HaveCreateAeIndexer) {
      setOpenListTour(true);
    }
  }, [currentTourStep]);

  const handleListCloseTour = useCallback(() => {
    if (currentTourStep === CurrentTourStepEnum.HaveCreateAeIndexer) {
      localStorage.setItem(
        'currentTourStep',
        CurrentTourStepEnum.DeployAeIndexer
      );
    }
    setOpenListTour(false);
  }, [currentTourStep]);

  const handleAppDetail = useCallback(
    (appId: string) => {
      // currentTourStep change to DeployAeIndexer
      handleListCloseTour();
      router.push(`/apps?appId=${appId}`);
    },
    [handleListCloseTour, router]
  );

  return (
    <div className='px-[16px] pb-[30px] sm:px-[40px] sm:pb-[24px] sm:pt-[14px]'>
      <Row gutter={24}>
        {appList.map((item, index) => (
          <Col
            key={item.appId}
            className='gutter-row p-[16px]'
            xs={12}
            sm={8}
            lg={6}
            ref={index === 0 ? listRef : null}
          >
            <div
              onClick={() => handleAppDetail(item.appId)}
              className='border-gray-E0 bg-gray-F5 flex h-[280px] cursor-pointer flex-col items-center justify-center rounded-lg border'
            >
              <div
                className={clsx(
                  'absolute left-[28px] top-[28px] h-[30px] rounded px-[6px] leading-8 text-white',
                  item.status === 0 ? 'bg-gray-D6' : 'bg-blue-link'
                )}
              >
                {AppStatusType[item.status]}
              </div>
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
      <Tour
        open={openListTour}
        onClose={() => handleListCloseTour()}
        steps={ListSteps}
        onFinish={() => {
          setOpenListTour(false);
        }}
      />
    </div>
  );
}
