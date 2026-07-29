#!/usr/bin/env node
/**
 * fix-modul-data.js — Bersihkan data_dukung_modul yang berisi fragmen PDF tak berguna
 * Ganti dengan deskripsi bukti dukung yang di-ekstrak dari level_kriteria
 *
 * Cara pakai: node scripts/fix-modul-data.js
 * Output: data/modul-indikator.json (in-situ update)
 */

const fs = require('fs');
const path = require('path');

const MODUL_PATH = path.join(__dirname, '..', 'data', 'modul-indikator.json');
const moduls = JSON.parse(fs.readFileSync(MODUL_PATH, 'utf-8'));

let totalRemoved = 0;
let totalKept = 0;

moduls.modules.forEach(mod => {
  const oldDd = mod.data_dukung_modul || [];
  const oldRekom = mod.rekomendasi || [];

  // ── Ekstrak bukti dukung dari level_kriteria ──
  // Cari frasa "Data Dukung:" atau "Dokumen yang Dipersyaratkan:" atau "Contoh:"
  const extracted = [];
  const rekomExtracted = [];

  (mod.level_kriteria || []).forEach(lk => {
    const teks = lk.kriteria || '';

    // Ambil bagian setelah "Data Dukung:"
    const ddMatch = teks.match(/Data Dukung:?\s*([^#]*?)(?:\n|##|$)/);
    if (ddMatch && ddMatch[1].trim()) {
      const items = ddMatch[1].trim()
        .split(/[•●\-–—]\s*/)
        .map(s => s.replace(/\s+/g, ' ').trim())
        .filter(s => s.length > 10 && !s.startsWith('Nilai') && !s.startsWith('0 <') && !s.startsWith('1,50') && !s.startsWith('2,50') && !s.startsWith('3,50') && !s.startsWith('4,00'));
      items.forEach(item => {
        if (!extracted.includes(item)) extracted.push(item);
      });
    }

    // Ambil bagian setelah "Dokumen yang Dipersyaratkan:"
    const dokMatch = teks.match(/Dokumen yang Dipersyaratkan:?\s*([^#]*?)(?:\n|##|$)/);
    if (dokMatch && dokMatch[1].trim()) {
      const items = dokMatch[1].trim()
        .split(/[•●\-–—]\s*/)
        .map(s => s.replace(/\s+/g, ' ').trim())
        .filter(s => s.length > 10 && !extracted.includes(s));
      items.forEach(item => extracted.push(item));
    }

    // Ambil bagian setelah "Contoh:" (dari level criteria text)
    const conMatch = teks.match(/Contoh:?\s*([^#]*?)(?:\n|##|$)/);
    if (conMatch && conMatch[1].trim()) {
      const items = conMatch[1].trim()
        .split(/[•●\-–—]\s*/)
        .map(s => s.replace(/\s+/g, ' ').trim())
        .filter(s => s.length > 15 && !extracted.includes(s) && !s.match(/^\d/));
      items.forEach(item => extracted.push(item));
    }

    // Cari frasa rekomendasi
    const rekomMatch = teks.match(/Rekomendasi:?\s*([^#]*?)(?:\n|##|$)/);
    if (rekomMatch && rekomMatch[1].trim()) {
      const items = rekomMatch[1].trim()
        .split(/[•●\-–—]\s*/)
        .map(s => s.replace(/\s+/g, ' ').trim())
        .filter(s => s.length > 15 && !rekomExtracted.includes(s));
      items.forEach(item => rekomExtracted.push(item));
    }
  });

  // ── Validasi: extracted items harus masuk akal ──
  const cleanDd = extracted.filter(item => {
    // Skip fragmen yang terlalu pendek atau hanya angka
    if (item.length < 15) return false;
    // Skip fragmen yang masih berupa sisa markup
    if (item.includes('####') || item.includes('##')) return false;
    // Skip nilai instrumen
    if (/^[\d,.\s]+</.test(item)) return false;
    // Skip generic "Kondisi" text
    if (/^Kondisi/i.test(item) && item.length < 30) return false;
    return true;
  });

  // ── Fix rekomendasi ──
  const cleanRekom = rekomExtracted.filter(item => {
    if (item.length < 20) return false;
    if (item.includes('####') || item.includes('##')) return false;
    return true;
  });

  // ── Log ──
  const removedCount = oldDd.length - cleanDd.length;
  const keptCount = cleanDd.length;
  totalRemoved += removedCount;
  totalKept += keptCount;

  if (removedCount > 0 || oldDd.length !== cleanDd.length || oldRekom.length !== cleanRekom.length) {
    console.log(`${mod.indikator_id}: data_dukung ${oldDd.length}→${keptCount} item (hapus ${removedCount}), rekomendasi ${oldRekom.length}→${cleanRekom.length}`);
    if (cleanDd.length > 0) {
      cleanDd.forEach(item => console.log(`  📎 ${item.substring(0, 100)}`));
    }
  }

  mod.data_dukung_modul = cleanDd;
  mod.rekomendasi = cleanRekom;
});

// ── Write ──
fs.writeFileSync(MODUL_PATH, JSON.stringify(moduls, null, 2) + '\n', 'utf-8');
console.log(`\n✅ Selesai! Total: ${totalKept} kept, ${totalRemoved} removed`);
