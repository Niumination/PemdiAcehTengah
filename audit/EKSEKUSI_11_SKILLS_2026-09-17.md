# ⚡ LAPORAN EKSEKUSI 11 SKILLS (autoskills) + RENCANA TAHAP BERIKUTNYA

> **Tanggal:** 17 September 2026 · **Basis:** branch `arena/01a0ae53-pemdiacehtengah` (pasca-hardening `4fbcfa5`)
> **Metode:** setiap skill di `.agents/skills/` (hasil `npx autoskills`) **dijalankan** sebagai review pass terhadap repo — aturannya dibaca, diterapkan ke kode, temuan diperbaiki langsung bila aman, sisanya masuk rencana tahap berikutnya.
> **Verifikasi eksekusi ini:** lint 0 error · **16/16 test pass** · build sukses · smoke test header/JSON-LD/cache terbukti di server produksi lokal.

---

## BAGIAN 1 — LAPORAN PER SKILL

### 1️⃣ react-best-practices (vercel-labs — 70 aturan, 8 kategori)

| Kategori | Hasil |
|---|---|
| `advanced-init-once` + hydration-error | 🔧 **FIX:** `components/Footer.js` — `new Date().getFullYear()` dipindah ke module scope (dievaluasi sekali, bukan tiap render) + `suppressHydrationWarning` pada elemen tahun (menutup edge pergantian tahun SSG-build vs client) |
| Re-render & side-effect saat render | 🔧 **FIX:** `pages/admin.js` — `sessionStorage.getItem('admin_token')` tadinya dibaca **di badan render** (anti-pola + rentan hydration edge) → kini via `useState` + setter di `useEffect`/login/logout/401 (semua 5 jalur state diperbarui konsisten) |
| Waterfalls (async-*) | ✅ Tidak ada waterfall: `DashboardSKM` satu fetch; halaman SSG data-nya dari build |
| `bundle-*` (CRITICAL) | ❌ **Tersisa (terbesar):** `/pemdi` 174 kB & `/modul-indikator` 172 kB first-load — ±460 KB JSON di client bundle → masuk Sprint B |

### 2️⃣ composition-patterns (vercel-labs — 9 aturan)

- ✅ Tidak ditemukan *boolean-prop proliferation*: API komponen ramping (`Sp4nBanner variant`, `SlaBadge`, `DetailModal {title,children,onClose,isOpen}` — sesuai aturan `patterns-explicit-variants`)
- ✅ Tidak ada `forwardRef` (siap React 19 — aturan `react19-no-forwardref`)
- 📝 **Catatan pola (Sprint B):** markup hero (section gradient + motif + back-link) terduplikasi inline di ~12 halaman → kandidat komponen `<PageHero>` compound saat disentuh berikutnya. Tidak di-refactor sekarang (batas ponytail: YAGNI sampai ada perubahan nyata)

### 3️⃣ next-best-practices (vercel-labs — 17 referensi)

- ✅ Sudah diterapkan pass sebelumnya: canonical/og:url dinamis, metadata per halaman, SSG `fallback:false`, error handling API
- 🔎 **Temuan baru pass ini:** `pages/api/requirement.js` **sudah memiliki** CDN cache sejak awal (`s-maxage=3600, SWR 600`) — terlewat dari audit; duplikat header yang saya tambahkan saat pass ini **dihapus**, yang asli dipertahankan
- ❌ **Tersisa:** `next/font` (terblokir jaringan sandbox — jalankan di mesin lokal: ganti `<link>` Google Fonts di `_document.js` → `import { Plus_Jakarta_Sans } from 'next/font/google'`); 4 warning `<img>` di `modul-indikator.js`

### 4️⃣ next-cache-components (vercel-labs — Next 16 Cache Components)

Skill ini menargetkan fitur Next 16 (`'use cache'`, PPR) — **belum berlaku** untuk repo (Next 14 Pages Router). Prinsip caching-nya diadaptasi ke layer yang ada:

