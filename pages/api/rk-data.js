/**
 * GET /api/rk-data — Data ringkas Ruang Kendali (indikator, antrean, OPD PJ, indikator penuh)
 * untuk drawer & palet di halaman lama yang tidak membawa props `rk` (Patch 2).
 * Read-only, dibangun dari data/*.json saat cold start; cache CDN 1 jam.
 */
import { susunDataRK } from '@/lib/rkData';

let cache = null;
export default function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed' }); }
  if (!cache) cache = susunDataRK();
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).json(cache);
}
