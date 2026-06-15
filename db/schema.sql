-- Schema untuk Pemdi Aceh Tengah
-- Eksekusi di Supabase SQL Editor

create extension if not exists "pgcrypto";

create table if not exists public.laporan (
  id text primary key,
  kategori text not null check (char_length(kategori) <= 50),
  pesan text not null check (char_length(pesan) between 5 and 5000),
  kontak text check (char_length(kontak) <= 200),
  halaman text check (char_length(halaman) <= 300),
  status text not null default 'baru' check (status in ('baru','diproses','selesai','ditolak')),
  ip_hash text,
  dibuat timestamptz not null default now(),
  diperbarui timestamptz not null default now()
);
create index if not exists idx_laporan_dibuat on public.laporan (dibuat desc);

create table if not exists public.skm (
  id uuid primary key default gen_random_uuid(),
  layanan text,
  persyaratan smallint check (persyaratan between 1 and 4),
  prosedur smallint check (prosedur between 1 and 4),
  waktu smallint check (waktu between 1 and 4),
  biaya smallint check (biaya between 1 and 4),
  produk smallint check (produk between 1 and 4),
  kompetensi smallint check (kompetensi between 1 and 4),
  perilaku smallint check (perilaku between 1 and 4),
  sarana smallint check (sarana between 1 and 4),
  saran text check (char_length(saran) <= 2000),
  ip_hash text,
  dibuat timestamptz not null default now()
);

create or replace view public.skm_ringkasan as
select
  count(*) as total_responden,
  round(avg((persyaratan+prosedur+waktu+biaya+produk+kompetensi+perilaku+sarana)/8.0)::numeric, 2) as rata_skala_4,
  round((avg((persyaratan+prosedur+waktu+biaya+produk+kompetensi+perilaku+sarana)/8.0) / 4 * 100)::numeric, 2) as ikm_0_100
from public.skm;

alter table public.laporan enable row level security;
alter table public.skm enable row level security;

-- Rating feedback untuk Quick Win #1 (I-20)
create table if not exists public.rating_feedback (
  id uuid primary key default gen_random_uuid(),
  halaman text not null,
  rating smallint not null check (rating between 1 and 5),
  komentar text check (char_length(komentar) <= 1000),
  ip_hash text,
  dibuat timestamptz not null default now()
);
create index if not exists idx_rating_halaman on public.rating_feedback (halaman);
alter table public.rating_feedback enable row level security;
