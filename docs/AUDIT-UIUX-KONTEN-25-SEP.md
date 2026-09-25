# Audit UI/UX & Konten — Ruang Kendali Pemdi (25 Sep 2026)

Basis: `origin/main` @ `f3c19cc` · web live `pemdi-aceh-tengah.vercel.app` · alat baru: **Chromium headless (Playwright)** kini berjalan di workspace → tangkapan layar & pengukuran DOM nyata di 1440px dan 390px (15 rute × 2 viewport, `audit/keluaran/` via `scripts/audit-ui.mjs`).

---

## 1. Hasil autoskills (midudev) di repo

`npx autoskills --dry-run` (Node 22) mendeteksi React · Next.js · Neon · Node dan merekomendasikan 11 skill; **9 sudah terpasang** di `.agents/skills/` sejak `fce460b` (accessibility, frontend-design, react/next best-practices, composition-patterns, seo, nodejs-*). Dua yang belum (`next-cache-components`, `neon-postgres`) tidak relevan untuk UI/UX.

**Kesimpulan:** autoskills berbasis *stack*, bukan *masalah*. Untuk UI/UX desktop+ponsel skill yang tepat justru di luar rekomendasinya:

| Skill / sumber | Isi yang dipakai | Cara adopsi |
|---|---|---|
| **vercel-labs › web-interface-guidelines** (≈600 rb pemasangan di skills.sh) | ±110 aturan mekanis: aksesibilitas, fokus, form, animasi, tipografi (`tabular-nums`, `…`), konten panjang (`min-width:0`, truncate), sentuh (`touch-action`, `overscroll-behavior`), safe-area, URL = state, anti-pola | **Vendor ke repo** sebagai `desain/PEDOMAN-ANTARMUKA.md` (salinan lokal, bukan fetch remote — skill aslinya ditandai berisiko rantai pasok karena memuat instruksi dari URL). Sebagian dijadikan aturan `cek-ui` 7–12. |
| anthropics › frontend-design (terpasang) | proses: adjektiva → sistem tipografi/warna → token → audit; anti-slop | Sudah dipakai sejak Patch 9; dipakai ulang untuk pass "kerapian" |
| addyosmani › accessibility (terpasang) | WCAG 2.2 AA checklist, `axe-core` | Jalankan axe-core lewat Playwright (otomatis) |
| NN/g (F-pattern, dashboard "strategic vs operational"), Refactoring UI (hierarki, spasi 4/8, warna = makna), Apple HIG/Material (target 44/48px, thumb zone), GOV.UK/MoJ patterns (task list, summary list, filter) | Heuristik tinjauan manusia | Lembar heuristik 10 poin per halaman |
| Situs rujukan fitur padat: Grafana/Datadog (status-forward), Stripe Dashboard (tabel angka), Linear (keyboard-first/palet), Vercel/Sentry (drawer detail), Jakarta Smart City (preseden dashboard pemda), eval.spbe.go.id (mental model asesor) | Pola interaksi konkret | Dicatat per temuan: "pola rujukan → penerapan di Pemdi" |

---

## 2. Temuan terukur hari ini (bukti tangkapan layar & DOM)

### P0 — cacat nyata (semua rute, ponsel 390px)
1. **Header ponsel tumpang tindih**: judul "Dashboard Pemerintah Digital" terpotong oleh sakelar persona (brand kanan = 98px, persona kiri = 114px → judul cuma 98px). Terlihat "Dashbo▮Koordinator". *Rujukan: header ponsel Linear/Vercel = logo kecil + 1 aksi + menu; persona pindah ke sheet/menu.*
2. **Overflow horizontal** di 7 rute ponsel: `TABLE.rk-table` selebar 453–983px (dashboard/antrean/modul), `rk-tag.t-eksternal` sampai 686px (/pemdi), `rk-act.faint` 797px (/probis), `rk-drawer` 780px. Marquee `rk-track` 2.8k px wajar (berjalan) tetapi pembungkusnya harus `overflow:hidden` agar tidak ikut memicu scroll.
3. **Marquee INFO**: label "INFO" menutupi awal teks berjalan ("ard Pemerintah Digital…") di kedua viewport — perlu `mask`/padding awal.
4. **Pemicu menu radial** setengah lingkaran 28px terlihat di tepi kiri (y=422 desktop / y=764 ponsel) — terlalu kecil & tidak terbaca sebagai tombol menu (tak ada ikon terlihat, tak ada label). Pengguna baru tidak akan menemukannya. *Perlu: ikon ☰ terlihat + tooltip "Menu · M"; di ponsel dekat ibu jari (sudah) tetapi ukuran terlihat ≥44px.*

