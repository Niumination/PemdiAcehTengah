// lib/adminAuth.js — Helper untuk admin authentication
// Bandingkan Bearer token dengan ADMIN_PASSWORD (env var)
// Fallback ADMIN_TOKEN untuk backward compatibility

import { rateLimit } from './security';

export function requireAdmin(req, res) {
  const auth = req.headers.authorization || '';
  const adminPass = process.env.ADMIN_PASSWORD || process.env.ADMIN_TOKEN || 'admin';

  // Rate-limit: max 5 percobaan login per menit per IP
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.socket?.remoteAddress || 'unknown';
  if (!rateLimit(`admin:${ip}`, { max: 5, windowMs: 60000 }).ok) {
    res.status(429).json({ error: 'Too many login attempts. Try again later.' });
    return false;
  }

  // Bearer token
  if (auth.startsWith('Bearer ')) {
    // Trim any trailing newlines or whitespace from env var
    return auth.slice(7).trim() === adminPass.trim();
  }

  return false;
}

export function adminUnauthorized(res) {
  return res.status(401).json({ error: 'Unauthorized', loginUrl: '/admin?login=1' });
}
