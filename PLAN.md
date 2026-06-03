# PLAN PROYEK: PORTAL DIGITAL ACEH TENGAH
## Startup Transformasi Digital Daerah — Menuju Aceh Tengah Satu Data

**Dibuat:** 4 Juni 2026
**Lokasi:** `/Users/zaryu/Desktop/Niumination/JHcode/PemdiAcehTengah/`
**Pipeline:** Niu-Flow (Hermes Agent + JCode AI)
**Framework Acuan:** Permenpan RB No. 19/2018, RPJMD Aceh Tengah 2025-2030

---

## 1. LATAR BELAKANG

Kabupaten Aceh Tengah saat ini dipimpin oleh **Bupati Haili Yoga & Wakil Bupati Muchsin Hasan** (periode 2025-2030) dengan visi:

> **"ACEH TENGAH ISLAMI, MAJU, SEJAHTERA, DAN BERKEADILAN"**

Pemerintah daerah telah meluncurkan program unggulan **"Aceh Tengah Satu Data"** yang bertujuan menyatukan seluruh basis data pemerintahan dalam satu platform terpadu. Program ini telah mendapatkan:
- Dukungan **Wakil Menteri Komdigi** (Nezar Patria) — pertemuan 8 Mei 2025
- Kerjasama strategis dengan **Amazon Web Services (AWS)** — pembahasan cloud infrastructure
- Target integrasi: Adminduk, Alibata, Sekolah Belangi, Pariwisata, e-Kinerja, Baitul Mal, PAD, Pajak Daerah

### 8 Misi Pembangunan (HAMAS):
1. Transformasi sosial masyarakat unggul & kompetitif
2. Transformasi ekonomi hijau & berkelanjutan
3. Penguatan transformasi tata kelola (reformasi birokrasi & pelayanan publik)
4. ...
5. ...
6. ...
7. Sarana & prasarana berkualitas & ramah lingkungan
8. Pembangunan berkelanjutan untuk Aceh Tengah maju

### Kondisi Saat Ini:
- **4.955 ASN** tersebar di **37 OPD** + 14 kecamatan
- Website OPD dan desa sudah aktif (penghargaan pengelola website terbaik)
- Program Satu Data masih dalam tahap perencanaan sistem terpadu
- Masih banyak proses bisnis manual/tradisional
- Perlu peta proses bisnis level 0-2 sesuai Permenpan 19/2018

---

## 2. REFERENSI DOKUMEN

Dokumen dari `~/Documents/Work/Probis Aceh Jaya/` yang dijadikan acuan:

| Dokumen | Kegunaan |
|---------|----------|
| Permenpan RB No. 19/2018 | Framework penyusunan peta proses bisnis instansi pemerintah |
| Pohon Kinerja Aceh Jaya.xlsx | Contoh pohon kinerja untuk pemetaan urusan konkuren |
| Probis Ajay.bpm | Contoh model BPMN proses bisnis |
| Peta Proses Bisnis Simalungun.xlsx | Contoh peta proses bisnis level 0-2 |
| Proses-Bisnis-Kota-Madiun.pdf | Contoh peta lintas fungsi (Cross Functional Map) & relasi bisnis |
| RPJMD Simalungun 2021-2026.pdf | Contoh dokumen perencanaan 5 tahunan |

---

## 3. ARSITEKTUR PORTAL DIGITAL ACEH TENGAH

### 3.1 Konsep Portal
Sebuah **portal web terpadu** yang menjadi **single entry point** untuk:
- Informasi publik & data terbuka (Satu Data)
- Layanan publik digital (perizinan, adminduk, pajak)
- Visualisasi proses bisnis pemerintah (transparansi tata kelola)
- Dashboard kinerja OPD & realisasi anggaran
- Rekomendasi perbaikan berbasis data

### 3.2 Struktur Halaman
```
PORTAL DIGITAL ACEH TENGAH
├── Beranda — Hero section, visi misi, statistik cepat
├── Tentang — Profil daerah, sejarah, geografis, demografi
├── Tata Kelola / Pemerintahan
│   ├── Struktur OPD (37 OPD + organisasi)
│   ├── Peta Proses Bisnis Level 0-2
│   ├── Pohon Kinerja & Indikator
│   └── Relasi Bisnis Lintas Fungsi
├── Layanan Publik
│   ├── Adminduk (Disdukcapil)
│   ├── Perizinan (DPMPTSP)
│   ├── Pajak Daerah (BPKAD)
│   ├── Baitul Mal
│   └── Satu Sehat
├── Program Unggulan
│   ├── Aceh Tengah Satu Data
│   ├── Sekolah Belangi
│   ├── Alibata (Baca Tulis Al-Quran)
│   └── Pariwisata Gayo
├── Data & Statistik
│   ├── Dashboard Real-time (APBD, Kinerja, SDM)
│   └── Open Data Portal
├── Rekomendasi — Rekomendasi transformasi digital
├── Startup & Inovasi — Peta jalan startup daerah
└── Kontak — Feedback & pengaduan
```

### 3.3 Target Fitur
- **Responsive Design** — mobile-first, akses dari kampung
- **Peta Proses Bisnis Interaktif** — visual BPMN dengan klik untuk detail
- **Dashboard Real-time** — grafis kinerja OPD, APBD, progres program
- **Sistem Autentikasi** — login untuk warga & ASN
- **Integrasi Satu Data** — API endpoint untuk data terbuka
- **Dark Mode / Gaming HUD** — sesuai preferensi UI user

---

## 4. STRUKTUR FILE PROYEK

