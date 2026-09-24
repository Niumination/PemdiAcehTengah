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
import asesorJson from '@/data/evaluasi-asesor-2026.json'; // Patch 14 (Tahap 2): hasil asesor eksternal — Aceh Tengah saja
import { ringkasIndikator, antreanButir, bebanPJ } from './ruangKendali';
import { statistikBukti, indeksPemdi, predikatPemdi } from './pemdiNilai';
import { terapkanOverlay } from './overlay';
import { dbAktif, bacaOverlay } from './db';

/**
 * Patch 4: bila DATABASE_URL ada, overlay CMS (status/catatan butir + konten tampilan)
 * digabung di atas JSON. Tanpa DB → identik dengan JSON (degradasi anggun).
 * Dipanggil getStaticProps (ISR 60 dtk) dan /api/rk-data.
 */
export async function susunDataRK() {
  let dasar = pemdi;
  let konten = {};
  let overlay = { butir: 0 };
  if (dbAktif()) {
    try {
      const o = await bacaOverlay();
      const hasil = terapkanOverlay(pemdi, o.butir);
      dasar = hasil.pemdi;
      konten = o.konten || {};
      overlay = { butir: hasil.diterapkan };
    } catch (e) {
      console.error('[rkData] overlay gagal, memakai JSON:', e?.message || e);
    }
  }
  return susunDariPemdi(dasar, konten, overlay);
}

/** Versi murni/sinkron — dipakai tes dan skrip. */
export function susunDataRKStatis() {
  return susunDariPemdi(pemdi, {}, { butir: 0 });
}

function susunDariPemdi(pemdi, konten, overlay) {
  const asesorInd = Object.fromEntries(asesorJson.indikator.map((i) => [i.id, i]));
  const indikator = ringkasIndikator(pemdi).map((r) => ({ ...r, asesor: asesorInd[r.id] ? { kode: asesorInd[r.id].kode, nilai: asesorInd[r.id].nilai, level: asesorInd[r.id].level, verifikasi: asesorInd[r.id].verifikasi, tanpaBukti: asesorInd[r.id].tanpa_bukti, indeksLain: asesorInd[r.id].indeks_lain } : null }));
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
      asesor: { // Patch 14: 1,24 = angka utama (asesor eksternal KemenPANRB, 21 Sep 2026); 1,42 = mandiri awal (pembanding)
        indeks: asesorJson.indeks.asesor, mandiriAwal: asesorJson.indeks.mandiri_awal, level: asesorJson.indeks.level, tanggal: asesorJson.sumber.tanggal,
        aspek: asesorJson.aspek.map((a) => ({ id: a.id, skor: a.skor })),
        tanpaBukti: asesorJson.indikator.filter((i) => i.tanpa_bukti).length,
        indeksLain: asesorJson.indikator.filter((i) => i.indeks_lain).length,
        disetujui: asesorJson.indikator.filter((i) => i.verifikasi.disetujui === 'ya').length,
      },
      predikat: predikat?.label || '—',
      aspek,
      target: pemdi.target_indeks,
      proyeksi: pemdi.proyeksi?.proyeksi_target_indikator ?? null,
      baselineSpbe: pemdi.baseline_spbe ?? null,
      stat,
      tahap1: { dinilai: pemdi.penilaian_tahap1?.dinilai, diterima: pemdi.penilaian_tahap1?.diterima, revisi: pemdi.penilaian_tahap1?.revisi, sinkron: pemdi.penilaian_tahap1?.tanggal_sinkron },
      tenggat: konten.tenggat || catatanMeta.tenggat,
      catatanMandiri: antrean.length,
    },
    konten: { marquee: konten.marquee || null, pengumuman: konten.pengumuman || null },
    overlay: { aktif: dbAktif(), butir: overlay.butir },
  };
}
