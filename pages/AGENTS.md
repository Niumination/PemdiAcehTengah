# pages/ — DOX

## Purpose

Halaman Next.js — entry points untuk user. SSR/SSG hybrid.

## Ownership

- `index.js` — Halaman beranda: Hero, Peta Proses Bisnis, SPBE Gauge, OPD Table, Rekomendasi, Tentang
- `requirement.js` — Halaman daftar 83 item kebutuhan data/API untuk PPB
- `api/` — REST API routes (lihat `api/AGENTS.md`)

## Local Contracts

### Halaman Beranda (`index.js`)
- **Data flow**: `getStaticProps` → baca `data/opd.json` → props ke komponen
- **Sections** (urutan): Hero → Probis (Peta Proses Bisnis) → SPBE (Indeks) → OPD (Table) → Rekomendasi → Tentang
- **Components used**: SpbeGauge, ProbisSection, Rekomendasi, OPDTable
- **Navigation**: Dari Header.js — anchor links (#probis, #spbe, #opd, #rekomendasi, #tentang)

### Halaman Requirement (`requirement.js`)
- **Halaman**: `/requirement`
- **Content**: 83 item dalam 12 kategori, 3 fase implementasi
- **Style**: Accordion interaktif, card, timeline
- **API endpoint**: `/api/requirement` — JSON lengkap

## Work Guidance
- Halaman baru: buat file `.js` di `pages/`, tambah route di `Header.js`, update README.md
- Untuk SSR: export `getStaticProps` atau `getServerSideProps`
- Untuk static page: export default component

## Verification
- `npm run build` — harus sukses tanpa error
- `curl -s -o /dev/null -w "%{http_code}" https://pemdi-aceh-tengah.vercel.app/` — HTTP 200

## Child DOX Index

| Path | Scope |
|------|-------|
| `api/AGENTS.md` | REST API routes — opd, spbe, requirement |
