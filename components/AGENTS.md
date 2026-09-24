# components/ — DOX

## Purpose
React component library — reusable UI building blocks, props-driven. Seluruh komponen melayani **persona internal Pemdi**.

## Ownership — Komponen Aktif (Ruang Kendali, 22 Sep 2026)

## Ruang Kendali (Patch 1–3, 22 Sep 2026)

> Shell & dashboard baru bergaya *command center*. Semua rute kini dirender lewat `components/rk/RKShell.js` (`pages/_app.js`). Shell lama (AppShell/Sidebar/BottomNav/Footer/ScrollTop/ThemeToggle/BerandaAsesor/KpiCards/AspekAccordion/SpbeGauge/GlossaryTooltip) **dihapus**.

| Komponen | File | Fungsi | Dipakai di |
|----------|------|--------|------------|
| **RKShell** | `rk/RKShell.js` | Shell global: bar atas (`.rk-bar`: brand, marquee running text `rk-marquee`, jam, persona Koordinator/PJ OPD — localStorage `pemdi:pj`, tombol tema), navigasi halaman lewat `NavMenu` (Patch 9; `TAB_RK`/`TAB_LAIN`/bottom-tab dihapus); teks marquee dapat ditimpa CMS (`data.konten.marquee`), palet perintah Ctrl+K (`Palet`), drawer detail butir (`Drawer`, URL `?butir=`), bottom tabs ponsel, footer Kerawang. **Patch 8**: marquee `.rk-strip` dipindah ke **bawah** bar (label "Info" emas, tanpa emoji bendera); pemilih OPD mode PJ keluar dari bar ke **baris konteks** `.rk-konteks` agar tab tidak tergencet; menu Lainnya (`<details>`) menutup otomatis saat `routeChangeStart`/klik luar/Esc; tombol **lebar halaman** Penuh→1800→1440 (`html[data-lebar]`, localStorage `pemdi:lebar`, default penuh, diset dini di `_document.js`). Props `{children, data, legacy}`; tanpa `data` (halaman lama) memuat `/api/rk-data` secara malas untuk palet/drawer. Context `useRK()` → `{data, persona, setPersona, bukaButir, now}` | `_app.js` |
| **Panel** | `rk/Panel.js` | Ekspor: `Tag`, `Lv`, `Mini` (sparkline SVG), `Situasi` (bar situasi: indeks, hari-ke tenggat, ringkasan status), `AntreanTabel`, `BebanPJ`, `Linimasa`, `Prasyarat`, hook `useAntreanAktif()` (filter antrean per persona) | `dashboard.js`, `antrean.js` |
| **Kompas** | `rk/Kompas.js` | "Kompas Pemdi" — radial SVG 20 indikator × 7 aspek (level dicapai vs target, klik → `/indikator#I{n}`) | `dashboard.js` |
| **NavMenu** | `rk/NavMenu.js` | (Patch 9) Menu navigasi halaman **Radial ⇄ Baris** — menggantikan tab atas, menu Lainnya, dan bottom-tab. Pemicu bulat di tepi **kiri** (ponsel kiri-bawah), tombol **M**; `RUTE_NAV` 12 rute (5 utama + 7 lain) dengan pintasan `g`+huruf; gaya tersimpan `localStorage pemdi:nav` (default desktop radial, ponsel baris), sakelar di dalam menu; auto-hide (`routeChangeStart`/scrim/Esc), auto-focus rute aktif, focus-trap. Koordinat item di CSS (`html[data-nav]`, `html[data-nav-buka]`). Prototipe disetujui: `desain/proto-nav-radial.html` | `RKShell.js` |
| **Dial** | `rk/Dial.js` | (Patch 10) Dial busur 270° SVG: nilai (warna aspek `--warna`) di atas bayangan target, skala 0–5, tanpa animasi; dipakai kartu aspek `/pemdi` | `pages/pemdi.js` |
| **PanelLipat** | `rk/PanelLipat.js` | (Patch 9) `<PanelLipat id judul ringkas aksi className awal>` — panel `.rk-panel` yang dapat dilipat, status diingat `localStorage pemdi:lipat:<id>`, teks `ringkas` tampil saat terlipat; `<LipatSemua/>` menyiarkan event `pemdi:lipat-semua`. Dipakai 7 panel `/dashboard` | `pages/dashboard.js` |
| **Drawer** | `rk/Drawer.js` | Panel samping detail butir (status, catatan asesor, catatan mandiri, PJ, tautan portal). Patch 8: lebar 820px, tombol **perlebar** → 1120px (`data-lebar`, localStorage `pemdi:drawer`), ponsel penuh; Cetak/PDF lewat `lib/cetak.bukaCetak` | `RKShell.js` |
| **Palet** | `rk/Palet.js` | Palet perintah Ctrl+K: rute, indikator, butir, OPD | `RKShell.js` |
| **Ikon** | `ui/Ikon.js` | Ikon SVG garis (stroke 1.75) — `NAMA_IKON`: cari tema tutup panah kompas daftar antrean modul draf menu peringatan cek jam dokumen unduh salin cetak luar pengguna gedung kiri kanan. **Emoji sebagai ikon dilarang** (dijaga `scripts/cek-ui.mjs`) | seluruh komponen |
| **StatusIkon** | `ui/StatusIkon.js` | Ikon status bukti / jenis revisi / prioritas (`k`: diterima·revisi·proses·draf·belum·tidak_tepat·belum_diunggah·otomatis_ditolak·gap·tinggi·sedang·rendah) berwarna token `--rk-status-ink-*` | pemdi, modul-indikator, requirement, CatatanMandiri |

