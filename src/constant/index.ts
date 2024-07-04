const network = process.env.NEXT_PUBLIC_NETWORK_KEY || 'localnet';

const networkHostMap = {
  localnet: {
    AeFinderHost: '',
    AeFinderAuthHost: '',
  },
  devnet: {
    AeFinderHost: 'http://192.168.71.128:8081',
    AeFinderAuthHost: 'http://192.168.71.128:8082',
  },
  testnet: {
    AeFinderHost: 'https://gcptest-indexer-api.aefinder.io',
    AeFinderAuthHost: 'https://gcptest-indexer-auth.aefinder.io',
  },
  mainnet: {
    AeFinderHost: 'https://indexer-api.aefinder.io',
    AeFinderAuthHost: 'https://indexer-auth.aefinder.io',
  },
};

export type networkType = 'mainnet' | 'testnet' | 'devnet' | 'localnet';
export const AeFinderHost = networkHostMap[network as networkType].AeFinderHost;
export const AeFinderAuthHost =
  networkHostMap[network as networkType].AeFinderAuthHost;

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
