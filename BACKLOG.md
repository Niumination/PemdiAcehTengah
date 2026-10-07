# PemdiAcehTengah — Sub-BACKLOG

**Project:** Portal Pemda Aceh Tengah
**Priority:** P1 — Critical
**Master:** `BACKLOG.md` (root)

## ✅ Completed

- [x] **Capaian nilai sesuai rumus resmi PermenPANRB 8/2026** — lib/pemdiNilai.js (Indeks Aspek Σ(wI×N)/wA; Indeks Σ(wA×IA); predikat Tabel 4; indikator eksternal I5/I6/I7/I18 field `eksternal`); /pemdi panel perhitungan + 4 kartu tolak ukur; indeks terverifikasi 0,38; proyeksi target 2,29 & skenario 2,375/2,50 — 19 Agu 2026
- [x] **Matriks Kebutuhan Bukti Dukung L1-L2** — docs/analisis-bukti-dukung-l1-l2.md (sumber NotebookLM dari Diskominfo) → data/kebutuhan-bukti-dukung.json (48 butir × 16 indikator; 10 lengkap · 19 belum · 19 perlu verifikasi) → section /modul-indikator#matriks-kebutuhan + tabel Panduan Bab 6 — 19 Agu 2026
- [x] **6 Quick Win 100%** — 52 OPD, 70 pages, 0 ESLint warnings — @pemdi-aceh-tengah
- [x] **Redesign UI Fase 0–5 (Kerawang Gayo)** — @pemdi-aceh-tengah
  - Fase 0: Tokens + motif SVG Kerawang Gayo, hook useMemo fix di /pemdi
  - Fase 1: Shell — Kerawang divider footer, motif ulen gov-strip, page transition, topbar gold
  - Fase 2: Home — hero aurora+emun, count-up KPI, marquee budaya, reveal-bar aspek
  - Fase 3: Data pages — pemdi, modul-indikator, spbe, probis, opd, dashboard-kepuasan
  - Fase 4: Layanan — layanan, cari, skm, faq, bantuan, lapor, tanya (hero Kerawang)
  - Fase 5: Info — glosarium, requirement, kebijakan-privasi, 404 (motif Kerawang)
- [x] **Fix QA anti-fail** — useCountUp/useInView (SSR target, fallback timeout), requirement.js CSR→SSR, data/requirement.json — console production 0 error
- [x] **Ground Truth NotebookLM** — 20 indikator (I1–I20), 222 item data dukung di `data/modul-indikator.json`; I5/I6/I7/I18 dikosongkan sesuai strategi (auto-scored + rawan tolak)

## ✅ Completed — UI/UX & Mobile 2026-09-19

- [x] **Audit UI/UX live 11 rute × 3 viewport** (camofox, karena browser tool Hermes gagal) — register temuan + 9 temuan palsu yang saya batalkan sendiri; metode disimpan di skill `pemdi-uiux-refinement`
- [x] **T2 perbaikan cepat** — tautan footer PDF PermenPANRB 404 → tersedia di portal (`public/docs/`); tap target mobile <44px di 28/25/24 kontrol → **0** di 5 halaman utama
- [x] **P1–P6 perbaikan terukur** — token `--primary-bg` (9 pemakaian, 0 definisi → tema gelap 1,15→6,40); kontras label OPD 2,56→5,51 & badge 4,23→5,06; payload beranda 233 KB→135 KB (`__NEXT_DATA__` 129→34 KB); panel rumus internal `/pemdi` dilipat `<details>`; marquee berhenti di mobile; 26 referensi gambar mati dibuang; `borderLeft` side-tab → `borderTop`; `transition: width` → `scaleX` (SpbeGauge/SlaBadge)
- [x] **`/layanan` mobile** — akar: kartu memakai tata letak 3 kolom desktop (judul 89px, deskripsi 72px, badge 63px) → jadi satu kolom (194/296/296px); deskripsi 2 baris dilepas saat kartu dibuka; chip filter 200→50px dapat digeser; blok cari filter melekat; statistik 2×2
- [x] **Rencana tahap lanjut** — `docs/rencana-mobile-ux-tahap-2.md` (9 item T2-1…T2-9, belum dieksekusi)

## ✅ Completed — Hardening Audit 2026-09-17

- [x] **Audit menyeluruh repo + 7 branch + live web** — autoskills checklist + ponytail + premortem (arsip internal pemilik)
- [x] **Ponytail: hapus 22 dead code (2.241 baris)** — 18 komponen + 2 motif + lib/cors + lib/safeRichText; DOX pass 4 file AGENTS.md + README sinkron
- [x] **Rate limiter atomic** — RPC `bump_rate_limit` (db/rate-limit-schema.sql), hapus cache 2 dtk yang bisa ditembus
- [x] **Sanitizer diperkuat** — tag dibangun ulang, blokir `javascript:`/`data:` URI & entitas (audit S-1)
- [x] **Admin auth constant-time** (crypto.timingSafeEqual) + rate-limit `/api/lapor/status` + ID lapor 12-hex
- [x] **`/api/health`** — 200/503 untuk uptime monitor (backend live sempat mati tanpa terdeteksi)
- [x] **`/api/skm/stats` tanpa N+1** — RPC `skm_stats_dimensi` + fallback 1 query
- [x] **20 tes regresi** (`npm test`) — **kini dijalankan CI** (langkah `Test`, Node 20); sebelumnya workflow hanya lint+build sehingga tes tidak pernah dieksekusi otomatis — pin indeks 0,38 · proyeksi 2,29 · 250/47/4/199
- [x] **SEO**: canonical + og:url dinamis; og-image PNG 1,6 MB → JPG 166 KB; crest-pemdi.png 1 MB (tak terpakai) dihapus
- [x] **proxy-pdf whitelist content-type**; security.txt diperbaiki (rujukan 404 dihapus); CSP connect-src diperketat
- [x] **Higien git**: 6 branch stale dihapus; sitemap/robots (hasil generate) keluar dari git

