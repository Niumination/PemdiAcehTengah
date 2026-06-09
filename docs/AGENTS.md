# Docs — DOX

Dokumentasi proyek Portal Digital Aceh Tengah. Berisi riset teknis, Panduan strategis, PDF regulasi, dan dokumen legacy.

## Struktur docs/

| File | Ukuran | Isi |
|------|--------|-----|
| `riset-peta-proses-bisnis-permenpan-19-2018.md` | 18,7 KB / 408 lines | **Framework PPB** — analisis lengkap Permenpan 19/2018: definisi, 8 prinsip, 4 tahap penyusunan, struktur Level 0-1-2-n, 4 jenis peta (Proses, Subproses, Relasi, Cross Functional), template BPMN vs flowchart, contoh implementasi 5 daerah (HSS, Paser, Malang, Cilegon, Banyuasin), keterkaitan dokumen, rekomendasi langkah praktis |
| `riset-data-aceh-tengah.md` | 10,5 KB / 255 lines | **Data spesifik Aceh Tengah** — visi-misi HAMAS, 8 misi, RPJMD Qanun No. 4/2025, struktur OPD (urusan konkuren 24+8), SPBE baseline 2023-2025, program transformasi digital (Satu Data, MPP, SIAT) |
| `docs/Panduan_Peningkatan_Indeks_Pemdi_Aceh_Tengah.md` | 37,8 KB / 848 lines | **Panduan strategis dari Diskominfo** — ringkasan SPBE 2025 Aceh Tengah (2,59), perubahan kerangka SPBE→Pemdi, struktur 7 aspek 20 indikator + bobot, analisis gap & prioritas 🔴🟡🟢, role per OPD, panduan teknis bukti dukung per indikator, roadmap 4 fase (12 bulan), target realistis 2,50-2,70, template SK & checklist |
| `docs/permenpanrb 8 2026.pdf` | 1,0 MB | **PERATURAN RESMI** — PermenPANRB No. 8 Tahun 2026 tentang Evaluasi Kinerja Pemerintah Digital. Diteken Menteri Rini Widyantini 1 Juni 2026, diundangkan 5 Juni 2026. Menggantikan Permenpan 59/2020. Berisi: 12 pasal + Lampiran Pedoman (46 halaman) — 7 aspek, 20 indikator lengkap dengan kriteria tiap level kematangan (1-5) + rumus perhitungan + proses evaluasi (Mandiri→Dokumen→Interviu→Visitasi) |
| `docs/Indeks SPBE Aceh Tengah 2025.pdf` | 1,6 MB | **LAPORAN RESMI** — Hasil Pemantauan SPBE 2025 Kab. Aceh Tengah dari KemenPANRB. Indeks 2,59 (Cukup), data 47 indikator lintas 4 domain |

## docs.old/ — Legacy Documentation

⚠️ TIDAK diindex DOX. Konten historis dari versi portal sebelumnya:

| File | Isi |
|------|-----|
| `docs.old/riset-aceh-tengah.md` (2,035 bytes) | Versi awal riset — lebih pendek, profil dasar Aceh Tengah |
| `docs.old/struktur-opd.md` (2,755 bytes) | **50 OPD dengan jumlah ASN** — sumber e-Keurani BKPSDM (4,955 ASN). SUMBER KEBENARAN untuk data OPD + ASN |

**Perbedaan penting**: `docs.old/struktur-opd.md` mencatat **50 OPD** dengan rincian ASN (total 4,955), sedangkan `data/opd.json` saat ini menggunakan data SPBE (52 entries = 38 instansi + 14 kecamatan). Rekomendasi: harmonisasi data OPD ke sumber e-Keurani.

## Riset di Root Proyek

Dua file riset utama ada di root (bukan di docs/), sudah terindex oleh root AGENTS.md:

- `riset-peta-proses-bisnis-permenpan-19-2018.md` — framework PPB lengkap (408 lines)
- `riset-data-aceh-tengah.md` — data spesifik Aceh Tengah (255 lines)

Keduanya sebaiknya dipindahkan ke `docs/` untuk konsistensi, tapi belum dipindah.

## Referensi Eksternal

| Dokumen | File / Lokasi |
|---------|---------------|
| Pohon Kinerja Aceh Jaya.xlsx | ~/Documents/Work/Probis Aceh Jaya/ |
| Probis Ajay.bpm | ~/Documents/Work/Probis Aceh Jaya/ |
| Peta Proses Bisnis Simalungun.xlsx | ~/Documents/Work/Probis Aceh Jaya/ |
| Proses-Bisnis-Kota-Madiun.pdf | ~/Documents/Work/Probis Aceh Jaya/ |
| RPJMD Simalungun 2021-2026.pdf | ~/Documents/Work/Probis Aceh Jaya/ |
| Permenpan 19/2018 Lampiran (.pdf) | /tmp/permenpan-lampiran.pdf (download riset) |

## File-File di docs/

- `Panduan_Peningkatan_Indeks_Pemdi_Aceh_Tengah.md` — panduan strategis 848 lines
- `permenpanrb 8 2026.pdf` — regulasi baru 2026 (1.0 MB)
- `Indeks SPBE Aceh Tengah 2025.pdf` — laporan resmi (1.6 MB)
- `AGENTS.md` — **file ini**