### P1 — presisi & penempatan (desktop 1440px)
5. Target interaktif <40px: /pemdi **264** elemen, /probis **221**, /requirement **168**, /dashboard 55 — mayoritas chip/`rk-tag` yang dapat diklik & tombol ikon kecil. Desktop boleh <44px tetapi harus konsisten ≥32px dan punya hover/focus.
6. Kepala panel "Kompas Pemdi — 7 aspek · 20 indikator · 5 level" membungkus 3 baris di ponsel karena tautan kanan tidak turun baris; pola sama di semua `Panel` (judul + aksi kanan).
7. Legenda Kompas (7 aspek) memakai nilai dengan "·" berpisah baris tak rata ("10% · 1,00" pecah) → butuh grid 3 kolom `tabular-nums`.
8. Tombol "Buka semua / Lipat semua" berdiri sendiri, kecil, jauh dari panel; di ponsel jadi 2 baris. Pindahkan ke baris kepala grid, bentuk seg-control.
9. "Panel dapat dilipat; status diingat di perangkat ini." — teks bantuan permanen memakan ruang; ganti tooltip/ikon ⓘ.
10. Kartu KPI: 5 kartu dengan hierarki sama; angka utama 1,24 belum dominan (target: 1,24 ≥ 2× ukuran KPI lain, kartu lain ringkas). Di ponsel kartu KPI 5 → menjadi tumpukan panjang; ideal 1 besar + 2×2 kecil.
11. Halaman ponsel sangat panjang: /probis 16.552px, /dashboard 9.420px, /requirement 8.446px. Perlu **tab/segmen di ponsel** (bukan menumpuk semua panel) + panel default terlipat kecuali 2 teratas.
12. Tabel `rk-table` tidak punya mode ponsel (kartu/baris ringkas) — sumber overflow #2.

### P2 — mekanis (grep kode, sesuai pedoman Vercel)
- `transition: all` ×3 dan `outline: none` ×3 di `styles/globals.css` (sisa lama); `overscroll-behavior` 0 (drawer/nav/palet); `text-wrap: balance` 0; `tabular-nums` hanya 2 tempat; 7/10 `<input>` tanpa `autoComplete`; state `useState` 73 vs sinkron URL 7 → filter/tab tidak deep-linkable; tidak ada skip-link.

---

## 3. Metode audit yang akan dipakai (agar temuan objektif, bukan selera)

**A. Otomatis (skrip `scripts/audit-ui.mjs`, Playwright, ~2 menit, bisa dijalankan Hermes/CI):**
per rute × {1440, 1024, 390} → tangkapan layar penuh · lebar scroll vs viewport (overflow) · daftar elemen keluar viewport · hitung target <44px (ponsel) / <32px (desktop) · axe-core (WCAG AA) · kontras · CLS via PerformanceObserver · tinggi halaman · tumpang tindih kotak antar-elemen header. Keluaran: `audit/laporan.json` + `laporan.md` dengan angka sebelum/sesudah.

**B. Heuristik manusia (lembar 10 poin per halaman)** — Nielsen 10 + Vercel WIG + NN/g dashboard: (1) keputusan apa yang dijawab halaman ini dalam 5 detik; (2) elemen terpenting di kiri-atas; (3) satu aksi utama jelas; (4) konsistensi penempatan aksi (kanan-atas panel); (5) status sistem (memuat, kosong, galat); (6) jalur ponsel ibu jari; (7) keyboard; (8) padat tapi disiplin (grid 8px); (9) warna = makna; (10) salinan aktif & spesifik.

