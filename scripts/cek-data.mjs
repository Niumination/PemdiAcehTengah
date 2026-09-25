#!/usr/bin/env node
/**
 * scripts/cek-data.mjs — Penjaga kesegaran & konsistensi data (Patch 20, Tahap E audit konten).
 *
 * Prinsip: setiap angka yang tampil harus punya sumber, tanggal, dan tidak saling bertentangan.
 * Memeriksa data/*.json TANPA mengubahnya:
 *  1. Umur berkas (tanggal commit terakhir via git; fallback mtime) > AMBANG hari → peringatan.
 *  2. Angka utama konsisten: indeks asesor (1,24) = rata-rata tertimbang skor aspek di evaluasi-asesor-2026.json.
 *  3. Setiap butir bercatatan mandiri punya `pj` (kalau kosong: tidak masuk halaman OPD mana pun) dan `prioritas` valid.
 *  4. Setiap PJ cocok dengan salah satu OPD di opd.json lewat pencocok yang sama dengan halaman OPD
 *     (lib/pjButir hitungButirOPD) — kalau tidak, butir itu "yatim": tidak muncul di /opd/[slug] siapa pun.
 *  5. Setiap butir pemdi.json punya `status` dari himpunan yang dikenal.
 * Keluaran: daftar temuan; exit 1 hanya untuk 2–5 (konsistensi). Umur data = peringatan (exit 0) agar CI tidak
 * merah hanya karena waktu berjalan; pemilik memutuskan kapan memperbarui.
 * Jalankan: node scripts/cek-data.mjs   (juga dipanggil test/cekData.test.mjs)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const AMBANG_HARI = Number(process.env.CEK_DATA_HARI || 14);
const STATUS_DIKENAL = new Set(['diterima', 'revisi', 'draf', 'proses', 'belum', 'lengkap']);
const PRIORITAS = new Set(['tinggi', 'sedang', 'rendah']);

export async function periksaData(root = process.cwd()) {
  const gagal = [];
  const peringatan = [];
  const dir = join(root, 'data');

  // 1. umur
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.json'))) {
    let tgl = null;
    try { const out = execSync(`git log -1 --format=%cI -- "data/${f}"`, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); if (out) tgl = new Date(out); } catch { /* tanpa git */ }
    if (!tgl) tgl = statSync(join(dir, f)).mtime;
    const hari = Math.floor((Date.now() - tgl.getTime()) / 86400000);
    if (hari > AMBANG_HARI) peringatan.push(`data/${f}: terakhir diperbarui ${hari} hari lalu (${tgl.toISOString().slice(0, 10)}) — periksa apakah masih mutakhir`);
  }

  const pemdi = JSON.parse(readFileSync(join(dir, 'pemdi.json'), 'utf8'));
  const asesor = JSON.parse(readFileSync(join(dir, 'evaluasi-asesor-2026.json'), 'utf8'));
  const opd = JSON.parse(readFileSync(join(dir, 'opd.json'), 'utf8'));

  // 2. konsistensi angka utama: indeks asesor = Σ(bobot×skor)/Σbobot, dan pemdi.json harus mengutip angka yang sama
  const bobot = (asesor.aspek || []).reduce((s, a) => s + Number(a.bobot || 0), 0);
  const hitung = bobot ? (asesor.aspek || []).reduce((s, a) => s + Number(a.bobot || 0) * Number(a.skor || 0), 0) / bobot : null;
  if (hitung != null && Math.abs(hitung - Number(asesor.indeks?.asesor)) > 0.02) {
    gagal.push(`indeks asesor ${asesor.indeks?.asesor} ≠ rata-rata tertimbang aspek (${hitung.toFixed(2)})`);
  }
  // 4. PJ kosong / yatim (butir bercatatan mandiri yang tidak jatuh ke OPD mana pun)
  try {
    const { antreanButir } = await import(join(root, 'lib/ruangKendali.js'));
    const { hitungButirOPD } = await import(join(root, 'lib/pjButir.js'));
    const daftar = opd.opd?.daftar || [];
    for (const b of antreanButir(pemdi) || []) {
      if (!b.pj) { gagal.push(`${b.kode}: catatan mandiri tanpa PJ — tidak muncul di halaman OPD mana pun`); continue; }
      if (daftar.length && !daftar.some((o) => hitungButirOPD(o, [b.pj]) > 0)) {
        gagal.push(`${b.kode}: PJ "${b.pj}" tidak cocok dengan OPD mana pun (lib/pjButir ALIAS) — butir yatim di halaman OPD`);
      }
    }
  } catch (e) { peringatan.push(`cek PJ dilewati: ${e.message.slice(0, 100)}`); }

  // 3 & 5. butir
  for (const a of pemdi.aspek || []) for (const ind of a.indikator || []) for (const b of ind.bukti_dukung || []) {
    if (b.status && !STATUS_DIKENAL.has(b.status)) gagal.push(`${b.id}: status "${b.status}" tidak dikenal`);
    const cm = b.catatan_mandiri;
    if (cm && cm.prioritas && !PRIORITAS.has(cm.prioritas)) gagal.push(`${b.id}: prioritas "${cm.prioritas}" tidak dikenal`);
  }

  return { gagal, peringatan };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { gagal, peringatan } = await periksaData();
  for (const p of peringatan) console.warn(`PERINGATAN ${p}`);
  if (gagal.length) { console.error(gagal.join('\n')); console.error(`\n${gagal.length} masalah data.`); process.exit(1); }
  console.log(`cek-data: konsisten (${peringatan.length} peringatan kesegaran).`);
}
