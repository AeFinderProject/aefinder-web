import { Progress } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import {
  bytesToGiB,
  calcDiv100,
  convertToGiB,
  formatToTwoDecimals,
  processValue,
  useThrottleCallback,
} from '@/lib/utils';

import { useAppSelector } from '@/store/hooks';

import { getFullPodUsage, getResourceUsage } from '@/api/requestMarket';

import {
  FullPodUsageItem,
  GetResourceUsageResponse,
  usageItem,
} from '@/types/marketType';

export default function Capacity() {
  const [podUsage, setPodUsage] = useState<FullPodUsageItem[]>();
  const [storageUsage, setStorageUsage] = useState<usageItem>();

  const currentAppDetail = useAppSelector(
    (state) => state.app.currentAppDetail
  );
  const currentVersion = useAppSelector((state) => state.app.currentVersion);

  const getFullPodUsageTemp = useThrottleCallback(async () => {
    if (!currentAppDetail?.appId || !currentVersion) return;
    const res = await getFullPodUsage({
      appId: currentAppDetail?.appId,
      version: currentVersion,
      skipCount: 0,
      maxResultCount: 50,
    });
    if (res?.length > 0) {
      setPodUsage(res);
    }
  }, [currentAppDetail?.appId, currentVersion]);

  const getResourceUsageTemp = useThrottleCallback(async () => {
    if (!currentAppDetail?.appId) return;
    const res: GetResourceUsageResponse = await getResourceUsage({
      appId: currentAppDetail?.appId,
    });

    if (res?.resourceUsages) {
      const tempUsageArray = res?.resourceUsages[currentVersion];
      if (tempUsageArray?.length > 0) {
        tempUsageArray.find((item) => {
          if (item.name === 'Storage') {
            setStorageUsage(item);
          }
        });
      }
    }
  }, [currentAppDetail?.appId, currentVersion]);

  useEffect(() => {
    getFullPodUsageTemp();
    getResourceUsageTemp();
  }, [getFullPodUsageTemp, getResourceUsageTemp]);

  const displayCapacity = useCallback(() => {
    const res = {
      currentCpuUsage: '--',
      currentCpuLimit: '--',
      currentMemoryUsage: '--',
      currentMemoryLimit: '--',
    };
    if (podUsage && podUsage?.length > 0) {
      // 1 fixed 2
      const currentPodUsage = podUsage[0];
      res.currentCpuUsage = formatToTwoDecimals(currentPodUsage?.cpuUsage);
      // 2 fixed 2 m/1000 or number
      res.currentCpuLimit = processValue(currentPodUsage?.limitCpu);
      // 3 div 1024 1024 1024 GiB
      res.currentMemoryUsage = bytesToGiB(currentPodUsage?.memoryUsage);
      // 4 Mi Gi -> GiB
      res.currentMemoryLimit = convertToGiB(currentPodUsage?.limitMemory);
    }
    return res;
  }, [podUsage]);

  return (
    <div>
      {(!podUsage || podUsage?.length === 0) && (
        <div className='text-gray-80 text-center'>No Data</div>
      )}
      {((podUsage && podUsage?.length > 0) || storageUsage) && (
        <div>
          <div className='flex items-center justify-between'>
            <div>AeIndexer Capacity</div>
            <div className='text-gray-80 text-xs'>
              {(podUsage && podUsage[0]?.currentState) || '--'}
            </div>
          </div>
          <div className='mt-[14px] flex items-center justify-between gap-[14px]'>
            {podUsage && podUsage?.length > 0 && (
              <div className='border-gray-E0 flex-1 rounded-lg border p-[24px]'>
                <div className='text-gray-80'>CPU</div>
                <div className='text-dark-normal mb-[6px] mt-[8px] font-medium'>
                  {displayCapacity()?.currentCpuUsage} /{' '}
                  {displayCapacity()?.currentCpuLimit}
                </div>
                <Progress
                  percent={calcDiv100(
                    Number(displayCapacity()?.currentCpuUsage),
                    Number(displayCapacity()?.currentCpuLimit)
                  )}
                  showInfo={false}
                />
              </div>
            )}
            {podUsage && podUsage?.length > 0 && (
              <div className='border-gray-E0 flex-1 rounded-lg border p-[24px]'>
                <div className='text-gray-80'>RAM</div>
                <div className='text-dark-normal mb-[6px] mt-[8px] font-medium'>
                  {displayCapacity()?.currentMemoryUsage} /{' '}
                  {displayCapacity()?.currentMemoryLimit}
                </div>
                <Progress
                  percent={calcDiv100(
                    displayCapacity()?.currentMemoryUsage,
                    displayCapacity()?.currentMemoryLimit
                  )}
                  showInfo={false}
                />
              </div>
            )}
            {storageUsage && (
              <div className='border-gray-E0 flex-1 rounded-lg border p-[24px]'>
                <div className='text-gray-80'>Disk</div>
                <div className='text-dark-normal mb-[6px] mt-[8px] font-medium'>
                  {storageUsage?.usage} / {storageUsage?.limit} GB
                </div>
                <Progress
                  percent={calcDiv100(storageUsage?.usage, storageUsage?.limit)}
                  showInfo={false}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
