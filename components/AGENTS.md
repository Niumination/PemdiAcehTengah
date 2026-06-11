# components/ — DOX

## Purpose

React component library — reusable UI building blocks. All components-driven, props untuk data.

## Ownership — 12 Komponen

| Komponen | File | Fungsi | Status |
|----------|------|--------|--------|
| **Header** | `Header.js` | Navigasi utama, mobile hamburger menu, GOV.UK-style | ✅ Active |
| **Footer** | `Footer.js` | Footer dengan kredit & link | ✅ Active |
| **Layout** | `Layout.js` | Wrapper: Header + main + Footer — digunakan di `_app.js` | ✅ Active |
| **OPDTable** | `OPDTable.js` | Tabel interaktif daftar OPD — search, filter, sort | ✅ Active (index.js) |
| **ProbisSection** | `ProbisSection.js` | Peta Proses Bisnis visual — Level 0, 1, 2 | ✅ Active (index.js) |
| **SpbeGauge** | `SpbeGauge.js` | Gauge/indikator indeks SPBE dengan domain scores | ✅ Active (index.js) |
| **DataBadge** | `DataBadge.js` | Badge statistik (ASN, OPD) untuk hero section | ✅ Active (index.js, pemdi.js) |
| **DetailModal** | `DetailModal.js` | Modal overlay untuk detail aspek/indikator | ✅ Active (pemdi.js, probis.js) |
| **Rekomendasi** | `Rekomendasi.js` | Timeline rekomendasi prioritas (Q3 2026 — 2028) | ✅ Active (index.js) |
| **SlaBadge** | `SlaBadge.js` | Badge SLA visual dengan progress bar | ✅ Active (layanan.js) |
| **LaporWidget** | `LaporWidget.js` | FAB "Lapor / Saran" — form + tracking ID | ✅ Active (Layout.js) |
| **ScrollTop** | `ScrollTop.js` | Tombol scroll-to-top muncul saat scroll | ✅ Active (Layout.js) |

## Local Contracts

### Active Components

#### Layout (`Layout.js`)
- **Props**: `{ children }`
- **Structure**: `<Header/> → <main>{children}</main> → <Footer/>`
- **Import**: Semua halaman via `pages/_app.js` wrap dengan Layout

#### OPDTable (`OPDTable.js`)
- **Props**: `{ data: instansi[], title: string }`
- **Features**: Search/filter by nama OPD
- **Data structure**: `{ id, nama, singkatan, level, urusan, alamat, website }`

#### ProbisSection (`ProbisSection.js`)
- **Props**: `{ data: { level0, level1, level2 } }`
- **Display**: Accordion/card untuk setiap level PPB
- ⚠️ **Data Level 2 sudah 78 proses real** — 47/52 OPD tercakup ✅

#### SpbeGauge (`SpbeGauge.js`)
- **Props**: `{ data: { indeks, kategori, domain } }`
- **Display**: Gauge chart + bar chart per domain

#### DetailModal (`DetailModal.js`)
- **Props**: `{ aspek, onClose }`
- **Style**: 100% inline styles (reason: `styled-jsx` unreliable under Next.js 14 Strict Mode + conditional mount)
- **Content**: Menampilkan sub-indikator + penanggung jawab (PIC) dari `pemdi.json`

#### Rekomendasi (`Rekomendasi.js`)
- **Props**: `{ data: rekomendasi[] }`
- **Display**: Timeline horizontal dengan priority badges

#### SlaBadge (`SlaBadge.js`)
- **Props**: `{ sla, compact, showLabel, size }`
- **Color thresholds**: ≥90% hijau, ≥80% oranye, <80% merah
- **Used in**: `pages/layanan.js`

#### DataBadge (`DataBadge.js`)
- **Props**: `{ label, value, icon }`
- **Display**: Stat card kecil untuk hero section

## Styling Guidance

Dua pendekatan styling yang digunakan:

| Approach | Kapan Pakai | Contoh |
|----------|-------------|--------|
| **CSS Classes** (`styles/globals.css`) | Layout, typography, warna dasar | `className="hero"` |
| **Inline styles** | Komponen kondisional (modal, popup, detail panel) | `style={{ color: '#222' }}` |

⚠️ **PENTING**: `styled-jsx` dihindari total di komponen kondisional Next.js 14 (terbukti gagal saat mount/unmount + Strict Mode + animation). Gunakan 100% inline styles sebagai gantinya.

## Work Guidance
- Semua komponen adalah **default export** function component
- Props validation: minimal `defaultProps` atau inline fallback
- State lokal untuk UI interaction (mobile menu, search, accordion)
- JANGAN import CSS modules — inline styles untuk conditional, CSS classes untuk static
- `npm run build` — harus sukses

## Child DOX Index
Tidak ada child — leaf node. Semua komponen flat di direktori ini.
