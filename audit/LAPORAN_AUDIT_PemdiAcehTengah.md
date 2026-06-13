# Laporan Audit & Rekomendasi Perbaikan — Pemdi Aceh Tengah

- **Website diaudit:** https://pemdi-aceh-tengah.vercel.app
- **Repo (diberikan):** https://github.com/niuminaiton/PemdiAcehTengah → **404 / tidak dapat diakses**
- **Repo (tercantum di footer situs):** https://github.com/Niumination/PemdiAcehTengah
- **Tanggal audit:** 12 Juni 2026
- **Stack terdeteksi:** Next.js (Pages Router) + `next export` (static export) + serverless function di Vercel; styling `styled-jsx` + CSS variables; library `Fuse.js` untuk pencarian.

> Catatan: repo tidak bisa di-clone (404), jadi audit kode dilakukan dengan *reverse-engineering* bundel produksi (`_next/static/*`), pengujian endpoint, header HTTP, dan perilaku UI. Temuan tetap konkret dan dapat diverifikasi.

---

## RINGKASAN EKSEKUTIF

Situs ini **rapi secara tampilan, kuat secara konten, dan sudah menerapkan beberapa praktik baik** (skip-link aksesibilitas, `aria-label`, meta SEO/OG, font `display=swap`, semua route 200). Namun ada **beberapa masalah serius pada lapisan data/backend dan keamanan** yang membuat fitur interaktif "terlihat berfungsi tetapi sebenarnya tidak menyimpan apa pun".

**Tingkat keparahan temuan:**

| Prioritas | Jumlah | Inti masalah |
|---|---|---|
| 🔴 Kritis | 4 | Data laporan/survei hilang (tidak tersimpan), arsitektur static-export vs API route, tidak ada sanitasi/validasi & rate-limit |
| 🟠 Tinggi | 5 | Header keamanan hilang, link repo salah, link dokumen mati, bug rendering angka, tidak ada sitemap/robots |
| 🟡 Sedang | 6 | PWA/manifest, favicon, analitik, konsistensi data, error/empty states, i18n angka |
| 🟢 Rendah | 4 | Optimasi performa, a11y lanjutan, monitoring, testing/CI |

---

## 🔴 TEMUAN KRITIS

### K-1. Laporan/Saran publik TIDAK PERNAH tersimpan (data hilang diam-diam)
Endpoint `POST /api/lapor` mengembalikan `success: true` dengan ID seperti `LAPOR-MQ9SDFSN`, **tetapi** payload respons berisi:

```json
"tersimpan": false,
"note": "...Penyimpanan permanen akan diaktifkan setelah database terhubung."
```

Dan `GET /api/lapor` mengembalikan:
```json
{"success":true,"data":{"laporan":[],"total":0},"note":"Filesystem read-only di production"}
```

**Dampak:** Warga mengira laporannya diterima ("Tim Pemda Digital akan menindaklanjuti"), padahal data **dibuang**. Ini masalah kepercayaan publik yang serius untuk portal pemerintah. Fungsi serverless Vercel memang **read-only filesystem**, jadi pendekatan menulis ke file tidak akan pernah berhasil.

### K-2. Survei Kepuasan (SKM) & "Tanya" tidak punya backend sama sekali
Analisis bundel:
- `skm-*.js`: handler submit hanya `onSubmit: a => { a.preventDefault(); setStep(3) }` → langsung tampil **"Terima Kasih!"** tanpa `fetch`, tanpa `localStorage`. **Tidak ada satu pun jawaban survei yang dikirim/disimpan.**
- `tanya-*.js`: chatbot 100% sisi-klien (mencocokkan kata kunci dari data statis); tidak menyimpan pertanyaan warga.

**Dampak:** Halaman SKM secara fungsional **palsu** — mustahil menghitung indeks kepuasan dari data yang tidak pernah dikumpulkan. Padahal "Kepuasan Pengguna" punya bobot **25%** (terbesar) di Indeks Pemdi yang dipromosikan situs ini sendiri.

### K-3. Konflik arsitektur: `next export` (statis) + API route
`__NEXT_DATA__` menunjukkan `"nextExport": true`. API route (`/api/lapor`) tetap jalan sebagai serverless function di Vercel, tetapi:
- Tidak konsisten secara desain (sebagian app statis, sebagian dinamis tanpa state persisten).
- Tidak ada database, sehingga API tidak punya tempat menyimpan.

**Rekomendasi arsitektur:** pilih salah satu jalur yang konsisten (lihat bagian Backend di bawah).

### K-4. Tidak ada validasi mendalam, sanitasi, maupun rate-limiting di `/api/lapor`
Pengujian:
- `POST {}` → `400 "kategori dan pesan wajib diisi"` ✅ (ada validasi dasar).
- `POST {"pesan":"<script>alert(1)</script>"}` → diterima & **dipantulkan kembali mentah** di respons JSON. Saat ini tidak berbahaya karena tidak dirender sebagai HTML & tidak disimpan, **tetapi** begitu ditambahkan dashboard admin/penyimpanan, ini menjadi **Stored XSS**.
- Tidak ada **rate limiting / CAPTCHA / honeypot** → endpoint terbuka untuk **spam & abuse** (siapa pun bisa flood ribuan laporan).
- Tidak ada batas panjang field, tidak ada CORS yang dibatasi (`access-control-allow-origin: *`).

