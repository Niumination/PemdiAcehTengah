# styles/ — DOX

## Purpose

Global CSS — satu file sumber untuk seluruh tampilan portal.

## Ownership

- `globals.css` — Satu-satunya file CSS. ~20 KB. Semua styling di sini.

## Local Contracts

### Design Tokens
| Token | Value |
|-------|-------|
| **Primary** | `#1d70b8` (GOV.UK blue) |
| **Secondary** | `#003078` (dark blue) |
| **Accent** | `#5694ca` (light blue) |
| **Background** | `#ffffff` |
| **Text** | `#0b0c0c` |
| **Font** | `Inter` (sans-serif) |
| **Max width** | `1200px` container |

### CSS Architecture
- **Reset**: Box-sizing, margin/padding reset
- **Typography**: Inter via Google Fonts import
- **Layout**: `.container` max-width centered, flexbox/grid
- **Components class prefix**: `.gov-` (gov-header, gov-nav, gov-footer, gov-table)
- **Hero section**: Full-width, blue gradient background
- **Cards**: White background, border, shadow
- **Responsive**: Mobile-first breakpoints @768px, @1024px
- **Animations**: Minimal — hover transitions, smooth scroll

### Component Class Map
| Komponen | CSS Classes |
|----------|-------------|
| Header | `.gov-header`, `.gov-header-inner`, `.gov-header-logo`, `.gov-nav`, `.mobile-menu-btn` |
| Footer | `.gov-footer` |
| Hero | `.hero`, `.hero-content`, `.hero-badge` |
| Section | `.section`, `.section-title` |
| OPD Table | `.opd-table`, `.opd-table-search`, `.table-container` |
| SPBE Gauge | `.spbe-section`, `.gauge-container`, `.spbe-card` |
| Rekomendasi | `.rekomendasi-section`, `.timeline` |
| Cards | `.card`, `.card-grid` |

## Work Guidance
- JANGAN buat file CSS baru — semua di globals.css
- Tambah class di globals.css dengan prefix `.gov-` untuk government components
- Mobile-first: tulis style mobile dulu, lalu `@media (min-width: 768px)`
- Warna biru GOV.UK: primary `#1d70b8`, hover `#003078`
- Spacing gunakan `rem` — base 16px. Container padding: 1rem mobile, 2rem desktop

## Verification
- `npm run build` — harus sukses
- Visual: cek halaman utama dan requirement di hp/tablet/desktop
- No flash of unstyled content

## Child DOX Index

Tidak ada child — leaf node. Single file.
