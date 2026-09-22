import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ringkasIndikator, antreanButir, bebanPJ, antreanUntukOPD, kunciPJ, kodePortal, hariKe } from '../lib/ruangKendali.js';

const pemdi = JSON.parse(readFileSync(new URL('../data/pemdi.json', import.meta.url)));
const opd = JSON.parse(readFileSync(new URL('../data/opd.json', import.meta.url)));

test('ringkasIndikator: 20 indikator, levelBerikut = dicapai+1, eksternal ditandai', () => {
  const r = ringkasIndikator(pemdi);
  assert.equal(r.length, 20);
  for (const i of r) {
    if (i.levelDicapai < 5) assert.equal(i.levelBerikut, i.levelDicapai + 1);
    assert.equal(Object.keys(i.perLevel).length, 5);
    assert.equal(i.stat.total, Object.values(i.perLevel).reduce((s, p) => s + p.total, 0));
  }
  assert.ok(['I5', 'I6', 'I7', 'I18'].every((id) => r.find((x) => x.id === id).eksternal));
});

test('antreanButir: 48 butir, urut prioritas tinggi dulu, kode portal benar', () => {
  const a = antreanButir(pemdi);
  assert.equal(a.length, 48);
  const urut = a.map((b) => ({ tinggi: 0, sedang: 1, rendah: 2 })[b.prioritas]);
  assert.deepEqual(urut, [...urut].sort((x, y) => x - y));
  assert.equal(a.filter((b) => b.prioritas === 'tinggi').length, 23);
  assert.ok(a.every((b) => /^I\d+-L\d-\d\d$/.test(b.kode)));
});

test('bebanPJ: hanya OPD yang punya butir; Diskominfo terbanyak; pecahan prioritas = total', () => {
  const a = antreanButir(pemdi);
  const b = bebanPJ(a, opd.opd.daftar);
  assert.ok(b.length >= 8 && b.length <= 12, `jumlah OPD ${b.length}`);
  assert.equal(b[0].singkat, 'Diskominfo');
  for (const r of b) assert.equal(r.tinggi + r.sedang + r.rendah, r.total);
});

test('antreanUntukOPD: filter BKPSDM memberi subset yang menyebut BKPSDM', () => {
  const a = antreanButir(pemdi);
  const bk = opd.opd.daftar.find((o) => o.singkat === 'BKPSDM');
  const sub = antreanUntukOPD(a, bk);
  assert.ok(sub.length > 0 && sub.length < a.length);
  assert.ok(sub.every((b) => /bkpsdm/i.test(b.pj)));
});

test('util: kunciPJ, kodePortal, hariKe', () => {
  assert.equal(kunciPJ('Diskominfo (Bidang APTIKA) + Bagian Hukum'), 'Diskominfo');
  assert.equal(kunciPJ('Setda Bagian Organisasi, Diskominfo'), 'Setda Bagian Organisasi');
  assert.equal(kodePortal('GT.I12_L2_1'), 'I12-L2-01');
  assert.equal(kodePortal('lain'), 'lain');
  assert.equal(hariKe('2026-09-28', new Date('2026-09-22T09:00:00+07:00')), 6);
  assert.equal(hariKe('2026-09-20', new Date('2026-09-22T09:00:00+07:00')), -2);
});
