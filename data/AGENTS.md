# Data — DOX

Single source of truth: `data/opd.json`. Struktur data terbagi dalam 5 layer: metadata, OPD, SPBE, Peta Proses Bisnis, dan Rekomendasi.

## Source Data

Data berasal dari 2 sumber yang **belum sepenuhnya harmonized**:

| Sumber | Cakupan | Jumlah | Status |
|--------|---------|--------|--------|
| **e-Keurani BKPSDM** | Semua OPD + jumlah ASN | **50 entries** (36 non-kecamatan + 14 kecamatan) | ✅ Data riil Mei 2026 |
| **SPBE Laporan 2025** | Instansi yang dinilai SPBE | **38 instansi + 14 kecamatan = 52 entries** | ⚠️ Tidak termasuk RSUD, Korpri, dan beberapa OPD |

**Gap OPD**: 12 OPD di e-Keurani tidak tercatat di data SPBE (RSUD Datu Beru 466 ASN, Korpri 7, MPU 13, MAG 8, Baitul Mal 6, MPD 6, Pertanahan 18, Syariat Islam-Dayah 35, Kesbangpol 15, Transmigrasi-TK 33, dll). `data/opd.json` saat ini pakai sumber SPBE (52 entries).

**Rekomendasi**: Update `data/opd.json` ke 50 OPD + jumlah ASN dari e-Keurani untuk akurasi.

## Struktur opd.json

### Metadata
```json
{
  "nama_daerah": "Kabupaten Aceh Tengah",
  "provinsi": "Aceh",
  "ibu_kota": "Takengon",
  "indeks_spbe": 2.59,
  "tahun": 2025,
  "bupati": "Drs. Haili Yoga, M.Si.",
  "wakil_bupati": "Muchsin Hasan, MSP",
  "visi": "ACEH TENGAH ISLAMI, MAJU, SEJAHTERA, DAN BERKEADILAN",
  "misi": [8 item — Transformasi Sosial, Ekonomi Hijau, Tata Kelola, Kondusifitas Syariah, Ketahanan Sosial Budaya, Pembangunan Kewilayahan, Sarpras Berkualitas, Kesinambungan Pembangunan],
  "total_asn": 4955,
  "jargon": "HAMAS (Haili Yoga + Muchsin Hasan)",
  "rpjmd": "Qanun No. 4 Tahun 2025 (2025-2029)"
}
```

### OPD (Array)

50 entries dari e-Keurani, dikelompokkan:
- **Unsur Staf Pemerintah** (3): Setda, Sekretariat DPRK, Inspektorat
- **Badan Daerah** (4): BKPSDM, Bappeda, BPKAD, BPBD
- **Dinas Daerah** (22): Pendidikan (1.974 ASN), Kesehatan (937), PUPR (61), Perkim (24), Satpol PP-WH (67), Sosial (22), Transmigrasi-TK (33), KB-PPPA (30), Pangan (0), LH (43), Disdukcapil (26), DPMK (32), Perhubungan (22), Diskominfo (29), Perdagangan KUKM (47), DPMPTSP (34), Pariwisata-PO (47), Perpustakaan-Arsip (36), Perikanan (56), Pertanian (114), Syariat Islam-Dayah (35), Pertanahan (18)
- **Lembaga Lainnya** (7): MPU (13), MAG (8), MPD (6), Baitul Mal (6), Korpri (7), RSUD Datu Beru (466), Kesbangpol (15)
- **Kecamatan** (14): Bebesen, Lut Tawar, Kebayakan, Bintang, Pegasing, Bies, Linge, Atu Lintang, Rusip Antara, Jagong Jeget, Silih Nara, Celala, Ketol, Kute Panang

### SPBE (47 Indikator — Format Lama Permenpan 59/2020)

**Baseline 2025 (akan diganti ke framework Pemdi Permenpan 8/2026)**:

| Domain | Nilai | Predikat |
|--------|-------|----------|
| Kebijakan SPBE | 2.30 | Cukup |
| Tata Kelola SPBE | 1.70 | Kurang |
| Manajemen SPBE | 1.00 | Kurang |
| Layanan SPBE | 3.75 | Sangat Baik |
| **Indeks SPBE** | **2.59** | **Cukup** |

