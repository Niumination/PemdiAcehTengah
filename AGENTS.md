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

## Project Overview

| Atribut | Nilai |
|---------|-------|
| **Stack** | Next.js 14, React 18, Vercel |
| **Font** | Inter (government professional) |
| **Data Source** | `data/opd.json` — single source of truth |
| **Remote** | `git@github.com:Niumination/PemdiAcehTengah.git` |
| **Production** | https://pemdi-aceh-tengah.vercel.app |
| **License** | MIT |

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
| `pages/AGENTS.md` | Halaman Next.js (index, requirement), routing, SSR/SSG |
| `pages/api/AGENTS.md` | REST API routes: opd, spbe, requirement |
| `components/AGENTS.md` | 8 React komponen: Header, Footer, Layout, ScrollTop, OPDTable, ProbisSection, SpbeGauge, Rekomendasi |
| `styles/AGENTS.md` | CSS architecture, design tokens, responsive breakpoints |
| `data/AGENTS.md` | Struktur data opd.json — metadata, OPD, SPBE, PPB, rekomendasi |
| `docs/AGENTS.md` | Dokumentasi proyek — requirement, riset, referensi |

## User Preferences

- Output Bahasa Indonesia
- Government professional theme (Inter, blue/white, clean, GOV.UK-inspired)
- Open source (MIT License)
- Fokus konten: Peta Proses Bisnis (Level 0-2 Permenpan 19/2018, perhatikan Permenpan RB 8/2026 sebagai update)
- **Permenpan RB 8/2026** ada di `docs/permenpanrb 8 2026.pdf` — WAJIB dibaca sebelum kerja PPB, bisa mengubah framework

## Closeout Checklist

1. Re-check changed paths against DOX chain
2. Update nearest owning docs + affected parents/children
3. Refresh every affected Child DOX Index
4. Remove stale or contradictory text
5. Run existing verification (build test)
6. Report docs intentionally left unchanged