---

## 🟠 TEMUAN TINGGI

### T-1. Header keamanan HTTP tidak ada
Hasil pengecekan header — **semua hilang**:
- ❌ `Content-Security-Policy`
- ❌ `X-Frame-Options` (rentan clickjacking)
- ❌ `X-Content-Type-Options: nosniff`
- ❌ `Referrer-Policy`
- ❌ `Permissions-Policy`

(`Strict-Transport-Security` sudah ada ✅ dari Vercel.)

### T-2. Link repository GitHub salah/inconsistent
- Link yang Anda berikan: `niuminaiton/PemdiAcehTengah` → **404**.
- Footer & halaman "Tanya" menunjuk ke: `Niumination/PemdiAcehTengah`.
- Perlu dipastikan username/organisasi yang benar dan repo dibuat **public** (situs mengklaim "open source / MIT License", tapi repo tidak dapat diakses → klaim tidak terverifikasi).

### T-3. Link dokumen di footer mati (`href="#"`)
Footer bagian "Dokumen" punya 4 tautan placeholder:
- "Laporan SPBE 2025" → `#`
- "Permenpan 19/2018" → `#`
- "Permenpan 59/2020" → `#`
- "Perpres 95/2018" → `#`

Untuk portal pemerintah, tautan regulasi mati menurunkan kredibilitas. (Sebagian sudah benar di tempat lain, mis. link BPK Permenpan 19/2018 di halaman probis.)

### T-4. Bug rendering angka (angka tergabung tanpa pemisah)
Di bagian "Peta Proses Bisnis", beberapa angka tampil aneh/tergabung, mis. `83251`, `28513330`, `272652`, `3033`, `3738394041...50`. Ini indikasi data array di-render tanpa separator (`.join(', ')`) atau key/jumlah proses bisnis tercetak menempel. Membingungkan pembaca.

### T-5. SEO incomplete: tidak ada `sitemap.xml` & `robots.txt`
- `GET /sitemap.xml` → **404**
- `GET /robots.txt` → **404** (mengembalikan halaman 404 Next, bukan file robots)

Meta tag dasar & OG sudah bagus, tetapi tanpa sitemap/robots, indeksasi mesin pencari tidak optimal — penting untuk portal layanan publik agar mudah ditemukan warga.

---

## 🟡 TEMUAN SEDANG

- **S-1. Tidak ada PWA `manifest.json`** (`404`) → tidak bisa "Add to Home Screen", padahal target penggunanya warga via mobile.
- **S-2. `favicon.ico` 404** — hanya pakai favicon SVG emoji inline (🏛️). Beberapa platform/lama butuh `.ico`/PNG; OG image juga belum ada gambar (`twitter:card=summary_large_image` tetapi tanpa `og:image`).
- **S-3. Tidak ada analitik/telemetri** (tidak ada GA, Plausible, Vercel Analytics). Tidak ada cara mengukur traffic/penggunaan layanan.
- **S-4. Konsistensi & sumber data** — banyak angka statistik penting (Indeks SPBE 2.59, jumlah ASN 4.507, dst.) di-hardcode di bundel. Tidak ada satu sumber data tunggal (data layer) → rawan tidak sinkron antar halaman.
- **S-5. Empty/error state belum lengkap** — mis. `GET /api/lapor` selalu kosong; halaman cari/tanya perlu state "tidak ada hasil" yang jelas (tanya sudah ada pesan "Maaf, saya belum menemukan…").
- **S-6. Format angka belum di-lokalkan** — campur titik & koma (mis. "4,507 ASN" gaya Inggris vs "4.507" gaya Indonesia). Perlu `Intl.NumberFormat('id-ID')`.

## 🟢 TEMUAN RENDAH / PENINGKATAN

- **R-1. Performa:** halaman utama HTML ~88 KB + beberapa chunk JS; sudah wajar, tapi bisa di-*lazy load* komponen berat (tabel 52 OPD, peta probis) & gunakan `next/image` bila ada gambar.
- **R-2. Aksesibilitas lanjutan:** sudah ada skip-link & `aria-label` (bagus!). Perlu audit kontras warna, fokus keyboard pada modal "Lapor", dan `aria-live` untuk hasil chatbot.
- **R-3. Monitoring & uptime:** belum ada error tracking (Sentry) atau status page.
- **R-4. Kualitas kode/proses:** tidak terlihat CI, test, linting (tidak bisa dikonfirmasi tanpa repo). Disarankan tambahkan.

---

