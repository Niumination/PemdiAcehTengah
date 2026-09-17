/**
 * Pin regresi data — data/requirement.json (Sprint A6 2026-09-17)
 * Setelah api/requirement.js di-refactor ke sumber tunggal JSON,
 * pin ini menjaga kontrak: 12 kategori · 83 item · 5 output.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const data = JSON.parse(readFileSync(new URL('../data/requirement.json', import.meta.url), 'utf8'));

test('requirement.json: struktur lengkap (summary+categories+outputs)', () => {
  assert.deepEqual(Object.keys(data).sort(), ['categories', 'outputs', 'summary']);
});

test('requirement.json: 12 kategori · 83 item kebutuhan', () => {
  assert.equal(data.summary.length, 12);
  assert.equal(data.categories.length, 12);
  const total = data.categories.reduce((s, c) => s + c.items.length, 0);
  assert.equal(total, 83);
});

test('requirement.json: count di summary = jumlah item per kategori', () => {
  for (const c of data.categories) {
    const sum = data.summary.find((s) => s.category.startsWith(`${c.id}.`));
    assert.ok(sum, `summary untuk kategori ${c.id} tidak ditemukan`);
    assert.equal(sum.count, c.items.length, `kategori ${c.id}`);
  }
});

test('requirement.json: 5 output PPB', () => {
  assert.equal(data.outputs.length, 5);
});
