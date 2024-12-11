import { Progress, Tag } from 'antd';

export default function Capacity() {
  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
          AeIndexer Capacity
          <Tag color='processing' className='ml-[8px]'>
            Large
          </Tag>
        </div>
        <div className='text-gray-80 text-xs'>Est. $2.42/daily</div>
      </div>
      <div className='mt-[14px] flex items-center justify-between gap-[14px]'>
        <div className='border-gray-E0 flex-1 rounded-lg border p-[24px]'>
          <div className='text-gray-80'>CPU</div>
          <div className='text-dark-normal mb-[6px] mt-[8px] font-medium'>
            0.1/0.5
          </div>
          <Progress percent={20} showInfo={false} />
        </div>
        <div className='border-gray-E0 flex-1 rounded-lg border p-[24px]'>
          <div className='text-gray-80'>RAM</div>
          <div className='text-dark-normal mb-[6px] mt-[8px] font-medium'>
            300 /768 MB
          </div>
          <Progress percent={45} showInfo={false} />
        </div>
        <div className='border-gray-E0 flex-1 rounded-lg border p-[24px]'>
          <div className='text-gray-80'>Disk</div>
          <div className='text-dark-normal mb-[6px] mt-[8px] font-medium'>
            3.1 /10GB
          </div>
          <Progress percent={31} showInfo={false} />
        </div>
      </div>
    </div>
  );
}
