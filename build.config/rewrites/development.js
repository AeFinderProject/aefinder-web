// testnet
// const AeFinderHost = 'https://gcptest-indexer-api.aefinder.io';
// const AeFinderAuthHost = 'https://gcptest-indexer-auth.aefinder.io';

// devnet
const AeFinderHost = 'http://192.168.71.128:8081';
const AeFinderAuthHost = 'http://192.168.71.128:8082';

module.exports = [
  {
    source: '/api/:path*',
    destination: `${AeFinderHost}/api/:path*`,
  },
  {
    source: '/connect/:path*',
    destination: `${AeFinderAuthHost}/connect/:path*`,
  },
];