## ✅ YANG SUDAH BAIK (pertahankan)
- Skip-link "Langsung ke konten utama" + `aria-label` di tombol → fondasi aksesibilitas baik.
- Meta description, keywords, Open Graph, Twitter card sudah ada.
- Font `display=swap` + `preconnect` ke Google Fonts → render teks cepat.
- Validasi dasar di API (`400` untuk field kosong).
- Semua route (`/`, `/probis`, `/pemdi`, `/layanan`, `/skm`, `/faq`, `/cari`, `/tanya`, `/opd/[slug]`, `/requirement`) mengembalikan `200`.
- HTTPS + HSTS aktif.
- Konten substansial & relevan (SPBE 2025, Permenpan, 52 PD).

---

## REKOMENDASI PERBAIKAN (per lapisan)

### A. BACKEND & DATA (paling mendesak)
Pilih **satu** arsitektur yang konsisten:

**Opsi 1 — Tetap Next.js + database serverless (rekomendasi utama):**
1. Hapus `next export`; jalankan sebagai Next.js app penuh di Vercel (App Router atau Pages + API).
2. Sambungkan database gratis/murah yang cocok serverless:
   - **Supabase** (Postgres + Auth + RLS) — paling pas untuk form publik + dashboard admin.
   - alternatif: **Vercel Postgres / Neon**, atau **Turso (libSQL)**.
3. Buat tabel: `laporan`, `survei_skm`, `tanya_log` (opsional, anonim).
4. Refactor `/api/lapor` agar **benar-benar INSERT** ke DB → `tersimpan: true`.
5. Implement endpoint nyata untuk SKM (`POST /api/skm`) & simpan jawaban → baru indeks kepuasan bisa dihitung.

**Opsi 2 — Tetap statis + backend pihak ketiga (paling cepat, tanpa kelola server):**
- Gunakan **Formspree / Getform / Google Form / Supabase REST** langsung dari klien untuk laporan & SKM. Cocok bila ingin tetap `next export`.

**Keamanan API (wajib, apa pun opsinya):**
- Validasi ketat (panjang maks, whitelist `kategori`, sanitasi).
- **Rate limit** (mis. Upstash Redis) + **honeypot/CAPTCHA** (hCaptcha/Turnstile) anti-spam.
- Batasi CORS ke origin sendiri.
- Sanitasi/escape sebelum simpan & saat tampil (cegah Stored XSS untuk dashboard admin nanti).
- Tambahkan **dashboard admin** terproteksi (auth) untuk membaca & menindaklanjuti laporan/SKM.

### B. KEAMANAN (header)
Tambahkan di `next.config.js` (`headers()`) atau `vercel.json`:
```
Content-Security-Policy, X-Frame-Options: SAMEORIGIN,
X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin,
Permissions-Policy: geolocation=(), camera=(), microphone=()
```

### C. FRONTEND / UX
- Perbaiki **bug rendering angka** (gunakan `.join(', ')` / format yang benar; pisahkan key dari nilai).
- Lokalkan angka dengan `Intl.NumberFormat('id-ID')`.
- Perbaiki **link dokumen footer** (isi URL regulasi resmi atau hapus).
- Perbaiki **link repo GitHub** ke username yang benar & buat repo public.
- Tambah **state loading/sukses/gagal** yang jujur pada form (jangan tampilkan "Terima Kasih" bila data gagal disimpan).
- Modal "Lapor": kelola fokus keyboard (focus trap) + tutup dengan `Esc`.

### D. SEO / DISCOVERABILITY
- Tambah `robots.txt` + `sitemap.xml` (mis. `next-sitemap`).
- Tambah `og:image` (banner 1200×630) agar share di WA/medsos menarik.
- Tambah `manifest.json` + ikon PWA + `favicon.ico`/PNG.
- Data terstruktur **JSON-LD** `GovernmentOrganization` untuk rich result.

### E. DATA & KONTEN
- Pindahkan semua angka ke **satu sumber data** (mis. file JSON / CMS / DB) agar konsisten antar halaman & mudah diperbarui Diskominfo.
- Cantumkan **tanggal & sumber** tiap statistik (sebagian sudah ada — perluas).

### F. OBSERVABILITY & KUALITAS
- Pasang **Vercel Analytics / Plausible** (privacy-friendly) + **Sentry**.
- Tambah **CI** (lint, type-check, test) + **uptime monitor**.
- Tambah unit test untuk util pencarian & API.

---

## ROADMAP USULAN

**Sprint 1 (mendesak, 1–2 minggu)**
- Sambungkan DB (Supabase) → `/api/lapor` benar-benar menyimpan.
- Backend nyata untuk SKM + dashboard admin minimal.
- Header keamanan + rate limit + anti-spam.
- Perbaiki link repo & link dokumen footer.

**Sprint 2 (2–4 minggu)**
- Perbaiki bug rendering angka + lokalisasi `id-ID` + single source of data.
- robots.txt, sitemap, manifest/PWA, favicon, og:image, JSON-LD.
- Analitik + error tracking.

**Sprint 3 (peningkatan)**
- Audit aksesibilitas penuh (kontras, focus trap, aria-live).
- Optimasi performa (lazy load, code-split tabel/peta).
- CI/CD + test + uptime monitor.
