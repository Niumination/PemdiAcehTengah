# Rancangan Portal Pemdi Aceh Tengah
## Berdasarkan "Panduan Peningkatan Indeks Pemdi Aceh Tengah" (Diskominfo, Juni 2026)
### — serta PermenPANRB 8/2026 dan data riil e-Keurani BKPSDM

> **Tujuan:** Portal ini harus MENAIKKAN Indeks Pemdi Kabupaten Aceh Tengah.
> Setiap halaman, setiap komponen, setiap data — harus berdampak langsung pada
> bukti dukung evaluasi Pemdi. Bukan sekadar website informasi.

---

## 🔴 ANALISIS MASALAH — Ketidaksesuaian Portal Saat Ini

### Masalah #1: Missing Core Feature — SKM Dashboard Publik (I-20, Bobot 15%)

**Apa kata Panduan (hal. 556-572)?**
> "Publikasikan dashboard publik hasil survei kepuasan — ini tiga langkah yang bisa
> menaikkan nilai indikator 20 dari 1,5 menjadi 2,5–3,0 dalam waktu singkat."

**Apa realita portal saat ini?**
- ✅ Halaman `/skm` ada — form survei multi-step dengan 29 pertanyaan
- ❌ **TIDAK ADA dashboard publik** hasil survei — nilai SKM, tren, grafik
- ❌ Tidak ada widget feedback/rating di portal
- ❌ Tidak ada publikasi real-time kepuasan masyarakat
- ❌ **Padahal I-20 adalah bobot TERBESAR (15%) dari seluruh evaluasi Pemdi**

**DAMPAK:** Portal kehilangan BUDAYA untuk indikator terpenting. Tanpa dashboard
publik, nilai I-20 tidak bisa naik ke level 3.0 yang ditargetkan.

---

### Masalah #2: PPB di Beranda Tidak Representatif (I-15, Bobot 4%)

**Apa kata Panduan (hal. 489-500)?**
> "Peta proses bisnis layanan digital — bukti dukung untuk I-15. Susun proses bisnis
> layanan prioritas (PTSP, kependudukan, dll.)."

**Apa realita portal saat ini?**
- ✅ Halaman `/probis` bagus — PPB 3 level (L0: Visi Misi, L1: 34 Urusan, L2: 37 Proses)
- ❌ **Beranda hanya 4 `<details>`** — tidak menunjukkan hierarki PPB secara visual
- ❌ Tidak ada visual chain L0→L1→L2 yang menarik di Beranda
- ❌ Tidak ada keterkaitan langsung antara proses bisnis dengan halaman OPD
- ❌ Informasi redundan: Layanan Publik ada di halaman sendiri, terpisah dari PPB

**DAMPAK:** Portal tidak bercerita tentang "bagaimana pemerintah bekerja" secara visual.
PPB adalah fondasi Pemdi — harus visible di Beranda.

---

### Masalah #3: Pemdi Dashboard Tanpa Proyeksi Target (I-1, Bobot 5%)

**Apa kata Panduan (hal. 102-133)?**
> Struktur 7 aspek × 20 indikator dengan bobot dan target spesifik.
> Target minimal 2,50 (Baik) — proyeksi dari baseline SPBE 2025.

**Apa realita portal saat ini?**
- ✅ 7 aspek Pemdi sudah ditampilkan dengan nilai
- ❌ **Tidak ada perbandingan target vs baseline** secara visual
- ❌ Tidak ada kalkulator proyeksi — "jika aspek X naik ke Y, indeks jadi berapa?"
- ❌ Tidak ada breakdown per indikator (20 indikator) — hanya 7 aspek
- ❌ Tidak ada timeline target (Fase 1→2→3→4)

**DAMPAK:** Pengunjung (termasuk tim asesor) tidak bisa melihat progress dan arah
perbaikan secara sekilas.

---

### Masalah #4: Tidak Ada Evidence Room untuk Bukti Dukung (Cross-cutting)

**Apa kata Panduan (hal. 273-279)?**
> "Prinsip umum bukti dukung: Dokumen resmi tanda tangan pejabat, SK sudah
> diundangkan, screenshot dengan URL, data dari sistem resmi."

