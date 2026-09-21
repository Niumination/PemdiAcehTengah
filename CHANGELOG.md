# Changelog

Semua perubahan penting proyek ini didokumentasikan di file ini.
Ringkasan publik tanpa detail internal; dokumen kerja lengkap disimpan pemilik repo di lokasi privat.

## 2026-09-21 — Catatan Mandiri per butir (persiapan interviu asesor eksternal)

- **Materi evaluasi asesor eksternal KemenPANRB belum diterima — akan menyusul.** Catatan disusun dari catatan asesor tahap 1 dan Modul Indikator; dicatat di `data/catatan-mandiri.json → materi_asesor_eksternal` dan `docs/catatan-mandiri-interviu-2026.md`. Tenggat kerja: Senin 28 Sep 2026.
- Data baru `data/catatan-mandiri.json` (sumber tunggal) → digabung ke `data/pemdi.json` sebagai `bukti_dukung[].catatan_mandiri` oleh `scripts/gabung-catatan-mandiri.py` (langkah terakhir rantai regenerasi; idempoten; `--cek`). Cakupan: **48 butir** = 19 butir revisi + 29 butir belum diterima pada level berikut tiap indikator; butir diterima tidak disentuh; status & catatan asesor tidak diubah.
- Tiap catatan: teks ringkas siap tempel ke eval.spbe.go.id, **rujukan dokumen dengan nomor halaman PDF** (RPJMD, Renstra Diskominfo, Peta Rencana, SK Tim Koordinasi, laporan & draf panduan di repo) atau tautan JDIH untuk Perbup, daftar yang masih harus disiapkan, PJ, prioritas. PDF hasil pindai (3 berkas) hanya catatan umum.
- UI: kartu 📝 **Catatan mandiri** per butir di `/pemdi` dan `/modul-indikator` (tombol Salin), bilah ekspor per indikator: **Salin semua · DOCX · Cetak/PDF** — DOCX dibangun tanpa pustaka tambahan (`lib/catatanMandiri.js`), tanpa animasi/CLS. Textarea lama di `/pemdi` menjadi "Catatan bebas" (tetap lokal).
- 10 tes baru `test/catatanMandiri.test.mjs` (total 47): cakupan revisi & level berikut, batas butir diterima, sinkron versi, keberadaan berkas rujukan, halaman wajib untuk PDF berteks, validitas ZIP/DOCX.

## 2026-09-21 — Audit konsistensi konten Pemdi + fitur Fokus Level

**Audit (disparitas yang ditemukan & diperbaiki — tanpa mengubah hasil penilaian asesor):**
- `data/modul-indikator.json`: label level lama `Established/Leading/Transformative` → nama resmi PermenPANRB 8/2026 (`Initiate/Emerging/Developing/Embedded/Leading`); `rekomendasi[]` statis & usang ("nilai 2.0", status "Proses") → dihitung ulang dari `pemdi.json`; `deskripsi` 20 indikator yang terpotong satu baris → teks **Deskripsi Indikator utuh** dari PDF Permen (bahasa baku dipertahankan; ditampilkan dengan pemenggalan butir 1./2./3. dan sub-judul agar mudah dibaca); istilah lama di teks item (`level Established/Leading/Transformative`) → `level N (nama resmi)`. Skrip baru `scripts/sinkron-modul-indikator.py` (idempoten).
- `data/kebutuhan-bukti-dukung.json`: masih memakai status lama `lengkap` dan nilai I2=2 (pra-Opsi B) → diregenerasi; ringkasan `status_indikasi` kini `diterima/revisi/draf/belum/perlu_verifikasi`; UI matriks menyesuaikan ("indikasi diterima asesor").
- `data/glosarium.json` istilah *Level*: skala SPBE lama → skala Pemdi (Kurang/Cukup/Baik/Sangat Baik/Memuaskan) + aturan naik level.
- CSS: `var(--primary-line)` tidak pernah didefinisikan (border tombol hilang) → `--primary-200`.
- Dokumentasi basi (indeks 0,38 · 250 bukti · "20/20 komponen") diperbarui; rantai regenerasi data diperpanjang (5 skrip) dan dijaga **6 tes KONSISTENSI** lintas-file (`pemdi ⇔ modul ⇔ draf-prioritas`) — total 37 tes.

