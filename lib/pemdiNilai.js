/**
 * lib/pemdiNilai.js — Perhitungan capaian nilai Indeks Pemdi
 * SESUAI PERMENPANRB NO. 8 TAHUN 2026 (Lampiran: Pedoman Evaluasi Kinerja Pemdi,
 * Bagian B "Metode Penghitungan Indeks Pemdi", hlm. -37- s.d. -39-):
 *
 *   1. Nilai Indeks Aspek  : IndeksAspek_i = Σ(wIj × NIj) / wAi
 *   2. Nilai Indeks Pemdi  : IndeksPemdi    = Σ(wAspek_i × NAspek_i)
 *      (w dalam bentuk pecahan — 10% = 0,10)
 *
 * Nilai indikator (NIj) = tingkat kematangan 1–5 (level kuesioner) yang
 * ditentukan dari hasil penilaian bukti dukung: level tertinggi yang SEMUA item
 * buktinya ber-status "diterima" (dinilai asesor di eval.spbe.go.id), kontinu
 * dari Level 1 (aturan berjenjang: L1 belum diterima ⇒ level di atasnya tidak dinilai).
 *
 * Vokabuler status bukti (sejak 20 Sep 2026 — reposisi Opsi B):
 *   diterima  → diunggah & DITERIMA asesor      (dihitung)
 *   revisi    → diunggah, hasil REVISI          (tidak dihitung, wajib ditandai)
 *   proses    → diunggah, belum ada hasil       (tidak dihitung)
 *   draf      → draf lokal, belum diunggah      (tidak dihitung)
 *   belum     → belum ada dokumen
 * Angka yang dihasilkan adalah SIMULASI PENILAIAN MANDIRI, bukan nilai resmi.
 *
 * Indikator eksternal (I5 SDI/Bappenas, I6 SJIG/BIG, I7 EPSS/BPS, I18 —
 * item modul dikosongkan sesuai strategi tim) tidak dinilai dari bukti lokal;
 * selama nilai eksternal belum tersedia dipakai nilai minimum 1 (skala
 * kuesioner dimulai dari 1 = Kurang/Merintis) dan diberi label "menunggu
 * nilai eksternal".
 */

// ── Predikat Indeks Pemdi — Tabel 4 PermenPANRB 8/2026 ──
export const PREDIKAT_TABLE = [
  { min: 1.0, max: 1.5, label: 'Kurang', alias: 'Merintis / Initiate', warna: 'var(--bad)' },
  { min: 1.5, max: 2.5, label: 'Cukup', alias: 'Membangun / Emerging', warna: 'var(--warn)' },
  { min: 2.5, max: 3.5, label: 'Baik', alias: 'Berkembang / Developing', warna: 'var(--ok)' },
  { min: 3.5, max: 4.0, label: 'Sangat Baik', alias: 'Melembaga / Embedded', warna: 'var(--gold-deep, #b8860b)' },
  { min: 4.0, max: 5.0, label: 'Memuaskan', alias: 'Unggul / Leading', warna: '#8b5cf6' },
];

export function predikatPemdi(nilai) {
  if (nilai == null || Number.isNaN(nilai)) return null;
  if (nilai < 1.0) {
    // Di bawah skala (belum ada bukti lengkap sama sekali) — bukan predikat resmi
    return { label: 'Belum Terindikasi', alias: 'capaian di bawah skala predikat (indeks < 1,00)', warna: 'var(--bad)', offScale: true };
  }
  const row = PREDIKAT_TABLE.find(p => nilai >= p.min && nilai < p.max) || PREDIKAT_TABLE[PREDIKAT_TABLE.length - 1];
  return { ...row, offScale: false };
}

// ── Nama level kematangan (kuesioner PermenPANRB 8/2026) ──
export const LEVEL_LABEL = {
  0: 'Belum Ada Bukti Diterima',
  1: 'Initiate',
  2: 'Emerging',
  3: 'Developing',
  4: 'Embedded',
  5: 'Leading',
};
export const LEVEL_NAMA_RESMI = {
  0: 'Belum ada bukti Level 1 yang diterima asesor',
  1: 'Kurang (Merintis/Initiate)',
  2: 'Cukup (Membangun/Emerging)',
  3: 'Baik (Berkembang/Developing)',
  4: 'Sangat Baik (Melembaga/Embedded)',
  5: 'Memuaskan (Unggul/Leading)',
};

export const INDIKATOR_EKSTERNAL = {
  I5: { sistem: 'Skor Satu Data Indonesia (SDI)', pembina: 'Bappenas' },
  I6: { sistem: 'Skor SJIG (Simpul Jaringan Informasi Geospasial)', pembina: 'BIG' },
  I7: { sistem: 'Nilai EPSS (Evaluasi Penyelenggaraan Statistik Sektoral)', pembina: 'BPS' },
  I18: { sistem: 'Kuesioner Interoperabilitas Data (item modul dikosongkan sesuai strategi tim)', pembina: 'Bappenas' },
};

const isEksternal = (ind) => Boolean(ind?.eksternal?.aktif || INDIKATOR_EKSTERNAL[ind?.id]);

/**
 * Nilai indikator 1–5 berbasis bukti dukung (level kontinu semua-lengkap).
 * Indikator eksternal: pakai `eksternal.nilai` bila terisi, selama null → 1
 * (minimum skala) + flag menunggu.
 */
