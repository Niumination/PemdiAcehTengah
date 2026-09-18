-- Rate Limiter — tabel untuk rate limiting via Supabase (serverless-safe)
-- Jalankan SQL ini di Supabase SQL Editor sekali saja.

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Hapus entri kadaluarsa (cleanup via cron or Vercel Cron Jobs)
-- Atau jalankan manual: DELETE FROM rate_limits WHERE reset_at < NOW() - INTERVAL '1 hour';

-- ============================================================
-- Increment ATOMIK rate limit (dipakai lib/rate-limit-db.js via
-- supabase.rpc('bump_rate_limit')) — audit S-2/A-4 2026-09-17.
-- Satu statement INSERT ... ON CONFLICT DO UPDATE: kebal request
-- paralel (race condition) yang bisa menembus limit pola lama.
-- Jalankan SEKALI di Supabase SQL Editor.
-- ============================================================
CREATE OR REPLACE FUNCTION public.bump_rate_limit(
  p_key TEXT,
  p_window_ms BIGINT DEFAULT 60000
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  INSERT INTO rate_limits (key, count, reset_at)
  VALUES (p_key, 1, now() + (p_window_ms * INTERVAL '1 millisecond'))
  ON CONFLICT (key) DO UPDATE SET
    count = CASE
      WHEN rate_limits.reset_at <= now() THEN 1
      ELSE rate_limits.count + 1
    END,
    reset_at = CASE
      WHEN rate_limits.reset_at <= now()
        THEN now() + (p_window_ms * INTERVAL '1 millisecond')
      ELSE rate_limits.reset_at
    END
  RETURNING count INTO v_count;
  RETURN v_count;
END;
$$;

-- housekeeping opsional (jalankan berkala via pg_cron / Vercel Cron):
-- DELETE FROM rate_limits WHERE reset_at < NOW() - INTERVAL '1 hour';

-- Defense-in-depth (skill supabase-postgres-best-practices, 2026-09-17):
-- aktifkan RLS. Service role (satu-satunya yang dipakai aplikasi) bypass RLS,
-- jadi tidak ada perubahan perilaku — tapi tabel tertutup untuk anon key
-- jika suatu saat dipakai dari sisi client.
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
