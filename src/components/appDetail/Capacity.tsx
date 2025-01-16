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

import { getFullPodUsage } from '@/api/requestMarket';

import { FullPodUsageItem } from '@/types/marketType';

export default function Capacity() {
  const [podUsage, setPodUsage] = useState<FullPodUsageItem[]>();
  console.log('podUsage', podUsage);

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

  useEffect(() => {
    getFullPodUsageTemp();
  }, [getFullPodUsageTemp]);

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
      {podUsage &&
        podUsage?.length > 0 &&
        podUsage?.map((item, index) => {
          return (
            <div key={index}>
              <div className='flex items-center justify-between'>
                <div>AeIndexer Capacity</div>
                <div className='text-gray-80 text-xs'>{item?.currentState}</div>
              </div>
              <div className='mt-[14px] flex items-center justify-between gap-[14px]'>
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
                {/* <div className='border-gray-E0 flex-1 rounded-lg border p-[24px]'>
                  <div className='text-gray-80'>Disk</div>
                  <div className='text-dark-normal mb-[6px] mt-[8px] font-medium'>
                    -- / -- GB
                  </div>
                  <Progress percent={0} showInfo={false} />
                </div> */}
              </div>
            </div>
          );
        })}
    </div>
  );
}