| Endpoint | Cache-Control | Status |
|---|---|---|
| `/api/opd`, `/api/spbe` | `public, s-maxage=3600, stale-while-revalidate=86400` | 🔧 **FIX** (baru — data statis JSON, hanya berubah saat deploy) |
| `/api/skm/stats` | `public, s-maxage=60, stale-while-revalidate=300` | 🔧 **FIX** (statistik boleh stale 60 dtk; melindungi kuota Supabase) |
| `/api/requirement` | `s-maxage=3600, SWR 600` | ✅ Sudah ada (dipertahankan) |
| `/api/proxy-pdf` | `public, max-age=3600` | ✅ Sudah ada |
| `/api/health` | `no-store` | ✅ Benar (monitor butuh nilai segar) |

### 5️⃣ next-upgrade (vercel-labs)

**Assessment jalur upgrade** (tidak dieksekusi — ada di Sprint C):
- Terkunci `next@14.2.35` (14.2.x terakhir) + React 18.3.1
- **14 → 15:** prasyarat **React 19** (upgrade terkoordinasi); Pages Router minim dampak — tidak ada `getServerSideProps`/`params` async, tidak pakai `middleware.ts`, `next/head` masih didukung; codemod `next-async-request-api` tidak diperlukan
- **15 → 16:** rename `middleware→proxy` tidak berlaku (tidak ada middleware); `cacheComponents` opsional (baru relevan bila migrasi App Router)
- **Rekomendasi:** jangan upgrade sekarang (nilai rendah, risiko sedang); jadwalkan setelah monitoring & data operasional stabil (Sprint C)

### 6️⃣ supabase-postgres-best-practices (supabase — 8 kategori)

- 🔧 **FIX:** `db/rate-limit-schema.sql` + `ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;` — defense-in-depth (service role bypass RLS → nol perubahan perilaku app; menutup akses anon key)
- ✅ Pass sebelumnya: RPC atomic `bump_rate_limit`, agregat `skm_stats_dimensi` (N+1 hilang), RLS di tabel data
- 📌 **Tersisa (aksi pemilik):** jalankan SQL terbaru di project Supabase produksi

### 7️⃣ nodejs-backend-patterns (wshobson)

- ✅ Envelope respons konsisten (`{success,error}`) di 12 route · status code benar (400/401/403/405/415/429/500/503) · rate limit + sanitasi + auth Bearer di semua route tulis · body limit default 1 MB · logging error via `console.warn` (pass-2)
- 📝 Gap minor (didokumentasikan, tidak diubah — 10 route masih terkelola): belum ada modul error-handler terpusat, request-ID correlation, dan structured logging → kandidat saat route bertambah (Sprint C opsional)

### 8️⃣ nodejs-best-practices (sickn33)

- 🔧 **FIX:** `package.json` kini mendeklarasikan `"engines": { "node": ">=20" }` (runtime minimum terdokumentasi; CI memakai 22)
- ✅ Dependencies 6 runtime (ramping) · tanpa `"type":"module"` yang tidak perlu (config CJS) · scripts minimal: dev/build/start/lint/test/postbuild

### 9️⃣ frontend-design (anthropics)

Review kualitatif terhadap sistem desain **"Gayo Civic Digital"**:
- ✅ **Sesuai tesis utama skill:** estetika khas & tidak generik — motif budaya Gayo (Kerawang/Emun/Ulen/Rante/Tapak) sebagai identitas, palet Navy-Gold-Beige via CSS variables, font Plus Jakarta Sans (bukan Inter/Roboto), dark mode "Midnight Navy & Gold"
- ✅ Detail matang: divider motif, gov-strip marquee, scroll-reveal yang menghormati `prefers-reduced-motion`, konten SSR (bukan skeleton kosong)
- 📝 Catatan: beberapa warna hardcode di komponen (mis. `LEVEL_META` di `opd/[slug].js`) → migrasi ke token CSS saat disentuh (Sprint B kecil)

### 🔟 accessibility (addyosmani — WCAG 2.2)

- 🔧 **FIX:** `components/SkmPrompt.js` — `role="alert"` → `role="status" aria-live="polite"` (WCAG 4.1.3: toast informatif bukan kondisi darurat; alert terlalu assertif untuk screen reader)
- 🔧 **FIX:** `components/AppShell.js` — `role="banner"` dihapus dari gov-strip dekoratif → **satu landmark banner** (topbar `<header>`), navigasi landmark tidak ambigu
- ❌ **Tersisa (Sprint B):** audit kontras badge dinamis (axe/Lighthouse) + spot-check target sentuh

### 1️⃣1️⃣ seo (addyosmani)

