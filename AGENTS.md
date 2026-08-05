# Pemdi Aceh Tengah — DOX Framework

Portal Digital Pemerintah Daerah Kabupaten Aceh Tengah. Transformasi menuju Pemerintah Digital (Pemdi) — open source government technology.

## Core Contract

- AGENTS.md files adalah binding work contracts untuk subtree masing-masing
- Setiap perubahan kode WAJIB diikuti DOX pass sebelum task ditutup
- Dokumentasi harus tetap bisa dipahami dari nearest AGENTS.md + parent chain

## Read Before Editing

1. Baca root AGENTS.md ini
2. Identifikasi file/folder yang akan disentuh
3. Baca AGENTS.md pada setiap path dari root ke target
4. Jika parent mencantumkan child AGENTS.md di index, baca child tersebut
5. Nearest AGENTS.md adalah local contract; parent untuk repo-wide rules
6. Jika ada konflik, doc yang lebih dekat menang, tapi no child boleh melemahkan DOX
7. `docs/plan-v0.md` adalah dokumen perencanaan awal (v0, diarsipkan) — beberapa detail sudah out of date (path, portal/ folder tidak dipakai); DOX ini + MASTERPLAN.md sumber kebenaran terkini

## Project Overview

| Atribut | Nilai |
|---------|-------|
| **Stack** | Next.js 14.2.35, React 18.2.0, Vercel |
| **Config** | `next.config.js` → standalone output, reactStrictMode, images unoptimized |
| **Path Alias** | `@/*` (via `jsconfig.json`) — ex: `@/components/Header` |
| **Font** | Inter (government professional, GOV.UK-inspired) |
|| **Data Source** | Hybrid: `data/*.json` (OPD, SPBE, ProBis, SKM, Pemdi) + Supabase (SKM responses, admin logs). Client: `lib/supabaseAdmin.js` |
|| **Komponen** | 30 komponen React (20 existing + 10 Sprint Redesign) — lihat `components/AGENTS.md` |
|| **Halaman** | 16 route pages + 7 API routes + 2 lib helpers — lihat `pages/AGENTS.md` |
|| **Status** | 🟢 **DOX Clean** — semua komponen terverifikasi real, 0 gap dokumentasi |
| **Remote** | `git@github.com:Niumination/PemdiAcehTengah.git` |
| **Production** | https://pemdi-aceh-tengah.vercel.app |
| **License** | MIT |
| **Bupati** | Drs. Haili Yoga, M.Si. & Muchsin Hasan, MSP (2025–2030) |
| **Visi** | *"Aceh Tengah Islami, Maju, Sejahtera, dan Berkeadilan"* |
| **8 Misi** | Transformasi Sosial, Ekonomi Hijau, Tata Kelola, Kondusifitas Syariah, Ketahanan Sosial Budaya, Pembangunan Kewilayahan, Sarpras Berkualitas, Kesinambungan Pembangunan |
| **Total Perangkat Daerah** | 52 (38 instansi + 14 kecamatan) — lihat data/AGENTS.md |
| **Total ASN** | 4,507 orang per data Diskominfo (Jumlah Perangkat Daerah.docx) |
| **Restrukturisasi OPD** | 7 pemisahan OPD, 1 OPD baru (Dinas Perkebunan) — RSUD Datu Beru & KORPRI tidak lagi sebagai OPD |
| **Jargon** | HAMAS (Haili Yoga + Muchsin Hasan), 17 sasaran prioritas |
| **Program Unggulan** | Aceh Tengah Satu Data (AWS + Komdigi), MPP, Satu OPD Satu Inovasi |
|| **PWA** | `manifest.json`, icons (192/512 PNG + maskable-512 + apple-touch + SVG), `theme_color: #004098`, `display: standalone`, scope root, +orientation portrait |
|| **Security** | CSP headers (Supabase, Google Fonts), rate limiting, IP hashing (SHA-256), admin Bearer auth. `lib/security.js` |
|| **Admin Dashboard** | `/admin` — protected by `ADMIN_TOKEN` env (Bearer auth). Admin APIs: `/api/admin/laporan` (PATCH status), `/api/admin/skm` (GET all) |
|| **HEAD** | `be9fdb0` — Fix: restore missing stats row, Tutorial 404 → FAQ, render Footer di AppShell |
|| **Env Vars** | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_TOKEN`, `IP_HASH_SALT` |

## Framework Regulasi — DUA KERANGKA BERBEDA

⚠️ **KOREKSI PENTING:** Permenpan 19/2018 dan Permenpan 8/2026 adalah regulasi BERBEDA yang mengatur domain berbeda:

| Regulasi | Domain | Status | Relevansi |
|----------|--------|--------|-----------|
| **Permenpan 19/2018** | **Peta Proses Bisnis** (Level 0-1-2, BPMN, SIPOC) | ✅ **TETAP BERLAKU** | Framework penyusunan PPB — acuan konten portal |
| **Permenpan 8/2026** | **Evaluasi Kinerja Pemdi** (indeks, 7 aspek, 20 indikator) | ✅ **BARU** (menggantikan Permenpan 59/2020) | Framework evaluasi digital government maturity — acuan target SPBE→Pemdi |
| **Permenpan 59/2020** | Monitoring SPBE (8 domain, 31 indikator) | ❌ **DICABUT** oleh Permenpan 8/2026 | Digantikan Pemdi, tapi baseline data SPBE 2025 masih relevan |

Keduanya **tidak menggantikan satu sama lain** — hidup berdampingan:
- Permenpan 19/2018 → **cara menyusun** Peta Proses Bisnis
- Permenpan 8/2026 → **cara mengevaluasi** kematangan digital pemerintah

## Dokumen Root — Referensi Cepat

| File | Isi |
|------|-----|
| `docs/plan-v0.md` | Perencanaan awal proyek (v0, diarsipkan) — beberapa detail sudah out of date; DOX ini + MASTERPLAN.md sumber kebenaran terkini |
| `README.md` | Gambaran umum, cara deploy, badge DOX |
| `CONTRIBUTING.md` | Panduan kontribusi — data/kode/issues |
| `AGENTS.md` | **File ini** — DOX root |
| `package.json` | Dependencies: next 14.1.0, react 18.2.0 |
| `next.config.js` | Standalone output, reactStrictMode, unoptimized images |
| `jsconfig.json` | Path alias `@/*` |
| `.gitignore` | node_modules, .next, .env, *.old, build |
| `docs/riset-peta-proses-bisnis-permenpan-19-2018.md` | Riset lengkap framework PPB (408 lines) — Permenpan 19/2018, BPMN, template, contoh daerah |
| `docs/riset-data-aceh-tengah.md` | Riset data Aceh Tengah (255 lines) — visi misi, RPJMD, OPD, urusan konkuren, SPBE, transformasi digital |
| `package-lock.json` | Lock file — jangan edit manual |
| `pages/` | Source code halaman dan API Next.js |
| `components/` | React komponen |
| `styles/` | CSS globals — **Gayo Civic Digital v3**, CSS variables, hero award gradient, dark mode |
| `data/` | Data statis JSON (OPD, SPBE, ProBis, SKM, Pemdi) + glosarium |
| `docs/` | Dokumentasi, PDF, riset |
| `docs.old/` | Legacy docs — referensi historis (tidak diindex DOX) |
| `lib/` | Supabase client (`supabaseAdmin.js`), security helpers (`security.js`), admin auth (`adminAuth.js`) |
| `pages/admin.js` | Admin Dashboard — authenticate via ADMIN_TOKEN (Bearer) |
| `pages/api/admin/` | Admin API routes: `laporan.js` (PATCH status pengaduan), `skm.js` (GET semua SKM) |
| `public/manifest.json` | PWA manifest — standalone, theme_color #004098, icons 192+512+maskable+apple-touch |
| `public/icons/` | PWA icons — `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`, `icon.svg`, `192.svg` |
| `public/crest-pemdi.svg` | Lambang daerah Aceh Tengah (crest) |
| `desain/` | UI/UX redesign assets — prototype HTML, panduan desain, glosarium istilah, design guide |
| `audit/` | Audit reports — hasil verifikasi perbaikan v2, laporan audit |

## Global Rules

1. **Data flow**: `data/opd.json` → `getStaticProps` di pages → props ke components. API routes juga baca dari file yang sama.
2. **Hybrid data**: Static JSON (`data/*.json`) untuk konten publik (OPD, SPBE, ProBis, Pemdi, SKM) + Supabase untuk data dinamis (SKM responses, admin logs). Supabase admin client di `lib/supabaseAdmin.js`. Env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
3. **CSS architecture**: Satu file `styles/globals.css` — **Gayo Civic Digital v3** (bukan GOV.UK). CSS variables untuk design tokens: `--lake-cyan`, `--gayo-gold`, `--coffee-brown`, `--forest-green`. Hero award gradient multi-layer. Dark mode built-in. Layout max-width 1180px. Inter font.
4. **Components**: Semua di `components/` — reusable, props-driven. Layout component wrapping.
5. **API routes**: RESTful, JSON response, read from `data/opd.json`.
6. **Deployment**: Vercel production branch `main`. Deploy via Vercel CLI atau push ke GitHub.
7. **No API keys / secrets** di repo — semua placeholder `YOUR_API_KEY`.
8. **Bahasa**: Dokumentasi dan konten portal dalam Bahasa Indonesia.
9. **Admin auth**: Dashboard `/admin` dan API `/api/admin/*` dilindungi Bearer token dari `ADMIN_TOKEN` env var (default: `admin` untuk dev). Lihat `lib/adminAuth.js`.
10. **PWA**: Progressive Web App via `public/manifest.json` + icons. `_app.js` includes manifest link + theme-color meta + Vercel Analytics.
11. **Security headers**: Semua route via `next.config.js` — CSP (allow Supabase, Google Fonts), X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. Rate limiting + IP hashing di `lib/security.js`.

## Child DOX Index

| Path | Scope |
|------|-------|
| `pages/AGENTS.md` | 15 halaman Next.js (index, glosarium, layanan, pemdi, spbe, probis, skm, faq, cari, tanya, opd/index, opd/[slug], admin, requirement, 404) + 6 API routes — indexing, routing, data flow |
| `pages/api/AGENTS.md` | REST API: opd, spbe, requirement, lapor, skm, admin — GET read + POST write. Admin auth via ADMIN_TOKEN (Bearer). Lihat `lib/adminAuth.js` |
| `components/AGENTS.md` | **20 komponen real** — Accordion, AppShell, DataBadge, DetailModal, Explainer, Footer, GlossaryTooltip, Header, LaporWidget, Modal, OPDTable, ProbisSection, Rekomendasi, ScrollTop, Section, Sidebar, SlaBadge, SpbeGauge, Stepper, ThemeToggle |
| `styles/AGENTS.md` | **Gayo Civic Digital v3** — CSS variables: `--gov-blue`, `--lake-cyan`, `--gayo-gold`, `--coffee-brown`, `--forest-green`. Hero award gradient. Dark mode. 799 baris. |
| `data/AGENTS.md` | Struktur data: opd.json (52 OPD, 78 PPB ✅), pemdi.json (7 aspek, 20 indikator), layanan.json, skm.json, faq.json |
| `STRATEGI_PEMDIACEHTENGAH.md` | **Dokumen perencanaan strategis (file ini)** — 4 fase, quick wins, risiko, metrik |
| `lib/AGENTS.md` | Supabase client (`supabaseAdmin.js`), security helpers (`security.js` — CSP, rate limiting, IP hashing), admin auth (`adminAuth.js`) |
| `pages/admin` | Admin Dashboard — laporan (pengaduan), SKM management. Protected by ADMIN_TOKEN (Bearer auth) |
| `public/AGENTS.md` | PWA assets: manifest.json, icons (192/512 PNG + maskable-512 + apple-touch + SVG), favicon, crest-pemdi |

## User Preferences

- Output Bahasa Indonesia
|- Government professional theme — Inter, Gayo Civic Digital (gov-blue, lake-cyan, gayo-gold, coffee-brown, forest-green)
- Open source (MIT License)
- Fokus konten: **Peta Proses Bisnis** Level 0-2 (Permenpan 19/2018) + **Indeks Pemdi** (Permenpan 8/2026) sebagai kerangka evaluasi
- **Permenpan RB 8/2026** di `docs/permenpanrb 8 2026.pdf` — WAJIB dibaca sebelum kerja terkait evaluasi Pemdi
- **Indeks SPBE 2025 Aceh Tengah**: 2,59 (Cukup) — baseline untuk target Pemdi 2,50+
- **Data ProBis di `data/opd.json`** → key `probis`: Level 0 (8 misi real Aceh Tengah ✅) + Level 1 (35 urusan ✅) + Level 2 (78 proses, 47/52 OPD ✅)
## Known Gaps — ✅ SEMUA SELESAI

Gap sebelumnya (Sprint Redesign Award Level + Trust Infrastructure) sudah diimplementasi:

| Gap | Komponen | Status | Tanggal |
|-----|----------|--------|---------|
| Hero award premium | `AwardHero.js` | ✅ | 14 Jun 2026 |
| Aksi cepat | `QuickActions.js` | ✅ | 14 Jun 2026 |
| Kartu layanan + pencarian | `ServiceCard.js`, `ServiceFinder.js` | ✅ | 14 Jun 2026 |
| Latar topografi | `TopographicBackdrop.js` | ✅ | 14 Jun 2026 |
| Tracking laporan warga | `LaporanStatus.js` | ✅ | 14 Jun 2026 |
| Notifikasi | `Toast.js` | ✅ | 14 Jun 2026 |
| Visual Pemdi | `ProgressBarVisual.js`, `TimelineRoadmap.js` | ✅ | 14 Jun 2026 |
| Trust pages | `pages/kebijakan-privasi.js`, `pages/404.js` | ✅ | 14 Jun 2026 |
| CORS & XSS helpers | `lib/cors.js`, `lib/safeRichText.js` | ✅ | 14 Jun 2026 |
| RFC 9116 | `.well-known/security.txt` | ✅ | 14 Jun 2026 |

**Total komponen sekarang: 30 komponen real** (20 existing + 10 baru). **16 halaman + 7 API routes + 2 lib baru + 1 security.txt.**

## Recent Commits — P0-P1-P3 (Juni 2026)
Commit terbaru ada 3, **semua di branch `fix/full-audit-award-redesign`** (belum merge ke main):

| Commit | What | Files Changed |
|--------|------|---------------|
| `6849aaa` P3 | **Gayo Civic Digital CSS v3** — `--gov-blue, --lake-cyan, --gayo-gold` CSS vars, hero premium gradient | `pages/index.js`, `styles/globals.css` |
| `f9baa01` P1 | **Tracking laporan** — GET /api/lapor?id=xxx, LaporWidget tracking tab | `pages/api/lapor.js`, `components/LaporWidget.js`, `pages/index.js` |
| `d124b2e` P0 | **Security + bugfixes** — XSS di tanya.js, cari.js, faq.js, ESLint | `pages/tanya.js`, `pages/cari.js`, `pages/faq.js`, `.eslintrc.json` |

⚠️ **Branch `fix/sprint-redesign-award-level` tidak pernah ada di repo ini.** HEAD sebenarnya `6849aaa` di branch `fix/full-audit-award-redesign`. Semua AGENTS.md yang menyebut 65 pages / AwardHero / QuickActions dll adalah **dokumentasi yang melenceng (drift)** — harus diperbaiki ke realita.

## Closeout Checklist

1. Re-check changed paths against DOX chain
2. Update nearest owning docs + affected parents/children
3. Refresh every affected Child DOX Index
4. Remove stale or contradictory text
5. Run existing verification (build test)
6. Report docs intentionally left unchanged

---

## 🧹 Cleanup History — 30 Jul 2026

| Tanggal | Item | Ukuran | Tindakan | Alasan |
|---------|------|:------:|:--------:|--------|
| 30 Jul | `docs/modul-indikator/` | 501 MB | ✅ Dihapus | 1.535 raw PNG exports PPTX — konten sudah diekstrak ke `data/modul-indikator.json`. Sudah di `.gitignore` sejak awal. |
| 30 Jul | `pages/pemdi.js` — bukti dukung section | 715 baris | ✅ Dihapus | Semua 57 bukti dukung direset ke "belum" karena belum sesuai kriteria level. Lihat commit `ca17535`. |
| — | `public/bukti-dukung/` (31 MB, 42 file) | ⏳ **Ditunda** | — | Masih disimpan untuk dipakai nanti saat semua bukti dukung sudah diverifikasi sesuai kriteria level masing-masing indikator. Jangan hapus sampai proses verifikasi selesai. |

## 🧹 Update Data — 5 Agu 2026 (Penyelarasan Bukti Dukung)

| Item | Perubahan |
|------|-----------|
| `data/pemdi.json` | `total_item_bukti` 57 → **114** (realita) + `target_item_bukti` 178 (target Excel) + `indeks_terkini` (dihitung dari bukti lengkap). Nilai indikator kini dihitung dari bukti: level tertinggi dengan bukti lengkap (bukan statis 1.0). |
| `data/bukti-dokumen-mapping.json` | **114/114 bukti** terpetakan ke 31 dokumen kunci (keyword + filter indikator + koreksi manual). |
| `data/modul-indikator.json` | `data_dukung_modul` 46 → 85 item — 8 modul kosong diisi dari substansi dokumen kunci. |
| `pages/modul-indikator.js` | Kolom "Dokumen Kunci" + toggle view Per Level/Per Dokumen Kunci + placeholder "🆕 Perlu Disusun" untuk dokumen kunci tanpa bukti + badge "🔁 multi-level" untuk duplikasi V1/V2 + stat bar 114/178 + Gap. |
| `pages/requirement.js` + `api/requirement.js` | Kolom "Dok. Kunci" di semua kategori (A-L) — 47 item direferensikan ke dokumen kunci. |
| `pages/pemdi.js` | Label "Indeks Pemdi (dari Bukti Dukung)" — dihitung dari 114 bukti. |

> ⚠️ **Catatan:** 5 dokumen kunci belum punya bukti existing: **#2 (Peta Rencana), #6 (SK Asesor), #11 (Komunitas Belajar), #12 (Microlearning), #14 (Sertifikasi Keahlian)** — tampil sebagai placeholder "Perlu Disusun" di modul-indikator.

## 📥 Update Data — 5 Agu 2026 (Bukti Dukung Baru Portal Evaluasi)

| Item | Perubahan |
|------|-----------|
| `public/bukti-dukung/05-portal-pemdi/` | **7 file** dari `~/Documents/REAL-PEMDI-DATA DUKUNG/` — sudah diunggah ke portal eval.spbe.go.id (kode PG_04 & TD_13): SK Tim Koordinasi PEMDI 555/395/2026, DPA/RKA 0037 tata kelola SPBE, undangan+rundown Rapat Transformasi Digital 25-26 Jun 2026, KAK & Laporan Akhir Aplikasi Bapokting. |
| `public/bukti-dukung/06-dokumen-2026/` | **13 file** dari `~/Documents/` & `odl-pdf bukti dukung/` — belum diunggah: Indeks KAMI 5.0 (skor 563 "Cukup Baik", 13 Apr 2026), 2 Perbup persandian, SK Forum Satu Data 188.55/375/2025, RPJMD 2025-2029, Renstra/Renja/DPA/RKA Diskominfo 2026, capaian RKPD. |
| `data/pemdi.json` | **+20 bukti baru** (id `P1.*`, flag `_sumber_baru`, `_dokumen_kunci`, `_portal`) → `total_item_bukti` 114 → **134** (57 lengkap, 70 belum, 7 proses). |
| `data/bukti-dokumen-mapping.json` | Regenerated → **133/134 terpetakan** (Perbup SOTK sengaja tanpa dokumen kunci). |
| `pages/modul-indikator.js` | **Section baru "📥 Bukti Dukung Baru — Portal Evaluasi & Dokumen 2026"** — tabel 20 bukti baru (indikator, level, dokumen kunci clickable, status, sumber portal/Documents). |

> ℹ️ **Catatan:** Bukti baru ber-status `proses` (7 file portal eval) & `belum` (13 dokumen Documents) — belum ada yang `lengkap`, sehingga indeks Pemdi belum berubah. Verifikasi kesesuaian kriteria level diperlukan sebelum dianggap lengkap.
