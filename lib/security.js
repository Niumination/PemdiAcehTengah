import crypto from 'crypto';

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

const buckets = new Map();
export function rateLimit(key, { max = 5, windowMs = 60000 } = {}) {
  const now = Date.now();
  const e = buckets.get(key) || { count: 0, reset: now + windowMs };
  if (now > e.reset) { e.count = 0; e.reset = now + windowMs; }
  e.count += 1; buckets.set(key, e);
  return { ok: e.count <= max };
}

export function generateLaporId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `LAPOR-${date}-${rand}`;
}
