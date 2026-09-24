# Rencana Perbaikan Bertahap — Tinjauan Live Web 23 Sep 2026

Status: **DIKUNCI 23 Sep 2026 — eksekusi dimulai dari Tahap 0.** Basis: upstream `main` @ `0911608` (Patch 1–7 sudah masuk).
CMS ditahan (tidak disentuh di rencana ini).

---

## A. Diagnosis per temuan (hasil pemeriksaan kode)

| # | Temuan | Akar penyebab yang ditemukan | Kelas |
|---|---|---|---|
| 1 | Panel "52 perangkat daerah" kosong | `pages/dashboard.js` memanggil `<OPDTable opdList={…}>` sedangkan komponen menerima prop bernama **`list`** (lihat `/opd` yang benar). Data ada, hanya salah nama prop → tabel render 0 baris. | Bug 1 baris |
| 5 | Tombol Cetak/PDF mati | `components/rk/Drawer.js:119` memakai `window.open('', '_blank', 'noopener')`. Per spesifikasi, fitur `noopener` membuat `window.open` **mengembalikan `null`**, lalu `if (!w) return` → tidak terjadi apa-apa. (Komponen lama `CatatanMandiri.js:107` punya bug yang sama.) | Bug 2 baris |
| 9 | Menu "Lainnya" tidak menutup saat pindah halaman | Dipakai `<details>` tanpa state; Next.js melakukan navigasi client-side sehingga elemen tetap `open`. Tidak ada `onRouteChange`/klik-luar. | Bug kecil |
| 10 | Header kacau saat ganti ke PJ OPD | `.rk-bar` grid `auto 1fr auto`; saat persona PJ, `<select>` (maks 200 px) ditambahkan ke `.rk-actions` → kolom kanan melebar, kolom tab tergencet & melipat. Tidak ada `min-width:0`/prioritas ruang. | Bug tata letak |
| 3 | Marquee di paling atas + bendera tumpang tindih | `.rk-strip` dirender **di atas** `<header>`; emoji 🇮🇩 dipasang absolut/inline di kiri dan bertumpuk dengan teks yang bergulir. | Desain |
| 2 | Halaman merapat ke tengah | `.rk-main{max-width:1440px}` dan `.rk-main-legacy{max-width:var(--content-max,1440px)}`; monitor ≥1600 px menyisakan ruang kosong. | Desain |
| 4 | Panel samping (drawer) terlalu kecil | `.rk-drawer{width:min(560px,100vw)}`. | Desain |
| 6–8 | 8 halaman lama masih bergaya lama | Halaman lama memakai jembatan token `.rk-legacy` (Patch 2/6) — warnanya sudah benar, tetapi **struktur** masih kartu/hero/inline-style lama: 808 `style={{}}` (modul-indikator 426, pemdi 152, spbe 50, requirement 39, opd 61, probis 33, glosarium 25, cari 22). Tidak ada komponen RK (`Panel`, `Kompas`, tabel `rk-table`) yang dipakai di sana. | Pekerjaan besar |
| 11 | Lipat/buka panel | Belum ada komponen panel lipat; `<Panel>` RK belum punya prop `dilipat`. | Fitur |
| 12 | Dokumen evaluator | Belum ada berkas data hasil interviu asesor di `data/`; dashboard masih menampilkan simulasi mandiri (0,35) saja. | Data + fitur |
| 13 | Gaya navbar | Tab horizontal + menu "Lainnya" + bottom-tab ponsel; belum ada side-nav overlay. | Desain |

---

## B. Isi dokumen evaluator (fokus Kab. Aceh Tengah, Locus 2 dari 5)

Sumber: `uploads/20260921_R5_Ridha_Hanafi_Interview_Evaluasi_Kinerja_Pemdi.pptx.md` (DR. Ridha Hanafi, sesi interviu 21 Sep 2026).

