module.exports = {
  siteUrl: process.env.SITE_ORIGIN || 'https://pemdi-aceh-tengah.vercel.app',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/admin', '/admin/*', '/api/*'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] },
    ],
  },
};
