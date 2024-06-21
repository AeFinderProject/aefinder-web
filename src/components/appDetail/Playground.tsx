import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
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
  const [num, setNum] = useState<number>(0);

  useEffect(() => {
    const tempSrc = `${PlaygroundHost}/${appId}/${currentVersion}/ui/playground?num=${num}`;
    setSrc(tempSrc);
    const iframe = document.getElementById('iframeId');
    iframe?.setAttribute('src', tempSrc);
  }, [appId, currentVersion, num]);
  console.log(src);

  const handleRefresh = () => {
    setNum(num + 1);
    setIframeLoading(true);
  };

  return (
    <div className='relative'>
      {iframeLoading && (
        <div className='absolute z-10 flex h-[600px] w-full flex-col items-center  justify-center bg-white'>
          <LoadingOutlined className='text-blue-link mb-2' />
          <div className='text-gray-80 text-sm'>Loading playground...</div>
        </div>
      )}
      {!iframeLoading && (
        <div className='absolute right-[30px] top-[17px] z-10 flex w-[50px] items-center justify-center'>
          <ReloadOutlined
            className='text-blue-link mr-2 cursor-pointer'
            onClick={() => handleRefresh()}
          />
        </div>
      )}
      <iframe
        key={src}
        id='iframeId'
        title='Playground Page'
        src={src}
        width='100%'
        height='600px'
        allowFullScreen
        onLoad={() => setIframeLoading(false)}
      />
    </div>
  );
}
