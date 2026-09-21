# lib/ — DOX

## Purpose
Utility server-side & shared — murni fungsi, tanpa React.

## Ownership — 9 modul

| Modul | File | Fungsi | Dipakai di |
|-------|------|--------|------------|
| **pemdiNilai** | `pemdiNilai.js` | Rumus resmi PermenPANRB 8/2026 — `nilaiIndikator` (level kontinu semua-butir-**diterima**, aturan berjenjang), `indeksAspek` Σ(wI×NI)/wA, `indeksPemdi` Σ(wA×IA), `predikatPemdi` (Tabel 4), `statistikBukti`/`statistikIndikator` (5 status), `STATUS_META`/`STATUS_BUKTI`/`statusMeta` (vokabuler `diterima·revisi·proses·draf·belum` — satu sumber untuk semua halaman), konstanta LEVEL/INDIKATOR_EKSTERNAL; **`fokusLevel(ind)`** (21 Sep 2026: `levelDicapai` kumulatif-asesor = `nilaiIndikator`, `levelBerikut`, `tampil` = himpunan level terbuka default, `eksternal`) & **`peranLevel(level, fokus)`** (dicapai/berikut/lewat/nanti) — satu sumber fitur fokus level di /pemdi, /modul-indikator, beranda | `pemdi.js`, `modul-indikator.js`, `requirement.js`, `test/pemdiNilai.test.mjs` |
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
- Perubahan `pemdiNilai.js` wajib `npm test` hijau (16 pin rumus + 4 tes fokusLevel + 6 tes KONSISTENSI lintas-data pemdi⇔modul⇔draf — 37 tes suite: indeks simulasi 0,35 · proyeksi 2,29 · 232 bukti = 18 diterima/19 revisi/0 proses/12 draf/183 belum)
- SQL pendukung: `db/schema.sql` (tabel + view + RPC `skm_per_unit_stats`, `skm_tren_bulanan`, `skm_stats_dimensi`), `db/rate-limit-schema.sql` (tabel + RPC `bump_rate_limit`)


## Sprint UI/UX 21 Sep 2026

| File | Fungsi | Uji |
|------|--------|-----|
| `persona.js` | Konstanta & util dual-persona: `parsePersona`, `personaHref`, `PERSONAS`, kunci localStorage `pemdi:persona`. Murni JS tanpa React | `test/persona.test.mjs` |
| `sektorLayanan.js` | `SEKTOR` (6 sektor GOV.UK-style), `kelompokkanSektor(kategori[])` — memetakan 7 kategori `data/layanan.json` → 6 sektor tanpa kehilangan layanan (kategori baru jatuh ke sektor terakhir), `KATA_KUNCI_POPULER` | `test/persona.test.mjs` |
| `modeSitus.js` | **Saklar persona publik** `NEXT_PUBLIC_PERSONA_PUBLIK` (`on` = dual-persona; selain itu mode internal). Ekspor `PUBLIK_AKTIF`, `RUTE_PUBLIK`, `API_PUBLIK`, `isRutePublik()`. CommonJS (dipakai middleware Edge, `_document`, `next-sitemap`). Dipakai: `middleware.js`, `pages/index.js`, `_app`, `_document`, `404`, `AppShell`, `Sidebar`, `Footer`, `BottomNav`, `usePersona`, `search-index` | `test/persona.test.mjs` |
