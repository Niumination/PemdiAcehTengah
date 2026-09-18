# public/ — DOX

## Purpose
Aset statis yang disajikan apa adanya oleh Next.js/Vercel (tidak diproses bundler).

## Ownership

| Aset | Fungsi | Catatan |
|------|--------|---------|
| `manifest.json` | PWA manifest — `display: standalone`, `theme_color: #1F2A44`, `lang: id`, shortcuts (Modul Indikator, Direktori Layanan) | Dirujuk `_app.js` |
| `icons/` | `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`, `icon.svg`, `192.svg` | Maskable siap Android |
| `favicon.ico` | Favicon legacy | — |
| `crest-pemdi.svg` | Lambang/crest portal — dipakai `Sidebar.js` brand | Versi PNG 1 MB dihapus 2026-09-17 (tak terpakai) |
| `og-image.jpg` | Kartu Open Graph/Twitter 1200×630 (~166 KB) — dirujuk `_app.js` og:image/twitter:image absolut | PNG 1,6 MB → JPG 166 KB (2026-09-17); scraper >1 MB sering gagal |
| `og-image.svg` | Varian SVG (tidak dipakai meta saat ini) | — |
| `.well-known/security.txt` | Kontak keamanan RFC 9116 | Diperbaiki 2026-09-17 (rujukan `/kontak` & `/pgp-key.txt` yang 404 dihapus) |
| `bukti-dukung/final/` | 18 PDF bukti dukung lolos-evaluasi interview (I1–I20) — **dipublikasikan publik**, pastikan izin pemilik data | 39 MB; riwayat git lama memuat ratusan PDF (sumber bengkak repo) |
| `panduan-bukti-l1/` | 39 thumbnail panduan bukti per indikator — dipakai `pages/modul-indikator.js` | ~6,6 MB |
| `docs/rpjmd` | Dokumen RPJMD untuk preview | — |
| `data/bukti-dukung.json` | Manifest bukti dukung publik | — |
| `robots.txt` & `sitemap*.xml` | **Di-generate `next-sitemap` saat build (postbuild)** — tidak di-commit (`.gitignore`) | Jangan edit manual |

## Key Rules
- File hasil generate (`robots.txt`, `sitemap*.xml`) **jangan di-commit** — churn riwayat git.
- Aset > 500 KB wajib dioptimasi dulu (contoh kasus: og-image PNG 1,6 MB → JPG 166 KB).
- PDF bukti dukung: koordinasikan dengan Diskominfo (pemilik data) sebelum menambah/menghapus; ke depan pindahkan ke storage eksternal (lihat backlog repo slimming).
