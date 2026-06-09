# docs/ — DOX

## Purpose

Dokumentasi proyek — riset, referensi, requirements. Semua file markdown untuk dokumentasi manusia dan AI.

## Ownership

| File | Ukuran | Isi |
|------|--------|-----|
| `requirement-peta-proses-bisnis.md` | 16.9 KB | 83 item kebutuhan data/API/akses untuk PPB real — 12 kategori, 3 fase |
| `riset-peta-proses-bisnis-permenpan-19-2018.md` | 20 KB | Framework PPB: Level 0-2, SIPOC, BPMN, template Simalungun |
| `riset-data-aceh-tengah.md` | 11.8 KB | Data spesifik: visi-misi, 8 misi HAMAS, 17 prioritas, OPD, urusan konkuren |
| `Panduan_Peningkatan_Indeks_Pemdi_Aceh_Tengah.md` | — | Panduan strategis peningkatan indeks SPBE |

## Local Contracts

### requirements docs (`requirement-peta-proses-bisnis.md`)
- **12 Kategori**: A (Data Kelembagaan) sampai L (Data Pendukung)
- **3 Prioritas**: 🔴 WAJIB (7 item), 🟡 SANGAT DIBUTUHKAN (1), 🟢 PENTING (3), ⚪ PENDUKUNG (1)
- **3 Fase**: Q3 2026, Q4 2026 - Q1 2027, 2027
- **Output**: Dokumen PPB formal (Level 0-2), dashboard interaktif

### riset docs
- Dokumen referensi — sumber untuk konten portal
- Framework hukum (Permenpan 19/2018) + data faktual daerah
- Template Simalungun sebagai referensi format PPB

### Archive docs (`docs.old/`)
- `riset-aceh-tengah.md` — Profil daerah (geografi, demografi, potensi)
- `struktur-opd.md` — 50 OPD dengan detail jumlah ASN per unit
- TIDAK di-index di DOX — legacy, baca jika perlu konteks historis

## Work Guidance
- Dokumentasi baru: buat file `.md` di `docs/`, update index ini
- Gunakan Bahasa Indonesia
- Format: markdown dengan tabel, heading terstruktur
- Jangan simpan rahasia/API keys di docs

## Verification
- Semua file markdown bisa dibaca dengan `cat` atau `read_file`
- Link ke dokumen lain valid (relative path)

## Child DOX Index

Tidak ada child — leaf node. Semua file flat di direktori ini (kecuali docs.old/).
