/** GET /api/admin/log — 200 entri log audit terakhir. Hanya Koordinator. */
import { wajibSesi } from '@/lib/cmsAuth';
import { bacaLog } from '@/lib/db';
export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed' }); }
  const sesi = wajibSesi(req, res, { peran: 'koordinator' }); if (!sesi) return;
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ log: await bacaLog(200) });
}