- 🔧 **FIX:** header **HSTS** (`Strict-Transport-Security: max-age=63072000; includeSubDomains`) di `next.config.js` — terverifikasi di response
- 🔧 **FIX:** **FAQPage JSON-LD** di `/faq` — 15 Q&A dari `data/faq.json` (sumber tunggal; jawaban di-strip HTML) → peluang rich result Google. Terverifikasi: 2 script ld+json valid (GovernmentOrganization + FAQPage)
- ✅ Pass sebelumnya: canonical + og:url, og:image 166 KB, sitemap 69 URL, robots
- ❌ **Tersisa:** konten tipis `/dashboard-kepuasan` & `/tanya` bagi crawler (Sprint B); verifikasi Google Search Console + submit sitemap (**aksi pemilik**)

---

### Ringkasan eksekusi

| Skill | Perbaikan langsung | Temuan tersisa |
|---|---|---|
| react-best-practices | 2 (admin token state, footer year) | 1 ❌ (bundle JSON besar) |
| composition-patterns | 0 (lolos review) | catatan PageHero |
| next-best-practices | 1 (dedup cache requirement) | 2 (font, `<img>`) |
| next-cache-components | 3 endpoint cache baru | — (cacheComponents = pasca-Next 16) |
| next-upgrade | assessment 14→15→16 | upgrade = Sprint C |
| supabase-postgres | RLS rate_limits | jalankan SQL (user) |
| nodejs-backend-patterns | 0 (lolos review) | opsional: error-handler terpusat |
| nodejs-best-practices | 1 (engines) | — |
| frontend-design | 0 (lolos review kualitatif) | token warna komponen |
| accessibility | 2 (role status, banner tunggal) | 1 (kontras badge) |
| seo | 2 (HSTS, FAQPage JSON-LD) | 2 (thin page, GSC) |

**Temuan baru di luar checklist skill** (ditemukan saat eksekusi):
- **F-1 (Sprint A):** `pages/api/requirement.js` **meng-hardcode salinan data** (192 baris, 0 import) alih-alih membaca `data/requirement.json` — angka saat ini masih cocok (83), tapi rawan drift senyap
- **F-2:** `/api/requirement` ternyata sudah ber-CDN-cache sejak awal (terlewat audit, kini terdokumentasi)
- **F-3:** HEAD ke `/api/skm/stats` → 405 (`Allow: GET`) — by design, terdokumentasi

---

## BAGIAN 2 — LAPORAN EKSEKUSI TAHAP BERIKUTNYA

> Prinsip urutan: **operasional dulu** (yang bikin layanan hidup & terpantau), lalu performa, lalu platform.

### 🔴 SPRINT A — Operasional & Kepercayaan (minggu ini)

| # | Item | Pemilik | Cara | Selesai bila |
|---|------|---------|------|--------------|
| A1 | **Pulihkan backend live** | 🧑 Pemilik | Un-pause project Supabase → SQL Editor → jalankan `db/schema.sql` + `db/rate-limit-schema.sql` (termasuk RPC `bump_rate_limit`, `skm_stats_dimensi`, RLS baru) | `GET /api/health` = **200** di produksi; POST SKM/lapor `tersimpan:true` |
| A2 | **Uptime monitor** | 🧑 Pemilik | Daftarkan UptimeRobot (gratis) / Better Uptime → URL `https://pemdi-aceh-tengah.vercel.app/api/health`, interval 5 menit, alert ke email/WhatsApp | Alert masuk saat DB down (uji dengan pause sebentar) |
| A3 | **Commit `.github/workflows/ci.yml`** | 🧑 Pemilik | File sudah disiapkan di working tree (Node 22 + `npm test`) — commit & push (token agent tidak boleh mengubah workflow) | CI hijau di PR berikutnya |
| A4 | **Deskripsi repo** | 🧑 Pemilik | GitHub → Settings → General → Description → hapus "Bukan Portal Resmi" (selaras keputusan identitas resmi) | Deskripsi konsisten dengan situs |
| A5 | **Rotasi `ADMIN_PASSWORD`** | 🧑 Pemilik | Generate password baru → update env Vercel → logout semua session admin | Login admin baru bekerja, lama ditolak |
| A6 | **Dedup `api/requirement.js`** (F-1) | 🤖 Agent | Refactor handler → `import requirementData from '@/data/requirement.json'` (jaga kontrak respons: `summary`+`categories`+`outputs`); tambah test pin 83 item | Respons API identik dengan sebelumnya (diff kosong); 1 sumber data |
| A7 | **Grup "Layanan Warga" di Sidebar** | 🤖 Agent | Tambah link `/tanya`, `/bantuan`, `/lapor`, `/kebijakan-privasi` (saat ini hanya via breadcrumb/footer) | Semua halaman terjangkau ≤1 klik dari sidebar |