**C. Uji tugas 3 persona nyata (15 menit/orang, di ponsel & laptop mereka):** Koordinator Diskominfo, PJ OPD, Sekda/pimpinan → 5 tugas: "cari status butir I19-L1-01", "apa yang harus saya unggah minggu ini", "berapa nilai kami vs target dan mengapa", "OPD mana paling tertinggal", "cetak ringkasan untuk rapat". Ukur: selesai/tidak, waktu, salah-klik. Ini satu-satunya cara memastikan situs jadi **alat kerja**, bukan pajangan.

---

## 4. Metode audit konten ("bukan pajangan")

Prinsip: **setiap angka/panel harus punya pemilik, sumber, tanggal, dan aksi lanjutan**. Panel yang gagal salah satu → dihapus atau digabung.

1. **Inventaris konten otomatis** — skrip membaca `pages/*.js` + `lib/rkData.js` → tabel semua panel/kartu/kolom: rute · komponen · sumber data (berkas JSON + kunci) · tanggal data · siapa yang mengubah (CMS/skrip) → `docs/INVENTARIS-KONTEN.csv`.
2. **Matriks pekerjaan (JTBD)** — 3 persona × fase (sekarang: interviu s.d. 30 Sep; visitasi Okt; pasca-penetapan Nov) × pertanyaan yang harus terjawab. Setiap panel dipetakan ke ≥1 sel; sel kosong = konten yang kurang; panel tanpa sel = pajangan.
3. **Uji "lalu apa?"** — tiap panel harus punya aksi berikutnya (buka butir, unggah/tandai, hubungi PJ, cetak, salin tautan). Panel tanpa aksi → tambah aksi atau turunkan jadi catatan kaki.
4. **Kesegaran & kebenaran** — `data/*.json` diberi `sumber`, `diperbarui`, `pemilik`; UI menampilkan "per 24 Sep · Diskominfo"; skrip `cek-data.mjs` memperingatkan data >14 hari, angka yang saling bertentangan (mis. 0,35 vs 1,24 vs 1,42 harus selalu berlabel jelas), OPD tanpa PJ, butir tanpa status.
5. **Bahasa** — glosarium dipaksa: istilah baku PermenPANRB 8/2026 tak diparafrase; label UI konsisten (satu istilah untuk satu konsep: "butir" ≠ "bukti" ≠ "indikator"); salinan aktif ("Unggah SK Tim" bukan "Lanjut").
6. **Umpan balik pengguna di dalam situs** — tombol "Laporkan masalah halaman ini" (mailto/WA/Google Form; tanpa backend) agar PJ OPD dapat menyampaikan temuan tanpa menunggu audit.

---

## 5. Usulan tahapan (1 patch per tahap, basis `f3c19cc`)

| Tahap | Isi | Bukti selesai |
|---|---|---|
| **A — Penjaga & alat** ✅ Patch 16 | `scripts/audit-ui.mjs` (Playwright, devDep) + `desain/PEDOMAN-ANTARMUKA.md` (vendor WIG) + cek-ui aturan 7–9 (overflow-x, `transition:all`, `outline:none`) | laporan.json baseline |
| **B — P0 ponsel** ✅ Patch 17 (overflow 0, tindih 0; tabel = geser + kolom beku + kolom prioritas, bukan kartu penuh) | header ponsel (judul + 1 aksi + persona ke menu), overflow (tabel → mode kartu, tag wrap, drawer 100vw), marquee mask, pemicu menu terlihat ≥44px + ikon | overflow = 0 di 15 rute; target <44 = 0 |
| **C — Presisi desktop** ✅ Patch 18 (target <32px /pemdi 176→1, /probis 215→2; KPI hierarki; multikolom; URL-state 4 halaman) | grid 8px, kepala panel (judul/aksi), legenda `tabular-nums`, hierarki KPI (1,24 dominan), seg-control lipat, hover/focus semua chip, URL-state filter/tab | lembar heuristik ≥8/10 per halaman |
| **D — Panjang halaman ponsel** ✅ Patch 19 (/probis 16.574→2.280px, /dashboard 9.736→3.617px; panel sekunder terlipat awal di ponsel tanpa CLS) | segmen/tab ponsel untuk dashboard, /probis, /requirement; panel default lipat | tinggi ponsel ≤ 4.000px per tab |
| **E — Konten** ✅ Patch 20 (`npm run inventaris` → docs/INVENTARIS-KONTEN.md 15 rute/33 panel + matriks JTBD; `npm run cek:data` lolos 0 masalah; `/opd/[slug]` → "Tugas saya" 6.396→3.443px, target kecil 82→0; tombol lapor di footer) | inventaris + matriks JTBD + metadata sumber/tanggal + `cek-data.mjs` + tombol lapor | 0 panel tanpa pemilik/aksi |
| **F — Uji tugas** ✅ pra-uji simulasi Patch 21 (`scripts/uji-tugas.mjs` 8/8; 3 cacat P0 dibereskan: grup Tugas saya, Cetak + @media print, Bagikan tautan) — sesi peserta nyata menyusul minggu ini | 3 persona × 5 tugas (`docs/UJI-TUGAS-PEMDI.md`) | ≥4/5 peserta selesai <120 detik |

