# components/ — DOX

## Purpose
React component library — reusable UI building blocks, props-driven.

## Ownership — 20 Komponen Aktif

*(DOX pass hardening 2026-09-17: 22 komponen/lib mati telah dihapus — Accordion, AwardHero, DataBadge, Explainer, Header, LaporanStatus, Modal, PPBChain, PemdiCalculator, ProbisSection, ProgressBarVisual, QuickActions, Rekomendasi, RekomendasiTracker, Section, Stepper, TimelineRoadmap, Toast, motif/KerawangCard, motif/KerawangHero. Tabel lama yang menyebut `Layout.js`/`ExpandablePanel.js` tidak akurat — file tersebut sudah tidak ada.)*

| Komponen | File | Fungsi | Dipakai di |
|----------|------|--------|------------|
| **AppShell** | `AppShell.js` | Shell global — gov-strip marquee, sidebar, topbar, breadcrumb, scroll-reveal, ⌘K → /cari | `_app.js` |
| **Sidebar** | `Sidebar.js` | Navigasi kiri (brand crest SVG + menu grup) | `AppShell.js` |
| **Footer** | `Footer.js` | Footer — regulasi, kontak, SP4N, lisensi MIT | `AppShell.js` |
| **ThemeToggle** | `ThemeToggle.js` | Toggle dark/light (localStorage `theme`) | `AppShell.js` |
| **ScrollTop** | `ScrollTop.js` | Tombol scroll-to-top | `AppShell.js` |
| **LaporWidget** | `LaporWidget.js` | FAB "Lapor/Saran" — modal form + tracking, focus-trap, submit `/api/lapor` | `AppShell.js`, `lapor.js` |
| **RatingWidget** | `RatingWidget.js` | Rating ★ per halaman — submit `/api/feedback` | `AppShell.js` |
| **SkmPrompt** | `SkmPrompt.js` | Toast ajakan survei SKM setelah 3 pageview (sessionStorage) | `_app.js` |
| **Sp4nBanner** | `Sp4nBanner.js` | Banner/link SP4N LAPOR nasional (variant banner/footer) | `lapor.js`, `Footer.js` |
| **OPDTable** | `OPDTable.js` | Tabel OPD interaktif — search, filter urusan/level, sort ASN | `index.js`, `opd/index.js` |
| **SpbeGauge** | `SpbeGauge.js` | Donut gauge indeks SPBE + domain | `index.js`, `spbe.js` |
| **ServiceFinder** | `ServiceFinder.js` | Pencarian & filter layanan — search, tag kategori, hasil real-time | `index.js`, `layanan.js` |
| **ServiceCard** | `ServiceCard.js` | Kartu layanan — waktu, biaya, persyaratan, SLA badge | `ServiceFinder.js` |
| **SlaBadge** | `SlaBadge.js` | Badge SLA visual | `ServiceCard.js`, dll. |
| **DashboardSKM** | `DashboardSKM.js` | Dashboard hasil SKM + rating — fetch `/api/skm/stats` | `index.js`, `dashboard-kepuasan.js` |
| **DetailModal** | `DetailModal.js` | Modal detail aspek/indikator Pemdi | `pemdi.js`, `probis.js` |
| **TopographicBackdrop** | `TopographicBackdrop.js` | SVG backdrop topografi dekoratif | `index.js`, `pemdi.js` |
| **GlossaryTooltip** | `GlossaryTooltip.js` | Tooltip definisi istilah (data/glosarium.json) | `index.js`, `faq.js`, `glosarium.js` |
| **TrackerStatus** | `TrackerStatus.js` | Stepper status laporan (baru→diproses→selesai) | `lapor.js` |
| **motif/KerawangMotifs** | `motif/KerawangMotifs.js` | Motif Gayo (Emun, Ulen, Rante, Tapak, Puter, Pucuk Rebung, divider, marquee budaya) | lintas halaman |

## Local Contracts

### AppShell (`AppShell.js`)
- **Props**: `{ children }`
- **Struktur**: gov-strip → sidebar + spacer → topbar (breadcrumb) → `<main id="main-content">{children}</main>` → footer
- **Skip-link** `#main-content`; scroll-reveal `[data-reveal]` via IntersectionObserver (hormati prefers-reduced-motion)

### LaporWidget (`LaporWidget.js`)
- **Props**: `{ externalOpen, onExternalClose, hideFab }`
- **Fitur**: FAB, modal form (kategori/pesan/kontak), tracking by ID, focus-trap + Escape

### DetailModal (`DetailModal.js`)
- **Props**: `{ title, children, onClose, isOpen }`

## Kontrak Mobile (19 Sep 2026)

- **ServiceCard** — di `≤768px` kartu tampil **satu kolom** (desktop: baris 3 kolom). Deskripsi dibatasi 2 baris dan **dilepas otomatis** saat kartu dibuka (`aria-expanded="true"`) — jangan menambah clamp tanpa mekanisme buka, agar teks penuh tidak hilang.
- **SpbeGauge / SlaBadge** — bar kemajuan memakai `transform: scaleX()` (bukan animasi `width`) supaya tidak memicu layout. DashboardSKM sengaja dibiarkan `width` karena label persennya diposisikan terhadap lebar bar.
- **Tombol bukti di `/pemdi`** memakai kelas `.bukti-act` (target sentuh ≥44px di mobile) + `aria-label`.

## Status
🟢 **DOX Clean** — 20/20 komponen dalam tabel ini terverifikasi diimpor minimal satu halaman/komponen aktif (cek: grep impor per file).
