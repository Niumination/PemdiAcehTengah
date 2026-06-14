# components/ — DOX

## Purpose
React component library — reusable UI building blocks. All components-driven, props untuk data.

## Ownership — 30 Komponen Real

### Komponen Sebelumnya (20)

| Komponen | File | Fungsi | Status |
|----------|------|--------|--------|
| **Header** | `Header.js` | Navigasi utama, mobile hamburger menu | ✅ |
| **Footer** | `Footer.js` | Footer dengan kredit & link | ✅ |
| **Layout** | `Layout.js` | Wrapper: Header + main + Footer — via `_app.js` | ✅ |
| **AppShell** | `AppShell.js` | App shell — sidebar + header terintegrasi | ✅ |
| **Sidebar** | `Sidebar.js` | Sidebar navigasi kiri | ✅ |
| **OPDTable** | `OPDTable.js` | Tabel interaktif daftar OPD — search, filter, sort | ✅ |
| **ProbisSection** | `ProbisSection.js` | Peta Proses Bisnis visual — Level 0, 1, 2 | ✅ |
| **SpbeGauge** | `SpbeGauge.js` | Gauge/indikator indeks SPBE dengan domain scores | ✅ |
| **DataBadge** | `DataBadge.js` | Badge statistik (ASN, OPD) untuk hero section | ✅ |
| **DetailModal** | `DetailModal.js` | Modal overlay untuk detail aspek/indikator | ✅ |
| **Rekomendasi** | `Rekomendasi.js` | Timeline rekomendasi prioritas (Q3 2026—2028) | ✅ |
| **SlaBadge** | `SlaBadge.js` | Badge SLA visual dengan progress bar | ✅ |
| **LaporWidget** | `LaporWidget.js` | FAB "Lapor / Saran" — form + submit ke `/api/lapor` | ✅ |
| **ScrollTop** | `ScrollTop.js` | Tombol scroll-to-top muncul saat scroll | ✅ |
| **Section** | `Section.js` | Section wrapper dengan judul | ✅ |
| **Explainer** | `Explainer.js` | Komponen penjelasan/info box | ✅ |
| **Accordion** | `Accordion.js` | Accordion expand/collapse — FAQ | ✅ |
| **Stepper** | `Stepper.js` | Langkah-langkah bertahap (timeline) | ✅ |
| **GlossaryTooltip** | `GlossaryTooltip.js` | Tooltip definisi istilah | ✅ |
| **ThemeToggle** | `ThemeToggle.js` | Toggle dark/light mode | ✅ |
| **Modal** | `Modal.js` | Modal dialog umum | ✅ |

### Komponen Baru (10 — Sprint Redesign Award Level)

| Komponen | File | Fungsi | Status | Digunakan di |
|----------|------|--------|--------|-------------|
| **AwardHero** | `AwardHero.js` | Hero premium award-level dengan Gayo Civic Digital gradient, badge award, CTA buttons, motif Gayo separator | ✅ | `pages/index.js` |
| **QuickActions** | `QuickActions.js` | 4 action cards (SKM, Lapor, Cari, Tutorial) dengan ikon, deskripsi, navigasi | ✅ | `pages/index.js` |
| **ServiceCard** | `ServiceCard.js` | Kartu layanan publik — nama, kategori badge, deskripsi truncate, waktu, SLA badge, expand on click | ✅ | `pages/layanan.js` (via ServiceFinder) |
| **ServiceFinder** | `ServiceFinder.js` | Pencarian & filter layanan interaktif — search bar, tag filter kategori, hasil real-time via ServiceCard, empty state | ✅ | `pages/layanan.js` |
| **TopographicBackdrop** | `TopographicBackdrop.js` | SVG background topografi dekoratif — multi-frequency sine/cosine waves, gradient stroke, IA-7 hidden | ✅ | `pages/index.js`, `pages/pemdi.js` |
| **LaporanStatus** | `LaporanStatus.js` | Tracking status laporan warga — fetch `/api/lapor?id=xxx`, 3-step timeline, admin response, loading/error states | ✅ | `pages/index.js` |
| **Toast** | `Toast.js` | Notifikasi temporary — auto-dismiss 3 detik, success/error variant, fixed bottom-right | ✅ | Komponen independen (siap pakai) |
| **ProgressBarVisual** | `ProgressBarVisual.js` | Progress bar animasi — width transition 1s ease, CSS variable color, glint effect, showLabel toggle | ✅ | `pages/pemdi.js` |
| **TimelineRoadmap** | `TimelineRoadmap.js` | Timeline roadmap vertikal — dot+garis+konten, status indicators ✅🔄⏳, sorted by tahun | ✅ | `pages/pemdi.js` |

## Local Contracts

### Layout (`Layout.js`)
- **Props**: `{ children }`
- **Structure**: `<Header/> → <main>{children}</main> → <Footer/>`
- **Import**: Semua halaman via `pages/_app.js` wrap dengan Layout

### LaporWidget (`LaporWidget.js`)
- **Fitur**: FAB floating, modal form laporan, submit ke `/api/lapor`, ID tracking
- **Update P1**: ✅ Live tracking stepper setelah submit (GET /api/lapor?id=xxx)

### DetailModal (`DetailModal.js`)
- **Props**: `{ title, children, onClose, isOpen }`
- **Style**: Inline styles (styled-jsx unreliable di Next.js 14 + Strict Mode)

## Local Contracts
| Approach | Kapan Pakai | Contoh |
|----------|-------------|--------|
| **CSS Classes** (`styles/globals.css`) | Layout, typography, warna dasar | `className="hero-section"` |
| **Inline styles** | Komponen kondisional (modal, popup, detail panel) | `style={{ color: 'var(--gov-blue)' }}` |

⚠️ **styled-jsx** dihindari total di Next.js 14 — terbukti gagal saat conditional mount + Strict Mode.

## Work Guidance
- Semua komponen adalah **default export** function component
- Props validation: minimal fallback inline atau default parameters
- State lokal untuk UI interaction (mobile menu, search, accordion, modal)
- Gunakan CSS variables dari `styles/globals.css`
- JANGAN import CSS modules atau file CSS eksternal

## Child DOX Index
Tidak ada child — leaf node. Semua komponen flat di direktori ini.