Tahap A+B dapat dikerjakan dulu sebelum 28 Sep (tenggat revisi) karena berdampak langsung pada PJ OPD yang membuka di ponsel; C–F setelahnya.

---

## 6. Riset & rujukan (diperdalam 25 Sep) — pola → penerapan

| Pola dari ahli / situs rujukan | Sumber | Penerapan konkret di Pemdi |
|---|---|---|
| **Tabel di ponsel = keputusan sadar**, bukan tabel desktop yang dipaksa: 4 strategi — geser horizontal + kolom pertama beku · ubah jadi kartu · sembunyikan kolom non-kritis · *priority+* (kolom utama tampil, sisanya "selengkapnya") | setproduct.com (2026), uxpatterns.dev, Canada.ca design (tabel responsif → kartu di ponsel) | `rk-table` diberi atribut `data-prioritas` per kolom: antrean (kode·butir·PJ tampil; prioritas·bobot lipat), 52 OPD (nama·skor tampil; sisanya di drawer), dokumen modul → kartu. Menghapus overflow #2 tanpa membuang data |
| **Tabel = membandingkan, daftar = memindai, kartu = menjelajah**; jangan pakai kartu untuk pekerjaan tabel | stan.vision, uxpatterns.dev | Desktop tetap tabel (Koordinator membandingkan OPD); kartu hanya di ponsel dan hanya untuk baris yang dibaca satu-satu (butir, catatan) |
| **Hierarki lewat bobot & warna, bukan ukuran saja; tegaskan dengan me-*redup*-kan pesaing; gabungkan label+nilai** ("12 tersisa", bukan "Stok: 12") | Refactoring UI (Wathan & Schoger) | KPI: hanya 1,24 tebal-besar; 4 kartu lain kecil & redup; "TENGGAT REVISI INTERNAL / H-3 / 27 Sep" → "**H-3** hingga 27 Sep — revisi internal". Kurangi garis pemisah, ganti spasi/latar |
| **Sistem spasi terbatas berbasis satuan** (4/8/12/16/24/32/48) — skala linear tidak berfungsi; mulai dari ruang lebih, kurangi | Refactoring UI | Token `--sp-1..8` di `tokens.css`; cek-ui aturan: nilai `padding/margin/gap` di luar skala = peringatan |
| **Dashboard: pola F, KPI kritis kiri-atas, 5–9 metrik, strategis vs operasional dibedakan** | NN/g (eye-tracking 232 pengguna), skill deslop artifact-types | Dashboard = operasional (apa yang harus dikerjakan minggu ini) → kiri-atas: 1,24 + H-3 + antrean; grafik "Kompas" turun ke bawah/tab "Analisis"; ringkasan strategis untuk Sekda jadi tampilan terpisah (`/ringkasan` atau segmen) |
| **Target sentuh 44pt (Apple HIG) / 48dp (Material), zona ibu jari; aksi utama bawah layar di ponsel** | Apple HIG, Material 3 | Pemicu menu & tombol utama di sepertiga bawah (sudah), tetapi harus terlihat; chip klik ponsel ≥44px |
| **Header ponsel**: logo/judul + maksimal 2 aksi; kontrol lain masuk menu/sheet | Linear, Vercel, GOV.UK header ponsel | Persona (Koordinator/PJ OPD) → di dalam menu radial "Baris" atau sheet akun; header hanya judul + Cari + Menu |
| **URL = state** (filter, tab, panel terbuka) agar tautan bisa dibagikan via WA ke PJ OPD | Vercel WIG; Linear | `?tab=`, `?opd=`, `?butir=` di semua halaman utama (sekarang 7 dari 73 state) |
| **Status-forward** (Grafana/Datadog): warna hanya untuk anomali; 90% tenang | NOC best practice | Merah hanya untuk "revisi"/tenggat lewat; "tinggi" prioritas cukup emas; hilangkan merah dekoratif |
| **Casework gov** (GOV.UK task list, summary list, MoJ filter) | GOV.UK/MoJ patterns | /requirement = task list per PJ dengan status "Belum mulai/Sedang/Selesai"; ringkasan butir = summary list (label kiri, nilai kanan, aksi "Ubah") |
| **Bahasa pemerintahan Indonesia, preseden dashboard pemda** | Jakarta Smart City, eval.spbe.go.id | Istilah & urutan kolom mengikuti eval.spbe.go.id agar asesor/PJ tidak perlu belajar ulang |

