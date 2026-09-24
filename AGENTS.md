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
| **Stack** | Next.js 14.2.35, React 18.3.1, Vercel |
| **Config** | `next.config.js` → security headers (CSP ketat dsb.), reactStrictMode, images unoptimized |
| **Path Alias** | `@/*` (via `jsconfig.json`) — ex: `@/components/Header` |
| **Font** | Plus Jakarta Sans (Google Fonts, `display=swap` — lihat `_document.js`) |
| **Data Source** | **Hanya** `data/*.json` (Pemdi, modul indikator, catatan mandiri, OPD, SPBE, ProBis, PPB, glosarium, dokumen kunci) dibundel saat build. Tidak ada DB runtime sejak reposisi 22 Sep 2026 (Supabase dihapus) |
| **Komponen** | **komponen React aktif** (rk/ + PanelLipat, NavMenu, Dial) — rk/{RKShell, Panel, Kompas, Drawer, Palet}, ui/{Ikon, StatusIkon}, CatatanTujuan, asesor/{CatatanMandiri}, OPDTable, motif/KerawangMotifs (lihat `components/AGENTS.md`) |
| **Halaman** | 15 route halaman (`/dashboard` `/indikator` `/antrean` `/pemdi` `/modul-indikator` `/requirement` `/cari` `/opd` `/opd/[slug]` `/spbe` `/probis` `/glosarium` `/asesor` `/admin` + `/404`) + 14 API route (6 read-only + `/api/admin/*` 5 + `/api/auth/*` 3) — lihat `pages/AGENTS.md` |
| **Lib** | `lib/ruangKendali.js` + `lib/rkData.js` (payload dashboard), `lib/pemdiNilai.js` (rumus PermenPANRB 8/2026), `lib/catatanMandiri.js`, `lib/pjButir.js` (butir Pemdi per OPD), `lib/cmsAuth.js` (CMS: 2 peran sandi bersama), `lib/overlay.js` (overlay Neon Postgres di atas JSON), `lib/db.js` (serverless Postgres), `lib/search-index.js`, `lib/modeSitus.js`, `lib/slugify.js`, `lib/format.js` — lihat `lib/AGENTS.md` |
| **Status** | 🎯 **Ruang Kendali + CMS + Tema Terang + reskin 10 halaman + data asesor live (24 Sep 2026, `9c3d9c4`)** — lihat `REPOSISI-PEMDI.md` + `docs/RENCANA-RUANG-KENDALI-CMS.md`. Produk aktif: **Dashboard Pemdi internal** untuk Tim Koordinasi Pemdi + PJ OPD. Persona publik diarsipkan di tag `arsip/persona-publik-2026-09`. Semua rute RK-native (jembatan `.rk-legacy` = jaring pengaman), menu Radial ⇄ Baris, `/` → 308 `/dashboard`, CMS `/admin` (overlay Neon Postgres; tanpa env → mode baca + API tulis 503; PGlite untuk uji lokal via `CMS_DB_LOKAL`), rute baru `/asesor` (data evaluator asesor eksternal) |
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
| **PWA** | `manifest.json`, icons (192/512 PNG + maskable-512 + apple-touch + SVG), `theme_color: #1F2A44`, `display: standalone`, scope root, +orientation portrait |
| **Security** | Security headers di `next.config.js` (CSP, XFO, nosniff, Referrer-Policy) + `middleware.js` `X-Robots-Tag: noindex, nofollow` semua rute. Endpoint tulis hanya `/api/admin/*` (butuh cookie sesi HMAC httpOnly dari `/api/auth/masuk`; PJ OPD dibatasi butir OPD-nya; semua tercatat `log_audit`) |
| **HEAD** | Patch 1–3 **Ruang Kendali** (22 Sep 2026, di atas `12ad08c`) + Patch 4 CMS (Neon Postgres) + Patch 5 Tema Terang (kontras & kedalaman) + **Patch 6 Tema terang di seluruh halaman lama** + **Patch 7 CMS revalidate eksplisit + PGlite** (23 Sep 2026, `6209cd8`): hero navy hardcoded → panel token di 10 halaman lama, `LEVEL_WARNA`/warna OPD → token per tema, `${warna}15` → `color-mix()`; `lib/revalidate.js` (hasil revalidate dilaporkan di respons API), `CMS_DB_LOKAL` → PGlite untuk uji lokal. Shell baru `components/rk/RKShell` untuk semua rute, `/` → 308 `/dashboard`, rute baru `/dashboard` `/indikator` `/antrean`, `/api/rk-data`, **CMS `/admin`** (2 peran sandi bersama, log audit, ekspor kembali ke `catatan-mandiri.json`), emoji → `Ikon`/`StatusIkon`, penjaga `scripts/cek-ui.mjs` (9 aturan sejak Patch 16) + audit peramban `scripts/audit-ui.mjs` (Patch 16). Rencana lengkap: `docs/RENCANA-RUANG-KENDALI-CMS.md` |
| **Agent Skills** | `.agents/skills/` — **10** skill autoskills (React · Next.js · Supabase · Node · SEO · a11y · design). Lock file ada di **root repo**: `skills-lock.json` (10 entri, masing-masing `source` + `computedHash`). Pasang ulang: `npx autoskills` — ⚠️ registry masih menyediakan `next-cache-components` (**Next.js 16+ only**, sedangkan proyek ini di 14.2.35): keluarkan lagi bila terpasang ulang, sampai proyek benar-benar naik versi. |
| **Env Vars** | **Tidak ada yang wajib** — situs penuh dari JSON. Opsional CMS: `DATABASE_URL` (Neon Postgres), `CMS_SANDI_KOORDINATOR`, `CMS_SANDI_PJ`, `CMS_SESI_RAHASIA` (lihat `.env.example`); tanpa ini `/admin` mode baca & API tulis 503. **`CMS_DB_LOKAL`** (Patch 7, dev saja — Postgres WASM via `@electric-sql/pglite`, mis. `.cache/pgdata`). Supabase/ADMIN_PASSWORD/IP_HASH_SALT lama dihapus 22 Sep 2026. `NEXT_PUBLIC_SITE_URL` opsional |
| **Indeks Pemdi** | **1,24 · Level 1 · Rintisan** — angka utama hasil evaluasi asesor eksternal KemenPANRB (`data/evaluasi-asesor-2026.json`, Patch 14); pembanding: penilaian mandiri awal 1,42 · simulasi butir 0,35 (rumus PermenPANRB 8/2026; hanya bukti `diterima` asesor yang dihitung) — target 2,50+. Label "Terverifikasi" DIHAPUS (prasyarat K8 REPOSISI-PEMDI.md). Keputusan tim 23 Sep 2026: 1,24 = angka utama |
| **Penilaian Tahap 1** | eval.spbe.go.id, sinkron 20 Sep 2026: 37 butir dinilai → **18 diterima** (PDF di `public/bukti-dukung/final/I#-L#-##.pdf`) · **19 revisi** (19 butir: 7 bukti tidak tepat · 10 belum diunggah · 2 ditolak otomatis — I1, I4, I8, I9, I10, I12, I13, I14, I15, I16, I19, I20) — catatan asesor asli di `eval.catatan`, jenis di `eval.jenis` (`tidak_tepat|belum_diunggah|otomatis_ditolak`), berkas tidak disimpan, ditandai 🔁. Metadata: `data/pemdi.json → penilaian_tahap1` |
| **Total bukti dukung** | **232** butir (`data/pemdi.json`: 18 diterima / 19 revisi / 0 proses / 12 draf / 183 belum). Vokabuler status: `diterima · revisi · proses · draf · belum` (`lib/pemdiNilai.js → STATUS_META`) |
| **Konvensi kode bukti** | `I{indikator}-L{level}-{NN}` ⇔ item modul `GT.I{indikator}_L{level}_{NN}` — NN = nomor urut butir di dalam level pada Modul Indikator. Sinkron via `scripts/apply-eval-tahap1.py` → `scripts/hitung-capaian-pemdi.py` → `scripts/build-draf-prioritas.py` → `scripts/build-kebutuhan-bukti.py` → `scripts/sinkron-modul-indikator.py` → `scripts/gabung-catatan-mandiri.py` (rantai LENGKAP wajib dijalankan berurutan agar 4 JSON turunan tidak berbeda; dijaga 6 tes KONSISTENSI di `test/pemdiNilai.test.mjs` + 10 tes `test/catatanMandiri.test.mjs`) |
| **Catatan Mandiri (interviu asesor eksternal)** | (21 Sep 2026, tenggat **Senin 28 Sep 2026**) `data/catatan-mandiri.json` → `pemdi.json.bukti_dukung[].catatan_mandiri` — 48 butir (19 revisi + 29 butir level berikut), rujukan halaman PDF (RPJMD/Renstra/Peta Rencana/SK/draf panduan) + tautan JDIH; tampil di `/pemdi` & `/modul-indikator` (Salin · DOCX · Cetak/PDF per indikator). **Materi evaluasi asesor eksternal KemenPANRB belum diterima** (per 24 Sep 2026; R5 = interviu tim internal, bukan materi KemenPANRB) — lihat `docs/catatan-mandiri-interviu-2026.md`; perbarui `materi_asesor_eksternal` saat diterima |

