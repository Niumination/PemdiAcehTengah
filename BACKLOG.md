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

## ✅ Completed — Hardening Audit 2026-09-17
- [x] **Audit menyeluruh repo + 7 branch + live web** — `audit/AUDIT_MENYELURUH_2026-09-17.md` (autoskills checklist + ponytail + premortem)
- [x] **Ponytail: hapus 22 dead code (2.241 baris)** — 18 komponen + 2 motif + lib/cors + lib/safeRichText; DOX pass 4 file AGENTS.md + README sinkron
- [x] **Rate limiter atomic** — RPC `bump_rate_limit` (db/rate-limit-schema.sql), hapus cache 2 dtk yang bisa ditembus
- [x] **Sanitizer diperkuat** — tag dibangun ulang, blokir `javascript:`/`data:` URI & entitas (audit S-1)
- [x] **Admin auth constant-time** (crypto.timingSafeEqual) + rate-limit `/api/lapor/status` + ID lapor 12-hex
- [x] **`/api/health`** — 200/503 untuk uptime monitor (backend live sempat mati tanpa terdeteksi)
- [x] **`/api/skm/stats` tanpa N+1** — RPC `skm_stats_dimensi` + fallback 1 query
- [x] **16 unit test rumus Pemdi** (`npm test`, CI Node 22) — pin indeks 0,38 · proyeksi 2,29 · 250/47/4/199
- [x] **SEO**: canonical + og:url dinamis; og-image PNG 1,6 MB → JPG 166 KB; crest-pemdi.png 1 MB (tak terpakai) dihapus
- [x] **proxy-pdf whitelist content-type**; security.txt diperbaiki (rujukan 404 dihapus); CSP connect-src diperketat
- [x] **Higien git**: 6 branch stale dihapus; sitemap/robots (hasil generate) keluar dari git

## ✅ Completed — Eksekusi 11 Skills autoskills (2026-09-17)
- [x] 11 skill dijalankan sebagai review pass — laporan: `audit/EKSEKUSI_11_SKILLS_2026-09-17.md`
- [x] react: admin.js token via state (bukan read saat render); Footer year init-once + suppressHydrationWarning
- [x] a11y: SkmPrompt role=status + aria-live polite; gov-strip bukan lagi banner ganda
- [x] seo: header HSTS; FAQPage JSON-LD 15 Q&A di /faq
- [x] cache: CDN cache /api/opd & /api/spbe (1j/SWR 1h) & /api/skm/stats (60d/SWR 5m); requirement.js sudah punya (duplikat dihapus)
- [x] supabase: RLS rate_limits (db/rate-limit-schema.sql)
- [x] nodejs: engines node>=20

## 🟡 P2 — Active

- [ ] **Mengejar bukti dukung 2026** — gap 203/250 item (47 lengkap, 19%). Prioritas bobot: Kepuasan 25% → Data/Keamanan/Keterpaduan 15% → dll. PIC OPD per indikator sudah tampil di /pemdi
- [x] **Sprint A6** — api/requirement.js dedup ke data/requirement.json (respons identik) + 4 pin test — 18 Sep 2026
- [x] **Sprint A7** — Sidebar: /lapor /tanya /bantuan /kebijakan-privasi ≤1 klik — 18 Sep 2026
- [x] **Sprint A1 (DB)** — Supabase aktif kembali (un-pause); live terverifikasi 200. Sisa: jalankan SQL RPC baru (bump_rate_limit, skm_stats_dimensi, RLS) — 18 Sep 2026
- [ ] **Sprint A (pemilik)** — A2 uptime monitor (pasca-merge), A3 commit ci.yml, A4 deskripsi repo, A5 rotasi ADMIN_PASSWORD
- [x] **Sprint B** — B1 font self-host (0 request Google Fonts) · B2 /pemdi 174→114 kB & /modul-indikator 172→113 kB · B3 SSR+ISR ringkasan kepuasan · B4 kontras 30 PASS/0 FAIL · B5 13 token warna + dark override — 18 Sep 2026
- [ ] **Sprint C** — Next 15 (+React 19), repo slimming, audit log admin
- [ ] **Backup ritme git** — push ke origin tiap akhir sesi kerja (sempat tertinggal 3 commit; sudah disinkronkan 10 Agu 2026)

## 🔄 Future

- [ ] **Phase Fondasi** — Pengembangan lebih lanjut portal — @pemdi-aceh-tengah

---

*Terakhir diperbarui: 18 Sep 2026 — Sprint B selesai (performa & kualitas); rincian di audit/EKSEKUSI_11_SKILLS_2026-09-17.md*
