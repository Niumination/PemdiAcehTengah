/**
 * GET /api/admin/ekspor — unduh catatan-mandiri.json + overlay (siap diserap ke repo:
 * simpan sebagai data/catatan-mandiri.json, jalankan rantai skrip regenerasi, commit).
 * Hanya Koordinator.
 */
import catatan from '@/data/catatan-mandiri.json';
import { wajibSesi } from '@/lib/cmsAuth';
import { dbAktif, bacaOverlay } from '@/lib/db';
import { susunEkspor } from '@/lib/overlay';
export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed' }); }
  const sesi = wajibSesi(req, res, { peran: 'koordinator' }); if (!sesi) return;
  const baris = dbAktif() ? (await bacaOverlay()).butir : [];
  const hasil = susunEkspor(catatan, baris);
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="catatan-mandiri-${hasil.versi}.json"`);
  return res.status(200).send(JSON.stringify(hasil, null, 1));
}
