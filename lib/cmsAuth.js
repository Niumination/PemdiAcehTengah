/**
 * lib/cmsAuth.js — Sesi CMS: kata sandi bersama per peran (keputusan pemilik 22 Sep 2026),
 * token HMAC-SHA256 tanpa tabel sesi (stateless), cookie httpOnly `pemdi_cms`.
 * Env: CMS_SANDI_KOORDINATOR, CMS_SANDI_PJ, CMS_SESI_RAHASIA (≥ 32 karakter acak).
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

export const COOKIE = 'pemdi_cms';
export const PERAN = ['koordinator', 'pj'];
const UMUR_DETIK = 12 * 3600;

const b64u = (s) => Buffer.from(s).toString('base64url');
const unb64u = (s) => Buffer.from(s, 'base64url').toString('utf8');

export function cmsAktif(env = process.env) {
  return Boolean(env.CMS_SESI_RAHASIA && env.CMS_SANDI_KOORDINATOR && env.CMS_SANDI_PJ);
}

function sama(a = '', b = '') {
  const x = Buffer.from(String(a)); const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Cocokkan sandi dengan peran; kembalikan true bila sah. */
export function cekSandi(peran, sandi, env = process.env) {
  if (!cmsAktif(env)) return false;
  if (peran === 'koordinator') return sama(sandi, env.CMS_SANDI_KOORDINATOR);
  if (peran === 'pj') return sama(sandi, env.CMS_SANDI_PJ);
  return false;
}

export function buatToken({ peran, opd = null }, env = process.env, now = Date.now()) {
  const muatan = b64u(JSON.stringify({ peran, opd, exp: Math.floor(now / 1000) + UMUR_DETIK }));
  const tanda = createHmac('sha256', env.CMS_SESI_RAHASIA).update(muatan).digest('base64url');
  return `${muatan}.${tanda}`;
}

export function verifikasiToken(token, env = process.env, now = Date.now()) {
  if (!token || !env.CMS_SESI_RAHASIA) return null;
  const [muatan, tanda] = String(token).split('.');
  if (!muatan || !tanda) return null;
  const harap = createHmac('sha256', env.CMS_SESI_RAHASIA).update(muatan).digest('base64url');
  if (!sama(tanda, harap)) return null;
  try {
    const s = JSON.parse(unb64u(muatan));
    if (!PERAN.includes(s.peran) || s.exp * 1000 < now) return null;
    return { peran: s.peran, opd: s.opd || null };
  } catch { return null; }
}

export function bacaCookie(req) {
  const raw = req.headers?.cookie || '';
  for (const bagian of raw.split(';')) {
    const [k, ...v] = bagian.trim().split('=');
    if (k === COOKIE) return decodeURIComponent(v.join('='));
  }
  return null;
}

export function setCookieSesi(res, token, { hapus = false } = {}) {
  const aman = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  const nilai = hapus ? '' : encodeURIComponent(token);
  const umur = hapus ? 0 : UMUR_DETIK;
  res.setHeader('Set-Cookie', `${COOKIE}=${nilai}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${umur}${aman}`);
}

/** Ambil sesi dari request; tulis 401/403 dan kembalikan null bila tidak memenuhi. */
export function wajibSesi(req, res, { peran } = {}) {
  const sesi = verifikasiToken(bacaCookie(req));
  if (!sesi) { res.status(401).json({ error: 'Belum masuk' }); return null; }
  if (peran && sesi.peran !== peran) { res.status(403).json({ error: 'Peran tidak berwenang' }); return null; }
  return sesi;
}

export const labelSesi = (s) => (s.peran === 'pj' ? `pj:${s.opd || '-'}` : 'koordinator');
