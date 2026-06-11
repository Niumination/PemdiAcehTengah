# Data — DOX

Single source of truth: `data/opd.json`. Struktur data mencakup metadata, OPD (52 entries), SPBE (47 indikator), Peta Proses Bisnis (Level 0-2, 78 proses), Rekomendasi (8 item), dan pemdi.json (7 aspek × 20 indikator).

## Source Data

Data berasal dari **e-Keurani BKPSDM** (sumber tunggal terharmonisasi):

| Sumber | Cakupan | Jumlah | Status |
|--------|---------|--------|--------|
| **e-Keurani BKPSDM** | Semua OPD + jumlah ASN | **52 entries** (38 instansi + 14 kecamatan) | ✅ Data riil Mei 2026 — **sumber tunggal** |

**Harmonisasi selesai ✅**: Data SPBE (38 instansi + 14 kecamatan) telah digabung dengan e-Keurani. Perbedaan:
- OPD yang **ditambahkan**: RSUD Datu Beru (466 ASN), Korpri (7), set OP migrated ke 50 entries
- OPD yang **digabung/direname**: 22 dinas hasil merger (Pariwisata+Pemuda, Perdagangan+Koperasi, Syariat Islam+Pendidikan Dayah)
- Format baru: `opd.daftar[]` flat array, bukan `instansi[]` + `kecamatan[]` terpisah

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

### OPD (Array — 52 entries di `opd.daftar`)

```json
{
  "id": 1,
  "nama": "Sekretariat Daerah",
  "level": "Staf|Badan|Dinas|Lembaga|Kecamatan",
  "singkat": "Setda",
  "jumlah_asn": 100,
  "urusan": "Sekretariat Daerah",
  "jenis": "instansi|kecamatan"
}
```
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

### Peta Proses Bisnis — `probis` di opd.json

⚠️ Data ProBis di `opd.json` saat ini:
- **Level 0**: 8 misi (+ label, deskripsi, sumber) — **data real Aceh Tengah** ✅
- **Level 1**: 35 urusan konkuren — **data real** ✅
- **Level 2**: 6 kategori × **78 proses** — **47/52 OPD tercakup** ✅ (Perencanaan 7, Pelaksanaan 20, Penganggaran 8, Monev 14, Pelayanan Publik 17, Pengawasan 12)

Permenpan 8/2026 TIDAK menggantikan Permenpan 19/2018 untuk PPB. Keduanya tetap berlaku:
- **Permenpan 19/2018** → Cara menyusun PPB: Level 0 (visi-misi), Level 1 (urusan konkuren), Level 2 (proses per OPD), BPMN, SIPOC, 4 jenis peta
- **Permenpan 8/2026** → Indikator **15. Keterpaduan Proses Bisnis Pemdi** (bobot 4%) sebagai bagian dari evaluasi Pemdi

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

- `opd.json` — master data (52 OPD dari e-Keurani BKPSDM ✅ harmonized)
- `AGENTS.md` — **file ini**