export function nilaiIndikator(ind) {
  if (isEksternal(ind)) {
    const ext = ind.eksternal?.nilai;
    if (typeof ext === 'number' && ext > 0) {
      return { nilai: ext, sumber: 'eksternal', menunggu: false, levelKontinu: Math.floor(ext) };
    }
    return { nilai: 1, sumber: 'eksternal', menunggu: true, levelKontinu: 1 };
  }
  const bd = ind?.bukti_dukung || [];
  let levelKontinu = 0;
  for (let lv = 1; lv <= 5; lv++) {
    const items = bd.filter((b) => b.level === lv && b._peran !== 'pendukung');
    if (items.length > 0 && items.every((b) => b.status === 'diterima')) levelKontinu = lv;
    else break;
  }
  return { nilai: levelKontinu, sumber: 'bukti', menunggu: false, levelKontinu };
}

/**
 * Indeks Aspek = Σ(wIj × NIj) / wAi  — rumus resmi.
 * `mode`: 'aktual' (nilai saat ini) | 'target' (proyeksi target indikator).
 */
export function indeksAspek(aspek, mode = 'aktual') {
  const inds = aspek?.indikator || [];
  const wA = aspek?.bobot || 0;
  if (!inds.length || !wA) return { indeks: 0, kontribusi: 0, rincian: [] };
  const rincian = inds.map((ind) => {
    const n = mode === 'target' ? ind.target || 0 : nilaiIndikator(ind).nilai;
    return { id: ind.id, nama: ind.nama, bobot: ind.bobot, nilai: n, hasil: (ind.bobot || 0) * n };
  });
  const sum = rincian.reduce((s, r) => s + r.hasil, 0);
  return { indeks: sum / wA, kontribusi: (wA / 100) * (sum / wA), rincian, sum };
}

/**
 * Indeks Pemdi = Σ(wAspek_i × IndeksAspek_i) — rumus resmi (bobot pecahan).
 */
export function indeksPemdi(daftarAspek, mode = 'aktual') {
  const rincian = (daftarAspek || []).map((a) => {
    const ia = indeksAspek(a, mode);
    return { id: a.id, nama: a.nama, singkat: a.singkat, bobot: a.bobot, indeksAspek: ia.indeks, kontribusi: (a.bobot / 100) * ia.indeks, rincianIndikator: ia.rincian };
  });
  const indeks = rincian.reduce((s, r) => s + r.kontribusi, 0);
  return { indeks, rincian };
}

// ── Status bukti dukung — metadata tampilan bersama (pemdi, modul-indikator, beranda) ──
export const STATUS_BUKTI = ['diterima', 'revisi', 'proses', 'draf', 'belum'];
export const STATUS_META = {
  diterima: { icon: '✅', label: 'Diterima', ket: 'Dinilai asesor di eval.spbe.go.id — diterima', color: 'var(--ok)', bg: 'var(--ok-bg)' },
  revisi:   { icon: '🔁', label: 'Revisi',   ket: 'Dinilai asesor — perlu revisi & unggah ulang', color: 'var(--bad)', bg: 'var(--bad-bg, #fde8e8)' },
  proses:   { icon: '🔄', label: 'Proses',   ket: 'Sudah diunggah — menunggu hasil asesor', color: 'var(--warn)', bg: 'var(--warn-bg)' },
  draf:     { icon: '📝', label: 'Draf',     ket: 'Draf lokal — belum diunggah ke portal', color: 'var(--primary)', bg: 'var(--surface-2)' },
  belum:    { icon: '⬜', label: 'Belum',    ket: 'Belum ada dokumen', color: 'var(--muted)', bg: 'var(--surface-2)' },
};
export const statusMeta = (s) => STATUS_META[s] || STATUS_META.belum;

/** Jenis revisi asesor (field eval.jenis) — menentukan tindak lanjut yang berbeda. */
export const REVISI_JENIS = {
  tidak_tepat:      { icon: '❌', label: 'Bukti tidak tepat',  tindak: 'Susun ulang dokumen sesuai substansi yang diminta asesor, lalu unggah ulang.' },
  belum_diunggah:   { icon: '📭', label: 'Belum diunggah',     tindak: 'Buat dokumen dari nol (lihat contoh modul/template), lalu unggah.' },
  otomatis_ditolak: { icon: '⛔', label: 'Ditolak otomatis',   tindak: 'Selesaikan dulu butir level di bawahnya — butir ini ikut dinilai ulang setelah level bawah diterima.' },
};

/** Statistik bukti dukung seluruh indikator (5 status + gap = total − diterima). */
export function statistikBukti(daftarAspek) {
  const stat = { total: 0, diterima: 0, revisi: 0, proses: 0, draf: 0, belum: 0 };
  for (const a of daftarAspek || []) {
    for (const ind of a.indikator || []) {
      for (const b of ind.bukti_dukung || []) {
        stat.total += 1;
        stat[STATUS_BUKTI.includes(b.status) ? b.status : 'belum'] += 1;
      }
    }
  }
  stat.gap = stat.total - stat.diterima;
  return stat;
}

/** Statistik satu indikator — bentuk yang sama dengan statistikBukti. */
export function statistikIndikator(ind) {
  return statistikBukti([{ indikator: [ind || {}] }]);
}
