# 🏛️ Pemdi Aceh Tengah

**Portal Digital Pemerintah Daerah Kabupaten Aceh Tengah**

Transformasi menuju **Pemerintah Digital (Pemdi)** — open source government technology untuk tata kelola yang transparan, efisien, dan berorientasi pada masyarakat.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)](https://vercel.com)
[![DOX](https://img.shields.io/badge/🧭%20DOX-Self--Documenting-1d70b8)](https://github.com/agent0ai/dox)

---

## 🎯 Fokus Utama

**Indeks Pemerintah Digital (Pemdi)** — Dashboard evaluasi 7 aspek × 20 indikator berdasarkan PermenPANRB 8/2026, dengan data baseline dari konversi SPBE 2025 dan target 2026.

**Peta Proses Bisnis** — Hierarki 3 level sesuai Permenpan RB 19/2018.

## 📊 Data & Indikator

| Indikator | Nilai |
|-----------|-------|
| **Indeks Pemdi Baseline** | ~1.84 |
| **Target Pemdi 2026** | 2.50 (Baik) |
| **Indeks SPBE 2025** | 2,59 (Cukup) |
| **7 Aspek** | Tata Kelola, SDM Digital, Data, Keamanan, Teknologi, Keterpaduan, Kepuasan |
| **20 Indikator** | I1–I20 — dari Tata Kelola hingga Pengelolaan Kepuasan |
| **Perangkat Daerah** | 38 Instansi + 14 Kecamatan |
| **ASN** | 4.955 Orang |

## 📄 Halaman

| Halaman | URL | Deskripsi |
|---------|-----|-----------|
| Beranda | `/` | Dashboard utama — Pemdi badge, SPBE gauge, Peta Proses Bisnis, fitur publik |
| Indeks Pemdi | `/pemdi` | Dashboard Pemdi penuh — radar chart, 7 aspek cards + modal detail indikator, SPBE vs Pemdi |
| Peta Proses Bisnis | `/probis` | PPB 3 level — Visi-Misi, 24 Urusan, Proses Bisnis OPD + DetailModal misi |
| Direktori Layanan | `/layanan` | 27 layanan publik dalam 7 kategori — status, biaya, SLA, syarat |
| Survei Kepuasan | `/skm` | Survei SKM online — 8 dimensi |
| Tanya Jawab | `/faq` | FAQ seputar layanan, portal, SPBE, dan Pemdi |
| Requirements PPB | `/requirement` | 83 item kebutuhan data/API untuk PPB real |
| API Data OPD | `/api/opd` | REST: filter search, level, limit |
| API SPBE | `/api/spbe` | Indeks, domain, rekomendasi SPBE |
| API Requirement | `/api/requirement` | Data lengkap requirement PPB |
| Detail OPD | `/opd/[slug]` | Halaman detail tiap OPD (50 halaman statis) |

## 🏗️ Arsitektur

```
PemdiAcehTengah/
├── pages/              # Halaman Next.js (SSR/SSG)
│   ├── index.js        # Beranda — Pemdi badge, SPBE, PPB, fitur publik
│   ├── pemdi.js        # Dashboard Indeks Pemdi (7 aspek × 20 indikator)
│   ├── probis.js       # Peta Proses Bisnis 3 level
│   ├── layanan.js      # Direktori layanan publik
│   ├── faq.js          # Tanya jawab
│   ├── skm.js          # Survei Kepuasan Masyarakat
│   ├── requirement.js  # Daftar Kebutuhan PPB
│   ├── opd/[slug].js   # 50 halaman detail OPD
│   └── api/            # Backend API Routes
├── components/         # 11 React komponen
│   ├── Header.js, Footer.js, Layout.js
│   ├── OPDTable.js, ProbisSection.js, SpbeGauge.js
│   ├── Rekomendasi.js, ScrollTop.js
│   ├── DataBadge.js    # 🆕 Badge progress dinamis
│   ├── DetailModal.js  # 🆕 Modal overlay interaktif
│   └── ExpandablePanel.js  # 🆕 Panel accordion
├── styles/globals.css  # CSS Global — GOV.UK-inspired
├── data/
│   ├── opd.json        # Data OPD, SPBE, PPB, rekomendasi
│   └── pemdi.json      # 🆕 Data 7 aspek × 20 indikator Pemdi
├── docs/               # Dokumentasi proyek
└── public/             # Aset statis
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
| `data/AGENTS.md` | Data structure opd.json |
| `docs/AGENTS.md` | Dokumentasi index |

**DOX pass**: Setiap perubahan kode wajib update nearest AGENTS.md.

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

## 🔧 Teknologi

- **Framework**: Next.js 14 (Fullstack — frontend + backend API)
- **Deploy**: Vercel (Free Tier)
- **Lisensi**: MIT — Open Source

## 📋 Sumber Data

- **Narasumber**: Dinas Komunikasi dan Informatika Kab. Aceh Tengah (Walidata)
- **SPBE**: Laporan Hasil Pemantauan SPBE 2025 — Kementerian PANRB
- **OPD**: Surat resmi Diskominfo Aceh Tengah, 14 Januari 2026
- **Probis**: Permenpan RB 19/2018 tentang Penyusunan Peta Proses Bisnis

## 🗺️ Tahapan Pengembangan

| Fase | Target | Timeline | Status |
|------|--------|----------|--------|
| **1** | Fondasi Data — Harmonisasi OPD, Mapping Urusan, Struktur PPB | Jun 2026 | ✅ |
| **2** | PPB Final — Level 0/1/2, Halaman OPD, Integrasi | Jun 2026 | ✅ |
| **3** | Fitur Publik — Layanan, FAQ, SKM, Lapor, Pencarian | Jun 2026 | ⏳ Sedang dikerjakan |
| **4** | Pemdi Dashboard — 7 aspek, radar chart, gap analysis | Mulai lebih awal | ◌ Pemdi page sudah live |

## 🤝 Kontribusi

Kami menyambut kontribusi dari siapa pun — pemerintah, akademisi, pengembang, dan masyarakat.

Lihat [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan berkontribusi.

---

**Pemdi Aceh Tengah** — Open Source Government Technology untuk Indonesia.
Dibangun dengan ❤️ untuk transformasi digital Kabupaten Aceh Tengah.
