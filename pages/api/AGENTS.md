# pages/api/ — DOX

## Purpose

REST API read-only — serverless functions Next.js yang membaca `data/*.json` atau mem-proxy PDF JDIH. **Tidak ada database / penulisan data** sejak reposisi 22 Sep 2026 (API Supabase persona publik — lapor, skm, feedback, admin — dihapus; arsip tag `arsip/persona-publik-2026-09`).

## Ownership — 5 API

| Route | File | Methods | Fungsi | Status |
|-------|------|---------|--------|--------|
| `/api/opd` | `opd.js` | GET | Daftar lengkap OPD (52 entries) + data umum | ✅ Active |
| `/api/spbe` | `spbe.js` | GET | Data SPBE 2025 (4 domain, 47 indikator) | ✅ Active |
| `/api/requirement` | `requirement.js` | GET | 83 requirements PPB (12 kategori, 3 fase) | ✅ Active |
| `/api/proxy-pdf` | `proxy-pdf.js` | GET | Proxy PDF `https://jdih.acehtengahkab.go.id/*` (allowlist domain) agar bisa di-iframe same-origin | ✅ Active |
| `/api/health` | `health.js` | GET | Cek kesehatan: app + integritas data (`pemdi.json` 20 indikator ⇔ `modul-indikator.json` 20 modul), `mode: "internal"`; 200 sehat / 503 gagal | ✅ Active |

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

### `GET /api/proxy-pdf?url=` — Proxy PDF JDIH
- **400** tanpa `url`; **403** bila bukan `https://jdih.acehtengahkab.go.id/`; sukses → `Content-Type: application/pdf`, cache 1 jam

### `GET /api/health` — Kesehatan
- **Response (200):** `{ status: "ok", app, data, indikator: 20, modul: 20, mode: "internal", checkedAt }`
- **503** bila data tidak terbaca / indikator ≠ 20 atau `total_modul` = 0

## Notes
- Semua respons ikut mendapat `X-Robots-Tag: noindex, nofollow` dari `middleware.js`
- Menambah API tulis (mis. CMS admin — Patch 4 rencana) wajib: auth server-side, rate limit, sanitasi, dan pembaruan DOX ini + `AGENTS.md` root §Security

## Verification
```bash
curl https://pemdi-aceh-tengah.vercel.app/api/opd          → HTTP 200 + JSON
curl https://pemdi-aceh-tengah.vercel.app/api/spbe         → HTTP 200 + JSON indeks
curl https://pemdi-aceh-tengah.vercel.app/api/requirement  → HTTP 200 + JSON 83
curl https://pemdi-aceh-tengah.vercel.app/api/health       → HTTP 200 {"status":"ok","mode":"internal"}
curl -o /dev/null -w '%{http_code}' https://pemdi-aceh-tengah.vercel.app/api/skm   → 404
```
