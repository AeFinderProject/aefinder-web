import { Progress, Tag } from 'antd';
import { useEffect, useState } from 'react';

import { useThrottleCallback } from '@/lib/utils';

import { useAppSelector } from '@/store/hooks';

import { getFullPodUsage, getResourcesFull } from '@/api/requestMarket';

import { FullPodUsageItem, ResourcesLevelItem } from '@/types/marketType';

export default function Capacity() {
  const [resources, setResources] = useState<ResourcesLevelItem>();
  const [podUsage, setPodUsage] = useState<FullPodUsageItem>();
  console.log('podUsage', podUsage);

  const currentAppDetail = useAppSelector(
    (state) => state.app.currentAppDetail
  );
  const currentVersion = useAppSelector((state) => state.app.currentVersion);
  const orgUserAll = useAppSelector((state) => state.app.orgUserAll);

  const getResourcesFullTemp = useThrottleCallback(async () => {
    if (!currentAppDetail?.appId || !orgUserAll?.id) return;
    const res = await getResourcesFull({
      appId: currentAppDetail?.appId,
      organizationId: orgUserAll?.id,
    });
    if (res?.productId) {
      setResources(res);
    }
  }, [currentAppDetail?.appId, orgUserAll?.id]);

  useEffect(() => {
    getResourcesFullTemp();
  }, [getResourcesFullTemp, currentAppDetail?.appId, orgUserAll?.id]);

  const getFullPodUsageTemp = useThrottleCallback(async () => {
    if (!currentAppDetail?.appId || !currentVersion) return;
    const res = await getFullPodUsage({
      appId: currentAppDetail?.appId,
      version: currentVersion,
      skipCount: 0,
      maxResultCount: 50,
    });
    if (res?.length > 0) {
      setPodUsage(res?.[0]);
    }
  }, [currentAppDetail?.appId, currentVersion]);

  useEffect(() => {
    getFullPodUsageTemp();
  }, [getFullPodUsageTemp, currentAppDetail?.appId, currentVersion]);

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
          AeIndexer Capacity
          <Tag color='processing' className='ml-[8px]'>
            {resources?.levelName}
          </Tag>
        </div>
        <div className='text-gray-80 text-xs'>
          Est. {resources?.monthlyUnitPrice} USDT/Month
        </div>
      </div>
      <div className='mt-[14px] flex items-center justify-between gap-[14px]'>
        <div className='border-gray-E0 flex-1 rounded-lg border p-[24px]'>
          <div className='text-gray-80'>CPU</div>
          <div className='text-dark-normal mb-[6px] mt-[8px] font-medium'>
            {podUsage?.cpuUsage || '--'} / {podUsage?.limitCpu || '--'}
          </div>
          <Progress percent={20} showInfo={false} />
        </div>
        <div className='border-gray-E0 flex-1 rounded-lg border p-[24px]'>
          <div className='text-gray-80'>RAM</div>
          <div className='text-dark-normal mb-[6px] mt-[8px] font-medium'>
            {podUsage?.memoryUsage || '--'} / {podUsage?.limitMemory || '--'}MB
          </div>
          <Progress percent={45} showInfo={false} />
        </div>
        <div className='border-gray-E0 flex-1 rounded-lg border p-[24px]'>
          <div className='text-gray-80'>Disk</div>
          <div className='text-dark-normal mb-[6px] mt-[8px] font-medium'>
            3.1 / 10GB
          </div>
          <Progress percent={31} showInfo={false} />
        </div>
      </div>
    </div>
  );
}