## 7. Lembar heuristik (10 poin, 0–2) & skor awal dari tangkapan layar

Kriteria: H1 keputusan 5 detik · H2 kiri-atas = terpenting · H3 satu aksi utama · H4 penempatan aksi konsisten · H5 status kosong/muat/galat · H6 ponsel: tanpa overflow & ibu jari · H7 keyboard/fokus · H8 grid & spasi disiplin · H9 warna = makna · H10 salinan aktif/spesifik. Maks 20.

| Halaman | Skor | Temuan utama (bukti: `audit/keluaran/*.png` (hasil `node scripts/audit-ui.mjs`)) |
|---|---|---|
| /dashboard | 12 | H2: 1,24 tidak dominan (5 kartu setara); H4: "Buka/Lipat semua" terpisah dari panel; H6: header tumpang tindih, tabel overflow, tinggi 9.420px; H8: legenda Kompas pecah baris |
| /pemdi | 10 | Grid 2 kolom tinggi tak seimbang (Aspek 1 terbuka 1.000px, Aspek 2 kosong 800px) → pakai 1 kolom/akordeon atau *masonry* CSS; chip level terpotong "Kurang (Merin…"; bilah aksi "Salin semua/DOCX/Cetak" mengambang tanpa konteks; 264 target <40px; **strip KPI 5 kartu diulang** dari dashboard (redundan — ganti bar konteks 1 baris); pemicu menu menutupi teks "7 aspek · 20 indikator" |
| /antrean | 11 | Tabel 983px di ponsel; tinggi 7.047px; tanpa filter tersimpan di URL |
| /requirement | 11 | 168 target kecil; 8.446px di ponsel; papan P0/P1 baik di desktop tetapi tanpa "tugas saya" untuk PJ OPD |
| /asesor | 13 | Struktur baik; `rk-verif` perlu mode ponsel; angka 1,24/1,42/0,35 harus konsisten berlabel di semua halaman |
| /probis | 9 | 16.552px di ponsel (terpanjang); `rk-act.faint` 797px overflow; 221 target kecil; butuh tab L0/L1/L2 |
| /opd, /opd/[slug] | 12 | Ubin OPD baik; `span.muted` overflow 406px; halaman OPD hanya 900px — masih tipis untuk PJ OPD (butuh "tugas saya" + unggah/tandai) |
| /modul-indikator | 12 | Tabel dokumen 540px overflow; pratinjau dialog tanpa `overscroll-behavior` |
| /spbe, /glosarium, /cari, /404, /admin | 13–14 | Umumnya rapi; /cari kosong tanpa saran pencarian awal (H5) |

Target setelah perbaikan: **≥16/20 semua halaman**, overflow 0, target <44px di ponsel 0, tinggi ponsel per tab ≤4.000px.

## 8. Yang disiapkan untuk uji tugas pengguna (Anda setuju minggu ini)
- `docs/UJI-TUGAS-PEMDI.md`: 5 tugas × 3 persona, skrip fasilitator 15 menit, lembar catat (selesai/waktu/salah-klik/kutipan), izin sederhana. Dibuat saat Tahap A bersama skrip audit — sehingga hasil uji langsung bisa dibandingkan dengan skor heuristik di atas.
