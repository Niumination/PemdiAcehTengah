# 🏛️ Pemdi Aceh Tengah

**Portal Digital Pemerintah Daerah Kabupaten Aceh Tengah**

Transformasi menuju **Pemerintah Digital (Pemdi)** — open source government technology untuk tata kelola yang transparan, efisien, dan berorientasi pada masyarakat.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)](https://vercel.com)
[![DOX](https://img.shields.io/badge/🧭%20DOX-Self--Documenting-1d70b8)](https://github.com/agent0ai/dox)
[![Database: Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E)](https://supabase.com)
[![Anti-Bot: Cloudflare Turnstile](https://img.shields.io/badge/Anti--Bot-Cloudflare%20Turnstile-F38020)](https://www.cloudflare.com/products/turnstile/)

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
| **ASN** | 4.507 Orang |

## 📄 Halaman

| Halaman | URL | Deskripsi |
|---------|-----|-----------|
| Beranda | `/` | Dashboard utama — Pemdi badge, SPBE gauge, Peta Proses Bisnis, fitur publik |
| Indeks Pemdi | `/pemdi` | Dashboard Pemdi penuh — radar chart, 7 aspek cards + modal detail indikator, SPBE vs Pemdi |
| Peta Proses Bisnis | `/probis` | PPB 3 level — Visi-Misi, 24 Urusan, Proses Bisnis OPD + DetailModal misi |
| Direktori Layanan | `/layanan` | 27 layanan publik dalam 7 kategori — status, biaya, SLA, syarat |
| Survei Kepuasan | `/skm` | Survei SKM online — 8 dimensi × 24 pertanyaan, simpan ke Supabase |
| Tanya Jawab | `/faq` | FAQ seputar layanan, portal, SPBE, dan Pemdi |
| Chatbot Asisten | `/tanya` | Asisten virtual — cari jawaban dari FAQ |
| Pencarian Global | `/cari` | Pencarian OPD, layanan, FAQ dengan Fuse.js |
| Dashboard Admin | `/admin` | Dashboard Admin — lihat data SKM & laporan warga (login required) |
| Requirements PPB | `/requirement` | 83 item kebutuhan data/API untuk PPB real |
| Detail OPD | `/opd/[slug]` | Halaman detail tiap PD (52 halaman statis) |

### API Endpoints

| Endpoint | Method | Fungsi | Auth |
|----------|--------|--------|------|
| `/api/opd` | GET | Daftar lengkap OPD (52 entries) | — |
| `/api/spbe` | GET | Data SPBE 2025 (4 domain, 47 indikator) | — |
| `/api/requirement` | GET | 83 requirements PPB (12 kategori, 3 fase) | — |
| `/api/lapor` | POST, PATCH | Kirim & update laporan warga → Supabase | — |
| `/api/skm` | GET, POST | Survei Kepuasan Masyarakat → Supabase | — |
| `/api/admin/skm` | GET | Data SKM — admin only | Bearer Token |
| `/api/admin/laporan` | GET | Data laporan warga — admin only, filter status | Bearer Token |

## 🏗️ Arsitektur

```
PemdiAcehTengah/
├── pages/                # Halaman Next.js (SSR/SSG)
│   ├── index.js          # Beranda — Pemdi badge, SPBE, PPB, fitur publik
│   ├── pemdi.js          # Dashboard Indeks Pemdi (7 aspek × 20 indikator)
│   ├── probis.js         # Peta Proses Bisnis 3 level
│   ├── layanan.js        # Direktori layanan publik
│   ├── skm.js            # Survei Kepuasan Masyarakat (24 pertanyaan)
│   ├── faq.js            # Tanya jawab (FAQ interaktif)
│   ├── tanya.js          # Chatbot asisten virtual
│   ├── cari.js           # Pencarian global (OPD, layanan, FAQ)
│   ├── admin.js          # 🆕 Dashboard Admin — SKM & laporan
│   ├── requirement.js    # Daftar Kebutuhan PPB
│   ├── opd/[slug].js     # 52 halaman detail PD (SSG)
│   └── api/              # Backend API Routes
│       ├── opd.js        # GET /api/opd
│       ├── spbe.js       # GET /api/spbe
│       ├── requirement.js# GET /api/requirement
│       ├── lapor.js      # 🆕 POST/PATCH /api/lapor → Supabase
│       ├── skm.js        # 🆕 GET/POST /api/skm → Supabase
│       └── admin/        # 🆕 Admin-only API
│           ├── skm.js    # GET /api/admin/skm
│           └── laporan.js# GET /api/admin/laporan
├── components/           # React komponen
│   ├── Header.js, Footer.js, Layout.js
│   ├── OPDTable.js, ProbisSection.js, SpbeGauge.js
│   ├── Rekomendasi.js, ScrollTop.js
│   ├── DataBadge.js      # Badge progress dinamis
│   ├── DetailModal.js    # Modal overlay interaktif
│   ├── ExpandablePanel.js# Panel accordion
│   ├── SlaBadge.js       # 🆕 Badge SLA visual
│   └── LaporWidget.js    # 🆕 FAB Lapor/Saran — form + tracking ID
├── lib/                  # 🆕 Utility libraries
│   ├── adminAuth.js      # Admin authentication — Bearer token via env
│   ├── supabaseAdmin.js  # Supabase admin client — server-only
│   ├── security.js       # 🆕 Turnstile, rate-limit, sanitasi, hashing
│   ├── format.js         # 🆕 Format angka & teks (Indonesia locale)
│   └── search-index.js   # 🆕 Search index builder — Fuse.js corpus
├── styles/globals.css    # CSS Global — GOV.UK-inspired
├── data/
│   ├── opd.json          # Data OPD, SPBE, PPB, rekomendasi
│   ├── pemdi.json        # Data 7 aspek × 20 indikator Pemdi
│   ├── layanan.json      # Data 27 layanan publik
│   ├── faq.json          # Data FAQ
│   └── skm.json          # Data pertanyaan SKM
├── db/                   # 🆕 Database schema
│   └── schema.sql        # Supabase schema — tabel skm & laporan
├── MASTERPLAN.md         # Master plan pengembangan
├── docs/                 # Dokumentasi proyek
└── public/               # Aset statis
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

### Admin & Security

Fitur admin dan keamanan yang diimplementasikan:

| Aspek | Detail |
|-------|--------|
| **Auth Admin** | Bearer Token via env `ADMIN_TOKEN` — lihat `lib/adminAuth.js` |
| **Rate Limiting** | Per-IP: SKM 3×/5 menit, Lapor 5×/menit — `lib/security.js` |
| **Anti-Bot** | Cloudflare Turnstile verification di form SKM & Lapor |
| **Sanitasi Input** | Strip HTML tags, length limit, regex validation |
| **IP Hashing** | SHA-256 hash disimpan, bukan IP mentah — `lib/security.js` |
| **Database** | Supabase — service role key (env), server-only |
| **CORS** | Terbatas ke `SITE_ORIGIN` atau wildcard untuk publik |

> **Admin credentials**: Token admin dikonfigurasi via environment variable `ADMIN_TOKEN` di `.env.local`. Lihat `.env.local` untuk referensi.

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

Buat file `.env.local` dengan variabel berikut:

```bash
# Supabase (opsional — tanpa ini, API tetap hidup dengan fallback)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin
ADMIN_TOKEN=your_admin_token
ADMIN_PASSWORD=your_admin_password

# Security
TURNSTILE_SECRET_KEY=your_turnstile_secret
IP_HASH_SALT=pemdi-aceh-tengah
SITE_ORIGIN=https://pemdi-aceh-tengah.vercel.app
```

> ⚠️ `.env.local` ter-ignore oleh git (`.gitignore` baris `.env*.local`) — jangan pernah commit. Variabel `VERCEL_OIDC_TOKEN` dipakai khusus untuk deploy via CLI (`vercel deploy --prod`), bukan untuk runtime.

## 🔧 Teknologi

- **Framework**: Next.js 14 (Fullstack — frontend + backend API)
- **Database**: Supabase (PostgreSQL) — persist SKM & laporan warga
- **Anti-Bot**: Cloudflare Turnstile — CAPTCHA-free spam protection
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
| **3** | Fitur Publik — Layanan, FAQ, SKM, Lapor, Pencarian, Admin | Jun 2026 | ✅ **Selesai** |
| **4** | Pemdi Dashboard — 7 aspek, radar chart, gap analysis | Mulai lebih awal | ◌ Pemdi page sudah live |

### Progress Detail

| Fitur | Status |
|-------|--------|
| SKM Online (24 pertanyaan, 44 unit) | ✅ |
| Lapor Warga (FAB widget + Supabase) | ✅ |
| Dashboard Admin (SKM + laporan) | ✅ |
| Cloudflare Turnstile anti-bot | ✅ |
| Pencarian Global (Fuse.js) | ✅ |
| Chatbot Asisten (/tanya) | ✅ |
| Supabase Database Integration | ✅ |
| API Rate Limiting & Security | ✅ |

## 🤝 Kontribusi

Kami menyambut kontribusi dari siapa pun — pemerintah, akademisi, pengembang, dan masyarakat.

Lihat [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan berkontribusi.

---

**Pemdi Aceh Tengah** — Open Source Government Technology untuk Indonesia.
Dibangun dengan ❤️ untuk transformasi digital Kabupaten Aceh Tengah.
