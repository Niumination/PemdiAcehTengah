# styles/ — DOX

## Purpose
Global CSS — satu file sumber untuk seluruh tampilan portal. **Luxury Navy / Warm Beige / Soft Gold** (palet resmi sejak 8 Agu 2026; menggantikan v3 "Gayo Civic Digital" yang berbasis `#004098`).

## Ownership
- `globals.css` — Satu-satunya file CSS utama. **1.732 baris / 60 KB** (diperbarui 22 Sep 2026 — CSS persona publik dihapus; sebelumnya 1.936). Semua styling di sini.
- **TIDAK ada file CSS lain.** No module CSS, no Tailwind. Period.

## Local Contracts

### Design Tokens — tema terang (default, `:root`)

| Token | CSS Variable | Value | Penggunaan |
|-------|-------------|-------|------------|
| **Primary** | `--primary` | `#1F2A44` (Navy) | Identitas pemerintah, header, footer, badge |
| **Primary hover** | `--primary-hover` | `#2C3A5E` | State hover |
| **Primary deep** | `--primary-deep` | `#10162A` | Latar gelap/aksen pekat |
| **Soft Gold** | `--gold` | `#C6A75E` | Premium, prestasi, aksen hero |
| **Gold deep** | `--gold-deep` | `#8A6A1D` | Teks emas kontras AA di tema terang |
| **Background** | `--bg` | `#F5F1E8` (Warm Beige) | Latar halaman |
| **Background subtle** | `--bg-subtle` | `#EDE7DA` | Panel sekunder |
| **Surface** | `--surface` | `#ffffff` | Kartu/container |
| **Ink** | `--ink` | `#1F2A44` | Teks utama |
| **Ink secondary** | `--ink-secondary` | `#48536B` | Teks pendukung |
| **Muted** | `--muted` | `#6A7590` | Teks tersier/label |
| **Line** | `--line` | `#DFD9CB` | Garis/border |
| **Warning** | `--warn` / `--warn-bg` | `#b45309` / `#fffbeb` | Peringatan, gap analisis |
| **Radius** | `--r-xs` / `--r-sm` / `--r` | `6px` / `10px` / `16px` | Skala sudut |

### Design Tokens — tema gelap (`[data-theme="dark"]`, "Midnight Navy & Gold")

| Token | Value | Catatan |
|-------|-------|---------|
| `--primary` | `#C6A75E` (Soft Gold) | Di tema gelap emas menjadi warna interaktif |
| `--ink` | `#E8DCC8` (Warm Beige) | Teks utama |
| `--gold-deep` | `#D5BA7C` | Emas versi terang untuk teks di latar gelap |
| Latar | `#0B101C` · surface `#141C2E` | Sesuai catatan AGENTS.md root (8 Agu 2026) |

> ⚠️ **Koreksi 19 Sep 2026:** DOX ini sebelumnya mencantumkan `--primary: #004098`, Lake Cyan `#0ea5a4`, Coffee Brown, Ink `#0f172a`, dan "dark mode via `@media (prefers-color-scheme: dark)`". Semua itu **sudah tidak berlaku** sejak tema 8 Agu 2026. Tema tidak lagi mengikuti preferensi OS: `_document.js` memaksa **terang sebagai default**, toggle manual di `ThemeToggle.js` disimpan di `localStorage`.

### Hero Gradient — Award-Level
```
--hero-award-gradient:
  radial-gradient(900px 420px at 88% -10%, rgba(14,165,164,.35), transparent 65%),
  radial-gradient(620px 360px at 8% 8%, rgba(199,154,58,.18), transparent 60%),
  linear-gradient(135deg, #052a52 0%, #073b6e 48%, #004098 100%);
```

### CSS Architecture
- **Palet aktif**: Luxury Navy/Beige/Gold (8 Agu 2026)
- **Reset**: Box-sizing, margin/padding reset
- **Typography**: **Plus Jakarta Sans — di-self-host via `next/font/local`** (variabel `--font-body: var(--font-pjs), "Plus Jakarta Sans", system-ui, …`); bukan lagi `@import` Google Fonts, bukan Inter. Tertanam di `_app.js` (Sprint B1), catatan di `_document.js:19`
- **Layout**: `.container` max-width `1180px` centered, flexbox/grid
- **Components**: Class names descriptive, no strict prefix (gov- untuk legacy)
- **Hero section**: Full-width, award-gradient background
- **Cards**: White background, `--sh` shadow, `--r` radius (16px)
- **Responsive**: Mobile-first breakpoints @768px, @1024px, @1280px
- **Animations**: scroll-reveal `[data-reveal]` 0.65s `cubic-bezier(0.16,1,0.3,1)` (opacity+translateY 22px), stagger `[data-reveal-stagger]` delay `calc(var(--i,0)*70ms)`; micro-interaction kartu `translateY(-3px)`. **Hanya transform/opacity** — dilarang menganimasikan `width`/`height`
- **Dark theme**: `[data-theme="dark"]` + toggle manual (lihat koreksi di atas)

