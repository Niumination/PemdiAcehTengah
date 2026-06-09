# 🏛️ Pemdi Aceh Tengah

**Portal Digital Pemerintah Daerah Kabupaten Aceh Tengah**

Transformasi menuju **Pemerintah Digital (Pemdi)** — open source government technology untuk tata kelola yang transparan, efisien, dan berorientasi pada masyarakat.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)](https://vercel.com)
[![DOX](https://img.shields.io/badge/🧭%20DOX-Self--Documenting-1d70b8)](https://github.com/agent0ai/dox)

---

## 🎯 Fokus Utama

**Peta Proses Bisnis** — Berdasarkan Peraturan Menteri PANRB Nomor 19 Tahun 2018 tentang Penyusunan Peta Proses Bisnis Instansi Pemerintah:

| Level | Deskripsi |
|-------|-----------|
| **Level 0** | Visi, Misi, dan Strategi Pemerintahan |
| **Level 1** | 24 Urusan Konkuren dan OPD terkait |
| **Level 2** | Proses Bisnis Spesifik per OPD |

## 📊 Data & Indikator

- **Indeks SPBE 2025**: 2,59 (Cukup)
- **Target Minimal**: Level 3 setiap indikator
- **Perangkat Daerah**: 38 Instansi + 14 Kecamatan
- **ASN**: 4.955 Orang

|## 📄 Halaman & API

| Halaman | URL | Deskripsi |
|---------|-----|-----------|
| Beranda | `/` | Dashboard utama, SPBE gauge, Peta Proses Bisnis |
| Requirements PPB | `/requirement` | 83 item kebutuhan data/API untuk PPB real |
| API Data OPD | `/api/opd` | REST: filter search, level, limit |
| API SPBE | `/api/spbe` | Indeks, domain, rekomendasi SPBE |
| API Requirement | `/api/requirement` | Data lengkap requirement PPB |

## 🏗️ Arsitektur

```
PemdiAcehTengah/
├── pages/          # Halaman Next.js (SSR/SSG)
│   ├── index.js    # Beranda — Peta Proses Bisnis
│   ├── requirement.js  # Daftar Kebutuhan PPB
│   └── api/        # Backend API Routes
├── components/     # Komponen React
├── styles/         # CSS Global
├── data/           # Data JSON terstruktur
├── docs/           # Dokumentasi proyek
│   ├── requirement-peta-proses-bisnis.md  # 83 item kebutuhan PPB
│   ├── riset-peta-proses-bisnis-permenpan-19-2018.md
│   └── riset-data-aceh-tengah.md
└── public/         # Aset statis
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

| Fase | Target | Timeline |
|------|--------|----------|
| **1** | Peta Proses Bisnis & Dashboard SPBE | Juni 2026 |
| **2** | Integrasi Data OPD & Layanan Publik | Q3 2026 |
| **3** | Smart Dashboard & API Publik | 2027 |
| **4** | Pemerintah Digital Penuh (Pemdi) | 2028+ |

## 🤝 Kontribusi

Kami menyambut kontribusi dari siapa pun — pemerintah, akademisi, pengembang, dan masyarakat.

Lihat [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan berkontribusi.

---

**Pemdi Aceh Tengah** — Open Source Government Technology untuk Indonesia.
Dibangun dengan ❤️ untuk transformasi digital Kabupaten Aceh Tengah.
