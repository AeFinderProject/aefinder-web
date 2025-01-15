import { Progress } from 'antd';
import { useEffect, useState } from 'react';

import { calcDiv, useThrottleCallback } from '@/lib/utils';

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
                    {item?.cpuUsage || '--'} / {item?.limitCpu || '--'}
                  </div>
                  <Progress
                    percent={calcDiv(
                      Number(item?.cpuUsage || 0),
                      Number(item?.limitCpu || 0)
                    )}
                    showInfo={false}
                  />
                </div>
                <div className='border-gray-E0 flex-1 rounded-lg border p-[24px]'>
                  <div className='text-gray-80'>RAM</div>
                  <div className='text-dark-normal mb-[6px] mt-[8px] font-medium'>
                    {item?.memoryUsage || '--'} / {item?.limitMemory || '--'}
                  </div>
                  <Progress
                    percent={calcDiv(
                      Number(item?.memoryUsage || 0),
                      Number(item?.limitMemory || 0)
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