```
/Users/zaryu/Desktop/Niumination/JHcode/PemdiAcehTengah/
├── PLAN.md                    ← Dokumen ini
├── README.md                  ← Gambaran umum proyek
├── docs/
│   ├── riset-aceh-tengah.md   ← Data lengkap daerah & pemerintah
│   ├── ref-permenpan19.md     ← Framework Permenpan 19/2018
│   └── struktur-opd.md        ← Detail 37 OPD + kecamatan
├── portal/                    ← Source code portal web
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
│       ├── img/               ← Ilustrasi & gambar
│       └── data/              ← Data statis JSON
├── probis/                    ← Dokumen pemetaan proses bisnis
│   ├── pohon-kinerja.md       ← Pohon kinerja Aceh Tengah
│   ├── peta-level-0.md        ← Proses bisnis level 0
│   ├── peta-level-1.md        ← Proses bisnis level 1
│   ├── peta-level-2.md        ← Proses bisnis level 2 (lintas fungsi)
│   └── rekomendasi.md         ← Rekomendasi perbaikan
├── output/                    ← Hasil pipeline
└── scripts/                   ← Script otomasi
```

---

## 5. RENCANA EKSEKUSI (PIPELINE NIUF-LOW)

### Fase 1: Riset & Dokumentasi (Manual)
1. Kompilasi data Aceh Tengah (demografi, OPD, RPJMD)
2. Pemetaan pohon kinerja berdasarkan urusan konkuren
3. Identifikasi proses bisnis utama & pendukung
4. Pembuatan konten rekomendasi

### Fase 2: Pembuatan Portal (Pipeline Niu-Flow Parallel)
**Batch 1 — Struktur Dasar** (3 subtask parallel):
- `#1`: Layout HTML + CSS utama (gaming HUD theme)
- `#2`: JavaScript interaktivitas (navigasi, dashboard)
- `#3`: Halaman Beranda + Tentang

**Batch 2 — Konten Tata Kelola** (3 subtask parallel):
- `#4`: Halaman Peta Proses Bisnis + Pohon Kinerja
- `#5`: Halaman Struktur OPD + Profil OPD
- `#6`: Halaman Layanan Publik

**Batch 3 — Data & Visualisasi** (3 subtask parallel):
- `#7`: Dashboard APBD & Realisasi Anggaran
- `#8`: Halaman Data & Statistik (open data)
- `#9`: Halaman Program Unggulan

**Batch 4 — Rekomendasi & Finishing** (2 subtask parallel):
- `#10`: Halaman Rekomendasi Transformasi Digital
- `#11`: Integrasi akhir, responsive fix, aksesibilitas

### Fase 3: Review & Deployment
1. Review konten oleh user/ahli tata kelola
2. GitHub sync
3. Deployment (GitHub Pages / hosting)

---

## 6. REKOMENDASI AWAL (DRAFT)

Berdasarkan referensi yang dipelajari, beberapa rekomendasi awal:

1. **Digitalisasi Peta Proses Bisnis** — Buat BPMN interaktif dari level 0-2 untuk seluruh OPD, mengacu Permenpan 19/2018
2. **Integrasi Satu Data** — Portal sebagai front-end tunggal yang terkoneksi dengan database Satu Data Aceh Tengah (kolaborasi AWS)
3. **Automasi Layanan Publik** — Digitalisasi adminduk, perizinan, pajak dalam satu portal dengan tracking real-time
4. **Dashboard Kinerja OPD** — Visualisasi real-time capaian Indikator Kinerja Utama (IKU) per OPD
5. **Open Data API** — Publikasi data terbuka yang bisa diakses startup dan developer lokal
6. **Talenta Digital** — Integrasi dengan program pengembangan coding & data management untuk pemuda Takengon
7. **Smart Kampung** — Fitur khusus untuk desa/kampung dengan akses offline-capable

---

## 7. PERTANYAAN UNTUK VERIFIKASI (SEBELUM EKSEKUSI)

Berikut poin yang perlu dikonfirmasi sebelum eksekusi:

**A. Ruang Lingkup:**
1. Portal ini untuk publik (warga Aceh Tengah) atau internal pemerintah?
2. Prioritas konten: mana yang harus didahulukan?

**B. Konten & Data:**
3. Apakah ada data spesifik RPJMD Aceh Tengah 2025-2030 yang sudah tersedia?
4. Siapa narasumber untuk validasi proses bisnis OPD?

**C. Teknis Portal:**
5. Target deployment: static hosting atau butuh backend?
6. Preferensi tema: gaming HUD (dark, neon) atau profesional pemerintahan?

**D. Bisnis & Startup:**
7. Portal ini akan menjadi startup — bagaimana model bisnisnya?
8. Target peluncuran kapan?

---

## 8. STATUS VERIFIKASI

| Komponen | Status | Keterangan |
|----------|--------|------------|
| Visi & Misi Aceh Tengah | ✅ Terkonfirmasi | Haili Yoga - Muchsin Hasan (HAMAS) |
| Program Satu Data | ✅ Terkonfirmasi | Dukungan AWS & Wamen Komdigi |
| Struktur OPD (37) | ✅ Terkonfirmasi | Data e-Keurani Mei 2026 |
| Referensi Probis | ✅ Tersedia | Aceh Jaya, Simalungun, Madiun |
| Framework Hukum | ✅ Tersedia | Permenpan 19/2018 |
| Plan Dokumen | ✅ Selesai | File ini |
| **Verifikasi User** | ⏳ **Menunggu** | **Interview sebelum eksekusi** |