### Tap Target (kontrak aksesibilitas, 19 Sep 2026)
Blok `@media (max-width: 768px)` di akhir `globals.css` memaksa tinggi minimum **44px** (Apple HIG) untuk kontrol sentuh: `.theme-tg`, `.mobile-menu-btn`, `.modal-close`, `header a/button`, `nav a`, `.gov-nav a`, `.gov-header a`, `.footer-col a`, `.gov-footer a`, `.footer-gov a`, `.bukti-act`, `button`, `.sf-tag`, `.hbtn`, `.link-more`, `select`, `summary`.
Alasan terukur (produksi, viewport 390px, sebelum perbaikan): `.theme-tg` 40×23 · nav header 44×14 · `.bukti-act` 58×15 · `.sf-tag` 28 · tombol kategori 30 · `.hbtn` 23 · `.link-more` 22 · `select` 37.
**Aturan untuk perubahan berikutnya:** kontrol interaktif baru wajib ≥44px di layar ≤768px; jangan menambah `padding: 0` pada tombol ikon/teks tanpa memberi area sentuh.

### Kontrak Mobile `/layanan` *(dihapus 22 Sep 2026)*
Blok CSS `/layanan` mobile, `.service-card`, `.sf-*`, `.layanan-stats` **dihapus** bersama persona publik (arsip tag `arsip/persona-publik-2026-09`). Sisa selektor `.sf-tag` di blok tap-target ≥44px dibiarkan (tidak berbahaya) dan akan dibersihkan saat reskin.

### Panel yang bisa dilipat
`.collapse-sec` (> `summary.collapse-sum`) — dipakai `/pemdi` untuk panel rumus internal. Native `<details>`
(accessible, keyboard), target sentuh summary ≥44px.

### Component Class Map
*(Catatan 19 Sep 2026: entri bertanda ⚠️ menyebut komponen yang sudah **dihapus** pada hardening 17 Sep 2026 — kelasnya mungkin masih ada di CSS sebagai warisan; verifikasi di `globals.css` sebelum dipakai.)*

| Komponen | CSS Classes |
|----------|-------------|
| Header | `.gov-header`, `.gov-header-inner`, `.gov-nav`, `.mobile-menu-btn`, `.mobile-menu-overlay` |
| Footer | `.gov-footer-wrapper`, `.gov-footer`, `.footer-main`, `.footer-gov`, `.footer-grid`, `.footer-col` |
| OPD Table | `.opd-table`, `.opd-table-search`, `.table-container`, `.tbl-wrap`, `.filter-section` |
| SPBE Gauge | `.spbe-section`, `.gauge-container`, `.spbe-card`, `.domain-bar` |
| Modal | `.modal-overlay`, `.modal-content`, `.modal-close` |
| ⚠️ AwardHero *(dihapus)* | `.award-hero`, `.award-hero-badge`, `.award-title`, `.award-subtitle`, `.award-stats`, `.cta-group` |
| ⚠️ QuickActions *(dihapus)* | `.quick-actions`, `.quick-action-card`, `.qa-icon`, `.qa-label`, `.qa-desc` |
| ⚠️ ServiceCard *(dihapus 22 Sep 2026)* | `.service-card`, `.service-icon`, `.service-name`, `.service-desc`, `.sla-badge` — CSS dihapus |
| ⚠️ ServiceFinder *(dihapus 22 Sep 2026)* | `.service-finder`, `.sf-*` — CSS dihapus |
| ⚠️ LaporanStatus *(dihapus)* | `.lapor-status-root`, `.lapor-card`, `.lapor-timeline`, `.lapor-step`, `.step-dot`, `.step-dot-active`, `.step-dot-complete`, `.step-label` |
| ⚠️ Toast *(dihapus)* | `.toast-root`, `.toast-inner`, `.toast-success`, `.toast-error` |
| ⚠️ ProgressBarVisual *(dihapus)* | `.progress-root`, `.progress-bar`, `.progress-fill`, `.progress-label` |
| ⚠️ TimelineRoadmap *(dihapus)* | `.timeline-root`, `.timeline-item`, `.tl-year`, `.tl-dot`, `.tl-dot-complete`, `.tl-dot-active`, `.tl-dot-planned`, `.tl-content` |
| Reveal/animasi | `[data-reveal]`, `[data-reveal].is-visible`, `[data-reveal-stagger]`, `.reveal` (index.js, digate `html.anim-ready`) |
| Widget mengambang | `.scroll-top` (44×44). `.rating-widget` & `.lapor-fab` dihapus 22 Sep 2026 |

### Styling Strategy
Semua komponen baru menggunakan **inline styles + CSS variables** (styled-jsx dihindari). CSS classes di atas bersifat deklaratif/semantic pada DOM. `@keyframes` untuk animasi dekoratif ditambahkan di `globals.css` (marquee `gov-strip`/`kr-*`, float, reveal).

