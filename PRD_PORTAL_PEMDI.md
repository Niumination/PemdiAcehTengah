# PRD — Portal Pemerintah Digital (Pemdi) Kabupaten Aceh Tengah

| Metadata | |
|----------|---------|
| **Dokumen** | Product Requirements Document (PRD) |
| **Proyek** | Pemdi Aceh Tengah — Portal Digital Pemerintah Daerah |
| **Acuan Utama** | Panduan Peningkatan Indeks Pemdi Aceh Tengah (Diskominfo, Juni 2026) |
| **Acuan Pendukung** | PermenPANRB 8/2026, Permenpan 19/2018, Data e-Keurani BKPSDM |
| **Status** | v1.0 — Final |
| **Tanggal** | 14 Juni 2026 |

---

## DAFTAR ISI

1. [Visi Produk](#1-visi-produk)
2. [Tujuan & Metrik Keberhasilan](#2-tujuan--metrik-keberhasilan)
3. [Pengguna & Skenario](#3-pengguna--skenario)
4. [Fitur — Prioritas P0 (Critical)](#4-fitur--prioritas-p0-critical)
5. [Fitur — Prioritas P1 (High)](#5-fitur--prioritas-p1-high)
6. [Fitur — Prioritas P2 (Medium)](#6-fitur--prioritas-p2-medium)
7. [Persyaratan Teknis](#7-persyaratan-teknis)
8. [Persyaratan Non-Fungsional](#8-persyaratan-non-fungsional)
9. [Roadmap Implementasi](#9-roadmap-implementasi)
10. [Matriks Pemetaan Indikator](#10-matriks-pemetaan-indikator)
11. [Daftar Halaman Final](#11-daftar-halaman-final)
12. [Data & API](#12-data--api)
13. [Glosarium Istilah PRD](#13-glosarium-istilah-prd)

---

## 1. Visi Produk

### 1.1 Ringkasan Eksekutif

Portal Pemerintah Digital (Pemdi) Kabupaten Aceh Tengah adalah **aplikasi Pemdi utama** yang berfungsi sebagai:

1. **Etalase bukti dukung** — Setiap halaman adalah bukti langsung untuk evaluasi Indeks Pemdi
2. **Dashboard transparansi** — Publikasi real-time Indeks Pemdi, SKM, dan progress perbaikan
3. **Pintu layanan digital** — Akses utama masyarakat ke layanan pemerintah daerah
4. **Pusat data proses bisnis** — Visualisasi PPB Level 0–1–2 sebagai fondasi Pemdi

### 1.2 Mengapa Portal Ini Penting untuk Indeks Pemdi

Dari 20 indikator Pemdi (PermenPANRB 8/2026), **portal ini berkontribusi langsung pada 9 indikator** dengan total bobot **55%** dari keseluruhan nilai indeks:

| Indikator | Bobot | Kontribusi Portal |
|-----------|-------|------------------|
| I-20 Pengelolaan Kepuasan Pengguna | **15%** | Dashboard SKM publik, rating widget, tren kepuasan |
| I-19 Fasilitas Dukungan Pengguna | **10%** | Helpdesk, FAQ, SLA, SP4N LAPOR |
| I-1 Tata Kelola Pemdi | 5% | Publikasi arsitektur, rencana aksi, SK |
| I-5 Tata Kelola Data | 5% | Open data, Satu Data Indonesia link |
| I-13 Aplikasi Pemdi | 5% | Portal sebagai aplikasi Pemdi utama |
| I-15 Keterpaduan Proses Bisnis | 4% | PPB visual 3 level |
| I-17 Portal Layanan Digital | 4% | Portal itu sendiri sebagai bukti |
| I-16 Integrasi Aplikasi | 4% | API, koneksi sistem nasional |
| I-18 Interoperabilitas Data | 3% | Dokumentasi API, data exchange |

### 1.3 Target Indeks Pemdi

**Target:** Mencapai **Indeks Pemdi ≥ 2,50** (Predikat Baik) dalam siklus evaluasi berikutnya.

| Skenario | Indeks | Predikat | Kondisi |
|----------|--------|----------|---------|
| Baseline (dari SPBE 2025) | 2,375 | Cukup | Tanpa perubahan portal |
| Quick Win (6 fitur baru) | 2,45 | Cukup | Mendekati Baik |
| **Full Implementation** | **2,50–2,70** | **Baik** | **DENGAN PORTAL LENGKAP** |
| Optimis (Kepuasan 3,5) | 2,80 | Baik | Target stretch |

> **Sumber:** Panduan Peningkatan Indeks Pemdi hal. 714-728 (proyeksi dengan rumus resmi)

---

## 2. Tujuan & Metrik Keberhasilan

### 2.1 Tujuan Produk (SMART)

| ID | Tujuan | Metrik | Target | Timeline |
|----|--------|--------|--------|----------|
| G1 | Publikasi dashboard kepuasan publik | Halaman dashboard live + data real-time | ✅ Online | Quick Win |
| G2 | Mekanisme feedback di semua halaman | Widget rating muncul di 100% halaman | ✅ Terpasang | Quick Win |
| G3 | Publikasi status laporan real-time | Tracking ID bisa dicek publik | ✅ Live tracker | Quick Win |
| G4 | Publikasi breakdown 20 indikator Pemdi | Halaman /pemdi tampilkan semua indikator | ✅ Per indikator | Quick Win |
| G5 | Detail halaman per OPD (52 halaman) | Setiap OPD punya halaman `/opd/{slug}` | ✅ 52 halaman | Quick Win |
| G6 | Visualisasi PPB di Beranda | Chain L0→L1→L2 interaktif | ✅ Visual | Quick Win |
| G7 | Kalkulator proyeksi Pemdi | Slider interaktif — "jika naik, menjadi" | ✅ Kalkulator | Fase 2 |
| G8 | Publikasi dataset terbuka (Satu Data) | Halaman /data dengan metadata dataset | ✅ Online | Fase 3 |

### 2.2 Metrik Keberhasilan Portal (KPI)

| KPI | Target Saat Ini | Target Setelah PRD |
|-----|----------------|-------------------|
| Nilai I-17 (Portal Layanan Digital) | 3,5 | 3,5 (pertahankan) |
| Nilai I-19 (Fasilitas Dukungan) | 3,0 | 3,0+ (pertahankan) |
| Nilai I-20 (Kepuasan Pengguna) | 3,5 | 3,5+ (dashboard publik) |
| Jumlah layanan terintegrasi di portal | — | Terdokumentasi di halaman layanan |
| SKM responses per bulan | — | 100+ respons |
| Rating feedback submissions | — | 500+ per bulan |
| Uptime portal | — | 99,9% |

---

## 3. Pengguna & Skenario

### 3.1 Persona

| Persona | Peran | Kebutuhan Utama | Indikator Terkait |
|---------|------|----------------|-------------------|
| **Tim Asesor Pemdi** (Internal) | Mengevaluasi dan mengisi bukti dukung | Akses cepat ke semua bukti, dashboard indikator | Semua |
| **Masyarakat Publik** | Mengakses layanan, memberi feedback | Informasi layanan, SKM online, rating, lapor | I-19, I-20 |
| **Kepala OPD** | Memantau kontribusi OPD-nya | Dashboard per OPD, PPB, rekomendasi | I-15, I-16 |
| **Pimpinan Daerah** (Sekda/Bupati) | Memantau progress Pemdi | Ringkasan eksekutif, target vs actual | I-1 |
| **KemenPANRB** (Eksternal) | Verifikasi bukti dukung | URL publik yang bisa diverifikasi | Semua |

### 3.2 Skenario Utama (User Stories)

#### US-01: Publik melihat hasil SKM
Sebagai **masyarakat**, saya ingin melihat **hasil survei kepuasan** secara real-time agar saya tahu apakah suara saya didengar dan bagaimana kualitas layanan.

**Acceptance Criteria:**
- Halaman dashboard SKM publik menampilkan: rata-rata nilai, jumlah responden, tren bulanan
- Grafik interaktif (filter per OPD, per periode)
- Data update real-time dari Supabase

#### US-02: Publik memberi rating layanan
Sebagai **pengguna portal**, saya ingin **memberi rating** (bintang 1-5) di setiap halaman agar saya bisa menyampaikan pendapat dengan cepat.

**Acceptance Criteria:**
- Widget floating di pojok kanan bawah semua halaman
- Minimal: "Apakah informasi ini membantu? 👍 / 👎"
- Opsional: rating bintang 1-5 + komentar singkat

#### US-03: Publik melacak laporannya
Sebagai **warga yang melapor**, saya ingin **melacak status laporan** saya dengan ID tracking agar saya tahu progress penanganannya.

**Acceptance Criteria:**
- Halaman tracker: input ID → tampilkan status
- Status: Diterima → Diproses → Selesai / Ditindaklanjuti
- SLA per kategori laporan

#### US-04: Asesor mengecek bukti per indikator
Sebagai **tim asesor internal**, saya ingin melihat **checklist bukti dukung per indikator** agar saya tahu apa yang sudah dan belum lengkap.

**Acceptance Criteria:**
- 20 indikator Pemdi ditampilkan dengan status bukti dukung
- Link ke dokumen jika sudah tersedia
- Filter per aspek

#### US-05: Publik menjelajah PPB
Sebagai **warga/watcher**, saya ingin **menjelajahi peta proses bisnis** secara visual agar saya paham bagaimana pemerintah bekerja.

**Acceptance Criteria:**
- Visual chain L0 (Visi-Misi) → L1 (Urusan) → L2 (Proses)
- Klik urusan → lihat OPD pelaksana
- Klik OPD → lihat halaman detail OPD

#### US-06: Publik melihat profil OPD
Sebagai **warga**, saya ingin **melihat profil lengkap OPD** — urusan, proses bisnis, layanan — agar saya tahu OPD mana yang menangani urusan saya.

**Acceptance Criteria:**
- 52 halaman statis `/opd/{slug}` (SSG)
- Setiap halaman: nama, level, ASN, urusan, proses bisnis, layanan, indikator terkait
- Link ke halaman PPB terkait

#### US-07: Pimpinan memantau proyeksi indeks
Sebagai **Sekda/Kadis Kominfo**, saya ingin melihat **proyeksi Indeks Pemdi** berdasarkan skenario "jika aspek X naik ke Y" agar saya bisa mengambil keputusan prioritas.

**Acceptance Criteria:**
- Kalkulator interaktif dengan slider per aspek
- Tampilkan proyeksi indeks real-time
- Bandingkan baseline (2,375) vs target (2,50)

#### US-08: Publik mengakses data terbuka
Sebagai **peneliti/masyarakat**, saya ingin **mengunduh dataset publik** agar saya bisa menganalisis data pemerintah daerah.

**Acceptance Criteria:**
- Halaman /data dengan tabel dataset
- Metadata: nama, sumber, update, format, link download
- Link ke portal Satu Data Indonesia

---

## 4. Fitur — Prioritas P0 (Critical)

Fitur yang HARUS ADA sebelum portal dapat dianggap sebagai alat bukti dukung Pemdi.

| ID | Fitur | Halaman | US Terkait | Indikator | Bobot |
|----|-------|---------|-----------|-----------|-------|
| F-01 | Dashboard Kepuasan Publik | `/dashboard-kepuasan` | US-01 | I-20 | 15% |
| F-02 | Rating Widget (floating) | Semua halaman (via Layout) | US-02 | I-19, I-20 | 25% |
| F-03 | Status Tracker Laporan | `/lapor` — integrasi di halaman existing | US-03 | I-19 | 10% |
| F-04 | Link/Banner SP4N LAPOR | `/lapor` + Footer | US-03 | I-19 | 10% |
| F-05 | Breakdown 20 Indikator Pemdi | `/pemdi` | US-04 | I-1 | 5% |
| F-06 | Halaman Detail OPD (52 halaman) | `/opd/[slug].js` | US-06 | I-15, I-16 | 8% |

### F-01: Dashboard Kepuasan Publik

**Deskripsi:** Halaman publik yang menampilkan hasil Survei Kepuasan Masyarakat (SKM) secara real-time — grafik, tren, dan statistik. Ini adalah bukti langsung untuk I-20: "Dashboard publik hasil survei kepuasan."

**Sumber data:** Supabase table `skm_responses` (existing)

**Komponen yang dibutuhkan:**
- `<SkmOverview />` — ringkasan: rata-rata nilai, total responden, periode
- `<SkmTrendChart />` — grafik tren per bulan/triwulan (Recharts)
- `<SkmFilter />` — filter per OPD, per periode, per kategori
- `<SkmExport />` — tombol ekspor PDF/CSV

**Layout halaman:**
```
Header: "Kepuasan Masyarakat terhadap Layanan Digital"
  └── Breadcrumb: Beranda > Dashboard Kepuasan
Stats Row: [Rata-rata: 3.2] [Responden: 1.024] [Periode: Juni 2026]
  └── Sumber data: "Data dari Survei Kepuasan Masyarakat (SKM) Online"
Grafik Tren: SKM per Bulan (bar/line chart)
Tabel Rating per Layanan/OPD: filterable, sortable
Bagian: "Apa Kata Warga?" — kutipan pengaduan/saran (anonim)
Bagian: "Tindak Lanjut" — respon pemerintah terhadap masukan
Footer: "Data diperbarui secara real-time"
```

**Data flow:**
```
Supabase (`skm_responses`) → API `/api/skm/stats` → Client-side fetch → Recharts
```

### F-02: Rating Widget

**Deskripsi:** Widget floating di pojok kanan bawah semua halaman portal. Minimal "Apakah ini membantu? 👍/👎", idealnya rating bintang 1-5.

**Komponen bar:** `<RatingWidget />` — render di `_app.js` atau `Layout.js`

**Data:** Simpan ke Supabase table `rating_feedback`:
```sql
CREATE TABLE rating_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  helpful BOOLEAN,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT
);
```

**UI:**
```
[Widget floating — pojok kanan bawah]
  ├── [Closed state] "Ada masukan? 💬"
  └── [Open state]
      ├── "Apakah halaman ini membantu?"
      ├── [👍] [👎] atau [⭐️⭐️⭐️⭐️⭐️]
      └── [Kotak komentar opsional] [Kirim]
```

### F-03: Status Laporan Tracker

**Deskripsi:** Fitur untuk melacak status laporan/pengaduan yang sudah dikirim. Cukup input ID laporan → tampilkan status.

**Integrasi:** Di halaman `/lapor` yang sudah ada (LaporWidget).

**Status workflow:**
```
Diterima → Diverifikasi → Diproses → Selesai
                                     → Ditindaklanjuti
```

**Data:** Extended dari Supabase table `laporan` — tambah field `status` dan `tracking_id`.

### F-04: SP4N LAPOR Banner

**Deskripsi:** Integrasi dengan portal nasional SP4N LAPOR (https://www.lapor.go.id/) sebagai bukti koneksi ke sistem nasional untuk I-19.

**Penempatan:**
- Banner di halaman `/lapor`: "Lapor juga melalui SP4N LAPOR Nasional"
- Link di Footer: "SP4N LAPOR →"

### F-05: Breakdown 20 Indikator Pemdi

**Deskripsi:** Halaman `/pemdi` saat ini hanya menampilkan 7 aspek. Perlu di-expand untuk menampilkan 20 indikator dengan nilai, target, bobot, dan status bukti dukung.

**Sumber data:** `data/pemdi.json` (sudah ada — 395 lines, mencakup seluruh 20 indikator)

**Tampilan baru:**
```
7 Aspek Cards (existing — tetap)
Setiap card di-expand dengan:
  └── Indikator list (2-4 per aspek)
      ├── Nama indikator
      ├── Nilai saat ini vs target (progress bar)
      ├── Bobot (%)
      ├── Status bukti dukung: ✅ / ❌ / 🔄
      └── Penanggung jawab
```

### F-06: Halaman Detail OPD (52 halaman)

**Deskripsi:** Generate halaman statis untuk setiap OPD menggunakan `getStaticPaths` dan `getStaticProps`. Saat ini `/opd` hanya menampilkan tabel — setiap OPD harus punya halaman detail sendiri.

**Routes:** `/opd/[slug]` — slug dari nama OPD (contoh: `diskominfo`, `dinas-pendidikan`)

**Layout per halaman:**
```
Hero: [Nama OPD] — [Level] (Dinas/Badan/Kecamatan)
Stats: [Jumlah ASN] [Jumlah Layanan]
Navigasi: ← Beranda / OPD

Section 1: Profil
  - Nama lengkap, singkat, level, urusan
Section 2: Urusan Pemerintahan (dari PPB L1)
  - Daftar urusan yang dikelola OPD ini
  - Link ke halaman PPB terkait
Section 3: Proses Bisnis (dari PPB L2)
  - Proses yang dijalankan OPD ini
  - Kategori: Perencanaan, Pelaksanaan, dll.
Section 4: Layanan
  - Layanan publik yang disediakan
Section 5: Indikator Pemdi Terkait
  - Indikator yang menjadi tanggung jawab OPD ini
```

---

## 5. Fitur — Prioritas P1 (High)

Fitur yang MENINGKATKAN nilai bukti dukung secara signifikan.

| ID | Fitur | Halaman | US Terkait | Indikator | Bobot |
|----|-------|---------|-----------|-----------|-------|
| F-07 | Visual Chain PPB di Beranda | `/` (Beranda) | US-05 | I-15 | 4% |
| F-08 | Kalkulator Proyeksi Pemdi | `/pemdi` | US-07 | I-1 | 5% |
| F-09 | Rekomendasi dengan Status Tracker | `/` (Beranda) | US-04 | I-1 | 5% |
| F-10 | SKM Online Widget (Quick Rating) | Semua halaman | US-02 | I-20 | 15% |
| F-11 | Perbaikan FAQ jadi Knowledge Base | `/faq` | US-03 | I-19 | 10% |
| F-12 | SLA Publik per Layanan | `/bantuan` (halaman baru) | US-03 | I-19 | 10% |

### F-07: Visual Chain PPB di Beranda

Deskripsi: Ganti 4 `<details>` di Beranda dengan visual chain interaktif yang menunjukkan hierarki PPB 3 level.

```jsx
<PPBChain>
  L0 [Visi & Misi] ──→ L1 [34 Urusan] ──→ L2 [78 Proses Bisnis]
         ↓                    ↓                      ↓
   "Aceh Tengah Islami..."   Klik lihat urusan      Klik lihat proses
```

### F-08: Kalkulator Proyeksi Pemdi

Deskripsi: Slider interaktif di halaman `/pemdi` untuk mensimulasikan kenaikan nilai per aspek dan melihat dampaknya pada Indeks Pemdi.

**Rumus (dari Panduan hal. 716):**
```
Indeks Pemdi = (0,10 × A1) + (0,10 × A2) + (0,15 × A3) + (0,15 × A4)
               + (0,10 × A5) + (0,15 × A6) + (0,25 × A7)
```

### F-09: Rekomendasi Tracker

Deskripsi: 7 rekomendasi prioritas (dari Panduan hal. 169-203) ditampilkan dengan status:
- 🔴 Belum dimulai
- 🟡 Sedang dikerjakan
- 🟢 Selesai

Tambahkan progress bar overall (misal: 3/7 selesai).

### F-10: Quick Rating SKM

Deskripsi: Selain widget floating, tambahkan prompt survey cepat setelah pengguna mengunjungi 3+ halaman — "Ada waktu 2 menit? Ikut survei kepuasan kami."

### F-11: FAQ → Knowledge Base

Deskripsi: Kategorisasi FAQ, search lebih baik, artikel terkait, dan "Apakah ini membantu? 👍/👎" di setiap jawaban.

### F-12: Halaman /bantuan

Deskripsi: Halaman pusat bantuan yang menampilkan:
- Kategori FAQ
- SLA per layanan (tabel publik: "Layanan KTP elektronik: 1 hari kerja")
- Kontak helpdesk
- Link SP4N LAPOR
- Status sistem (uptime)

---

## 6. Fitur — Prioritas P2 (Medium)

Fitur pelengkap yang meningkatkan kelengkapan dan nilai tambah portal.

| ID | Fitur | Halaman | Indikator |
|----|-------|---------|-----------|
| F-13 | Open Data — Publikasi Dataset | `/data` (halaman baru) | I-5 |
| F-14 | Glosarium dengan Kategori | `/glosarium` (enhance) | I-19 |
| F-15 | Evidence Checklist Per Indikator | `/pemdi` (enhance) | Semua |
| F-16 | Timer/Roadmap Countdown | `/` (Beranda) | I-1 |
| F-17 | Kebijakan Privasi — PDP | `/kebijakan-privasi` (enhance) | I-8 |

### F-13: Open Data

Deskripsi: Halaman `/data` yang menampilkan dataset publik yang bisa diunduh:
- Metadata per dataset (nama, sumber, update, format)
- Link ke portal Satu Data Indonesia
- Link ke JDIH

### F-14: Glosarium Enhanced

Deskripsi: Kategorisasi istilah, search lebih baik, "istilah terkait", dan konteks Pemdi.

### F-15: Evidence Checklist

Deskripsi: Checklist per indikator yang menunjukkan status kelengkapan bukti dukung. Bisa dicentang oleh admin.

### F-16: Roadmap Countdown

Deskripsi: Timer countdown ke target Fase 4 (12 bulan) — "Target Indeks Pemdi 2,50 dalam X bulan"

### F-17: PDP Compliance

Deskripsi: Halaman kebijakan privasi diperkuat dengan:
- Dasar hukum UU 27/2022
- Mekanisme consent
- Hak subjek data
- Kontak PPDP

---

## 7. Persyaratan Teknis

### 7.1 Stack Teknologi (Existing — Tidak Berubah)

| Komponen | Teknologi | Keterangan |
|----------|-----------|------------|
| Framework | Next.js 14 (Pages Router) | SSG + ISR |
| UI Library | React 18 | — |
| Styling | CSS Modules + globals.css | GOV.UK-inspired, Inter font |
| Data Statis | `data/*.json` | OPD, SPBE, PPB, Pemdi |
| Data Dinamis | Supabase | SKM responses, laporan, rating |
| Deployment | Vercel | Production branch: `main` |
| Chart | Recharts | Untuk grafik dashboard |

### 7.2 Database (Supabase)

**Existing tables:**
- `skm_responses` — data SKM
- `laporan` — data pengaduan

**New tables yang dibutuhkan:**

```sql
-- Table: rating_feedback (untuk F-02 Rating Widget)
CREATE TABLE rating_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  helpful BOOLEAN,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT
);

-- Table: evidence_status (untuk F-15 Evidence Checklist)
CREATE TABLE evidence_status (
  indicator_id TEXT PRIMARY KEY,
  status TEXT CHECK (status IN ('✅', '🔄', '❌')),
  notes TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);
```

### 7.3 API Routes

| Route | Method | Deskripsi | Data Source |
|-------|--------|-----------|-------------|
| `/api/skm/stats` | GET | Statistik SKM agregat | Supabase |
| `/api/skm/responses` | GET | Data SKM mentah (terfilter) | Supabase |
| `/api/laporan/track` | GET | Cek status laporan by ID | Supabase |
| `/api/rating` | POST | Simpan rating feedback | Supabase |
| `/api/rating/stats` | GET | Statistik rating | Supabase |
| `/api/evidence/status` | GET/PATCH | Status bukti dukung | Supabase |

### 7.4 Data Flow Architecture

```
getStaticProps (build time)
  ├── data/opd.json   →  OPD, PPB, SPBE, Rekomendasi
  ├── data/pemdi.json  →  7 aspek, 20 indikator
  └── generate 52 OPD pages

Client-side (runtime)
  ├── /api/skm/stats    →  SKM dashboard (Recharts)
  ├── /api/rating       →  Rating widget
  ├── /api/laporan/track →  Status laporan
  └── Supabase realtime →  Live updates
```

---

## 8. Persyaratan Non-Fungsional

### 8.1 Performa

| Metrik | Target |
|--------|--------|
| Lighthouse Performance | ≥ 90 |
| First Contentful Paint | < 1,5 detik |
| Time to Interactive | < 2 detik |
| Build time (52 OPD pages) | < 60 detik |
| API response time | < 200ms |

### 8.2 Keamanan

| Persyaratan | Implementasi |
|-------------|-------------|
| HTTPS | ✅ Semua traffic via Vercel |
| CSP Headers | ✅ Existing — tambah Supabase domain |
| Rate Limiting | ✅ API routes via `lib/security.js` |
| Input Sanitization | ✅ Untuk form feedback |
| PDP (UU 27/2022) | ❌ Tambahkan consent checkbox di form |

### 8.3 Aksesibilitas

| Kriteria | Target |
|----------|--------|
| WCAG 2.1 | Level AA |
| Skip link | ✅ Already implemented |
| Keyboard navigation | ✅ |
| Screen reader | Semantic HTML, aria labels |
| Color contrast | 4.5:1 minimum |

### 8.4 SEO

| Item | Implementasi |
|------|-------------|
| Meta tags per halaman | ✅ Already done |
| Open Graph | ✅ Title, description, image |
| JSON-LD structured data | ✅ GovernmentOrganization |
| Sitemap | auto via Next.js |
| Robots.txt | ✅ |

### 8.5 Maintainability

| Persyaratan | Keterangan |
|-------------|-----------|
| Modular components | Setiap fitur = komponen terpisah |
| Data terpusat | Semua data di `data/*.json` + Supabase |
| Dokumentasi | Setiap komponen baru dibuatin AGENTS.md |
| Type safety | PropTypes untuk props komponen |

---

## 9. Roadmap Implementasi

### Fase 🚀 Quick Win (Hari 1-2) — 47% Bobot Pemdi

| ID | Fitur | Hari | Dependensi |
|----|-------|------|-----------|
| F-02 | Rating Widget | 0,5 | — |
| F-01 | Dashboard SKM Publik | 1 | Supabase `skm_responses` |
| F-03 | Status Laporan Tracker | 0,5 | Supabase `laporan` |
| F-04 | SP4N LAPOR Banner | 0,25 | — |
| F-05 | Breakdown 20 Indikator | 0,5 | `data/pemdi.json` |
| F-06 | OPD Detail Pages (52) | 1 | `data/opd.json` |

**Checklist penyelesaian Quick Win:**
- [x] Widget rating muncul di semua halaman (QW1)
- [x] Dashboard SKM menampilkan data real-time dari Supabase (QW2)
- [x] Pengguna bisa cek status laporan dengan ID (QW3)
- [x] Banner SP4N LAPOR terpasang (QW4)
- [x] Halaman `/pemdi` menampilkan 20 indikator
- [x] 52 halaman OPD bisa diakses di `/opd/{slug}`

### Fase 🛠️ Fondasi (Hari 3-7)

| ID | Fitur | Hari |
|----|-------|------|
| F-07 | Visual Chain PPB di Beranda | 1 |
| F-08 | Kalkulator Proyeksi Pemdi | 1 |
| F-09 | Rekomendasi Tracker | 0,5 |
| F-10 | Quick Rating SKM | 0,5 |
| F-11 | FAQ → Knowledge Base | 1 |
| F-12 | Halaman /bantuan | 1 |

### Fase 🔧 Lengkap (Minggu 2-4)

| ID | Fitur | Hari |
|----|-------|------|
| F-13 | Open Data /data | 2 |
| F-14 | Glosarium Enhanced | 1 |
| F-15 | Evidence Checklist | 1 |
| F-16 | Roadmap Countdown | 0,5 |
| F-17 | PDP Compliance | 1 |

---

## 10. Matriks Pemetaan Indikator

Matriks lengkap yang menunjukkan **kontribusi setiap fitur portal terhadap setiap indikator Pemdi**, bersumber dari Panduan Peningkatan Indeks Pemdi.

| Indikator | Bobot | Fitur Portal | Halaman | Bukti Dukung (dari Panduan) |
|-----------|-------|-------------|---------|---------------------------|
| **I-1** Tata Kelola Pemdi | 5% | F-05, F-08, F-09, F-16 | `/pemdi`, Beranda | Arsitektur Pemdi, Rencana Aksi, SK Tim (Panduan hal. 284-296) |
| **I-5** Tata Kelola Data | 5% | F-13 | `/data` | SK Walidata, metadata, forum data (Panduan hal. 349-363) |
| **I-8** PDP | 4% | F-17 | `/kebijakan-privasi` | SK PPDP, SOP PDP (Panduan hal. 392-401) |
| **I-13** Aplikasi Pemdi | 5% | Semua fitur | Semua halaman | Portal sebagai aplikasi Pemdi utama (Panduan hal. 461-471) |
| **I-15** Keterpaduan PPB | 4% | F-06, F-07 | `/opd/{slug}`, Beranda | Peta proses bisnis layanan digital (Panduan hal. 489-500) |
| **I-16** Integrasi Aplikasi | 4% | F-06 | `/opd/{slug}`, API | Dokumentasi integrasi API (Panduan hal. 503-511) |
| **I-17** Portal Layanan Digital | 4% | Semua fitur | Semua halaman | URL portal, jumlah layanan, statistik pengguna (Panduan hal. 514-524) |
| **I-18** Interoperabilitas Data | 3% | — | API endpoint | Dokumentasi API (Panduan hal. 528-536) |
| **I-19** Fasilitas Dukungan | **10%** | F-02, F-03, F-04, F-11, F-12, F-14 | Semua halaman, `/lapor`, `/faq`, `/bantuan` | Helpdesk, SLA, SP4N LAPOR, SOP (Panduan hal. 541-553) |
| **I-20** Kepuasan Pengguna | **15%** | F-01, F-02, F-10 | `/dashboard-kepuasan`, Semua halaman | Dashboard SKM, widget feedback, survei online (Panduan hal. 556-572) |

### Visual Prioritas (Bubble Chart — untuk referensi)

```
BOBOT 15% ┤ ● I-20 (SKM Dashboard)
         │
BOBOT 10% ┤ ● I-19 (Helpdesk + Rating)
         │
BOBOT  5% ┤ ● I-1   ● I-5   ● I-13
         │
BOBOT  4% ┤ ● I-15  ● I-16  ● I-17  ● I-8
         │
BOBOT  3% ┤ ● I-18
         └─────────────────────────────
           M U D A H ─── S U L I T
```

---

## 11. Daftar Halaman Final

### Halaman Existing — Dipertahankan

| Halaman | Perubahan | Prioritas |
|---------|-----------|-----------|
| `/` (Beranda) | Tambah Rating Widget, PPB Chain, Rekomendasi Tracker | P0 |
| `/layanan` | Tambah Rating Widget, Quick SKM | P0 |
| `/opd` | Tambah tabel link ke halaman detail | P0 |
| `/probis` | Tambah download PDF, Rating Widget | P1 |
| `/pemdi` | **REWRITE** — 20 indikator, kalkulator, checklist | **P0** |
| `/spbe` | Tambah proyeksi Pemdi, Rating Widget | P1 |
| `/skm` | Tambah "Lihat Dashboard Kepuasan →" CTA | P0 |
| `/lapor` | Tambah status tracker, SP4N LAPOR banner | **P0** |
| `/faq` | Restruktur jadi knowledge base | P1 |
| `/tanya` | Tetap sebagai chatbot | P2 |
| `/glosarium` | Tambah kategori, search | P2 |
| `/kebijakan-privasi` | Tambah PDP compliance | P2 |

### Halaman Baru — Harus Dibuat

| Halaman | Deskripsi | Prioritas |
|---------|-----------|-----------|
| `/dashboard-kepuasan` | Dashboard SKM publik real-time | **P0** |
| `/opd/[slug]` | 52 halaman detail OPD (SSG) | **P0** |
| `/bantuan` | Pusat bantuan: FAQ, SLA, kontak, status | P1 |
| `/data` | Open data: dataset publik | P2 |

### Halaman Admin — Existing

| Halaman | Perubahan |
|---------|-----------|
| `/admin` | Dashboard admin — existing, dipertahankan |
| `/api/admin/laporan` | PATCH status laporan — existing |
| `/api/admin/skm` | GET semua SKM — existing |

---

## 12. Data & API

### 12.1 Data Statis (`data/*.json`)

| File | Isi | Ukuran | Untuk Halaman |
|------|-----|--------|--------------|
| `data/opd.json` | Master data: OPD (52), SPBE, PPB (3 level), Rekomendasi | ~15 KB | Beranda, OPD, PPB, SPBE |
| `data/pemdi.json` | 7 aspek, 20 indikator, target, baseline | ~16 KB | Pemdi |

**Tidak ada perubahan struktur data** — kedua file sudah mencakup seluruh konten yang dibutuhkan.

### 12.2 Data Dinamis (Supabase)

| Table | Isi | Untuk Fitur |
|-------|-----|-------------|
| `skm_responses` | Jawaban SKM dari pengguna | Dashboard SKM |
| `laporan` | Pengaduan masyarakat | Status tracker |
| `rating_feedback` | **Baru** — Rating dari widget | Dashboard rating |
| `evidence_status` | **Baru** — Status bukti dukung | Checklist indikator |

---

## 13. Glosarium Istilah PRD

| Istilah | Definisi |
|---------|----------|
| **Pemdi** | Pemerintah Digital — kerangka baru evaluasi transformasi digital pemerintah daerah (PermenPANRB 8/2026) |
| **SPBE** | Sistem Pemerintahan Berbasis Elektronik — kerangka lama (PermenPANRB 59/2020, dicabut) |
| **PPB** | Peta Proses Bisnis — hierarki 3 level proses bisnis pemerintah (Permenpan 19/2018) |
| **SKM** | Survei Kepuasan Masyarakat — instrumen ukur kepuasan layanan publik |
| **I-1 s.d. I-20** | 20 indikator evaluasi Pemdi sesuai PermenPANRB 8/2026 |
| **P0/P1/P2** | Prioritas fitur: P0=Critical, P1=High, P2=Medium |
| **SSG** | Static Site Generation — generate HTML saat build time |
| **ISR** | Incremental Static Regeneration — update halaman statis tanpa rebuild total |
| **CSP** | Content Security Policy — header keamanan browser |

---

## Lampiran A — Acuan dari Panduan Peningkatan Indeks Pemdi

Setiap bagian PRD ini merujuk langsung ke halaman tertentu dari dokumen Panduan:

| Bagian PRD | Rujukan Panduan |
|-----------|-----------------|
| Proyeksi indeks (1.3) | Hal. 714-728 — Rumus perhitungan + target realistis |
| I-19 Helpdesk (4.3) | Hal. 541-553 — Dokumentasi helpdesk, SLA, SP4N LAPOR |
| I-20 Dashboard (4.1) | Hal. 556-572 — Dashboard publik, widget feedback, quick win |
| I-1 Arsitektur (5.2) | Hal. 284-296 — Dokumen arsitektur, rencana aksi |
| I-15 PPB (5.1) | Hal. 489-500 — Peta proses bisnis layanan digital |
| I-17 Portal (7.0) | Hal. 514-524 — Portal sebagai bukti dukung |
| Rekomendasi Prioritas (5.3) | Hal. 169-203 — 7 rekomendasi prioritas 🔴🟡🟢 |
| Roadmap (9.0) | Hal. 650-728 — 4 fase: Fondasi, Implementasi, Konsolidasi, Penilaian |
| Struktur Tim (3.2) | Hal. 207-244 — Peran per OPD + indikator |

---

## Lampiran B — Perubahan dari Portal Saat Ini

| Aspek | Sebelum PRD | Sesudah PRD |
|-------|-------------|-------------|
| Fokus | Portal informasi pemerintah | Portal bukti dukung + dashboard transparansi |
| SKM | Form isian saja | Form + Dashboard publik real-time |
| PPB | 4 `<details>` di Beranda | Visual chain L0→L1→L2 interaktif |
| OPD | Tabel 52 baris | 52 halaman detail lengkap |
| Indikator Pemdi | 7 aspek saja | 20 indikator + target + status |
| Rekomendasi | Statis | Tracker dengan progress |
| Feedback | Tidak ada | Rating widget di SEMUA halaman |
| Helpdesk | Form Lapor saja | Tracker + SLA + SP4N LAPOR |
| Data | — | Open data publik |

---

*PRD ini disusun berdasarkan:*
- *Panduan Peningkatan Indeks Pemdi Aceh Tengah (Diskominfo, Juni 2026) — 848 baris*
- *PermenPANRB Nomor 8 Tahun 2026 tentang Evaluasi Kinerja Pemerintah Digital*
- *Data riil e-Keurani BKPSDM di data/opd.json + data/pemdi.json*
- *Source code existing di pages/* dan components/*
