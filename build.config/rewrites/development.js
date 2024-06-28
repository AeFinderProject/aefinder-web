// testnet
const AeFinderHost = 'https://k8sgcptest-indexer-api.aefinder.io';
const AeFinderAuthHost = 'https://k8sgcptest-indexer-auth.aefinder.io';

// devnet
// const AeFinderHost = 'http://192.168.71.128:8081';
// const AeFinderAuthHost = 'http://192.168.71.128:8082';

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
