import path from 'path';

import rewritesConfig from './rewrites/index';
// const rewritesConfig = require('./rewrites/index');
// const path = require('path');

module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return rewritesConfig;
  },
  images: {
    // loader: 'akamai',
    // path: '',
    domains: [],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },

  productionBrowserSourceMaps: true,
  // eslint-disable-next-line
  webpack: (config, { webpack }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    config.ignoreWarnings = [{ module: /node_modules/ }];
    return config;
  },
};