**Fitur Fokus Level (`lib/pemdiNilai.js` → `fokusLevel`, `components/asesor/LevelFokus.js`):**
- Definisi (keputusan pemilik): *level dicapai* = level kontinu tertinggi yang **seluruh butir utamanya diterima asesor** (identik dengan rumus indeks); *level berikut* = dicapai + 1.
- `/pemdi` (checklist per level) dan `/modul-indikator` (Kriteria per Level + tabel bukti per level): hanya level dicapai (badge ✅) dan level berikut (badge 🎯 "Target berikutnya") terbuka; level lain tertutup dengan header ringkas dan dapat dibuka per klik; tombol "Buka semua level / Kembali ke fokus". Tanpa localStorage, tanpa animasi tinggi (bebas CLS).
- Beranda `AspekAccordion`: chip "✅ L1 → 🎯 L2" per indikator (⏳ eksternal untuk I5/I6/I7/I18).
- `/modul-indikator`: deskripsi Permen dilipat dalam `<details>` (kalimat pertama tampil), blok "🧭 Posisi & langkah berikut" per indikator.

## 2026-09-21 — Mode Internal: persona publik dimatikan sementara (saklar, bukan dihapus)

Keputusan pemilik: fokus ke persona internal (Kokpit Asesor). Kode publik **tidak dihapus** — dimatikan lewat satu saklar build-time `NEXT_PUBLIC_PERSONA_PUBLIK` (`lib/modeSitus.js`). Titik sebelum perubahan ini dibekukan di branch `backup/dual-persona-2026-09-21` + tag `v0.3-dual-persona`.

- **`middleware.js`** (Edge): saat saklar mati, halaman warga (`/layanan /skm /lapor /faq /tanya /bantuan /dashboard-kepuasan /kebijakan-privasi /admin`) → 404, API warga & admin (`/api/lapor* /api/skm* /api/feedback /api/admin*`) → 404 JSON; semua respons `X-Robots-Tag: noindex, nofollow`.
- **Beranda**: `pages/index.js` dipecah → `components/beranda/BerandaAsesor.js` (selalu) & `BerandaPublik.js` (hanya di-`require` bila saklar aktif → tidak ikut bundel internal). Switcher persona tidak dirender; `usePersona` selalu `asesor`; `layananData` tidak dikirim ke `__NEXT_DATA__`.
- **Navigasi**: grup sidebar "Sektor Warga & Layanan", CTA Lapor (topbar/sidebar/bottom nav), `RatingWidget`, `LaporWidget`, `SkmPrompt`, tautan footer publik disembunyikan; topbar CTA → "Kokpit Pemdi"; bottom nav ponsel → Ringkasan/Kokpit/Modul/Draf Bukti/Menu; 404 → Kokpit & Modul Indikator; hasil `/cari` yang menuju rute publik disaring.
- **SEO**: `<meta robots>` noindex, `robots.txt` `Disallow: /`, sitemap mengecualikan rute publik. Teks footer "Portal Digital Resmi" → "Kokpit Pemerintah Digital … Tim Asesor Internal" (K7).
- **`/admin`** (moderasi lapor/SKM) ikut dimatikan — bergantung pada API warga; slot ini kelak diganti fitur **kirim eviden dari OPD/SKPD** (BACKLOG).
- **Menghidupkan kembali**: set `NEXT_PUBLIC_PERSONA_PUBLIK=on` di Vercel → redeploy. Build dengan saklar `on` tetap diuji lolos (kode publik tidak membusuk).
- Tes: +2 (`isRutePublik`) → 27/27.

## 2026-09-21 — Penyempurnaan "sidebar tertutup default" (tindak lanjut `90c955f`)

