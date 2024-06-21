import { DownOutlined, UpOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import { useState } from 'react';

type LogsItemProps = {
  message: string;
  exception: string;
};

export default function LogsItem({ message, exception }: LogsItemProps) {
  const [isShow, setIsShow] = useState(false);

  return (
    <div className='overflow-wrap relative w-full'>
      <div
        className='text-gray-80 absolute right-0 top-0 cursor-pointer'
        onClick={() => setIsShow(!isShow)}
      >
        {isShow ? (
          <UpOutlined className='relative right-[-14px]' />
        ) : (
          <DownOutlined className='relative right-[-14px]' />
        )}
      </div>
      <div
        className={clsx(
          'w-full max-w-[100%] break-all text-left',
          isShow ? 'truncate-10-lines' : 'truncate-3-lines'
        )}
      >
        {message}
      </div>
      <div className='text-muted w-full max-w-[100%] truncate break-all text-left text-black'>
        {exception}
      </div>
    </div>
  );
}
