/**
 * Health check — dipakai uptime monitor (UptimeRobot / Vercel Cron).
 * Mode internal Pemdi (reposisi, 22 Sep 2026): tidak ada basis data runtime —
 * seluruh konten dashboard berasal dari data/*.json yang dibundel saat build.
 * 200 = aplikasi hidup dan data inti termuat; 503 = data inti tidak termuat.
 */
import pemdi from '@/data/pemdi.json';
import modul from '@/data/modul-indikator.json';

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ status: 'error', error: 'Method not allowed' });
  }
  const indikator = Array.isArray(pemdi?.aspek)
    ? pemdi.aspek.reduce((n, a) => n + (a.indikator?.length || 0), 0)
    : 0;
  const ok = indikator === 20 && (modul?.total_modul || 0) > 0;
  return res.status(ok ? 200 : 503).json({
    status: ok ? 'ok' : 'unhealthy',
    app: 'ok',
    data: ok ? 'ok' : 'incomplete',
    indikator,
    modul: modul?.total_modul || 0,
    mode: 'internal',
    checkedAt: new Date().toISOString(),
  });
}
