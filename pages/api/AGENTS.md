# pages/api/ — DOX

## Purpose

REST API endpoints — serverless functions di Next.js. Digunakan untuk operasi data yang membutuhkan backend (write/read dari server).

## Ownership — 4 API

| Route | File | Method | Fungsi | Status |
|-------|------|--------|--------|--------|
| `/api/opd` | `opd.js` | GET | Daftar lengkap OPD (52 entries) + data umum | ✅ Active |
| `/api/spbe` | `spbe.js` | GET | Data SPBE 2025 (4 domain, 47 indikator) | ✅ Active |
| `/api/requirement` | `requirement.js` | GET | 83 requirements PPB (12 kategori, 3 fase) | ✅ Active |
| `/api/lapor` | `lapor.js` | GET • POST | Simpan & lihat laporan warga | ✅ Active |

## API Contracts

### `GET /api/opd` — Semua OPD
- **Response (200):** `{ daftar: [...], metadata: {...} }`
- **Data source:** `data/opd.json`

### `GET /api/spbe` — Data SPBE
- **Response (200):** `{ indeks, kategori, predikat, domain: [...] }`
- **Data source:** `data/opd.json` key `spbe`

### `GET /api/requirement` — Requirements
- **Response (200):** `{ requirements: [...], total: 83, kategori: [...] }`
- **Data source:** `data/requirement.json`

### `POST /api/lapor` — Kirim laporan baru
**Request:**
```json
{ "kategori": "layanan|portal|saran|pungli|lain", "pesan": "string (wajib)", "kontak": "string (opsional)" }
```
**Response (201):**
```json
{ "success": true, "data": { "id": "LAPOR-XXXXXX", "kategori": "...", "pesan": "...", "status": "baru" } }
```

### `GET /api/lapor` — Ambil semua laporan
**Response (200):**
```json
{ "success": true, "data": { "laporan": [...], "total": 0 } }
```

## Notes
- Semua API read-only (GET) baca dari file JSON statis — cocok untuk Vercel serverless
- `/api/lapor` write (POST) menggunakan filesystem → **persist hanya di development**
- Untuk Vercel production: POST tetap berfungsi dengan `tersimpan: false` + tracking ID
- Upgrade ke database eksternal (Turso/Supabase) untuk persist penuh
