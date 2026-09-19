# Reposisi Pemdi Aceh Tengah — Arah Opsi B (Disetujui Pemilik)

> **Tanggal keputusan:** 19 September 2026
> **Sumber:** `Penilaian_Kelayakan_Adopsi_Prototipe_Pemdi_Aceh_Tengah.md` (dalam `reposisi-pemdi.zip`)
> **Status:** AKTIF — seluruh pekerjaan selanjutnya mengikuti benang merah ini

---

## 1. Keputusan

Prototipe **tidak diadopsi sebagai "Portal Resmi Layanan Digital"**. Sebagian besar indikator Pemdi (46% bobot) tidak bisa disentuh website — ia menilai *kematangan kelembagaan*, bukan tampilan.

Reposisi menjadi **tiga produk** yang berbeda peran:

| Produk | Akses | Tujuan |
|--------|-------|--------|
| **B1. Kokpit Pemdi** | Internal (ASN/Tim Asesor) | Mesin Penilaian Mandiri: kelola 250 butir bukti, PIC OPD, unggah berkas, ekspor laporan |
| **B2. Dasbor Transparansi** | Publik | Tampilkan predikat **resmi**, SKM **resmi**, SLA layanan **resmi**, log perubahan layanan |
| **B3. Komponen Terintegrasi** | Publik | Komponen yang dilebur ke Alpukat Gayo & sistem resmi (bukan berdiri sendiri) |

---

## 2. Tiga Produk & Pekerjaan

### B1. Kokpit Pemdi — Perangkat Kerja Internal (PRIORITAS TERTINGGI)

**Pertahankan & kembangkan:**

- Pemetaan 250 butir bukti ke 20 indikator × L1–L5
- Status & catatan audit per butir
- PIC per OPD
- Checklist persiunggah ke portal evaluasi
- Kalkulator rumus resmi (`lib/pemdiNilai.js`)
- Modul kriteria L1–L5 (`data/modul-indikator.json`)

**Tambahkan:**

- Unggah berkas bukti (PDF asli, bukan hanya status)
- Riwayat versi & audit trail
- Penugasan & tenggat per OPD
- Ekspor laporan Penilaian Mandiri (PDF)
- Reminder triwulanan
- Akses internal (SSO/akun ASN)

**Bukti langsung:** narasi I1 (tata kelola terkoordinasi) & I4 (kolaborasi lintas OPD).

### B2. Dasbor Transparansi — Halaman Publik

**Tampilkan:**

- Predikat SPBE/Pemdi **resmi** (bukan hitungan mandiri)
- Progres rencana aksi Pemdi
- Hasil **SKM resmi** per unit/layanan (ditarik dari SKM Online Pemkab)
- Status SLA layanan digital **resmi**
- Log perubahan layanan (L4)

**Bukti langsung:** I20 L3 ("dasbor untuk setiap layanan") & L4.

**Penempatan:** subdomain `pemdi.acehtengahkab.go.id` atau menu di `acehtengahkab.go.id`.

### B3. Komponen yang Dilebur ke Sistem Resmi

| Komponen saat ini | Tujuan integrasi | Indikator |
|-------------------|------------------|-----------|
| Widget rating/umpan balik | Dipasang **di dalam** Alpukat Gayo & layanan OPD | I20 L2 |
| FAQ + asisten virtual | Menjadi *helpdesk* Alpukat Gayo | I19 L2 |
| Fitur Lapor + tiket | **Diganti** embed/API SP4N-LAPOR! | I19 L3 |
| Direktori layanan | Katalog yang **menautkan** ke Alpukat Gayo/OSS/SIAK | I17 |
| PPB interaktif | Lampiran visual dari dokumen PPB yang ditetapkan | I15 |

---

## 3. Prasyarat Wajib (8 Item)

Sebelum adopsi resmi dalam bentuk apa pun:

| # | Prasyarat | Indikator |
|---|-----------|-----------|
| 1 | **Hapus label "Portal Resmi"** sampai ada SK penetapan. Ganti "Indeks 0,38 Terverifikasi" → "Simulasi Penilaian Mandiri (belum dinilai asesor)" | K7, K8 |
| 2 | Migrasi ke domain `.go.id` dan infrastruktur Pemda/PDN/awan pemerintah | I14, K6 |
| 3 | Bersihkan data layanan: hapus SIUP/TDP/IMB, validasi OPD, hapus SLA fiktif atau hubungkan ke sumber pemantauan | K2, I19 |
| 4 | Sesuaikan SKM ke **9 unsur Permenpan 14/2017** atau tarik data dari SKM Online resmi | K5, I20 |
| 5 | Integrasikan/ganti fitur Lapor dengan **SP4N-LAPOR!** | K4, I19 |
| 6 | DPIA, penunjukan PPDP, *consent* eksplisit, kebijakan privasi yang menyebut pengendali & lokasi data | K9, I8 |
| 7 | Formalkan SDLC: KAK, uji kelaikan/UAT, BAST, penetapan unit pengelola, pencatatan di inventaris aplikasi & Arsitektur | I13 |
| 8 | Serah terima kode & pengetahuan ke Bidang E-Government; tetapkan minimal 2 pengelola | K10 |

