# Rencana Implementasi — Dashboard "Ruang Kendali" + CMS Admin

> **Status:** DRAF untuk persetujuan pemilik (22 Sep 2026). Belum ada kode.
> **Dasar:** `REPOSISI-PEMDI.md` §8 (Patch 0 sudah di `main` = `12ad08c`), prototipe v2 yang disetujui (`~/prototipe/v2/`), keputusan pemilik 22 Sep malam:
> penyimpanan **Vercel Postgres/Neon**, login **kata sandi bersama per peran**, cakupan CMS **butir + konten tampilan**, urutan **reskin dulu (Patch 1–3), CMS setelahnya (Patch 4)**.
> **Batas waktu:** interviu 21–30 Sep (tidak boleh ada gangguan produksi) · visitasi 1–30 Okt.

---

## 0. Prinsip yang mengikat semua patch

| # | Prinsip | Konsekuensi teknis |
|---|---------|--------------------|
| P1 | Persona internal saja: **Koordinator** (Tim Koordinasi Pemdi) dan **PJ OPD** | Tidak ada halaman/konten untuk warga; tidak ada SKM/lapor/layanan |
| P2 | `data/*.json` tetap **sumber dasar** (kebenaran yang di-commit) | DB hanya *overlay* perubahan; bisa diekspor kembali ke JSON kapan saja; situs tetap hidup tanpa DB |
| P3 | Bahasa baku PermenPANRB 8/2026 tidak diparafrasa | Nama butir/kriteria **read-only** di CMS; yang bisa diedit hanya status, catatan, PJ, prioritas, kebutuhan, konten tampilan |
| P4 | Tanpa pustaka UI berat; tanpa CLS; animasi hanya marquee + 1–2 momen | Tidak ada Tailwind/MUI/Chart.js; SVG tulisan tangan; `prefers-reduced-motion` dihormati |
| P5 | Navy + emas, Kerawang Gayo, Bahasa Indonesia | Token warna §1.2; motif dipakai sebagai divider/footer/latar Kompas |
| P6 | Produksi aman | Setiap patch: `npm test`, `next lint`, `next build`; rute lama tetap merespons; tidak ada perubahan skema JSON |
| P7 | DOX | Setiap patch memperbarui AGENTS.md terdekat + CHANGELOG |

---

## 1. Fondasi desain (fase A) — Patch 1 bagian 1

### 1.1 Adjektiva & referensi
**Tegas · Waspada · Berakar · Presisi.** Referensi: pusat kendali/NOC (latar navy gelap tenang, warna = makna, alarm hanya untuk anomali), Stripe (angka tabular), Linear (Ctrl+K), Jakarta Smart City (preseden dasbor pemerintah Indonesia). Bukan GOV.UK/IDDS.

### 1.2 Token — `styles/tokens.css` (baru, diimpor sebelum `globals.css`)

```
:root[data-theme="gelap"]  (default; ikut prefers-color-scheme bila belum dipilih)
  --bg #0A1220  --panel #121F34  --panel-2 #182742  --line #233552
  --ink #E6ECF5  --ink-2 #A7B4C8  --ink-3 #6F7F98
  --emas #D4AF5A
:root[data-theme="terang"]
  --bg #F4F1EA  --panel #FFFFFF  --panel-2 #F8F5EE  --line #DDD6C7
  --ink #14203A  --ink-2 #3E4B66  --ink-3 #6B7690
  --emas #8F6E25
status (sama di dua tema, kontras ≥4.5:1 terhadap panel):
  --ok #3DBE8B  --warn #F2B134  --bad #F0605B  --info #5AA9FF  --draf #E08A4C  --pembina #A98BF0
tipografi: --f-display "Bricolage Grotesque"  --f-body "IBM Plex Sans"  --f-mono "IBM Plex Mono"
skala: 13/14/16/20/28/44/64 · radius 6/10 · bayangan 1 tingkat saja
```
- Font **self-host** `public/fonts/*.woff2` (3 keluarga × 2–3 berat, subset latin) — `font-display: swap`, `size-adjust` agar tanpa CLS.
- `ThemeToggle` yang ada dipakai ulang; kunci localStorage `theme` dipetakan ke `data-theme`.
- Token lama (`--primary #1F2A44`, `--gold`, `--bg`) **dipertahankan sebagai alias** selama transisi supaya halaman yang belum di-reskin tidak rusak.

