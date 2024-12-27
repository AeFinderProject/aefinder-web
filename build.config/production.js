// eslint-disable-next-line @typescript-eslint/no-var-requires
const commonConfig = require('./common');
module.exports = {
  ...commonConfig,
  swcMinify: true,
  compiler: {
    removeConsole: {
      exclude: ['error'],
    },
  },
};
