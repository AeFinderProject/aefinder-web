import { CopyOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { MessageInstance } from 'antd/es/message/interface';
import clsx from 'clsx';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

type LogsItemProps = {
  readonly message: string;
  readonly exception: string;
  readonly messageApi: MessageInstance;
};

export default function LogsItem({
  message,
  exception,
  messageApi,
}: LogsItemProps) {
  const [isShow, setIsShow] = useState(false);

  const handleCopy = () => {
    messageApi.success({
      content: 'Copied',
      key: 'copy',
    });
  };

  return (
    <div className={clsx('overflow-wrap relative w-full flex-1')}>
      <div className='text-gray-80 absolute right-0 top-0 cursor-pointer'>
        {isShow ? (
          <div className='relative right-[-14px] flex flex-col'>
            <UpOutlined
              className='mb-[10px]'
              onClick={() => setIsShow(!isShow)}
            />
            <CopyToClipboard
              text={message + exception}
              onCopy={() => handleCopy()}
            >
              <CopyOutlined />
            </CopyToClipboard>
          </div>
        ) : (
          <DownOutlined
            className='relative right-[-14px]'
            onClick={() => setIsShow(!isShow)}
          />
        )}
      </div>
      <div
        className={clsx(
          'w-full max-w-[100%] break-all text-left',
          isShow ? '' : 'line-clamp-3'
        )}
      >
        {message}
      </div>
      <div
        className={clsx(
          'w-full max-w-[100%] break-all text-left font-bold text-black',
          isShow ? '' : 'line-clamp-1'
        )}
      >
        {exception}
      </div>
    </div>
  );
}
