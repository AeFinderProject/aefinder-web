const network = process.env.NEXT_PUBLIC_NETWORK_KEY || 'localnet';

const networkHostMap = {
  localnet: {
    AeFinderHost: '',
    AeFinderAuthHost: '',
    CollectorEndpoint: '',
  },
  devnet: {
    AeFinderHost: 'http://192.168.71.128:8081',
    AeFinderAuthHost: 'http://192.168.71.128:8082',
    CollectorEndpoint: '',
  },
  testnet: {
    AeFinderHost: 'https://gcptest-indexer-api.aefinder.io',
    AeFinderAuthHost: 'https://gcptest-indexer-auth.aefinder.io',
    CollectorEndpoint: 'https://otel.aelf.com/v1/traces',
  },
  mainnet: {
    AeFinderHost: 'https://indexer-api.aefinder.io',
    AeFinderAuthHost: 'https://indexer-auth.aefinder.io',
    CollectorEndpoint: 'https://otel-mainnet.aelf.com/v1/traces',
  },
};

export type networkType = 'mainnet' | 'testnet' | 'devnet' | 'localnet';
export const AeFinderHost =
  networkHostMap[network as networkType]?.AeFinderHost;

export const AeFinderAuthHost =
  networkHostMap[network as networkType]?.AeFinderAuthHost;

export const CollectorEndpoint =
  networkHostMap[network as networkType]?.CollectorEndpoint;

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
