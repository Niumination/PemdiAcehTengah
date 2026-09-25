#!/usr/bin/env node
/**
 * scripts/inventaris-konten.mjs — Inventaris konten yang DITAMPILKAN (Patch 20, Tahap E audit konten).
 *
 * Metode audit konten untuk alat kerja (bukan situs pajangan): setiap panel harus bisa dijawab
 * "tugas siapa yang dibantu, dari data mana, dan apa aksinya". Skrip ini memindai pages/*.js dan
 * menghasilkan docs/INVENTARIS-KONTEN.md berisi: rute → panel (id, judul, lipat di ponsel?, aksi/tautan)
 * dan sumber data (import data/*.json & lib/*). Baris matriks JTBD per persona diisi manual di dokumen
 * (blok di antara penanda <!-- jtbd:mulai --> … <!-- jtbd:selesai --> dipertahankan saat regenerasi).
 * Jalankan: npm run inventaris
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const KELUARAN = join(root, 'docs/INVENTARIS-KONTEN.md');

function daftarHalaman() {
  const out = [];
  const jalan = (dir, awalan) => {
    for (const n of readdirSync(dir, { withFileTypes: true })) {
      if (n.isDirectory()) { if (n.name !== 'api') jalan(join(dir, n.name), `${awalan}/${n.name}`); continue; }
      if (!n.name.endsWith('.js') || n.name.startsWith('_')) continue;
      const nama = n.name.replace(/\.js$/, '');
      out.push({ rute: nama === 'index' ? (awalan || '/') : `${awalan}/${nama}`, berkas: join(dir, n.name) });
    }
  };
  jalan(join(root, 'pages'), '');
  return out.sort((a, b) => a.rute.localeCompare(b.rute));
}

function atribut(tag, nama) {
  const m = tag.match(new RegExp(`\\b${nama}=(?:"([^"]*)"|\\{\`([^\`]*)\`\\}|\\{([^}]*)\\})`));
  return m ? (m[1] ?? m[2] ?? m[3] ?? '').replace(/\$\{[^}]*\}/g, '…').replace(/\s+/g, ' ').trim() : '';
}

function pindai(berkas) {
  const src = readFileSync(berkas, 'utf8');
  const data = [...src.matchAll(/from '@\/data\/([\w.-]+)'/g)].map((m) => m[1]);
  const lib = [...src.matchAll(/from '@\/lib\/([\w.-]+)'/g)].map((m) => m[1]);
  const panel = [...src.matchAll(/<PanelLipat\b[^>]*>/gs)].map((m) => {
    const tag = m[0];
    const tautan = [...tag.matchAll(/href="([^"]+)"/g)].map((x) => x[1]);
    return { id: atribut(tag, 'id'), judul: atribut(tag, 'judul'), ponsel: /ponsel="tutup"/.test(tag) ? 'tutup' : 'buka', tautan };
  });
  const h2 = panel.length ? [] : [...src.matchAll(/<h2[^>]*>([^<{]+)/g)].map((m) => m[1].trim()).filter(Boolean);
  const ssr = /getServerSideProps/.test(src) ? 'SSR' : /getStaticProps/.test(src) ? (/revalidate/.test(src) ? 'ISR' : 'SSG') : 'klien';
  return { data, lib, panel, h2, ssr };
}

const halaman = daftarHalaman().map((h) => ({ ...h, ...pindai(h.berkas) }));

let jtbd = `<!-- jtbd:mulai -->
## Matriks tugas (JTBD) per persona — diisi manual

| Persona | Tugas nyata | Halaman/panel yang menjawab | Aksi tersedia | Celah |
|---|---|---|---|---|
| Koordinator Pemdi (Diskominfo) | Tahu posisi indeks & apa yang paling mendesak minggu ini | /dashboard → Situasi, Antrean prioritas tinggi | tautan ke /antrean, cetak | — |
| Koordinator Pemdi | Siapkan sesi interviu asesor per indikator | /asesor → tabel & catatan interview | filter, cetak | — |
| PJ OPD | Tahu butir apa yang menjadi tugas OPD-ku dan apa langkah pertamanya | /opd/[slug] → Tugas saya | salin tautan, bagikan WA, cetak, buka drawer butir | — |
| PJ OPD | Menemukan contoh/format bukti untuk butir tertentu | /requirement, /modul-indikator | unduh panduan | belum ada tautan langsung dari Tugas saya ke panduan per butir |
| Pimpinan (Sekda/Kadis) | Ringkasan 1 layar untuk rapat: indeks, target, beban OPD | /pemdi, /dashboard → Situasi & Beban PJ | cetak | — |
<!-- jtbd:selesai -->`;
if (existsSync(KELUARAN)) {
  const lama = readFileSync(KELUARAN, 'utf8');
  const m = lama.match(/<!-- jtbd:mulai -->[\s\S]*?<!-- jtbd:selesai -->/);
  if (m) jtbd = m[0];
}

const baris = [];
baris.push('# Inventaris konten yang ditampilkan');
baris.push('');
baris.push(`Dihasilkan oleh \`npm run inventaris\` (scripts/inventaris-konten.mjs). Jangan sunting tabel rute secara manual; sunting blok JTBD di bawah.`);
baris.push('');
baris.push('Prinsip audit konten: situs ini alat kerja (ruang kendali), bukan pajangan. Setiap panel harus menjawab **tugas siapa**, **dari data mana**, **aksinya apa**. Panel tanpa jawaban = kandidat dihapus/digabung.');
baris.push('');
baris.push('## Rute → panel → sumber data');
baris.push('');
baris.push('| Rute | Render | Sumber data | Panel (id · judul · ponsel) | Tautan aksi |');
baris.push('|---|---|---|---|---|');
for (const h of halaman) {
  const sumber = [...h.data.map((d) => `data/${d}`), ...h.lib.map((l) => `lib/${l}`)].join('<br>') || '—';
  const panel = h.panel.length
    ? h.panel.map((p) => `\`${p.id || '?'}\` ${p.judul || '(dinamis)'}${p.ponsel === 'tutup' ? ' · lipat' : ''}`).join('<br>')
    : (h.h2.length ? h.h2.map((t) => `h2: ${t}`).join('<br>') : '—');
  const tautan = [...new Set(h.panel.flatMap((p) => p.tautan))].join(', ') || '—';
  baris.push(`| \`${h.rute}\` | ${h.ssr} | ${sumber} | ${panel} | ${tautan} |`);
}
baris.push('');
baris.push('## Ringkasan');
baris.push('');
const totalPanel = halaman.reduce((s, h) => s + h.panel.length, 0);
const lipat = halaman.reduce((s, h) => s + h.panel.filter((p) => p.ponsel === 'tutup').length, 0);
baris.push(`- ${halaman.length} rute, ${totalPanel} panel lipat (${lipat} tertutup di ponsel secara bawaan).`);
baris.push(`- Sumber data yang dipakai: ${[...new Set(halaman.flatMap((h) => h.data))].sort().join(', ')}.`);
baris.push('');
baris.push(jtbd);
baris.push('');
writeFileSync(KELUARAN, baris.join('\n'));
console.log(`inventaris: ${halaman.length} rute, ${totalPanel} panel → docs/INVENTARIS-KONTEN.md`);
