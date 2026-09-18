# Changelog

Semua perubahan penting proyek ini didokumentasikan di file ini.
Ringkasan publik tanpa detail internal; dokumen kerja lengkap disimpan pemilik repo di lokasi privat.

## 2026-09-18 — Pre-merge (PR #5)

- Respons `/api/health` kini generik (detail teknis hanya di log server).
- `.gitignore`: kembalikan aturan `data/*.bak-*` (salah tulis `.data/`).
- Dokumen kerja internal dikeluarkan dari repo publik.

## 2026-09-18 — Sprint B: Performa & Kualitas (PR #5)

- **Font self-host** — Plus Jakarta Sans via `next/font/local` (OFL); nol request font ke pihak ketiga; CSP `style-src`/`font-src` `'self'`.
- **Bundle −34%** — `/pemdi` 174→114 kB, `/modul-indikator` 172→113 kB (data via `getStaticProps`, bukan client bundle).
- **SSR statistik kepuasan** — `/dashboard-kepuasan` ter-render server-side (ISR 60 detik) + fallback aman.
- **Kontras WCAG AA** — palet level/status/skala ≥4,5:1 di tema terang maupun gelap.
- **Token warna terpusat** — 13 variabel CSS `:root` + override dark theme.
- Method guard (405) + cache CDN pada endpoint data publik; `robots.txt`/`sitemap` digenerate saat build.

## 2026-09-17 — Sprint A: Operasional & Kepercayaan (PR #5)

- Endpoint `/api/health` untuk uptime monitoring.
- Hardening API: sanitasi input, rate limiting (RPC atomik + fallback), auth admin constant-time.
- `/api/requirement` satu sumber data dengan halaman requirement (respons identik).
- Sidebar lengkap: seluruh rute ≤1 klik.
- 20 komponen tak terpakai dihapus; dependensi nol perubahan.
- Standar kerja agent (autoskills) di-commit: `.agents/skills/` — Next.js/React/SEO/a11y/backend best practice.
- 20 tes regresi (`node --test`, `npm test`).
