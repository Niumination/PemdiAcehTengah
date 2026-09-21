# components/ — DOX

## Purpose
React component library — reusable UI building blocks, props-driven.

## Ownership — 29 Komponen Aktif (20 + 7 Sprint UI/UX + 2 beranda/ 21 Sep 2026)

> **Mode internal aktif** (`lib/modeSitus.PUBLIK_AKTIF === false` secara default): komponen bertanda 🌐 hanya dirender bila `NEXT_PUBLIC_PERSONA_PUBLIK=on` — LaporWidget, RatingWidget, SkmPrompt, Sp4nBanner, ServiceFinder, ServiceCard, DashboardSKM, TrackerStatus, PersonaSwitcher, publik/*, beranda/BerandaPublik. Jangan dihapus.

*(DOX pass hardening 2026-09-17: 22 komponen/lib mati telah dihapus — Accordion, AwardHero, DataBadge, Explainer, Header, LaporanStatus, Modal, PPBChain, PemdiCalculator, ProbisSection, ProgressBarVisual, QuickActions, Rekomendasi, RekomendasiTracker, Section, Stepper, TimelineRoadmap, Toast, motif/KerawangCard, motif/KerawangHero. Tabel lama yang menyebut `Layout.js`/`ExpandablePanel.js` tidak akurat — file tersebut sudah tidak ada.)*

| Komponen | File | Fungsi | Dipakai di |
|----------|------|--------|------------|
| **AppShell** | `CatatanTujuan.js` | Kotak "Untuk siapa dan untuk apa kokpit ini" — catatan pemilik (bahasa baku PermenPANRB 8/2026 → konteks Aceh Tengah, untuk Tim Asesor Internal). Export `TUJUAN_KOKPIT` (teks tunggal). Prop `compact`. Dipakai `/pemdi`, `/modul-indikator`, `/requirement` | — |
| `AppShell.js` | Shell global — gov-strip running text, sidebar, topbar (brand ringkas `.topbar-brand` + toggle `aria-expanded` + PersonaSwitcher compact di luar beranda), breadcrumb, BottomNav (ponsel), ⌘K → /cari | `_app.js` |
| **BottomNav** | `BottomNav.js` | Bottom nav bar ponsel (≤768 px): Beranda, Layanan, Lapor (event `pemdi:open-lapor`), Kinerja (`/?view=asesor`), Menu (buka drawer) | `AppShell.js` |
| **PersonaSwitcher** | `persona/PersonaSwitcher.js` | Segmented control 2 persona (tablist ARIA). Di beranda `router.replace` shallow `?view=`; di halaman lain tautan ke beranda. Prop `compact` | `index.js`, `AppShell.js` |
| **usePersona** | `persona/usePersona.js` | Hook: persona dari `?view=` → fallback localStorage `pemdi:persona` → default publik; `hydrated` | `index.js`, `PersonaSwitcher` |
| **HeroPublik** | `publik/HeroPublik.js` | Hero Mode A: 1 pertanyaan + search besar (⌘K) + 5 kata kunci `lib/sektorLayanan.KATA_KUNCI_POPULER` | `index.js` |
| **SektorLayanan** | `publik/SektorLayanan.js` | 6 kartu sektor + panel accordion inline daftar layanan (SlaBadge) | `index.js` |
| **KpiCards** | `asesor/KpiCards.js` | 4 kartu KPI Mode B (Pemdi, SPBE, bukti Tahap 1 dengan bar segmen, 52 OPD) | `index.js` |
| **BerandaAsesor** | `beranda/BerandaAsesor.js` | Panel beranda Mode B (hero kokpit, KpiCards, gauge SPBE + AspekAccordion, PPB, OPDTable) — satu-satunya panel pada mode internal | `index.js` |
| **BerandaPublik** 🌐 | `beranda/BerandaPublik.js` | Panel beranda Mode A; di-`require` kondisional (build-time) agar tidak ikut bundel internal | `index.js` |
| **AspekAccordion** | `asesor/AspekAccordion.js` | Accordion 7 aspek → indikator + chip status bukti (ok/warn/muted/gray) | `index.js` |
| **Sidebar** | `Sidebar.js` | Navigasi kiri — **tertutup default** (prop `collapsed` dihormati sejak SSR → tanpa kedip), drawer di ponsel, Esc menutup, `id="sidebar-nav"` | `AppShell.js` |
| **Footer** | `Footer.js` | Footer — regulasi, kontak, SP4N, lisensi MIT | `AppShell.js` |
| **ThemeToggle** | `ThemeToggle.js` | Toggle dark/light (localStorage `theme`) | `AppShell.js` |
| **ScrollTop** | `ScrollTop.js` | Tombol scroll-to-top | `AppShell.js` |
| **LaporWidget** | `LaporWidget.js` | FAB "Lapor/Saran" — modal form + tracking, focus-trap, submit `/api/lapor` | `AppShell.js`, `lapor.js` |
| **RatingWidget** | `RatingWidget.js` | Rating ★ per halaman — submit `/api/feedback` | `AppShell.js` |
| **SkmPrompt** | `SkmPrompt.js` | Toast ajakan survei SKM setelah 3 pageview (sessionStorage) | `_app.js` |
| **Sp4nBanner** | `Sp4nBanner.js` | Banner/link SP4N LAPOR nasional (variant banner/footer) | `lapor.js`, `Footer.js` |
| **OPDTable** | `OPDTable.js` | Tabel 52 OPD: cari + filter level, paginasi 12, toggle Tabel/Grid (desktop), stacked cards otomatis ≤768 px (`data-th`). Membaca `singkat`/`level`/`urusan` data/opd.json | `index.js`, `opd/index.js` |
| **SpbeGauge** | `SpbeGauge.js` | Donut gauge indeks SPBE + domain | `index.js`, `spbe.js` |
| **ServiceFinder** | `ServiceFinder.js` | Pencarian & filter layanan — search, tag kategori, hasil real-time | `index.js`, `layanan.js` |
| **ServiceCard** | `ServiceCard.js` | Kartu layanan — waktu, biaya, persyaratan, SLA badge | `ServiceFinder.js` |
| **SlaBadge** | `SlaBadge.js` | Badge SLA visual | `ServiceCard.js`, dll. |
| **DashboardSKM** | `DashboardSKM.js` | Dashboard hasil SKM + rating — fetch `/api/skm/stats` | `index.js`, `dashboard-kepuasan.js` |
| **DetailModal** | `DetailModal.js` | Modal detail aspek/indikator Pemdi | `pemdi.js`, `probis.js` |
| **GlossaryTooltip** | `GlossaryTooltip.js` | Tooltip definisi istilah (data/glosarium.json) | `index.js`, `faq.js`, `glosarium.js` |
| **TrackerStatus** | `TrackerStatus.js` | Stepper status laporan (baru→diproses→selesai) | `lapor.js` |
| **motif/KerawangMotifs (7 ekspor: PuterTali, PucukRebung, Rante, Pagar, Ulen, Tapak, KerawangDivider — MotifEmun/MotifBackground/MarqueeBudaya dihapus 21 Sep 2026)** | `motif/KerawangMotifs.js` | Motif Gayo (Emun, Ulen, Rante, Tapak, Puter, Pucuk Rebung, divider, marquee budaya) | lintas halaman |

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
