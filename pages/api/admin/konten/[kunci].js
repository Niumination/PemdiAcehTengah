/** PUT /api/admin/konten/[kunci] — konten tampilan (marquee, pengumuman, tenggat). Hanya Koordinator. */
import { wajibSesi, labelSesi } from '@/lib/cmsAuth';
import { segarkanHalaman } from '@/lib/revalidate';
import { dbAktif, simpanKonten, catatLog } from '@/lib/db';
import { validasiKonten } from '@/lib/overlay';

export default async function handler(req, res) {
  if (req.method !== 'PUT') { res.setHeader('Allow', 'PUT'); return res.status(405).json({ error: 'Method not allowed' }); }
  const sesi = wajibSesi(req, res, { peran: 'koordinator' }); if (!sesi) return;
  if (!dbAktif()) return res.status(503).json({ error: 'DATABASE_URL belum diatur' });
  const kunci = String(req.query.kunci || '');
  const v = validasiKonten(kunci, req.body?.nilai);
  if (!v.ok) return res.status(400).json({ error: v.error });
  const { lama, baru } = await simpanKonten(kunci, v.nilai, labelSesi(sesi));
  await catatLog({ peran: sesi.peran, aksi: 'ubah_konten', target: kunci, sebelum: lama, sesudah: baru });
  const segar = await segarkanHalaman(res);
  return res.status(200).json({ ok: true, kunci, nilai: baru, segar });
}