- **Tanpa kedip / CLS**: `Sidebar` kini menerima `collapsed` sejak render server → HTML awal sudah `class="sidebar collapsed"` + `aria-hidden`. Sebelumnya sidebar 275 px dirender terbuka lalu menghilang setelah hydrate (kedip + pergeseran konten).
- **Batas lebar baca**: `.content` tanpa `max-width` membuat baris teks membentang penuh di monitor lebar (>1600 px). Ditambahkan token `--content-max: 1440px` (GOV.UK: ≤ ~1280–1440 px) — konten tetap memenuhi kolom utama di laptop, tetapi tidak melebar tak terbatas.
- **Identitas tetap terlihat**: brand ringkas (lambang + "Pemdi Aceh Tengah") di topbar karena sidebar (tempat brand sebelumnya) kini tertutup.
- **A11y**: tombol toggle punya `aria-expanded` + `aria-controls="sidebar-nav"`; `Esc` menutup drawer.

## 2026-09-21 — Sprint UI/UX: Dual-Persona (GOV.UK / Gov.sg style)

Sumber: instruksi refactoring pemilik (`gemini-code-…md`). Tanpa mengubah data JSON/API, tanpa library UI baru.

- **Phase 1 — Persona Switcher**: segmented control `[🏛️ Portal Layanan Publik] | [📊 Dashboard Kinerja & Asesor]` (pola WAI-ARIA tablist, panah ←/→). Sumber kebenaran `?view=publik|asesor`, preferensi tersimpan di `localStorage` `pemdi:persona`. Beranda merender dua `tabpanel` (yang tidak aktif `hidden`) di dalam `.persona-stage` ber-`min-height` → berganti mode tanpa reload dan tanpa layout shift. Versi ringkas tampil di topbar semua halaman lain. File: `lib/persona.js`, `components/persona/{PersonaSwitcher,usePersona}.js`.
- **Phase 2 — Portal Layanan Warga (Mode A, default)**: hero disederhanakan menjadi satu pertanyaan "Apa yang ingin Anda selesaikan hari ini?" + kotak cari besar (⌘K) + 5 kata kunci populer (KTP, KK, Perizinan, Pajak, Lapor). 25 layanan SLA dari 7 kategori dikelompokkan menjadi **6 kartu sektor** (Kesehatan + Sosial dilebur) dengan panel accordion inline. Indeks Pemdi, status revisi bukti, PPB, dan tabel OPD **disembunyikan** dari mode publik. File: `lib/sektorLayanan.js`, `components/publik/{HeroPublik,SektorLayanan}.js`.
- **Phase 3 — Dashboard Kokpit Asesor (Mode B)**: 4 kartu KPI (Indeks Pemdi 0,35/2,50 · SPBE 2,59 Cukup · Bukti 18 diterima/19 revisi dengan bar segmen · Kepatuhan 52 OPD) + **Accordion Progress Card 7 Aspek** — klik aspek membuka 20 indikator beserta ringkasan status bukti (diterima/revisi/draf/belum) tanpa reload. `getStaticProps` beranda kini mengirim ringkasan per indikator (hitungan status saja, bukan isi bukti). File: `components/asesor/{KpiCards,AspekAccordion}.js`.
- **Phase 4 — Mobile & Visual**: `BottomNav` 5 tujuan (Beranda, Layanan, Lapor, Kinerja, Menu→drawer) hanya ≤768 px; tabel 52 OPD: toggle **Tabel/Grid** di desktop, otomatis **stacked cards** (`data-th`) di ponsel tanpa scroll horizontal; spacing seksi seragam `.sec` (48/64 px ≈ py-12/py-16); token warna status AA (hijau `--ok` / amber `--warn` / abu `--muted`) pada chip & bar; Kerawang tetap sebagai divider & footer. Perbaikan ikutan: `OPDTable` membaca field data yang benar (`singkat`/`level`/`urusan` — sebelumnya kolom Kode/Kategori selalu "—"/"OPD"); sisa `fade-up` (transisi halaman AppShell, bar /pemdi & /modul-indikator) dan hover-lift `[class*=card]` dihapus.
- Tes: +5 (`test/persona.test.mjs`) → 25/25. Bundel `/` 116 → 122 kB First Load (accordion & KPI di-render server).

