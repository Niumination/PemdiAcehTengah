/**
 * PATCH /api/admin/butir/[id] — ubah overlay butir (status, ringkas, pj, prioritas, kebutuhan).
 * Koordinator: semua butir. PJ OPD: hanya butir yang PJ-nya OPD sesi (dicek lewat lib/pjButir).
 * Nama butir / kriteria level PermenPANRB 8/2026 tidak pernah bisa diubah dari sini.
 */
import pemdi from '@/data/pemdi.json';
import opdJson from '@/data/opd.json';
import { wajibSesi, labelSesi } from '@/lib/cmsAuth';
import { segarkanHalaman } from '@/lib/revalidate';
import { dbAktif, simpanButir, catatLog, bacaOverlay } from '@/lib/db';
import { validasiPatchButir } from '@/lib/overlay';
import { hitungButirOPD } from '@/lib/pjButir';

function cariButir(id) {
  for (const a of pemdi.aspek) for (const i of a.indikator) for (const b of i.bukti_dukung || []) if (b.id === id) return { a, i, b };
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'PATCH') { res.setHeader('Allow', 'PATCH'); return res.status(405).json({ error: 'Method not allowed' }); }
  const sesi = wajibSesi(req, res); if (!sesi) return;
  if (!dbAktif()) return res.status(503).json({ error: 'DATABASE_URL belum diatur' });
  const id = String(req.query.id || '');
  const hit = cariButir(id);
  if (!hit) return res.status(404).json({ error: 'Butir tidak ditemukan' });
  const v = validasiPatchButir(req.body || {});
  if (!v.ok) return res.status(400).json({ error: v.error });

  if (sesi.peran === 'pj') {
    // PJ hanya boleh menyunting butir miliknya (PJ saat ini: overlay bila ada, kalau tidak JSON)
    const o = (await bacaOverlay()).butir.find((r) => r.id === id);
    const pjKini = o?.pj ?? hit.b.catatan_mandiri?.pj ?? '';
    const opd = opdJson.opd.daftar.find((x) => String(x.id) === sesi.opd || x.singkat === sesi.opd || x.nama === sesi.opd);
    if (!opd || !hitungButirOPD(opd, [pjKini])) return res.status(403).json({ error: 'Butir ini bukan tanggung jawab OPD Anda' });
    if (v.patch.pj !== undefined || v.patch.status === 'diterima') return res.status(403).json({ error: 'PJ OPD tidak dapat mengubah penanggung jawab atau menandai diterima (hanya Koordinator)' });
  }

  const { lama, baru } = await simpanButir(id, v.patch, labelSesi(sesi));
  await catatLog({ peran: sesi.peran, opd: sesi.opd, aksi: 'ubah_butir', target: id, sebelum: lama, sesudah: baru });
  const segar = await segarkanHalaman(res);
  return res.status(200).json({ ok: true, id, overlay: baru, segar });
}
