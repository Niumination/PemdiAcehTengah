// lib/adminAuth.js — Helper untuk admin authentication

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export function requireAdmin(req) {
  const auth = req.headers.authorization || '';
  // Support both Bearer token and Basic auth
  if (auth.startsWith('Bearer ')) {
    return auth.slice(7) === ADMIN_TOKEN;
  }
  if (auth.startsWith('Basic ')) {
    const decoded = Buffer.from(auth.slice(6), 'base64').toString();
    const [user, pass] = decoded.split(':');
    return pass === ADMIN_PASSWORD;
  }
  return false;
}

export function adminUnauthorized(res) {
  return res.status(401).json({ error: 'Unauthorized', loginUrl: '/admin?login=1' });
}
