# components/ — DOX

## Purpose
React component library — reusable UI building blocks, props-driven. Seluruh komponen melayani **persona internal Pemdi**.

## Ownership — 17 Komponen Aktif (reposisi 22 Sep 2026)

> **Dihapus 22 Sep 2026** (arsip tag `arsip/persona-publik-2026-09`): LaporWidget, RatingWidget, SkmPrompt, Sp4nBanner, ServiceFinder, ServiceCard, SlaBadge, DashboardSKM, TrackerStatus, persona/PersonaSwitcher, persona/usePersona, publik/HeroPublik, publik/SektorLayanan, beranda/BerandaPublik. Jangan direstorasi ke cabang utama tanpa keputusan pemilik.

*(DOX pass hardening 2026-09-17: 22 komponen/lib mati lain telah dihapus — Accordion, AwardHero, DataBadge, Explainer, Header, LaporanStatus, Modal, PPBChain, PemdiCalculator, ProbisSection, ProgressBarVisual, QuickActions, Rekomendasi, RekomendasiTracker, Section, Stepper, TimelineRoadmap, Toast, motif/KerawangCard, motif/KerawangHero.)*

| Komponen | File | Fungsi | Dipakai di |
|----------|------|--------|------------|
| **AppShell** | `AppShell.js` | Shell global — gov-strip running text (marquee dipertahankan), sidebar tertutup default + toggle topbar, breadcrumb `PETA_JUDUL` (rute internal saja), CTA topbar "Indikator Pemdi" → `/pemdi`, `<main id="main-content">`, footer, ScrollTop, ThemeToggle. Tidak ada widget lapor/rating/persona sejak 22 Sep 2026 | `_app.js` |
| **CatatanTujuan** | `CatatanTujuan.js` | Kotak "Untuk siapa dan untuk apa dashboard ini" — catatan pemilik (bahasa baku PermenPANRB 8/2026 → konteks Aceh Tengah, untuk Tim Asesor Internal). Export `TUJUAN_KOKPIT` (teks tunggal). Prop `compact`. Dipakai `/pemdi`, `/modul-indikator`, `/requirement` | — |
| **BottomNav** | `BottomNav.js` | Bottom nav ponsel (≤768 px), 5 tab internal: Ringkasan `/`, Indikator `/pemdi`, Modul `/modul-indikator`, Draf Bukti `/requirement`, Menu (buka sidebar via `onOpenMenu`) | `AppShell.js` |
| **KpiCards** | `asesor/KpiCards.js` | 4 kartu KPI Mode B (Pemdi, SPBE, bukti Tahap 1 dengan bar segmen, 52 OPD) | `index.js` |
| **BerandaAsesor** | `beranda/BerandaAsesor.js` | Beranda internal (wrapper `#beranda-internal`; hero "Dashboard Pemerintah Digital", KpiCards, gauge SPBE + AspekAccordion, PPB, OPDTable) — satu-satunya panel pada mode internal | `index.js` |
| **AspekAccordion** | `asesor/AspekAccordion.js` | Accordion 7 aspek → indikator + chip status bukti (ok/warn/muted/gray) + chip `.ind-fokus` "✅ L1 → 🎯 L2" (field `fokus` dari getStaticProps `index.js`) | `index.js` |
| **LevelFokus** | `asesor/LevelFokus.js` | (21 Sep 2026) Pembungkus daftar bukti/kriteria per level: level **dicapai** (semua butir diterima asesor) + level **berikut** terbuka default, level lain tertutup — klik header untuk buka; tombol "Buka semua level / Kembali ke fokus"; state lokal per indikator (tanpa localStorage). Render isi via `children(level, {peran})`; `layout` grid (/pemdi) atau stack (/modul-indikator). Ekspor tambahan `RingkasFokus`. CSS `.lvfokus-*` di globals.css. Tidak mengubah data | `pemdi.js`, `modul-indikator.js` |
| **CatatanMandiri** | `asesor/CatatanMandiri.js` | (21 Sep 2026) `CatatanButir` — kartu lipat 📝 di bawah butir revisi/level-berikut: ringkas, rujukan (judul → tautan PDF lokal/JDIH, bagian, **hal.**, tag `pindai`/`JDIH`), checklist kebutuhan, PJ, tombol **📋 Salin** (teks siap tempel ke eval.spbe.go.id). `EksporCatatan` — bilah per indikator: jumlah butir, **Salin semua · ⬇️ DOCX · 🖨️ Cetak/PDF** (prop `compact` utk /modul-indikator). Data `b.catatan_mandiri`; tanpa localStorage/pustaka; CSS `.cm-*` di globals.css | `pemdi.js`, `modul-indikator.js` |
| **Sidebar** | `Sidebar.js` | Navigasi kiri — **tertutup default** (prop `collapsed` dihormati sejak SSR → tanpa kedip), drawer di ponsel. Grup: Ringkasan · **Kinerja & Evaluasi** (Indikator Pemdi, Modul Indikator, Draf Bukti, SPBE, ProBis) · **Bukti & Rujukan** (OPD, Glosarium, Cari). Tanpa quick-CTA lapor | `AppShell.js` |
| **Footer** | `Footer.js` | Footer — brand Dashboard Pemdi, navigasi internal (Indikator, Modul, Draf Bukti, OPD, Glosarium), regulasi, kontak, lisensi MIT; Kerawang divider | `AppShell.js` |
| **ThemeToggle** | `ThemeToggle.js` | Toggle dark/light (localStorage `theme`) | `AppShell.js` |
| **ScrollTop** | `ScrollTop.js` | Tombol scroll-to-top | `AppShell.js` |
| **OPDTable** | `OPDTable.js` | Tabel 52 OPD: cari + filter level, paginasi 12, toggle Tabel/Grid (desktop), stacked cards ≤768 px. Prop `butirCountMap` (id/nama → jumlah butir Pemdi yang PJ-nya OPD tsb) → kolom **"Butir Pemdi"** | `index.js` (via BerandaAsesor), `opd/index.js` |
| **SpbeGauge** | `SpbeGauge.js` | Donut gauge indeks SPBE + domain | `index.js`, `spbe.js` |
| **DetailModal** | `DetailModal.js` | Modal detail aspek/indikator Pemdi | `pemdi.js`, `probis.js` |
| **GlossaryTooltip** | `GlossaryTooltip.js` | Tooltip definisi istilah (data/glosarium.json) | `index.js`, `glosarium.js` |
| **motif/KerawangMotifs (7 ekspor: PuterTali, PucukRebung, Rante, Pagar, Ulen, Tapak, KerawangDivider — MotifEmun/MotifBackground/MarqueeBudaya dihapus 21 Sep 2026)** | `motif/KerawangMotifs.js` | Motif Gayo (Emun, Ulen, Rante, Tapak, Puter, Pucuk Rebung, divider, marquee budaya) | lintas halaman |

