// next-sitemap.config.js
// PERBAIKAN T-5: generate sitemap.xml + robots.txt otomatis saat build.
// Install:  npm i -D next-sitemap
// Tambah di package.json scripts:  "postbuild": "next-sitemap"
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_ORIGIN || 'https://pemdi-aceh-tengah.vercel.app',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/admin', '/admin/*', '/api/*'],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }],
  },
  // Tambahkan halaman dinamis OPD jika perlu, lewat additionalPaths
};
