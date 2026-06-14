# styles/ — DOX

## Purpose
Global CSS — satu file sumber untuk seluruh tampilan portal. **v3 — Gayo Civic Digital.**

## Ownership
- `globals.css` — Satu-satunya file CSS. ~39 KB / 799 baris. Semua styling di sini.
- **TIDAK ada file CSS lain.** No module CSS, no Tailwind. Period.

## Local Contracts

### Design Tokens — Gayo Civic Digital

| Token | CSS Variable | Value | Penggunaan |
|-------|-------------|-------|------------|
| **Primary** | `--primary` | `#004098` | Government identity, header, footer, badges |
| **Lake Cyan** | `--lake-cyan` | `#0ea5a4` | Accent, glow, highlights, progress bar |
| **Gayo Gold** | `--gayo-gold` | `#c79a3a` | Award hero, premium badge, achievement |
| **Coffee Brown** | `--coffee-brown` | `#6b4423` | Kopi Gayo — secondary accent |
| **Forest Green** | `--forest-green` | `#15803d` | OK/Success semantic, SLA ≥90% |
| **Warning Amber** | `--warning-amber` | `#b45309` | Warning semantic, SLA ≥80% |
| **Danger Red** | `--danger-red` | `#b91c1c` | Error/danger semantic, SLA <80% |
| **Ink** | `--ink` | `#0f172a` | Primary text |
| **Surface** | `--surface` | `#ffffff` | Card/container background |

### Hero Gradient — Award-Level
```
--hero-award-gradient:
  radial-gradient(900px 420px at 88% -10%, rgba(14,165,164,.35), transparent 65%),
  radial-gradient(620px 360px at 8% 8%, rgba(199,154,58,.18), transparent 60%),
  linear-gradient(135deg, #052a52 0%, #073b6e 48%, #004098 100%);
```

### CSS Architecture
- **v3 — Gayo Civic Digital** (replaced GOV.UK v2)
- **Reset**: Box-sizing, margin/padding reset
- **Typography**: Inter via Google Fonts `@import`, JetBrains Mono untuk code
- **Layout**: `.container` max-width `1180px` centered, flexbox/grid
- **Components**: Class names descriptive, no strict prefix (gov- untuk legacy)
- **Hero section**: Full-width, award-gradient background
- **Cards**: White background, `--sh` shadow, `--r` radius (16px)
- **Responsive**: Mobile-first breakpoints @768px, @1024px, @1280px
- **Animations**: 200ms ease transitions, smooth scroll, fade-in
- **Dark theme**: Built-in via `@media (prefers-color-scheme: dark)` dengan palette gelap

### Component Class Map
| Komponen | CSS Classes |
|----------|-------------|
| Header | `.gov-header`, `.gov-header-inner`, `.gov-nav`, `.mobile-menu-btn`, `.mobile-menu-overlay` |
| Footer | `.gov-footer-wrapper`, `.gov-footer`, `.footer-main`, `.footer-gov` |
| OPD Table | `.opd-table`, `.opd-table-search`, `.table-container`, `.filter-section` |
| SPBE Gauge | `.spbe-section`, `.gauge-container`, `.spbe-card`, `.domain-bar` |
| Modal | `.modal-overlay`, `.modal-content`, `.modal-close` |
| AwardHero | `.award-hero`, `.award-hero-badge`, `.award-title`, `.award-subtitle`, `.award-stats`, `.cta-group` |
| QuickActions | `.quick-actions`, `.quick-action-card`, `.qa-icon`, `.qa-label`, `.qa-desc` |
| ServiceCard | `.service-card`, `.service-icon`, `.service-name`, `.service-desc`, `.sla-badge` |
| ServiceFinder | `.service-finder`, `.sf-search`, `.sf-tags`, `.sf-tag`, `.sf-tag-active`, `.sf-results` |
| TopographicBackdrop | `.topo-bg`, `.topo-overlay` |
| LaporanStatus | `.lapor-status-root`, `.lapor-card`, `.lapor-timeline`, `.lapor-step`, `.step-dot`, `.step-dot-active`, `.step-dot-complete`, `.step-label` |
| Toast | `.toast-root`, `.toast-inner`, `.toast-success`, `.toast-error` |
| ProgressBarVisual | `.progress-root`, `.progress-bar`, `.progress-fill`, `.progress-label` |
| TimelineRoadmap | `.timeline-root`, `.timeline-item`, `.tl-year`, `.tl-dot`, `.tl-dot-complete`, `.tl-dot-active`, `.tl-dot-planned`, `.tl-content` |

### Styling Strategy
Semua komponen baru menggunakan **inline styles + CSS variables** (styled-jsx dihindari). CSS classes di atas bersifat deklaratif/semantic pada DOM. Hanya `@keyframes` untuk float animation AwardHero yang ditambahkan via `<style>` tag di komponen.

## Key Changes v2 → v3 (Gayo Civic Digital)
| Area | v2 (GOV.UK) | v3 (Gayo Civic Digital) |
|------|-------------|------------------------|
| Primary | `#1d70b8` (GOV.UK blue) | `#004098` (deep blue) |
| Accent | `#5694ca` (light blue) | `#0ea5a4` (lake cyan) |
| Premium | — | `#c79a3a` (Gayo gold) |
| Hero gradient | Solid blue | Award gradient multi-layer |
| Card radius | 4px | 16px (rounded) |
| Shadow | Minimal | Layered (`--sh`, `--sh-lg`) |
| Max width | 1200px | 1180px |
| Font import | `@import` Google Fonts | `@import` Google Fonts + fallback stack |
| Dark mode | ❌ Tidak ada | ✅ Built-in |

## Work Guidance
- **JANGAN buat file CSS baru** — semua di `globals.css`
- **JANGAN gunakan Tailwind/PostCSS** — proyek pure CSS
- Class names: gunakan deskriptif, konsisten dengan komponen
- Mobile-first: tulis style mobile dulu, lalu `@media (min-width: 768px)`
- Warna: gunakan CSS variable, jangan hardcode hex
- Spacing: gunakan `--space-*` variables. Base 16px.
- Container padding: 1rem mobile, 2rem desktop
- Animasi: prefer `--transition` variable untuk konsistensi
- **Dark theme**: setiap warna baru harus punya pasangan dark mode

## Verification
- `npm run build` — harus sukses
- Visual: cek hero award, mobile menu, OPD table di hp/tablet/desktop
- Dark mode: cek di hp dengan dark theme enabled
- No flash of unstyled content
- CSS variables semua terdefinisi (cek browser DevTools → Computed)

## Child DOX Index
Tidak ada child — leaf node. Single file.
