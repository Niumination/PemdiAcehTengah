// next-sitemap.config.js — dijalankan otomatis pada `postbuild`.
// Mode internal (reposisi 22 Sep 2026): robots.txt melarang seluruh crawler;
// sitemap tetap dibuat (dipakai audit tautan internal), tanpa /api/*.
/** @type {import('next-sitemap').IConfig} */
const { NOINDEX } = require('./lib/modeSitus');

module.exports = {
  siteUrl: process.env.SITE_ORIGIN || 'https://pemdi-aceh-tengah.vercel.app',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/api/*'],
  robotsTxtOptions: {
    policies: NOINDEX
      ? [{ userAgent: '*', disallow: '/' }]
      : [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
  },
};
