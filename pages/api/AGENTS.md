# pages/api/ — DOX

## Purpose

REST API endpoints untuk data portal. Semua read-only, JSON responses.

## Ownership

| Endpoint | File | Deskripsi | Query Params |
|----------|------|-----------|-------------|
| `GET /api/opd` | `opd.js` | Data OPD instansi | `search`, `level`, `limit` |
| `GET /api/spbe` | `spbe.js` | Indeks & domain SPBE | none |
| `GET /api/requirement` | `requirement.js` | 83 item requirement PPB | none |

## Local Contracts

### API OPD (`opd.js`)
- **Source**: `data/opd.json` → `opdData.opd.instansi`
- **Params**:
  - `search` (string): filter by nama/urusan (case-insensitive)
  - `level` (comma-separated): filter by level instansi
  - `limit` (int): max results returned
- **Response**: `{ success, total, returned, metadata, data[] }`

### API SPBE (`spbe.js`)
- **Source**: `data/opd.json` → `spbeData.spbe`
- **Response**: `{ success, metadata, indeks, domain, kekuatan, rekomendasi_prioritas }`

### API Requirement (`requirement.js`)
- **Source**: `data/opd.json` (static data di file)
- **Response**: `{ summary[], categories[], outputs[], metadata }`

## Work Guidance
- Semua handler: `export default function handler(req, res)`
- Gunakan `@/data/opd.json` alias untuk import
- Response selalu `res.status(200).json(...)` dengan wrapper `{ success: true, ... }`
- Error handling: `res.status(400/404/500).json({ success: false, message })`

## Verification
- `curl https://pemdi-aceh-tengah.vercel.app/api/opd` → HTTP 200 + JSON
- `curl https://pemdi-aceh-tengah.vercel.app/api/spbe` → HTTP 200 + JSON indeks
- `curl https://pemdi-aceh-tengah.vercel.app/api/requirement` → HTTP 200 + JSON

## Child DOX Index

Tidak ada child — leaf node.
