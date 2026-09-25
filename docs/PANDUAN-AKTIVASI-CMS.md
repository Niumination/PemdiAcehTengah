# Panduan aktivasi CMS Ruang Kendali (Vercel + Neon) — 25 Sep 2026

Waktu: ±20 menit. Tidak perlu perubahan kode — semua kode CMS (Patch 4) sudah di `main`; skema tabel dibuat otomatis saat permintaan pertama (`lib/db.js pastikanSkema`). Tanpa env di bawah, situs tetap berjalan penuh dari `data/*.json` dan `/admin` hanya mode baca — jadi aktivasi ini **aman dan dapat dibatalkan** (hapus env → redeploy).

## 0. Siapkan dulu (2 menit)

Buat 3 rahasia di terminal lokal (jangan pakai kata sandi yang bisa ditebak):

```bash
openssl rand -base64 48          # → CMS_SESI_RAHASIA (≥32 karakter)
openssl rand -base64 12          # → CMS_SANDI_KOORDINATOR
openssl rand -base64 12          # → CMS_SANDI_PJ
```

Simpan di pengelola kata sandi Diskominfo. Sandi PJ akan dibagikan ke operator OPD lewat kanal internal (WA grup Tim Koordinasi), sandi Koordinator hanya untuk Bid. Layanan E-Government.

## 1. Buat database Neon lewat Vercel Marketplace (5 menit)

1. Vercel → proyek **PemdiAcehTengah** → tab **Storage** → **Create Database** → pilih **Neon** (Postgres).
2. Region: **Singapore (ap-southeast-1)** — terdekat dari Aceh; plan **Free** cukup (3 tabel kecil, <1 MB).
3. Nama database bebas, mis. `pemdi-cms`. Klik **Create** lalu **Connect Project** → environment **Production** (dan Preview bila ingin menguji di URL preview).
4. Vercel otomatis menambahkan beberapa env (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `POSTGRES_URL`, …). Yang dipakai kode hanya **`DATABASE_URL`** (versi *pooled*). Sisanya boleh dibiarkan.

## 2. Tambah 3 env CMS (3 menit)

Vercel → **Settings → Environment Variables** → tambahkan, masing-masing centang **Production** dan tandai **Sensitive**:

| Nama | Nilai | Catatan |
|---|---|---|
| `CMS_SESI_RAHASIA` | hasil `openssl rand -base64 48` | HMAC cookie sesi `pemdi_cms`; mengganti nilai ini = semua sesi keluar |
| `CMS_SANDI_KOORDINATOR` | sandi Koordinator | peran penuh: butir, konten tampilan (marquee, pengumuman, tenggat), log, ekspor |
| `CMS_SANDI_PJ` | sandi PJ OPD | hanya butir yang PJ-nya = OPD yang dipilih saat masuk; tidak bisa ubah PJ / set "diterima" |

Bersih-bersih (opsional tapi disarankan): hapus env sisa persona publik yang sudah tidak dipakai bila masih ada (`SUPABASE_*`, `NEXT_PUBLIC_SUPABASE_*`, `SKM_*`, `LAPOR_*`). Kode tidak lagi membacanya (`grep process.env` hanya: `DATABASE_URL`, `CMS_DB_LOKAL`, `CMS_SANDI_*`, `CMS_SESI_RAHASIA`, `NEXT_PUBLIC_SITE_URL`, `SITE_ORIGIN`).

## 3. Redeploy (3 menit)

Env baru hanya berlaku pada deploy berikutnya: **Deployments → ⋯ pada deploy terakhir → Redeploy** (tidak perlu centang "use existing build cache").

## 4. Verifikasi (5 menit)

1. `https://<domain>/api/auth/sesi` → harus `{"sesi":null,"cmsAktif":true,"dbAktif":true}`. Bila `cmsAktif:false` → salah satu dari 3 env CMS kosong; `dbAktif:false` → `DATABASE_URL` belum terpasang di Production.
2. Buka `/admin` → panel **Masuk CMS** → peran Koordinator + sandi → masuk. Permintaan pertama membuat tabel `butir_overlay`, `konten_tampilan`, `log_audit` (cek di Neon Console → Tables).
3. Uji tulis tanpa risiko: di **Konten tampilan dashboard** ubah teks *pengumuman* → simpan → buka `/dashboard` (ISR di-*revalidate* otomatis; bila belum tampak, tunggu ≤60 detik). Kembalikan teks bila perlu.
4. Uji peran PJ dari peramban lain/incognito: masuk sebagai PJ + pilih OPD (mis. Setda) → hanya butir Setda yang bisa disunting; coba set "diterima" → harus ditolak.
5. **Log audit** di `/admin` mencatat dua perubahan tadi.

## 5. Rutinitas setelah aktif

- **Ekspor harian** (Koordinator): `/admin` → Ekspor, atau `GET /api/admin/ekspor` → simpan ke `data/catatan-mandiri.json` di repo → jalankan rantai regenerasi (`data/AGENTS.md`) → commit. Overlay DB adalah lapisan sementara; sumber kebenaran jangka panjang tetap JSON di repo.
- Ganti `CMS_SANDI_PJ` setelah masa visitasi (Oktober) berakhir atau bila bocor; cukup ubah env + redeploy.
- Neon Free menangguhkan compute saat idle; permintaan pertama setelah idle bisa ±1 detik lebih lambat — normal.

## Jika bermasalah

| Gejala | Penyebab umum | Tindakan |
|---|---|---|
| `503 CMS belum dikonfigurasi` saat masuk | env CMS belum di Production / belum redeploy | cek §2, lalu §3 |
| Masuk berhasil, simpan gagal `db` | `DATABASE_URL` salah/unpooled atau DB belum di-connect ke proyek | Storage → Connect Project; pakai `DATABASE_URL` pooled |
| Perubahan tak tampak di dashboard | revalidate ISR gagal (lihat Vercel → Logs `[cms] revalidate gagal`) | muat ulang setelah 60 detik; bila terus, laporkan |
| Ingin mematikan CMS | — | hapus 3 env `CMS_*` → redeploy; data di Neon tetap tersimpan |
