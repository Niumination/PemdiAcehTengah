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
| **Data Source** | `data/opd.json` (OPD, SPBE, ProBis) + `data/pemdi.json` (7 aspek × 20 indikator Pemdi) |
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
| `styles/` | CSS globals |
| `data/` | Data statis JSON |
| `docs/` | Dokumentasi, PDF, riset |
| `docs.old/` | Legacy docs — referensi historis (tidak diindex DOX) |

## Global Rules

1. **Data flow**: `data/opd.json` → `getStaticProps` di pages → props ke components. API routes juga baca dari file yang sama.
2. **No external database**: Semua data di file JSON statis. Jika butuh database, harus diskusi dulu.
3. **CSS architecture**: Satu file `styles/globals.css` — government theme, Inter font, GOV.UK-inspired. Mobile-first responsive.
4. **Components**: Semua di `components/` — reusable, props-driven. Layout component wrapping.
5. **API routes**: RESTful, JSON response, read from `data/opd.json`.
6. **Deployment**: Vercel production branch `main`. Deploy via Vercel CLI atau push ke GitHub.
7. **No API keys / secrets** di repo — semua placeholder `YOUR_API_KEY`.
8. **Bahasa**: Dokumentasi dan konten portal dalam Bahasa Indonesia.

## Child DOX Index

| Path | Scope |
|------|-------|
| `pages/AGENTS.md` | Halaman Next.js (11 halaman): index, pemdi, probis, layanan, faq, skm, tanya, cari, requirement, opd/[slug], _app — routing, SSR/SSG |
| `pages/api/AGENTS.md` | REST API routes: GET opd, spbe, requirement (read-only, JSON) |
| `components/AGENTS.md` | 13 React komponen: Header, Footer, Layout, ScrollTop, OPDTable, ProbisSection, SpbeGauge, Rekomendasi, DataBadge, DetailModal, ExpandablePanel, LaporWidget, SlaBadge |
| `styles/AGENTS.md` | CSS architecture, design tokens, responsive breakpoints |
| `data/AGENTS.md` | Struktur data opd.json + pemdi.json |
| `docs/` | Dokumentasi proyek — file MD, PDF, referensi regulasi |
| `STRATEGI_PEMDIACEHTENGAH.md` | **Dokumen perencanaan strategis (file ini)** — 4 fase, quick wins, risiko, metrik |

## User Preferences

- Output Bahasa Indonesia
- Government professional theme (Inter, blue/white, clean, GOV.UK-inspired)
- Open source (MIT License)
- Fokus konten: **Peta Proses Bisnis** Level 0-2 (Permenpan 19/2018) + **Indeks Pemdi** (Permenpan 8/2026) sebagai kerangka evaluasi
- **Permenpan RB 8/2026** di `docs/permenpanrb 8 2026.pdf` — WAJIB dibaca sebelum kerja terkait evaluasi Pemdi
- **Indeks SPBE 2025 Aceh Tengah**: 2,59 (Cukup) — baseline untuk target Pemdi 2,50+
- **Data ProBis di `data/opd.json`** → key `probis`: Level 0 (8 misi real Aceh Tengah ✅) + Level 1 (35 urusan ✅) + Level 2 (6 kategori, masih template generik — perlu data real Aceh Tengah)

## Closeout Checklist

1. Re-check changed paths against DOX chain
2. Update nearest owning docs + affected parents/children
3. Refresh every affected Child DOX Index
4. Remove stale or contradictory text
5. Run existing verification (build test)
6. Report docs intentionally left unchanged
