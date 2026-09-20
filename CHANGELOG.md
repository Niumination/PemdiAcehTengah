# Changelog

Semua perubahan penting proyek ini didokumentasikan di file ini.
Ringkasan publik tanpa detail internal; dokumen kerja lengkap disimpan pemilik repo di lokasi privat.

## 2026-09-20 — Hapus Kosmetik Animasi (kelayakan produksi & performa)

- **Dihapus**: blob aurora bergerak (2× `blur(70px)` animasi tak berujung), garis topografi SVG acak (`TopographicBackdrop`, ±40 path per render), awan Emun melayang, kilau emas judul (`gold-shimmer`), pita berjalan atas & pita motif (marquee), border conic berputar (`glass-card`), animasi masuk `fade-up` pada semua kartu/grid, scroll-reveal `IntersectionObserver` global, angka *count-up*, bar progres *reveal*, `backdrop-filter: blur` pada topbar lengket & hero, transform *lift* saat hover.
- **Dipertahankan**: transisi warna/bayangan ≤0,3 detik, panel rating (0,25 detik), fokus ring aksesibel. Konten `[data-reveal]` kini selalu terlihat (tak lagi bergantung JS untuk muncul).
- Pita atas kini statis dan tidak lagi berbunyi "Portal Resmi" (prasyarat K7 reposisi).
- Bundle: `/` 118→117 kB, `/pemdi` 117→115 kB; CSS 39,1→34,9 kB; `hooks/useCountUp.js`, `hooks/useInView.js`, `components/TopographicBackdrop.js` dihapus.

## 2026-09-20 — Sinkron Hasil Penilaian Tahap 1 (eval.spbe.go.id) & Reposisi Konten

- **Status bukti mengikuti hasil asesor.** Vokabuler baru `diterima · revisi · proses · draf · belum` menggantikan `lengkap`; hanya bukti yang **diterima** asesor dihitung dalam indeks. Tahap 1: 37 butir dinilai → 18 diterima, 19 revisi (7 bukti tidak tepat, 10 belum diunggah, 2 ditolak otomatis) — catatan asesor disalin apa adanya dari portal dan tampil di setiap butir.
- **Label "Indeks Terverifikasi" dihapus** (prasyarat K8 `REPOSISI-PEMDI.md`) → "Simulasi Penilaian Mandiri — bukan nilai resmi asesor". Indeks simulasi 0,38 → **0,35** (33 butir yang belum pernah dinilai asesor diturunkan ke `draf`).
- **Kode bukti `I#-L#-##`** (Indikator-Level-nomor urut butir modul) ditampilkan di `/pemdi` dan `/modul-indikator`; 18 PDF diterima dapat dipratinjau; butir revisi ditandai 🔁 merah dengan catatan asesor dan tab filter khusus.
- **`/requirement` direposisi** menjadi **Draf Bukti Dukung Prioritas**: P0 19 revisi asesor (dikelompokkan per jenis, dengan tindak lanjut) + P1 gap ke level berikut (24 butir di luar P0, diurutkan daya ungkit) dengan contoh Modul Indikator, template draf L1, kode rencana berkas, dan PIC. Kebutuhan data PPB (83 item) tetap tersedia pada tab kedua.
- Beranda: kartu indeks berlabel simulasi + ringkasan diterima/revisi Tahap 1. Sidebar: "Requirements Data" → "Draf Bukti Dukung".
- Skrip: `scripts/apply-eval-tahap1.py` (sinkron hasil portal, idempoten) · `scripts/build-draf-prioritas.py` (→ `data/draf-bukti-prioritas.json`); `hitung-capaian-pemdi.py` dan tes regresi diselaraskan (20 tes hijau).

## 2026-09-19 — Aksesibilitas & Mobile

- Tautan regulasi PermenPANRB 8/2026 di footer diperbaiki (sebelumnya mengarah ke berkas yang tidak disajikan → 404); dokumen kini tersedia di portal.
- Target sentuh seluruh kontrol di layar sempit dinaikkan ke ≥44px (Apple HIG / Material 48dp) — sebelumnya ada kontrol setinggi 14–30px.
- Kontras teks kecil diperbaiki: label 11px dan badge 11,5px kini memenuhi WCAG AA di tema terang maupun gelap.
- Perbaikan tampilan tema gelap: token `--primary-bg` yang tidak pernah terdefinisi membuat satu baris tabel dan beberapa badge tampil blok biru terang dengan teks tak terbaca.
- Beranda lebih ringan: HTML 233 KB → 135 KB (data indikator yang tidak dipakai beranda tidak lagi dikirim).
- Halaman Pemdi: panel rumus/notasi internal dilipat dan dapat dibuka; halaman jadi lebih pendek.
- Direktori Layanan pada ponsel: kartu tersusun satu kolom (sebelumnya empat kolom di layar 390px sehingga teks terjepit), filter kategori satu baris dapat digeser dan melekat di bawah header, statistik 2×2.
- Pita berjalan (marquee) berhenti bergerak di layar sempit; 26 rujukan gambar yang berkasnya tidak ada dibersihkan.
- Rencana peningkatan mobile untuk halaman lain didokumentasikan (belum dikerjakan): `docs/rencana-mobile-ux-tahap-2.md`.

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
