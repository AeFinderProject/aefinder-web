'use client';

import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import { useCallback } from 'react';

import 'graphiql/graphiql.css';

import { useAppSelector } from '@/store/hooks';

import { appApiList } from '@/api/list';

export default function Playground() {
  const { currentAppDetail, currentVersion } = useAppSelector(
    (state) => state.app
  );
  const { appId } = currentAppDetail;

  const getGraphiqlhUI = useCallback(() => {
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
      {getGraphiqlhUI()}
    </div>
  );
}