### 1.3 Ikon
Set SVG internal `components/ui/Ikon.js` (±24 ikon gaya Lucide, stroke 1.75) menggantikan emoji secara bertahap. Emoji di data JSON (`prinsip[].icon`, `kategori[].icon`) **tidak diubah** — komponen memetakan emoji → ikon.

---

## 2. Arsitektur halaman (fase B–C) — Patch 1 & 2

### 2.1 Peta rute (sesudah Patch 2)

| Rute | Isi | Status |
|------|-----|--------|
| `/dashboard` | **Beranda baru "Situasi"** (§2.2) | baru — Patch 1 |
| `/` | redirect 308 → `/dashboard` | Patch 2 (Patch 1: `/` masih BerandaAsesor, `/dashboard` hidup berdampingan) |
| `/indikator` | Matriks 20 indikator × 5 level (baris = indikator, sel = level, warna = status) + filter aspek/PJ/status | baru — Patch 1 |
| `/antrean` | Antrean butir sampai tenggat: kolom kode, butir, PJ, prioritas, jenis, kebutuhan, aksi; urut prioritas→tenggat | baru — Patch 1 |
| `/pemdi` | Tetap (detail 7 aspek, simulasi, catatan mandiri) → di Patch 3 menjadi tampilan "rinci" yang dipanggil dari drawer | tetap |
| `/modul-indikator`, `/requirement`, `/spbe`, `/probis`, `/opd`, `/opd/[slug]`, `/glosarium`, `/cari` | Reskin kelas saja (token + panel), struktur tetap | Patch 3 |
| `/admin/*` | CMS (§4) | Patch 4 |

### 2.2 `/dashboard` — "Situasi" (keputusan yang dioptimalkan: *butir mana yang harus dikerjakan siapa sebelum tenggat berikutnya*)

Grid 12 kolom, scan F/Z, kritis di kiri-atas; ponsel = satu kolom dengan urutan sama; 5 metrik di ponsel.

| Posisi | Panel | Sumber data | Komponen |
|--------|-------|-------------|----------|
| Baris 0 (penuh) | **Pita situasi**: indeks simulasi 0,35 / target 2,50 · proyeksi 2,29 · bukti 18/19/12/183 · hari ke tenggat (28 Sep → lalu 1 Okt visitasi) · tema toggle · Ctrl+K | `pemdi.json` (indeks_*, penilaian_tahap1, proyeksi), `catatan-mandiri.json.tenggat` | `SituasiBar` |
| c8 | **Kompas Pemdi** — SVG radial 20 indikator × 5 level; ring = level, sektor = aspek (7 warna netral + emas untuk aspek berbobot 25%); sel diwarnai status; klik/Enter → drawer | `pemdi.json` via `pemdiNilai.fokusLevel` | `KompasPemdi` |
| c4 | **Antrean prioritas tinggi** (maks 8 baris) + tautan `/antrean` | `catatan_mandiri` prioritas=tinggi | `AntreanRingkas` |
| c4 | **Beban per PJ** — bar horizontal per OPD (Diskominfo 47 …) dengan pecahan tinggi/sedang/rendah | `lib/pjButir` (diperluas mengembalikan pecahan prioritas) | `BebanPJ` |
| c4 | **Linimasa 2026** — Tahap 1 selesai · interviu 21–30 Sep · visitasi 1–30 Okt · penetapan; penanda "hari ini" | konstanta di `data/linimasa.json` (baru, kecil) | `Linimasa` |
| c4 | **Prasyarat lintas indikator** — SK Tim Koordinasi, Peta Rencana, Arsitektur, Kebijakan PDP… (dokumen kunci berstatus) | `dokumen-kunci.json` + `catatan-mandiri.json.dokumen` | `Prasyarat` |
| c12 | **PPB + 52 OPD** (dipertahankan sesuai keputusan pemilik) — OPDTable dengan kolom Butir Pemdi, dilipat default di ponsel | `opd.json`, `pjButir` | `OPDTable` (reskin) |

**Persona (segmented, tanpa login di Patch 1–3):** *Koordinator* = semua; *PJ OPD* = pilih OPD → Kompas, antrean, beban difilter ke OPD itu; pilihan disimpan `localStorage pemdi:pj`. Tidak ada CLS: panel berukuran tetap, hanya isi yang berganti.

