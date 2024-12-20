const NEXT_PUBLIC_NETWORK_KEY = process.env.NEXT_PUBLIC_NETWORK_KEY;

// devnet | localnet
let AeFinderHost = 'http://192.168.71.128:8081';
let AeFinderAuthHost = 'http://192.168.71.128:8082';

// testnet
if (NEXT_PUBLIC_NETWORK_KEY === 'testnet') {
  AeFinderHost = 'https://test-indexer-api.aefinder.io';
  AeFinderAuthHost = 'https://test-indexer-auth.aefinder.io';
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
