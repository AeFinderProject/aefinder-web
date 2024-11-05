'use client';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import React, { useCallback } from 'react';

import { useAppSelector } from '@/store/hooks';

import { appApiList } from '@/api/list';

import GuestPlayground from './GuestPlayground/GuestPlayground';

export default function Playground() {
  const { currentAppDetail, currentVersion } = useAppSelector(
    (state) => state.app
  );
  const { appId } = currentAppDetail;
  const isGuest = sessionStorage.getItem('isGuest');

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
    <div id='graphiql-box' className='relative h-[756px] w-full'>
      {isGuest === 'true' ? <GuestPlayground /> : getGraphiqlhUI()}
    </div>
  );
}
