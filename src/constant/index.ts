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
    RPC_SERVER_AELF: 'https://aelf-test-node.aelf.io',
    RPC_SERVER_TDVV: 'https://tdvw-test-node.aelf.io',
    RPC_SERVER_TDVW: 'https://tdvw-test-node.aelf.io',
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
    RPC_SERVER_AELF: 'https://aelf-test-node.aelf.io',
    RPC_SERVER_TDVV: 'https://tdvw-test-node.aelf.io',
    RPC_SERVER_TDVW: 'https://tdvw-test-node.aelf.io',
  },
  testnet: {
    AeFinderHost: 'https://test-indexer-api.aefinder.io',
    AeFinderAuthHost: 'https://test-indexer-auth.aefinder.io',
    CollectorEndpoint: 'https://otel.aelf.com/v1/traces',
    GRAPHQL_SERVER:
      'https://dapp-aa-portkey-test.portkey.finance/aefinder-v2/api/app/graphql/portkey',
    CONNECT_SERVER: 'https://auth-aa-portkey-test.portkey.finance',
    SERVICE_SERVER: 'https://aa-portkey-test.portkey.finance',
    NETWORK_TYPE: NetworkEnum.TESTNET,
    CHAIN_ID: 'tDVW',
    RPC_SERVER_AELF: 'https://aelf-test-node.aelf.io',
    RPC_SERVER_TDVV: 'https://tdvw-test-node.aelf.io',
    RPC_SERVER_TDVW: 'https://tdvw-test-node.aelf.io',
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
    RPC_SERVER_AELF: 'https://aelf-public-node.aelf.io',
    RPC_SERVER_TDVV: 'https://tdvv-public-node.aelf.io',
    RPC_SERVER_TDVW: 'https://tdvv-public-node.aelf.io',
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

export const RPC_SERVER_AELF =
  networkHostMap[network as networkType]?.RPC_SERVER_AELF;

export const RPC_SERVER_TDVV =
  networkHostMap[network as networkType]?.RPC_SERVER_TDVV;

export const RPC_SERVER_TDVW =
  networkHostMap[network as networkType]?.RPC_SERVER_TDVW;

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
