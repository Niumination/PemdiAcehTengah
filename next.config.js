/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Enable static export for GitHub Pages if needed,
  // but keep SSR for Vercel fullstack deployment
  output: 'standalone',
}

module.exports = nextConfig
