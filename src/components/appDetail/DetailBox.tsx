'use client';
import { Col, Row, Tag } from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

import { calculateTimeDifference } from '@/lib/utils';

import Copy from '@/components/Copy';

import { useAppSelector } from '@/store/hooks';

import { getAssetsList } from '@/api/requestMarket';

import { CreateAppResponse } from '@/types/appType';

type DetailBoxProps = {
  readonly currentAppDetail: CreateAppResponse;
};

export default function DetailBox({ currentAppDetail }: DetailBoxProps) {
  const { processorAssetListSlice } = useAppSelector((state) => state.app);
  const [isFreeCapacity, setIsFreeCapacity] = useState(false);
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState(0);

  const getFreeAssetsTemp = useCallback(async () => {
    if (!currentAppDetail?.appId) {
      return;
    }
    // step:1 checkout asset list length is 0
    const getResourceAssetListRes = await getAssetsList({
      appId: currentAppDetail?.appId,
      category: 1, // 1: Resource
      skipCount: 0,
      maxResultCount: 100,
    });
    console.log('getResourceAssetListRes', getResourceAssetListRes);
    if (getResourceAssetListRes?.totalCount === 2) {
      getResourceAssetListRes?.items?.map((item) => {
        if (item?.freeQuantity > 0) {
          setIsFreeCapacity(true);
          setEndTime(item?.endTime);
          setStatus(item?.status);
        } else {
          setIsFreeCapacity(false);
        }
      });
    } else {
      setIsFreeCapacity(false);
    }
  }, [currentAppDetail?.appId]);

  useEffect(() => {
    getFreeAssetsTemp();
  }, [getFreeAssetsTemp]);

  return (
    <div className='bg-gray-F5 mt-[30px] flex w-full items-start justify-start rounded-md px-[20px] py-[30px]'>
      <Row gutter={24} className='w-full'>
        <Col sm={24} md={14} className='min-w-[340px]'>
          <div className='text-block mb-[24px] text-xl font-medium'>
            {currentAppDetail?.appName}
            {isFreeCapacity && (
              <span>
                <Tag color='green' className='mx-[10px]'>
                  Free trial
                </Tag>
                {status !== 0 && (
                  <Tag color='red'>
                    <Image
                      src='/assets/svg/time-circle.svg'
                      alt='time'
                      width={16}
                      height={16}
                      className='relative top-[-1px] mr-[8px] inline-block'
                    />
                    {calculateTimeDifference(endTime)} left
                  </Tag>
                )}
              </span>
            )}
          </div>
          <div className='mb-[24px] flex justify-start'>
            <Copy label='Network' content='aelf' />
            <Copy
              className='mx-[32px]'
              label='Last updated'
              content={dayjs(currentAppDetail?.updateTime).format('YYYY-MM-DD')}
            />
            <Copy
              label='Created'
              content={dayjs(currentAppDetail?.createTime).format('YYYY-MM-DD')}
            />
            {processorAssetListSlice?.length === 1 && (
              <Copy
                className='ml-[32px]'
                label='AeIndexer capacity'
                content={processorAssetListSlice[0]?.merchandise?.specification}
              />
            )}
          </div>
          {currentAppDetail?.description && (
            <Copy
              label='Description'
              content={currentAppDetail?.description}
              className='relative mb-4 w-[80%] overflow-hidden'
            />
          )}
        </Col>
        <Col sm={24} md={10} className='flex flex-col'>
          <Copy
            label='AppID'
            content={currentAppDetail?.appId}
            isShowCopy={true}
          />
          <Copy
            className='my-[24px]'
            label='Deploy Key'
            content={currentAppDetail?.deployKey ?? ''}
            isShowCopy={true}
            showLittle={true}
          />
          {currentAppDetail?.sourceCodeUrl && (
            <Copy
              label='SourceCodeUrl'
              content={currentAppDetail?.sourceCodeUrl}
              isShowCopy={true}
            />
          )}
        </Col>
      </Row>
    </div>
  );
}
