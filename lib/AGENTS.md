# lib/ — DOX

## Purpose
Utility server-side & shared — murni fungsi, tanpa React.

## Ownership — 9 modul

| Modul | File | Fungsi | Dipakai di |
|-------|------|--------|------------|
| **pemdiNilai** | `pemdiNilai.js` | Rumus resmi PermenPANRB 8/2026 — `nilaiIndikator` (level kontinu semua-butir-**diterima**, aturan berjenjang), `indeksAspek` Σ(wI×NI)/wA, `indeksPemdi` Σ(wA×IA), `predikatPemdi` (Tabel 4), `statistikBukti`/`statistikIndikator` (5 status), `STATUS_META`/`STATUS_BUKTI`/`statusMeta` (vokabuler `diterima·revisi·proses·draf·belum` — satu sumber untuk semua halaman), konstanta LEVEL/INDIKATOR_EKSTERNAL | `pemdi.js`, `modul-indikator.js`, `requirement.js`, `test/pemdiNilai.test.mjs` |
| **security** | `security.js` | `sanitizeText` (strip tag + limit), `hashIp` (SHA-256+salt), `rateLimit` (delegasi ke rate-limit-db), `generateLaporId` (LAPOR-YYYYMMDD-12hex) | semua API routes tulis |
| **rate-limit-db** | `rate-limit-db.js` | Rate limiter serverless — RPC atomic `bump_rate_limit` → fallback legacy upsert → fallback in-memory | via `security.js` |
| **adminAuth** | `adminAuth.js` | `requireAdmin` — Bearer vs `ADMIN_PASSWORD`, **constant-time compare** + rate limit login 5/menit | `api/admin/*`, `api/lapor.js` (PATCH) |
| **supabaseAdmin** | `supabaseAdmin.js` | Client Supabase service-role — **SERVER-ONLY, tidak pernah di bundle client** | semua API Supabase |
| **sanitize** | `sanitize.js` | `sanitizeHtml` — allowlist tag, tag dibangun ulang (atribut dibuang kecuali href tervalidasi SAFE_HREF: http(s)/`/`/`#`/mailto; blokir javascript:/data:/entitas) | `faq.js`, `tanya.js` (sebelum dangerouslySetInnerHTML) |
| **search-index** | `search-index.js` | Pembangun korpus Fuse.js dari semua data/*.json — dipanggil di getStaticProps | `cari.js` |
| **format** | `format.js` | `formatAngka`, `formatDesimal`, `gabung` — locale id-ID | lintas halaman |
| **slugify** | `slugify.js` | Slug URL konsisten | `opd/[slug].js`, `search-index.js` |

## Key Rules
- **Jangan pernah** mengimpor `supabaseAdmin.js` dari komponen client (service-role key)
- **Jangan pernah** render string HTML tanpa `sanitizeHtml`
- Perubahan `pemdiNilai.js` wajib `npm test` hijau (16 pin rumus — dari 20 tes suite: indeks simulasi 0,35 · proyeksi 2,29 · 232 bukti = 18 diterima/5 revisi/0 proses/19 draf/190 belum)
- SQL pendukung: `db/schema.sql` (tabel + view + RPC `skm_per_unit_stats`, `skm_tren_bulanan`, `skm_stats_dimensi`), `db/rate-limit-schema.sql` (tabel + RPC `bump_rate_limit`)
