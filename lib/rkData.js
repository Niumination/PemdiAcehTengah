/**
 * lib/rkData.js — Penyusun props Ruang Kendali untuk getStaticProps (server-only).
 * Satu fungsi `susunDataRK()` dipakai /dashboard, /indikator, /antrean agar
 * konteks RKShell (drawer, palet, persona PJ) identik di semua halaman.
 */
import pemdi from '@/data/pemdi.json';
import opdJson from '@/data/opd.json';
import dokumenKunci from '@/data/dokumen-kunci.json';
import linimasa from '@/data/linimasa.json';
import catatanMeta from '@/data/catatan-mandiri.json';
import { ringkasIndikator, antreanButir, bebanPJ } from './ruangKendali';
import { statistikBukti, indeksPemdi, predikatPemdi } from './pemdiNilai';

export function susunDataRK() {
  const indikator = ringkasIndikator(pemdi);
  const antrean = antreanButir(pemdi);
  const opdPJ = bebanPJ(antrean, opdJson.opd.daftar);
  const stat = statistikBukti(pemdi.aspek);
  const { indeks, rincian } = indeksPemdi(pemdi.aspek, 'aktual');
  const predikat = predikatPemdi(indeks);
  const aspek = rincian.map((r) => ({ id: r.id, nama: r.nama, singkat: r.singkat, bobot: r.bobot, indeks: Number(r.indeksAspek.toFixed(2)) }));
  // indikator penuh (untuk drawer) — hanya bidang yang diperlukan agar payload ringan
  const indikatorPenuh = pemdi.aspek.flatMap((a) => a.indikator.map((i) => ({
    id: i.id, nama: i.nama, bobot: i.bobot, eksternal: i.eksternal ?? null, sumber: i.sumber ?? null,
    penanggung_jawab: i.penanggung_jawab ?? null,
    bukti_dukung: (i.bukti_dukung || []).map((b) => ({
      id: b.id, level: b.level, nama: b.nama, status: b.status, catatan: b.catatan ?? null,
      url_preview: b.url_preview ?? null, _peran: b._peran ?? null,
      eval: b.eval ? { kode: b.eval.kode, hasil: b.eval.hasil, jenis: b.eval.jenis ?? null, catatan: b.eval.catatan ?? null } : null,
      catatan_mandiri: b.catatan_mandiri ? {
        jenis: b.catatan_mandiri.jenis, ringkas: b.catatan_mandiri.ringkas, pj: b.catatan_mandiri.pj, prioritas: b.catatan_mandiri.prioritas,
        kebutuhan: b.catatan_mandiri.kebutuhan || [], versi: b.catatan_mandiri.versi ?? null,
        rujukan: (b.catatan_mandiri.rujukan || []).map((r) => ({ dok: r.dok ?? r.kode ?? null, judul: r.judul ?? null, bagian: r.bagian ?? null, halaman: r.halaman ?? null, url: r.url ?? null, path: r.path ?? null })),
      } : null,
    })),
  })));
  const prasyarat = (dokumenKunci.dokumen || [])
    .filter((d) => /tertinggi/i.test(d.prioritas || ''))
    .slice(0, 8)
    .map((d) => ({ no: d.no, nama: d.nama, pj: d.penanggung_jawab, ind: d.indikator_level, prioritas: d.prioritas }));
  return {
    indikator,
    antrean,
    opdPJ,
    indikatorPenuh,
    prasyarat,
    linimasa: linimasa.tahap,
    situasi: {
      indeks: Number(indeks.toFixed(2)),
      predikat: predikat?.label || '—',
      aspek,
      target: pemdi.target_indeks,
      proyeksi: pemdi.proyeksi?.proyeksi_target_indikator ?? null,
      baselineSpbe: pemdi.baseline_spbe ?? null,
      stat,
      tahap1: { dinilai: pemdi.penilaian_tahap1?.dinilai, diterima: pemdi.penilaian_tahap1?.diterima, revisi: pemdi.penilaian_tahap1?.revisi, sinkron: pemdi.penilaian_tahap1?.tanggal_sinkron },
      tenggat: catatanMeta.tenggat,
      catatanMandiri: antrean.length,
    },
  };
}