### 2.3 Drawer butir/indikator (kanan, 480px; ponsel = lembar penuh)
Dibuka dari Kompas, matriks, antrean, Ctrl+K. Isi: judul indikator + bobot + level dicapai/berikut (`RingkasFokus`), daftar butir level fokus dengan `CatatanButir` (dipakai ulang apa adanya), `EksporCatatan` (teks/HTML/DOCX), tautan "rinci di /pemdi#I7". Fokus terkunci, Esc menutup, URL `?butir=GT.I7_L2_1` agar bisa dibagikan.

### 2.4 Ctrl+K (palet perintah)
Memakai indeks `lib/search-index.js` yang sudah ada (Fuse.js) + perintah: "buka antrean", "filter PJ …", "ganti tema", "ekspor catatan I#". Tanpa pustaka baru.

### 2.5 AppShell baru (menggantikan sidebar+topbar)
Pita atas: marquee (dipertahankan) → bar kendali: lambang + "Dashboard Pemerintah Digital · Aceh Tengah", tab (Situasi · Indikator · Antrean · Modul · Draf Bukti · Rujukan▾), persona, Ctrl+K, tema. Ponsel: tab bawah 5 item (Situasi · Indikator · Antrean · Draf · Lainnya). Sidebar lama dihapus di Patch 3 setelah semua halaman pindah.

---

## 3. Pembagian patch reskin

| Patch | Isi | Perkiraan diff | Risiko produksi |
|-------|-----|----------------|-----------------|
| **1 — Fondasi + Situasi** | tokens.css + font self-host; `components/ui/{Ikon,Panel,Segmen,Drawer,Palet}`; `/dashboard`, `/indikator`, `/antrean`; AppShell baru **hanya** dipakai tiga rute baru (rute lama tetap AppShell lama); `lib/pjButir` diperluas (pecahan prioritas, filter per OPD); `data/linimasa.json`; tes `kompas.test.mjs` (pemetaan status→warna, filter PJ) | ±25 berkas, +2.500 baris | Rendah — rute lama tak tersentuh; `/` tetap |
| **2 — Migrasi navigasi** | `/` → 308 `/dashboard`; semua rute lama pindah ke AppShell baru; Sidebar/BottomNav lama dihapus; breadcrumb → tab aktif; `/pemdi` menerima `#I7` dan `?butir=` dari drawer | ±20 berkas | Sedang — uji semua 63 halaman via curl; middleware tetap noindex |
| **3 — Pembersihan visual** | emoji → Ikon di komponen; 1.207 inline style → kelas (per halaman); teks <11px dihapus; `.eslintrc` guard (no-inline-style di komponen baru, no-emoji regex sederhana); hapus token alias lama & CSS mati; audit kontras | ±30 berkas, −banyak | Rendah |

**Status realisasi (22 Sep 2026):** Patch 1 `e11131c`, Patch 2 `ffb9339`, Patch 3 `2ffd5a5`, Patch 4 (CMS) selesai — lihat `pages/api/AGENTS.md` untuk kontrak final (perbedaan dari rencana: sesi stateless HMAC tanpa tabel `sesi`; `/api/admin/overlay` menggantikan `/api/overlay` publik; `impor-eval` ditunda — impor hasil asesor tetap lewat `scripts/apply-eval-tahap1.py`) (komponen ada di `components/rk/*` dan `components/ui/*`, bukan `components/ui/{Panel,Segmen,…}` seperti rencana awal). Penyimpangan Patch 3 yang disengaja: 844 inline style halaman lama **tidak** dikonversi massal ke kelas (risiko regresi tinggi menjelang 28 Sep) — halaman lama disatukan lewat jembatan `.rk-legacy`; penjaga kualitas dibuat sebagai `scripts/cek-ui.mjs` (emoji ikon + font < 11px, dijalankan `npm test`) alih-alih aturan `.eslintrc`.

Setiap patch = 1 commit, `git format-patch`, instruksi Hermes. Patch 1 diusulkan dikirim **setelah interviu selesai (≥ 1 Okt)** atau lebih awal bila pemilik mau — karena `/` tidak berubah, risikonya kecil.

---

## 4. CMS Admin (fase E) — Patch 4

