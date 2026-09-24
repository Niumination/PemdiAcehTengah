# pages/ — DOX

## Purpose
Halaman Next.js Pages Router — entry point untuk **pengguna internal Pemdi** (Tim Koordinasi Pemdi + penanggung jawab OPD). SSG dari `data/*.json`; sejak Patch 4 rute rk memakai ISR 60 dtk dan (bila `DATABASE_URL` ada) menggabungkan overlay CMS — JSON tetap sumber dasar. Reposisi 22 Sep 2026.

> **Reposisi 22 Sep 2026** — persona publik (layanan, SKM, lapor, FAQ, tanya, bantuan, dashboard-kepuasan, kebijakan-privasi, admin + API-nya) **dihapus dari cabang utama** dan diarsipkan di tag git `arsip/persona-publik-2026-09` (commit `eeaa573`). Jangan dihidupkan lagi tanpa keputusan pemilik; lihat `REPOSISI-PEMDI.md` §Arsip.

## Ownership — Halaman (14 + 2 wrapper)

> **Ruang Kendali (22 Sep 2026)**: `/` → **308 permanen ke `/dashboard`** (`next.config.js redirects()`); `pages/index.js` & `BerandaAsesor` dihapus. Rute baru `/dashboard`, `/indikator`, `/antrean` menerima prop `rk` (dari `_app.js`, `RUTE_RK`); halaman lama dibungkus `<div class="rk-legacy">` agar token lama terpetakan ke token rk.