## Local Contracts

### AppShell (`AppShell.js`)
- **Props**: `{ children }`
- **Struktur**: gov-strip (marquee) → sidebar + spacer → topbar (toggle nav, brand, breadcrumb, CTA `/pemdi`, ThemeToggle) → `<main id="main-content">{children}</main>` → footer → BottomNav (ponsel)
- **Skip-link** `#main-content`; scroll-reveal `[data-reveal]` via IntersectionObserver (hormati prefers-reduced-motion)
- Breadcrumb: tambah entri `PETA_JUDUL` setiap rute baru

### DetailModal (`DetailModal.js`)
- **Props**: `{ title, children, onClose, isOpen }`

### OPDTable (`OPDTable.js`)
- **Props**: `{ opdList, butirCountMap }` — `butirCountMap` dibangun di server dengan `petaButirOPD(daftar, pemdiData)` (`lib/pjButir.js`); kunci = `opd.id ?? opd.nama`

## Kontrak Mobile (19 Sep 2026)
- **SpbeGauge** — bar kemajuan memakai `transform: scaleX()` (bukan animasi `width`) supaya tidak memicu layout.
- **Tombol bukti di `/pemdi`** memakai kelas `.bukti-act` (target sentuh ≥44px di mobile) + `aria-label`.
- **BottomNav** target sentuh ≥44px.

## Status
🟢 **DOX Clean** — 17 komponen dalam tabel ini terverifikasi diimpor minimal satu halaman/komponen aktif (22 Sep 2026; cek: grep impor per file).
