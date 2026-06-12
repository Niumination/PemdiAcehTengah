# pages/api/ — DOX

## Purpose

REST API endpoints — serverless functions di Next.js. Digunakan untuk operasi data yang membutuhkan backend (write/read dari server).

**Baru: Database Supabase untuk persist penuh** — bukan lagi filesystem.

## Ownership — 5 API

| Route | File | Methods | Fungsi | Status |
|-------|------|---------|--------|--------|
| `/api/opd` | `opd.js` | GET | Daftar lengkap OPD (52 entries) + data umum | ✅ Active |
| `/api/spbe` | `spbe.js` | GET | Data SPBE 2025 (4 domain, 47 indikator) | ✅ Active |
| `/api/requirement` | `requirement.js` | GET | 83 requirements PPB (12 kategori, 3 fase) | ✅ Active |
| `/api/lapor` | `lapor.js` | POST | Kirim laporan warga → Supabase | ✅ Active |
| `/api/skm` | `skm.js` | GET • POST | Survei Kepuasan Masyarakat → Supabase | ✅ **BARU** |

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

### `POST /api/lapor` — Kirim laporan
**Request:**
```json
{ "kategori": "saran|keluhan|pertanyaan|apresiasi|bug|lainnya", "pesan": "string (min 5)", "kontak": "string (opsional)", "halaman": "string (opsional)", "turnstileToken": "string (opsional)" }
```
**Response (201):**
```json
{ "success": true, "tersimpan": true, "data": { "id": "LAPOR-...", "kategori": "...", "status": "baru", "dibuat": "..." } }
```
**Keamanan:** sanitasi HTML, rate-limit 5/menit/IP, Turnstile anti-bot, hash IP.

### `POST /api/skm` — Kirim survei
**Request:**
```json
{ "persyaratan": 1-4, "prosedur": 1-4, "waktu": 1-4, "biaya": 1-4, "produk": 1-4, "kompetensi": 1-4, "perilaku": 1-4, "sarana": 1-4, "layanan": "string (unit pelayanan)", "saran": "string (opsional)", "turnstileToken": "string (opsional)" }
```
**Response (201):** `{ "success": true, "tersimpan": true, "note": "Terima kasih! ..." }`
**Keamanan:** sanitasi, rate-limit 3/5 menit/IP, validasi nilai 1-4 per unsur, hash IP.

### `GET /api/skm` — Ringkasan SKM
**Response (200):** `{ "success": true, "data": { total_responden, rata_unsur, ikm } }`
**Note:** Memerlukan Supabase + view `skm_ringkasan` dari `db/schema.sql`.

## Notes
- **POST routes** menggunakan Supabase — butuh env `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
- **Tanpa Supabase:** API tetap hidup → return 503 dengan pesan jelas
- **Keamanan:** Setiap route punya rate-limit per IP + sanitasi input + Turnstile verification
- **Upgrade:** Eksekusi `db/schema.sql` di Supabase SQL Editor untuk setup database

## Verification
```bash
curl https://pemdi-aceh-tengah.vercel.app/api/opd    → HTTP 200 + JSON
curl https://pemdi-aceh-tengah.vercel.app/api/spbe   → HTTP 200 + JSON indeks
curl https://pemdi-aceh-tengah.vercel.app/api/skm    → HTTP 200 + JSON ringkasan (jika Supabase ready)
```