- **Indeks Pemdi: 1,42 (penilaian mandiri saat unggah eviden pertama) → 1,24 (hasil evaluasi asesor eksternal KemenPANRB) — Level 1 · Rintisan.** Angka utama di dashboard = **1,24**; 1,42 tampil sebagai pembanding. Aceh Tengah tetap tertinggi dari 5 locus.
- **Skor per aspek** (bobot): Tata Kelola & Manajemen 1,75 (10 %) · Penyelenggara 1,28 (10 %) · Data 1,00 (15 %) · Keamanan 1,17 (15 %) · Teknologi 1,08 (10 %) · Keterpaduan Layanan 1,40 (15 %) · Kepuasan Pengguna 1,18 (25 %).
- **20 indikator** dengan level capaian + 3 kolom verifikasi (Upload / Interview / Disetujui). Tertinggi 6.3 Portal (2,50 Terkelola), 1.1 Tata Kelola (2,00). Empat indikator **N/A** (3.1, 3.2, 3.3, 6.4 — dinilai dari indeks nasional). Tiga **tanpa bukti**: 3.4 PDP, 5.2 Infrastruktur, 6.2 Integrasi. Lima "upload ✓ tapi belum disetujui": 4.1, 4.2, 6.1, 7.1 + interview kosong 2.1, 5.1, 7.2.
- **Catatan interviu (janji susulan)**: RPJMD/Renstra (1.1); komunitas belajar & LMS (2.1); bukti kolaborasi (2.2); PDP belum ada (3.4); audit—bukti salah (4.1); IKASANDI baru mulai, akan disusulkan (4.2–4.4); bukti pengembangan aplikasi (5.1); dashboard PDN/PDNS (5.2); arsitektur SPBE belum (6.1); bukti integrasi (6.2); dashboard fasilitas pengguna & SLA (7.1); SKM kelompok rentan + laporan tindak lanjut (7.2).
- **Rekomendasi tindak lanjut** per indikator (20 butir teks baku evaluator) — disimpan apa adanya, tidak diparafrase.

Implikasi untuk dashboard: angka resmi sementara asesor (1,42/1,24) **jauh di atas** simulasi mandiri kita (0,35) karena skala asesor 1–5 (minimum 1) sedangkan simulasi kita 0–5. Ini harus dijelaskan di UI, bukan disembunyikan.

---

## C. Tahapan (urut prioritas; tiap tahap = 1 patch Hermes, mandiri & aman)

