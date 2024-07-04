const { NEXT_PUBLIC_NETWORK_KEY } = process.env;

// devnet | localnet
let AeFinderHost = 'http://192.168.71.128:8081';
let AeFinderAuthHost = 'http://192.168.71.128:8082';

// testnet
if (NEXT_PUBLIC_NETWORK_KEY === 'testnet') {
  AeFinderHost = 'https://gcptest-indexer-api.aefinder.io';
  AeFinderAuthHost = 'https://gcptest-indexer-auth.aefinder.io';
}

module.exports = [
  {
    source: '/api/:path*',
    destination: `${AeFinderHost}/api/:path*`,
  },
  {
    source: '/connect/:path*',
    destination: `${AeFinderAuthHost}/connect/:path*`,
  },
  {
    source: '/assets/_next/:path*',
    destination: '/_next/:path*',
  },
];