Aturan komponen rk/ui: **tanpa emoji**, **font ≥ 11px**, animasi hanya marquee + transisi ≤150ms, tidak ada layout shift saat ganti persona (lebar kolom tetap).

### Komponen halaman lama (dibungkus `.rk-legacy`)

> **Dihapus 22 Sep 2026** (arsip tag `arsip/persona-publik-2026-09`): LaporWidget, RatingWidget, SkmPrompt, Sp4nBanner, ServiceFinder, ServiceCard, SlaBadge, DashboardSKM, TrackerStatus, persona/PersonaSwitcher, persona/usePersona, publik/HeroPublik, publik/SektorLayanan, beranda/BerandaPublik. Jangan direstorasi ke cabang utama tanpa keputusan pemilik.

*(DOX pass hardening 2026-09-17: 22 komponen/lib mati lain telah dihapus — Accordion, AwardHero, DataBadge, Explainer, Header, LaporanStatus, Modal, PPBChain, PemdiCalculator, ProbisSection, ProgressBarVisual, QuickActions, Rekomendasi, RekomendasiTracker, Section, Stepper, TimelineRoadmap, Toast, motif/KerawangCard, motif/KerawangHero.)*

| Komponen | File | Fungsi | Dipakai di |
|----------|------|--------|------------|
| **CatatanTujuan** | `CatatanTujuan.js` | Kotak "Untuk siapa dan untuk apa dashboard ini" — catatan pemilik (bahasa baku PermenPANRB 8/2026 → konteks Aceh Tengah, untuk Tim Asesor Internal). Export `TUJUAN_KOKPIT` (teks tunggal). Prop `compact`. Dipakai `/pemdi`, `/modul-indikator`, `/requirement` | — |
| **CatatanMandiri** | `asesor/CatatanMandiri.js` | (21 Sep 2026) `CatatanButir` — kartu lipat di bawah butir revisi/level-berikut: ringkas, rujukan (judul → tautan PDF lokal/JDIH, bagian, **hal.**, tag `pindai`/`JDIH`), checklist kebutuhan, PJ, tombol **📋 Salin** (teks siap tempel ke eval.spbe.go.id). `EksporCatatan` — bilah per indikator: jumlah butir, **Salin semua · ⬇️ DOCX · 🖨️ Cetak/PDF** (prop `compact` utk /modul-indikator). Data `b.catatan_mandiri`; tanpa localStorage/pustaka; CSS `.cm-*` di globals.css | `pemdi.js`, `modul-indikator.js` |
| **OPDTable** | `OPDTable.js` | Tabel 52 OPD: cari + filter level, paginasi 12, toggle Tabel/Grid (desktop), stacked cards ≤768 px. Prop `butirCountMap` (id/nama → jumlah butir Pemdi yang PJ-nya OPD tsb) → kolom **"Butir Pemdi"** | `dashboard.js`, `opd/index.js` |
| **motif/KerawangMotifs (7 ekspor: PuterTali, PucukRebung, Rante, Pagar, Ulen, Tapak, KerawangDivider — MotifEmun/MotifBackground/MarqueeBudaya dihapus 21 Sep 2026)** | `motif/KerawangMotifs.js` | Motif Gayo (Emun, Ulen, Rante, Tapak, Puter, Pucuk Rebung, divider, marquee budaya) | lintas halaman |

## Local Contracts

### RKShell (`rk/RKShell.js`)
- **Props**: `{ children, data?, legacy? }` — `data` = hasil `lib/rkData.susunDataRK()` (diberikan `_app.js` untuk rute `RUTE_RK`); `legacy=true` menambah kelas `.rk-main-legacy` dan membungkus anak dalam `.rk-legacy` (jembatan token lama → token rk).
- Persona disimpan di localStorage `pemdi:pj` (kosong = Koordinator; nama OPD = PJ OPD; dropdown hanya OPD yang punya butir).
- Marquee running text di bar atas **dipertahankan** (satu-satunya animasi berulang).

### OPDTable (`OPDTable.js`)
- **Props**: `{ list, butirCountMap, polos? }` — `polos` (Patch 11) melepas bingkai `.glow-card` saat dipakai dalam `PanelLipat` (`/opd`); `butirCountMap` dibangun di server dengan `petaButirOPD(daftar, pemdiData)` (`lib/pjButir.js`); kunci = `opd.id ?? opd.nama`

## Kontrak Mobile (19 Sep 2026)
- **Tombol bukti di `/pemdi`** memakai kelas `.bukti-act` (target sentuh ≥44px di mobile) + `aria-label`.
- Bottom tabs RKShell target sentuh ≥44px.

## Status
🟢 **DOX Clean** — komponen dalam tabel ini terverifikasi (DetailModal dihapus Patch 12, LevelFokus dihapus Patch 13 — `/modul-indikator` memakai tangga level `.rk-ladder` sendiri) diimpor minimal satu halaman/komponen aktif (23 Sep 2026 pasca Ruang Kendali; cek: grep impor per file).