**Apa realita portal saat ini?**
- ❌ Tidak ada halaman/tempat untuk menampilkan bukti dukung yang sudah dikumpulkan
- ❌ Tidak ada link ke dokumen kebijakan (SK, Perbup, SOP) — yang bisa diakses publik
- ❌ Tidak ada checklist yang menunjukkan status kesiapan per indikator

**DAMPAK:** Tim asesor harus cari bukti dukung terpisah. Portal seharusnya menjadi
**etalase bukti dukung** yang paling mudah diakses.

---

### Masalah #5: Rekomendasi Tidak Trackable

**Apa kata Panduan (hal. 169-203)?**
> 7 rekomendasi prioritas dengan dampak, kesulitan, timeline, dan PIC.

**Apa realita portal saat ini?**
- ✅ Rekomendasi ditampilkan di Beranda
- ❌ Tidak ada status tracking ("Belum dimulai", "Sedang dikerjakan", "Selesai")
- ❌ Tidak ada kaitan antara rekomendasi dan indikator Pemdi
- ❌ Tidak ada tombol "Tandai Selesai" atau laporan progress

---

### Masalah #6: Data OPD Tidak Link ke PPB (I-15, I-16)

**Apa kata Panduan (hal. 207-244)?**
> "Mapping peran per OPD terhadap indikator Pemdi" — setiap OPD punya fungsi spesifik.

**Apa realita portal saat ini?**
- ✅ Halaman `/opd` ada dengan daftar 52 OPD
- ✅ OPD bisa difilter
- ❌ **Tidak ada kaitan langsung antara OPD dan proses bisnis yang dijalankannya**
- ❌ Tidak ada halaman detail per OPD (setiap OPD = halaman statis `/opd/{slug}` sedang error)
- ❌ Pengguna tidak bisa melihat "OPD ini mengelola urusan apa, proses bisnis apa, indikator apa"

**DAMPAK:** OPD hanya daftar nama — padahal bukti dukung I-15 dan I-16 membutuhkan
dokumentasi per OPD.

---

### Masalah #7: Tidak Ada Integrasi Satu Data Indonesia (I-5, Bobot 5%)

**Apa kata Panduan (hal. 349-363)?**
> "SK Walidata, daftar data prioritas, metadata, forum data — bukti dukung I-5."

**Apa realita portal saat ini?**
- ❌ Tidak ada publikasi dataset (open data)
- ❌ Tidak ada link ke portal Satu Data Indonesia
- ❌ Tidak ada metadata yang bisa diunduh publik
- ❌ Tidak ada dokumentasi forum data

---

### Masalah #8: Tidak Ada Publikasi SLA & Helpdesk Monitoring (I-19, Bobot 10%)

**Apa kata Panduan (hal. 541-553)?**
> "Sistem pemantauan SLA (dashboard/log), SOP dengan SLA tertulis, laporan pemenuhan SLA"

**Apa realita portal saat ini?**
- ❌ Tidak ada SLA yang dipublikasikan di portal
- ❌ Tidak ada dashboard uptime/respons time
- ❌ Tidak ada knowledge base yang terstruktur
- ❌ SP4N LAPOR ada tapi tidak di-highlight sebagai integrasi nasional

---

## ✅ KOREKSI PEMAHAMAN — Dua Kerangka Regulasi

