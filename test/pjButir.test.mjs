import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { kumpulkanPJ, hitungButirOPD, petaButirOPD } from '../lib/pjButir.js';

const pemdi = JSON.parse(readFileSync(new URL('../data/pemdi.json', import.meta.url)));
const opd = JSON.parse(readFileSync(new URL('../data/opd.json', import.meta.url)));

test('kumpulkanPJ: satu string per butir yang punya catatan mandiri', () => {
  const pj = kumpulkanPJ(pemdi);
  assert.equal(pj.length, 48);
  assert.ok(pj.every((s) => typeof s === 'string' && s.length > 0));
});

test('hitungButirOPD: Diskominfo dihitung lewat alias (walidata, persandian, APTIKA)', () => {
  const pj = ['Diskominfo (Bidang APTIKA)', 'Bappeda (Koordinator Forum SDI) + Diskominfo (Walidata)', 'BKPSDM'];
  assert.equal(hitungButirOPD({ nama: 'Dinas Komunikasi dan Informatika', singkat: 'Diskominfo' }, pj), 2);
  assert.equal(hitungButirOPD({ nama: 'Badan Perencanaan Pembangunan Daerah', singkat: 'Bappeda' }, pj), 1);
  assert.equal(hitungButirOPD({ nama: 'Dinas Kesehatan', singkat: 'Dinkes' }, pj), 0);
});

test('petaButirOPD: Diskominfo koordinator terbanyak; kecamatan nol', () => {
  const map = petaButirOPD(opd.opd.daftar, pemdi);
  const kominfo = opd.opd.daftar.find((o) => o.singkat === 'Diskominfo');
  assert.ok(map[kominfo.id ?? kominfo.nama] >= 40);
  const kec = opd.opd.daftar.find((o) => o.jenis === 'kecamatan');
  if (kec) assert.equal(map[kec.id ?? kec.nama], 0);
});
