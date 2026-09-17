// lib/adminAuth.js — Helper untuk admin authentication
// Bandingkan Bearer token dengan ADMIN_PASSWORD (env var)
// Fallback ADMIN_TOKEN untuk backward compatibility

import crypto from 'crypto';
import { rateLimit } from './security';

/**
 * Perbandingan token constant-time (anti timing attack).
 * Jika panjang berbeda, tetap lakukan satu perbandingan agar durasinya
 * seragam, lalu kembalikan false.
 */
function tokenEquals(candidate, secret) {
  const a = Buffer.from(String(candidate ?? ''));
  const b = Buffer.from(String(secret ?? ''));
  if (a.length !== b.length || a.length === 0) {
    crypto.timingSafeEqual(b, b);
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

export async function requireAdmin(req, res) {
  const auth = req.headers.authorization || '';
  const adminPass = process.env.ADMIN_PASSWORD || process.env.ADMIN_TOKEN;

  // If no password configured, reject all
  if (!adminPass) {
    return false;
  }

  // Rate-limit: max 5 percobaan login per menit per IP
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.socket?.remoteAddress || 'unknown';
  if (!(await rateLimit(`admin:${ip}`, { max: 5, windowMs: 60000 })).ok) {
    res.status(429).json({ error: 'Too many login attempts. Try again later.' });
    return false;
  }

  // Bearer token — constant-time compare (audit S-3 2026-09-17)
  if (auth.startsWith('Bearer ')) {
    return tokenEquals(auth.slice(7).trim(), adminPass.trim());
  }

  return false;
}

export function adminUnauthorized(res) {
  return res.status(401).json({ error: 'Unauthorized', loginUrl: '/admin?login=1' });
}
