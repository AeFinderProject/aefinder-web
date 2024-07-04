const AeFinderHost = 'https://indexer-api.aelf.io';
const AeFinderAuthHost = 'https://indexer-auth.aefinder.io';

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
