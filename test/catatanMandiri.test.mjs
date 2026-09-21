/**
 * Unit test — lib/catatanMandiri.js + konsistensi data/catatan-mandiri.json ↔ data/pemdi.json
 * (48 butir: 19 revisi + 29 butir level berikut · 21 Sep 2026).
 *
 * Jalankan: npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fokusLevel } from '../lib/pemdiNilai.js';
import {
  butirBercatatan, teksCatatanButir, teksCatatanIndikator, htmlCatatanIndikator, zipStore,
} from '../lib/catatanMandiri.js';

const pemdi = JSON.parse(readFileSync(new URL('../data/pemdi.json', import.meta.url), 'utf8'));
const cm = JSON.parse(readFileSync(new URL('../data/catatan-mandiri.json', import.meta.url), 'utf8'));
const semuaInd = pemdi.aspek.flatMap((a) => a.indikator);
const semuaButir = semuaInd.flatMap((i) => i.bukti_dukung || []);

test('cakupan: setiap butir revisi punya catatan mandiri', () => {
  const revisi = semuaButir.filter((b) => b.status === 'revisi');
  assert.equal(revisi.length, 19);
  for (const b of revisi) assert.ok(b.catatan_mandiri, `${b.id} tanpa catatan`);
  for (const b of revisi) assert.equal(b.catatan_mandiri.jenis, 'revisi', b.id);
});

test('cakupan: setiap butir belum diterima pada level berikut punya catatan mandiri', () => {
  for (const ind of semuaInd) {
    const f = fokusLevel(ind);
    if (!f.levelBerikut) continue;
    for (const b of ind.bukti_dukung || []) {
      if (b.level === f.levelBerikut && b.status !== 'diterima') {
        assert.ok(b.catatan_mandiri, `${ind.id} ${b.id} (L${b.level}) tanpa catatan`);
      }
    }
  }
});

test('batas: butir diterima tidak pernah punya catatan mandiri', () => {
  for (const b of semuaButir) if (b.status === 'diterima') assert.equal(b.catatan_mandiri, undefined, b.id);
});

test('pemdi.json sinkron dengan catatan-mandiri.json (jumlah, meta, versi)', () => {
  const n = semuaButir.filter((b) => b.catatan_mandiri).length;
  assert.equal(n, Object.keys(cm.butir).length);
  assert.equal(pemdi.catatan_mandiri_meta.jumlah_butir, n);
  assert.equal(pemdi.catatan_mandiri_meta.versi, cm.versi);
  assert.equal(pemdi.catatan_mandiri_meta.materi_asesor_eksternal.status, 'belum_diterima');
  for (const b of semuaButir) if (b.catatan_mandiri) assert.equal(b.catatan_mandiri.versi, cm.versi);
});

test('rujukan: kode dokumen dikenal, berkas lokal ada, halaman terisi untuk PDF berteks', () => {
  for (const [id, c] of Object.entries(cm.butir)) {
    assert.ok(c.ringkas.length > 80, `${id} ringkas terlalu pendek`);
    assert.ok(c.rujukan.length >= 1, `${id} tanpa rujukan`);
    for (const r of c.rujukan) {
      const d = cm.dokumen[r.dok];
      assert.ok(d, `${id}: dokumen ${r.dok} tidak dikenal`);
      if (d.path) assert.ok(existsSync(new URL(`../public${d.path}`, import.meta.url)), `${id}: ${d.path} hilang`);
      if (d.teks === true) assert.notEqual(r.halaman, '—', `${id}: rujukan ${r.dok} berteks tapi tanpa halaman`);
      if (d.teks === false) assert.equal(r.halaman, '—', `${id}: rujukan pindai ${r.dok} tidak boleh punya halaman`);
    }
  }
});

test('butirBercatatan urut level lalu id', () => {
  const i13 = semuaInd.find((i) => i.id === 'I13');
  const lv = butirBercatatan(i13).map((b) => b.level);
  assert.deepEqual(lv, [...lv].sort((a, b) => a - b));
  assert.ok(lv.length >= 5);
});

test('teksCatatanButir memuat kode eval, catatan asesor, rujukan bernomor', () => {
  const ind = semuaInd.find((i) => i.id === 'I9');
  const b = ind.bukti_dukung.find((x) => x.id === 'GT.I9_L1_1');
  const t = teksCatatanButir(b, ind);
  assert.match(t, /^CATATAN MANDIRI — I9-L1-01 · I9 Level 1/);
  assert.match(t, /Catatan asesor tahap 1: Bukti dukung yang diberikan tidak tepat/);
  assert.match(t, /Rujukan dokumen:\n1\. /);
  assert.match(t, /hal\. 5, 7/);
  assert.match(t, /https:\/\/jdih\.acehtengahkab\.go\.id/);
});

test('teksCatatanIndikator menggabungkan seluruh butir; butir tanpa catatan → string kosong', () => {
  const ind = semuaInd.find((i) => i.id === 'I20');
  const t = teksCatatanIndikator(ind);
  assert.match(t, /^CATATAN MANDIRI I20/);
  assert.equal((t.match(/CATATAN MANDIRI — /g) || []).length, butirBercatatan(ind).length);
  assert.equal(teksCatatanButir({ id: 'x', level: 1, nama: 'y' }, ind), '');
});

test('htmlCatatanIndikator: dokumen mandiri, meng-escape HTML, tanpa sumber eksternal', () => {
  const ind = semuaInd.find((i) => i.id === 'I4');
  const h = htmlCatatanIndikator({ ...ind, nama: ind.nama + ' <b>x</b>' }, { versi: '2026-09-21' });
  assert.match(h, /^<!doctype html>/);
  assert.match(h, /&lt;b&gt;x&lt;\/b&gt;/);
  assert.doesNotMatch(h, /<script src=|<link /);
  assert.match(h, /versi data 2026-09-21/);
});

test('zipStore menghasilkan arsip ZIP valid (tanda tangan lokal + EOCD, jumlah entri)', () => {
  const z = zipStore([{ name: 'a.txt', data: 'halo' }, { name: 'd/b.xml', data: '<x/>' }]);
  assert.equal(z[0], 0x50); assert.equal(z[1], 0x4b); assert.equal(z[2], 0x03); assert.equal(z[3], 0x04);
  const eocd = z.length - 22;
  assert.equal(z[eocd], 0x50); assert.equal(z[eocd + 1], 0x4b); assert.equal(z[eocd + 2], 0x05); assert.equal(z[eocd + 3], 0x06);
  assert.equal(z[eocd + 10] | (z[eocd + 11] << 8), 2);
});