### Tahap 0 — Hotfix & keluhan cepat — ✅ Patch 8
1. `OPDTable` prop `list` di dashboard (#1).
2. Cetak/PDF: buka jendela tanpa `noopener`, tulis HTML, lalu `w.opener=null`; fallback `iframe` tersembunyi + `print()` jika pop-up diblokir (#5, kedua lokasi).
3. Menu "Lainnya": tutup otomatis pada `routeChangeStart`, klik-luar, dan `Esc` (#9).
4. Header: `.rk-bar` → `minmax(0,auto) minmax(0,1fr) auto`, tab `overflow:hidden` + scroll-snap, select PJ dipindah ke **baris konteks** di bawah header (chip "PJ OPD · Diskominfo ▾"), bukan di bar aksi (#10).
5. Marquee: pindah **ke bawah header** sebagai pita tipis, bendera diganti label "INFO" bertoken emas di kiri (bukan emoji, tidak absolut) (#3).
6. Lebar halaman: `--rk-lebar` = 100 % / 1800 / 1440; **toggle "Lebar"** di header (ikon), tersimpan di `localStorage`, **default penuh (100 %)** — KEPUTUSAN PEMILIK (#2).
7. Drawer: `width:min(820px,94vw)`, tambah tombol "perlebar" (820 ↔ 1100) + pegangan seret; ponsel tetap penuh (#4).
Verifikasi: cek-ui, lint, build, curl 12 rute, uji ganti persona/lebar tanpa CLS.

### Tahap 1 — Navigasi baru + panel lipat (kerangka) — ✅ Patch 9 (prototipe v5 disetujui)
- **Menu radial setengah lingkaran** (#13) — KEPUTUSAN PEMILIK: menggantikan tab atas & menu "Lainnya"; header tetap (brand, persona, Cari, tema, lebar). Rujukan: video "Magic Navigation Menu — Animated Half Circular Indicator" (dotWebdesign, CSS only). Adaptasi:
  - Tombol pemicu bulat 56 px menempel di **tepi kanan** layar (separuh terpotong), ☰ ↔ ✕, warna navy/emas; posisi vertikal tengah, ponsel di kanan-bawah.
  - Saat terbuka: 12 rute **mekar di busur 180°** mengelilingi tombol — busur dalam (r≈150 px) 5 rute utama, busur luar (r≈240 px) 7 rute lain; tiap item = ikon SVG Lucide bulat 44 px + **label pil selalu tampak** (miring mengikuti sudut busur). Item aktif = isian emas + indikator.
  - Animasi hanya `transform/opacity` bertahap 30 ms/item; `prefers-reduced-motion` → tampil langsung. Latar backdrop navy 60 % + blur ringan.
  - **Auto-hide**: `routeChangeStart`, klik luar, Esc. **Auto-focus** ke item halaman aktif saat dibuka; focus trap; fokus kembali ke tombol saat tutup. Pintasan `g`+huruf dan Ctrl+K tetap.
  - Bottom-tab ponsel dihapus; busur ponsel r≈120/190 px dari sudut kanan-bawah (kuadran 90°).
  - **Toggle gaya menu** (KEPUTUSAN PEMILIK 23 Sep): *Radial* ⇄ *Baris* (side-nav vertikal biasa di sisi kanan layar, 300 px, kelompok rute + ikon). Tersimpan `localStorage` `pemdi:nav` per perangkat; default otomatis: ≥ 861 px = radial, ponsel = baris. Sakelar ada di dalam menu itu sendiri (ikon dua-mode) sehingga mudah diganti bila radial kurang disukai atau saat pindah perangkat. Kedua gaya berbagi daftar rute, auto-hide, focus-trap yang sama.
  - Prototipe HTML statis dulu (`desain/proto-nav-radial.html`, berisi kedua gaya + sakelar) untuk disetujui sebelum patch.
- **`<Panel>` lipat** (#11): prop `id`, `dilipat`, ingat status per panel di `localStorage`; tombol "Lipat semua / Buka semua" per halaman; animasi hanya `grid-template-rows` 0fr→1fr (tanpa CLS, hormati `prefers-reduced-motion`). Diterapkan di dashboard, indikator, antrean dulu.

### Tahap 2 — Data evaluator Aceh Tengah (#12)
- Berkas baru `data/evaluasi-asesor-2026.json` (hanya Aceh Tengah): indeks total (dua angka + keterangan), 7 aspek, 20 indikator {level, upload, interview, disetujui, catatan_detail, rekomendasi}, 20 catatan interviu, metadata sumber (evaluator, tanggal, "sementara — belum nilai resmi").
- Dashboard: panel **"Hasil Interviu Asesor (sementara)"** — angka besar 1,42 vs target 2,50, badge Level 1 · Rintisan; **Kompas** mendapat lapisan kedua (ring asesor di atas ring mandiri) → terlihat selisih per indikator; **matriks verifikasi 20×3** (✓ / – / N/A) sebagai heat-strip; **daftar "Janji susulan"** yang otomatis terhubung ke butir antrean terkait (indikator → butir prioritas).
- `/indikator` & drawer: tab "Catatan asesor" + "Rekomendasi" per indikator (teks baku, read-only).
- Penjelasan skala 0–5 (simulasi) vs 1–5 (asesor) di tooltip/keterangan. Tidak mengubah JSON lama; hanya menambah berkas & `lib/rkData` menggabungkan.

### Tahap 3 — Reskin halaman lama ke gaya Ruang Kendali (#6, #7, #8) — dipecah 3 patch
Prinsip: setiap halaman diberi **pola visual sendiri** sesuai kontennya (bervariasi, tidak kaku), semua memakai grid 12 kolom `rk-grid`, `Panel` lipat, token RK; inline-style diganti kelas; hero lama dihapus, diganti **baris situasi** (judul + 3–5 angka + aksi).
- **3a** ✅ Patch 10 — `pemdi` → per aspek: **7 kartu "dial"** (busur skor mandiri vs asesor) yang membuka akordeon indikator; `requirement` → **papan tugas 3 kolom** (Belum/Proses/Diterima) + tab PPB sekunder; `cari` → dilebur ke Palet (Ctrl+K) + halaman hasil bergaya daftar RK.
- **3b** ✅ Patch 11 — `opd/index` → **peta ubin (treemap sederhana)** 52 OPD berdasar jumlah butir + tabel toggle; `opd/[slug]` → profil OPD dengan **strip linimasa butir**; `spbe` → **infografis perbandingan** SPBE 2025 (2,59) vs Pemdi asesor (1,42) vs target, batang horizontal per domain.
- **3c** ✅ Patch 12 (`probis` → aliran L0→L1→L2 dengan sorot OPD lintas level; `glosarium` → cari + chip kategori + kartu dua tingkat (bilah A–Z tidak perlu: 13 istilah); `404` RK). **3d** ✅ Patch 13 — `modul-indikator` (terbesar, 1948 baris) → struktur **7 aspek → 20 indikator → 5 level** sebagai "anak tangga" (step ladder) per indikator, konten teks baku tetap; `probis` → **pohon L0–L1–L2** bisa dilipat (CFM tetap); `glosarium` → **indeks A–Z** dengan bilah huruf lengket.
Setiap sub-patch: hapus inline-style halaman tersebut (target ≤ 20 sisa yang benar-benar dinamis), DOX `pages/AGENTS.md`.

### Tahap 4 — Ponsel & audit akhir
- Tinjauan 2 tema × ponsel (390 px) semua rute; target sentuh ≥ 44 px; kompas ponsel = 3–5 metrik; audit kontras ≥ 4,5:1; `cek-ui` diperluas: larang `opdList=` salah prop (uji prop), larang `window.open(...,'noopener')`.

---

## D. Estimasi & urutan pengiriman
| Patch | Isi | Ukuran | Risiko |
|---|---|---|---|
| 8 | Tahap 0 (7 hotfix) | kecil | rendah |
| 9 | Tahap 1 side-nav + Panel lipat | sedang | rendah–sedang |
| 10–12 | Tahap 3a/3b/3c reskin | besar | sedang (visual saja, data tetap) |
| 13 | Tahap 2 data asesor + panel | sedang | rendah (aditif) |
| 14 | Tahap 4 ponsel/audit | kecil | rendah |

Prototipe HTML statis akan dibuat untuk Tahap 1 (side-nav) dan Tahap 3 (satu halaman contoh: `pemdi`) **sebelum** patch, sesuai aturan "prototipe dulu".

---

## E. Keputusan pemilik (23 Sep 2026) — SUDAH DIPUTUSKAN
1. **1,24 = angka utama** (hasil evaluasi tim asesor eksternal KemenPANRB); **1,42 = penilaian mandiri saat unggah eviden pertama** — tampil sebagai pembanding dengan keterangan.
2. Lebar default **penuh (100 %)** dengan toggle.
3. Menu radial **menggantikan** tab atas; header tetap; menu hanya untuk navigasi halaman.
4. Data asesor dikerjakan **sesudah** reskin → urutan tahap menjadi: 0 → 1 → 3a/3b/3c → 2 → 4.
