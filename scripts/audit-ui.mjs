#!/usr/bin/env node
/**
 * scripts/audit-ui.mjs — Audit UI terukur di peramban nyata (Patch 16, Tahap A audit 25 Sep).
 *
 * Membuka setiap rute di Chromium headless pada 3 viewport (1440 / 1024 / 390), lalu mencatat:
 *  - overflow horizontal (scrollWidth > clientWidth) + 6 elemen pertama yang keluar viewport,
 *  - jumlah target interaktif terlalu kecil (< 44px di ponsel, < 32px di desktop),
 *  - tumpang tindih kotak antar-anak header (.rk-top) — mis. judul tertutup sakelar persona,
 *  - tinggi halaman, jumlah target interaktif, CLS (PerformanceObserver layout-shift),
 *  - tangkapan layar penuh → audit/keluaran/<viewport>-<rute>.png (tidak di-commit; .gitignore).
 * Keluaran ringkas: audit/keluaran/laporan.json + laporan.md (tabel per rute) dan exit 1 bila ada
 * overflow atau tumpang tindih header (ambang bisa diubah lewat env AUDIT_KETAT=0).
 *
 * Prasyarat (sekali): npm i -D playwright && npx playwright install chromium
 *   (playwright tidak masuk dependencies agar `npm ci` produksi tetap ringan; skrip memberi
 *    petunjuk bila modul belum ada.)
 * Pakai: node scripts/audit-ui.mjs [--base=http://localhost:3000] [--rute=/dashboard,/pemdi] [--vp=390]
 *        default base = https://pemdi-aceh-tengah.vercel.app
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
const BASE = arg('base', 'https://pemdi-aceh-tengah.vercel.app').replace(/\/$/, '');
const RUTE_DEFAULT = ['/dashboard', '/indikator', '/antrean', '/pemdi', '/asesor', '/modul-indikator', '/requirement', '/cari',
  '/opd', '/opd/dinas-komunikasi-dan-informatika', '/spbe', '/probis', '/glosarium', '/admin', '/halaman-tidak-ada'];
const RUTE = arg('rute', '') ? arg('rute').split(',') : RUTE_DEFAULT;
const VIEWPORT = { 1440: { width: 1440, height: 900, mobile: false }, 1024: { width: 1024, height: 768, mobile: false }, 390: { width: 390, height: 844, mobile: true } };
const VP = arg('vp', '') ? arg('vp').split(',') : Object.keys(VIEWPORT);
const KETAT = process.env.AUDIT_KETAT !== '0';
const OUT = join(process.cwd(), 'audit', 'keluaran');

let chromium;
try { ({ chromium } = await import('playwright')); } catch {
  console.error('playwright belum terpasang. Jalankan: npm i -D playwright && npx playwright install chromium');
  process.exit(2);
}

// Dieksekusi di dalam halaman — tanpa dependensi.
function ukur({ minTarget }) {
  const vw = document.documentElement.clientWidth;
  const kotak = (e) => e.getBoundingClientRect();
  const interaktif = [...document.querySelectorAll('button, a[href], [role=button], [role=tab], input, select, textarea, summary')]
    .filter((e) => { const r = kotak(e); return r.width > 0 && r.height > 0; });
  const kecil = interaktif.filter((e) => { const r = kotak(e); return r.width < minTarget || r.height < minTarget; })
    .slice(0, 400).map((e) => `${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0] || '-'} ${Math.round(kotak(e).width)}×${Math.round(kotak(e).height)}`);
  const keluar = [];
  // elemen di dalam wadah gulir horizontal (overflow-x auto/scroll) yang wadahnya sendiri muat = strategi "geser", bukan cacat
  const dalamGulir = (e) => { for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) {
    const ox = getComputedStyle(a).overflowX; if ((ox === 'auto' || ox === 'scroll') && kotak(a).right <= vw + 4) return true; } return false; };
  document.querySelectorAll('body *').forEach((e) => {
    if (keluar.length >= 6) return;
    const r = kotak(e);
    if (r.width > 0 && r.right > vw + 4 && !e.closest('.rk-marquee, .rk-track, .rk-nav, .rk-drawer, .rk-pal')
      && !(e.parentElement && kotak(e.parentElement).right > vw + 4) && !dalamGulir(e)) { // hanya elemen terluar yang keluar
      keluar.push(`${e.tagName.toLowerCase()}.${String(e.className).split(' ').slice(0, 2).join('.') || '-'} kanan=${Math.round(r.right)}`);
    }
  });
  // tumpang tindih anak langsung header
  const head = document.querySelector('.rk-top') || document.querySelector('header');
  const tindih = [];
  if (head) {
    const anak = [...head.querySelectorAll(':scope > *, :scope > * > *')].filter((e) => kotak(e).width > 0);
    for (let i = 0; i < anak.length; i++) for (let j = i + 1; j < anak.length; j++) {
      if (anak[i].contains(anak[j]) || anak[j].contains(anak[i])) continue;
      const a = kotak(anak[i]); const b = kotak(anak[j]);
      const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (x > 6 && y > 6) tindih.push(`${anak[i].className || anak[i].tagName} ∩ ${anak[j].className || anak[j].tagName} (${Math.round(x)}px)`);
    }
  }
  return {
    lebarGulir: document.documentElement.scrollWidth, lebarViewport: vw,
    tinggi: document.documentElement.scrollHeight,
    targetTotal: interaktif.length, targetKecil: kecil.length, contohKecil: kecil.slice(0, 8),
    keluar, tindih: [...new Set(tindih)].slice(0, 6),
    cls: window.__cls ?? null,
  };
}

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const hasil = [];
for (const vp of VP) {
  const cfg = VIEWPORT[vp];
  const ctx = await browser.newContext({ viewport: { width: cfg.width, height: cfg.height }, deviceScaleFactor: cfg.mobile ? 2 : 1, isMobile: cfg.mobile, hasTouch: cfg.mobile, locale: 'id-ID' });
  await ctx.addInitScript(() => {
    window.__cls = 0;
    try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); } catch {}
  });
  const page = await ctx.newPage();
  for (const rute of RUTE) {
    const nama = `${vp}-${rute.replace(/^\//, '').replace(/\//g, '_') || 'root'}`;
    try {
      const res = await page.goto(BASE + rute, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(500);
      const m = await page.evaluate(ukur, { minTarget: cfg.mobile ? 44 : 32 });
      await page.screenshot({ path: join(OUT, `${nama}.png`), fullPage: true });
      hasil.push({ vp: Number(vp), rute, status: res?.status(), ...m, overflow: m.lebarGulir > m.lebarViewport + 1 || m.keluar.length > 0 });
      console.log(`${vp} ${rute} status ${res?.status()} tinggi ${m.tinggi} kecil ${m.targetKecil}/${m.targetTotal} keluar ${m.keluar.length} tindih ${m.tindih.length} cls ${m.cls?.toFixed?.(3)}`);
    } catch (e) {
      hasil.push({ vp: Number(vp), rute, galat: e.message.slice(0, 120) });
      console.log(`${vp} ${rute} GALAT ${e.message.slice(0, 80)}`);
    }
  }
  await ctx.close();
}
await browser.close();

const md = ['# Laporan audit UI', '', `Basis: ${BASE} · ${new Date().toISOString()}`, '',
  '| VP | Rute | Tinggi | Target kecil / total | Keluar viewport | Tindih header | CLS |', '|---|---|---|---|---|---|---|',
  ...hasil.map((h) => h.galat ? `| ${h.vp} | ${h.rute} | GALAT ${h.galat} | | | | |`
    : `| ${h.vp} | ${h.rute} | ${h.tinggi} | ${h.targetKecil} / ${h.targetTotal} | ${h.keluar.join('<br>') || '—'} | ${h.tindih.join('<br>') || '—'} | ${h.cls?.toFixed?.(3) ?? '—'} |`)];
writeFileSync(join(OUT, 'laporan.json'), JSON.stringify({ base: BASE, waktu: new Date().toISOString(), hasil }, null, 1));
writeFileSync(join(OUT, 'laporan.md'), md.join('\n') + '\n');

const gagal = hasil.filter((h) => h.overflow || (h.tindih && h.tindih.length));
console.log(`\naudit-ui: ${hasil.length} tangkapan, ${gagal.length} halaman dengan overflow/tindih → ${OUT}/laporan.md`);
if (KETAT && gagal.length) process.exit(1);