### 4.1 Tujuan
Koordinator dan PJ OPD memperbarui **status, catatan, PJ, prioritas, kebutuhan** per butir dan **konten tampilan** (pita marquee, pengumuman, tenggat) langsung dari dashboard — tanpa menunggu siklus edit JSON → patch → deploy — sambil menjaga JSON sebagai sumber dasar (P2).

### 4.2 Model data: JSON dasar + overlay Postgres

```
tampilan = gabung( data/*.json (build)  ,  overlay DB (runtime) )
```
- Halaman tetap SSG; saat halaman dimuat, klien memanggil `GET /api/overlay` (ringan, cache 30 dtk) dan menerapkan perubahan di atas data statis. **Tanpa DB / API gagal → tampilan = JSON** (degradasi anggun, tak ada layar kosong).
- Ekspor: `GET /api/admin/ekspor` menghasilkan `catatan-mandiri.json` dan potongan `pemdi.json` yang sudah digabung → Koordinator mengunduh → commit lewat Hermes → overlay untuk butir yang sudah sama otomatis dianggap "terserap" (dibandingkan hash).

### 4.3 Skema Postgres (Neon via Vercel Marketplace, `@neondatabase/serverless` — 1 dependensi kecil, tanpa ORM)

```sql
create table butir_overlay (
  kode          text primary key,           -- 'GT.I7_L2_1'
  status        text check (status in ('diterima','revisi','proses','draf','belum')),
  catatan       text,                       -- ringkas (catatan mandiri)
  kebutuhan     jsonb,                      -- string[]
  pj            text,
  prioritas     text check (prioritas in ('tinggi','sedang','rendah')),
  diubah_oleh   text not null,              -- 'koordinator' | 'pj:diskominfo'
  diubah_pada   timestamptz not null default now(),
  hash_dasar    text                        -- sha1 nilai JSON saat diedit → deteksi konflik/terserap
);
create table konten_tampilan (
  kunci   text primary key,                 -- 'marquee','pengumuman','tenggat_berikut','linimasa'
  nilai   jsonb not null,
  diubah_oleh text not null, diubah_pada timestamptz not null default now()
);
create table log_audit (
  id bigserial primary key,
  waktu timestamptz not null default now(),
  aktor text not null, peran text not null,
  aksi text not null,                       -- 'ubah_butir','ubah_konten','impor_eval','ekspor'
  kode text, sebelum jsonb, sesudah jsonb, ip_hash text
);
create table sesi (
  token_hash text primary key, peran text not null, opd text,
  dibuat timestamptz default now(), kedaluwarsa timestamptz not null
);
```

### 4.4 Autentikasi (keputusan: kata sandi bersama per peran)
- Env: `CMS_SANDI_KOORDINATOR`, `CMS_SANDI_PJ` (Vercel *sensitive*), `CMS_SESI_RAHASIA`.
- `POST /api/auth/masuk` {peran, opd?, sandi} → bandingkan `timingSafeEqual` → cookie `HttpOnly; Secure; SameSite=Lax` berisi token acak; sesi 12 jam di tabel `sesi`; rate limit 5/menit/IP (tabel kecil di Postgres, bukan Supabase RPC).
- PJ wajib memilih OPD saat masuk; server **menolak** tulis ke butir yang PJ-nya bukan OPD tersebut (pencocokan memakai `lib/pjButir.hitungButirOPD`).
- Tanpa login: dashboard tetap **baca** seperti sekarang (noindex). Tombol "Ubah" hanya muncul setelah masuk.
- Peningkatan nanti (di luar Patch 4): magic link per orang bila audit bernama diminta asesor.

### 4.5 API (semua di bawah `pages/api/`, server-only, validasi ketat)

| Rute | Metode | Peran | Fungsi |
|------|--------|-------|--------|
| `/api/overlay` | GET | publik-internal | Gabungan `butir_overlay` + `konten_tampilan` (cache 30 dtk, ETag) |
| `/api/auth/masuk` · `/keluar` · `/saya` | POST/POST/GET | — | Sesi |
| `/api/admin/butir/[kode]` | PATCH | koordinator, pj(OPD-nya) | Ubah status/catatan/kebutuhan/pj/prioritas; tulis `log_audit` |
| `/api/admin/konten/[kunci]` | PUT | koordinator | Marquee, pengumuman, tenggat, linimasa |
| `/api/admin/impor-eval` | POST | koordinator | Unggah CSV/XLSX hasil eval.spbe.go.id → pratinjau diff → terapkan (status diterima/revisi per kode `I#-L#-##`) |
| `/api/admin/ekspor` | GET | koordinator | JSON gabungan untuk commit + penanda butir yang berubah |
| `/api/admin/log` | GET | koordinator | Audit log berhalaman |
| `/api/health` | GET | — | + `overlay: ok|absent` (DB opsional → tetap 200 bila absen) |

