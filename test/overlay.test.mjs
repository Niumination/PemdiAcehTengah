import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { terapkanOverlay, validasiPatchButir, validasiKonten, susunEkspor } from '../lib/overlay.js';
import { buatToken, verifikasiToken, cekSandi } from '../lib/cmsAuth.js';

const pemdi = JSON.parse(readFileSync(new URL('../data/pemdi.json', import.meta.url)));
const catatan = JSON.parse(readFileSync(new URL('../data/catatan-mandiri.json', import.meta.url)));
const ENV = { CMS_SESI_RAHASIA: 'x'.repeat(40), CMS_SANDI_KOORDINATOR: 'koor-123', CMS_SANDI_PJ: 'pj-456' };

test('terapkanOverlay: tanpa baris → objek sama, 0 diterapkan', () => {
  const r = terapkanOverlay(pemdi, []);
  assert.equal(r.diterapkan, 0);
  assert.equal(r.pemdi, pemdi);
});

test('terapkanOverlay: menimpa status & catatan tanpa mengubah nama butir; sumber asli tak tersentuh', () => {
  const id = 'GT.I20_L1_3';
  const r = terapkanOverlay(pemdi, [{ id, status: 'proses', ringkas: 'Sudah diunggah ulang', prioritas: 'rendah', pj: null, kebutuhan: null, diubah_pada: '2026-09-23T01:00:00Z' }]);
  assert.equal(r.diterapkan, 1);
  const cari = (d) => d.aspek.flatMap((a) => a.indikator).flatMap((i) => i.bukti_dukung).find((b) => b.id === id);
  const baru = cari(r.pemdi); const asli = cari(pemdi);
  assert.equal(baru.status, 'proses');
  assert.equal(baru.nama, asli.nama);
  assert.equal(baru.catatan_mandiri.ringkas, 'Sudah diunggah ulang');
  assert.equal(baru.catatan_mandiri.prioritas, 'rendah');
  assert.equal(baru.catatan_mandiri.pj, asli.catatan_mandiri.pj); // null di overlay → tetap
  assert.equal(baru.catatan_mandiri.sumber, 'cms');
  assert.equal(asli.status, 'revisi');
});

test('validasiPatchButir: tolak status/prioritas asing & patch kosong', () => {
  assert.equal(validasiPatchButir({ status: 'ok' }).ok, false);
  assert.equal(validasiPatchButir({ prioritas: 'urgent' }).ok, false);
  assert.equal(validasiPatchButir({}).ok, false);
  assert.equal(validasiPatchButir({ nama: 'ubah nama' }).ok, false);
  const v = validasiPatchButir({ status: 'draf', kebutuhan: [' a ', '', 'b'] });
  assert.deepEqual(v, { ok: true, patch: { status: 'draf', kebutuhan: ['a', 'b'] } });
});

test('validasiKonten: kunci & format', () => {
  assert.equal(validasiKonten('judul', 'x').ok, false);
  assert.equal(validasiKonten('tenggat', '28-09-2026').ok, false);
  assert.equal(validasiKonten('tenggat', '2026-09-28').ok, true);
  assert.equal(validasiKonten('marquee', 'a'.repeat(401)).ok, false);
});

test('susunEkspor: gabung overlay ke catatan-mandiri + status_overlay', () => {
  const e = susunEkspor(catatan, [{ id: 'GT.I20_L1_3', status: 'proses', ringkas: 'baru', pj: null, prioritas: null, kebutuhan: null }], new Date('2026-09-23T00:00:00Z'));
  assert.equal(e.hash_dasar, 'terserap');
  assert.equal(e.versi, '2026-09-23');
  assert.equal(e.status_overlay['GT.I20_L1_3'], 'proses');
  assert.equal(e.butir['GT.I20_L1_3'].ringkas, 'baru');
  assert.equal(e.butir['GT.I20_L1_3'].jenis, catatan.butir['GT.I20_L1_3'].jenis);
  assert.equal(Object.keys(catatan.butir).length, 48);
});

test('cmsAuth: token HMAC valid, kedaluwarsa & sandi per peran', () => {
  const t = buatToken({ peran: 'pj', opd: '21' }, ENV, 1_000_000_000_000);
  assert.deepEqual(verifikasiToken(t, ENV, 1_000_000_000_000 + 1000), { peran: 'pj', opd: '21' });
  assert.equal(verifikasiToken(t, ENV, 1_000_000_000_000 + 13 * 3600 * 1000), null);
  assert.equal(verifikasiToken(`${t}x`, ENV), null);
  assert.equal(verifikasiToken(t, { ...ENV, CMS_SESI_RAHASIA: 'lain'.repeat(10) }), null);
  assert.equal(cekSandi('koordinator', 'koor-123', ENV), true);
  assert.equal(cekSandi('pj', 'koor-123', ENV), false);
  assert.equal(cekSandi('koordinator', 'koor-123', {}), false);
});
