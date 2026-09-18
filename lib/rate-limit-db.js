/**
 * Supabase-backed rate limiter untuk serverless (Vercel).
 * Menggunakan tabel `rate_limits` di Supabase PostgreSQL.
 *
 * Prasyarat: Jalankan db/rate-limit-schema.sql di Supabase SQL Editor.
 * Setelah SQL terpasang, increment dilakukan ATOMIK oleh fungsi
 * `bump_rate_limit()` di sisi Postgres (audit S-2/A-4 2026-09-17 —
 * menggantikan pola read→update yang bisa ditembus request paralel).
 *
 * Urutan fallback:
 *   1. RPC atomic `bump_rate_limit`   (benar, lintas instance)
 *   2. Read→upsert Supabase (legacy)  (berfungsi sebelum RPC terpasang)
 *   3. In-memory per-instance         (terakhir, saat Supabase down)
 */

import { supabaseAdmin } from './supabaseAdmin';

export async function rateLimitDb(key, { max = 5, windowMs = 60000 } = {}) {
  if (!supabaseAdmin) {
    return rateLimitFallback(key, { max, windowMs });
  }

  try {
    // 1. Atomic increment via Postgres function
    const { data, error } = await supabaseAdmin
      .rpc('bump_rate_limit', { p_key: key, p_window_ms: windowMs });

    if (!error && typeof data === 'number') {
      return { ok: data <= max, count: data };
    }
    // RPC belum terpasang / error → lanjut ke jalur legacy di bawah
  } catch {
    // jalur legacy
  }

  return rateLimitLegacy(key, { max, windowMs });
}

/**
 * Jalur legacy (sebelum fungsi bump_rate_limit terpasang):
 * read → reset/upsert → increment. Tidak atomic — hanya jembatan migrasi.
 */
async function rateLimitLegacy(key, { max = 5, windowMs = 60000 } = {}) {
  const now = Date.now();
  const resetAt = new Date(now + windowMs).toISOString();

  try {
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('rate_limits')
      .select('count, reset_at')
      .eq('key', key)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.warn('[RateLimit] Supabase error:', fetchError);
      return rateLimitFallback(key, { max, windowMs });
    }

    if (!existing || new Date(existing.reset_at) <= new Date()) {
      const { error: upsertError } = await supabaseAdmin
        .from('rate_limits')
        .upsert({ key, count: 1, reset_at: resetAt }, { onConflict: 'key' });
      if (upsertError) {
        console.warn('[RateLimit] Upsert error:', upsertError);
        return rateLimitFallback(key, { max, windowMs });
      }
      return { ok: 1 <= max, count: 1 };
    }

    const newCount = existing.count + 1;
    const { error: updateError } = await supabaseAdmin
      .from('rate_limits')
      .update({ count: newCount })
      .eq('key', key);
    if (updateError) {
      console.warn('[RateLimit] Update error:', updateError);
      return rateLimitFallback(key, { max, windowMs });
    }
    return { ok: newCount <= max, count: newCount };
  } catch (err) {
    console.warn('[RateLimit] Unexpected error:', err);
    return rateLimitFallback(key, { max, windowMs });
  }
}

// Fallback in-memory — hanya efektif per-instance serverless.
const fallbackBuckets = new Map();
function rateLimitFallback(key, { max = 5, windowMs = 60000 } = {}) {
  const now = Date.now();
  const e = fallbackBuckets.get(key) || { count: 0, reset: now + windowMs };
  if (now > e.reset) { e.count = 0; e.reset = now + windowMs; }
  e.count += 1;
  fallbackBuckets.set(key, e);
  return { ok: e.count <= max, count: e.count };
}
