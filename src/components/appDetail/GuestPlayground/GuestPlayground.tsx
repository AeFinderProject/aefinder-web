import { GraphiQL } from 'graphiql';
import { useCallback, useEffect } from 'react';

import 'graphiql/graphiql.css';

import { generateDataArray } from '@/lib/utils';

import db from '@/api/guestDB';

interface GraphQLParams {
  query: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: { [key: string]: any };
  operationName?: string | null;
}

const defaultQuery = `
query TestApp {
  factory (id: "-1") {
    id
    address
    poolCount
    txCount
    totalVolumeUSD
  }
}
`;

export default function GuestPlayground() {
  useEffect(() => {
    localStorage.removeItem('graphiql:query');
    localStorage.removeItem('graphiql:tabState');
    localStorage.setItem('graphiql:theme', 'light');
  });

  const graphQLFetcher = useCallback(async (graphQLParams: GraphQLParams) => {
    try {
      // step 1 get id from graphQLParams
      const regex = /id:\s*"(.*?)"/;
      const match = graphQLParams?.query?.match(regex);
      // step 2 check if id is valid
      const idValue = match ? match[1] : '-1';
      if (idValue <= '20' && idValue > '0') {
        const result = await db.playgroundTable.get(Number(idValue));
        if (!result) {
          const resultArray = generateDataArray();
          await db.playgroundTable.bulkAdd(resultArray);
        }
        // step 3 get data from db
        const tempResult = await db.playgroundTable.get(Number(idValue));
        return {
          data: {
            factory: tempResult,
          },
        };
        // step 4 return data
      } else {
        // return empty data
        return {
          data: {
            factory: {
              id: '',
              address: '',
              poolCount: '',
              totalVolumeUSD: '',
              txCount: '',
            },
            message: 'Please enter a id: 1 ~ 20',
          },
        };
      }
    } catch (error) {
      return { errors: [{ message: error || 'An error occurred' }] };
    }
  }, []);

  return <GraphiQL query={defaultQuery} fetcher={graphQLFetcher} />;
}
