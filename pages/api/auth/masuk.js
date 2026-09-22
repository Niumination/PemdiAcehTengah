/**
 * POST /api/auth/masuk — { peran: 'koordinator'|'pj', sandi, opd? } → cookie sesi httpOnly.
 * Kata sandi bersama per peran (env CMS_SANDI_*). PJ wajib memilih OPD (nama singkat/id dari opdPJ).
 * Pembatasan laju sederhana per IP (memori proses): 10 percobaan / 10 menit.
 */
import { cmsAktif, cekSandi, buatToken, setCookieSesi, PERAN } from '@/lib/cmsAuth';

const percobaan = new Map();
function terlaluSering(ip) {
  const kini = Date.now();
  const d = (percobaan.get(ip) || []).filter((t) => kini - t < 600_000);
  percobaan.set(ip, d);
  return d.length >= 10;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }); }
  if (!cmsAktif()) return res.status(503).json({ error: 'CMS belum dikonfigurasi (env CMS_SANDI_KOORDINATOR / CMS_SANDI_PJ / CMS_SESI_RAHASIA)' });
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
  if (terlaluSering(ip)) return res.status(429).json({ error: 'Terlalu banyak percobaan, coba lagi 10 menit lagi' });
  const { peran, sandi, opd } = req.body || {};
  if (!PERAN.includes(peran) || typeof sandi !== 'string') return res.status(400).json({ error: 'peran/sandi tidak valid' });
  if (peran === 'pj' && (!opd || typeof opd !== 'string' || opd.length > 120)) return res.status(400).json({ error: 'PJ OPD wajib memilih perangkat daerah' });
  if (!cekSandi(peran, sandi)) {
    percobaan.set(ip, [...(percobaan.get(ip) || []), Date.now()]);
    return res.status(401).json({ error: 'Kata sandi salah' });
  }
  const sesi = { peran, opd: peran === 'pj' ? opd : null };
  setCookieSesi(res, buatToken(sesi));
  return res.status(200).json({ ok: true, sesi });
}
