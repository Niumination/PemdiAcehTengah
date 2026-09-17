# lib/ — DOX

## Purpose
Utility server-side & shared — murni fungsi, tanpa React.

## Ownership — 9 modul

| Modul | File | Fungsi | Dipakai di |
|-------|------|--------|------------|
| **pemdiNilai** | `pemdiNilai.js` | Rumus resmi PermenPANRB 8/2026 — `nilaiIndikator` (level kontinu semua-lengkap, aturan berjenjang), `indeksAspek` Σ(wI×NI)/wA, `indeksPemdi` Σ(wA×IA), `predikatPemdi` (Tabel 4), `statistikBukti`, konstanta LEVEL/INDIKATOR_EKSTERNAL | `pemdi.js`, `modul-indikator.js`, `test/pemdiNilai.test.mjs` |
| **security** | `security.js` | `sanitizeText` (strip tag + limit), `hashIp` (SHA-256+salt), `rateLimit` (delegasi ke rate-limit-db), `generateLaporId` (LAPOR-YYYYMMDD-12hex) | semua API routes tulis |
| **rate-limit-db** | `rate-limit-db.js` | Rate limiter serverless — RPC atomic `bump_rate_limit` → fallback legacy upsert → fallback in-memory | via `security.js` |
| **adminAuth** | `adminAuth.js` | `requireAdmin` — Bearer vs ADMIN_PASSWORD/ADMIN_TOKEN, **constant-time compare** + rate limit login 5/menit | `api/admin/*`, `api/lapor.js` (PATCH) |
| **supabaseAdmin** | `supabaseAdmin.js` | Client Supabase service-role — **SERVER-ONLY, tidak pernah di bundle client** | semua API Supabase |
| **sanitize** | `sanitize.js` | `sanitizeHtml` — allowlist tag, tag dibangun ulang (atribut dibuang kecuali href tervalidasi SAFE_HREF: http(s)/`/`/`#`/mailto; blokir javascript:/data:/entitas) | `faq.js`, `tanya.js` (sebelum dangerouslySetInnerHTML) |
| **search-index** | `search-index.js` | Pembangun korpus Fuse.js dari semua data/*.json — dipanggil di getStaticProps | `cari.js` |
| **format** | `format.js` | `formatAngka`, `formatDesimal`, `gabung` — locale id-ID | lintas halaman |
| **slugify** | `slugify.js` | Slug URL konsisten | `opd/[slug].js`, `search-index.js` |

## Key Rules
- **Jangan pernah** mengimpor `supabaseAdmin.js` dari komponen client (service-role key)
- **Jangan pernah** render string HTML tanpa `sanitizeHtml`
- Perubahan `pemdiNilai.js` wajib `npm test` hijau (16 pin regresi: indeks 0,38 · proyeksi 2,29 · 250/47/4/199 bukti)
- SQL pendukung: `db/schema.sql` (tabel + view + RPC `skm_per_unit_stats`, `skm_tren_bulanan`, `skm_stats_dimensi`), `db/rate-limit-schema.sql` (tabel + RPC `bump_rate_limit`)