## 2026-09-21 — Bersihkan Gambar Sisa Animasi + Kembalikan Running Text

- **Running text pita atas dikembalikan** (keputusan pemilik): `.gov-strip-marquee-track` kembali berjalan 28 s linear, jeda saat hover, tetap berjalan pada `prefers-reduced-motion` karena berisi informasi resmi. Teks tetap "Kokpit Pemdi … Tim Asesor Internal" (bukan "Portal Resmi").
- **Dihapus** semua gambar/ornamen yang dulu melekat pada animasi: awan `MotifEmun` (17 halaman), ornamen absolut `MotifUlen/MotifTapak/MotifRante/MotifPucukRebung` di hero/latar (semua halaman), `MarqueeBudaya` (pita filosofi Kerawang di beranda), `MotifBackground`, kelas `aurora`/`reveal`/`d1–d4`, observer `.reveal` sisa di `pages/index.js`, seluruh atribut `data-reveal`/`data-reveal-stagger`, CSS `html.anim-ready .reveal`, `.kr-marquee`, `.aurora`, `.reveal-bar`.
- **Dipertahankan** (fungsional, bukan sisa animasi): `MotifUlen` 18 px di pita atas, `KerawangDivider` pemisah seksi, `MotifPucukRebung` 26 px di footer.
- CSS 34,9 → 34,1 kB; `/` 117 → 116 kB.

## 2026-09-20 — Hapus Kosmetik Animasi (kelayakan produksi & performa)

- **Dihapus**: blob aurora bergerak (2× `blur(70px)` animasi tak berujung), garis topografi SVG acak (`TopographicBackdrop`, ±40 path per render), awan Emun melayang, kilau emas judul (`gold-shimmer`), pita berjalan atas & pita motif (marquee), border conic berputar (`glass-card`), animasi masuk `fade-up` pada semua kartu/grid, scroll-reveal `IntersectionObserver` global, angka *count-up*, bar progres *reveal*, `backdrop-filter: blur` pada topbar lengket & hero, transform *lift* saat hover.
- **Dipertahankan**: transisi warna/bayangan ≤0,3 detik, panel rating (0,25 detik), fokus ring aksesibel. Konten `[data-reveal]` kini selalu terlihat (tak lagi bergantung JS untuk muncul).
- Pita atas kini statis dan tidak lagi berbunyi "Portal Resmi" (prasyarat K7 reposisi).
- Bundle: `/` 118→117 kB, `/pemdi` 117→115 kB; CSS 39,1→34,9 kB; `hooks/useCountUp.js`, `hooks/useInView.js`, `components/TopographicBackdrop.js` dihapus.

## 2026-09-20 — Sinkron Hasil Penilaian Tahap 1 (eval.spbe.go.id) & Reposisi Konten

- **Status bukti mengikuti hasil asesor.** Vokabuler baru `diterima · revisi · proses · draf · belum` menggantikan `lengkap`; hanya bukti yang **diterima** asesor dihitung dalam indeks. Tahap 1: 37 butir dinilai → 18 diterima, 19 revisi (7 bukti tidak tepat, 10 belum diunggah, 2 ditolak otomatis) — catatan asesor disalin apa adanya dari portal dan tampil di setiap butir.
- **Label "Indeks Terverifikasi" dihapus** (prasyarat K8 `REPOSISI-PEMDI.md`) → "Simulasi Penilaian Mandiri — bukan nilai resmi asesor". Indeks simulasi 0,38 → **0,35** (33 butir yang belum pernah dinilai asesor diturunkan ke `draf`).
- **Kode bukti `I#-L#-##`** (Indikator-Level-nomor urut butir modul) ditampilkan di `/pemdi` dan `/modul-indikator`; 18 PDF diterima dapat dipratinjau; butir revisi ditandai 🔁 merah dengan catatan asesor dan tab filter khusus.
- **`/requirement` direposisi** menjadi **Draf Bukti Dukung Prioritas**: P0 19 revisi asesor (dikelompokkan per jenis, dengan tindak lanjut) + P1 gap ke level berikut (24 butir di luar P0, diurutkan daya ungkit) dengan contoh Modul Indikator, template draf L1, kode rencana berkas, dan PIC. Kebutuhan data PPB (83 item) tetap tersedia pada tab kedua.
- Beranda: kartu indeks berlabel simulasi + ringkasan diterima/revisi Tahap 1. Sidebar: "Requirements Data" → "Draf Bukti Dukung".
- Skrip: `scripts/apply-eval-tahap1.py` (sinkron hasil portal, idempoten) · `scripts/build-draf-prioritas.py` (→ `data/draf-bukti-prioritas.json`); `hitung-capaian-pemdi.py` dan tes regresi diselaraskan (20 tes hijau).

