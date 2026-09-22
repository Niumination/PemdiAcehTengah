/** GET /api/admin/overlay — seluruh baris overlay + konten (untuk tabel admin). Perlu sesi. */
import { wajibSesi } from '@/lib/cmsAuth';
import { dbAktif, bacaOverlay } from '@/lib/db';
export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed' }); }
  const sesi = wajibSesi(req, res); if (!sesi) return;
  res.setHeader('Cache-Control', 'no-store');
  if (!dbAktif()) return res.status(200).json({ butir: [], konten: {}, dbAktif: false });
  const o = await bacaOverlay();
  return res.status(200).json({ ...o, dbAktif: true });
}
