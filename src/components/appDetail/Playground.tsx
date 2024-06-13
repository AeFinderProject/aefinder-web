import { LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import { useAppSelector } from '@/store/hooks';

import { PlaygroundHost } from '@/constant';

export default function Playground() {
  const { currentAppDetail, currentVersion } = useAppSelector(
    (state) => state.app
  );
  const [src, setSrc] = useState<string>('');
  const { appId } = currentAppDetail;
  const [iframeLoading, setIframeLoading] = useState<boolean>(true);

  useEffect(() => {
    const tempSrc = `${PlaygroundHost}/${appId}/${currentVersion}/ui/playground`;
    setSrc(tempSrc);
    const iframe = document.getElementById('iframeId');
    iframe?.setAttribute('src', tempSrc);
  }, [appId, currentVersion]);
  console.log(src);
  return (
    <div>
      {iframeLoading && (
        <div className='flex items-center justify-center'>
          <LoadingOutlined />
        </div>
      )}
      <iframe
        id='iframeId'
        title='Playground Page'
        src={src}
        width='100%'
        height='500px'
        allowFullScreen
        onLoad={() => setIframeLoading(false)}
        onLoadCapture={() => setIframeLoading(false)}
      />
    </div>
  );
}