> **Catatan 24 Sep 2026 (koreksi):** total halaman statis hasil `next build` = **67** (15 rute inti + 52 halaman `/opd/[slug]` + `/500`). `prerender-manifest.json` hanya memuat 63 (tidak termasuk `/glosarium`, `/requirement`, `/404`) — jangan dipakai untuk menghitung total halaman.

## Tujuan Produk (catatan pemilik, 20 Sep 2026)

Website/aplikasi ini ditujukan untuk **memudahkan Tim Asesor Internal Pemda Aceh Tengah memenuhi kebutuhan bukti dukung** Evaluasi Kinerja Pemdi: memakai **bahasa baku PermenPANRB 8/2026** pada butir/kriteria, lalu **menerjemahkannya ke ruang lingkup Pemda Aceh Tengah** sesuai kondisi aktual (PD, dokumen, sistem). Konsekuensi untuk agent:
1. **Jangan parafrasa** nama butir bukti / kriteria level dari modul resmi (`data/modul-indikator.json`, `bukti_dukung[].nama`).
2. Penyesuaian lokal ditulis di `catatan`, `contoh_modul`/"📄 Dokumen Aceh Tengah", `penanggung_jawab`, template — bukan dengan mengubah teks regulasi.
3. Status butir & catatan asesor = **salinan apa adanya dari eval.spbe.go.id**; indeks selalu berlabel simulasi.
4. Teks tujuan tunggal: `components/CatatanTujuan.js` (dirender di `/pemdi#tujuan`, `/modul-indikator`, `/requirement`) — sinkron dengan README "Tujuan".

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
| `MASTERPLAN.md` | Masterplan Pemdi Aceh Tengah 2026–2029 (40 KB) — **sumber kebenaran perencanaan**, dirujuk dari seksi Read Before Editing |
| `BACKLOG.md` | Sub-backlog proyek (7 KB) — status task & item terbuka; satu sumber prioritas kerja |
| `RENCANA_PERUBAHAN_LENGKAP.md` | Rencana perubahan menyeluruh (14 KB) — termasuk rencana CI; catatan: **rencana**, bukan status aktif (CI sudah terpasang 18 Sep 2026 di `.github/workflows/ci.yml`) |
| `PRD_PORTAL_PEMDI.md` | **PRD v1.0 (14 Jun 2026, 28 KB / 743 baris)** — Product Requirements Document portal; acuan produk awal. Untuk kondisi terkini: DOX ini + `MASTERPLAN.md` |
| `AGENTS.md` | **File ini** — DOX root |
| `package.json` | Dependencies: next 14.2.35, react 18.3.1 · `npm test` = node --test (Node 22) |
| `next.config.js` | Standalone output, reactStrictMode, unoptimized images |
| `jsconfig.json` | Path alias `@/*` |
| `.github/workflows/ci.yml` | CI (Node 20): `npm ci` → lint → **`npm test`** (58 tes) → build. Gerbang mutu setiap push/PR ke `main` |
| `.gitignore` | node_modules, .next, .env, *.old, build |
| `docs/riset-peta-proses-bisnis-permenpan-19-2018.md` | Riset lengkap framework PPB (408 lines) — Permenpan 19/2018, BPMN, template, contoh daerah |
| `docs/riset-data-aceh-tengah.md` | Riset data Aceh Tengah (255 lines) — visi misi, RPJMD, OPD, urusan konkuren, SPBE, transformasi digital |
| `package-lock.json` | Lock file — jangan edit manual |
| `pages/` | Source code halaman dan API Next.js |
| `components/` | React komponen |
| `styles/` | CSS globals — **Gayo Civic Digital v3**, CSS variables, hero award gradient, dark mode |
| `data/` | Data statis JSON (Pemdi, modul indikator, catatan mandiri, OPD, SPBE, ProBis, PPB) + glosarium & dokumen kunci |
| `docs/` | Dokumentasi, PDF, riset |
| `lib/` | Util murni: `ruangKendali.js`, `rkData.js`, `overlay.js`, `db.js`, `cmsAuth.js`, `pemdiNilai.js`, `catatanMandiri.js`, `pjButir.js`, `search-index.js`, `modeSitus.js`, `format.js`, `slugify.js` |
| `public/manifest.json` | PWA manifest — standalone, theme_color #1F2A44, icons 192+512+maskable+apple-touch |
| `public/icons/` | PWA icons — `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`, `icon.svg`, `192.svg` |
| `public/crest-pemdi.svg` | Lambang daerah Aceh Tengah (crest) |
| `desain/` | UI/UX redesign assets — prototype HTML, panduan desain, glosarium istilah, design guide |
| `CHANGELOG.md` | Ringkasan perubahan publik (dokumen kerja internal ada di arsip privat pemilik) |

## Global Rules

1. **Data flow**: `data/opd.json` → `getStaticProps` di pages → props ke components. API routes juga baca dari file yang sama.
2. **Data statis saja**: seluruh konten dari `data/*.json` (dibundel saat build). Perubahan konten = jalankan rantai skrip di `data/AGENTS.md`, commit, deploy. Tidak ada DB runtime / env rahasia (sejak 22 Sep 2026).
3. **CSS architecture**: Satu file `styles/globals.css` (1.732 baris) — palet **Luxury Navy/Beige/Gold** sejak 8 Agu 2026: `--primary` #1F2A44, `--bg` #F5F1E8, `--gold` #C6A75E, `--teal`, `--warn`, `--muted` #5E6980. Font **Plus Jakarta Sans self-host** (`next/font/local`, bukan Google Fonts/Inter). Tema gelap via `[data-theme="dark"]` + toggle manual (default terang). Layout max-width 1180px. Kontrak tap target mobile ≥44px. Detail token: `styles/AGENTS.md`.
4. **Components**: Semua di `components/` — reusable, props-driven. Layout component wrapping.
5. **API routes**: RESTful, JSON response, read from `data/opd.json`.
6. **Deployment**: Vercel production branch `main`. Deploy via Vercel CLI atau push ke GitHub.
7. **No API keys / secrets** di repo — semua placeholder `YOUR_API_KEY`.
8. **Bahasa**: Dokumentasi dan konten portal dalam Bahasa Indonesia.
9. **Persona**: hanya **internal Pemdi** (Tim Koordinasi Pemdi + penanggung jawab OPD). Fitur publik (layanan, SKM, lapor, FAQ, tanya, bantuan, dashboard-kepuasan, kebijakan-privasi, admin) **tidak boleh dihidupkan lagi di main**; kode arsip di tag `arsip/persona-publik-2026-09` (commit `eeaa573`). Istilah UI: "Dashboard" (bukan "Kokpit").
10. **PWA**: Progressive Web App via `public/manifest.json` + icons. `_app.js` includes manifest link + theme-color meta + Vercel Analytics.
11. **Security headers & noindex**: Semua route via `next.config.js` — CSP (Google Fonts), X-Frame-Options, X-Content-Type-Options, Referrer-Policy; `middleware.js` menambah `X-Robots-Tag: noindex, nofollow`; `next-sitemap` disallow semua.

