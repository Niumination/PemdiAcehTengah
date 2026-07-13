/**
 * Supabase-backed rate limiter untuk serverless (Vercel).
 * Menggunakan tabel `rate_limits` di Supabase PostgreSQL.
 * Bekerja lintas cold start — tidak seperti in-memory Map.
 *
 * Prasyarat: Jalankan db/rate-limit-schema.sql di Supabase SQL Editor
 * untuk membuat tabel `rate_limits`.
 */

import { supabaseAdmin } from './supabaseAdmin';

const CACHE = new Map();
const CACHE_TTL = 2000; // 2 detik cache untuk mengurangi query DB

/**
 * Rate limit check via Supabase.
 * Fallback ke in-memory jika Supabase tidak tersedia.
 *
 * @param {string} key — Unique key per IP + endpoint
 * @param {object} options
 * @param {number} options.max — Max request dalam window (default: 5)
 * @param {number} options.windowMs — Window dalam ms (default: 60000 = 1 menit)
 * @returns {{ ok: boolean }}
 */
export async function rateLimitDb(key, { max = 5, windowMs = 60000 } = {}) {
  if (!supabaseAdmin) {
    // Fallback ke in-memory jika Supabase tidak siap
    return rateLimitFallback(key, { max, windowMs });
  }

  const now = Date.now();
  const resetAt = new Date(now + windowMs).toISOString();

  // Cek cache dulu (2 detik)
  const cached = CACHE.get(key);
  if (cached && now < cached.cacheExpiresAt) {
    return { ok: cached.count <= max };
  }

  try {
    // Atomic upsert: increment count atau create if not exists
    // Pakai Supabase RPC atau upsert manual
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('rate_limits')
      .select('count, reset_at')
      .eq('key', key)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = not found, aman
      console.warn('[RateLimit] Supabase error:', fetchError);
      return rateLimitFallback(key, { max, windowMs });
    }

    if (!existing || new Date(existing.reset_at) <= new Date()) {
      // Reset: create or update
      const { error: upsertError } = await supabaseAdmin
        .from('rate_limits')
        .upsert({ key, count: 1, reset_at: resetAt }, { onConflict: 'key' });

      if (upsertError) {
        console.warn('[RateLimit] Upsert error:', upsertError);
        return rateLimitFallback(key, { max, windowMs });
      }

      CACHE.set(key, { count: 1, cacheExpiresAt: now + CACHE_TTL });
      return { ok: 1 <= max };
    }

    const newCount = existing.count + 1;

    // Update count
    const { error: updateError } = await supabaseAdmin
      .from('rate_limits')
      .update({ count: newCount })
      .eq('key', key);

    if (updateError) {
      console.warn('[RateLimit] Update error:', updateError);
      return rateLimitFallback(key, { max, windowMs });
    }

    CACHE.set(key, { count: newCount, cacheExpiresAt: now + CACHE_TTL });
    return { ok: newCount <= max };

  } catch (err) {
    console.warn('[RateLimit] Unexpected error:', err);
    return rateLimitFallback(key, { max, windowMs });
  }
}

// Fallback in-memory (sama seperti implementasi lama)
const fallbackBuckets = new Map();
function rateLimitFallback(key, { max = 5, windowMs = 60000 } = {}) {
  const now = Date.now();
  const e = fallbackBuckets.get(key) || { count: 0, reset: now + windowMs };
  if (now > e.reset) { e.count = 0; e.reset = now + windowMs; }
  e.count += 1;
  fallbackBuckets.set(key, e);
  return { ok: e.count <= max };
}
