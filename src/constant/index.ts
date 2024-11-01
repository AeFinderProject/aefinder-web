import { NetworkEnum, TChainId } from '@aelf-web-login/wallet-adapter-base';

const network = process.env.NEXT_PUBLIC_NETWORK_KEY || 'localnet';

const networkHostMap = {
  localnet: {
    AeFinderHost: '',
    AeFinderAuthHost: '',
    CollectorEndpoint: '',
    GRAPHQL_SERVER:
      'https://dapp-aa-portkey-test.portkey.finance/aefinder-v2/api/app/graphql/portkey',
    CONNECT_SERVER: 'https://auth-aa-portkey-test.portkey.finance',
    SERVICE_SERVER: 'https://aa-portkey-test.portkey.finance',
    NETWORK_TYPE: NetworkEnum.TESTNET,
    CHAIN_ID: 'tDVW',
  },
  devnet: {
    AeFinderHost: 'http://192.168.71.128:8081',
    AeFinderAuthHost: 'http://192.168.71.128:8082',
    CollectorEndpoint: '',
    GRAPHQL_SERVER:
      'https://dapp-aa-portkey-test.portkey.finance/aefinder-v2/api/app/graphql/portkey',
    CONNECT_SERVER: 'https://auth-aa-portkey-test.portkey.finance',
    SERVICE_SERVER: 'https://aa-portkey-test.portkey.finance',
    NETWORK_TYPE: NetworkEnum.TESTNET,
    CHAIN_ID: 'tDVW',
  },
  testnet: {
    AeFinderHost: 'https://gcptest-indexer-api.aefinder.io',
    AeFinderAuthHost: 'https://gcptest-indexer-auth.aefinder.io',
    CollectorEndpoint: 'https://otel.aelf.com/v1/traces',
    GRAPHQL_SERVER:
      'https://dapp-aa-portkey-test.portkey.finance/aefinder-v2/api/app/graphql/portkey',
    CONNECT_SERVER: 'https://auth-aa-portkey-test.portkey.finance',
    SERVICE_SERVER: 'https://aa-portkey-test.portkey.finance',
    NETWORK_TYPE: NetworkEnum.TESTNET,
    CHAIN_ID: 'tDVW',
  },
  mainnet: {
    AeFinderHost: 'https://indexer-api.aefinder.io',
    AeFinderAuthHost: 'https://indexer-auth.aefinder.io',
    CollectorEndpoint: 'https://otel-mainnet.aelf.com/v1/traces',
    GRAPHQL_SERVER:
      'https://dapp-aa-portkey.portkey.finance/aefinder-v2/api/app/graphql/portkey',
    CONNECT_SERVER: 'https://auth-aa-portkey.portkey.finance',
    SERVICE_SERVER: 'https://aa-portkey.portkey.finance',
    NETWORK_TYPE: NetworkEnum.MAINNET,
    CHAIN_ID: 'tDVV',
  },
};

export type networkType = 'mainnet' | 'testnet' | 'devnet' | 'localnet';
export const AeFinderHost =
  networkHostMap[network as networkType]?.AeFinderHost;

export const AeFinderAuthHost =
  networkHostMap[network as networkType]?.AeFinderAuthHost;

export const CollectorEndpoint =
  networkHostMap[network as networkType]?.CollectorEndpoint;

export const GRAPHQL_SERVER =
  networkHostMap[network as networkType]?.GRAPHQL_SERVER;

export const CONNECT_SERVER =
  networkHostMap[network as networkType]?.CONNECT_SERVER;

export const SERVICE_SERVER =
  networkHostMap[network as networkType]?.SERVICE_SERVER;

export const NETWORK_TYPE =
  networkHostMap[network as networkType]?.NETWORK_TYPE;

export const CHAIN_ID = networkHostMap[network as networkType]
  ?.CHAIN_ID as TChainId;

export const LogsColor = {
  Debug: '#1890ff',
  Error: '#F53F3F',
  Warning: '#FF9900',
  Information: '#00B73E',
};

export const LogsText = {
  Debug: 'Debug',
  Error: 'Error',
  Warning: 'Warn',
  Information: 'Info',
};
