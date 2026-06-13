<div align="center">

<img src="desain/aset/icons/icon-192.png" alt="Lambang Pemdi Aceh Tengah" width="120" />

# Pemdi Aceh Tengah

**Portal Pemerintah Digital — Kabupaten Aceh Tengah**

Transformasi tata kelola pemerintahan menuju Pemerintah Digital (Pemdi) yang transparan, efisien, dan berorientasi pada masyarakat.

[![Lisensi: MIT](https://img.shields.io/badge/Lisensi-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js)](https://nextjs.org)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)](https://vercel.com)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)

[🌐 Situs Live](https://pemdi-aceh-tengah.vercel.app) · [📋 Direktori Layanan](https://pemdi-aceh-tengah.vercel.app/layanan) · [📊 Indeks Pemdi](https://pemdi-aceh-tengah.vercel.app/pemdi)

</div>

---

## 📖 Tentang

**Pemdi Aceh Tengah** adalah inisiatif *open source government technology* untuk transformasi digital
tata kelola Pemerintah Kabupaten Aceh Tengah. Portal ini menyajikan:

- **Direktori layanan publik** — syarat, biaya, waktu proses (SLA), dan alur tiap layanan.
- **Indeks SPBE & Indeks Pemdi** — transparansi kinerja digital pemerintah dalam bahasa yang mudah dipahami.
- **Peta Proses Bisnis** — gambaran tata kelola sesuai Permenpan 19/2018.
- **Profil 52 Perangkat Daerah** — dinas, badan, lembaga, dan 14 kecamatan.
- **Kanal partisipasi warga** — Lapor/Saran, Survei Kepuasan (SKM), Tanya Jawab.

Dasar: Perpres 95/2018 (SPBE), Permenpan 19/2018, 59/2020, 14/2017 (SKM), dan Permenpan 8/2026 (Pemdi).

---

## ✨ Fitur Utama

| Fitur | Keterangan |
|---|---|
| 🏛️ Portal informasi | Indeks SPBE, Indeks Pemdi, Peta Proses Bisnis, profil OPD |
| 📋 Direktori layanan | 27 layanan, 7 kategori — dengan syarat, biaya, SLA |
| 💬 Lapor / Saran | Form publik → tersimpan ke database, dapat nomor tiket |
| 📝 Survei Kepuasan (SKM) | 8 unsur (Permenpan 14/2017), hasil dihitung jadi IKM |
| 🔍 Pencarian | Pencarian cepat lintas konten (Fuse.js) |
| 💡 Glosarium | Penjelasan istilah teknis dalam bahasa awam |
| 🛠️ Dashboard admin | Kelola laporan & lihat grafik IKM (terproteksi) |
| ♿ Aksesibilitas | Skip-link, ARIA, kontras, keyboard-friendly |
| 📱 PWA | Installable, ikon & manifest |

---

## 🧰 Teknologi

- **Framework:** Next.js (Pages Router) + React
- **Styling:** styled-jsx + CSS variables (design tokens)
- **Database:** Supabase (PostgreSQL) — laporan & survei
- **Pencarian:** Fuse.js
- **Deploy:** Vercel
- **Bahasa:** Indonesia (id)

---

## 🚀 Menjalankan Secara Lokal

```bash
# 1. Clone
git clone https://github.com/<username>/PemdiAcehTengah.git
cd PemdiAcehTengah

# 2. Install dependency
npm install

# 3. Siapkan environment variables
cp .env.example .env.local   # lalu isi nilainya (lihat tabel di bawah)

# 4. Siapkan database (Supabase)
#    Buka Supabase SQL Editor → jalankan db/schema.sql

# 5. Jalankan
npm run dev                  # buka http://localhost:3000
```

### Build produksi
```bash
npm run build && npm start
```

---

## 🔑 Environment Variables

Salin dari `.env.example` ke `.env.local` (lokal) & set di Vercel → Settings → Environment Variables.

| Variabel | Wajib | Keterangan |
|---|:---:|---|
| `SUPABASE_URL` | ✅ | URL project Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | **Rahasia**, server-only. Jangan diekspos ke klien |
| `SITE_ORIGIN` | ✅ | Origin situs (CORS & sitemap) |
| `IP_HASH_SALT` | ✅ | Garam acak untuk hashing IP (anti-spam, privasi) |
| `ADMIN_PASSWORD` | ✅ | Kata sandi dashboard admin (jangan hardcode!) |
| `TURNSTILE_SECRET_KEY` | ⬜ | Anti-bot Cloudflare Turnstile (opsional) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | ⬜ | Site key Turnstile (opsional) |

> ⚠️ **Keamanan:** jangan pernah menulis kata sandi atau service key di dalam kode/commit.
> Gunakan environment variables. Pastikan `.env.local` masuk `.gitignore`.

---

## 📂 Struktur Proyek (ringkas)

```
.
├── components/        # Komponen UI reusable (Section, Explainer, ScoreGauge, dst.)
├── data/              # Data statis (glosarium, layanan, OPD)
├── db/
│   └── schema.sql     # Skema database Supabase
├── lib/
│   ├── supabaseAdmin.js
│   ├── security.js    # sanitasi, rate-limit, hash IP, anti-bot
│   └── format.js      # format angka id-ID
├── pages/
│   ├── index.js       # Beranda
│   ├── layanan/       # Direktori & detail layanan
│   ├── pemdi.js       # Indeks Pemdi
│   ├── probis.js      # Peta Proses Bisnis
│   ├── skm.js         # Survei Kepuasan
│   ├── glosarium.js   # Glosarium istilah
│   ├── admin/         # Dashboard admin (terproteksi)
│   └── api/
│       ├── lapor.js   # POST laporan → DB
│       ├── skm.js     # POST survei → DB; GET ringkasan IKM
│       └── admin/     # Endpoint admin (terproteksi)
└── public/
    ├── icons/         # Ikon PWA & favicon
    ├── manifest.json
    └── og-image.png
```

---

## 🔌 API Singkat

| Endpoint | Metode | Fungsi |
|---|---|---|
| `/api/lapor` | `POST` | Kirim laporan/saran → tersimpan, balas nomor tiket |
| `/api/skm` | `POST` | Kirim survei kepuasan (8 unsur) |
| `/api/skm` | `GET` | Ringkasan agregat IKM (publik, aman) |
| `/api/admin/laporan` | `GET/PATCH` | Baca & ubah status laporan (terproteksi) |

Semua endpoint dilindungi validasi, sanitasi, rate-limit, dan hash IP.

---

## ♿ Aksesibilitas & UX

Portal ini dirancang agar **informasi yang padat tetap mudah dipahami banyak orang**:
- Bahasa awam dulu ("Singkatnya…"), istilah resmi kemudian + glosarium.
- *Progressive disclosure* (accordion/tab) agar layar tidak membanjiri pembaca.
- Sistem warna status konsisten (🟢 Baik · 🟡 Cukup · 🔴 Perlu perbaikan) + label teks.
- Lihat panduan lengkap di [`desain/PANDUAN_DESAIN_UIUX.md`](desain/PANDUAN_DESAIN_UIUX.md).

---

## 🤝 Kontribusi

Kontribusi terbuka! Silakan buka *issue* atau *pull request*.
1. Fork repo
2. Buat branch fitur (`git checkout -b fitur/nama-fitur`)
3. Commit & push
4. Buka Pull Request

---

## 📊 Sumber Data

Data perangkat daerah & statistik bersumber dari **Dinas Komunikasi dan Informatika
Kabupaten Aceh Tengah** (sebagai *Walidata*), berdasarkan surat resmi 14 Januari 2026.

---

## 📜 Lisensi

Dirilis di bawah **Lisensi MIT** — bebas digunakan, dimodifikasi, dan didistribusikan.
Lihat berkas [LICENSE](LICENSE).

---

<div align="center">
<sub>Dibangun dengan ❤️ untuk masyarakat Kabupaten Aceh Tengah · Open Source Government Technology</sub>
</div>
