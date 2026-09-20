# 🏛️ Pemdi Aceh Tengah

**Portal Digital Pemerintah Daerah Kabupaten Aceh Tengah**

Transformasi menuju **Pemerintah Digital (Pemdi)** — open source government technology untuk tata kelola yang transparan, efisien, dan berorientasi pada masyarakat.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)](https://vercel.com)
[![DOX](https://img.shields.io/badge/🧭%20DOX-Self--Documenting-1d70b8)](https://github.com/agent0ai/dox)
[![Database: Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E)](https://supabase.com)

---

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
| **Indeks Pemdi (simulasi mandiri)** | **0,35** — hanya 18 bukti **diterima asesor** Tahap 1 eval.spbe.go.id yang dihitung (rumus resmi PermenPANRB 8/2026) — *bukan nilai resmi* |
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
| Beranda | `/` | Dashboard utama — Pemdi badge, SPBE gauge, Peta Proses Bisnis, fitur publik |
| Kokpit Pemdi | `/pemdi` | Kokpit penilaian mandiri — simulasi indeks (hanya bukti diterima), 7 aspek + 20 indikator, checklist bukti berkode `I#-L#-##` sesuai eval.spbe.go.id |
| Peta Proses Bisnis | `/probis` | PPB 3 level — 8 Misi, 35 Urusan, 78 Proses Bisnis OPD + DetailModal misi |
| Direktori Layanan | `/layanan` | 25 layanan publik dalam 7 kategori — status, biaya, SLA, syarat |
| Survei Kepuasan | `/skm` | Survei SKM online — 8 dimensi (skala 1–4), 43 unit layanan, simpan ke Supabase |
| Tanya Jawab | `/faq` | FAQ seputar layanan, portal, SPBE, dan Pemdi |
| Chatbot Asisten | `/tanya` | Asisten virtual — cari jawaban dari FAQ |
| Pencarian Global | `/cari` | Pencarian OPD, layanan, FAQ dengan Fuse.js |
| Dashboard Kepuasan | `/dashboard-kepuasan` | Dashboard publik hasil SKM + rating halaman (Indikator I20) |
| Modul Indikator | `/modul-indikator` | 20 modul kriteria L1–L5 + status bukti per hasil asesor (tab 🔁 Revisi) + matriks kebutuhan L1–L2 |
| Glosarium | `/glosarium` | Kamus istilah digital pemerintahan |
| Pusat Bantuan | `/bantuan` | Panduan penggunaan portal + FAQ |
| Kebijakan Privasi | `/kebijakan-privasi` | Kebijakan perlindungan data pribadi (UU PDP) |
| Dashboard Admin | `/admin` | Dashboard Admin — lihat data SKM & laporan warga (login required) |
| Draf Bukti Dukung | `/requirement` | **Draf Bukti Dukung Prioritas** — 19 revisi asesor + 24 butir gap level berikut (di luar P0) (diurutkan daya ungkit) dengan contoh modul & template; tab kedua: 83 kebutuhan data PPB |
| Detail OPD | `/opd/[slug]` | Halaman detail tiap PD (52 halaman statis) |

### API Endpoints

| Endpoint | Method | Fungsi | Auth |
|----------|--------|--------|------|
| `/api/opd` | GET | Daftar lengkap OPD (52 entries) | — |
| `/api/spbe` | GET | Data SPBE 2025 (indeks 2,59 + 4 domain + rekomendasi) | — |
| `/api/requirement` | GET | 83 requirements PPB (12 kategori, 3 fase) | — |
| `/api/lapor` | POST, PATCH | Kirim & update laporan warga → Supabase | PATCH: Bearer |
| `/api/lapor/status` | GET | Tracking status laporan by ID (rate-limit) | — |
| `/api/feedback` | GET, POST | Rating halaman ★ → Supabase | — |
| `/api/skm/stats` | GET | Statistik SKM (per dimensi/unit/tren) | — |
| `/api/proxy-pdf` | GET | Proxy PDF JDIH (whitelist host) | — |
| `/api/health` | GET | Health check app + DB — pantau via uptime monitor | — |
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
│   ├── skm.js            # Survei Kepuasan Masyarakat (8 dimensi skala 1–4)
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
├── components/           # React komponen (27 aktif)
│   ├── AppShell.js       # Shell global — sidebar, topbar, breadcrumb
│   ├── Sidebar.js, Footer.js, ThemeToggle.js, ScrollTop.js
│   ├── OPDTable.js, SpbeGauge.js, SlaBadge.js
│   ├── ServiceFinder.js, ServiceCard.js, DashboardSKM.js
│   ├── DetailModal.js, GlossaryTooltip.js
│   ├── LaporWidget.js    # FAB Lapor/Saran — form + tracking ID
│   ├── RatingWidget.js, SkmPrompt.js, Sp4nBanner.js, TrackerStatus.js
│   └── motif/KerawangMotifs.js  # Motif budaya Gayo
├── lib/                  # Utility libraries (9 modul — lihat lib/AGENTS.md)
│   ├── adminAuth.js      # Admin auth — Bearer, constant-time compare
│   ├── supabaseAdmin.js  # Supabase admin client — server-only
│   ├── security.js       # Sanitasi, IP-hash, rate-limit, ID generator
│   ├── rate-limit-db.js  # Rate limiter atomic (RPC Supabase)
│   ├── pemdiNilai.js     # Rumus resmi PermenPANRB 8/2026 (teruji unit test)
│   ├── sanitize.js       # Sanitizer HTML allowlist ketat
│   ├── format.js         # Format angka & teks (locale id-ID)
│   ├── slugify.js        # Slug URL konsisten
│   └── search-index.js   # Search index builder — Fuse.js corpus
├── styles/globals.css    # CSS Global — Gayo Civic Digital v3
├── test/                 # Unit test (node:test) — rumus Pemdi + regresi data
├── CHANGELOG.md          # Ringkasan perubahan (changelog publik)
├── data/
│   ├── opd.json          # Data OPD, SPBE, PPB, rekomendasi
│   ├── pemdi.json        # Data 7 aspek × 20 indikator Pemdi
│   ├── layanan.json      # Data 25 layanan publik (7 kategori)
│   ├── faq.json          # Data FAQ
│   └── skm.json          # Data pertanyaan SKM
├── db/                   # Database schema Supabase
│   ├── schema.sql        # Tabel skm/laporan/rating_feedback + view + RPC agregat
│   └── rate-limit-schema.sql  # Tabel rate_limits + RPC atomic bump_rate_limit
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
| **Auth Admin** | Bearer token via env `ADMIN_PASSWORD` (Vercel *sensitive*, Production) — lihat `lib/adminAuth.js` |
| **Rate Limiting** | Per-IP: SKM 3×/5 menit, Lapor 5×/menit — `lib/security.js` |
| **Anti-Spam** | Rate limit atomic per-IP via Supabase RPC + validasi ketat + sanitasi (Turnstile: **belum diimplementasikan** — direncanakan) |
| **Sanitasi Input** | Strip HTML tags, length limit, regex validation |
| **IP Hashing** | SHA-256 hash disimpan, bukan IP mentah — `lib/security.js` |
| **Database** | Supabase — service role key (env), server-only |
| **CORS** | Terbatas ke `SITE_ORIGIN` atau wildcard untuk publik |

> **Admin credentials**: token admin dikonfigurasi lewat environment variable `ADMIN_PASSWORD` di Vercel (Produksi, bertipe *sensitive* — nilainya tidak bisa dibaca kembali dari dashboard/CLI). Variable lama `ADMIN_TOKEN` **dihapus 18 Sep 2026**; nilai lamanya tidak berlaku lagi.

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

# Admin (satu kredensial saja — ADMIN_TOKEN legacy dihapus 18 Sep 2026)
ADMIN_PASSWORD=your_admin_password

# Security
IP_HASH_SALT=pemdi-aceh-tengah
SITE_ORIGIN=https://pemdi-aceh-tengah.vercel.app
```

> ⚠️ `.env.local` ter-ignore oleh git (`.gitignore` baris `.env*.local`) — jangan pernah commit. Variabel `VERCEL_OIDC_TOKEN` dipakai khusus untuk deploy via CLI (`vercel deploy --prod`), bukan untuk runtime.

## 🔧 Teknologi

- **Framework**: Next.js 14 (Fullstack — frontend + backend API)
- **Database**: Supabase (PostgreSQL) — persist SKM & laporan warga
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
| SKM Online (8 dimensi, 43 unit layanan) | ✅ |
| Lapor Warga (FAB widget + Supabase) | ✅ |
| Dashboard Admin (SKM + laporan) | ✅ |
| Rate limiting atomic + health endpoint | ✅ |
| Pencarian Global (Fuse.js) | ✅ |
| Chatbot Asisten (/tanya) | ✅ |
| Supabase Database Integration | ✅ |
| Unit test rumus Pemdi (16 pin regresi, `npm test`) | ✅ |
| API Rate Limiting & Security | ✅ |

## 🤖 Agent Skills (autoskills)

Repo ini membawa [autoskills](https://github.com/midudev/autoskills) — **10 skill** best-practice di `.agents/skills/` (ter-commit; lock file ada di **root repo**: `skills-lock.json`) yang otomatis terdeteksi dari stack: **React, Next.js (2 skill), Supabase, Node.js (2 skill), frontend (SEO, a11y, design)**.

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
