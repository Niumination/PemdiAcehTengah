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
