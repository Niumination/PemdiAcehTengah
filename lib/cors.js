/**
 * CORS helper — zero-wildcard untuk write/admin API.
 * Mengizinkan SITE_ORIGIN, Vercel preview domains, dan localhost development.
 */

const ALLOWED_ORIGINS = [
  process.env.SITE_ORIGIN,                // production
  'https://pemdi-aceh-tengah.vercel.app', // fallback
  ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ...(process.env.VERCEL_BRANCH_URL ? [`https://${process.env.VERCEL_BRANCH_URL}`] : []),
  ...(process.env.VERCEL_GIT_REPO_SLUG ? [
    `https://${process.env.VERCEL_GIT_REPO_SLUG}.vercel.app`,
    `https://${process.env.VERCEL_GIT_REPO_SLUG}-git-*.vercel.app`,
  ] : []),
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean);

export function getCorsOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return '*'; // allow non-browser clients (curl, API tools)
  
  // Production origin always allowed
  if (origin === process.env.SITE_ORIGIN || origin === 'https://pemdi-aceh-tengah.vercel.app') {
    return origin;
  }
  
  // Vercel preview domains
  if (origin.endsWith('.vercel.app') && ALLOWED_ORIGINS.some(a => a && origin.includes(a.replace('*', '').replace('https://', '').split('.')[0]))) {
    return origin;
  }
  
  // Localhost
  if (origin.startsWith('http://localhost:')) return origin;
  
  return null; // not allowed
}

export function setCors(req, res) {
  const origin = getCorsOrigin(req);
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
}