## ✅ Completed — Eksekusi 11 Skills autoskills (2026-09-17)

- [x] 11 skill dijalankan sebagai review pass — ringkasan di CHANGELOG.md (laporan lengkap arsip internal). *Catatan 19 Sep 2026: kini **10** autoskill setelah `next-cache-components` (Next.js 16+ only) dikeluarkan.*
- [x] react: admin.js token via state (bukan read saat render); Footer year init-once + suppressHydrationWarning
- [x] a11y: SkmPrompt role=status + aria-live polite; gov-strip bukan lagi banner ganda
- [x] seo: header HSTS; FAQPage JSON-LD 15 Q&A di /faq
- [x] cache: CDN cache /api/opd & /api/spbe (1j/SWR 1h) & /api/skm/stats (60d/SWR 5m); requirement.js sudah punya (duplikat dihapus)
- [x] supabase: RLS rate_limits (db/rate-limit-schema.sql)
- [x] nodejs: engines node>=20

## 🟡 P2 — Active

- [ ] **Mengejar bukti dukung 2026** — gap 203/250 item (47 lengkap, 19%). Prioritas bobot: Kepuasan 25% → Data/Keamanan/Keterpaduan 15% → dll. PIC OPD per indikator sudah tampil di /pemdi
- [ ] **Sprint C** — Next 15 (+React 19), repo slimming *(audit log admin dipindah ke Patch 4 CMS)*
- [ ] **Backup ritme git** — push ke origin tiap akhir sesi kerja (sempat tertinggal 3 commit; sudah disinkronkan 10 Agu 2026)

## Recent Activity

- [x] **Koreksi klaim SPBE 47 indikator + arsitektur CSS 3 berkas** — docs/dox (`ec57d1a`) — @pemdi-aceh-tengah
- [x] **Sinkronkan AGENTS.md anak** — status UI 25 Sep 2026 (`9a44e44`) — @pemdi-aceh-tengah
- [x] **Panel login CMS di center** — seperti halaman login pada umumnya (`546fe6c`) — @pemdi-aceh-tengah

---

*Terakhir diperbarui: 6 Okt 2026 — P1-P6 done, P2 active (mengejar bukti dukung)*

## Reposisi selesai — tahap pembersihan (22 Sep 2026)

- [x] **Patch 0 — pembersihan reposisi**: persona publik dihapus dari `main` + tag `arsip/persona-publik-2026-09`; env Supabase/ADMIN_PASSWORD/IP_HASH_SALT tidak dipakai lagi → **TODO pemilik: lepas env tsb di Vercel & pause/hapus proyek Supabase lama**; "Kokpit" → "Dashboard"; kolom OPD "Butir Pemdi" (`lib/pjButir`)
- [ ] **Deployment PAUSED** (7 Okt 2026) — pemilik pause deploy Vercel, tidak dilanjutkan sementara. Site production tidak di-update sampai pemilik nyatakan lanjut.
- [ ] **Patch 1–2 — Ruang Kendali fase A–C**: `styles/tokens.css` 2 tema + font self-host (Bricolage Grotesque + IBM Plex), `/dashboard` beranda baru (Kompas Pemdi, antrean butir, PJ OPD), `/indikator`, drawer butir (reuse CatatanButir/EksporCatatan), Ctrl+K
- [ ] **Patch 3 — fase D**: emoji → SVG, inline style → kelas, lint guard, redirect `/pemdi` → `/dashboard`
- [ ] **Patch 4 — CMS admin**: peran koordinator/PJ, login, edit status/catatan/PJ langsung dari drawer + `/admin` baru, impor hasil eval, audit log; JSON tetap sumber dasar, DB = overlay, ekspor kembali ke `catatan-mandiri.json`

## Mode internal (21 Sep 2026) — *diperbarui 22 Sep: `/admin` lama sudah dihapus, bukan dimatikan*

- [ ] **Fitur kirim eviden dari OPD/SKPD** — menggantikan slot `/admin` (Panel Admin Diskominfo, kini dimatikan lewat `lib/modeSitus.js`). Kebutuhan: PIC OPD mengunggah berkas bukti per kode `I#-L#-##`, status tinjauan Tim Asesor Internal, riwayat versi (REPOSISI-PEMDI.md B1 "Tambahkan"). Akses internal (SSO/akun ASN) menjadi prasyarat.

## 🔄 Future

- [ ] **Phase Fondasi** — Pengembangan lebih lanjut portal — @pemdi-aceh-tengah
