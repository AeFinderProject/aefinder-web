'use client';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import type { TourProps } from 'antd';
import { Tour } from 'antd';
import { GraphiQL } from 'graphiql';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import 'graphiql/graphiql.css';

import { useAppSelector } from '@/store/hooks';

import { appApiList } from '@/api/list';

import GuestPlayground from './GuestPlayground/GuestPlayground';

import { CurrentTourStepEnum } from '@/types/appType';

type PlaygroundProps = {
  readonly isNeedRefresh: boolean;
  readonly currentTable: string;
};

export default function Playground({
  isNeedRefresh,
  currentTable,
}: PlaygroundProps) {
  const PlaygroundRef = useRef<HTMLDivElement>(null);
  const [openPlaygroundTour, setOpenPlaygroundTour] = useState(false);
  const { currentAppDetail, currentVersion } = useAppSelector(
    (state) => state.app
  );
  const { appId } = currentAppDetail;
  const isGuest = sessionStorage.getItem('isGuest');
  const currentTourStep = localStorage.getItem('currentTourStep');

  const PlaygroundSteps: TourProps['steps'] = [
    {
      title: <div className='text-dark-normal font-semibold'>Playground</div>,
      description:
        'Playground allows you to explore AeIndexer data through the web interface.',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      target: () => PlaygroundRef.current!,
      nextButtonProps: {
        children: 'OK',
        className: 'w-[290px] h-[40px] relative right-[10px]',
      },
      style: {
        width: '320px',
      },
      placement: 'top',
    },
  ];

  useEffect(() => {
    if (
      isGuest === 'true' &&
      currentTourStep === CurrentTourStepEnum.UpdateAeIndexer &&
      currentTable === 'playground'
    ) {
      setOpenPlaygroundTour(true);
    }
  }, [isGuest, currentTourStep, currentTable, isNeedRefresh]);

  const handlePlaygroundCloseTour = useCallback(() => {
    localStorage.setItem(
      'currentTourStep',
      CurrentTourStepEnum.PlaygroundAeIndexer
    );
    setOpenPlaygroundTour(false);
  }, []);

  const getGraphiqlhUI = useCallback(() => {
    // when currentVersion is null, it means the app is not deployed
    if (!currentVersion) return;
    const tempFetcher = createGraphiQLFetcher({
      url: `${appApiList?.fetchQraphiql?.target}/${appId}/${currentVersion}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    localStorage.removeItem('graphiql:query');
    localStorage.removeItem('graphiql:tabState');
    localStorage.setItem('graphiql:theme', 'light');
    return <GraphiQL fetcher={tempFetcher} editorTheme='Light' />;
  }, [appId, currentVersion]);

  return (
    <div
      id='graphiql-box'
      ref={PlaygroundRef}
      className='relative h-[756px] w-full'
    >
      {isGuest === 'true' ? <GuestPlayground /> : getGraphiqlhUI()}
      <Tour
        open={openPlaygroundTour}
        onClose={() => handlePlaygroundCloseTour()}
        steps={PlaygroundSteps}
        onFinish={() => handlePlaygroundCloseTour()}
        placement='top'
      />
    </div>
  );
}
