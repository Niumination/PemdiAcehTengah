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
- [x] **Sprint A6** — api/requirement.js dedup ke data/requirement.json (respons identik) + 4 pin test — 18 Sep 2026
- [x] **Sprint A7** — Sidebar: /lapor /tanya /bantuan /kebijakan-privasi ≤1 klik — 18 Sep 2026
- [x] **Sprint A1 (DB)** — Supabase aktif kembali (un-pause); live terverifikasi 200. SQL RPC baru **DITERAPKAN** 18 Sep 2026: `bump_rate_limit`, `skm_stats_dimensi`, `rate_limits` + RLS (dicek pemilik di SQL Editor: 4 fungsi + RLS aktif) — 18 Sep 2026
- [x] **A5 rotasi ADMIN_PASSWORD** — 18 Sep 2026: nilai lama (16 char) diganti 64 hex dan disimpan di vault lokal (bukan repo); kini bertipe *sensitive* di Vercel sehingga tidak bisa dibaca lagi dari dashboard/CLI. `ADMIN_TOKEN` (legacy 10 char — jalur fallback `ADMIN_PASSWORD || ADMIN_TOKEN`) **DIHAPUS**. Cadangan nilai lama ada di vault untuk rollback
- [x] **A2 uptime monitor** — 18 Sep 2026: watchdog Hermes (`pemdi-health-watch.sh`, job `20481acb6f2b`) diuji tiga skenario (sehat → diam, 404 → alarm, host mati → alarm), lalu **DIJEDA 19 Sep 2026 atas permintaan pemilik**: tidak diperlukan selama Pemdi belum berjalan di server 24/7 (cron ini hanya hidup saat Mac menyala). Aktifkan kembali saat Pemdi dipindah ke server 24/7, atau pakai monitor eksternal (UptimeRobot → `/api/health`, keyword `"db":"ok"`) yang berjalan 24/7 tanpa bergantung pada Mac
- [x] **A4 deskripsi repo** — 19 Sep 2026: deskripsi + homepage (URL produksi) dipasang via `gh repo edit`, diverifikasi dari API GitHub
- [x] **A9 kunci produksi jadi *sensitive* + insiden nilai ter-escape** — 19 Sep 2026: `SUPABASE_SERVICE_ROLE_KEY` (akses penuh database) dan `IP_HASH_SALT` diubah ke tipe *sensitive* di Vercel; hanya `SUPABASE_URL` yang tetap non-sensitive (bukan rahasia). **Insiden & pelajaran:** saat mengirim ulang nilai, sumbernya adalah hasil `vercel env pull` yang menulis nilai dalam bentuk ter-escape (`"...\n"`). Escape itu ikut terkirim sebagai dua karakter literal sehingga kunci tidak valid → deploy `dzcsq17c3` menampilkan `db: error` dan `/api/skm` 500 (produksi terganggu ±12 menit, 01:07–01:19 WIB). Pemulihan: `vercel promote` ke deployment sehat terakhir, lalu nilai dikirim ulang hasil *decode* (newline sungguhan, sama seperti aslinya) → `db: ok` terverifikasi di deploy `90erb988h`. **Aturan:** jangan pernah menyalin nilai dari `vercel env pull` apa adanya — decode escape dulu, atau pasang dari sumber aslinya. Catatan: dua commit kosong (`0c55951`, `32e9143`) hanya pemicu redeploy, boleh di-squash kapan saja
- [x] **A8 pembersih `rate_limits`** — `db/rate-limit-cleanup.sql` dijalankan di Supabase SQL Editor 18 Sep 2026: pg_cron `bersihkan-rate-limits` terdaftar (jobid 1, active true, harian 03:17 UTC = 10:17 WIB). Verifikasi saat pemasangan: tabel 1 baris, 0 kadaluarsa
- [x] **Sprint B** — B1 font self-host (0 request Google Fonts) · B2 /pemdi 174→114 kB & /modul-indikator 172→113 kB · B3 SSR+ISR ringkasan kepuasan · B4 kontras 30 PASS/0 FAIL · B5 13 token warna + dark override — 18 Sep 2026
- [ ] **Sprint C** — Next 15 (+React 19), repo slimming, audit log admin
- [ ] **Backup ritme git** — push ke origin tiap akhir sesi kerja (sempat tertinggal 3 commit; sudah disinkronkan 10 Agu 2026)

## 🔄 Future

- [ ] **Phase Fondasi** — Pengembangan lebih lanjut portal — @pemdi-aceh-tengah

---

*Terakhir diperbarui: 19 Sep 2026 — audit UI/UX, perbaikan T2+P1–P6, `/layanan` mobile selesai; rencana tahap lanjut di `docs/rencana-mobile-ux-tahap-2.md`*
