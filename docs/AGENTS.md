# docs/ — DOX

## Purpose

Dokumentasi proyek — riset, referensi, requirements. Semua file markdown dan PDF untuk dokumentasi manusia dan AI.

## Ownership

| File | Ukuran | Isi |
|------|--------|-----|
| `requirement-peta-proses-bisnis.md` | 16.9 KB | 83 item kebutuhan data/API/akses untuk PPB real — 12 kategori, 3 fase |
| `Panduan_Peningkatan_Indeks_Pemdi_Aceh_Tengah.md` | 37.8 KB | Panduan strategis peningkatan indeks SPBE |
| `Indeks SPBE Aceh Tengah 2025.pdf` | 1.6 MB | Laporan resmi SPBE 2025 dari KemenPANRB — indeks 2.59, 47 indikator |
| `permenpanrb 8 2026.pdf` | 1.0 MB | Peraturan Menteri PANRB No. 8 Tahun 2026 — penyempurnaan/update Permenpan 19/2018 |

### Catatan: File Riset Sebelumnya

Dua file riset dari sesi sebelumnya **TIDAK** ada di direktori ini — masih di root proyek:
- `riset-peta-proses-bisnis-permenpan-19-2018.md` (root) — Framework PPB
- `riset-data-aceh-tengah.md` (root) — Data spesifik daerah

Keduanya perlu dipindah ke `docs/` jika masih relevan.

### Legacy: docs.old/

`docs.old/` berisi dua file dari versi portal sebelumnya — TIDAK terindex DOX, hanya referensi historis jika diperlukan:
- `riset-aceh-tengah.md` — Profil daerah (geografi, demografi, potensi)
- `struktur-opd.md` — 50 OPD dengan detail jumlah ASN per unit (sumber e-Keurani)

## Local Contracts

### Permenpan RB 8/2026 — Update Kritis
- File `permenpanrb 8 2026.pdf` adalah peraturan baru (2026) yang kemungkinan menyempurnakan Permenpan 19/2018
- **WAJIB dibaca** sebelum melanjutkan penyusunan PPB — bisa mengubah kerangka Level 0-2
- Baca dengan `vision_analyze` (PDF) untuk perbandingan dengan framework 19/2018

### Data SPBE
- `Indeks SPBE Aceh Tengah 2025.pdf` — Dokumen resmi dari KemenPANRB
- Validasi data opd.json dengan PDF ini jika ada perubahan

## Work Guidance
- Semua file dokumentasi — MD dan PDF — di direktori ini
- File baru: update Ownership table di sini
- Hindari duplikasi konten antar file
- Jika file sudah tidak relevan, pindah ke `docs.old/` atau hapus

## Verification
- Semua file bisa dibaca atau diakses path-nya
- PDF bisa di-`read_file` untuk metadata atau `vision_analyze` untuk isi

## Child DOX Index

Tidak ada child — leaf node. Semua file flat di direktori ini.
