import { MessageInstance } from 'antd/es/message/interface';
import { useEffect, useState } from 'react';

import { useAppSelector } from '@/store/hooks';

import { PlaygroundHost } from '@/constant';

type PlaygroundProps = {
  messageApi: MessageInstance;
};

export default function Playground({ messageApi }: PlaygroundProps) {
  const { currentAppDetail, currentVersion } = useAppSelector(
    (state) => state.app
  );
  const [src, setSrc] = useState<string>('');
  const { appId } = currentAppDetail;

  useEffect(() => {
    messageApi.destroy();
    messageApi.open({
      type: 'loading',
      content: 'Loading Playground...',
      duration: 2,
    });
    setSrc(`${PlaygroundHost}/${appId}/${currentVersion}/ui/playground`);
  }, [appId, currentVersion, messageApi]);
  console.log(src);
  return (
    <div>
      <iframe
        title='Playground Page'
        src={src}
        width='100%'
        height='500px'
        allowFullScreen
      />
    </div>
  );
}
