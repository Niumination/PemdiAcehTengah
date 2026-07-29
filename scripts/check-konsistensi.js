#!/usr/bin/env node
/**
 * check-konsistensi.js — Periksa konsistensi bukti dukung antara pemdi.json dan modul-indikator.json
 * 
 * Usage: node scripts/check-konsistensi.js
 */

const fs = require('fs');
const path = require('path');

const pemdi = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'pemdi.json'), 'utf-8'));
const moduls = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'modul-indikator.json'), 'utf-8'));

// ── 1. Build pemdi map ──
const pMap = {};
pemdi.aspek.forEach(a => {
  a.indikator.forEach(ind => {
    const bd = ind.bukti_dukung || [];
    const levels = [...new Set(bd.map(b => b.level))].sort();
    const st = { lengkap: 0, proses: 0, belum: 0 };
    bd.forEach(b => { st[b.status] = (st[b.status] || 0) + 1; });
    pMap[ind.id] = {
      bukti_count: bd.length,
      bukti_ids: bd.map(b => b.id),
      bukti_levels: levels,
      status: st,
      pj_lead: ind.penanggung_jawab?.lead || '—',
      aspek: a.nama,
    };
  });
});

// ── 2. Print table ──
console.log('=== KONSISTENSI: PEMDI vs MODUL INDIKATOR ===\n');
console.log('MOD | DATA DUKUNG MODUL | BUKTI PEMDI | STATUS (L/P/B) | LEVEL KRITERIA MODUL | LEVEL BUKTI PEMDI | PJ');
console.log('────|───────────────────|─────────────|───────────────|──────────────────────|──────────────────|───────');

moduls.modules.forEach(mod => {
  const info = pMap[mod.indikator_id];
  const dd = mod.data_dukung_modul || [];
  const bc = info?.bukti_count || 0;
  const st = info?.status || { lengkap: 0, proses: 0, belum: 0 };
  const kLevels = (mod.level_kriteria || []).map(l => l.level).sort();
  const pLevels = info?.bukti_levels || [];
  const gap = kLevels.filter(l => !pLevels.includes(l));

  const flag = gap.length > 0 || (dd.length > 0 && bc === 0) ? ' ⚠️' : '';
  console.log(
    `${mod.indikator_id.padEnd(4)}${flag} | ${String(dd.length).padStart(2)} item${' '.repeat(12)} | ${String(bc).padStart(2)} item${' '.repeat(8)} | ` +
    `L:${st.lengkap} P:${st.proses} B:${st.belum}    | ` +
    `[${kLevels.join(',')}]${' '.repeat(Math.max(1, 17 - kLevels.join(',').length))} | ` +
    `[${pLevels.join(',')}]${' '.repeat(Math.max(1, 15 - pLevels.join(',').length))} | ` +
    `${(info?.pj_lead || '—').substring(0, 40)}`
  );
});

// ── 3. Gap analysis ──
console.log('\n\n=== ANALISIS KESENJANGAN ===\n');

console.log('1️⃣  Indikator dengan level criteria TAPI sedikit/tidak ada bukti dukung:');
moduls.modules.forEach(mod => {
  const info = pMap[mod.indikator_id];
  const bc = info?.bukti_count || 0;
  const lkLen = (mod.level_kriteria || []).length;
  if (lkLen >= 2 && bc <= 1) {
    console.log(`   ⚠️  ${mod.indikator_id} — ${mod.judul.substring(0, 55)}`);
    console.log(`      ${lkLen} level kriteria, hanya ${bc} bukti dukung di pemdi`);
    console.log(`      Level kriteria: [${(mod.level_kriteria||[]).map(l=>l.level).sort().join(',')}]`);
    console.log();
  }
});

console.log('\n2️⃣  Indikator dengan data_dukung_modul TAPI TIDAK ada bukti dukung di pemdi:');
moduls.modules.forEach(mod => {
  const info = pMap[mod.indikator_id];
  const dd = mod.data_dukung_modul || [];
  const bc = info?.bukti_count || 0;
  if (dd.length > 0 && bc === 0) {
    console.log(`   ❌ ${mod.indikator_id} — ${mod.judul.substring(0, 55)}`);
    dd.forEach((item, i) => console.log(`      ${i+1}. ${item}`));
    console.log();
  }
});

console.log('\n3️⃣  Indikator yang TIDAK punya level criteria level 1-5 lengkap (data mungkin missing dari ekstraksi PDF):');
moduls.modules.forEach(mod => {
  const levels = (mod.level_kriteria || []).map(l => l.level).sort((a, b) => a - b);
  const allLevels = [0, 1, 2, 3, 4, 5];
  const missing = allLevels.filter(l => !levels.includes(l));
  if (missing.length > 0) {
    console.log(`   ⚠️  ${mod.indikator_id} — ${mod.judul.substring(0, 55)}`);
    console.log(`      Ada: [${levels.join(',')}], Missing: [${missing.join(',')}]`);
  }
});

console.log('\n\n=== REKOMENDASI ===');
console.log('- Indikator dengan ⚠️ di tabel: perlu ditambah bukti dukung di pemdi.json');
console.log('- Data dukung modul yang masih mentah (fragmen PDF) perlu diverifikasi kontennya');
console.log('- Status existing sudah bagus, hanya I19 dan I20 yang punya bukti lengkap');
