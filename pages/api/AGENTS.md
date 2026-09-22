# pages/api/ — DOX

## Purpose

REST API read-only — serverless functions Next.js yang membaca `data/*.json` atau mem-proxy PDF JDIH. **Tidak ada database / penulisan data** sejak reposisi 22 Sep 2026 (API Supabase persona publik — lapor, skm, feedback, admin — dihapus; arsip tag `arsip/persona-publik-2026-09`).

## Ownership — 6 API baca + 3 auth + 5 admin (Patch 4)

> **CMS (22 Sep 2026)** — `lib/db.js` (Neon, tanpa ORM; tabel `butir_overlay`, `konten_tampilan`, `log_audit` dibuat otomatis `CREATE TABLE IF NOT EXISTS`), `lib/cmsAuth.js` (token HMAC-SHA256 stateless di cookie httpOnly `pemdi_cms`, 12 jam), `lib/overlay.js` (validasi + penggabungan murni, teruji). Tanpa `DATABASE_URL` semua API tulis → 503, baca tetap jalan. Nama butir/kriteria PermenPANRB tidak pernah dapat diubah lewat API.

| Route | File | Method | Fungsi | Auth |
|-------|------|--------|--------|------|
| `/api/auth/masuk` | `auth/masuk.js` | POST | `{peran, sandi, opd?}` → cookie sesi; rate-limit 10 percobaan/10 mnt/IP | — |
| `/api/auth/keluar` | `auth/keluar.js` | POST | hapus cookie | — |
| `/api/auth/sesi` | `auth/sesi.js` | GET | `{sesi, cmsAktif, dbAktif}` | — |
| `/api/admin/butir/[id]` | `admin/butir/[id].js` | PATCH | overlay butir; PJ hanya butir yang PJ-nya OPD sesi (`lib/pjButir.hitungButirOPD`), PJ tidak boleh ubah `pj` / set `diterima`; `res.revalidate` /dashboard /indikator /antrean | sesi |
| `/api/admin/konten/[kunci]` | `admin/konten/[kunci].js` | PUT | `marquee` (≤400) · `pengumuman` (≤600) · `tenggat` (YYYY-MM-DD) | koordinator |
| `/api/admin/overlay` | `admin/overlay.js` | GET | semua baris overlay + konten | sesi |
| `/api/admin/log` | `admin/log.js` | GET | 200 log audit terakhir | koordinator |
| `/api/admin/ekspor` | `admin/ekspor.js` | GET | unduh `catatan-mandiri.json` + overlay (`status_overlay`, `hash_dasar: terserap`) → simpan ke `data/catatan-mandiri.json`, jalankan rantai skrip regenerasi, commit | koordinator |

### API baca

| Route | File | Methods | Fungsi | Status |
|-------|------|---------|--------|--------|
| `/api/rk-data` | `rk-data.js` | GET | Payload Ruang Kendali (`lib/rkData.susunDataRK()`: indikator ringkas, antrean, bebanPJ, linimasa, OPD) — cache modul + `Cache-Control: s-maxage=3600`; dipakai `RKShell` pada halaman lama | ✅ Active (22 Sep 2026) |
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