## Child DOX Index

| Path | Scope |
|------|-------|
| `pages/AGENTS.md` | 15 route halaman internal (utama `/dashboard`, CMS `/admin`, asesor `/asesor`) + 6 API read-only + 3 auth + 5 admin — routing, data flow, noindex |
| `pages/api/AGENTS.md` | REST API: read-only rk-data, opd, spbe, requirement, proxy-pdf, health. Tanpa DB, tanpa auth |
| `components/AGENTS.md` | **komponen aktif** — rk/{RKShell, Panel, Kompas, Drawer, Palet}, ui/{Ikon, StatusIkon}, CatatanTujuan, asesor/{CatatanMandiri}, OPDTable, motif/KerawangMotifs |
| `styles/AGENTS.md` | `tokens.css` (token `--rk-*`, revisi tema terang 23 Sep: kontras ≥4.5:1, panel berbayang halus, chip status tint; font Bricolage Grotesque + IBM Plex) · `ruang-kendali.css` (`.rk-*`, jembatan `.rk-legacy`) · `globals.css` (halaman lama, 1.156 baris) |
| `data/AGENTS.md` | Struktur data: pemdi.json (7 aspek, 20 indikator, 232 bukti, catatan_mandiri), modul-indikator.json, catatan-mandiri.json, opd.json (52 OPD, PPB), draf-bukti-prioritas.json, kebutuhan-bukti-dukung.json, glosarium, dokumen-kunci; rantai skrip regenerasi |
| `STRATEGI_PEMDIACEHTENGAH.md` | **Dokumen perencanaan strategis (file ini)** — 4 fase, quick wins, risiko, metrik |
| `lib/AGENTS.md` | 12 modul — ruangKendali, rkData, overlay, db, cmsAuth, pemdiNilai (rumus resmi; tes pin), catatanMandiri (ekspor teks/HTML/DOCX), pjButir (butir per OPD), search-index, modeSitus, format, slugify |
| `public/AGENTS.md` | PWA assets: manifest.json, icons (192/512 PNG + maskable-512 + apple-touch + SVG), favicon, crest-pemdi.svg, og-image.jpg |
| **`REPOSISI-PEMDI.md`** | **Arah reposisi Opsi B** — B1 Dashboard Pemdi (internal, aktif); B2/B3 ditunda; §Arsip persona publik (tag `arsip/persona-publik-2026-09`). Baca ini dulu sebelum kerja selanjutnya |

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
| Tracking laporan warga | `LaporanStatus.js` | ✅ | 14 Jun 2026 |
| Notifikasi | `Toast.js` | ✅ | 14 Jun 2026 |
| Visual Pemdi | `ProgressBarVisual.js`, `TimelineRoadmap.js` | ✅ | 14 Jun 2026 |
| Trust pages | `pages/kebijakan-privasi.js`, `pages/404.js` | ✅ | 14 Jun 2026 |
| CORS & XSS helpers | `lib/cors.js`, `lib/safeRichText.js` | ✅ | 14 Jun 2026 |
| RFC 9116 | `.well-known/security.txt` | ✅ | 14 Jun 2026 |

| **Angka terkini (diverifikasi 24 Sep 2026, `9c3d9c4` Patch 15):**

- **komponen aktif** di `components/` — rk/{RKShell, Panel, Kompas, Drawer, Palet, NavMenu, Dial, PanelLipat, Asesor}, ui/{Ikon, StatusIkon}, asesor/{CatatanMandiri}, CatatanTujuan, OPDTable, motif/KerawangMotifs — total **15 berkas** (lihat `components/AGENTS.md`)
- **15 route halaman + 14 API route** (6 read-only + 5 admin CMS + 3 auth)
- **12 modul** di `lib/`
- **58 tes** (`pemdiNilai` 16 + `requirement` 4 + `catatanMandiri` 10 + `pjButir` + `cekUi` 6 aturan + `overlay` + `ruangKendali` + asesor) — dijalankan CI dan `npm test`
- **67 halaman statis** di build (15 rute inti + 52 halaman OPD `/opd/[slug]` + `/500`; rute baru `/asesor`) · `npx next lint` 0 error (3 warning bawaan lama di admin.js) · `node scripts/cek-ui.mjs` bersih

## Status Sekarang — 24 Sep 2026

**Repo:** branch `main` · `git@github.com:Niumination/PemdiAcehTengah.git` · produksi `https://pemdi-aceh-tengah.vercel.app` · HEAD `9c3d9c4` (Patch 15 ponsel & penjaga akhir) · working tree bersih, semua commit ter-push.

