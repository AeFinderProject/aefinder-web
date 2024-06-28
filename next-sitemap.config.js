/**
 * @type {import('next-sitemap').IConfig}
 * @see https://aefinder.io/
 */
module.exports = {
  siteUrl: 'https://aefinder.io/',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
