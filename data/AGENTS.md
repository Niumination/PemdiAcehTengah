# data/ — DOX

## Purpose

Single source of truth portal — file JSON berisi seluruh data terstruktur Pemda Aceh Tengah.

## Ownership

- `opd.json` — Satu-satunya file data. Dibaca oleh semua pages dan API routes.

## Local Contracts

### Struktur opd.json

```json
{
  "metadata": {
    "pemda": "Pemerintah Kabupaten Aceh Tengah",
    "ibukota": "Takengon",
    "bupati": "Drs. Haili Yoga, M.Si.",
    "wakil_bupati": "Muchsin Hasan",
    "periode": "2025-2030",
    "sumber": "Laporan SPBE 2025 KemenPANRB + Data Diskominfo"
  },
  "opd": {
    "total_perangkat_daerah": 52,
    "total_instansi": 38,
    "total_kecamatan": 14,
    "total_asn": 4955,
    "instansi": [ /* 38 OPD */ ],
    "kecamatan": [ /* 14 kecamatan */ ]
  },
  "spbe": {
    "tahun": 2025,
    "indeks": 2.59,
    "kategori": "Cukup",
    "domain": { /* 4 domain + 47 indikator */ },
    "kekuatan": [ /* area strengths */ ],
    "rekomendasi_prioritas": [ /* 3 recommendations */ ]
  },
  "probis": {
    "level0": { /* Visi & Misi */ },
    "level1": { /* 24 Urusan Konkuren */ },
    "level2": { /* Kategori Proses Bisnis */ }
  },
  "rekomendasi": [ /* 7 items with timeline */ ],
  "startup": {
    "nama": "Pemdi Aceh Tengah",
    "versi": "1.0.0",
    "lisensi": "MIT"
  }
}
```

### Key Fields
- `opd.instansi[]` — Array 38 objek: `{ id, nama, singkatan, level, urusan, alamat, website }`
- `opd.kecamatan[]` — Array 14 string nama kecamatan
- `spbe.domain` — 4 domain: kebijakan (2.30), tata_kelola (1.70), manajemen (2.00), layanan (3.67)
- `probis.level1.urusan[]` — 24 urusan konkuren dengan OPD terkait
- `rekomendasi[]` — 7 item: `{ id, judul, prioritas, timeline, dampak, kesulitan, status }`

## Work Guidance
- **JANGAN edit opd.json langsung tanpa validasi** — ini single source of truth
- Untuk update data: edit opd.json, lalu update halaman + API yang terdampak
- Format: valid JSON, UTF-8 without BOM
- Setelah update: `npm run build` untuk verifikasi tidak ada error import

## Verification
- `python3 -c "import json; d=json.load(open('data/opd.json')); print('OK:', len(d.keys()), 'keys')"` — harus sukses
- Setiap halaman & API yang bergantung pada file ini harus render/respond dengan benar

## Child DOX Index

Tidak ada child — leaf node. Single file.
