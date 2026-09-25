import test from 'node:test';
import assert from 'node:assert/strict';
import { periksaData } from '../scripts/cek-data.mjs';

test('cek-data: data/*.json konsisten (angka utama, status, PJ)', async () => {
  const { gagal } = await periksaData();
  assert.deepEqual(gagal, []);
});
