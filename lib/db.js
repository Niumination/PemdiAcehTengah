/**
 * lib/db.js — Akses Postgres (Neon) untuk CMS Ruang Kendali (Patch 4, server-only).
 * Tanpa ORM. Bila `DATABASE_URL` tidak diatur, `getSql()` mengembalikan null dan
 * seluruh fitur CMS menurun anggun (degrade): data tetap dari JSON.
 */
import { neon } from '@neondatabase/serverless';

let sql = null;
let skemaSiap = null;

/**
 * Sumber DB:
 *  - `DATABASE_URL` (postgres://…) → Neon serverless (produksi).
 *  - `CMS_DB_LOKAL=<dir>` (pengembangan/uji saja) → PGlite (Postgres WASM, devDependency),
 *    data di direktori itu; API sama (tagged template `sql\`…\``). Tidak untuk Vercel.
 */
export function dbAktif() {
  return Boolean(process.env.DATABASE_URL || process.env.CMS_DB_LOKAL);
}

function buatSqlPglite(dir) {
  // eslint-disable-next-line global-require
  const { PGlite } = require('@electric-sql/pglite');
  const pg = new PGlite(dir);
  const tagged = async (strings, ...nilai) => {
    const teks = strings.reduce((acc, s, i) => acc + s + (i < nilai.length ? `$${i + 1}` : ''), '');
    const r = await pg.query(teks, nilai);
    return r.rows;
  };
  return tagged;
}

export function getSql() {
  if (!dbAktif()) return null;
  if (!sql) sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : buatSqlPglite(process.env.CMS_DB_LOKAL);
  return sql;
}

/** Buat tabel bila belum ada (idempoten; dijalankan sekali per instance). */
export async function pastikanSkema() {
  const q = getSql();
  if (!q) return false;
  if (!skemaSiap) {
    skemaSiap = (async () => {
      await q`CREATE TABLE IF NOT EXISTS butir_overlay (
        id text PRIMARY KEY,
        status text,
        ringkas text,
        pj text,
        prioritas text,
        kebutuhan jsonb,
        diubah_oleh text NOT NULL,
        diubah_pada timestamptz NOT NULL DEFAULT now()
      )`;
      await q`CREATE TABLE IF NOT EXISTS konten_tampilan (
        kunci text PRIMARY KEY,
        nilai jsonb NOT NULL,
        diubah_oleh text NOT NULL,
        diubah_pada timestamptz NOT NULL DEFAULT now()
      )`;
      await q`CREATE TABLE IF NOT EXISTS log_audit (
        id bigserial PRIMARY KEY,
        waktu timestamptz NOT NULL DEFAULT now(),
        peran text NOT NULL,
        opd text,
        aksi text NOT NULL,
        target text NOT NULL,
        sebelum jsonb,
        sesudah jsonb
      )`;
      return true;
    })().catch((e) => { skemaSiap = null; throw e; });
  }
  return skemaSiap;
}

export async function bacaOverlay() {
  const q = getSql();
  if (!q) return { butir: [], konten: {} };
  await pastikanSkema();
  const [butir, konten] = await Promise.all([
    q`SELECT id, status, ringkas, pj, prioritas, kebutuhan, diubah_oleh, diubah_pada FROM butir_overlay`,
    q`SELECT kunci, nilai, diubah_oleh, diubah_pada FROM konten_tampilan`,
  ]);
  const k = {};
  for (const r of konten) k[r.kunci] = r.nilai;
  return { butir, konten: k };
}

export async function simpanButir(id, patch, oleh) {
  const q = getSql();
  await pastikanSkema();
  const lama = (await q`SELECT * FROM butir_overlay WHERE id = ${id}`)[0] || null;
  const baru = {
    status: patch.status ?? lama?.status ?? null,
    ringkas: patch.ringkas ?? lama?.ringkas ?? null,
    pj: patch.pj ?? lama?.pj ?? null,
    prioritas: patch.prioritas ?? lama?.prioritas ?? null,
    kebutuhan: patch.kebutuhan ?? lama?.kebutuhan ?? null,
  };
  await q`INSERT INTO butir_overlay (id, status, ringkas, pj, prioritas, kebutuhan, diubah_oleh, diubah_pada)
    VALUES (${id}, ${baru.status}, ${baru.ringkas}, ${baru.pj}, ${baru.prioritas}, ${JSON.stringify(baru.kebutuhan)}::jsonb, ${oleh}, now())
    ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, ringkas = EXCLUDED.ringkas, pj = EXCLUDED.pj,
      prioritas = EXCLUDED.prioritas, kebutuhan = EXCLUDED.kebutuhan, diubah_oleh = EXCLUDED.diubah_oleh, diubah_pada = now()`;
  return { lama, baru };
}

export async function simpanKonten(kunci, nilai, oleh) {
  const q = getSql();
  await pastikanSkema();
  const lama = (await q`SELECT nilai FROM konten_tampilan WHERE kunci = ${kunci}`)[0]?.nilai ?? null;
  await q`INSERT INTO konten_tampilan (kunci, nilai, diubah_oleh, diubah_pada)
    VALUES (${kunci}, ${JSON.stringify(nilai)}::jsonb, ${oleh}, now())
    ON CONFLICT (kunci) DO UPDATE SET nilai = EXCLUDED.nilai, diubah_oleh = EXCLUDED.diubah_oleh, diubah_pada = now()`;
  return { lama, baru: nilai };
}

export async function catatLog({ peran, opd = null, aksi, target, sebelum = null, sesudah = null }) {
  const q = getSql();
  if (!q) return;
  await pastikanSkema();
  await q`INSERT INTO log_audit (peran, opd, aksi, target, sebelum, sesudah)
    VALUES (${peran}, ${opd}, ${aksi}, ${target}, ${JSON.stringify(sebelum)}::jsonb, ${JSON.stringify(sesudah)}::jsonb)`;
}

export async function bacaLog(batas = 200) {
  const q = getSql();
  if (!q) return [];
  await pastikanSkema();
  return q`SELECT id, waktu, peran, opd, aksi, target, sebelum, sesudah FROM log_audit ORDER BY id DESC LIMIT ${batas}`;
}
