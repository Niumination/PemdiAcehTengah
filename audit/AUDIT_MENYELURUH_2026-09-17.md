# 🔍 AUDIT MENYELURUH — PemdiAcehTengah

> **Cakupan:** Repo `Niumination/PemdiAcehTengah` (semua branch), arsitektur luar-dalam, isi konten & konsistensi data, integrasi (Supabase/Vercel/API), keamanan, performa, SEO, aksesibilitas, higien git, **plus live web** https://pemdi-aceh-tengah.vercel.app
>
> **Tanggal:** 17 September 2026 · **Basis audit:** `main` @ `cb00062a9a5ed8f9019f29fdf26603dfec04ac7f` (deployment Production terakhir, 15 Sep 2026)
>
> **Metodologi & tools:**
> - **[autoskills](https://github.com/midudev/autoskills)** — checklist skill: `next-best-practices`, `react-best-practices`, `seo`, `accessibility`, `supabase-postgres-best-practices`, `deploy-to-vercel`, `nodejs-best-practices`
> - **ponytail** (DietrichGebert) — *whole-repo over-engineering audit*: cari yang bisa dihapus/disederhanakan (`delete` / `stdlib` / `native` / `yagni` / `shrink`)
> - **premortem** (Gary Klein, prospective hindsight) — "proyek ini sudah gagal; kenapa?" → sebab → mitigasi → sinyal peringatan dini
> - Pengujian manual: `npm ci && lint && build` bersih, server produksi lokal + probing API/headers, probing live web, analisis riwayat git (770 MB), analisis 7 branch remote, verifikasi data JSON vs klaim dokumentasi vs live

---

## RINGKASAN EKSEKUTIF

| Dimensi | Nilai | Catatan singkat |
|---|---|---|
| **Fungsional live** | 🔴 **P0 rusak** | Backend dinamis (SKM/rating/lapor/dashboard) gagal di produksi — DB Supabase mati/schema hilang |
| **Keamanan** | 🟡 Sedang–Baik | Header lengkap, sanitasi input, rate-limit ada; tapi non-atomic, bypass sanitizer `javascript:`, Turnstile **klaim fiktif** |
| **Arsitektur** | 🟢 Baik untuk skala ini | Next.js 14 Pages Router konsisten; data statis JSON + API routes terpisah; service-role key hanya di server ✓ |
| **Konten & data** | 🟡 | Konten Pemdi sangat matang (250 item bukti terpetakan), tapi **banyak angka klaim tidak sinkron** antara README/AGENTS/MASTERPLAN vs data vs live |
| **Integritas/kepatuhan** | 🔴 | Live mengklaim **"Portal Resmi Pemerintah Kabupaten Aceh Tengah"** padahal deskripsi repo menyatakan *"Bukan Portal Resmi"* — risiko reputasi & hukum |
| **Dokumentasi (DOX)** | 🟡 | Klaim "DOX Clean 0 gap" **tidak benar** — pages/AGENTS.md mendokumentasikan komponen yang sudah mati |
| **Higien git/repo** | 🔴 | Riwayat git **770 MB** penuh PDF 30–45 MB; 7 branch remote, 5 stale |
| **Performa** | 🟡 | First-load JS wajar (105–174 kB); tapi JSON besar di client bundle, og-image 1,6 MB, font render-blocking |
| **SEO** | 🟢–🟡 | Sitemap/robots/OG/JSON-LD bagus; **tanpa `rel=canonical`**; halaman dashboard tipis untuk crawler |
| **Aksesibilitas** | 🟢–🟡 | Skip-link, focus trap, aria-live, reduced-motion ada; kontras & detail perlu audit menyeluruh |

**Kesimpulan satu paragraf:** Fondasi teknis dan kedalaman konten evaluasi Pemdi ini jauh di atas rata-rata proyek pemda sukarela — tapi proyek ini sedang **bocor kepercayaan di tiga titik**: (1) fitur interaktif yang "tampak hidup tapi backendnya mati" persis seperti yang ditemukan audit Juni 2026 lalu — **regresi terjadi lagi**; (2) identitas "Portal Resmi" tanpa mandat; (3) dokumentasi yang membesarkan diri (Turnstile, DOX clean, angka-angka basi). Plus satu utang operasional besar: repo 770 MB.

---

## 1. TEMUAN LIVE WEB (produksi, 17 Sep 2026)

### 🔴 P0-L1 — Backend dinamis produksi RUSAK (regresi dari audit Juni 2026)

Hasil probing langsung ke `https://pemdi-aceh-tengah.vercel.app`:

| Endpoint | Hasil | Arti |
|---|---|---|
| `GET /api/skm` | **500** `{"error":"Gagal memuat ringkasan"}` | Query view `skm_ringkasan` gagal |
| `GET /api/feedback` | **500** `{"error":"Gagal memuat rating"}` | Query tabel `rating_feedback` gagal |
| `GET /api/skm/stats` | **gagal/tidak merespons** (timeout saat di-fetch) | Kemungkinan loop N+1 (lihat §3) + DB error |
| Semua halaman publik (`/`, `/pemdi`, `/probis`, `/layanan`, `/skm`, `/faq`, `/tanya`, `/cari`, `/opd/*`, dll.) | ✅ 200 | Konten statis sehat |
| `GET /api/opd`, `/api/spbe`, `/api/requirement` | ✅ 200 JSON | API statis sehat |
| `GET /api/admin/skm`, `/api/admin/laporan` (tanpa token) | ✅ 401 | Auth admin bekerja |
| `robots.txt`, `sitemap.xml` (69 URL), `manifest.json` | ✅ 200 | SEO dasar sehat |

**Diagnosis:** env Supabase terisi (`isSupabaseReady=true`) — kalau tidak, responsnya akan 503 "DB belum dikonfigurasi". Jadi kegagalan ada di **database-nya sendiri**: kemungkinan besar project Supabase free-tier **ter-pause** (tidak aktif >1 minggu) atau tabel/view (`skm`, `skm_ringkasan`, `rating_feedback`, `laporan`, `rate_limits`, 2 RPC) **tidak pernah/sudah tidak ada** di project yang ditunjuk env. `audit/HASIL_VERIFIKASI_PerbaikanV2.md` (12 Juni) mencatat `tersimpan:true` — artinya DB pernah hidup lalu **mati lagi**.

**Dampak di live:**
- Warga isi survei SKM → `POST /api/skm` hampir pasti gagal ("Gagal menyimpan survei") — data kepuasan (bobot 25% terbesar Pemdi!) tidak terkumpul.
- Tombol rating ★ di semua halaman → error.
- `/dashboard-kepuasan` → kosong/error state.
- `/admin` → panel kosong/tanpa data; tombol lapor di FAB kemungkinan gagal tersimpan.
- `Lapor Widget` fallback tanpa DB akan mengembalikan `tersimpan:false` **seolah sukses** — kembali ke masalah kepercayaan "K-1" audit lama.

**Perbaikan:** (1) cek dashboard Supabinfo project — un-pause/naikkan plan atau migrasi; (2) jalankan ulang `db/schema.sql` + `db/rate-limit-schema.sql`; (3) tambah health-check endpoint (`GET /api/health` → `select 1`) + uptime monitor (UptimeRobot/cron Vercel) **dengan alert** supaya kegagalan diam-diam seperti ini tidak terulang; (4) tambahkan indikator status DB di `/admin`.

### 🔴 P0-L2 — Klaim "Portal Resmi" vs kenyataan "Bukan Portal Resmi"

- Marquee + brand sidebar live: **"Portal Resmi Pemerintah Kabupaten Aceh Tengah"**.
- FAQ: "portal resmi Pemerintah Kabupaten Aceh Tengah…" · Kebijakan privasi: "Komitmen Pemerintah Kabupaten Aceh Tengah…" · Footer: "© … Pemerintah Kabupaten Aceh Tengah".
- JSON-LD `_app.js`: `@type: GovernmentOrganization`, `sameAs: acehtengahkab.go.id`.
- Sementara **deskripsi repo GitHub**: *"Portal Pemerintah Digital Kabupaten Aceh Tengah — **Bukan Portal Resmi**"* — disclaimer hanya ada di GitHub, tidak ada di situs.

**Risiko:** untuk situs yang mengumpulkan data pribadi warga (kontak laporan, survei) dan menampilkan data evaluasi resmi (indeks, bukti dukung Perbup/Renstra/Renja), mengklaim ke-resmi-an tanpa mandat adalah risiko reputasi, kepatuhan (UU PDP — siapa pengendali data?), dan bisa dianggap penyalahgunaan identitas instansi begitu situs mendapat trafik. Ini juga inkonsistensi internal yang paling terlihat oleh penilai KemenPANRB.
**Perbaikan:** pilih satu jalur — (a) **mandat resmi**: SK tim + subdomain `*.acehtengahkab.go.id` + PPE/PKI, atau (b) **portal komunitas**: disclaimer permanen di header/footer ("Portal komunitas open-source, bukan portal resmi Pemkab — sumber resmi: acehtengahkab.go.id"), hapus kata "resmi", perbaiki JSON-LD (`@type: WebSite`, bukan GovernmentOrganization). Samakan deskripsi repo.

### 🟠 P1-L3 — `security.txt` menunjuk halaman yang tidak ada

`public/.well-known/security.txt` mengarah ke `/kontak` (**404**) dan `/pgp-key.txt` (**404**). Peneliti keamanan yang mengikuti RFC 9116 akan menabrak jalan buntu. Perbaiki: buat halaman kontak/atau ganti ke mailto + hapus baris PGP jika tidak disediakan.

### 🟠 P1-L4 — Turnstile di-klaim tapi TIDAK ADA implementasinya

README + `pages/api/AGENTS.md` + badge README menyatakan "Cloudflare Turnstile verification di form SKM & Lapor" dan env `TURNSTILE_SECRET_KEY`. **Realitas:** 0 kode — tidak ada widget, tidak ada verifikasi server, `lib/security.js` tidak punya fungsi verify. (Catatan: dokumen verifikasi Juni 2026 bahkan meng-claim "backend sudah siap menerima `turnstileToken`" — itu tidak pernah ada di kode sekarang.) CSP saat ini (`script-src 'self'`; `frame-src 'self'`) juga **akan memblokir** widget Turnstile bila suatu hari dipasang tanpa update CSP. Perbaiki: implementasikan sungguhan (widget + `siteverify` server-side + CSP `https://challenges.cloudflare.com`) **atau** hapus semua klaim Turnstile dari dokumentasi.

### 🟢 Yang sudah benar di live
- Semua 24 rute publik 200; 404 untuk OPD tak dikenal & rute acak ✓
- Header keamanan lengkap: CSP, X-Frame-Options SAMEORIGIN, nosniff, Referrer-Policy, Permissions-Policy, tanpa `X-Powered-By` ✓
- `robots.txt` benar (`Disallow: /admin`, `/api/`) & sitemap 69 URL (termasuk 52 halaman OPD, `/admin` ter-exclude) ✓
- Data live = data repo (indeks 0,38; 25 layanan; 52 OPD; 4.507 ASN; SPBE 2,59) — deploy sinkron dengan `main` ✓
- Login admin live menampilkan form, data terlindungi 401 ✓

---

## 2. ARSITEKTUR (luar-dalam)

### 2.1 Stack & struktur — 🟢 sehat untuk skalanya

```
Next.js 14.2.35 (Pages Router) + React 18.3.1 → Vercel (free tier)
Data konten: data/*.json (13 file, ~600 KB) → bundel build
Data dinamis: Supabase Postgres (service-role, SERVER-SIDE ONLY ✓ via lib/supabaseAdmin.js)
Search: Fuse.js (index dibangun di getStaticProps ✓ — lib/search-index.js)
Sitemap: next-sitemap (postbuild) · Analytics: @vercel/analytics
22 route pages + 10 API routes + 40 file komponen .js (20 aktif, 20 mati — lihat §5) + 11 lib + 2 hooks
```

- ✅ `supabaseAdmin` hanya diimpor API routes (server) — **tidak ada service-role key di client**, tidak ada `NEXT_PUBLIC_*` sama sekali.
- ✅ SSG untuk halaman berat; `fallback: false` untuk 52 OPD; pencarian di-build saat `getStaticProps`.
- ✅ PWA manifest lengkap (maskable, shortcuts, `lang: id`), `security.txt` ada (tapi rusak isinya — lihat P1-L3).
- ✅ CI GitHub Actions: lint + build pada push/PR ke main.

### 2.2 Pelanggaran pola (vs skill `next-best-practices` / `supabase-postgres-best-practices`)

| # | Temuan | Dampak |
|---|---|---|
| A-1 | **JSON raksasa di client bundle**: `pages/pemdi.js` & `pages/modul-indikator.js` mengimpor langsung `modul-indikator.json` (211 KB) + `pemdi.json` (131 KB) + 3 JSON lain ≈ **460 KB data mentah** per halaman. First-load JS: /pemdi **174 kB**, /modul-indikator **172 kB** (vs baseline 105–111 kB). Konten juga dobel (HTML prerender + JSON di JS). | Performa mobile; saldo kuota data pengguna |
| A-2 | `pages/modul-indikator.js` **1.938 baris** dalam satu file (page + filter + 4 sub-tampilan + modal). | Maintainability |
| A-3 | **N+1 query di `/api/skm/stats`**: loop 8 dimensi × `select(dimensi)` **tanpa filter** (mendownload seluruh isi tabel `skm` 8×) + select semua baris `rating_feedback`. Seharusnya 1 RPC agregat SQL. | Latensi + kuota Supabase; makin buruk seiring data tumbuh — ini juga biang timeout live |
| A-4 | **Rate limiter non-atomic** (`lib/rate-limit-db.js`): pola read→update terpisah (TOCTOU) + cache 2 detik. Request paralel bisa lolos melewati limit; fallback in-memory hanya per-instance serverless. | Rate limit bisa ditembus burst paralel |
| A-5 | Font dimuat via `<link>` Google Fonts di `_document.js` (render-blocking) — skill menyarankan `next/font` (self-host, zero CLS, preload). | LCP |
| A-6 | `images.unoptimized: true` + 4× `<img>` manual (warning lint). og-image **1,6 MB**, crest **1 MB**. | Bandwidth/LCP |
| A-7 | **0 test** — termasuk `lib/pemdiNilai.js` yang mengimplementasikan **rumus resmi PermenPANRB 8/2026**. Salah bobot/rounding tidak akan ketahuan. | Kredibilitas angka indeks |
| A-8 | `db/schema.sql`: RLS di-enable tanpa policy (aman selama pakai service role), tapi tabel `rate_limits` **tanpa RLS** sama sekali; error di `skm/stats` ditelan `catch {}` diam-diam. | Hygiene DB |

### 2.3 Branch audit (7 branch remote)

| Branch | Status riil | Commit unik vs main | Rekomendasi |
|---|---|---|---|
| `fix/pemdi-l0-l10-jun2026` | ✅ **merged** (merge commit `14d228b`) | 0 | **Hapus** |
| `fix/full-audit-award-redesign` | ✅ **merged** (semua commit adalah leluhur main) | 0 | **Hapus** |
| `fix/portal-ux-2026-08-10` | ✅ **squash-merged** via PR #3 → `a51fa4d` (pesan identik) | 1 (duplikat squash) | **Hapus** |
| `fix/sprint-redesign-award-redesign` (`fix/sprint-redesign-award-level`) | ❌ tidak merge (Juni) | 2 — sprint redesign award-level + endpoint tracking `/api/lapor?id=` | **Hapus** — ide tracking sudah diimplementasi lebih baik di main (`/api/lapor/status`) |
| `salvage/old-award-redesign` | ❌ tidak merge — **tip sama persis** dengan branch di atas (`5967917`) | 2 (duplikat) | **Hapus** (duplikat) |
| `arena/019feb94-pemdiacehtengah` | ❌ PR #2 CLOSED (digantikan PR #3) | 3 — 2 dokumen audit L1/L2 + 1 UX foundation | UX-nya sudah tergantikan; dokumen auditnya tumpang tindih dengan `docs/analisis-bukti-dukung-l1-l2.md`. Cherry-pick dokumen bila dianggap bernilah, lalu **hapus** |
| `main` | Produksi (deploy 15 Sep) | — | — |

**Kesimpulan branch:** tidak ada satu pun branch yang berisi kerja baru bernilai tinggi yang belum ada di main. 6 dari 7 branch adalah sampah historis → bersihkan agar peta kerja jelas.

### 2.4 Higien git & ukuran repo — 🔴

- `.git` lokal **770 MB**; GitHub melaporkan repo **~877 MB**. Penyebab: ratusan blob PDF bukti dukung 20–45 MB (`I8_L1_Final.pdf` 44,9 MB, `I10_L1_Final.pdf` 41,5 MB, …) yang pernah di-commit lalu dihapus — **tetap hidup di riwayat**. Ada juga `arsip-bukti-dukung/` di riwayat.
- Konsekuensi: clone/CI lambat, kontributor baru tersiksa, mendekati batas praktis GitHub.
- Saat ini masih ada **39 MB PDF "final"** di `public/bukti-dukung/final/` yang **dipublikasikan ke seluruh internet** via Vercel — ini dokumen evaluasi internal (Perbup, Renstra, Renja, laporan). Ada trade-off transparansi vs tata kelola data; minimal: pastikan pemilik data (Diskominfo) mengizinkan publikasi, dan pisahkan dari repo git (host eksternal + link).
- File hasil generate di-commit dan menimpa terus (`chore: update sitemap-0.xml` ada di riwayat) — sebaiknya keluarkan dari git (`.gitignore` + build-time).
- ✅ Tidak ada secrets/`.env` di seluruh riwayat (sudah diverifikasi).

---

## 3. KEAMANAN — detail

| Kode | Severity | Temuan | Detail & perbaikan |
|---|---|---|---|
| S-1 | 🟠 **Tinggi** | **Sanitizer bisa dilewati `javascript:` URI** — `lib/sanitize.js`: branch link eksternal mengembalikan `href` apa adanya (`!startsWith('/') && !startsWith('#')` → `<a href="javascript:…">` lolos utuh + ditambah `target=_blank`). | Laten (data FAQ internal), tapi satu-satunya pertahanan sebelum `dangerouslySetInnerHTML` di `/faq` & `/tanya`. Perbaiki: blocklist `javascript:`/`data:` (lihat `lib/safeRichText.js` — ironisnya file mati justru punya penanganan ini), atau lebih baik: render jawaban FAQ sebagai React nodes tanpa `dangerouslySetInnerHTML` |
| S-2 | 🟠 Tinggi | **Rate limit bisa dilewati** (non-atomic + cache 2s + fallback per-instance). | Ganti jadi 1 RPC atomic: `insert into rate_limits ... on conflict do update set count = count+1 returning count` |
| S-3 | 🟡 Sedang | **Perbandingan token admin tidak constant-time** (`===`) → teoretis timing attack; token admin = password mentah disimpan di `sessionStorage` (XSS = kebocoran). | Pakai `crypto.timingSafeEqual`; idealnya ganti ke session singkat + httpOnly cookie; pertimbangkan Supabase Auth multi-user |
| S-4 | 🟡 Sedang | `GET /api/lapor/status` **tanpa rate limit** — ID `LAPOR-YYYYMMDD-XXXXXX` hanya 3 byte acak (16,7 juta/hari) → brute-force tracking ID orang lain feasible. | Tambah rate-limit + perpanjang random ke 6–8 byte |
| S-5 | 🟡 Sedang | `/api/proxy-pdf` mem-*passthrough* `Content-Type` upstream — jika JDIH pernah menyajikan HTML, akan dirender same-origin (vektor XSS tersimpan). Buffer full-file di memori, tanpa rate limit (bisa jadi proxy hammer ke JDIH). | Force `application/pdf` atau whitelist content-type; stream; rate limit |
| S-6 | 🟢 Rendah | CSP: `script-src 'unsafe-inline'` (dibutuhkan script tema/JSON-LD — pakai nonce bila mau keras); `connect-src https://*.supabase.co` **tidak perlu** (klien tidak pernah memanggil Supabase langsung) — perlebar serendah mungkin. | Rapikan saat implementasi Turnstile |
| S-7 | 🟢 Rendah | Admin single shared password, tanpa rotasi/audit log; `PATCH /api/lapor` admin dapat mengubah status laporan siapa pun (memang by design). | Tambah audit log tabel + rotasi berkala |
| S-8 | 🟢 Info | Sanitasi input lapor/SKM/feedback baik (strip tag, length, validasi enum/integer) ✓ · IP di-hash SHA-256+salt ✓ · CORS dibatasi origin ✓ · SSRF proxy-pdf diblokir untuk host lain ✓ (diuji) · XSS di form lapor tersanitasi ✓ (diuji: `<script>` → teks) · 401 admin ✓ (diuji) | — |

---

## 4. KONTEN & KONSISTENSI DATA — matriks klaim vs kenyataan

| Klaim (dokumen) | Realita (data/live) | Status |
|---|---|---|
| README: "Indeks Pemdi Baseline **~1,84**" | `pemdi.json` + live: **0,38** (Capaian Terverifikasi, 47/250 bukti) | ❌ README basi |
| MASTERPLAN: "indeks dari **1,68** ke ≥3,50" | 0,38 | ❌ basi |
| README: "**27 layanan** publik dalam 7 kategori" | `layanan.json`: **25** (7 kategori ✓); live: "25 Layanan Terpadu" | ❌ README basi |
| README: "SKM **8 dimensi × 24 pertanyaan**" | `skm.json`: 8 dimensi × **1 pertanyaan** per dimensi; live: "8 dimensi penilaian" | ❌ misrepresentasi besar |
| README: "44 unit" SKM | `skm.json`: **43 unit**; halaman `/dashboard-kepuasan` menyebut **41** | ❌ tiga angka berbeda |
| README: "Peta Proses Bisnis — **24 Urusan**" | `opd.json`: level_1 = **35 urusan**; L0 = 8 misi ✓; L2 = 6 kategori / 78 proses | ❌ README basi |
| README: "52 halaman detail PD (SSG)" | 52 OPD di `getStaticPaths` + sitemap ✓ | ✅ |
| README/AGENTS: "83 requirements (12 kategori)" | `requirement.json`: 83 ✓ (A–L) | ✅ |
| AGENTS: "Indeks Pemdi **0.38** · 250 bukti (47 lengkap)" | `pemdi.json` ✓ | ✅ (AGENTS paling akurat) |
| AGENTS: komponen "39" | 40 file `.js` di `components/` — hanya **20 aktif**, 20 dead code (lihat §5); tree README menyebut komponen yang sudah dihapus | ❌ DOX drift |
| AGENTS: "Stack Next.js **14.2.35**, React **18.2.0**; font **Inter**; config standalone output; manifest theme **#004098**" | Lock: React **18.3.1**; font: **Plus Jakarta Sans**; `next.config.js` **tanpa** `output:'standalone'`; manifest theme **#1F2A44** | ❌ DOX drift |
| BACKLOG: "222 item data dukung; 33 lengkap (14%)" | 250 item; 47 lengkap | ❌ basi |
| AGENTS: "🟢 DOX Clean — 0 gap dokumentasi" | `pages/AGENTS.md` mendokumentasikan **AwardHero, QuickActions, ProbisSection, Rekomendasi, LaporanStatus, Header** untuk `index.js` — **semuanya dead code** | ❌ klaim palsu |

**Kualitas konten Pemdi itu sendiri: luar biasa matang** — `pemdi.json` + `modul-indikator.json` (ground truth 20 indikator) + mapping bukti + `lib/pemdiNilai.js` dengan rumus & predikat resmi + transparansi penuh di `/pemdi` (tabel bobot×nilai, catatan indikator eksternal, proyeksi skenario). Ini kekuatan terbesar proyek. Namun:

- **Bug tampilan `/tanya`**: jawaban FAQ mengandung HTML (`<a href="/">…</a>`) tapi chatbot merendernya sebagai teks polos → user melihat tag mentah. (Karena `isHtml` tidak pernah disetel true untuk jawaban korpus.)
- **Data layanan**: `sla: "92%"` dll. **tanpa sumber/periode** — hanya disclaimer "data masih partial" di JSON yang tidak sampai ke UI. Untuk portal yang menjual transparansi, angka SLA tanpa sumber adalah liability. Tambahkan `sumber` + `perbarui` per layanan dan tampilkan.
- Angka yang benar & konsisten: 52 PD (38 instansi + 14 kecamatan) ✓, 4.507 ASN ✓, SPBE 2,59 (2025) ✓.

---

## 5. PONYTAIL AUDIT — over-engineering & yang bisa dihapus

> Format: `lokasi: <tag> apa yang dipotong. Penggantinya.` — tag: delete/stdlib/native/yagni/shrink. Total dampak langsung: **22 file mati, 2.241 baris**.

| Lokasi | Tag | Temuan → Pengganti |
|---|---|---|
| `components/Accordion.js` | delete | Dead code (0 impor) → tidak ada |
| `components/AwardHero.js` | delete | Dead code (0 impor) → tidak ada |
| `components/DataBadge.js` | delete | Dead code → tidak ada |
| `components/Explainer.js` | delete | Dead code → tidak ada |
| `components/Header.js` | delete | Ghost component (`display:none`, aria-hidden, komentar "di-replace AppShell") → hapus; AppShell sudah jadi header |
| `components/LaporanStatus.js` | delete | Dead code → tidak ada |
| `components/Modal.js` | delete | Dead code (LaporWidget punya modal sendiri) → tidak ada |
| `components/PPBChain.js` | delete | Dead code → tidak ada |
| `components/PemdiCalculator.js` | delete | Dead code (perhitungan kini di `lib/pemdiNilai.js` + panel /pemdi) → tidak ada |
| `components/ProbisSection.js` | delete | Dead code → tidak ada |
| `components/ProgressBarVisual.js` | delete | Dead code → tidak ada |
| `components/QuickActions.js` | delete | Dead code → tidak ada |
| `components/Rekomendasi.js` | delete | Dead code → tidak ada |
| `components/RekomendasiTracker.js` | delete | Dead code → tidak ada |
| `components/Section.js` | delete | Dead code → tidak ada |
| `components/Stepper.js` | delete | Dead code → tidak ada |
| `components/TimelineRoadmap.js` | delete | Dead code → tidak ada |
| `components/Toast.js` | delete | Dead code → tidak ada |
| `components/motif/KerawangCard.js`, `KerawangHero.js` | delete | Dead code (dipakai `KerawangMotifs.js`? tidak — 0 impor) → tidak ada |
| `lib/cors.js` | delete | Dead code — tiap API route mengatur CORS sendiri; helper ini tak pernah dipanggil → tidak ada |
| `lib/safeRichText.js` | delete | Dead code — **duplikat** `lib/sanitize.js` (dua sanitizer buatan tangan, yang dipakai justru yang lebih lemah) → satu sanitizer teruji (atau DOMPurify) |
| `lib/sanitize.js::highlightText` | delete | ~40 baris fungsi highlight dengan output "HTML string ber-`key` JSX" palsu — 0 pemakai, komentarnya sendiri kontradiktif | 
| `pages/admin.js::hash()` | delete | Fungsi hash 8-baris tanpa pemanggil → tidak ada |
| `README.md` arsitektur + badge | shrink | Tree README mendokumentasikan komponen/lib mati (Rekomendasi, DataBadge, ExpandablePanel, …) + badge Turnstile fiktif → tulis ulang sesuai realita |
| `desain/prototype-*.html` (5 file) | delete | Prototype statis usang setelah redesign Kerawang selesai — pindah ke wiki/arsip jika ingin disimpan |
| Data JSON di halaman (A-1) | yagni | `/pemdi` & `/modul-indikator` mengimpor 5 JSON besar padahal sebagian besar hanya untuk modal detail → pindah ke `getStaticProps` + endpoint on-demand / lazy chunk |
| `public/sitemap*.xml`, `robots.txt` ter-commit | native | next-sitemap regenerate tiap build → `.gitignore` kan, hilangkan churn commit |

**Yang JANGAN dipotong** (terlihat "bisa disederhanakan" tapi bernilai): focus-trap di LaporWidget, skip-link, `lib/pemdiNilai.js` yang terdokumentasi regulasi, IP hashing, dan fallback ramah saat DB mati — semua itu murah dan muat tujuannya.

---

## 6. PREMORTEM — "Proyek ini sudah gagal. Ini kenapa."

> Frame: **Januari 2027. Portal Pemdi Aceh Tengah ditinggalkan dan dipermalukan.** Dari masa kini, penyebabnya sudah terlihat — beberapa bahkan sudah terjadi.

### Sebab kegagalan (diurut dari yang sudah terjadi)

1. **"Fitur hidup yang mati diam-diam" — SUDAH TERJADI.** Supabase free tier ter-pause → SKM/lapor/rating/admin mati berbulan-bulan tanpa ada yang sadar (tidak ada monitoring). Warga yang lapor tidak ditindaklanjuti; data kepuasan kosong; klaim I19/I20 (bobot 25%) tidak terbukti saat verifikasi. *(Bukti: 500 di /api/skm & /api/feedback hari ini.)*
2. **Krisis identitas "resmi vs tidak resmi".** Situs makin populer → Pemkab/Diskominfo menegur klaim "Portal Resmi" tanpa mandat; atau sebaliknya situs dianggap sumber resmi padahal datanya tak diverifikasi → insiden misinformasi (angka indeks/SLA). Repo 877 MB membuat serah terima ke pemda nyaris mustahil dilakukan.
3. **Bus factor = 1.** Semuanya (kode, data, dokumen, akses Supabase/Vercel/domain) dipegang satu orang. Maintainer sibuk/lulus/berhenti → semuanya mati, termasuk akun Vercel free dan project Supabase.
4. **Kepercayaan data runtuh saat diverifikasi.** Angka indeks/SLA/layanan yang dipublikasikan percaya diri ternyata ditolak KemenPANRB (bukti tak lengkap, data eksternal I5/I6/I7 belum masuk) — portal yang membangga-banggakan transparansi jadi bukti melawan dirinya sendiri.
5. **Insiden keamanan kecil jadi besar.** Token admin statis bocor (tidak ada rotasi/log) → data laporan warga (kontak pribadi) tumpah; atau endpoint di-spam karena rate limit non-atomic; situs "pemerintah" kena deface → pemberitaan.
6. **Utang performa menumpuk saat trafik naik.** Vercel free habis; halaman 460 KB JSON; og-image 1,6 MB; tidak ada budget/caching strategy.
7. **Motivasi mati setelah deadline evaluasi.** Setelah upload eval.spbe.go.id selesai (sudah terjadi — lihat riwayat commit "masa penilaian mandiri selesai"), tak ada pemilik roadmap → proyek beku.

### Mitigasi (yang harus berubah sekarang)

| Risiko | Mitigasi konkrit | Sinyal peringatan dini (pantau mingguan) |
|---|---|---|
| DB mati diam-diam | `/api/health` + uptime monitor + alert; indikator status di /admin; SOP pemulihan di README | `GET /api/feedback` ≠ 200 |
| Identitas | Disclaimer resmi/mandat SK + subdomain go.id; samakan deskripsi repo | Ada teguran/DM; keluhan "portal palsu" |
| Bus factor | Dokumentasikan akses (env, Supabase, Vercel) ke pemangku kepentingan resmi; tambahkan 1 co-maintainer; ekspor backup data berkala | Hanya 1 komitter ≥ 60 hari |
| Kredibilitas data | Tampilkan sumber+tanggal di setiap angka (SLA, indeks); label jelas "capaian terverifikasi vs proyeksi" (sudah bagus di /pemdi — terapkan juga di layanan) | Verifikator menemukan angka tanpa sumber |
| Keamanan | Rotasi token + timingSafeEqual + RPC rate-limit atomic + audit log | Lonjakan 401/429 di log |
| Performa | Pindahkan JSON ke server, optimasi aset (target: halaman berat < 150 kB first-load) | LCP > 3s di lapangan |
| Keberlanjutan | Tetapkan pemilik produk (Diskominfo) + ritme review kuartalan; kurangi ukuran repo supaya bisa diserahterimakan | Repo > 1 GB |

### Pre-launch checklist (sebelum mengklaim apa pun lagi)
- [ ] `GET /api/health` 200 dari luar + monitor aktif
- [ ] Satu kalimat status ke-resmi-an yang konsisten di situs, repo, dan JSON-LD
- [ ] Semua angka publik punya `sumber` + `tanggal` di UI
- [ ] Post/SKM/lapor dites end-to-end dengan DB hidup (bukan fallback)
- [ ] Turnstile benar-benar terpasang atau semua klaimnya dihapus
- [ ] Backup data Supabase terjadwal & teruji restore

---

## 7. SEO & AKSESIBILITAS

**SEO** (vs skill `seo`): ✅ title+meta description unik per halaman, OG lengkap + og:image absolut 1200×630, JSON-LD, sitemap 69 URL + lastmod, robots benar, arsitektur URL bersih (`/opd/[slug]`), bahasa `lang="id"`. ❌ **Tidak ada `rel="canonical"`** di halaman mana pun (tambahkan; opsional trailing-slash/duplikat param `?q=` di /cari perlu canonical); `/dashboard-kepuasan` & `/tanya` pada dasarnya shell kosong bagi crawler (fetch client-side) — beri ringkasan SSR; og-image 1,6 MB (target < 300 KB — WhatsApp/FB sering drop > 1 MB); `/cari?q=...` terindeks bisa menghasilkan duplikat.

**Aksesibilitas** (vs skill `accessibility`): ✅ skip-link, `main` landmark, focus-trap + Escape + aria-modal di modal lapor, `aria-live="polite"` chat, label form, `prefers-reduced-motion` dihormati (kecuali running text — disengaja, terdokumentasi di commit `5855aaf`), kontras teks utama baik. 🟡 Perlu audit lanjutan: kontras badge berwarna dinamis di OPD/pemdi, ukuran target sentuh mobile topbar, `role="alert"` pada toast SKM (sebaiknya `role="status"` — alert terlalu assertif), heading hierarchy di beberapa halaman panjang, dan uji keyboard penuh pada tabel OPD yang difilter.

---

## 8. REKOMENDASI PRIORITAS

### 🔴 P0 — minggu ini
1. **Pulihkan backend live**: un-pause/restore Supabase → jalankan `db/schema.sql` + `db/rate-limit-schema.sql` → tes POST SKM/lapor/feedback end-to-end → deploy. Tambah `/api/health` + uptime monitoring dengan alert.
2. **Putuskan identitas** (resmi vs komunitas) dan samakan: situs, deskripsi repo, JSON-LD. Hapus/hapus-dulu kata "Portal Resmi" bila tak ada mandat.
3. **Perbaiki `security.txt`** (hapus rujukan `/kontak` & `/pgp-key.txt` yang 404).
4. **Sinkronkan angka** README/AGENTS/MASTERPLAN/BACKLOG dengan data (indeks 0,38; 25 layanan; 35 urusan; 43 unit SKM; 15 FAQ) — atau jadikan `data/*.json` satu-satunya sumber dan generate statistik dokumen dari sana.

### 🟠 P1 — ≤ 30 hari
5. Hapus 22 file dead code (2.241 baris) + `highlightText` + `hash()` + prototype HTML usang; perbarui README/DOX agar tidak mendokumentasikan yang mati (hapus klaim "DOX Clean 0 gap" sampai benar).
6. Keamanan: timing-safe compare admin; RPC rate-limit atomic; rate-limit `/api/lapor/status` + ID 6–8 byte; perbaiki bypass `javascript:` di `lib/sanitize.js`; whitelist content-type `proxy-pdf`; rapikan CSP.
7. `/api/skm/stats`: ganti loop N+1 → satu RPC agregat (`avg` per dimensi + per unit + tren) — sekaligus memperbaiki timeout.
8. Perbaiki render HTML jawaban chatbot `/tanya`.
9. Performa: `next/font`; og-image/crest dikompres (< 300 KB / < 200 KB); pindahkan JSON besar dari client bundle ke `getStaticProps`/lazy; pertimbangkan `next/image`.
10. Implementasi atau hapus Turnstile (kode + CSP + dokumen).
11. **Unit test untuk `lib/pemdiNilai.js`** (rumus resmi — bobot, rounding, predikat, indikator eksternal) + smoke test API di CI.
12. Bersihkan branch: hapus 6 branch stale (semua sudah merged/superseded/duplikat).

### 🟡 P2 — kuartal ini
13. Repo slimming: pindahkan PDF bukti ke storage eksternal (Supabase Storage/R2) + link; pertimbangkan `git filter-repo` (koordinasi tim) atau fresh start orphan-branch; `.gitignore` file generate.
14. Tambah `rel=canonical`; SSR ringkasan untuk `/dashboard-kepuasan`; `role="status"` toast SKM.
15. Audit aksesibilitas penuh (axe/Lighthouse) + perbaikan kontras.
16. Tata kelola data layanan: verifikasi SLA/layanan bersama OPD, tampilkan sumber & tanggal.
17. Rencana keberlanjutan: pemilik produk resmi, co-maintainer, backup data terjadwal, rotasi kredensial, dokumentasi akses (bukan kredensial) untuk serah terima.

---

## LAMPIRAN — Bukti pengujian (ringkas)

- Build & lint lokal: **sukses**; 4 warning `<img>` di `modul-indikator.js`; first-load JS: shared 111 kB, /pemdi 174 kB, /modul-indikator 172 kB, /requirement 115 kB.
- Server produksi lokal (`next start`): 24 rute 200; `/opd/asal` 404; admin 401 (tanpa/salah token); POST lapor 201 + sanitasi XSS bekerja; SKM validasi 1–4 bekerja (400 untuk nilai 9); proxy-pdf menolak host lain (403); rate limit 503 (DB lokal kosong, sesuai desain).
- Live: halaman 200; `GET /api/skm` 500; `GET /api/feedback` 500; `GET /api/skm/stats` gagal fetch; `robots.txt`/`sitemap.xml`/`manifest.json` 200; admin login form tampil.
- Git: tidak ada secrets di riwayat; 770 MB `.git`; blob terbesar 44,9/44,8/41,5/37,8/37 MB (PDF bukti); 7 branch remote (6 stale, 1 produksi); PR #3 squash-merged; PR #2 closed; PR #4 merged.
- Data: 52 OPD (38+14) ✓ · 4.507 ASN ✓ · SPBE 2,59 ✓ · 25 layanan/7 kategori · 35 urusan L1 · 78 proses L2 · 15 FAQ · 83 requirement · Pemdi 7 aspek/20 indikator/250 item bukti/47 lengkap/indeks 0,38.

---

*Disusun dengan checklist autoskills (next/seo/accessibility/supabase/vercel), ponytail whole-repo audit, dan premortem prospective-hindsight. Semua temuan dapat direproduksi dari langkah di atas.*

---

## 9. TINDAK LANJUT — Perbaikan yang DITERAPKAN (17 Sep 2026, sesi hardening)

> Detail checklist per-skill autoskills: lihat `audit/CHECKLIST_AUTOSKILLS_2026-09-17.md`

### Keamanan (S-1 … S-5)
- ✅ **S-1** `lib/sanitize.js` ditulis ulang: tag dibangun dari nol, semua atribut dibuang kecuali `href` yang lolos allowlist positif `SAFE_HREF` (http/https//`/`/`#`/mailto) → bypass `javascript:`/`data:`/entitas tertutup; komentar HTML di-strip; `highlightText` (dead) dihapus
- ✅ **S-2** Rate limiter atomic: RPC `bump_rate_limit()` (Postgres `INSERT … ON CONFLICT DO UPDATE … RETURNING`) via `db/rate-limit-schema.sql`; cache 2-detik yang bikin under-count dihapus; fallback legacy → in-memory
- ✅ **S-3** `lib/adminAuth.js` → `crypto.timingSafeEqual` + length-masking
- ✅ **S-4** `/api/lapor/status` diberi rate-limit (10/menit/IP); ID lapor kini 12-hex (6 byte); regex menerima ID lama & baru
- ✅ **S-5** `/api/proxy-pdf` whitelist `content-type: application/pdf` (tolak 415); CSP `connect-src` diperketat (`'self'` saja — client memang tidak pernah memanggil Supabase)

### Reliabilitas (P0-L1)
- ✅ **Endpoint baru `/api/health`** — 200 (app+DB sehat) / 503 (DB mati), siap uptime monitor; **aksi user**: un-pause Supabase + jalankan `db/schema.sql` & `db/rate-limit-schema.sql`, lalu daftarkan monitor
- ✅ **A-3 N+1 dihapus** — `/api/skm/stats` kini 1 RPC `skm_stats_dimensi()` (fallback 1 query 8 kolom, sebelumnya 8 full-table select)

### Ponytail (§5)
- ✅ **22 file dead code dihapus (2.241 baris)**: 18 komponen + 2 motif + `lib/cors.js` + `lib/safeRichText.js`; `hash()` mati di `admin.js` ikut dihapus
- ✅ Aset mati dihapus: `public/crest-pemdi.png` (1 MB, 0 referensi); `og-image.png` 1,6 MB → **`og-image.jpg` 166 KB** (1200×630, q92 4:4:4)
- ✅ `public/robots.txt` + `sitemap*.xml` (hasil generate) keluar dari git → churn commit "update sitemap" hilang

### Konten & konsistensi (§4)
- ✅ Chatbot `/tanya`: jawaban FAQ ber-HTML kini dirender benar (`isHtml` → sanitize) — sebelumnya tag mentah terlihat user
- ✅ `dashboard-kepuasan`: "41 unit" → **43 unit** (sesuai data/skm.json)
- ✅ **README** disinkronkan total: indeks 0,38 · 25 layanan · 35 urusan · 43 unit SKM · API table lengkap (12 endpoint) · klaim Turnstile dihapus (belum diimplementasi) · tree arsitektur = realita
- ✅ **DOX pass 4 file**: `pages/AGENTS.md` (rewrite), `components/AGENTS.md` (rewrite 20 komponen aktif), `lib/AGENTS.md` (baru — sebelumnya dirujuk tapi tidak ada), root `AGENTS.md` (14 koreksi: React 18.3.1, Plus Jakarta Sans, tanpa standalone, theme #1F2A44, docs.old dihapus dari index, dst.)
- ✅ `BACKLOG.md`: sesi hardening dicatat; angka bukti 222/33 → 250/47

### Testing & CI (A-7)
- ✅ **16 unit test** (`test/pemdiNilai.test.mjs`, node:test): predikat Tabel 4 (12 batas), aturan berjenjang bukti, indikator eksternal, rumus indeks, **+ 4 pin regresi data riil: indeks 0,38 · proyeksi 2,29 · 250/47/4/199 bukti · 7 aspek × 20 indikator bobot 100%**
- ✅ CI: Node 20 → **Node 22** + step `npm test`

### Branch & repo
- ✅ **6 branch stale dihapus** (fix/pemdi-l0-l10-jun2026, fix/full-audit-award-redesign, fix/portal-ux-2026-08-10, fix/sprint-redesign-award-level, salvage/old-award-redesign, arena/019feb94) — tersisa `main` + branch kerja
- ❗ Riwayat 770 MB **belum** dibersihkan (perlu `git filter-repo` + koordinasi + force-push — backlog P2)

### SEO (§7)
- ✅ `rel="canonical"` + `og:url` dinamis di `_app.js` (bersih query/hash, home tanpa duplikat)
- ❗ `next/font` ditunda (sandbox tidak menjangkau fonts.googleapis.com; kerjakan di lokal/CI)

### Identitas (P0-L2) — keputusan pemilik repo
- 🗸 User memilih **mempertahankan klaim "Portal Resmi"** (koordinasi Pemkab)
- ❗ Update deskripsi repo GitHub gagal via API (token agent tanpa scope admin) → **manual di Settings → General → Description**, hapus frasa "Bukan Portal Resmi"

### Verifikasi pasca-perbaikan
- `npm run lint` ✅ · `npm test` **16/16 pass** ✅ · `npm run build` ✅ (lihat catatan commit)
- Smoke test server produksi lokal: 20 route 200, admin 401, health 503-tanpa-DB (sesuai desain), canonical muncul di semua halaman, sanitasi XSS tetap bekerja

---

## 10. PEMERIKSAAN ULANG & PENYEMPURNAAN (17 Sep 2026, pass kedua)

Pemeriksaan ulang seluruh pekerjaan pass pertama menemukan **7 kesalahan/kekurangan** — semuanya kini diperbaiki:

| # | Kesalahan yang ditemukan | Perbaikan |
|---|---|---|
| R-1 | **`SpbeGauge.js` hardcode nilai domain SPBE (2,80/2,50/1,00/3,40)** — prop `domain` dari `index.js` diabaikan. Akibat: **beranda dan halaman /spbe menampilkan angka berbeda ke publik** (data resmi opd.json: 2,30/1,70/1,00/3,75). *Temuan ini terlewat pada audit pass pertama.* | Komponen kini membaca prop `domain` (sumber tunggal `data/opd.json`); hardcode dihapus; typo "Risik" → "Risiko" |
| R-2 | **`og:url` duplikat** — `_document.js` masih memancarkan og:url statis + `_app.js` menambah og:url dinamis → 2 tag og:url bertentangan di tiap halaman (kesalahan yang SAYA perkenalkan di pass 1) | og:url statis dihapus dari `_document.js` |
| R-3 | **Meta description duplikat** (pre-existing): `_document` + tiap halaman sama-sama memancarkan description | description generik dihapus dari `_document.js` (18/20 halaman punya milik sendiri; `/admin` noindex) |
| R-4 | **Copy ID LAPOR masih format lama** (`XXXXXX` = 6 karakter) di 5 tempat (index, lapor ×3, LaporWidget) padahal ID baru 12-hex | Semua contoh/placeholder → `LAPOR-YYYYMMDD-A1B2C3D4E5F6`; tip format "12 karakter" (server tetap menerima ID lama 6-hex) |
| R-5 | **Sisa klaim Turnstile & angka basi**: README (baris Teknologi "Cloudflare Turnstile", "24 Urusan", "24 pertanyaan", "27 layanan", "47 indikator" di API table, tree db/ tanpa rate-limit-schema.sql) dan `pages/api/AGENTS.md` (field `turnstileToken` ×2, klaim "Turnstile verification" ×2) | Semua dibersihkan/sinkron dengan data riil |
| R-6 | **DOX masih tidak akurat di 3 file**: `data/AGENTS.md` ("Rekomendasi 8 item" → riil 7; "47 indikator" menyesatkan untuk konten opd.json), `styles/AGENTS.md` ("799 baris" → riil 1.591), `public/AGENTS.md` **dirujuk root AGENTS tapi filenya tidak ada** | data/AGENTS.md & styles/AGENTS.md dikoreksi; `public/AGENTS.md` dibuat (aset, aturan file generate & optimasi) |
| R-7 | **`skm/stats.js`**: var `dimensiRows` sisa refactor + error `err1/err2/err3/err4` ditelan tanpa log (sulit diagnosis insiden DB seperti P0-L1) | Var dihapus; semua error kini di-log `console.warn` |

Ditambahkan pula: banner status historis di `MASTERPLAN.md` (angka baseline di dalamnya tidak lagi mutakhir — menunjuk AGENTS.md + data sebagai sumber terkini).

**Verifikasi pass kedua:** lint 0 error · 16/16 test pass · build sukses · smoke: beranda kini menampilkan domain SPBE 2,30/1,70/1,00/3,75 (konsisten dengan /spbe), og:url & description tunggal per halaman, canonical tetap benar.
