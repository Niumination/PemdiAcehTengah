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
| `/pemdi` | `pemdi.js` | **Indikator Pemdi rinci (halaman lama, `#I{n}` didukung)** — 7 aspek × 20 indikator, **Simulasi Penilaian Mandiri** (hanya bukti `diterima`; lib/pemdiNilai.js), hero menampilkan ringkasan Tahap 1 eval.spbe.go.id, checklist bukti berkode `I#-L#-##` + baris 🔁 revisi dengan catatan asesor | DetailModal, KerawangDivider, CatatanTujuan · **Fokus level (21 Sep 2026)**: checklist per level dibungkus `LevelFokus` — level dicapai + level berikut terbuka, sisanya tertutup (klik utk buka) · **Catatan mandiri per butir (21 Sep 2026)**: kartu `CatatanButir` di bawah butir revisi/level berikut + bilah `EksporCatatan` (Salin semua/DOCX/Cetak-PDF) per indikator; textarea lama = "Catatan bebas" (localStorage, tetap ada) |
| `/modul-indikator` | `modul-indikator.js` | **Modul Indikator + Matriks Kebutuhan Bukti** — 20 modul kriteria L1–L5 (ground truth), bukti per level, matriks kebutuhan L1–L2 | KerawangMotifs · **Fokus level (21 Sep 2026)**: "Kriteria per Level" & tabel "Bukti Dukung — Per Level" dibungkus `LevelFokus` (stack); deskripsi indikator = teks utuh Permen dalam `<details>`; blok "Posisi & langkah berikut" dari `modul.rekomendasi` (dihitung ulang dari pemdi.json); stat matriks kebutuhan memakai vokabuler `diterima/revisi/draf/belum` · **Catatan mandiri (21 Sep 2026)**: `CatatanButir` di sel nama butir tabel per level + `EksporCatatan compact` di atas tabel bukti |
| `/requirement` | `requirement.js` | **Draf Bukti Dukung Prioritas** — tab Pemdi (19 revisi asesor + 24 butir gap, dari `draf-bukti-prioritas.json`) · tab PPB (83 requirements, 12 kategori) · panduan L1 | KerawangMotifs |
| `/opd` | `opd/index.js` | Indeks 52 Perangkat Daerah + jumlah **butir Pemdi** per OPD (`lib/pjButir.petaButirOPD` dari PJ catatan mandiri) | OPDTable, KerawangMotifs |
| `/opd/[slug]` | `opd/[slug].js` | Detail per OPD — 52 halaman statis (SSG, `fallback: false`) | KerawangMotifs (via hero class) |
| `/probis` | `probis.js` | Peta Proses Bisnis Level 0-1-2 interaktif (8 misi → 35 urusan → 78 proses) | DetailModal |
| `/spbe` | `spbe.js` | Dashboard SPBE 2025 — 4 domain (baseline laporan pemantauan) | — |
| `/glosarium` | `glosarium.js` | Glosarium istilah digital interaktif | — |
| `/cari` | `cari.js` | Pencarian global Fuse.js — indikator Pemdi, modul, OPD, glosarium, dokumen kunci (index `lib/search-index.js`, getStaticProps; sumber publik layanan/FAQ/SKM sudah dihapus) | — |
| `/404` | `404.js` | Halaman tidak ditemukan | — |
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
- `npm test` — 43/43 pass (pemdiNilai · catatanMandiri · requirement · pjButir)
- `npm run build` — sukses, 63 halaman ter-generate; `/skm /lapor /admin /api/skm` → 404