```
┌─────────────────────────────────────────────────────┐
│            PORTAL PEMDI ACEH TENGAH                   │
├─────────────────────────────────────────────────────┤
│                                                       │
│  KERANGKA A: Permenpan 19/2018  │  KERANGKA B: Permenpan 8/2026  │
│  ─────────────────────────────  │  ─────────────────────────────  │
│  APA: Cara menyusun PPB         │  APA: Cara evaluasi Pemdi       │
│  RUANG LINGKUP: Proses Bisnis   │  RUANG LINGKUP: Indeks Pemdi    │
│  OUTPUT: PPB Level 0-1-2        │  OUTPUT: 7 aspek, 20 indikator  │
│  KETERKAITAN PORTAL:             │  KETERKAITAN PORTAL:             │
│  • PPB display → I-15            │  • Dashboard kepuasan → I-20   │
│  • OPD mapping → I-15, I-16     │  • SKM online → I-20           │
│                                  │  • Helpdesk/lapor → I-19       │
│  DUA-DUANYA TETAP BERLAKU        │  • Portal → I-17               │
│  (tidak saling menggantikan)     │  • Data publikasi → I-5        │
│                                  │  • PPB display → I-15          │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 RANCANGAN PORTAL BARU — Berdampak Langsung ke Indeks Pemdi

### Prinsip Dasar

1. **SETIAP halaman = bukti dukung untuk ≥ 1 indikator Pemdi**
2. Prioritaskan konten yang **langsung dipakai tim asesor**
3. **Data real → tampilkan langsung** (bukan placeholder)
4. **Dashboard publik** untuk kepuasan pengguna — ini paling penting (15%)
5. Hierarki navigasi = hierarki dampak Pemdi

---

## STRUKTUR PORTAL (DARI PENTING KE DUKUNGAN)

```
┌──────────────────────────────────────────────────────┐
│                    BERANDA                             │
│  (Navigasi + Ringkasan Eksekutif + CTA Utama)         │
│  🔴 Relevansi: I-17 Portal Layanan Digital             │
│  🔴 I-20 Dashboard Publik, I-19 Fasilitas Dukungan    │
└──────────────────────┬───────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌──────────────┐ ┌──────────┐ ┌──────────────┐
│  KELOMPOK A   │ │KELOMPOK B│ │ KELOMPOK C   │
│  🔴 PRIORITAS │ │ 🟡        │ │ 🟢            │
│  (50% bobot)  │ │(30%)     │ │ (20%)        │
├──────────────┤ ├──────────┤ ├──────────────┤
│ SKM Dashboard│ │ PPB       │ │ Tentang      │
│ Helpdesk/    │ │ Explorer  │ │ Kebijakan    │
│   Dukungan   │ │ OPD Profil│ │   Privasi    │
│ Rating Widget│ │ Indeks    │ │ Glosarium    │
│ Lapor/Saran  │ │   Pemdi   │ │ Roadmap      │
│              │ │ SPBE      │ │ Rekomendasi  │
│              │ │   Monitor │ │              │
└──────────────┘ └──────────┘ └──────────────┘
```

---

### KELOMPOK A: 🔴 PRIORITAS UTAMA (50% Bobot Pemdi)

#### A1. 📊 Dashboard Kepuasan Publik — I-20 (15%), I-19 (10%)
**DAMPAK: 25% dari total bobot Pemdi. INI YANG PALING PENTING.**

| Fitur | Bukti Dukung untuk |
|-------|-------------------|
| Grafik SKM real-time (per triwulan) | I-20: Dashboard publik hasil survei |
| Rating bintang per layanan (1-5) | I-20: Widget feedback di semua layanan |
| Analisis sentimen pengaduan | I-20: Pemanfaatan AI/analisis |
| Tren kepuasan bulanan | I-20: Publikasi data historis |
| Filter per OPD/periode | I-20: Detail per layanan |

**Yang HARUS DIBUAT:**
1. Halaman `/dashboard-kepuasan` — publik, real-time
2. Widget `<RatingWidget />` di setiap halaman layanan
3. Ekspor data SKM (PDF/CSV) untuk bukti dukung
4. Perbandingan target (3.0) vs realisasi

**Data:** Dari Supabase table `skm_responses` yang sudah ada.

---

#### A2. 🆘 Helpdesk & Dukungan Pengguna — I-19 (10%)
**DAMPAK: 10% dari bobot Pemdi.**

| Fitur | Bukti Dukung untuk |
|-------|-------------------|
| Status pengaduan tracker (real-time) | I-19: Dashboard SLA |
| Knowledge base terstruktur (FAQ + Glosarium) | I-19: Dokumentasi helpdesk |
| SLA publik per layanan | I-19: SOP dengan SLA |
| Statistik respons time | I-19: Laporan pemenuhan SLA |
| Integrasi SP4N LAPOR | I-19: Bukti koneksi portal nasional |

**Yang HARUS DIBUAT:**
1. Halaman `/bantuan` — hub helpdesk (FAQ + kontak + SLA + tracker)
2. Upgrade halaman FAQ jadi knowledge base dengan kategori
3. Status tracker: "Pengaduan #123 — Sedang diproses oleh Diskominfo"
4. Banner/link ke SP4N LAPOR (`https://www.lapor.go.id/`)

**Data:** Dari Supabase table `laporan` yang sudah ada.

