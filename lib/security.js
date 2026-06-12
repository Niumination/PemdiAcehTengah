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

export async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip || '' }),
    });
    const d = await r.json();
    return Boolean(d.success);
  } catch {
    return false;
  }
}

export function generateLaporId() {
  return 'LAPOR-' + crypto.randomBytes(5).toString('hex').toUpperCase().slice(0, 8);
}