## 2026-09-19 — Aksesibilitas & Mobile

- Tautan regulasi PermenPANRB 8/2026 di footer diperbaiki (sebelumnya mengarah ke berkas yang tidak disajikan → 404); dokumen kini tersedia di portal.
- Target sentuh seluruh kontrol di layar sempit dinaikkan ke ≥44px (Apple HIG / Material 48dp) — sebelumnya ada kontrol setinggi 14–30px.
- Kontras teks kecil diperbaiki: label 11px dan badge 11,5px kini memenuhi WCAG AA di tema terang maupun gelap.
- Perbaikan tampilan tema gelap: token `--primary-bg` yang tidak pernah terdefinisi membuat satu baris tabel dan beberapa badge tampil blok biru terang dengan teks tak terbaca.
- Beranda lebih ringan: HTML 233 KB → 135 KB (data indikator yang tidak dipakai beranda tidak lagi dikirim).
- Halaman Pemdi: panel rumus/notasi internal dilipat dan dapat dibuka; halaman jadi lebih pendek.
- Direktori Layanan pada ponsel: kartu tersusun satu kolom (sebelumnya empat kolom di layar 390px sehingga teks terjepit), filter kategori satu baris dapat digeser dan melekat di bawah header, statistik 2×2.
- Pita berjalan (marquee) berhenti bergerak di layar sempit; 26 rujukan gambar yang berkasnya tidak ada dibersihkan.
- Rencana peningkatan mobile untuk halaman lain didokumentasikan (belum dikerjakan): `docs/rencana-mobile-ux-tahap-2.md`.

## 2026-09-18 — Pre-merge (PR #5)

- Respons `/api/health` kini generik (detail teknis hanya di log server).
- `.gitignore`: kembalikan aturan `data/*.bak-*` (salah tulis `.data/`).
- Dokumen kerja internal dikeluarkan dari repo publik.

## 2026-09-18 — Sprint B: Performa & Kualitas (PR #5)

- **Font self-host** — Plus Jakarta Sans via `next/font/local` (OFL); nol request font ke pihak ketiga; CSP `style-src`/`font-src` `'self'`.
- **Bundle −34%** — `/pemdi` 174→114 kB, `/modul-indikator` 172→113 kB (data via `getStaticProps`, bukan client bundle).
- **SSR statistik kepuasan** — `/dashboard-kepuasan` ter-render server-side (ISR 60 detik) + fallback aman.
- **Kontras WCAG AA** — palet level/status/skala ≥4,5:1 di tema terang maupun gelap.
- **Token warna terpusat** — 13 variabel CSS `:root` + override dark theme.
- Method guard (405) + cache CDN pada endpoint data publik; `robots.txt`/`sitemap` digenerate saat build.

## 2026-09-17 — Sprint A: Operasional & Kepercayaan (PR #5)

- Endpoint `/api/health` untuk uptime monitoring.
- Hardening API: sanitasi input, rate limiting (RPC atomik + fallback), auth admin constant-time.
- `/api/requirement` satu sumber data dengan halaman requirement (respons identik).
- Sidebar lengkap: seluruh rute ≤1 klik.
- 20 komponen tak terpakai dihapus; dependensi nol perubahan.
- Standar kerja agent (autoskills) di-commit: `.agents/skills/` — Next.js/React/SEO/a11y/backend best practice.
- 20 tes regresi (`node --test`, `npm test`).