### 🟠 SPRINT B — Performa & Kualitas (≤ 30 hari)

| # | Item | Pemilik | Cara | Selesai bila |
|---|------|---------|------|--------------|
| B1 | **`next/font`** | 🤖 Agent (mesin lokal/CI — butuh jaringan Google Fonts) | `_document.js`: hapus 3 tag `<link>` font → `import { Plus_Jakarta_Sans } from 'next/font/google'` di `_app.js` + CSS variable | Build sukses; font self-hosted (0 request pihak ketiga); LCP turun |
| B2 | **Bundle `/pemdi` & `/modul-indikator`** (temuan CRITICAL skill react) | 🤖 Agent | Pindahkan 5 import JSON besar → `getStaticProps` (data jadi props build-time, keluar dari JS chunk); modal detail pakai lazy chunk | First Load JS `/pemdi` & `/modul-indikator` **< 140 kB** (dari 174/172); Lighthouse mobile ≥ 90 |
| B3 | **SSR ringkasan `/dashboard-kepuasan`** | 🤖 Agent | `getStaticProps` + revalidate 60s: render angka utama (total responden, IKM) di HTML; client hanya untuk chart interaktif | Crawler melihat angka (view-source); thin-content hilang |
| B4 | **Audit aksesibilitas penuh** | 🤖 Agent | `npx @axe-core/cli` + Lighthouse a11y di 10 rute utama → perbaiki kontras badge dinamis & temuan lain | Lighthouse Accessibility ≥ 95 di semua rute utama |
| B5 | **Token warna komponen** | 🤖 Agent | Migrasi warna hardcode (`LEVEL_META` dll.) → CSS variables `styles/globals.css` | `grep -rn "#[0-9a-f]\{6\}" components/` hanya menyisakan token motif SVG |
| B6 | **Verifikasi Search Console** | 🧑 Pemilik | Tambahkan properti + submit `sitemap.xml`; pantau coverage FAQ rich result | Sitemap terindeks; laporan rich result FAQPage aktif |

### 🟡 SPRINT C — Platform & Skalabilitas (kuartal ini)