---

#### A3. ⭐ Rating Widget — I-19 (10%), I-20 (15%)
**DAMPAK: Cross-cutting untuk kedua indikator kepuasan.**

| Fitur | Bukti Dukung untuk |
|-------|-------------------|
| Rating bintang di setiap halaman | I-20: Mekanisme umpan balik di semua layanan |
| Tombol "Apakah membantu?" ya/tidak | I-19: Fasilitas dukungan |
| Form cepat (3 klik) | I-20: Survei kepuasan ringan |

**Yang HARUS DIBUAT:**
1. `<RatingWidget />` komponen — floating di pojok kanan bawah
2. Tampil di semua halaman (layout)
3. Simpan ke Supabase table baru `rating_feedback`
4. Minimal: "Apakah informasi ini membantu? 👍 / 👎"

---

#### A4. 📝 Lapor / Saran — I-19 (10%)
✅ **SUDAH ADA** — halaman LaporWidget dengan form multi-kategori.
**Yang PERLU DITAMBAH:**
1. 🔴 **Status tracking publik** — "Laporan #P001 sedang dalam verifikasi"
2. 🔴 **Integrasi SP4N LAPOR** — link bukti koneksi nasional
3. SLA per kategori laporan (infrastruktur: 3 hari, layanan: 1 hari)

---

### KELOMPOK B: 🟡 STRUKTUR UTAMA (30% Bobot Pemdi)

#### B1. 🗺️ PPB Explorer — I-15 (4%), I-17 (4%)
**DAMPAK: 8%**

✅ Halaman `/probis` sudah BAGUS — 3 level PPB lengkap.
**Yang PERLU:**
1. 🔴 **Beranda** — ganti 4 `<details>` dengan visual chain L0→L1→L2 yang interaktif
2. 🔴 **Kaitan OPD-PPB** — setiap urusan/proses harus bisa diklik ke halaman OPD
3. 🔴 **Download PDF** PPB — untuk bukti dukung resmi
4. 🔴 **Sumber data** — tampilkan "Data berdasarkan Permenpan 19/2018" untuk legitimasi

---

#### B2. 🏛️ OPD Profile & Detail — I-15 (4%), I-16 (4%)
**DAMPAK: 8%**

✅ Halaman `/opd` ada dengan tabel 52 OPD.
❌ Halaman detail `/opd/{slug}` ERROR (404/blank).

**Yang HARUS DIBUAT:**
1. 🔴 **Halaman per OPD** — `pages/opd/[slug].js` untuk SSG (generate 52 halaman)
2. Setiap halaman OPD menampilkan:
   - Nama, level, singkat, jumlah ASN
   - **Urusan yang dikelola** (dari PPB Level 1)
   - **Proses bisnis yang dijalankan** (dari PPB Level 2)
   - **Layanan yang disediakan** (dari JSON)
   - **Indikator Pemdi terkait** (dari pemdi.json)
3. Link dari PPB explorer langsung ke halaman OPD terkait

---

#### B3. 📈 Dashboard Indeks Pemdi — I-1 (5%), I-17 (4%)
**DAMPAK: 9%**

✅ Halaman `/pemdi` sudah ada dengan 7 aspek + detail modal.
❌ Tidak ada breakdown per indikator (20 indikator).

**Yang PERLU:**
1. 🔴 **Tampilkan 20 indikator** (bukan hanya 7 aspek) dengan nilai + target
2. 🔴 **Kalkulator proyeksi** — slider untuk lihat dampak jika aspek X naik
3. 🔴 **Target vs baseline** — perbandingan visual Fase 1→2→3→4
4. 🔴 **Checklist bukti dukung** per indikator
5. Tabel dengan format penamaan file bukti dukung (Panduan hal. 817-827)

---

#### B4. 📊 SPBE Monitor — I-1 (5%), I-17 (4%)
**DAMPAK: 9%**

✅ SPBE gauge + 4 domain bars sudah ada di Beranda.
**Yang PERLU:**
1. 🔴 **Tambahkan proyeksi Pemdi** dari baseline SPBE ke target
2. 🔴 **Gap analysis** — "Aceh Tengah vs rata-rata Kabupaten (2.99)"
3. 🔴 **Highlight indikator kritis (nilai=1)** yang sudah diperbaiki

