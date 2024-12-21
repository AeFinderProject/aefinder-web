// eslint-disable-next-line @typescript-eslint/no-var-requires
const commonConfig = require('./common');
module.exports = {
  ...commonConfig,
  swcMinify: true,
  // todo: enable removeConsole when test end
  // compiler: {
  //   removeConsole: {
  //     exclude: ['error'],
  //   },
  // },
};
