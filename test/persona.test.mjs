/** Unit test — lib/persona.js & lib/sektorLayanan.js (Sprint UI/UX 21 Sep 2026) */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parsePersona, personaHref, PERSONA_ASESOR, PERSONA_PUBLIK, PERSONAS } from '../lib/persona.js';
import { kelompokkanSektor, SEKTOR, KATA_KUNCI_POPULER } from '../lib/sektorLayanan.js';

const layanan = JSON.parse(readFileSync(new URL('../data/layanan.json', import.meta.url), 'utf8'));

test('parsePersona: hanya publik|asesor yang valid (array query, huruf besar, spasi)', () => {
  assert.equal(parsePersona('asesor'), PERSONA_ASESOR);
  assert.equal(parsePersona(' PUBLIK '), PERSONA_PUBLIK);
  assert.equal(parsePersona(['asesor', 'publik']), PERSONA_ASESOR);
  assert.equal(parsePersona('admin'), null);
  assert.equal(parsePersona(undefined), null);
});

test('personaHref: publik = URL kanonik bersih, asesor = ?view=asesor', () => {
  assert.equal(personaHref(PERSONA_PUBLIK), '/');
  assert.equal(personaHref(PERSONA_ASESOR), '/?view=asesor');
  assert.equal(PERSONAS.length, 2);
});

test('kelompokkanSektor: 6 sektor, tidak ada layanan hilang/duplikat', () => {
  const s = kelompokkanSektor(layanan.kategori);
  assert.equal(s.length, 6);
  assert.deepEqual(s.map((x) => x.id), SEKTOR.map((x) => x.id));
  const total = s.reduce((n, x) => n + x.jumlah, 0);
  assert.equal(total, layanan.ringkasan.total_layanan);
  const names = s.flatMap((x) => x.layanan.map((l) => `${l.kategori_id}|${l.nama}`));
  assert.equal(new Set(names).size, names.length);
  const kes = s.find((x) => x.id === 'kesehatan-sosial');
  assert.ok(kes.layanan.some((l) => l.kategori_id === 'kesehatan') && kes.layanan.some((l) => l.kategori_id === 'sosial'));
});

test('kelompokkanSektor: kategori baru tak terpetakan tetap tampil (masuk sektor terakhir)', () => {
  const extra = [...layanan.kategori, { id: 'baru', nama: 'Baru', layanan: [{ nama: 'X', online: true }] }];
  const s = kelompokkanSektor(extra);
  assert.equal(s.reduce((n, x) => n + x.jumlah, 0), layanan.ringkasan.total_layanan + 1);
  assert.ok(s[5].layanan.some((l) => l.nama === 'X'));
});

test('5 kata kunci populer sesuai instruksi (KTP, KK, Perizinan, Pajak, Lapor)', () => {
  assert.deepEqual(KATA_KUNCI_POPULER.map((k) => k.label), ['KTP', 'KK', 'Perizinan', 'Pajak', 'Lapor']);
});

// ── lib/modeSitus.js (saklar persona publik) ──
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { isRutePublik, RUTE_PUBLIK, API_PUBLIK, PUBLIK_AKTIF } = require('../lib/modeSitus.js');

test('modeSitus: default (env kosong) = mode internal', () => {
  assert.equal(PUBLIK_AKTIF, process.env.NEXT_PUBLIC_PERSONA_PUBLIK === 'on');
});

test('isRutePublik: halaman & API warga (beserta sub-path/hash/trailing slash) terdeteksi; rute internal tidak', () => {
  for (const r of [...RUTE_PUBLIK, ...API_PUBLIK]) assert.equal(isRutePublik(r), true, r);
  assert.equal(isRutePublik('/layanan/'), true);
  assert.equal(isRutePublik('/layanan#kependudukan'), true);
  assert.equal(isRutePublik('/faq#slug'), true);
  assert.equal(isRutePublik('/skm?src=x'), true);
  assert.equal(isRutePublik('/api/lapor/status'), true);
  assert.equal(isRutePublik('/api/skm/stats'), true);
  assert.equal(isRutePublik('/admin'), true);
  assert.equal(isRutePublik('/api/admin/laporan'), true);
  for (const r of ['/', '/pemdi', '/modul-indikator', '/requirement', '/spbe', '/opd', '/opd/setda', '/glosarium', '/cari', '/api/health', '/api/requirement', '/api/spbe', '/api/opd', '/probis']) {
    assert.equal(isRutePublik(r), false, r);
  }
  // prefix palsu tidak boleh cocok
  assert.equal(isRutePublik('/layanan-internal'), false);
  assert.equal(isRutePublik('/skmx'), false);
});