---

## 4. Yang Harus Diperbaiki Dari Kondisi Saat Ini

| # | Masalah | Perbaikan |
|---|---------|-----------|
| K1 | Belum ada pengguna riil (2 responden, 1 uji coba) | Fokus pada layanan yang dipakai warga (Alpukat Gayo), bukan portal ini |
| K2 | Data layanan usang (SIUP/TDP/IMB masih ada), SLA fiktif | Hapus izin OSS-RBA yang sudah diganti NIB, hapus SLA tanpa sumber |
| K4 | Kanal Lapor paralel, tidak terhubung SP4N | Ganti dengan embed/API SP4N-LAPOR! |
| K5 | SKM 8 unsur (tidak sesuai Permenpan 14/2017) | Tambahkan unsur ke-8 "Penanganan Pengaduan, Saran dan Masukan" |
| K6 | Hosting Vercel + Supabase (luar negeri) | Migrasi ke infrastruktur pemerintah/PDN |
| K7 | Klaim "Portal Resmi" tanpa SK | Ganti judul sampai ada penetapan |
| K8 | Angka "Indeks 0,38 Terverifikasi" dipublikasikan | Ganti menjadi "Simulasi Penilaian Mandiri" |
| K9 | Tanpa DPIA, PPDP, consent eksplisit | Lengkapi perlindungan data pribadi |
| K10 | Tanpa dokumen SDLC formal pemerintah | Buat KAK, uji kelaikan, BAST |

---

## 5. Prioritas Kerja (Setelah Reposisi)

### Prioritas 1 — Aspek 7 Kepuasan Pengguna (25% — pengungkit terbesar)
1. Jalankan **SKM Online sesuai Permenpan 14/2017** untuk Alpukat Gayo & layanan OPD (target N memadai, olah triwulankan, libatkan 1 kelompok rentan + 1 CSO)
2. Pasang widget umpan balik **di dalam** Alpukat Gayo
3. Bentuk **SK tim teknis pengelolaan pengalaman pengguna**, publikasikan **dasbor per layanan**, laksanakan *mystery shopper*
4. Susun **SOP layanan digital dengan rincian SLA**, bangun **pemantauan SLA otomatis**, integrasikan pengaduan ke **SP4N-LAPOR!**
5. Kumpulkan **data transaksi layanan digital 1 tahun**

### Prioritas 2 — Aspek 3 Data & Aspek 4 Keamanan (masing-masing 15%)
6. Koordinasi Bappeda/BPS/BIG/BSSN untuk memastikan **Indeks SDI, EPSS, SJIG, IKASANDI** terisi
7. **PDP:** SK PPDP/DPO, strategi implementasi, SOP pemrosesan, ROPA, DPIA
8. **Audit internal keamanan & TIK** oleh Inspektorat + Persandian dengan LHA dan tindak lanjut
9. Aktifkan CSIRT: register insiden, laporan penanganan

### Prioritas 3 — Aspek 6 Keterpaduan (15%) & Aspek 1 Tata Kelola (10%)
10. Isi **Arsitektur Pemdi di SIAP Digital** untuk seluruh layanan prioritas — prasyarat 7 indikator sekaligus
11. Pastikan **substansi RAN Pemdi masuk RPJMD/Renstra/Renja**
12. Tetapkan **PPB dengan Perbup**, masukkan ke Arsitektur
13. Integrasikan Alpukat Gayo dengan **Portal Nasional Pelayanan Publik / INApas** dan siapkan data untuk **Dasbor Presiden**

### Prioritas 4 — Aspek 2 Penyelenggara & Aspek 5 Teknologi (masing-masing 10%)
14. Bimtek kompetensi digital untuk **>90% ASN pengelola**
15. Hidupkan **Forum Koordinasi Pemdi** berkala dengan notulensi
16. Dokumentasi **SDLC untuk setiap aplikasi** dan **migrasi ke PDN/awan pemerintah**

---

## 6. Referensi Regulasi

- Permenpan RB 8/2026 (Evaluasi Kinerja Pemdi)
- Permenpan RB 14/2017 (Pedoman SKM)
- Permenpan RB 19/2018 (Peta Proses Bisnis)
- Permenpan RB 62/2018 & Perpres 76/2013 (SP4N-LAPOR!)
- Perpres 95/2018 (SPBE)
- PP 71/2019 Pasal 20 (residensi data PSE Lingkup Publik)
- Permenkominfo 5/2015 (domain .go.id)
- PP 5/2021 (OSS-RBA/NIB), PP 16/2021 (PBG)
- UU 27/2022 (Pelindungan Data Pribadi)

---

## 7. Catatan Implementasi

- **B1 Kokpit** memakai stack yang sudah ada (`/pemdi`, `/modul-indikator`, `pemdiNilai.js`) dengan penambahan fitur internal
- **B2 Dasbor** di-redirect/di-embed dari domain resmi (`.go.id`) dengan data resmi
- **B3 Komponen** secara bertahap dilebur ke Alpukat Gayo — prototipe tidak lagi menjadi portal layanan publik
- Domain `vercal.app` hanya untuk pengembangan, bukan produksi resmi
