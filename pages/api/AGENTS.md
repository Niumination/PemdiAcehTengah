# pages/api/ — DOX

## Purpose

REST API endpoints — serverless functions di Next.js. Digunakan untuk operasi data yang membutuhkan backend (write/read dari server).

**Baru: Database Supabase untuk persist penuh** — bukan lagi filesystem.

## Ownership — 7 API

| Route | File | Methods | Fungsi | Status |
|-------|------|---------|--------|--------|
| `/api/opd` | `opd.js` | GET | Daftar lengkap OPD (52 entries) + data umum | ✅ Active |
| `/api/spbe` | `spbe.js` | GET | Data SPBE 2025 (4 domain, 47 indikator) | ✅ Active |
| `/api/requirement` | `requirement.js` | GET | 83 requirements PPB (12 kategori, 3 fase) | ✅ Active |
| `/api/lapor` | `lapor.js` | POST • PATCH • GET | Kirim laporan warga + update status (PATCH) + lihat daftar → Supabase | ✅ Active |
| `/api/skm` | `skm.js` | GET • POST | Survei Kepuasan Masyarakat → Supabase | ✅ **BARU** |
| `/api/admin/laporan` | `admin/laporan.js` | GET | Daftar laporan (admin-only, Bearer token) → Supabase | ✅ **BARU** |
| `/api/admin/skm` | `admin/skm.js` | GET | Data SKM (admin-only, Bearer token) → Supabase | ✅ **BARU** |

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
{ "kategori": "saran|keluhan|pertanyaan|apresiasi|bug|lainnya|layanan|portal|pungli", "pesan": "string (min 5)", "kontak": "string (opsional)", "halaman": "string (opsional)", "turnstileToken": "string (opsional)" }
```
**Response (201):**
```json
{ "success": true, "tersimpan": true, "data": { "id": "LAPOR-...", "kategori": "...", "status": "baru", "dibuat": "..." } }
```
**Keamanan:** sanitasi HTML, rate-limit 5/menit/IP, Turnstile anti-bot, hash IP.

### `PATCH /api/lapor` — Update status laporan
Digunakan oleh admin untuk mengubah status laporan.
**Request (admin-only):**
```json
{ "id": "LAPOR-...", "status": "baru|diproses|selesai|ditolak" }
```
**Headers:** `Authorization: Bearer <ADMIN_TOKEN>`
**Response (200):** `{ "success": true, "tersimpan": true }`
**Keamanan:** memerlukan Bearer token admin — dicek via `requireAdmin()` dari `lib/adminAuth.js`.

### `GET /api/lapor?id=LAPOR-xxx` — Lacak status laporan (BARU)
**Query params:** `id` (string, required) — ID laporan (format: `LAPOR-xxx`)
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "LAPOR-xxx",
    "kategori": "keluhan",
    "pesan": "...",
    "status": "baru|diproses|selesai|ditolak",
    "dibuat": "2026-06-14T10:00:00.000Z",
    "diupdate": "2026-06-14T12:00:00.000Z",
    "respon_admin": "Terima kasih, sedang diproses"
  }
}
```
**Error (404):** `{ "success": false, "error": "Laporan tidak ditemukan" }`

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

### `GET /api/admin/laporan` — Daftar laporan (admin)
**Response (200):** `{ "data": [...], "total": number }`
**Query params:** `status` (filter), `limit` (default 100), `offset` (default 0)
**Headers:** `Authorization: Bearer <ADMIN_TOKEN>`
**Keamanan:** Admin-only — validasi Bearer token via `requireAdmin()`.

### `GET /api/admin/skm` — Data SKM (admin)
**Response (200):** `{ "data": [...], "total": number }`
**Query params:** `limit` (default 100), `offset` (default 0)
**Headers:** `Authorization: Bearer <ADMIN_TOKEN>`
**Keamanan:** Admin-only — validasi Bearer token via `requireAdmin()`.

## Admin Authentication

Endpoint `/api/admin/*` dan `PATCH /api/lapor` memerlukan autentikasi admin via **Bearer token**:

| Mekanisme | Detail |
|-----------|--------|
| **Header** | `Authorization: Bearer <ADMIN_TOKEN>` |
| **Token** | Nilai env `ADMIN_TOKEN` (fallback: `'admin'` untuk development) |
| **Validasi** | `lib/adminAuth.js` — `requireAdmin(req)` |
| **Gagal** | HTTP 401 `{ error: 'Unauthorized', loginUrl: '/admin?login=1' }` |

## Notes
- **POST routes** menggunakan Supabase — butuh env `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
- **Tanpa Supabase:** API tetap hidup → return 503 dengan pesan jelas
- **Keamanan:** Setiap route punya rate-limit per IP + sanitasi input + Turnstile verification
- **Admin auth:** Bearer token dari env `ADMIN_TOKEN` — dicek di `lib/adminAuth.js`
- **Upgrade:** Eksekusi `db/schema.sql` di Supabase SQL Editor untuk setup database

## Verification
```bash
curl https://pemdi-aceh-tengah.vercel.app/api/opd                → HTTP 200 + JSON
curl https://pemdi-aceh-tengah.vercel.app/api/spbe               → HTTP 200 + JSON indeks
curl https://pemdi-aceh-tengah.vercel.app/api/skm                → HTTP 200 + JSON ringkasan (jika Supabase ready)
curl -H "Authorization: Bearer <ADMIN_TOKEN>" https://pemdi-aceh-tengah.vercel.app/api/admin/laporan   → HTTP 200 + JSON (admin)
curl -H "Authorization: Bearer <ADMIN_TOKEN>" https://pemdi-aceh-tengah.vercel.app/api/admin/skm       → HTTP 200 + JSON (admin)
curl -X PATCH -H "Authorization: Bearer <ADMIN_TOKEN>" -H "Content-Type: application/json"   -d '{"id":"LAPOR-test","status":"diproses"}'   https://pemdi-aceh-tengah.vercel.app/api/lapor                  → HTTP 200 + JSON (admin)
```
