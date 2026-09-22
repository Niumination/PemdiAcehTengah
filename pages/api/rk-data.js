/**
 * GET /api/rk-data — Data ringkas Ruang Kendali (indikator, antrean, OPD PJ, indikator penuh)
 * untuk drawer & palet di halaman lama yang tidak membawa props `rk` (Patch 2).
 * Patch 4: bila DATABASE_URL ada, overlay CMS ikut digabung; cache modul 60 dtk + CDN 60 dtk.
 * Tanpa DB: cache 1 jam (data statis dari JSON).
 */
import { susunDataRK } from '@/lib/rkData';
import { dbAktif } from '@/lib/db';

let cache = null;
let cachePada = 0;
export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed' }); }
  const umur = dbAktif() ? 60_000 : 3_600_000;
  if (!cache || Date.now() - cachePada > umur) { cache = await susunDataRK(); cachePada = Date.now(); }
  res.setHeader('Cache-Control', dbAktif() ? 'public, s-maxage=60, stale-while-revalidate=300' : 'public, s-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).json(cache);
}
