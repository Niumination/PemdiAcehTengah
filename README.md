# 🏛️ Dashboard Pemerintah Digital — Aceh Tengah

**Ruang kerja internal Evaluasi Kinerja Pemerintah Digital (Pemdi) Kabupaten Aceh Tengah**

Perangkat kerja **Tim Koordinasi Pemdi dan penanggung jawab perangkat daerah** untuk memantau 7 aspek × 20 indikator PermenPANRB 8/2026, menyiapkan bukti dukung, dan menyusun catatan penilaian mandiri. Bukan portal layanan publik.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![Data: JSON statis](https://img.shields.io/badge/Data-JSON%20statis-1F2A44)](data/AGENTS.md)

---

## Mode situs (reposisi 22 Sep 2026)

Situs melayani **satu persona: internal Pemdi**. Persona publik/warga (beranda warga, `/layanan`, `/skm`, `/lapor`, `/faq`, `/tanya`, `/bantuan`, `/dashboard-kepuasan`, `/kebijakan-privasi`, `/admin` beserta API Supabase-nya) **dihapus dari cabang `main`** dan diarsipkan di tag git **`arsip/persona-publik-2026-09`** (commit `eeaa573`). Tidak ada saklar env untuk menghidupkannya kembali; bila suatu saat dibutuhkan, lihat `REPOSISI-PEMDI.md` §Arsip. Seluruh halaman diberi `noindex` (middleware + meta + robots). Rincian di `CHANGELOG.md`.

## 🎯 Tujuan

> **Untuk siapa dan untuk apa.** Website/aplikasi ini ditujukan untuk memudahkan **Tim Asesor Internal Pemerintah Kabupaten Aceh Tengah** dalam memenuhi kebutuhan bukti dukung Evaluasi Kinerja Pemerintah Digital. Kriteria dan butir bukti memakai **bahasa baku PermenPANRB Nomor 8 Tahun 2026** apa adanya, lalu **diterjemahkan ke ruang lingkup Pemda Aceh Tengah** — perangkat daerah, dokumen, sistem, dan kondisi aktual yang benar-benar ada — sehingga tim tahu persis dokumen apa yang harus disiapkan, oleh siapa, dan bagaimana bentuknya.
>
> Prinsip: bahasa regulasi tidak diparafrasa · penerjemahan konteks lokal ada di contoh dokumen, PIC, catatan, template · status butir mengikuti hasil asesor eval.spbe.go.id (indeks di sini = simulasi, bukan nilai resmi) · catatan asesor ditampilkan apa adanya. Teks tunggal: `components/CatatanTujuan.js`.

## 🎯 Fokus Utama

**Indeks Pemerintah Digital (Pemdi)** — Dashboard evaluasi 7 aspek × 20 indikator berdasarkan PermenPANRB 8/2026, dengan data baseline dari konversi SPBE 2025 dan target 2026.

**Peta Proses Bisnis** — Hierarki 3 level sesuai Permenpan RB 19/2018.

## 📊 Data & Indikator

| Indikator | Nilai |
|-----------|-------|
| **Indeks Pemdi** | **1,24 · Level 1 · Rintisan** — hasil evaluasi asesor eksternal KemenPANRB (`data/evaluasi-asesor-2026.json`, Patch 14) · pembanding: simulasi mandiri 0,35 (18 bukti **diterima asesor** Tahap 1 eval.spbe.go.id, rumus PermenPANRB 8/2026) — *bukan nilai resmi* |
| **Penilaian Tahap 1 (eval.spbe.go.id)** | 37 butir dinilai asesor → **18 diterima · 19 revisi** (19 butir: 7 bukti tidak tepat · 10 belum diunggah · 2 ditolak otomatis — I1, I4, I8, I9, I10, I12, I13, I14, I15, I16, I19, I20) — sinkron 20 Sep 2026 |
| **Target Pemdi 2026** | 2.50 (Baik) |
| **Indeks SPBE 2025** | 2,59 (Cukup) — baseline konversi |
| **Total butir bukti dukung** | 232 item (18 diterima · 19 revisi · 12 draf lokal · 183 belum) |
| **7 Aspek** | Tata Kelola, SDM Digital, Data, Keamanan, Teknologi, Keterpaduan, Kepuasan |
| **20 Indikator** | I1–I20 — dari Tata Kelola hingga Pengelolaan Kepuasan |
| **Perangkat Daerah** | 38 Instansi + 14 Kecamatan |
| **ASN** | 4.507 Orang |

## 📄 Halaman

| Halaman | URL | Deskripsi |
|---------|-----|-----------|
| Dashboard | `/dashboard` (`/` dialihkan 308) | Ruang kendali evaluasi 2026 — bar situasi, Kompas Pemdi 20 indikator, antrean ringkas, beban PJ, linimasa, prasyarat, blok PPB, tabel 52 OPD |
| Indikator | `/indikator` | 20 indikator × 7 aspek, level dicapai/target, drawer detail butir (`?butir=`) |
| Antrean | `/antrean` | Antrean kerja butir revisi + gap per prioritas & PJ OPD |
| Admin CMS | `/admin` | Sunting status/catatan/PJ/prioritas butir, konten tampilan, log audit, ekspor (perlu env CMS) |
| Dashboard Pemdi | `/pemdi` | Simulasi penilaian mandiri — indeks (hanya bukti diterima), 7 aspek × 20 indikator, fokus level, catatan mandiri per butir + ekspor |
| Modul Indikator | `/modul-indikator` | 20 modul kriteria L1–L5 + matriks kebutuhan bukti |
| Draf Bukti Dukung Prioritas | `/requirement` | 19 revisi asesor + butir gap, template draf; tab sekunder PPB (83 kebutuhan) |
| SPBE 2025 | `/spbe` | Baseline indeks SPBE 4 domain |
| Peta Proses Bisnis | `/probis` | Level 0–1–2 (8 misi → 35 urusan → 78 proses) |
| Perangkat Daerah | `/opd`, `/opd/[slug]` | 52 OPD (SSG) + detail |
| Glosarium | `/glosarium` | Istilah Pemdi/SPBE |
| Pencarian | `/cari` | Fuse.js — indikator, modul, OPD, glosarium, dokumen kunci |

### API (read-only)

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/opd` | GET | 52 OPD |
| `/api/spbe` | GET | Data SPBE 2025 |
| `/api/requirement` | GET | 83 kebutuhan PPB |
| `/api/proxy-pdf?url=` | GET | Proxy PDF JDIH Aceh Tengah (allowlist) |
| `/api/health` | GET | Kesehatan app + integritas data, `mode: internal` |

## 🏗️ Arsitektur

```
PemdiAcehTengah/
├── pages/                # 15 halaman internal + 14 API route (6 read-only + 5 admin + 3 auth) (lihat pages/AGENTS.md)
│   ├── dashboard.js      # Dashboard (halaman utama) · indikator.js · antrean.js · asesor.js
│   ├── pemdi.js · modul-indikator.js · requirement.js · cari.js
│   ├── spbe.js · probis.js · glosarium.js
│   ├── opd/index.js · opd/[slug].js   # 52 OPD
│   ├── admin/            # CMS (env Neon; tanpa env → mode baca + API tulis 503)
│   └── api/              # REST read-only (rk-data, opd, spbe, requirement, proxy-pdf, health) + auth + admin
├── components/           # 16 komponen — rk/{RKShell,Panel,Kompas,Drawer,Palet,NavMenu,Dial,PanelLipat}, ui/{Ikon,StatusIkon}, asesor/{CatatanMandiri,AsesorDial}, OPDTable, motif/Kerawang
├── lib/                  # pemdiNilai, catatanMandiri, pjButir, search-index, modeSitus, format, slugify, cetak
├── data/                 # pemdi.json, modul-indikator.json, catatan-mandiri.json, evaluasi-asesor-2026.json, opd.json, draf-bukti-prioritas.json, …
├── scripts/              # Rantai regenerasi data (python3) — lihat data/AGENTS.md
├── test/                 # node --test (58 tes)
├── styles/               # globals.css — Navy/Beige/Gold + Kerawang Gayo
├── public/               # PWA, crest, panduan-bukti-l1/*.pdf
├── middleware.js         # X-Robots-Tag noindex semua rute
└── REPOSISI-PEMDI.md     # Arah produk + §Arsip persona publik
```

## 🧭 DOX — Self-Documenting Project

Project ini menggunakan [DOX](https://github.com/agent0ai/dox) — hierarki AGENTS.md untuk navigasi AI agent yang presisi.

| Lokasi | Fungsi |
|--------|--------|
| `AGENTS.md` | Root — project rules, global contracts, child index |
| `pages/AGENTS.md` | Halaman & routing |
| `pages/api/AGENTS.md` | REST API data contracts |
| `components/AGENTS.md` | Component library & props |
| `styles/AGENTS.md` | CSS architecture & design tokens |
| `data/AGENTS.md` | Data structure opd.json, pemdi.json, dll |

**DOX pass**: Setiap perubahan kode wajib update nearest AGENTS.md.

### Keamanan

| Aspek | Detail |
|-------|--------|
| **Security headers** | CSP, X-Frame-Options, nosniff, Referrer-Policy — `next.config.js` |
| **Indeksasi** | `X-Robots-Tag: noindex, nofollow` (middleware) + meta robots + `robots.txt` disallow |
| **Data** | Tidak ada DB runtime, tidak ada endpoint tulis, tidak ada rahasia yang dibutuhkan |
| **Akses** | Belum ada login (keputusan 22 Sep 2026: noindex saja). Login/peran menyusul bersama CMS admin |

## 🚀 Deploy di Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Niumination/PemdiAcehTengah)

```bash
git clone https://github.com/Niumination/PemdiAcehTengah.git
cd PemdiAcehTengah
npm install
npm run dev     # Development di http://localhost:3000
npm run build   # Build production
npm run start   # Production server
```

### Environment Variables

Tidak ada variabel wajib — situs berjalan penuh dari `data/*.json`. Variabel Supabase/`ADMIN_PASSWORD`/`IP_HASH_SALT` lama **tidak dipakai lagi** dan boleh dihapus dari Vercel.

**Opsional — CMS `/admin` (Patch 4):** lihat `.env.example`.

| Variabel | Fungsi |
|----------|--------|
| `DATABASE_URL` | Postgres Neon (Vercel Marketplace → Storage → Neon, pakai URL *pooled*). Tabel dibuat otomatis saat pertama dipakai. |
| `CMS_SANDI_KOORDINATOR` / `CMS_SANDI_PJ` | Kata sandi bersama per peran (Koordinator: semua butir + konten + log + ekspor; PJ OPD: hanya butir OPD-nya). |
| `CMS_SESI_RAHASIA` | Rahasia HMAC cookie sesi (≥ 32 karakter; `openssl rand -base64 48`). |
| `NEXT_PUBLIC_SITE_URL` | Canonical/sitemap. |

Alur CMS: suntingan disimpan sebagai *overlay* di Postgres → tampil di dashboard ≤ 60 dtk (ISR + revalidate) → Koordinator **Ekspor JSON** → simpan sebagai `data/catatan-mandiri.json` → jalankan rantai skrip regenerasi → commit. Nama butir/kriteria PermenPANRB 8/2026 tidak dapat diubah dari CMS.

## 🔧 Teknologi

- **Framework**: Next.js 14 (Pages Router, SSG)
- **Data**: JSON statis di `data/` (dibundel saat build; regenerasi via `scripts/*.py`)
- **Search**: Fuse.js — client-side fuzzy search
- **Sitemap**: next-sitemap — auto-generate sitemap.xml
- **Deploy**: Vercel (Free Tier)
- **Lisensi**: MIT — Open Source

## 📋 Sumber Data

- **Narasumber**: Dinas Komunikasi dan Informatika Kab. Aceh Tengah (Walidata)
- **SPBE**: Laporan Hasil Pemantauan SPBE 2025 — Kementerian PANRB
- **OPD**: Surat resmi Diskominfo Aceh Tengah, 14 Januari 2026
- **Probis**: Permenpan RB 19/2018 tentang Penyusunan Peta Proses Bisnis
- **Pemdi**: Permenpan RB 8/2026 tentang Evaluasi Kinerja Pemerintah Digital

## 🗺️ Tahapan Pengembangan

| Fase | Target | Timeline | Status |
|------|--------|----------|--------|
| **1** | Fondasi Data — Harmonisasi OPD, Mapping Urusan, Struktur PPB | Jun 2026 | ✅ Selesai |
| **2** | PPB Final — Level 0/1/2, Halaman OPD, Integrasi | Jun 2026 | ✅ Selesai |
| **3** | Fitur Publik — Layanan, FAQ, SKM, Lapor, Admin | Jun 2026 | 🗄️ **Diarsipkan** 22 Sep 2026 (tag `arsip/persona-publik-2026-09`) — di luar lingkup reposisi |
| **4** | Dashboard Pemdi — 7 aspek, simulasi mandiri, catatan mandiri, draf bukti | Sep 2026 | ✅ Live (`/pemdi`) |
| **5** | Reskin "Ruang Kendali" + CMS admin | Okt 2026 | ◌ Prototipe disetujui, patch menyusul |

### Progress Detail

| Fitur | Status |
|-------|--------|
| Simulasi indeks Pemdi (rumus resmi, pin tes) | ✅ |
| Sinkron hasil Tahap 1 eval.spbe.go.id (18 diterima · 19 revisi) | ✅ |
| Catatan mandiri per butir + ekspor teks/HTML/DOCX | ✅ |
| Draf bukti dukung prioritas | ✅ |
| Butir Pemdi per OPD (`lib/pjButir`) | ✅ |
| Pencarian global (Fuse.js) | ✅ |
| Health endpoint + noindex | ✅ |
| Reskin Ruang Kendali (Patch 1–3) | ◌ |
| CMS admin (Patch 4) | ◌ |

## 🤖 Agent Skills (autoskills)

Repo ini membawa [autoskills](https://github.com/midudev/autoskills) — **10 skill** best-practice di `.agents/skills/` (ter-commit; lock file ada di **root repo**: `skills-lock.json`) yang otomatis terdeteksi dari stack: **React, Next.js (2 skill), Node.js (2 skill), frontend (SEO, a11y, design)**.

> ⚠️ `next-cache-components` (Next.js 16+: PPR, `use cache`, `cacheLife`, `cacheTag`) **dikeluarkan 19 Sep 2026** — proyek ini berjalan di Next.js 14.2.35, jadi API tersebut belum tersedia. Bila `npx autoskills` memasangnya kembali, keluarkan lagi sampai proyek benar-benar naik versi. `next-upgrade` tetap dipertahankan (panduan upgrade, versi-agnostik).

```bash
npx autoskills          # deteksi & pasang/update skill untuk stack ini
npx autoskills -y -a claude-code   # + symlink ke .claude/skills (lokal)
```

Skill ini adalah standar kerja yang sama dengan checklist autoskills yang dipakai tim (arsip internal).

## 🤝 Kontribusi

Kami menyambut kontribusi dari siapa pun — pemerintah, akademisi, pengembang, dan masyarakat.

Lihat [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan berkontribusi.

---

**Pemdi Aceh Tengah** — Open Source Government Technology untuk Indonesia.
Dibangun dengan ❤️ untuk transformasi digital Kabupaten Aceh Tengah.
