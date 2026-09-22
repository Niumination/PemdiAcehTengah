# components/ — DOX

## Purpose
React component library — reusable UI building blocks, props-driven. Seluruh komponen melayani **persona internal Pemdi**.

## Ownership — 13 Komponen Aktif (Ruang Kendali, 22 Sep 2026)

## Ruang Kendali (Patch 1–3, 22 Sep 2026)

> Shell & dashboard baru bergaya *command center*. Semua rute kini dirender lewat `components/rk/RKShell.js` (`pages/_app.js`). Shell lama (AppShell/Sidebar/BottomNav/Footer/ScrollTop/ThemeToggle/BerandaAsesor/KpiCards/AspekAccordion/SpbeGauge/GlossaryTooltip) **dihapus**.

| Komponen | File | Fungsi | Dipakai di |
|----------|------|--------|------------|
| **RKShell** | `rk/RKShell.js` | Shell global: bar atas (`.rk-bar`: brand, marquee running text `rk-marquee`, jam, persona Koordinator/PJ OPD — localStorage `pemdi:pj`, tombol tema), tab `TAB_RK` (Dashboard `/dashboard`, Indikator `/indikator`, Antrean `/antrean`, menu **Lainnya** → halaman lama + `/admin`); teks marquee dapat ditimpa CMS (`data.konten.marquee`), palet perintah Ctrl+K (`Palet`), drawer detail butir (`Drawer`, URL `?butir=`), bottom tabs ponsel, footer Kerawang. Props `{children, data, legacy}`; tanpa `data` (halaman lama) memuat `/api/rk-data` secara malas untuk palet/drawer. Context `useRK()` → `{data, persona, setPersona, bukaButir, now}` | `_app.js` |
| **Panel** | `rk/Panel.js` | Ekspor: `Tag`, `Lv`, `Mini` (sparkline SVG), `Situasi` (bar situasi: indeks, hari-ke tenggat, ringkasan status), `AntreanTabel`, `BebanPJ`, `Linimasa`, `Prasyarat`, hook `useAntreanAktif()` (filter antrean per persona) | `dashboard.js`, `antrean.js` |
| **Kompas** | `rk/Kompas.js` | "Kompas Pemdi" — radial SVG 20 indikator × 7 aspek (level dicapai vs target, klik → `/indikator#I{n}`) | `dashboard.js` |
| **Drawer** | `rk/Drawer.js` | Panel samping 480px detail butir (status, catatan asesor, catatan mandiri, PJ, tautan portal) | `RKShell.js` |
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
| **LevelFokus** | `asesor/LevelFokus.js` | (21 Sep 2026) Pembungkus daftar bukti/kriteria per level: level **dicapai** (semua butir diterima asesor) + level **berikut** terbuka default, level lain tertutup — klik header untuk buka; tombol "Buka semua level / Kembali ke fokus"; state lokal per indikator (tanpa localStorage). Render isi via `children(level, {peran})`; `layout` grid (/pemdi) atau stack (/modul-indikator). Ekspor tambahan `RingkasFokus`. CSS `.lvfokus-*` di globals.css. Tidak mengubah data | `pemdi.js`, `modul-indikator.js` |
| **CatatanMandiri** | `asesor/CatatanMandiri.js` | (21 Sep 2026) `CatatanButir` — kartu lipat di bawah butir revisi/level-berikut: ringkas, rujukan (judul → tautan PDF lokal/JDIH, bagian, **hal.**, tag `pindai`/`JDIH`), checklist kebutuhan, PJ, tombol **📋 Salin** (teks siap tempel ke eval.spbe.go.id). `EksporCatatan` — bilah per indikator: jumlah butir, **Salin semua · ⬇️ DOCX · 🖨️ Cetak/PDF** (prop `compact` utk /modul-indikator). Data `b.catatan_mandiri`; tanpa localStorage/pustaka; CSS `.cm-*` di globals.css | `pemdi.js`, `modul-indikator.js` |
| **OPDTable** | `OPDTable.js` | Tabel 52 OPD: cari + filter level, paginasi 12, toggle Tabel/Grid (desktop), stacked cards ≤768 px. Prop `butirCountMap` (id/nama → jumlah butir Pemdi yang PJ-nya OPD tsb) → kolom **"Butir Pemdi"** | `dashboard.js`, `opd/index.js` |
| **DetailModal** | `DetailModal.js` | Modal detail aspek/indikator Pemdi | `pemdi.js`, `probis.js` |
| **motif/KerawangMotifs (7 ekspor: PuterTali, PucukRebung, Rante, Pagar, Ulen, Tapak, KerawangDivider — MotifEmun/MotifBackground/MarqueeBudaya dihapus 21 Sep 2026)** | `motif/KerawangMotifs.js` | Motif Gayo (Emun, Ulen, Rante, Tapak, Puter, Pucuk Rebung, divider, marquee budaya) | lintas halaman |

## Local Contracts

### RKShell (`rk/RKShell.js`)
- **Props**: `{ children, data?, legacy? }` — `data` = hasil `lib/rkData.susunDataRK()` (diberikan `_app.js` untuk rute `RUTE_RK`); `legacy=true` menambah kelas `.rk-main-legacy` dan membungkus anak dalam `.rk-legacy` (jembatan token lama → token rk).
- Persona disimpan di localStorage `pemdi:pj` (kosong = Koordinator; nama OPD = PJ OPD; dropdown hanya OPD yang punya butir).
- Marquee running text di bar atas **dipertahankan** (satu-satunya animasi berulang).

### DetailModal (`DetailModal.js`)
- **Props**: `{ title, children, onClose, isOpen }`

### OPDTable (`OPDTable.js`)
- **Props**: `{ opdList, butirCountMap }` — `butirCountMap` dibangun di server dengan `petaButirOPD(daftar, pemdiData)` (`lib/pjButir.js`); kunci = `opd.id ?? opd.nama`

## Kontrak Mobile (19 Sep 2026)
- **Tombol bukti di `/pemdi`** memakai kelas `.bukti-act` (target sentuh ≥44px di mobile) + `aria-label`.
- Bottom tabs RKShell target sentuh ≥44px.

## Status
🟢 **DOX Clean** — 17 komponen dalam tabel ini terverifikasi diimpor minimal satu halaman/komponen aktif (22 Sep 2026; cek: grep impor per file).