### 4.6 Antarmuka
- **Di drawer butir** (dari Patch 1): setelah masuk, bidang status/prioritas/PJ menjadi kontrol; catatan & kebutuhan menjadi textarea; tombol "Simpan" → PATCH → toast "tersimpan · oleh koordinator · 14:02" → Kompas/antrean menyegarkan overlay.
- **`/admin`** (Koordinator): 4 tab — *Ringkasan perubahan* (butir yang berbeda dari JSON, tombol Ekspor), *Konten tampilan* (marquee, pengumuman, tenggat, linimasa, dengan pratinjau), *Impor eval* (unggah → tabel diff → terapkan), *Log audit*.
- **`/admin`** (PJ): daftar butir OPD-nya + status ringkas; edit lewat drawer yang sama.
- Semua kontrol memakai token & komponen Patch 1; tak ada pustaka form.

### 4.7 Keamanan & operasional
- Validasi server: enum status/prioritas, panjang teks ≤ 4.000, `kebutuhan` ≤ 20 item, sanitasi teks polos (tanpa HTML).
- CSP tetap `connect-src 'self'`; Postgres hanya dari server (Neon HTTP driver).
- Backup: cron Vercel harian `GET /api/admin/ekspor` → simpan ke Vercel Blob (opsional) — atau cukup Koordinator mengunduh ekspor tiap akhir hari kerja dan Hermes meng-commit (jejak audit permanen di git).
- Tes: `test/overlay.test.mjs` (fungsi gabung, prioritas overlay vs dasar, hash terserap), `test/otorisasi.test.mjs` (PJ tidak boleh tulis butir OPD lain).

### 4.8 Alur kerja harian (sesudah Patch 4)
1. PJ masuk (sandi PJ + pilih OPD) → drawer butir → ubah status "draf → proses", tulis kebutuhan → simpan.
2. Koordinator melihat antrean & beban PJ berubah realtime (overlay); setelah hasil eval Tahap 2 keluar → Impor eval → terapkan.
3. Akhir hari: Koordinator → `/admin` → Ekspor → kirim ke Hermes → commit `data/catatan-mandiri.json` → overlay bertanda "terserap".

---

## 5. Jadwal usulan

| Minggu | Kegiatan | Catatan |
|--------|----------|---------|
| 23–30 Sep (interviu) | Bangun Patch 1 di sandbox; **tidak dikirim** kecuali pemilik minta; Hermes tidak menyentuh produksi | Bila pemilik ingin `/dashboard` tersedia saat interviu sebagai bahan tunjuk, Patch 1 aman dikirim karena `/` tidak berubah |
| 1–4 Okt | Kirim Patch 1 → verifikasi → Patch 2 | Visitasi mulai 1 Okt; Patch 2 sebaiknya dikirim pada hari tanpa jadwal visitasi |
| 5–9 Okt | Patch 3 | — |
| 6–7 Okt (paralel) | Pemilik membuat DB Neon via Vercel Marketplace, set 3 env CMS | 15 menit; saya siapkan `db/skema-cms.sql` + panduan |
| 8–14 Okt | Patch 4 (CMS) | Impor eval diuji dengan berkas contoh dari eval.spbe.go.id |

---

## 6. Yang saya butuhkan dari pemilik sebelum mulai Patch 1
1. ✅ Penyimpanan Neon/Vercel Postgres, sandi per peran, cakupan butir + konten, reskin dulu — **sudah diputuskan**.
2. Persetujuan dokumen ini (atau koreksi pada §2.2 susunan panel / §4.3 bidang yang bisa diedit).
3. Apakah Patch 1 boleh dikirim **selama minggu interviu** (aman karena `/` tidak berubah) atau ditahan sampai 1 Okt?
4. Nama OPD untuk daftar pilihan PJ saat masuk: pakai 10 OPD yang punya butir (`pjButir`) atau seluruh 52?