---

### KELOMPOK C: 🟢 PELENGKAP (20% Bobot Pemdi)

#### C1. Rekomendasi Tracker — I-1 (5%)
✅ 7 rekomendasi sudah tampil.
❌ Tidak ada status progress.

**Yang PERLU:**
1. Status per rekomendasi: 🔴 Belum | 🟡 Proses | 🟢 Selesai
2. Kaitan ke indikator Pemdi (misal: "Rekomendasi #1 → I-15, I-17")
3. Timeline vs realisasi

#### C2. Roadmap Pemdi — I-1 (5%)
✅ Ada di halaman `/pemdi` sebagai TimelineRoadmap.
**Yang PERLU:**
1. Tampilkan di Beranda juga
2. Checklist fase 1-4 dengan status

#### C3. Kebijakan Privasi — I-8 (4%)
✅ SUDAH ADA.
**Yang PERLU:**
1. 🔴 **Tambahkan compliance PDP** — sebutkan UU 27/2022, consent, hak subjek data
2. 🔴 **Tambahkan SK PPDP** (Pejabat Pelindung Data Pribadi) jika sudah terbit

#### C4. Open Data / Satu Data Indonesia — I-5 (5%)
‼️ **BELUM ADA sama sekali.**
**Yang HARUS DIBUAT:**
1. Halaman `/data` — publikasi dataset yang bisa diunduh
2. Metadata per dataset (nama, sumber, update, format)
3. Link ke portal Satu Data Indonesia
4. Link ke portal JDIH Aceh Tengah

#### C5. Glosarium — I-19 (10%)
✅ SUDAH ADA — 200+ istilah. Bagus untuk knowledge base.
**Yang PERLU:**
1. 🔴 **Kategorisasi** — Istilah Pemdi, SPBE, TIK, Hukum
2. 🔴 **Search** — lebih baik
3. 🔴 **Tautan antar istilah** — related terms

---

## PRIORITAS IMPLEMENTASI

### Fase 🚀 1: "Quick Win" (Selesai dalam 1-2 hari)

| # | Item | Dampak | Bobot |
|---|------|--------|-------|
| 1 | **Rating Widget** — floating di semua halaman | I-20: Feedback | 15% |
| 2 | **SKM Dashboard Publik** — dari data Supabase | I-20: Dashboard | 15% |
| 3 | **Status laporan tracker** — "Laporan #X dalam proses" | I-19: Helpdesk | 10% |
| 4 | **SP4N LAPOR banner/link** di halaman Lapor | I-19: Koneksi nasional | 10% |
| 5 | **Indikator breakdown** di halaman Pemdi — 20 indikator | I-1: Transparansi | 5% |
| 6 | **OPD detail pages** — `/opd/[slug].js` generate 52 halaman | I-15, I-16: Keterpaduan | 8% |

**Total dampak jika 6 item ini selesai:** **63% dari bobot Pemdi** terpengaruh langsung.

### Fase 🚀 2: "Fondasi" (Minggu 1-2)

| # | Item | Dampak |
|---|------|--------|
| 7 | **PPB Explorer di Beranda** — visual chain interaktif | I-15 |
| 8 | **Kalkulator proyeksi Pemdi** di /pemdi | I-1 |
| 9 | **Rekomendasi Tracker** — status + progress | I-1 |
| 10 | **SLA publik** per layanan | I-19 |
| 11 | **Perbaikan FAQ jadi knowledge base** | I-19 |

### Fase 🚀 3: "Lengkap" (Minggu 3-4)

| # | Item | Dampak |
|---|------|--------|
| 12 | **Halaman Open Data** /data — publikasi dataset | I-5 |
| 13 | **Export PDF PPB** untuk bukti dukung | I-15 |
| 14 | **Glosarium kategori + search** | I-19 |
| 15 | **Dashboard uptime/respons SLA** | I-19 |

---

## SPESIFIKASI TEKNIS PER-HALAMAN YANG BARU

### 1. Beranda (index.js) — Struktur Baru