**Indikator Kritis (Nilai=1)**: Arsitektur SPBE, Peta Rencana SPBE, Inovasi Proses Bisnis, Pembangunan Aplikasi, Pusat Data, **Semua Manajemen**, **Semua Audit TIK**.

**Indikator Kuat (Nilai≥3)**: Manajemen Data (4), Tim Koordinasi (3), Jaringan Intra (3), hampir semua Layanan Administrasi & Publik (4).

### Peta Proses Bisnis — Framework Baru Permenpan 8/2026

⚠️ **UPDATE**: Permenpan 8/2026 TIDAK menggantikan Permenpan 19/2018 untuk PPB. Keduanya tetap berlaku:

- **Permenpan 19/2018** → Cara menyusun PPB: Level 0 (visi-misi), Level 1 (urusan konkuren), Level 2 (proses per OPD), BPMN, SIPOC, 4 jenis peta
- **Permenpan 8/2026** → Indikator **15. Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi** (bobot 4%) sebagai bagian dari evaluasi Pemdi

Data PPB di opd.json saat ini masih **template generik** — perlu diisi data real Aceh Tengah.

### Rekomendasi (Array)

8 item prioritas perbaikan berdasarkan analisis baseline SPBE 2025.

## Framework Pemdi — Permenpan 8/2026

**7 Aspek, 20 Indikator, 5 Predikat Tingkat Kematangan**

| Aspek | Bobot | Indikator |
|-------|-------|-----------|
| 1. Tata Kelola & Manajemen | 10% | I1 Tata Kelola Pemdi (5%), I2 Manajemen Layanan Digital (5%) |
| 2. Penyelenggara | 10% | I3 SDM Pemdi (5%), I4 Kolaborasi Pemdi (5%) |
| 3. Data | 15% | I5 Tata Kelola Data (5%), I6 Info Geospasial (3%), I7 Statistik (3%), I8 Perlindungan Data Pribadi (4%) |
| 4. Keamanan Pemdi | 15% | I9 Audit Keamanan (4%), I10 Keamanan Pemdi (4%), I11 Kriptografi (3%), I12 Insiden Siber (4%) |
| 5. Teknologi Pemdi | 10% | I13 Aplikasi Pemdi (5%), I14 Infrastruktur Pemdi (5%) |
| 6. Keterpaduan Layanan | 15% | I15 Keterpaduan Proses Bisnis (4%), I16 Integrasi Aplikasi (4%), I17 Portal Layanan Digital (4%), I18 Interoperabilitas Data (3%) |
| 7. Kepuasan Pengguna | 25% | I19 Fasilitas Dukungan Pengguna (10%), I20 Pengelolaan Kepuasan Pengguna (15%) |

### Target Aceh Tengah: Indeks Pemdi ≥ 2,50 (Baik/Berkembang)

Proyeksi dari baseline SPBE 2025: ~2,375 (Cukup). Perlu kerja keras di Kepuasan Pengguna untuk capai 2,50.

## Regulasi Terkait

| Regulasi | Isi |
|----------|-----|
| Permenpan 19/2018 | Penyusunan Peta Proses Bisnis — Level 0-1-2, BPMN, template ✅ |
| Permenpan 8/2026 | Evaluasi Kinerja Pemerintah Digital — 7 aspek, 20 indikator ✅ BARU |
| UU 23/2014 | Pemerintahan Daerah — 24 urusan wajib + 8 urusan pilihan |
| UU 27/2022 | Pelindungan Data Pribadi (PDP) |
| Perpres 132/2022 | Arsitektur SPBE |
| Perpres 39/2019 | Satu Data Indonesia |
| Perpres 12/2025 | RPJMN 2025-2029 — dasar perubahan SPBE→Pemdi |
| Qanun No. 4/2025 | RPJMD Aceh Tengah 2025-2029 |

## File

- `opd.json` — master data (52 entries dari SPBE, perlu harmonisasi ke 50 OPD)
- `AGENTS.md` — **file ini**