| Route | File | Fungsi | Komponen Kunci |
|-------|------|--------|----------------|
| `/dashboard` | `dashboard.js` | **Dashboard — Ruang kendali evaluasi 2026** (halaman utama): `Situasi` bar, `Kompas` Pemdi (c8), Antrean ringkas, Beban PJ, Linimasa (`data/linimasa.json`), Prasyarat, blok PPB (`hitungPPB()` dari `opd.json.probis`: 8 misi/35 urusan/78 proses), `OPDTable` 52 OPD | rk/Panel, rk/Kompas, OPDTable |
| `/indikator` | `indikator.js` | 20 indikator × 7 aspek: level dicapai/target, butir per level, klik butir → drawer `?butir=`; menerima hash `#I{n}` | rk/Panel |
| `/admin` | `admin.js` | **CMS Ruang Kendali** (Patch 4) — masuk per peran (Koordinator / PJ OPD + pilih OPD), tabel butir bercatatan mandiri (cari, sunting status·prioritas·PJ·ringkas·kebutuhan; PJ tidak bisa ganti PJ / tandai diterima), tab Konten tampilan (marquee, pengumuman, tenggat), Log audit, Ekspor JSON. `getStaticProps` + ISR 60 dtk; prop `rk` + `opdRingkas` | rk/Panel.Tag, ui/Ikon |
| `/antrean` | `antrean.js` | Antrean kerja butir (revisi + gap) berprioritas, filter persona PJ OPD, kelompok per PJ | rk/Panel |
| `/pemdi` | `pemdi.js` | **Rinci per aspek — gaya Ruang Kendali (Patch 10, 23 Sep 2026; RK-native, `getStaticProps` → `susunDataRK()` + overlay CMS, ISR 60 dtk)**: baris `Situasi` + `CatatanTujuan compact`; 7 `PanelLipat` aspek dengan `Dial` 270° (nilai mandiri vs target), koordinator, pita status bertumpuk; akordeon indikator → tangga level L1–L5 (dicapai / target berikut / belum), butir per level fokus (`fokusLevel`) + `CatatanButir` + `EksporCatatan`, tombol buka butir/indikator di Drawer; toggle 1/2 kolom. Hero, checklist lama, DetailModal, textarea catatan bebas **dihapus** dari halaman ini. Prototipe: `desain/proto-pemdi-rk.html` | PanelLipat, Dial, Situasi, CatatanMandiri, KerawangDivider |
| `/modul-indikator` | `modul-indikator.js` | **Modul indikator — kartu bertangga** (RK-native, Patch 13): `rk-sit`, `CatatanTujuan compact`, saring status (`rk-seg`) / aspek (chip) / level; 20 kartu `.rk-modul` (tangga L1–L5 mini, pita status, x/y diterima); kartu terbuka: deskripsi Permen utuh dalam `<details>`, "Posisi & langkah berikut" (`modul.rekomendasi`), `.rk-ladder` **dapat dipilih** (default = level target berikut) → kolom kiri kriteria baku + contoh bukti modul, kolom kanan butir existing level itu (`.rk-butir`: kode portal, status asesor, OPD, #dokumen kunci, pratinjau PDF `.rk-pratinjau`, buka Drawer, `CatatanButir`), PJ, `EksporCatatan`; `?modul=N` membuka & menggulir. Panel lipat tertutup: **Matriks Kebutuhan L1–L2** (`.rk-mx`, Panduan Bab 6) dan **Peta dokumen kunci** (`.rk-dok`, 31 dokumen). Bagian dead code lama dihapus | rk/PanelLipat, useRK, CatatanMandiri, ui/StatusIkon, ui/Ikon |
| `/requirement` | `requirement.js` | **Papan tugas bukti prioritas — gaya Ruang Kendali (Patch 10)**: baris ringkasan Tahap 1 (`penilaian_tahap1`), tiga kolom `PanelLipat`: **P0 Revisi asesor** (filter jenis, `KartuRevisi` dengan catatan asesor apa adanya, tindak lanjut, contoh modul, templat, buka butir di Drawer) · **P1 Gap level berikut** (`KartuGap` urut daya ungkit, tabel butir) · **L1 Panduan** (`KartuPanduan`); tab sekunder **Kebutuhan data PPB** (kartu kategori berprioritas + tabel per kategori dalam PanelLipat + keluaran). Data tetap: `draf-bukti-prioritas.json`, `panduan-bukti-l1.json`, `requirement.json` | PanelLipat, StatusIkon, CatatanTujuan |
| `/opd` | `opd/index.js` | **Peta OPD** (RK-native, Patch 11) — `rk-sit` 5 angka, saring level (`rk-seg`), **peta ubin** 52 OPD (`.rk-ubin .ub.s0–s4`, ukuran ubin ∝ jumlah butir, warna per level `LEVEL_RK` yang diekspor), panel lipat tabel `OPDTable polos`; jumlah butir dari `lib/pjButir.petaButirOPD` | rk/PanelLipat, OPDTable |
| `/opd/[slug]` | `opd/[slug].js` | **Profil OPD** (RK-native, Patch 11) — `rk-sit`, panel c8 **strip butir** (`.rk-strip-butir .sb.st-*.pr-*`, klik → Drawer via `bukaButir`) + daftar butir dari `rk.data.antrean` (`antreanUntukOPD`), panel c4 **pohon urusan/proses** PPB (`.rk-pohon`), OPD terkait sebagai `.rk-chips`; 52 halaman SSG (`fallback: false`) | rk/PanelLipat, useRK, ui/Ikon, ui/StatusIkon |
| `/probis` | `probis.js` | **Peta Proses Bisnis — aliran L0→L1→L2** (RK-native, Patch 12): `rk-sit`, misi `.rk-misi` (kartu lipat di tempat: deskripsi, fokus, OPD pelaksana), `.rk-beban` 12 OPD tersibuk, urusan `.rk-urusan` (batang ∝ jumlah OPD), proses per kategori `.rk-lajur` (6 lajur), chip OPD = tombol **sorot lintas level** (`data-redup` meredupkan yang tak terkait), rujukan regulasi | rk/PanelLipat, ui/Ikon |
| `/spbe` | `spbe.js` | **Infografis SPBE ↔ Pemdi** (RK-native, Patch 11) — `Skala` 0–5 (`.rk-skala`) membandingkan SPBE 2025 2,59 / Pemdi asesor 1,24 / mandiri awal 1,42 / simulasi (`rk.situasi.indeks`) / target 2,50; `Dial` per domain; `.rk-domain` domain → aspek Pemdi terkait; rekomendasi & kekuatan `rk-ol`. `getStaticProps` pakai `susunDataRK()` (ISR 60) | rk/Dial, rk/PanelLipat, ui/Ikon, KerawangDivider |
| `/glosarium` | `glosarium.js` | **Glosarium** (RK-native, Patch 12): `rk-sit`, `.rk-cari-box` + chip kategori (`.rk-chip .sw`), kartu `.rk-istilah` (singkat → `<details>` lengkap, sorot `.rk-mark`), keadaan kosong menautkan `/cari` | ui/Ikon |
| `/cari` | `cari.js` | Pencarian global Fuse.js (index `lib/search-index.js`) — **Patch 10**: tampilan RK (`.rk-cari-box`, chip saring per jenis, contoh kata kunci, daftar `.rk-hasil` dengan sorotan `.rk-mark`); mesin & indeks tidak berubah | Ikon |
| `/404` | `404.js` | **Halaman tidak ditemukan** (RK-native, Patch 12): `.rk-404` kode bergaris emas, jalur yang diminta (`router.asPath`, setelah hidrasi), tebakan tujuan dari potongan URL (`TUJUAN[].kata`), pintasan chip; `noindex` | ui/Ikon |
| `/_app` | `_app.js` | App wrapper — `RKShell` untuk semua rute (`RUTE_RK` dapat prop `rk`; lainnya `legacy`), canonical + og:url dinamis, meta PWA, JSON-LD, Analytics | rk/RKShell |
| `/_document` | `_document.js` | Document wrapper — font Plus Jakarta Sans (Google Fonts), theme FOUC guard, meta dasar | — |

### API Routes (6 baca + 3 auth + 5 admin)

| Route | File | Method | Fungsi | Auth |
|-------|------|--------|--------|------|
| `/api/rk-data` | `api/rk-data.js` | GET | Payload Ruang Kendali (`lib/rkData.susunDataRK()`; dengan DB: cache 60 dtk, tanpa DB: 1 jam) | — |
| `/api/auth/masuk` · `keluar` · `sesi` | `api/auth/*.js` | POST/POST/GET | Sesi CMS: sandi bersama per peran → cookie `pemdi_cms` (HMAC, 12 jam, httpOnly); rate-limit 10/10 mnt per IP | — |
| `/api/admin/butir/[id]` | PATCH | overlay butir (status, ringkas, pj, prioritas, kebutuhan) + revalidate ISR | sesi (PJ: hanya butir OPD-nya) |
| `/api/admin/konten/[kunci]` | PUT | marquee · pengumuman · tenggat | koordinator |
| `/api/admin/overlay` · `log` · `ekspor` | GET | daftar overlay · 200 log terakhir · unduh `catatan-mandiri-YYYY-MM-DD.json` (`hash_dasar: terserap`) | sesi · koordinator · koordinator |
| `/api/health` | `api/health.js` | GET | Health check app + DB (dipantau uptime monitor) | — |
| `/api/opd` | `api/opd.js` | GET | Daftar lengkap OPD (52) | — |
| `/api/spbe` | `api/spbe.js` | GET | Data SPBE 2025 | — |
| `/api/requirement` | `api/requirement.js` | GET | 83 requirements PPB | — |
| `/api/proxy-pdf` | `api/proxy-pdf.js` | GET | Proxy PDF JDIH (whitelist host + content-type) | — |

Detail kontrak: `pages/api/AGENTS.md`.

## Data Flow

```
data/*.json (pemdi, modul-indikator, opd, requirement, draf-bukti-prioritas,
             kebutuhan-bukti-dukung, glosarium, dokumen-kunci, probis)
   ──getStaticProps──► halaman (SSG)            ──► lib/pemdiNilai · lib/pjButir · lib/search-index
   ──fs.readFile────► /api/opd /api/spbe /api/requirement (read-only)
/api/proxy-pdf ──► fetch JDIH (allowlist domain) ──► iframe same-origin
/api/health   ──► cek app + integritas data (20 indikator ⇔ 20 modul), `mode: "internal"`
```

### Key Rules
- **SSG** untuk halaman statis (`/opd/[slug]` — 52 halaman, `fallback: false`)
- **getStaticProps** untuk data besar & search index (`dashboard.js`, `indikator.js`, `antrean.js` via `susunDataRK()`; `cari.js`)
- **Tidak ada penulisan data** dari web; perubahan konten = edit `data/*.json` lewat rantai skrip (lihat `data/AGENTS.md`) + patch git
- **Health**: `GET /api/health` → 200 sehat / 503 gagal — pantau dengan uptime monitor
- **noindex**: `middleware.js` menambahkan `X-Robots-Tag: noindex, nofollow` ke semua respons; `next-sitemap` disallow `/`; `_document` meta robots noindex. Belum ada login (keputusan 22 Sep: akses = noindex saja)

## Work Guidance
- Halaman baru: buat `.js` di `pages/`; tambahkan ke `TAB_RK` (tab utama) atau menu **Lainnya** di `components/rk/RKShell.js`; bila butuh prop `rk`, daftarkan di `RUTE_RK` (`_app.js`)
- Route naming: kebab-case; istilah UI **"Dashboard"** (bukan "Kokpit"; nama ekspor lama `TUJUAN_KOKPIT` dibiarkan demi kompatibilitas)
- styled-jsx dihindari (unreliable di Next 14 + Strict Mode + conditional mount)
- Error handling: setiap halaman harus graceful fallback
- **Test**: perubahan pada lib/pemdiNilai.js atau data/pemdi.json wajib `npm test` hijau (pin indeks 0,35 & 232 bukti (18/19/0/12/183))
- **Status bukti**: gunakan `STATUS_META`/`statistikIndikator` dari `lib/pemdiNilai.js` — jangan definisikan ulang di halaman. `/requirement` = **Draf Bukti Dukung Prioritas** (tab `pemdi`, data `draf-bukti-prioritas.json`) + tab `ppb` (83 kebutuhan PPB, data `requirement.json`)

## Verification
- `npx next lint` — 0 error (1 warning `exhaustive-deps` di pemdi.js dikenal)
- `npm test` — 55/55 pass (pemdiNilai · catatanMandiri · requirement · pjButir · cekUi · overlay · ruangKendali)
- `npm run build` — sukses, 62 halaman statis ter-generate (14 route inti + 48 halaman OPD `/opd/[slug]`); `/skm /lapor /api/skm` → 404 (rute publik dihapus)
