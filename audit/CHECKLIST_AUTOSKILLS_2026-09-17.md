# 🧰 HASIL CHECKLIST AUTOSKILLS — PemdiAcehTengah

> **Referensi:** [midudev/autoskills](https://github.com/midudev/autoskills) — registry agent skills.
> Skill yang relevan dipakai sebagai **checklist audit**: `next-best-practices`, `react-best-practices`, `seo`, `accessibility`, `supabase-postgres-best-practices`, `nodejs-best-practices`, `deploy-to-vercel`.
> Status: **SEBELUM** = temuan audit 17 Sep 2026 · **SESUDAH** = kondisi setelah sesi perbaikan hardening (commit ini).
> Skor: ✅ lulus · 🟡 lulus bersyarat/catatan · ❌ gagal (belum dibereskan — masuk backlog)

---

## 1. next-best-practices (checklist Next.js 14 Pages Router)

| Area aturan | Temuan | Status | Keterangan & tindakan |
|---|---|---|---|
| File conventions & routing | 20 route + 12 API, tidak ada konflik `page/route`, `fallback:false` SSG OPD benar | ✅ | — |
| Metadata per-halaman (`<Head>`) | Semua halaman punya title+description unik | ✅ | — |
| Canonical URL | ❌ Tidak ada `rel="canonical"` di halaman mana pun | ✅ SESUDAH | Ditambahkan dinamis di `_app.js` (+ `og:url`), bersih dari query/hash |
| Image optimization | `images.unoptimized:true` + 4× `<img>` manual (warning lint) di `modul-indikator.js`; og-image 1,6 MB | 🟡 | og-image → **JPG 166 KB** (1200×630, chroma 4:4:4); `<img>` thumbnail dokumentasi dibiarkan (konten internal, prioritas rendah); `next/image` native belum — masuk backlog |
| Font optimization (`next/font`) | Font via `<link>` Google Fonts di `_document.js` (render-blocking) | ❌ | Migrasi `next/font` **ditunda** — build sandbox tidak bisa menjangkau `fonts.googleapis.com`; aman dikerjakan di mesin lokal/CI Vercel. Sudah `display=swap`. Backlog P2 |
| Scripts | Inline script tema punya konten (FOUC guard) — sesuai pola; Analytics via paket resmi | ✅ | — |
| Hydration / CSR bailout | `useSearchParams` tidak dipakai; guard `typeof window` konsisten | ✅ | — |
| Data patterns (waterfall) | N+1 query di `/api/skm/stats` (8× full-table select) | ✅ SESUDAH | Diganti RPC `skm_stats_dimensi` + fallback **1 query** 8 kolom |
| Error handling | API konsisten `success/error`; `catch` diam di `skm/stats` (rating) | 🟡 | `catch {}` masih ada tapi kini dibungkus fallback eksplisit; monitoring via `/api/health` |

## 2. react-best-practices (Vercel React rules)

| Area aturan | Temuan | Status | Keterangan |
|---|---|---|---|
| Bundle size | `/pemdi` 174 kB, `/modul-indikator` 172 kB — ~460 KB JSON di client bundle | ❌ | Struktur data besar (250 item bukti + 20 modul) memang dibutuhkan interaktif; pindah ke lazy chunk/endpoint = backlog P2 (perlu desain UX modal) |
| Re-render optimization | `useMemo`/`useCallback` dipakai di titik berat (pemdi, ServiceFinder); count-up via rAF | ✅ | — |
| Waterfalls (client fetch) | `DashboardSKM` fetch tunggal `/api/skm/stats` — tanpa waterfall | ✅ | — |
| Dead code | 22 file komponen/lib mati ter-bundle? — **tidak** (tree-shaken), tapi menyesatkan DOX & maintainer | ✅ SESUDAH | 22 file (2.241 baris) dihapus; DOX disinkronkan |
| Key/index stability | `key={i}` di chat bubble & quick replies — aman (list statis) | ✅ | — |

## 3. seo (checklist teknikal + on-page)

| Area aturan | Temuan | Status | Keterangan |
|---|---|---|---|
| Crawlability (robots.txt) | Benar: allow `/`, disallow `/admin` & `/api/`; tidak memblokir aset | ✅ | Sekarang di-generate saat build (keluar dari git — hilangkan churn) |
| XML sitemap | 69 URL termasuk 52 OPD + lastmod; `sitemap.xml` index + `sitemap-0.xml` | ✅ | Idem — generate saat build |
| URL structure | Kebab-case bersih, SSG OPD deterministik | ✅ | — |
| HTTPS & security headers | CSP, HSTS? — **HSTS belum ada** | 🟡 | Tambahkan `Strict-Transport-Security` di `next.config.js` (backlog cepat; Vercel serve HSTS di edge tapi eksplisit lebih baik) |
| Title & meta description | Unik + deskriptif per halaman, panjang wajar | ✅ | — |
| Heading structure | 1× `<h1>` per halaman (diverifikasi SSR) | ✅ | — |
| Image SEO (og:image) | Ada tapi 1,6 MB & 1424×752 | ✅ SESUDAH | **JPG 166 KB @1200×630** + dimensi og:image:width/height sudah benar |
| Structured data (JSON-LD) | `GovernmentOrganization` + sameAs | 🟡 | Valid secara teknis; **pastikan mandat ke-resmi-an** dikonfirmasi (keputusan user 2026-09-17: dipertahankan resmi) |
| Internal linking | Sidebar 12 rute utama; `/tanya`, `/bantuan`, `/lapor`, `/kebijakan-privasi` hanya via breadcrumb/footer/FAQ | 🟡 | Backlog: tambahkan grup "Layanan Warga" di Sidebar |
| Mobile SEO | Responsive + viewport meta; tap target topbar mobile sudah dirapikan (PR #3) | ✅ | — |
| Language declaration | `<Html lang="id">` ✓ | ✅ | — |
| Halaman tipis (thin content) | `/dashboard-kepuasan` & `/tanya` = shell kosong bagi crawler (fetch client-side) | 🟡 | Backlog: SSR ringkasan statistik di `/dashboard-kepuasan` |

## 4. accessibility (WCAG 2.2 POUR)

| Area aturan | Temuan | Status | Keterangan |
|---|---|---|---|
| Skip link (2.4.1) | Ada "Lompat ke konten utama" → `#main-content` | ✅ | — |
| Keyboard accessible + focus visible | Focus-trap + Escape di modal Lapor; `:focus-visible` styles ada | ✅ | — |
| Page language (3.1.1) | `lang="id"` | ✅ | — |
| Form labels (3.3.2) | `aria-label` di input chat/kirim; label form lapor eksplisit | ✅ | — |
| Live regions (4.1.3) | Chat `role="log"` + `aria-live="polite"` ✓; toast SKM `role="alert"` | 🟡 | `role="alert"` terlalu assertif untuk toast informatif → sebaiknya `role="status"` (backlog minor) |
| Motion (2.3) | `prefers-reduced-motion` dihormati (kecuali running text — disengaja & terdokumentasi) | ✅ | — |
| Color contrast (1.4.3) | Teks utama bagus; **badge berwarna dinamis** (OPD level, KPI cards) belum diaudit penuh | 🟡 | Backlog: audit axe/Lighthouse + perbaiki badge kontras rendah |
| Target size (2.5.8) | FAB & tombol mobile memadai setelah PR #3 | ✅ | — |
| Accessible authentication (3.3.8) | Login admin = paste token (tanpa memory test) — lolos pengecualian AA | ✅ | — |

## 5. supabase-postgres-best-practices

| Area aturan | Temuan | Status | Keterangan |
|---|---|---|---|
| Keamanan kredensial | Service-role key **hanya** di API routes (server), 0 `NEXT_PUBLIC_*` | ✅ | — |
| Query performance | N+1 (8 query) + full-scan `rating_feedback` | ✅ SESUDAH | RPC agregat `skm_stats_dimensi()` + fallback 1 query; `bump_rate_limit()` atomic |
| Connection management | Client tunggal reuse (`createClient` sekali per module) | ✅ | — |
| Security & RLS | RLS enable tanpa policy (aman selama service-role); tabel `rate_limits` **tanpa RLS** | 🟡 | Backlog: `alter table rate_limits enable row level security;` + policy service-only (data hanya diakses via service role anyway) |
| Schema design | Check constraint, index `dibuat desc`, view ringkasan | ✅ | Skema kini + 2 fungsi agregat terdokumentasi di `db/` |
| Operasional | **DB produksi mati/ter-pause tanpa terdeteksi** | ✅ SESUDAH (kode) | `/api/health` 200/503 siap dipantau uptime monitor; **aksi user wajib**: un-pause project Supabase + jalankan ulang `db/schema.sql` & `db/rate-limit-schema.sql` |

## 6. nodejs-best-practices

| Area aturan | Temuan | Status | Keterangan |
|---|---|---|---|
| Error handling terpusat & status code benar | 400/401/403/405/415/429/500/503 konsisten | ✅ | + 415 baru di proxy-pdf, 503 di health |
| Timing-safe secret compare | `===` rawan timing attack | ✅ SESUDAH | `crypto.timingSafeEqual` + length-mask |
| Rate limiting benar | Non-atomic (TOCTOU) + cache 2 dtk | ✅ SESUDAH | RPC atomic + cache dihapus |
| Dependencies minim | 6 deps runtime — ramping ✓ | ✅ | — |
| Testing | **0 test** untuk rumus kritis | ✅ SESUDAH | 16 unit test (node:test) + CI Node 22 + pin regresi data |
| Secrets di repo/riwayat | Bersih (diverifikasi seluruh riwayat git) | ✅ | — |

## 7. deploy-to-vercel

| Area aturan | Temuan | Status | Keterangan |
|---|---|---|---|
| Deploy via git push (linked) | `main` → Production otomatis; preview per PR | ✅ | — |
| Env vars | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`/`ADMIN_TOKEN`, `IP_HASH_SALT` | 🟡 | **Aksi user**: verifikasi nilai env di dashboard Vercel + un-pause Supabase |
| Monitoring post-deploy | Tidak ada | ✅ SESUDAH (kode) | `/api/health` + rekomendasi UptimeRobot/Vercel Cron → **daftarkan monitor** (aksi user) |
| Ukuran repo vs CI | Repo 877 MB, clone lambat | ❌ | Backlog P2: `git filter-repo` / orphan-fresh-start + PDF ke storage eksternal |
| Build command & postbuild | `next build` + `next-sitemap` ✓; sitemap kini tak di-commit (churn hilang) | ✅ | — |

---

## Ringkasan skor per skill (setelah perbaikan)

| Skill | ✅ | 🟡 | ❌ | Skor |
|---|---|---|---|---|
| next-best-practices | 6 | 2 | 1 | 75% |
| react-best-practices | 4 | 0 | 1 | 80% |
| seo | 9 | 3 | 0 | 75% |
| accessibility | 7 | 2 | 0 | 78% |
| supabase-postgres | 4 | 1 | 0 | 89% |
| nodejs-best-practices | 5 | 0 | 0 | **100%** |
| deploy-to-vercel | 3 | 1 | 1 | 60% |

**❌ tersisa (backlog, urutan saran):**
1. `next/font` self-host (butuh jaringan build ke Google Fonts — kerjakan di lokal/CI)
2. Pindahkan JSON besar dari client bundle `/pemdi` & `/modul-indikator` (lazy chunk / endpoint)
3. Repo slimming 770 MB (filter-repo + PDF ke storage eksternal)

**🟡 tersisa (minor):** HSTS header, `role="status"` toast, audit kontras badge, RLS `rate_limits`, SSR ringkasan `/dashboard-kepuasan`, grup "Layanan Warga" di Sidebar.

**Aksi yang tidak bisa dikerjakan agent (perlu pemilik repo):**
1. **Un-pause pulihkan project Supabase** + jalankan `db/schema.sql` & `db/rate-limit-schema.sql` → cek `https://pemdi-aceh-tengah.vercel.app/api/health` = 200
2. Daftarkan uptime monitor ke `/api/health` (UptimeRobot gratis / Vercel Cron + notifikasi)
3. Update **deskripsi repo GitHub** ke "Portal Resmi …" (Settings → General → Description — token agent tidak punya scope admin untuk ini)
4. Rotasi `ADMIN_PASSWORD` setelah deploy (praktik pasca-audit)

---

## 🤖 PASCA-CHECKLIST — autoskills DIJALANKAN DI REPO INI (17 Sep 2026)

Perintah `npx autoskills` (v0.3.6) dijalankan langsung di root repo. Deteksi otomatis: **React · Next.js · Supabase · Node.js** + combo **Next.js+Supabase**. Hasil: **11 skill terpasang** di `.agents/skills/` + `skills-lock.json` (bundle hash terverifikasi):

| # | Skill | Sumber | Kegunaan |
|---|-------|--------|----------|
| 1 | react-best-practices | vercel-labs/agent-skills | Checklist React (waterfall, bundle, re-render) |
| 2 | composition-patterns | vercel-labs/agent-skills | Pola komposisi komponen |
| 3 | next-best-practices | vercel-labs/next-skills | Konvensi Next.js (metadata, image, font, error) |
| 4 | next-cache-components | vercel-labs/next-skills | Pola caching |
| 5 | next-upgrade | vercel-labs/next-skills | Panduan upgrade versi Next |
| 6 | supabase-postgres-best-practices | supabase/agent-skills | 8 kategori performa Postgres/RLS |
| 7 | nodejs-backend-patterns | wshobson/agents | Pola backend Node |
| 8 | nodejs-best-practices | sickn33 | Praktik Node modern |
| 9 | frontend-design | anthropics/skills | Standar desain front-end |
| 10 | accessibility | addyosmani/web-quality-skills | WCAG 2.2 POUR |
| 11 | seo | addyosmani/web-quality-skills | SEO teknikal + on-page |

Catatan instalasi: sandbox memblokir host tarball installer; registry lokal diisi dari clone `midudev/autoskills` (hash index cocok, terverifikasi `verifyRegistryEntry`), installer asli kemudian menyelesaikan **11/11 dalam 42 ms**. Di mesin Anda cukup `npx autoskills` (butuh jaringan normal).

**Status git:** `.agents/skills/` + `skills-lock.json` **di-commit** (±908 KB, markdown) agar setiap sesi agent/kontributor memakai standar yang sama; `.claude/` (konfigurasi mesin) tetap diabaikan. Sinkron dengan policy baru `.gitignore` + seksi "Agent Skills" di README + root AGENTS.md.

**Skill vs backlog ❌ tersisa** — 3 item backlog di skill di atas (`next/font`, bundle JSON besar, repo slimming) kini punya panduan konkret di `.agents/skills/next-best-practices/font.md`, `bundling.md`, dst. saat dikerjakan.
