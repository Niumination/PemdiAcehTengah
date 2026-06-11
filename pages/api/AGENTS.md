# pages/api/ — DOX

## Purpose

REST API endpoints — serverless functions di Next.js. Digunakan untuk operasi data yang membutuhkan backend (write/read dari server).

## Ownership — 1 API

| Route | File | Method | Fungsi | Status |
|-------|------|--------|--------|--------|
| `/api/lapor` | `lapor.js` | GET • POST | Simpan & lihat laporan warga (LaporWidget backend) | ✅ Active |

## API Contracts

### `POST /api/lapor` — Kirim laporan baru

**Request:**
```json
{
  "kategori": "layanan|portal|saran|pungli|lain",
  "pesan": "string (wajib)",
  "kontak": "string (opsional)"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "LAPOR-XXXXXX",
    "kategori": "layanan",
    "pesan": "...",
    "status": "baru",
    "dibuat": "2026-07-01T..."
  }
}
```

### `GET /api/lapor` — Ambil semua laporan

**Response (200):**
```json
{
  "success": true,
  "data": {
    "laporan": [...],
    "total": 0
  }
}
```

## Notes
- Storage: file `data/laporan.json` (filesystem) — **persist hanya di development**
- Untuk production (Vercel) perlu upgrade ke database eksternal (Turso/Supabase)
- Format tracking ID: `LAPOR-{timestamp_base36}`
