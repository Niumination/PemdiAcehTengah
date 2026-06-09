# components/ — DOX

## Purpose

React component library — reusable UI building blocks. Semua components-driven, props untuk data.

## Ownership

| Komponen | File | Fungsi |
|----------|------|--------|
| **Header** | `Header.js` | Navigasi utama, mobile hamburger menu, GOV.UK-style |
| **Footer** | `Footer.js` | Footer dengan kredit & link |
| **Layout** | `Layout.js` | Wrapper: Header + main + Footer |
| **ScrollTop** | `ScrollTop.js` | Tombol scroll-to-top muncul saat scroll |
| **OPDTable** | `OPDTable.js` | Tabel interaktif daftar OPD — search, filter, sort |
|| **ProbisSection** | `ProbisSection.js` | Peta Proses Bisnis visual — Level 0, 1, 2. ⚠️ Data masih template generik (Permenpan 19/2018 placeholder — perlu data real Aceh Tengah) |
|| **SpbeGauge** | `SpbeGauge.js` | Gauge/indikator indeks SPBE dengan domain scores |
|| **Rekomendasi** | `Rekomendasi.js` | Timeline rekomendasi prioritas (Q3 2026 — 2028) |

## Local Contracts

### Layout Component
- **Props**: `{ children }`
- **Structure**: `<Header/> → <main>{children}</main> → <Footer/>`
- **Import**: Semua halaman via `pages/_app.js` wrap dengan Layout

### OPDTable
- **Props**: `{ data: instansi[], title: string }`
- **Features**: Search/filter by nama OPD
- **Data structure**: `{ id, nama, singkatan, level, urusan, alamat, website }`

### ProbisSection
- **Props**: `{ data: { level0, level1, level2 } }`
- **Display**: Accordion/card untuk setiap level PPB

### SpbeGauge
- **Props**: `{ data: { indeks, kategori, domain } }`
- **Display**: Gauge chart + bar chart per domain

### Rekomendasi
- **Props**: `{ data: rekomendasi[] }`
- **Display**: Timeline horizontal dengan priority badges

## Work Guidance
- Semua komponen adalah **default export** function component
- Gunakan CSS class dari `styles/globals.css` — prefix `.gov-` untuk government theme
- Props validation: minimal `defaultProps` atau inline fallback
- State lokal untuk UI interaction (mobile menu, search, accordion)
- JANGAN import CSS modules — semua styling via global CSS classes

## Verification
- `npm run build` — harus sukses
- Setiap komponen harus render tanpa error dengan props minimal

## Child DOX Index

Tidak ada child — leaf node. Semua komponen flat di direktori ini.
