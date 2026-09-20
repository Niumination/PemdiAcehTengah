/**
 * Unit test — lib/pemdiNilai.js (rumus resmi PermenPANRB 8/2026)
 * + regresi end-to-end terhadap data/pemdi.json (indeks 0,38 · 250 bukti).
 *
 * Jalankan: npm test  (butuh Node >= 22; CI memakai Node 22)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  PREDIKAT_TABLE,
  predikatPemdi,
  nilaiIndikator,
  indeksAspek,
  indeksPemdi,
  statistikBukti,
} from '../lib/pemdiNilai.js';

/* ────────────────────────────────────────────────────────────
   predikatPemdi — Tabel 4 PermenPANRB 8/2026
   ──────────────────────────────────────────────────────────── */
test('predikatPemdi: input tidak valid → null', () => {
  assert.equal(predikatPemdi(null), null);
  assert.equal(predikatPemdi(undefined), null);
  assert.equal(predikatPemdi(Number.NaN), null);
});

test('predikatPemdi: batas tabel Tabel 4', () => {
  const cases = [
    [0.38, 'Belum Terindikasi', true],   // di bawah skala (capaian riil saat ini)
    [0.99, 'Belum Terindikasi', true],
    [1.0, 'Kurang', false],
    [1.49, 'Kurang', false],
    [1.5, 'Cukup', false],
    [2.4999, 'Cukup', false],
    [2.5, 'Baik', false],                // target resmi 2026
    [3.49, 'Baik', false],
    [3.5, 'Sangat Baik', false],
    [3.99, 'Sangat Baik', false],
    [4.0, 'Memuaskan', false],
    [5.0, 'Memuaskan', false],           // nilai maksimum (fallback baris terakhir)
  ];
  for (const [nilai, label, offScale] of cases) {
    const p = predikatPemdi(nilai);
    assert.equal(p.label, label, `nilai ${nilai}`);
    assert.equal(p.offScale, offScale, `offScale untuk ${nilai}`);
  }
});

test('PREDIKAT_TABLE: 5 predikat resmi', () => {
  assert.equal(PREDIKAT_TABLE.length, 5);
});

/* ────────────────────────────────────────────────────────────
   nilaiIndikator — aturan berjenjang & indikator eksternal
   ──────────────────────────────────────────────────────────── */
const bd = (level, status, peran) => ({ level, status, ...(peran ? { _peran: peran } : {}) });

test('nilaiIndikator: level kontinu — berhenti di level pertama yang belum lengkap', () => {
  const ind = { id: 'I1', bukti_dukung: [
    bd(1, 'diterima'), bd(1, 'diterima'),
    bd(2, 'diterima'),
    bd(3, 'belum'),
  ] };
  assert.deepEqual(
    { nilai: nilaiIndikator(ind).nilai, levelKontinu: nilaiIndikator(ind).levelKontinu },
    { nilai: 2, levelKontinu: 2 },
  );
});

test('nilaiIndikator: L1 belum lengkap ⇒ 0 (aturan berjenjang)', () => {
  const ind = { id: 'I1', bukti_dukung: [bd(1, 'belum'), bd(2, 'diterima')] };
  assert.equal(nilaiIndikator(ind).nilai, 0);
});

test('nilaiIndikator: item pendukung tidak menghalangi level utama', () => {
  const ind = { id: 'I1', bukti_dukung: [
    bd(1, 'diterima'),
    bd(2, 'belum', 'pendukung'), // pendukung diabaikan dari penilaian
  ] };
  assert.equal(nilaiIndikator(ind).nilai, 1);
});

test('nilaiIndikator: indikator eksternal — minimum 1 selama nilai nasional belum ada', () => {
  const ind = { id: 'I5', bukti_dukung: [] };
  const r = nilaiIndikator(ind);
  assert.equal(r.nilai, 1);
  assert.equal(r.menunggu, true);
  assert.equal(r.sumber, 'eksternal');
});

test('nilaiIndikator: indikator eksternal — pakai nilai nasional bila terisi', () => {
  const ind = { id: 'I5', eksternal: { aktif: true, nilai: 3 } };
  const r = nilaiIndikator(ind);
  assert.equal(r.nilai, 3);
  assert.equal(r.menunggu, false);
});

/* ────────────────────────────────────────────────────────────
   indeksAspek & indeksPemdi — rumus Σ(wI×NI)/wA dan Σ(wA×IA)
   ──────────────────────────────────────────────────────────── */
