-- Pembersih tabel `rate_limits` — dijalankan berkala lewat pg_cron.
--
-- Latar: `bump_rate_limit` menambah satu baris per kunci klien (hash IP +
-- endpoint) dan tidak pernah menghapus yang sudah kadaluarsa. Tanpa pembersih,
-- tabel tumbuh terus (lambat, tapi tanpa batas). Lihat db/rate-limit-schema.sql
-- baris 12 & 49 — di sana perintahnya baru berupa komentar, belum terjadwal.
--
-- CARA PAKAI (sekali saja, di Supabase SQL Editor):
--   jalankan seluruh berkas ini, lalu verifikasi dengan query di bagian bawah.
--
-- Kalau ekstensi pg_cron tidak tersedia di project Anda: lewati baris
-- `create extension` + `cron.schedule`, dan jalankan perintah DELETE-nya
-- manual berkala (atau pakai Vercel Cron).

create extension if not exists pg_cron;

-- Jadwal: 03:17 UTC setiap hari (= 10:17 WIB). Baris yang reset_at-nya sudah
-- lewat lebih dari 1 jam dianggap mati dan dibuang.
select cron.schedule(
  'bersihkan-rate-limits',
  '17 3 * * *',
  $$delete from public.rate_limits where reset_at < now() - interval '1 hour'$$
);

-- ── Verifikasi ────────────────────────────────────────────────────────────────
-- a) jadwal terdaftar?
-- select jobid, jobname, schedule, active from cron.job;
--
-- b) riwayat jalan (5 terakhir, ada setelah 1 hari atau setelah dijalankan manual)
-- select jobid, status, start_time, end_time
--   from cron.job_run_details order by start_time desc limit 5;
--
-- c) pembersihan manual sekaligus mengukur dampaknya (aman, idempoten)
-- select count(*) as akan_dibuang
--   from public.rate_limits where reset_at < now() - interval '1 hour';
-- delete from public.rate_limits where reset_at < now() - interval '1 hour';

-- ── Membatalkan jadwal (kalau perlu) ──────────────────────────────────────────
-- select cron.unschedule('bersihkan-rate-limits');
