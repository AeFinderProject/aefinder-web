'use client';

// import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import { useCallback } from 'react';

import 'graphiql/graphiql.css';

import { useAppSelector } from '@/store/hooks';

import GuestPlayground from './GuestPlayground/GuestPlayground';

export default function Playground() {
  const { currentVersion } = useAppSelector((state) => state.app);
  const isGuest = sessionStorage.getItem('isGuest');

  const getGraphiqlhUI = useCallback(() => {
    // when currentVersion is null, it means the app is not deployed
    if (!currentVersion) return;
    // const tempFetcher = createGraphiQLFetcher({
    //   url: `https://app-testnet.aefinder.io/wahaha0918/754ad75b47294dc5ba0dcac06110d839/graphql`,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    // eslint-disable-next-line
    const graphQLFetcher = async (graphQLParams: any) => {
      const response = await fetch(
        'https://app-testnet.aefinder.io/wahaha0918/754ad75b47294dc5ba0dcac06110d839/graphql',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(graphQLParams),
        }
      );

      return response.json();
    };

    localStorage.removeItem('graphiql:query');
    localStorage.removeItem('graphiql:tabState');
    localStorage.setItem('graphiql:theme', 'light');
    return <GraphiQL fetcher={graphQLFetcher} editorTheme='Light' />;
  }, [currentVersion]);

  return (
    <div id='graphiql-box' className='relative h-[756px] w-full'>
      {isGuest === 'true' ? <GuestPlayground /> : getGraphiqlhUI()}
    </div>
  );
}
