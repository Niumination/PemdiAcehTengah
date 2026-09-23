#!/usr/bin/env node
/**
 * scripts/cek-ui.mjs — Penjaga kualitas UI (Patch 3).
 * Gagal (exit 1) bila:
 *  1. ada emoji sebagai ikon di pages/, components/, lib/ (kecuali bendera 🇮🇩 dan berkas ekspor lib/catatanMandiri.js),
 *  2. ada ukuran font < 11px (0.6875rem) di styles/*.css atau inline style,
 *  3. (Patch 8) `window.open(..., 'noopener')` — selalu mengembalikan null, tombol cetak mati; pakai lib/cetak.js,
 *  4. (Patch 8) <OPDTable> dipanggil tanpa prop `list` (mis. `opdList=`) — tabel akan kosong.
 * Jalankan: node scripts/cek-ui.mjs  (dipanggil juga oleh `npm test` lewat test/cekUi.test.mjs)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{1F000}-\u{1F2FF}]\uFE0F?/u;
const FLAG = /\u{1F1EE}\u{1F1E9}/u;
const KECUALI = new Set(['lib/catatanMandiri.js']);

function jalan(dir, out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) jalan(p, out);
    else if (['.js', '.mjs', '.css'].includes(extname(p))) out.push(p);
  }
  return out;
}

export function periksa(root = process.cwd()) {
  const masalah = [];
  const berkas = ['pages', 'components', 'lib', 'styles'].flatMap((d) => jalan(join(root, d)));
  for (const f of berkas) {
    const rel = f.slice(root.length + 1);
    const baris = readFileSync(f, 'utf8').split('\n');
    baris.forEach((l, i) => {
      const bersih = l.replace(FLAG, '');
      if (!KECUALI.has(rel) && EMOJI.test(bersih)) masalah.push(`${rel}:${i + 1} emoji sebagai ikon — pakai <Ikon>/<StatusIkon>`);
      if (/window\.open\([^)]*noopener/.test(l)) masalah.push(`${rel}:${i + 1} window.open dengan 'noopener' mengembalikan null — pakai bukaCetak() dari lib/cetak.js`);
      if (/<OPDTable\b(?![^>]*\blist=)/.test(l)) masalah.push(`${rel}:${i + 1} <OPDTable> tanpa prop list= — tabel akan kosong`);
      for (const m of l.matchAll(/font-?[sS]ize:\s*['"]?([\d.]+)(px|rem)/g)) {
        const px = m[2] === 'rem' ? parseFloat(m[1]) * 16 : parseFloat(m[1]);
        if (px < 11) masalah.push(`${rel}:${i + 1} font-size ${m[1]}${m[2]} < 11px`);
      }
    });
  }
  return masalah;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const m = periksa();
  if (m.length) { console.error(m.join('\n')); console.error(`\n${m.length} masalah UI.`); process.exit(1); }
  console.log('cek-ui: bersih.');
}
