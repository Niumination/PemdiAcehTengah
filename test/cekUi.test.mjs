import test from 'node:test';
import assert from 'node:assert/strict';
import { periksa } from '../scripts/cek-ui.mjs';

test('cek-ui: tidak ada emoji ikon & tidak ada teks < 11px', () => {
  const m = periksa();
  assert.deepEqual(m, []);
});