const aspekSintetis = {
  id: 'A1', nama: 'Sintetis', bobot: 10,
  indikator: [
    { id: 'I1', nama: 'Alpha', bobot: 5, bukti_dukung: [bd(1, 'diterima')] },                       // nilai 1
    { id: 'I2', nama: 'Beta', bobot: 5, bukti_dukung: [bd(1, 'diterima'), bd(2, 'diterima')] },      // nilai 2
  ],
};

test('indeksAspek: Σ(wI×NI) ÷ wA → 1,50 · kontribusi 0,150', () => {
  const r = indeksAspek(aspekSintetis);
  assert.equal(r.sum, 15);                 // 5×1 + 5×2
  assert.ok(Math.abs(r.indeks - 1.5) < 1e-9);
  assert.ok(Math.abs(r.kontribusi - 0.15) < 1e-9);
});

test('indeksAspek: mode target memakai ind.target', () => {
  const a = { id: 'A1', bobot: 10, indikator: [{ id: 'I1', bobot: 5, target: 2 }, { id: 'I2', bobot: 5, target: 3 }] };
  const r = indeksAspek(a, 'target');
  assert.ok(Math.abs(r.indeks - 2.5) < 1e-9);
});

test('indeksPemdi: Σ(wA/100 × IndeksAspek)', () => {
  const daftar = [
    aspekSintetis, // bobot 10%, indeks 1,5 → kontribusi 0,15
    { id: 'A2', nama: 'Kedua', bobot: 90, indikator: [{ id: 'I3', bobot: 90, bukti_dukung: [bd(1, 'diterima')] }] }, // indeks 1 → 0,90
  ];
  const r = indeksPemdi(daftar);
  assert.ok(Math.abs(r.indeks - 1.05) < 1e-9);
});

/* ────────────────────────────────────────────────────────────
   statistikBukti
   ──────────────────────────────────────────────────────────── */
test('statistikBukti: hitung diterima/revisi/proses/draf/belum + gap', () => {
  const daftar = [{
    id: 'A1', indikator: [{ id: 'I1', bukti_dukung: [
      bd(1, 'diterima'), bd(1, 'diterima'), bd(2, 'proses'), bd(2, 'belum'),
    ] }],
  }];
  assert.deepEqual(statistikBukti(daftar), { total: 4, diterima: 2, revisi: 0, proses: 1, draf: 0, belum: 1, gap: 2 });
});

/* ────────────────────────────────────────────────────────────
   REGRESI END-TO-END — data riil data/pemdi.json
   Pin angka yang dipublikasikan portal (jaga agar perubahan kode
   / data tidak diam-diam menggeser indeks yang sudah publik).
   ──────────────────────────────────────────────────────────── */
const pemdi = JSON.parse(readFileSync(new URL('../data/pemdi.json', import.meta.url), 'utf8'));

test('REGRESI: indeks simulasi = 0,35 (hanya bukti DITERIMA tahap 1; field indeks_aktual & tampilan /pemdi)', () => {
  const hasil = indeksPemdi(pemdi.aspek);
  assert.ok(Math.abs(hasil.indeks - 0.35) < 0.005, `terhitung ${hasil.indeks}`);
  assert.equal(pemdi.indeks_aktual, 0.35); // field data harus tetap sinkron
});

test('REGRESI: proyeksi mode target = 2,29 (Panduan Bab 4.2)', () => {
  const hasil = indeksPemdi(pemdi.aspek, 'target');
  assert.ok(Math.abs(hasil.indeks - 2.29) < 0.005, `terhitung ${hasil.indeks}`);
});

test('REGRESI: 232 item bukti — 18 diterima · 19 revisi · 0 proses · 12 draf · 183 belum', () => {
  const stat = statistikBukti(pemdi.aspek);
  assert.deepEqual(
    { total: stat.total, diterima: stat.diterima, revisi: stat.revisi, proses: stat.proses, draf: stat.draf, belum: stat.belum },
    { total: 232, diterima: 18, revisi: 19, proses: 0, draf: 12, belum: 183 },
  );
});

test('REGRESI: 7 aspek × 20 indikator, total bobot indikator = 100%', () => {
  assert.equal(pemdi.aspek.length, 7);
  const totalInd = pemdi.aspek.reduce((s, a) => s + a.indikator.length, 0);
  const totalBobotAspek = pemdi.aspek.reduce((s, a) => s + a.bobot, 0);
  assert.equal(totalInd, 20);
  assert.equal(totalBobotAspek, 100);
});