| Milestone | Ringkasan |
|-----------|-----------|
| **Patch 10 — Tahap 3a: reskin `/pemdi`, `/requirement`, `/cari` ke gaya Ruang Kendali (23 Sep 2026)** | Tiga halaman lama ditulis ulang sebagai rute RK-native (`RUTE_RK` di `_app.js`, tanpa jembatan `.rk-legacy`): `/pemdi` = 7 kartu aspek ber-`Dial` + akordeon indikator dengan tangga level & catatan mandiri (852 → ~200 baris, inline-style 152 → 8); `/requirement` = papan tugas 3 kolom P0/P1/Panduan + tab PPB (761 → ~230 baris, 39 → 5); `/cari` = kotak cari RK + saring jenis + daftar hasil (22 → 1). Komponen baru `rk/Dial.js`. Data/JSON/API tidak berubah; Catatan Mandiri, ekspor DOCX/cetak, Drawer tetap. Prototipe disetujui: `desain/proto-pemdi-rk.html` |
| **Patch 11 — Tahap 3b: reskin `/opd`, `/opd/[slug]`, `/spbe` ke gaya Ruang Kendali (24 Sep 2026)** | Tiga halaman lama berikutnya jadi rute RK-native (`RUTE_RK`): `/opd` = peta ubin 52 OPD (ukuran ∝ butir, warna per level) + saring level + tabel lipat (`OPDTable` prop baru `polos`); `/opd/[slug]` = profil OPD dengan strip butir (klik → Drawer), daftar butir, pohon urusan/proses PPB, chip OPD terkait; `/spbe` = infografis skala 0–5 SPBE 2,59 vs Pemdi asesor 1,24 vs mandiri 1,42 vs simulasi vs target 2,50, Dial per domain, pemetaan domain → aspek Pemdi. Data/JSON/API tidak berubah. |
| **Patch 12 — Tahap 3c: reskin `/probis`, `/glosarium`, `/404` ke gaya Ruang Kendali (24 Sep 2026)** | `/probis` = aliran L0→L1→L2: `rk-sit` (visi, 8 misi, 35 urusan, proses, OPD terlibat), misi sebagai kartu lipat di tempat (DetailModal dihapus), panel beban keterlibatan OPD, urusan dengan batang jumlah OPD, proses per kategori dalam 6 lajur, **sorot OPD lintas level** (`data-redup`); `/glosarium` = kotak cari RK + chip kategori + kartu istilah dua tingkat (`<details>`); `/404` = kode besar bergaris emas, jalur yang diminta, tebakan tujuan dari potongan URL, pintasan. `RUTE_RK` kini mencakup semua rute kecuali `/modul-indikator` (satu-satunya sisa `.rk-legacy`, dijadwalkan Patch 13 karena 1.960 baris). Data/JSON/API tidak berubah. |
| **Patch 13 — Tahap 3d: reskin `/modul-indikator` ke gaya Ruang Kendali (24 Sep 2026)** | Halaman terbesar (1.960 → ~330 baris) ditulis ulang RK-native: `rk-sit` (indikator/butir, diterima, revisi, draf lokal, Tahap 1 portal), saring status/aspek/level, kartu modul `.rk-modul` dengan **tangga L1–L5 mini** di judul + pita status; saat dibuka: deskripsi Permen (`<details>`), posisi & langkah, tangga level yang **dapat dipilih** → kriteria baku level itu (kiri) berdampingan dengan butir existing level itu (kanan: status asesor, OPD, #dokumen kunci, pratinjau PDF, buka di Drawer, `CatatanButir`), PJ, `EksporCatatan`. Matriks Kebutuhan L1–L2 dan **Peta dokumen kunci** (31 dokumen, sebelumnya dead code) sebagai panel lipat tertutup. ≈640 baris `{false && …}` dihapus; `LevelFokus` dihapus (tak dipakai lagi). Semua rute kini RK-native; jembatan `.rk-legacy` tinggal jaring pengaman. Data/JSON/API tidak berubah. |
| **Patch 14 — Tahap 2: data evaluator asesor eksternal (24 Sep 2026)** | Berkas baru `data/evaluasi-asesor-2026.json` (hanya Kab. Aceh Tengah; teks asesor disalin apa adanya, `terpotong` ditandai). `lib/rkData` menggabungkan → `situasi.asesor` & `indikator[].asesor`. **Headline dashboard kini 1,24** (asesor KemenPANRB, Level 1 · Rintisan); simulasi butir & mandiri awal 1,42 jadi pembanding. Komponen `rk/Asesor.js` (`BandingAspek`, `PetaVerifikasi`); panel baru di `/dashboard`; halaman baru **`/asesor`** (nav "Hasil asesor"): perbandingan per aspek, peta verifikasi 20×3, tabel catatan & rekomendasi + kolom simulasi, catatan interviu; tag asesor di Drawer; `/spbe` membaca JSON yang sama. JSON lama & API tidak berubah (aditif). Tes `test/asesor.test.mjs` (3). Penyimpangan dari rencana: lapisan ring asesor pada Kompas diganti panel batang (lebih terbaca, tanpa menambah kepadatan SVG). |
| **Patch 17 — Tahap B: P0 ponsel terukur (25 Sep 2026)** | Perbaikan yang diukur `scripts/audit-ui.mjs` (baseline Patch 16 → sesudah): **tumpang tindih header 15/15 rute → 0**; **elemen keluar viewport 10 rute → 0** di 390 & 1440. (1) Header ponsel: merek dua varian (`rk-brand-panjang`/`rk-brand-pendek`; ≤860 "Dashboard Pemdi", ≤480 "Pemdi"), `b` ellipsis + `min-width:0`, seg persona "Koord." ≤380px, jarak aksi 6px. (2) Marquee dibungkus `.rk-strip-vw` (overflow hidden + mask tepi) — teks tidak lagi lewat di bawah label Info; `.rk-track` `width:max-content`. (3) Pemicu menu radial terlihat **44px** (left −12px, ikon terpusat) di desktop; hover/buka tetap meluncur penuh. (4) Kepala panel ponsel: `h2` `flex-wrap`, `.rk-act` membungkus (`overflow-wrap:anywhere`), `.rk-act.faint` baris sendiri. (5) Tabel ponsel: kolom prioritas rendah `th/td.p2` disembunyikan ≤860 (AntreanTabel: Jenis, Masih disiapkan; `/asesor`: Rekomendasi, Simulasi), kolom pertama **beku** (`position:sticky`) saat digeser di `.rk-wrap`; tag eksternal di `.rk-ind .nm` disembunyikan di ponsel; kartu OPD (`.opd-stack`) nama+urusan membungkus. `audit-ui`: elemen di dalam wadah gulir horizontal (`overflow-x:auto/scroll`) yang wadahnya muat tidak lagi dihitung sebagai keluar viewport (strategi geser = sah). Belum disentuh (Tahap C/D): target kecil desktop, tinggi halaman ponsel, hierarki KPI, URL-state. |
| **Patch 16 — Tahap A audit: alat ukur & pedoman (25 Sep 2026)** | Tinjauan pemilik di desktop+ponsel (24 Sep): "tombol tidak sesuai, panel tidak presisi" → sebelum memperbaiki, bangun alat ukur agar temuan objektif. (1) `scripts/audit-ui.mjs` (`npm run audit:ui`; Playwright **tidak** masuk dependencies — pasang manual `npm i -D playwright && npx playwright install chromium`): 15 rute × viewport 1440/1024/390 → overflow horizontal + elemen terluar yang keluar viewport, target <44px (ponsel)/<32px (desktop), tumpang tindih anak header, tinggi halaman, CLS, tangkapan layar ke `audit/keluaran/` (di-.gitignore); exit 1 bila ada overflow/tindih. **Baseline 25 Sep (web live `f3c19cc`)**: header ponsel tumpang tindih di **15/15** rute (judul ∩ `rk-seg` 164px, ∩ `rk-actions` 168px); overflow di 10 rute ponsel (`rk-table` 453–983px, `rk-tag.t-eksternal` 686px, `rk-act.faint` 797px, `span.muted` 406px); tinggi ponsel /probis 16.552px, /dashboard 9.420px; target kecil desktop /pemdi 176/299, /probis 215/244, /requirement 163/234; CLS 0 kecuali /dashboard 1440 = 0,073. (2) `desain/PEDOMAN-ANTARMUKA.md` — adaptasi lokal Vercel Web Interface Guidelines (disalin, bukan fetch runtime) + ketentuan repo. (3) `cek-ui` +3 aturan: (7) `transition: all`, (8) viewport melarang zum, (9) `<img>` tanpa width+height; 3 `transition: all` lama di `globals.css` diganti properti eksplisit. (4) `docs/AUDIT-UIUX-KONTEN-25-SEP.md` — hasil autoskills (midudev; 9/11 skill sudah terpasang, stack-based, kurang untuk UI/UX), riset pola→penerapan, lembar heuristik 10 poin + skor awal per halaman (9–14/20), metode audit konten (inventaris, JTBD, "lalu apa?", kesegaran data, tombol lapor), tahapan A–F. (5) `docs/UJI-TUGAS-PEMDI.md` — uji tugas 3 persona × 5 tugas, lembar catat, ambang ≥4/5 selesai <120 detik. Tanpa perubahan visual — Tahap B (P0 ponsel: header, overflow tabel→kartu/kolom prioritas, marquee, pemicu menu terlihat) menyusul sebagai Patch 17. |
| **Patch 15 — Tahap 4: ponsel & penjaga akhir (24 Sep 2026)** | **Perbaikan**: rute ke-13 (`/asesor`, Patch 14) belum punya koordinat menu → item menumpuk di pemicu; koordinat radial/baris × desktop/ponsel dihitung ulang untuk 13 rute (radial r=290, pitch 46; busur 580px; ponsel pendek `scale(.82)`). Blok CSS ponsel: target sentuh ≥40–44px (chip, seg, tombol kecil, tombol lipat, strip butir, tangga level, sel verifikasi), tangga modul 5 kolom, label batang disembunyikan. `cek-ui` +2 aturan: (5) jumlah `RUTE_NAV` = jumlah koordinat `li:nth-child` per gaya/ponsel; (6) setiap `pages/*.js` wajib ada di `RUTE_RK` (mencegah halaman baru jatuh ke `.rk-legacy`). Audit statis: tanpa peramban, verifikasi lewat build + curl + aturan cek-ui; tinjauan visual 390px tetap dilakukan pemilik di web live. |
| **Patch 9 — Tahap 1: menu navigasi Radial ⇄ Baris + panel lipat (23 Sep 2026)** | `components/rk/NavMenu.js` menggantikan tab atas/Lainnya/bottom-tab: pemicu bulat di tepi kiri, 12 rute mekar di satu busur (r=270, jarak vertikal seragam 46px) atau garis lurus; sakelar gaya tersimpan per perangkat; auto-hide/auto-focus/focus-trap; pintasan M dan g+huruf. `components/rk/PanelLipat.js` + `LipatSemua` untuk 7 panel `/dashboard` (ingatan per panel, ringkasan saat terlipat, animasi grid-rows tanpa CLS). Token baru `--rk-navy`, 9 ikon baru. Prototipe disetujui pemilik (v5): `desain/proto-nav-radial.html` |
| **Patch 8 — Tahap 0 hotfix tinjauan live (23 Sep 2026)** | Tinjauan pemilik di web live: (1) panel 52 OPD di `/dashboard` kosong → prop `opdList` salah nama, harus `list`; (2) Cetak/PDF mati → `window.open(...,'noopener')` selalu null → `lib/cetak.js` `bukaCetak()` + fallback iframe; (3) menu Lainnya tak menutup → tutup pada `routeChangeStart`/klik luar/Esc; (4) header kacau mode PJ → pemilih OPD pindah ke baris konteks `.rk-konteks`, grid bar `minmax(0,…)`; (5) marquee ke **bawah** header, emoji bendera diganti label "Info"; (6) lebar halaman default **penuh** + toggle Penuh/1800/1440 (`html[data-lebar]`); (7) drawer 820px + tombol perlebar 1120px. Penjaga `cek-ui` bertambah 2 aturan (noopener, `<OPDTable>` tanpa `list=`). Rencana lanjutan (menu radial/baris, panel lipat, reskin 8 halaman lama, data asesor 1,24): `docs/RENCANA-TINJAUAN-23-SEP.md` |
| **Patch 6 + 7 — Tema terang menyeluruh + CMS revalidate (23 Sep 2026, `6209cd8`)** | Susulan arena dari `pemdi-reposisi#4.zip` (basis `fce460b`). **Patch 6** (visual): tema terang konsisten di 10 halaman lama — hero gradien navy + teks putih hardcoded → panel token (`.hero`, `.hero-chip`), `LEVEL_WARNA` & warna OPD → token per tema, pola `${warna}15` → `color-mix()`, hex styled-jsx → token. **Patch 7** (tanpa env: nol perubahan perilaku): `lib/revalidate.js` — hasil revalidate dilaporkan di respons API; `CMS_DB_LOKAL` → PGlite (`@electric-sql/pglite` devDep) untuk uji lokal tanpa Neon; jalur tulis diverifikasi end-to-end terhadap Postgres. 21 berkas +191/−188 · 55/55 tes · lint 0 error · build 62 halaman statis · cek-ui bersih |
| **Patch 5 — Tema Terang (23 Sep 2026, `76f3242`)** | Susulan arena dari `pemdi-reposisi#3.zip`: revisi tema terang (umpan balik pemilik soal kontras & panel datar). Hanya 3 berkas styles: `tokens.css` (bg `#EDE8DD`, panel putih + `--rk-shadow-1` bayangan halus, garis `#D3CBB9/#B8AE97`, ink-2 `#34405A` 10.4:1, ink-3 `#5B6680` 5.7:1, emas `#846419` ≥4.5:1 juga di panel-2, chip status tint `--rk-tag-alpha` 12 %) + `ruang-kendali.css` (bayangan panel, chip status, blok tema terang) + `styles/AGENTS.md`. Semua token teks ≥ 4.5:1. 3 berkas +52/−22 · 55/55 tes · lint 0 error · build 62 halaman statis · cek-ui bersih. Visual saja — nol perubahan perilaku |
| **Ruang Kendali + CMS — 22 Sep 2026** | 5 patch arena di atas `12ad08c`: (1) fondasi desain `styles/tokens.css` + `components/rk/*` + rute baru `/dashboard` `/indikator` `/antrean` + `lib/ruangKendali.js` + `data/linimasa.json`; (2) navigasi pindah ke `RKShell`, `/` → 308 `/dashboard`, shell lama (AppShell/Sidebar/BottomNav/Footer/ScrollTop/ThemeToggle/BerandaAsesor) dihapus; (3) emoji → `Ikon`/`StatusIkon`, 4 komponen mati dihapus, −460 baris CSS mati, font ≥ 11px, penjaga `scripts/cek-ui.mjs`; (4) DOX pass; (5) CMS `/admin` + overlay Neon Postgres di atas JSON, 2 peran sandi bersama, log audit, ekspor ke `catatan-mandiri.json`. 81 berkas +3.258/−2.175 · 55/55 tes · lint 0 error · build 66 halaman · cek-ui bersih |
| **Reposisi Opsi B — 22 Sep 2026** | Persona publik dihapus dari main (+521/−6.895, 83 berkas): 14 komponen warga, 9 halaman publik, Supabase, middleware persona. Arsip tag `arsip/persona-publik-2026-09` di `eeaa573`. Produk = Dashboard Pemdi internal murni |
| **Hardening 17 Sep 2026** | 22 dead code dihapus, 20 tes (`node --test`) ditambahkan, rate limiting atomic (`lib/rate-limit-db.js` + RPC Supabase), `/api/health`, sanitizer & `adminAuth` diperkuat, canonical + `og:url`, `og-image.jpg` 166 KB (dari 1,6 MB) |
| **Merge PR #5 — 18 Sep 2026** | Kontribusi eksternal arena.ai di-*squash* ke `96e018a`: `audit/` dikeluarkan dari repo (arsip privat pemilik), `.gitignore` diperbaiki (`data/*.bak-*`), `/api/health` tidak lagi membocorkan `error.message` ke respons |
| **CI — 18 Sep 2026** | `.github/workflows/ci.yml`: `npm ci` → lint → **`npm test`** → build (Node 20). Menjadi gerbang mutu untuk setiap push/PR |
| **Infrastruktur data — 18–19 Sep 2026** | `db/schema.sql`, `db/rate-limit-schema.sql`, `db/rate-limit-cleanup.sql` (pg_cron `bersihkan-rate-limits`, 10:17 WIB); RLS aktif di 4 tabel; kredensial admin dirotasi (`ADMIN_PASSWORD` baru, `ADMIN_TOKEN` dihapus) |
| **DOX pass — 19 Sep 2026** | Seluruh `ADMIN_TOKEN` → `ADMIN_PASSWORD`; angka dokumen diselaraskan dengan kenyataan repo; klaim drift lama dibersihkan |
| **Mobile `/layanan` — 19 Sep 2026** | Akar masalah bukan spasi: kartu memakai tata letak 3 kolom desktop di 390px (judul 89px, deskripsi 72px, badge 63px) sehingga isi kartu tampak menumpuk. Di ≤768px kartu jadi satu kolom (judul 194px, deskripsi/meta 296px), deskripsi dibatasi 2 baris dan **dilepas otomatis saat kartu dibuka** (`aria-expanded=true`), baris filter kategori jadi satu baris yang bisa digeser (200px → 50px), blok cari filter **melekat** di bawah topbar (tetap di 97px setelah gulir 1.800px), dan grid statistik 2×2 lewat kelas khusus `.layanan-stats`. Desktop tidak berubah. Rencana tahap lanjut untuk halaman lain: `docs/rencana-mobile-ux-tahap-2.md` |
| **Perbaikan UI/UX P1–P6 — 19 Sep 2026** | (1) `--primary-bg` didefinisikan (dipakai 9x, 0 definisi) → tema gelap tidak lagi menampilkan blok biru terang; (2) kontras: `--gray-500` → `--muted`, `--muted` digelapkan ke `#5E6980`, `.btn-primary` tema gelap pakai tinta gelap (putih di emas = 2,31); (3) payload beranda dirampingkan — `pemdi.json` 97,9 KB hanya dikirim 4 field/aspek: HTML 233 KB → 135 KB, `__NEXT_DATA__` 129 KB → 34 KB; (4) panel rumus internal /pemdi dilipat `<details>` + marquee dihentikan di ≤768px + emoji CTA dipangkas; (5) 26 referensi gambar mati `/docs/bukti/*` dibuang, 2 blok kosong disembunyikan (blok RPJMD 8 gambar dipastikan tetap tampil); (6) `borderLeft` side-tab → `borderTop`, `transition: width` → `scaleX` (SpbeGauge, SlaBadge — DashboardSKM tidak diubah karena label `%` beranker pada lebar bar), warna off-palette → token. Build sukses, lint 0 error, npm test 20/20 |
| **Audit UI/UX live — 19 Sep 2026** | Audit produksi 11 rute × 3 viewport (1440/768/390) via camofox: (1) tautan footer `PermenPANRB 8/2026` balik 404 → PDF disalin ke `public/docs/permenpanrb-8-2026.pdf` (sha256 identik) + href diperbarui; (2) tap target mobile di bawah standar (`.theme-tg` 23px, `.bukti-act` 15px, nav 14px, chip 28–30px) → blok `@media (max-width: 768px)` di `globals.css` (min 44px) + `aria-label` pada tombol bukti di `/pemdi`. Terverifikasi: tanpa overflow horizontal level halaman, tabel terbungkus `.tbl-wrap` (scrollable), tidak ada gambar rusak, tidak ada tombol tanpa nama aksesibel |

> **Catatan:** dokumen ini pernah memuat klaim yang melenceng (65 halaman, 30 komponen, HEAD `6849aaa` di branch Juni 2026). Semua sudah dibersihkan 19 Sep 2026 — bila menemukan pola serupa, itu bug dokumentasi: koreksi ke kenyataan repo, jangan diikuti.

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
| 30 Jul | `docs/modul-indikator/` | 501 MB | ✅ Dihapus — **revisi 19 Sep 2026:** folder ada kembali (501 MB / 1.555 berkas `.pptx.md` + `_images/` hasil ekstraksi ulang; `git ls-files` = 0, tetap git-ignored, tidak pernah masuk repo). | 1.535 raw PNG exports PPTX — konten sudah diekstrak ke `data/modul-indikator.json`. Sudah di `.gitignore` sejak awal. |
| 30 Jul | `pages/pemdi.js` — bukti dukung section | 715 baris | ✅ Dihapus | Semua 57 bukti dukung direset ke "belum" karena belum sesuai kriteria level. Lihat commit `ca17535`. |
| — | `public/bukti-dukung/` (31 MB, 42 file → **39 file flat**) | ⏳ **Ditunda** | — | Masih disimpan untuk dipakai nanti saat semua bukti dukung sudah diverifikasi sesuai kriteria level masing-masing indikator. Jangan hapus sampai proses verifikasi selesai. (6 Agu: di-flatten — semua file langsung di `public/bukti-dukung/`, tanpa subfolder.) |

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
| ~~`public/bukti-dukung/05-portal-pemdi/`~~ | **7 file** dari `~/Documents/REAL-PEMDI-DATA DUKUNG/` — sudah diunggah ke portal eval.spbe.go.id (kode PG_04 & TD_13): SK Tim Koordinasi PEMDI 555/395/2026, DPA/RKA 0037 tata kelola SPBE, undangan+rundown Rapat Transformasi Digital 25-26 Jun 2026, KAK & Laporan Akhir Aplikasi Bapokting. *(Subfolder dihapus 6 Agu — file kini di root `public/bukti-dukung/`.)* |
| ~~`public/bukti-dukung/06-dokumen-2026/`~~ | **13 file** dari `~/Documents/` & `odl-pdf bukti dukung/` — belum diunggah: Indeks KAMI 5.0 (skor 563 "Cukup Baik", 13 Apr 2026), 2 Perbup persandian, SK Forum Satu Data 188.55/375/2025, RPJMD 2025-2029, Renstra/Renja/DPA/RKA Diskominfo 2026, capaian RKPD. *(Subfolder dihapus 6 Agu — file kini di root.)* |
| `data/pemdi.json` | **+20 bukti baru** (id `P1.*`, flag `_sumber_baru`, `_dokumen_kunci`, `_portal`) → `total_item_bukti` 114 → **134** (57 lengkap, 70 belum, 7 proses). |
| `data/bukti-dokumen-mapping.json` | Regenerated → **133/134 terpetakan** (Perbup SOTK sengaja tanpa dokumen kunci). |
| `pages/modul-indikator.js` | **Section baru "📥 Bukti Dukung Baru — Portal Evaluasi & Dokumen 2026"** — tabel 20 bukti baru (indikator, level, dokumen kunci clickable, status, sumber portal/Documents). |

> ℹ️ **Catatan:** Bukti baru ber-status `proses` (7 file portal eval) & `belum` (13 dokumen Documents) — belum ada yang `lengkap`, sehingga indeks Pemdi belum berubah. Verifikasi kesesuaian kriteria level diperlukan sebelum dianggap lengkap.

## 🧹 Update Data — 6 Agu 2026 (Flatten + Rename Bukti Dukung)

| Item | Perubahan |
|------|-----------|
| `public/bukti-dukung/` | **Di-flatten**: 8 subfolder (00-manifest s/d 07-eksternal) dihapus — semua 39 file langsung di root `public/bukti-dukung/`. 2 file portal hilang (`TD_13_02`/`TD_13_05` DPA) disalin dari `~/Documents/REAL-PEMDI-DATA DUKUNG/`. |
| `public/bukti-dukung/*` | **Rename 39 file** → format `Aspek_I#_NoUrut_Nama_Tahun.ext` (Aspek disingkat: TataKelola/Penyelenggara/Data/KeamananSiber/Teknologi/Keterpaduan/Kepuasan; NoUrut = urutan item per indikator level 1→5; Nama disingkat; Tahun = tahun dokumen). Contoh: `TataKelola_I1_01_Perbup-48-Arsitektur-SPBE_2025.pdf`. |
| `data/pemdi.json` | **103 referensi path** (`url_preview`/`url_sumber`, termasuk raw GitHub) di-update ke nama baru. Backup: `pemdi.json.bak-rename`. |

## 🧹 Update Data — 6 Agu 2026 (Kelengkapan Level 1 — Aturan Penilaian Berjenjang)

Aturan penilaian Pemdi: **jika Level 1 tidak lengkap, Level 2 ke atas TIDAK dinilai**. L1 lengkap = semua item `level_kriteria[L1]` (modul-indikator.json) terpenuhi bukti status `lengkap` (pemdi.json).

| Item | Perubahan |
|------|-----------|
| `public/bukti-dukung/belum-lengkap/` | **Folder baru** — 13 file bukti indikator yang L1 belum lengkap dipindah ke sini (I3: Literasi Digital, Perbup 9 SOTK; I4: Perbup 70; I8: Perbup 6, Indeks KAMI x2, Perbup 137; I13: KAK/Laporan/DPA Bapokting x4; I19: Perbup 21, Hasil SKM). 26 file indikator L1 lengkap tetap di root. |
| `data/pemdi.json` | **7 indikator ditandai `_l1_lengkap: false`** (I3, I4, I8, I12, I13, I14, I19) — sisanya `true`. Referensi 13 file pindah → `bukti-dukung/belum-lengkap/`. |
| `pages/modul-indikator.js` | Indikator `_l1_lengkap: false` → badge gembok "L1 Belum Lengkap", bukti disembunyikan (tabel Kondisi Existing diganti notice), tabel Bukti Dukung Baru di-filter, statistik header hanya hitung bukti tampil (**85/177**, gap 92), tab "Perlu Dikerjakan" tetap menampilkan indikator hidden. |
| `pages/pemdi.js` | Sama: badge + notice + grid bukti per level diganti notice + rekomendasi tunggal "lengkapi L1". |
| `scripts/pisah-belum-lengkap.py` | Script kelengkapan L1 → pindah file + flag data (re-run aman). |

> Indikator eksternal (I5/I6/I7/I18 — nilai otomatis sistem nasional, 0 item modul) otomatis dianggap lengkap dan tetap tampil. I12/I14 tidak punya file primary (bukti = Perbup 48 milik I1) — file tetap di root, hanya entri UI yang disembunyikan. Contoh bukti di kartu level modul (panduan, bukan tabel penilaian) tetap tampil.

## 🧹 Update Data — 6 Agu 2026 (Penyesuaian Bukti Dukung ↔ Kriteria per Level)

User mengoreksi: banyak bukti existing TIDAK nyambung dengan kriteria & panduan modul (contoh I17 portal: buktinya Perbup 30/48/73, harusnya URL + screenshot + daftar layanan). Pola: Perbup 48/2025 Arsitektur SPBE dipakai sebagai bukti "lengkap" di ~15 indikator padahal hanya sesuai untuk indikator arsitektur/perencanaan.

| Item | Perubahan |
|------|-----------|
| `data/pemdi.json` | Semua bukti diberi `_peran: "utama"|"pendukung"` (136 bukti). **Utama** = bukti langsung substansi kriteria (dihitung kelengkapan level); **Pendukung** = dokumen penunjang (perbup/SK umum, badge 🔹 di UI, tidak dihitung). Perbup 48/9 SOTK/70/6/137/30/73/SKM turun jadi pendukung di indikator yang tidak sesuai. |
| `data/pemdi.json` | **7 bukti diverifikasi → lengkap** (sesuai substansi kriteria): Indeks KAMI I10, Perbup 1-2/2025 persandian I11, KAK+Laporan Bapokting I13, SK Tim+Rapat I4. |
| `data/pemdi.json` | **Bukti baru I17 (3)**: P1.I17_1 URL portal (acehtengahkab.go.id), P1.I17_2 Screenshot portal, P1.I17_3 Daftar 25 layanan — sesuai panduan modul L1 I17 "URL & screenshot portal layanan digital daerah, daftar layanan". |
| `public/bukti-dukung/` | +2 file: `Keterpaduan_I17_02_Screenshot-Portal_2026.png`, `Keterpaduan_I17_03_Daftar-Layanan-Portal_2026.png` (screenshot portal pemdi + direktori layanan). `KeamananSiber_I9_02_Laporan-Pengawasan-Kinerja_2026.xlsx` → belum-lengkap (I9 jadi hidden). Indeks KAMI → kembali root (I10 tampil). |
| `_l1_lengkap` | Recomputed dgn bukti **utama saja**: TAMPIL 12 (I1,I2,I5,I6,I7,I10,I11,I15,I16,I17,I18,I20) · HIDDEN 8 (I3,I4,I8,I9,I12,I13,I14,I19). I9 baru hidden; I10/I11/I17 baru tampil dgn bukti benar. |
| `pages/modul-indikator.js` + `pages/pemdi.js` | Badge "🔹 Pendukung" di tabel existing & grid per level. Statistik: 84/177 bukti tampil, 41 lengkap. |

> Aturan baru: **kelengkapan level dihitung hanya dari bukti _peran=utama**. Bukti pendukung tetap tampil (transparansi) tapi tidak menghitung. I17 sekarang benar: URL + screenshot + daftar layanan (utama) + Perbup 30/48/73 (pendukung).

## 🧹 Update Data — 6 Agu 2026 (Penyempurnaan Audit Ulang Bukti Dukung)

Audit ulang menyeluruh setelah penyesuaian — temuan & perbaikan:

| Temuan | Perbaikan |
|--------|-----------|
| 2 file bukti indikator TAMPIL masih di `belum-lengkap/` | `Data_I8_01_Perbup-6-Sistem-Pemdi_2025.pdf` (dipakai I10) & `Kepuasan_I19_06_Hasil-Survei-Kepuasan_2026.xlsx` (dipakai I20) → kembali ke root. |
| Nomor urut file screenshot I17 tidak sesuai item | Rename `Keterpaduan_I17_02/03_*` → `_05/_06` (URL portal=item 04, Screenshot=05, Daftar=06). |
| Bukti portal I17 tanpa dokumen kunci | `_dokumen_kunci: [29]` untuk P1.I17_1/2/3 (dok #29 Portal). B17.1 (Screenshot portal, belum) diisi → lengkap (file sama dengan P1.I17_2). |
| `bukti-dokumen-mapping.json` stale | +3 bukti I17 → dok #29; stats 134→**137** (136 terpetakan, 1 belum = Perbup SOTK). |
| Bukti `_ext: "url"` belum di-handle UI | Kolom Aksi: tombol 🌐 Buka (link langsung, bukan iframe — X-Frame-Options); /pemdi grid: link 🌐 buka; tabel Bukti Baru: label "🌐 Buka URL". |
| Teks hero /pemdi stale ("Dihitung dari 134") | Dinamis: "Dihitung dari {totalTampil} bukti dukung tampil (139 di data · 177 target)". Helper `totalTampil` = bukti indikator `_l1_lengkap !== false`. |
| `hitungStatusL1` hitung semua bukti | Fix: hanya bukti `_peran !== "pendukung"` (konsisten dengan _l1_lengkap). |
| `total_item_bukti` stale 134 | → **139** (aktual, termasuk hidden). `total_item_manual` 114 tetap (sumber lama). |

**Hasil akhir (verified)**: 0 referensi putus · 0 file unused · 10 file di `belum-lengkap/` semuanya milik indikator hidden · 12 indikator TAMPIL (I1,I2,I5,I6,I7,I10,I11,I15,I16,I17,I18,I20) · 8 HIDDEN (I3,I4,I8,I9,I12,I13,I14,I19) · statistik UI 84/177 tampil (42 lengkap, 3 proses, 39 belum, gap 93). Script: `scripts/sempurnakan-bukti.py`.

## 🧹 Update Data — 7 Agu 2026 (Ground Truth NotebookLM — Perbaikan Kriteria Level)

Sumber asli modul = 20 PPTX (konversi ilovepdf, di Downloads/modul-pptx). Analisis mandiri menemukan 274 kalimat konten PPT hilang di modul-indikator.json (analisis teks 95 level) + tabel kriteria banyak berupa GAMBAR (vision API terkendala kuota). Solusi: **NotebookLM** (notebook "Modul-Pemdi", 21 sources) sebagai ground truth — query 20 indikator, jawaban + cited_text tersimpan di `brain/docs/ground-truth-modul-pemdi/I1-20.json` (±115.000 char, 322 references).

| Item | Perubahan |
|------|-----------|
| `data/modul-indikator.json` | **100 level kriteria ditulis ulang LENGKAP** dari ground truth: format baru = "Kriteria:\n…\n\nKondisi:\n…\n\nData Dukung:\n…" (dulu hanya kriteria inti ~200-700 char, sekarang 500-1.900 char/level mencakup semua segmen resmi). Backup: `.bak-gt`. |
| `data/modul-indikator.json` | `ringkasan` di-regenerate dari kriteria baru (≤160 char, kalimat pertama bagian Kriteria). I20 kini punya kriteria lengkap (sebelumnya "tanpa slide kriteria"). |
| `data/bukti-dokumen-mapping.json` | +2 entri P1.I13_3/P1.I13_4 (DPA Bapokting) → total 139 = pemdi.json. |
| `brain/docs/ground-truth-modul-pemdi/` | 20 JSON ground truth + script query & terapkan (tanpa regex — hindari bug escaping). |

**Verifikasi**: audit_sync 7/7 checkpoint ✅ (139==139, 0 issue) · build 0 error · browser render ringkasan baru benar · `_l1_lengkap` tetap konsisten (12 tampil / 8 hidden). Script: `terapkan_ground_truth.py` (string-ops, immune escaping).

## 🎨 Update Tema — 8 Agu 2026 (Luxury Navy/Beige/Gold)

Palette resmi dari user: **Navy #1F2A44 · Warm Beige #E8DCC8 · Soft Gold #C6A75E** (sumber: JPEG "The Ultimate Luxury Color Combo" di Downloads — teks di gambar dikonfirmasi via OCR).

| Perubahan | Detail |
|-----------|--------|
| `styles/globals.css` `:root` | **Tema terang (default)** = Navy primary, bg Warm Beige, aksen Soft Gold. Gradien hero/sidebar navy+gold. |
| `styles/globals.css` `[data-theme=dark]` | **Tema gelap padanan "Midnight Navy & Gold"**: bg #0B101C, surface #141C2E, primary interaktif Gold #C6A75E, teks Warm Beige #E8DCC8. |
| `pages/_document.js` + tombol tema di `components/rk/RKShell.js` | **Default SELALU light** (abaikan prefers-color-scheme OS). Toggle manual tetap tersimpan di localStorage. |
| `pages/_app.js` | theme-color & mask-icon → #1F2A44. |
| `components/PPBChain.js`, `QuickActions.js` | Hardcode #004098 → #1F2A44. |

**Verifikasi**: build 0 error · light: primary #1F2A44, bg #F5F1E8 (DOM-checked) · dark: bg #0B101C, primary #C6A75E (DOM-checked) · default light setelah clear localStorage.

## 📐 Update Perhitungan & Matriks Bukti — 19 Agu 2026 (Rumus Resmi + Kebutuhan L1-L2)

Capaian nilai disesuaikan dengan **rumus resmi PermenPANRB 8/2026** (Lampiran Pedoman, Bagian B "Metode Penghitungan Indeks Pemdi", hlm. -37- s.d. -39- — diverifikasi langsung dari `docs/permenpanrb 8 2026.pdf`): `Indeks Aspek = Σ(wIj×NIj)/wAi` · `Indeks Pemdi = Σ(wAspek×Indeks Aspek)` · predikat Tabel 4 (Kurang/Cukup/Baik/Sangat Baik/Memuaskan). Ditambah **matriks kebutuhan bukti dukung L1-L2** dari dokumen NotebookLM baru (diberikan user via chat).

| Item | Perubahan |
|------|-----------|
| `lib/pemdiNilai.js` (BARU) | Implementasi rumus resmi + predikat Tabel 4 + nama level resmi (Initiate/Emerging/Developing/Embedded/Leading) + penanganan indikator eksternal (I5 SDI/Bappenas, I6 SJIG/BIG, I7 EPSS/BPS, I18 strategi tim — nilai minimum 1 skala selama `eksternal.nilai` null, berlabel "menunggu"). Dipakai /pemdi, /modul-indikator, PemdiCalculator. |
| `scripts/hitung-capaian-pemdi.py` (BARU, idempoten, repo-relative) | Regenerate `data/pemdi.json`: nilai indikator = level kontinu yang seluruh bukti utamanya `lengkap` (aturan berjenjang L1); target indikator = Panduan Bab 4.2; target aspek diturunkan dengan rumus; + blok `perhitungan` & `proyeksi` (proyeksi target 2,29; skenario Panduan Bab 8.5 = 2,375/2,50). `scripts/update-indeks-aktual.py` → **deprecated** (metode lama, indikator eksternal dinilai 0). |
| `data/pemdi.json` | `indeks_aktual` 0,24 → **0,38** (rumus resmi; UI lama menampilkan 0,44 dari field campuran); I19 nilai manual "2" → 0 (jujur sesuai bukti — L1 belum lengkap); + field `eksternal` (I5/I6/I7/I18); target diselaraskan; label/catatan/sumber di-regenerate. |
| `pages/pemdi.js` | Hero "Indeks Pemdi — Capaian Terverifikasi" + panel 🧮 "Perhitungan Capaian Indeks Pemdi" (rumus, tabel wI×NI 20 indikator → indeks aspek → kontribusi → total, 4 kartu tolak ukur: capaian/proyeksi target/skenario 2,375/2,50) + badge ⏳ eksternal + link matriks. LEVEL_LABEL & predikat kini dari `lib/pemdiNilai.js` (label lama "Established/Transformative" tidak sesuai regulasi — diganti Developing/Leading). |
| `docs/analisis-bukti-dukung-l1-l2.md` (BARU) | Dokumen sumber dari user: *Analisis Bukti Dukung Kematangan Pemerintah Digital (Level 1 & 2)* — NotebookLM, ekstraksi 20 PPTX Modul Indikator Pemdi. 16 indikator × L1-L2, 48 butir kebutuhan + catatan implementasi (pengisian berkala SIAP Digital/SIA v3 krusial untuk I1/I13/I14/I15). |
| `scripts/build-kebutuhan-bukti.py` (BARU) | Bangun `data/kebutuhan-bukti-dukung.json`: parse dokumen sumber → **penugasan unik greedy-bipartite** kebutuhan↔item modul↔bukti GT per level (skor gabungan rasio+overlap token, sinonim domain `sk/pembentukan→penetapan`) + parse tabel Panduan Bab 6 per indikator. Hasil status indikatif: **10 lengkap · 19 belum · 19 perlu verifikasi** (semua pasangan lengkap diverifikasi manual). |
| `pages/modul-indikator.js` | Section baru 📌 "Matriks Kebutuhan Bukti Dukung — Level 1 & 2" (`#matriks-kebutuhan`): stat bar 48 butir, catatan implementasi SIAP Digital, accordion 16 indikator (PIC, nilai, progres indikasi), tabel kebutuhan per L1/L2 (bukti, kondisi, status indikasi + GT terkait, rujukan modul "terpetakan/elaborasi"), box collapsible Panduan Bab 6 (dokumen/format/PIC/cara). |

**Verifikasi**: build 0 error (72 pages) · lint tanpa warning baru · `/pemdi` indeks 0,38 (saat itu; kini 0,35 setelah sinkron Tahap 1) predikat Tabel 4 + proyeksi 2,29/2,375/2,50 · `/modul-indikator` matriks render · 10/10 pasangan status lengkap dicek manual benar · dev server 200 kedua halaman.

**Reviu & perbaikan (pass 2, 19 Agu 2026)**: (1) parser Panduan dipotong di heading H2 — 36 baris tabel Bab 7/8 yang bocor ke `panduan_bab6` I20 dihapus (44 → 8 baris benar); (2) regex `*Catatan sumber:*` diperbaiki — `catatan_grup` I10/I11/I12 kini ter-capture; (3) `.md` sumber dikoreksi "15" → 16 indikator; (4) field `_nilai_menunggu_eksternal` tidak lagi dipolusi null di 16 indikator (hanya I5/I6/I7/I18); (5) rekomendasi indikator eksternal di /pemdi tidak lagi menyuruh "lengkapi bukti level" (menjadi instruksi koordinasi pembina); (6) label beranda "Indeks Pemdi Terverifikasi"; (7) slider PemdiCalculator min 0; (8) format nilai integer & strip prefiks "N. " nama GT. Kedua script terverifikasi idempoten · build 72 halaman 0 error · lint bersih.