```
Section 1: Hero (AwardHero) — 4 stats, 2 CTA
Section 2: Quick Wins — Rating + SKM + Lapor + FAQ (4 card)
Section 3: ✅ SKM Dashboard Mini — nilai SKM + tren + "Lihat lengkap →"
Section 4: ✅ PPB Chain Visual — L0→L1→L2 interaktif
Section 5: ✅ SPBE Gauge — seperti existing
Section 6: ✅ Pemdi 7 Aspek — seperti existing
Section 7: ✅ Rekomendasi — dengan status tracker
Section 8: ✅ Roadmap mini
Section 9: ✅ Tentang Portal
Section 10: ✅ Footer
```

**Komponen Baru yang Dibutuhkan:**
- `<SkmDashboardMini />` — 3 stat SKM: rata-rata, responden, tren
- `<PpbChain />` — visual L0→L1→L2 dengan interaksi klik
- `<RatingWidget />` — floating di layout
- `<RecommendationTracker />` — dengan status bar

### 2. Halaman Baru: `/dashboard-kepuasan`

```
Section 1: Hero — "Kepuasan Masyarakat terhadap Layanan Digital"
Section 2: SKM Stat — Rata-rata, Jumlah Responden, Periode
Section 3: Grafik Tren — per bulan/triwulan (Recharts)
Section 4: Rating per Layanan — tabel + bar chart
Section 5: Analisis Sentimen — dari data pengaduan
Section 6: Filter — per OPD, per periode
Section 7: Export — PDF/CSV
```

**Data Source:** Supabase `skm_responses` table + table `rating_feedback` (baru)

### 3. Halaman Baru: `/bantuan`

```
Section 1: Hero — "Pusat Bantuan Layanan Digital"
Section 2: Kategori FAQ — expandable (existing FAQ + tambah)
Section 3: Cari — search FAQ
Section 4: Status Laporan — tracker by ID
Section 5: SLA per Layanan — tabel publik
Section 6: Kontak — WhatsApp, Telepon, Email
Section 7: SP4N LAPOR — link + embedded
Section 8: Panduan Pengguna — PDF/Video
```

### 4. Halaman Baru: `/opd/[slug].js` — SSG 52 halaman

```
Hero: Nama OPD, Level, Singkat
Stat: Jumlah ASN, Jumlah Layanan
Section 1: Urusan yang dikelola (dari PPB L1)
Section 2: Proses Bisnis (dari PPB L2)
Section 3: Layanan (dari data)
Section 4: Indikator Pemdi terkait
Section 5: Dokumen/Kebijakan
```

**Data:** dari `data/opd.json` — generate 52 static pages via `getStaticPaths`

### 5. Halaman Baru: `/data` — Open Data

```
Hero: "Data Terbuka Aceh Tengah"
Section 1: Dataset list — tabel (nama, sumber, update, format, download)
Section 2: Link Satu Data Indonesia
Section 3: Metadata per dataset
Section 4: Kaitan dengan SDI
```

---

## KESIMPULAN: DARI 7 MASALAH KE 6 QUICK WINS

| Masalah | Status | Quick Win | Bobot |
|---------|--------|-----------|-------|
| #1: SKM Dashboard | ❌ Missing | **Buat dashboard publik dari Supabase** | 15% |
| #2: PPB Visual | ❌ Lemah | **Chain visual di Beranda** | 4% |
| #3: Target vs Actual | ❌ Missing | **Breakdown 20 indikator** | 5% |
| #4: Evidence Room | ❌ Missing | **Mulai dari checklist per indikator** | — |
| #5: Rekomendasi Tracker | ❌ Missing | **Status bar per rekomendasi** | 5% |
| #6: OPD Detail | ❌ Error/404 | **Generate 52 halaman SSG** | 8% |
| #7: Satu Data | ❌ Missing | **Defer ke Fase 3** | — |
| #8: SLA/Helpdesk | ❌ Missing | **Rating widget + status tracker** | 10% |

**Total bobot yang bisa dinaikkan dalam Quick Win: 47% dari total evaluasi Pemdi.**

---

*Dokumen ini disusun berdasarkan:*
- *Panduan Peningkatan Indeks Pemdi Aceh Tengah (Diskominfo, Juni 2026)*
- *PermenPANRB Nomor 8 Tahun 2026 tentang Evaluasi Kinerja Pemerintah Digital*
- *Data riil e-Keurani BKPSDM (Mei 2026) di data/opd.json*
- *Source code pages/* dan components/* di JHcode/PemdiAcehTengah/*
