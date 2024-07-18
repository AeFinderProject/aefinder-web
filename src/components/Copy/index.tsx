import { CopyOutlined } from '@ant-design/icons';
import { message } from 'antd';
import clsx from 'clsx';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { formatStr2Ellipsis } from '@/lib/utils';

type CopyProps = {
  readonly label?: string;
  readonly content: string | number;
  readonly isShowCopy?: boolean;
  readonly className?: string;
  readonly showLittle?: boolean;
};

message.config({
  top: 100,
  duration: 2,
  maxCount: 2,
});

export default function Copy({
  label,
  content,
  isShowCopy = false,
  className,
  showLittle,
}: CopyProps) {
  const [messageApi, contextHolder] = message.useMessage();

  const handleCopy = () => {
    messageApi.success({
      content: 'Copied',
      key: 'copy',
    });
  };

  return (
    <div className={clsx('inline-block', className)}>
      {contextHolder}
      <div className='text-gray-80 mb-[10px] text-xs'>{label}</div>
      <div className='text-block text-base font-medium'>
        <span className='mr-2 max-w-[80%] overflow-hidden whitespace-pre-wrap break-words'>
          {showLittle ? formatStr2Ellipsis(String(content), [8, 9]) : content}
        </span>
        {isShowCopy && (
          <CopyToClipboard
            text={content}
            onCopy={() => handleCopy()}
            style={{ color: '#ADADAD' }}
          >
            <CopyOutlined />
          </CopyToClipboard>
        )}
      </div>
    </div>
  );
}