| # | Item | Pemilik | Cara | Selesai bila |
|---|------|---------|------|--------------|
| C1 | **Upgrade Next 14 → 15** | 🤖 Agent | `npm i next@15 react@19 react-dom@19` → build → uji 20 rute + API → perbaiki breaking (Pages Router minim) | Build + 16 test + smoke hijau di Next 15 |
| C2 | **Repo slimming (770 MB)** | 🧑+🤖 | (1) Pindahkan PDF bukti ke Supabase Storage/R2 + link; (2) backup repo; (3) `git filter-repo --path public/bukti-dukung --invert-paths --path arsip-bukti-dukung --invert-paths`; (4) force-push + re-clone tim | Clone segar < 50 MB; CI tetap hijau |
| C3 | **Observability API** | 🤖 Agent | (Opsional, bila trafik naik) request-ID + structured log Vercel + alert error rate | Error produksi terlihat < 5 menit setelah terjadi |
| C4 | **Audit log admin** | 🤖 Agent | Tabel `admin_audit` (aksi PATCH laporan + login) + tampilan di `/admin` | Setiap perubahan status laporan tercatat siapa-kapan |
| C5 | **Keberlanjutan (premortem #3)** | 🧑 Pemilik | Tetapkan co-maintainer + serah terima akses (env, Supabase, Vercel) ke pemangku kepentingan resmi; backup data Supabase terjadwal | ≥ 2 komitter aktif; prosedur restore teruji 1× |

### 📊 Risk register update (dari premortem audit)

| Risiko | Status setelah sesi ini |
|---|---|
| DB mati diam-diam | 🟡 Kode health-check siap; **menunggu A1+A2** (pemulihan + monitor) — belum pulih sampai pemilik eksekusi |
| Krisis identitas | 🟢 Keputusan diambil (resmi); tinggal A4 |
| Bus factor 1 | 🔴 Belum berubah — C5 kritis |
| Kredibilitas data | 🟢 Rumus terkunci 16 test + pin regresi; angka publik tersinkron |
| Keamanan | 🟢 Semua temuan S-1…S-8 ditutup; tinggal rotasi A5 |
| Performa | 🟡 Cache API + og-image beres; bundle besar = B2 |
| Motivasi pasca-evaluasi | 🟡 Backlog Sprint A–C ini adalah jawabannya — ada roadmap yang bisa dieksekusi |

---

## Lampiran — bukti eksekusi (ringkas)

- Header live-lokal: `Strict-Transport-Security: max-age=63072000; includeSubDomains` ✓ · `/api/opd|spbe`: `s-maxage=3600, SWR 86400` ✓ · `/api/skm/stats` (GET): `s-maxage=60, SWR 300` ✓ · `/api/health`: `no-store` ✓
- `/faq`: 2 script JSON-LD valid — `GovernmentOrganization` + `FAQPage` (15 Q&A, Q1 "Apa itu Pemdi Aceh Tengah?") ✓
- A11y: `role="banner"` gov-strip dihapus (1 banner landmark) · SkmPrompt `role="status" aria-live="polite"` ✓ (toast dirender client-side setelah 3 pageview — sesuai desain)
- admin.js: token via state (5 jalur setter: mount/login/logout/401×2) ✓
- `package.json`: `engines.node >=20` ✓ · lint 0 error · 16/16 test · build 72/72 halaman ✓

---

## UPDATE SPRINT A — 18 Sep 2026 (WIB)

**A1 ✅ (sebagian besar):** Project Supabase diaktifkan kembali oleh pemilik (sempat pause). Verifikasi live (cache-busted):
- `GET /api/skm` → **200** `{"total_responden":2,"rata_skala_4":3.81,"ikm_0_100":95.31}` — view `skm_ringkasan` hidup ✓
- `GET /api/feedback` → **200** `{"total":0,...}` — tabel `rating_feedback` ada ✓
- Sisa A1: jalankan SQL baru di Supabase SQL Editor (`db/schema.sql` + `db/rate-limit-schema.sql` — RPC `bump_rate_limit`, `skm_stats_dimensi`, RLS `rate_limits`). Kode baru punya fallback, jadi aman kapan saja sebelum/sesudah merge deploy.

**A6 ✅:** `pages/api/requirement.js` — 192 baris data hardcoded → `import requirementData from '@/data/requirement.json'` (diverifikasi **identik byte-per-byte** dengan respons lama sebelum refactor; kini satu sumber bersama `pages/requirement.js`) + 4 pin test baru `test/requirement.test.mjs` (12 kategori · 83 item · `count`=`items` per kategori · 5 output).

**A7 ✅:** Sidebar — Grup I bertambah: *Lacak Status Laporan* (`/lapor`), *Chat Tanya-Jawab* (`/tanya`), *Pusat Bantuan* (`/bantuan`); Grup III bertambah: *Kebijakan Privasi* (`/kebijakan-privasi`). Semua 20 rute kini ≤ 1 klik dari sidebar.

**Menunggu pemilik repo (setelah merge):**
- A2 — uptime monitor: daftarkan **setelah merge+deploy** (endpoint `/api/health` baru ada di branch ini, belum di produksi)
- A3 — commit `.github/workflows/ci.yml` (Node 22 + `npm test`) yang sudah disiapkan
- A4 — deskripsi repo GitHub (hapus "Bukan Portal Resmi")
- A5 — rotasi `ADMIN_PASSWORD` di env Vercel

## UPDATE SPRINT B — 18 Sep 2026 (WIB)

**B1 ✅ Font self-host:** `next/font/local` dengan `fonts/PlusJakartaSans-Variable.ttf` (176 KB, wght 400–800, OFL) hasil sparse-clone `github.com/google/fonts` (raw.githubusercontent & jsdelivr terblokir sandbox). Token `--font-pjs` → `--font-body` di globals.css; 3 `<link>` Google Fonts dihapus dari `_document.js`; CSP `style-src`/`font-src` kini `'self'` saja. Smoke: preload `/_next/static/media/*.p.ttf` ✓, **0 request** fonts.googleapis/gstatic ✓.

**B2 ✅ Bundle <140 kB:** `pages/pemdi.js`, `pages/modul-indikator.js`, `pages/index.js` — import JSON pindah ke `getStaticProps` (`await import('@/data/*.json')`); helper module-scope jadi closure di dalam komponen. Hasil first-load JS: `/pemdi` **174→114 kB (−34%)**, `/modul-indikator` **172→113 kB**, `/` 118 kB (kini ● SSG), `/requirement` 116 kB, `/cari` 114 kB; shared 112 kB. `__NEXT_DATA__` SSR memuat semua prop (7 aspek · 20 modul · 48 kebutuhan) — konten identik, "0,38" tetap ter-render.

**B3 ✅ SSR ringkasan kepuasan:** `pages/dashboard-kepuasan.js` + `getStaticProps` (ISR 60 dtk) baca view `skm_ringkasan` via `supabaseAdmin` → strip statistik `.ssr-ringkasan-strip` (9 stat) ter-render di HTML awal + fallback nol saat tabel kosong (terverifikasi smoke: prop `ringkasan {total_responden:0,...}` + `.ssr-empty-note`). Crawler kini melihat angka tanpa menunggu JS.

**B4 ✅ Kontras WCAG (audit terkomputasi + perbaikan):** Audit luminance/rasio seluruh pasangan warna dinamis → perbaikan:
- `LEVEL_WARNA` (`pemdi.js` + `modul-indikator.js`, harus identik): `#ef4444/#f59e0b/#3b82f6/#10b981/#8b5cf6` → **`#b91c1c/#ab5708/#1d4ed8/#047857/#6d28d9`** — Level 2 **2,15:1→5,1:1**, Level 4 **2,54:1→5,5:1**; semua level ≥4,5:1 sebagai teks di putih maupun putih di atasnya (dipakai dua arah).
- Token B5 light diperbaiki: `--level-badan #01579b`, `--level-lembaga/--skala-3 #c2410c`, `--status-ok #047857`, `--status-warn #b45309`, `--status-bad #b91c1c` (badge Lembaga 3,37→4,55; skala-3 3,79→5,18; tracker diproses 3,07→4,51 · selesai 3,60→4,84 · ditolak 4,41→5,30).
- **Dark-theme override baru** (≥6:1 di surface #141C2E): `--level-*`/`--status-*`/`--skala-*` versi terang + token `--on-accent` (#fff light / #0b101c dark) untuk teks di atas warna aksent (`skm.js` tombol skala terpilih).
- Skor akhir audit: **30 PASS ≥4,5:1 · 0 FAIL** (1 pasang 4,46 khusus badge tint L2 diperbaiki → `#ab5708` 4,54).
- `pages/tanya.js` palet GOV.UK-ish dibiarkan (kontrasnya memadai; migrasi token menunggu sentuhan berikutnya).

**B5 ✅ Token warna:** 13 var di `:root` + dark override — `LEVEL_META` (`opd/[slug].js`), `TrackerStatus.js` (8 hex), `SKALA_WARNA` (`skm.js`) kini memakai token. `LEVEL_WARNA` tetap literal (dipakai concat alpha `${warna}18`) — tokenisasi penuh menunggu migrasi `color-mix()` (dicatat backlog).

**Verifikasi:** lint 0 error · **20/20 test** · build sukses (72/72 halaman, `/dashboard-kepuasan` ISR 60 dtk) · smoke 6 rute 200 · font preload & 0 fonts pihak ketiga · warna baru terbukti di SSR `/pemdi` + bundle client/server kedua halaman.

## UPDATE AUDIT PRE-MERGE (PASS-3) — 18 Sep 2026

> Audit menyeluruh PR #5 sebelum merge ke main: "temukan kesalahan, perbaiki, pastikan aman saat merge" — bukan hanya test biasa, semua jalur yang berpotensi error/crash/tidak valid dicek.

### Diverifikasi bersih (tanpa temuan)

| Pemeriksaan | Hasil |
|---|---|
| Topologi merge | `origin/main` = `cb00062` = merge-base; branch 3 commit di depan, 0 di belakang → **merge = fast-forward murni, mustahil konflik** |
| CSP evolusi | `style-src` tetap `'unsafe-inline'` (inline-style React SSR aman); **`connect-src 'self'` terbukti aman** — nol panggilan browser langsung ke Supabase (semua via API route same-origin; proxy-pdf = fetch server-side, tak terikat CSP); HSTS baru |
| B3 sumber data | Identik dengan `/api/skm/stats` (view `skm_ringkasan`, kolom sama) — angka nol saat build lokal murni karena env absen (sandbox tanpa `.env.local`); di Vercel (env ada) → angka riil |
| Rate-limit pra-SQL | Rantai fallback 3 tingkat (RPC `bump_rate_limit` → legacy read-upsert → in-memory) — tidak crash sebelum pemilik menjalankan `db/*.sql` |
| Integritas font | sha256 `89b3fb38…` **byte-identik dengan upstream google/fonts** + OFL.txt ter-commit |
| Scan rahasia | Diff PR 25.997 baris: bersih (hanya contoh kode di `.agents/skills/*.md` & input `type=password`) |
| Aset terhapus | `crest-pemdi.png`/`og-image.png` tanpa referensi menggantung (svg/jpg pengganti aktif) |
| Dependensi | Nol perubahan deps vs main; hanya `engines node>=20` + script `test` |
| Layering CSS | 3 blok `:root` = disengaja (utama · media-query `--sbw` · gradien redesain) — blok 1396 hanya `--hero-grad/--sidebar-grad`, **tidak menimpa token B4/B5** |
| proxy-pdf SSRF | Allowlist `https://jdih.acehtengahkab.go.id/` |
| Clean-room | `npm ci` → lint 0 → **20/20 test** → build 72/72 → smoke **23 rute** (21 halaman+robots+sitemap 200 · OPD dinamis 200 · slug tak-valid **404**) → API matriks error-path (**400/401/405/503 sesuai desain, nol 500**) → log server bersih |

### Ditemukan & diperbaiki (4 temuan)

1. **Artefak build ter-track** — `.gitignore` (commit hardening) menyatakan `public/robots.txt`+`sitemap*.xml` "jangan commit", tapi 3 file masih ter-track (dan `4e8db51` bahkan ikut commit perubahan timestamp sitemap). → `git rm --cached` ketiganya; `postbuild next-sitemap` meregenerasi otomatis tiap deploy (config ada, exclude `/admin`+`/api`).
2. **7 lokasi kontras teks gagal** (pra-ada, dalam cakupan PR — lolos dari B4 yang fokus warna level/status): glosarium *Penilaian* `#e65100→#c2410c` (putih-di-atas 3,79→5,18) & *Layanan* `#28a197→#007073` (3,17→5,89); `layanan.js` getSlaWarna+angka stat `#e65100→#c2410c`; SlaBadge tier-tengah `#e65100→#c2410c` (di atas `#fff3e0` ~2,9→4,72); `probis` .level-2 `#e65100→#c2410c`; DashboardSKM getColor `#059669/#d97706/#dc2626→#047857/#b45309/#b91c1c`.
3. **`var(--danger, #e63946)`** di modul-indikator — `--danger` tak pernah terdefinisi → fallback 4,0:1 dipakai selamanya → dialihkan ke token `--status-bad` (fallback `#b91c1c`); fallback `--warn` juga dikoreksi `#f59e0b→#b45309`.
4. **3 endpoint API tanpa method guard** — `/api/opd`, `/api/spbe`, `/api/requirement` menjawab **200 + data untuk POST/PUT/DELETE** apa pun → guard `OPTIONS→200 · non-GET→405 + Allow: GET` (pola konsisten `skm/stats`); kontrak GET terverifikasi utuh (52 OPD, keys requirement sama, pin test aman).

### Diperiksa & dibiarkan (keputusan sadar)

- `pages/tanya.js` palet GOV.UK — kontras lolos (`#1d70b8` 5,17:1) — dibiarkan.
- Urutan 503-sebelum-validasi di `feedback/skm` (env absen) — desain pra-ada, benar di produksi.
- `skm/stats` menolak HEAD (405) — pra-ada, tidak dipakai monitor.
- Gradien progress-bar `#10b981→#059669` (non-teks, 3:1) — lolos sebagai grafik non-teks.
