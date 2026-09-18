import crypto from 'crypto';
import { rateLimitDb } from './rate-limit-db';

export function sanitizeText(input, max = 5000) {
  if (typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
}

export function hashIp(req) {
  const salt = process.env.IP_HASH_SALT || 'pemdi-aceh-tengah';
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.socket?.remoteAddress || 'unknown';
  return crypto.createHash('sha256').update(ip + salt).digest('hex').slice(0, 32);
}

/**
 * Rate limit — serverless-safe via Supabase.
 * Fallback ke in-memory jika Supabase tidak tersedia.
 *
 * Prasyarat: Jalankan db/rate-limit-schema.sql di Supabase SQL Editor
 */
export async function rateLimit(key, { max = 5, windowMs = 60000 } = {}) {
  return rateLimitDb(key, { max, windowMs });
}

export function generateLaporId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  // 6 byte acak (12 hex) — 2^48 kombinasi/hari, tidak feasible di-brute force
  // (audit S-4 2026-09-17; sebelumnya 3 byte)
  const rand = crypto.randomBytes(6).toString('hex').toUpperCase();
  return `LAPOR-${date}-${rand}`;
}
