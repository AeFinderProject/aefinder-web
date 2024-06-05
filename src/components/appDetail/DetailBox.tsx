import moment from 'moment';

import Copy from '@/components/Copy';

import { CreateAppResponse } from '@/types/appType';

type DetailBoxProps = {
  currentAppDetail: CreateAppResponse;
};

export default function DetailBox({ currentAppDetail }: DetailBoxProps) {
  return (
    <div className='bg-gray-F5 mt-[30px] flex w-full items-start justify-start rounded-md px-[20px] py-[30px]'>
      <div className='mr-[24px] w-[46%]'>
        <div className='text-block mb-[24px] text-xl font-medium'>
          {currentAppDetail?.appName}
        </div>
        <div className='mb-[24px]'>
          <Copy label='Network' content='aelf' />
          <Copy
            className='mx-[32px]'
            label='Last updated'
            content={moment(currentAppDetail?.UpdateTime).format('YYYY-MM-DD')}
          />
          <Copy
            label='Created'
            content={moment(currentAppDetail?.CreateTime).format('YYYY-MM-DD')}
          />
        </div>
        {currentAppDetail?.description && (
          <Copy label='Description' content={currentAppDetail?.description} />
        )}
      </div>
      <div className='flex flex-col'>
        <Copy
          label='AppID'
          content={currentAppDetail?.appId}
          isShowCopy={true}
        />
        <Copy
          className='my-[24px]'
          label='Deploy Key'
          content={currentAppDetail?.deployKey || ''}
          isShowCopy={true}
        />
        {currentAppDetail?.sourceCodeUrl && (
          <Copy
            label='SourceCodeUrl'
            content={currentAppDetail?.sourceCodeUrl}
            isShowCopy={true}
          />
        )}
      </div>
    </div>
  );
}
