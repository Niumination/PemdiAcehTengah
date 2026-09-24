import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const asesor = JSON.parse(readFileSync(new URL('../data/evaluasi-asesor-2026.json', import.meta.url)));
const pemdi = JSON.parse(readFileSync(new URL('../data/pemdi.json', import.meta.url)));

test('evaluasi-asesor-2026: 20 indikator, id cocok dengan pemdi.json, kode 1.1–7.2 unik', () => {
  assert.equal(asesor.indikator.length, 20);
  const ids = pemdi.aspek.flatMap((a) => a.indikator.map((i) => i.id));
  for (const i of asesor.indikator) assert.ok(ids.includes(i.id), `id ${i.id} tidak ada di pemdi.json`);
  assert.equal(new Set(asesor.indikator.map((i) => i.kode)).size, 20);
  assert.equal(new Set(asesor.indikator.map((i) => i.id)).size, 20);
});

test('evaluasi-asesor-2026: indeks 1,24 = rata-rata tertimbang skor aspek; 1,42 pembanding; level Rintisan', () => {
  assert.equal(asesor.aspek.length, 7);
  assert.equal(asesor.aspek.reduce((s, a) => s + a.bobot, 0), 100);
  const rerata = asesor.aspek.reduce((s, a) => s + a.bobot * a.skor, 0) / 100;
  assert.equal(Number(rerata.toFixed(2)), asesor.indeks.asesor);
  assert.equal(asesor.indeks.asesor, 1.24);
  assert.equal(asesor.indeks.mandiri_awal, 1.42);
  assert.match(asesor.indeks.level, /Rintisan/);
});

test('evaluasi-asesor-2026: verifikasi konsisten — N/A hanya indikator eksternal (I5, I6, I7, I18); tanpa bukti = upload tidak', () => {
  const eks = asesor.indikator.filter((i) => i.indeks_lain).map((i) => i.id).sort();
  assert.deepEqual(eks, ['I18', 'I5', 'I6', 'I7']);
  for (const i of asesor.indikator) {
    assert.ok(['ya', 'tidak', 'na'].includes(i.verifikasi.upload));
    assert.equal(i.tanpa_bukti, i.verifikasi.upload === 'tidak');
    assert.equal(i.indeks_lain, i.verifikasi.upload === 'na');
    assert.ok(i.nilai >= 1 && i.nilai <= 5);
    assert.ok(i.catatan && i.rekomendasi, `catatan/rekomendasi kosong ${i.id}`);
  }
  assert.deepEqual(asesor.indikator.filter((i) => i.tanpa_bukti).map((i) => i.kode), ['3.4', '5.2', '6.2']);
});
