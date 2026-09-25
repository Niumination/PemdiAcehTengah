#!/usr/bin/env node
/**
 * scripts/uji-tugas.mjs — Simulasi uji tugas (cognitive walkthrough) 3 persona × 5 tugas (Tahap F, Patch 21).
 *
 * BUKAN pengganti uji dengan orang nyata (docs/UJI-TUGAS-PEMDI.md); ini pra-uji otomatis: untuk tiap tugas T1–T5
 * skrip menempuh jalur yang paling mungkin dipilih pengguna awam, menghitung langkah, dan memverifikasi bahwa
 * JAWABAN BENAR benar-benar terlihat di layar (bukan hanya ada di kode). Gagal = cacat P0 yang harus dibereskan
 * sebelum sesi dengan peserta, supaya waktu peserta tidak habis pada kerusakan yang bisa dicegah.
 *
 * Jalankan: PLAYWRIGHT_BROWSERS_PATH=… node scripts/uji-tugas.mjs --base=http://localhost:3000
 * Keluaran: tabel di stdout + audit/keluaran/uji-tugas.json ; exit 1 bila ada tugas gagal.
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || '').split('=')[1] || d;
const BASE = arg('base', 'http://localhost:3000');
const PONSEL = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true };
const LAPTOP = { viewport: { width: 1440, height: 900 } };

const hasil = [];
const catat = (id, persona, perangkat, langkah, ok, bukti, catatan = '') => {
  hasil.push({ id, persona, perangkat, langkah, ok, bukti, catatan });
  console.log(`${ok ? 'OK  ' : 'GAGAL'} ${id} [${persona}/${perangkat}] ${langkah} langkah — ${bukti}${catatan ? ' · ' + catatan : ''}`);
};
const teks = async (p, sel = 'body') => (await p.locator(sel).first().innerText().catch(() => '')).replace(/\s+/g, ' ');

const b = await chromium.launch();

// T1 — Koordinator (laptop): status butir I19-L1-01 + catatan asesor, lewat palet cari (Ctrl+K)
{
  const p = await b.newPage(LAPTOP);
  await p.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' });
  await p.keyboard.press('Control+k'); // 1
  await p.locator('input[aria-label="Cari"]').fill('I19-L1-01'); // 2
  await p.waitForTimeout(400);
  await p.keyboard.press('Enter'); // 3
  await p.waitForTimeout(800);
  const t = await teks(p, '[role=dialog]');
  const ok = /I19-L1-01/.test(t) && /revisi/i.test(t) && /(catatan|asesor)/i.test(t);
  catat('T1', 'Koordinator', 'laptop', 3, ok, ok ? 'drawer butir: kode + status revisi + catatan terlihat' : `drawer: "${t.slice(0, 120)}"`);
  await p.close();
}

// T2 — PJ OPD (ponsel): dokumen yang harus disiapkan minggu ini + yang paling mendesak
for (const slug of ['sekretaris-daerah', 'badan-kepegawaian-dan-pengembangan-sdm']) { // beban tinggi (ada prioritas tinggi) & ringan (hanya sedang/rendah)
  const p = await b.newPage(PONSEL);
  const r = await p.goto(`${BASE}/opd/${slug}`, { waitUntil: 'networkidle' }); // 1 (buka tautan yang dikirim koordinator)
  if (!r || r.status() !== 200) { catat('T2', `PJ ${slug}`, 'ponsel', 1, false, `status ${r && r.status()}`); await p.close(); continue; }
  // grup pertama (prioritas tertinggi yang ada) harus sudah terbuka tanpa klik, dan tiap baris menyebut aksi
  const grup1 = p.locator('.rk-tugas').first();
  const judul = (await grup1.locator('h3').innerText().catch(() => '')).replace(/\s+/g, ' ');
  const terbuka = (await grup1.locator('.rk-tugas-hd').getAttribute('aria-expanded').catch(() => null)) === 'true';
  const baris = await grup1.locator('.rk-tugas-ls li .row').count();
  const bar = await p.locator('.rk-tugas-bar').count();
  const posisiY = (await grup1.boundingBox().catch(() => null))?.y;
  const aksi = baris ? await teks(p, '.rk-tugas .rk-tugas-ls li .row .aksi') : '';
  const ok = terbuka && baris > 0 && bar === 1 && /(revisi|siapkan)/i.test(aksi);
  catat('T2', `PJ ${slug}`, 'ponsel', 1, ok, `grup pertama "${judul.slice(0, 40)}" terbuka=${terbuka}, ${baris} butir, aksi pertama "${aksi.slice(0, 50)}"`, posisiY != null ? `mulai di y=${Math.round(posisiY)}px (${posisiY > 844 ? 'perlu gulir' : 'di layar pertama'})` : 'tidak ada grup');
  await p.close();
}

// T3 — Pimpinan (ponsel): nilai sekarang, target, mengapa
{
  const p = await b.newPage(PONSEL);
  await p.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' }); // 1
  const layar1 = await p.evaluate(() => { const s = document.querySelector('.rk-sit'); if (!s) return ''; const r = s.getBoundingClientRect(); return r.top < 844 ? s.innerText.replace(/\s+/g, ' ') : ''; });
  const adaNilai = /1,24/.test(layar1);
  const adaTarget = /2,50|target/i.test(layar1);
  const tautanAsesor = await p.locator('a[href="/asesor"]').count();
  await p.goto(`${BASE}/asesor`, { waitUntil: 'networkidle' }); // 2
  const t = await teks(p);
  const adaMengapa = /terendah|Rintisan|Level 1/i.test(t);
  const ok = adaNilai && adaTarget && tautanAsesor > 0 && adaMengapa;
  catat('T3', 'Pimpinan', 'ponsel', 2, ok, `layar-1 dashboard: nilai=${adaNilai} target=${adaTarget}; tautan /asesor=${tautanAsesor}; /asesor menjelaskan level/aspek terendah=${adaMengapa}`);
  await p.close();
}

// T4 — Koordinator (laptop): OPD dengan tunggakan terbanyak + kirim tautan (URL = state)
{
  const p = await b.newPage(LAPTOP);
  await p.goto(`${BASE}/opd`, { waitUntil: 'networkidle' }); // 1
  const pertama = await teks(p, '.rk-panel a[href^="/opd/"]');
  const ok1 = /Diskominfo|Komunikasi dan Informatika/.test(pertama) && /47/.test(pertama);
  // tautan yang dibagikan = URL saat ini; buka di konteks baru (penerima) dan bandingkan
  const url = p.url();
  const q = await b.newPage(PONSEL); await q.goto(url, { waitUntil: 'networkidle' }); // 2 (penerima)
  const penerima = await teks(q, '.rk-panel a[href^="/opd/"]');
  const ok2 = /Diskominfo|Komunikasi dan Informatika/.test(penerima);
  const tombolBagikan = await p.locator('button:has-text("Bagikan")').count();
  catat('T4', 'Koordinator', 'laptop→ponsel', 2, ok1 && ok2, `ubin pertama "${pertama.slice(0, 50)}"; penerima melihat hal sama=${ok2}`, tombolBagikan ? `tombol bagikan ada (${tombolBagikan})` : 'TIDAK ada tombol Bagikan WA di /opd — pengguna harus salin URL manual');
  await p.close(); await q.close();
}

// T5 — Pimpinan/Koordinator (laptop): ringkasan 1 halaman untuk rapat → tombol Cetak
for (const rute of ['/dashboard', '/asesor', '/pemdi']) {
  const p = await b.newPage(LAPTOP);
  await p.goto(`${BASE}${rute}`, { waitUntil: 'networkidle' });
  const cetak = await p.locator('button:has-text("Cetak"), button[aria-label^="Cetak"]').count();
  const printCss = await p.evaluate(() => [...document.styleSheets].some((s) => { try { return [...s.cssRules].some((r) => r.media && /print/.test(r.media.mediaText)); } catch { return false; } }));
  catat('T5', 'Pimpinan', 'laptop', 1, cetak > 0, `${rute}: tombol Cetak=${cetak}, @media print=${printCss}`, cetak ? '' : 'pengguna harus tahu Ctrl+P sendiri');
  await p.close();
}

await b.close();
mkdirSync('audit/keluaran', { recursive: true });
writeFileSync('audit/keluaran/uji-tugas.json', JSON.stringify(hasil, null, 1));
const gagal = hasil.filter((h) => !h.ok);
console.log(`\nuji-tugas: ${hasil.length - gagal.length}/${hasil.length} lolos → audit/keluaran/uji-tugas.json`);
if (gagal.length) process.exit(1);
