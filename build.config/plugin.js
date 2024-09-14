module.exports = [
  (nextConfig) => {
    return {
      ...nextConfig,
      assetPrefix: '/assets',
      basePath: '/assets',
    };
  },
];
