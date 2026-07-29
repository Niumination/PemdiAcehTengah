#!/usr/bin/env node
/**
 * check-pemdi-items.js — Periksa apakah setiap bukti_dukung di pemdi.json
 * sesuai dengan level_kriteria di modul-indikator.json untuk indikator yang sama
 *
 * Strategi: cek overlap kata kunci antara nama/detail bukti dukung dan
 * level_kriteria modul. Jika overlap < threshold → curiga misplaced.
 *
 * Usage: node scripts/check-pemdi-items.js
 */

const fs = require('fs');
const path = require('path');

const pemdi = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'pemdi.json'), 'utf-8'));
const moduls = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'modul-indikator.json'), 'utf-8'));

// ── Build modul index by indikator_id ──
const modulIndex = {};
moduls.modules.forEach(m => { modulIndex[m.indikator_id] = m; });

function tokenize(str) {
  if (!str) return [];
  return str.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !['yang','dengan','untuk','telah','dari','dalam','pada','adalah','akan','tidak','serta','atau','bagi','sebagai','secara','antara','lain','seperti','hingga','kepada','setiap','melalui','berupa','dapat','tentang','berdasarkan','tersebut','merupakan','maupun'].includes(w));
}

function hitungOverlap(judul, detail, kriterias) {
  const kataJudul = new Set(tokenize(judul + ' ' + (detail || '')));
  const kataKriteria = new Set();
  (kriterias || []).forEach(k => {
    tokenize(k.kriteria).forEach(w => kataKriteria.add(w));
  });
  
  if (kataJudul.size === 0) return { score: 0, match: [] };
  
  let matches = [];
  kataJudul.forEach(w => {
    if (kataKriteria.has(w)) matches.push(w);
  });
  
  return {
    score: matches.length / kataJudul.size,
    match: matches,
    totalKata: kataJudul.size,
    matchCount: matches.length,
  };
}

console.log('=== VERIFIKASI BUKTI DUKUNG PEMDI vs MODUL INDIKATOR ===\n');
console.log('Mengecek apakah setiap bukti_dukung sesuai dengan level_kriteria modul...\n');

// ── Check each bukti_dukung ──
const suspicious = [];
const results = [];

pemdi.aspek.forEach(a => {
  a.indikator.forEach(ind => {
    const modul = modulIndex[ind.id];
    if (!modul) {
      console.log(`❌ ${ind.id}: indikator TIDAK ditemukan di modul-indikator.json`);
      return;
    }
    
    const kriterias = modul.level_kriteria || [];
    (ind.bukti_dukung || []).forEach(bd => {
      const result = hitungOverlap(bd.nama, bd.detail, kriterias);
      results.push({
        indikator: ind.id,
        id: bd.id,
        nama: bd.nama,
        level: bd.level,
        score: result.score,
        matchCount: result.matchCount,
        totalKata: result.totalKata,
        matches: result.match,
      });
      
      // Suspicious if overlap score < 0.1 AND total kata >= 3
      if (result.score < 0.1 && result.totalKata >= 3) {
        suspicious.push({
          indikator: ind.id,
          id: bd.id,
          nama: bd.nama,
          level: bd.level,
          score: result.score,
          matchCount: result.matchCount,
          totalKata: result.totalKata,
          matches: result.match,
        });
      }
    });
  });
});

// ── Print results ──
console.log('📋 Summary per Indikator:');
let lastInd = '';
results.sort((a, b) => a.indikator.localeCompare(b.indikator) || a.id.localeCompare(b.id));
results.forEach(r => {
  if (r.indikator !== lastInd) {
    console.log(`\n${r.indikator}:`);
    lastInd = r.indikator;
  }
  const flag = r.score < 0.1 && r.totalKata >= 3 ? ' ⚠️' : ' ✅';
  console.log(`  ${r.id}: overlap=${(r.score*100).toFixed(0)}% (${r.matchCount}/${r.totalKata} kata)${flag}`);
});

console.log('\n\n=== ITEM CURIGA (overlap < 10%) ===');
if (suspicious.length === 0) {
  console.log('✅ Tidak ada item mencurigakan — semua bukti dukung sesuai dengan modul.');
} else {
  suspicious.forEach(s => {
    console.log(`\n⚠️  ${s.indikator}/${s.id} — ${s.nama.substring(0, 70)}`);
    console.log(`   Level ${s.level}, overlap ${(s.score*100).toFixed(0)}%, match: [${s.matches.join(', ')}]`);
  });
}

console.log('\n\n=== REKOMENDASI ===');
if (suspicious.length > 0) {
  console.log('- Item ⚠️ di atas perlu dicek manual: apakah benar milik indikator ini?');
  console.log('- Jika tidak sesuai, pindahkan ke indikator lain atau hapus.');
} else {
  console.log('- Semua bukti dukung sudah sesuai dengan indikatornya.');
  console.log('- Tidak ada yang perlu dihapus.');
}
console.log('- Note: overlap rendah bisa disebabkan level_kriteria modul tidak lengkap (missing level).');
console.log('- Status existing di pemdi.json tidak perlu diubah.');