## Perubahan Palet v3 → v4 (Luxury Navy/Beige/Gold, 8 Agu 2026)
| Area | v3 (Gayo Civic Digital) | v4 (aktif) |
|------|------------------------|------------|
| Primary | `#004098` (deep blue) | `#1F2A44` (navy) |
| Accent | `#0ea5a4` (lake cyan) | `#C6A75E` (soft gold) |
| Latar | putih/abu | `#F5F1E8` (warm beige) |
| Teks | `#0f172a` | `#1F2A44` (navy) |
| Font | Inter (Google Fonts) | Plus Jakarta Sans (self-host, `next/font/local`) |
| Dark mode | `prefers-color-scheme` | `[data-theme="dark"]` + toggle manual, default terang |

## Work Guidance
- **JANGAN buat file CSS baru** — semua di `globals.css`
- **JANGAN gunakan Tailwind/PostCSS** — proyek pure CSS
- Class names: gunakan deskriptif, konsisten dengan komponen
- Mobile-first: tulis style mobile dulu, lalu `@media (min-width: 768px)`
- Warna: gunakan CSS variable, jangan hardcode hex
- Spacing: gunakan `--space-*` variables. Base 16px.
- Container padding: 1rem mobile, 2rem desktop
- Animasi: prefer `--transition` variable untuk konsistensi; hanya `transform`/`opacity` (dilarang `transition: width`)
- **Dark theme**: setiap warna baru harus punya pasangan dark mode
- **Kontrol sentuh**: ≥44px pada ≤768px (lihat kontrak Tap Target)

## Verification
- `npm run build` — harus sukses
- Visual: cek hero, mobile menu, OPD table di hp/tablet/desktop
- Dark mode: cek toggle manual (bukan preferensi OS)
- No flash of unstyled content
- CSS variables semua terdefinisi (cek browser DevTools → Computed)
- Tap target: ukur di viewport 390px — semua kontrol ≥44px

## Child DOX Index
Tidak ada child — leaf node. Single file.


## Kebijakan motion (sejak 20 Sep 2026 — produksi)

- **Tidak ada** animasi dekoratif: blob/blur besar, `backdrop-filter`, pita motif, parallax, 3D transform, count-up, scroll-reveal, ornamen SVG absolut di hero. Semua telah dihapus karena tidak layak produksi & berat di perangkat kelas menengah.
- **Satu pengecualian** (keputusan pemilik 21 Sep 2026): running text `.gov-strip-marquee-track` (28 s linear, `infinite`, jeda saat hover) — dianggap informasi resmi, bukan dekorasi; tetap berjalan pada `prefers-reduced-motion`.
- Yang diizinkan: `transition` warna/bayangan/border ≤0,3 s, micro-interaction ≤3 px (hover tombol/bintang), animasi masuk satu kali ≤0,3 s untuk overlay (panel rating).
- `data-reveal`, kelas `reveal`/`aurora`/`d1–d4`, `MotifEmun`, `MarqueeBudaya`, `MotifBackground` sudah dihapus seluruhnya — jangan diperkenalkan kembali.
- Jangan tambahkan kembali `hooks/useCountUp`, `hooks/useInView`, `TopographicBackdrop` tanpa keputusan pemilik.


## Sprint UI/UX 21 Sep 2026 — blok CSS akhir berkas (dipangkas 22 Sep 2026)

| Prefiks | Untuk |
|---------|-------|
| ~~`.persona-*`, `.hero-publik`, `.sektor-*`, `.topbar-persona`, `.sb-quick-cta`~~ | **Dihapus 22 Sep 2026** (persona publik) |
| `.kpi-*` | 4 kartu KPI beranda internal |
| `.aspek-*`, `.ind-*`, `.st-chip.{ok,warn,muted,gray}` | Accordion 7 aspek; warna status AA |
| `.opd-viewbar`, `.seg`, `.opd-grid`, `.opd-stack` | Toggle Tabel/Grid, stacked cards ≤768 px |
| `.bottom-nav`, `.bn-*` | Bottom nav ponsel 5 tab internal; ruang `.content` +88 px |
| `.sec`, `.sr-only`, `.muted` | Spacing seksi 48/64 px, util a11y |

Catatan: `[class*="card"]:hover` tidak lagi memakai `transform`; transisi hanya bayangan/border.


## Lebar konten (21 Sep 2026)

- `--max-width: 1220px` → hanya untuk `.container` & tabel lama.
- `--content-max: 1440px` → `.content` (kolom utama saat sidebar tertutup). Jangan hapus `max-width` `.content`; lebar tanpa batas merusak keterbacaan di monitor lebar.
- `.topbar-brand*` → brand ringkas di topbar (teks disembunyikan ≤900 px, seluruhnya ≤480 px).
