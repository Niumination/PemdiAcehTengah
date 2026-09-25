# Hasil pra-uji tugas (simulasi) — 25 Sep 2026

Pra-uji otomatis sebelum sesi dengan peserta nyata (protokol: `docs/UJI-TUGAS-PEMDI.md`). Skrip `node scripts/uji-tugas.mjs` menempuh jalur paling mungkin untuk T1–T5 dan memverifikasi jawaban benar **terlihat di layar**. Ini bukan pengganti uji dengan orang; gunanya menyingkirkan cacat yang pasti menggagalkan peserta.

## Putaran 1 (kode Patch 20) — 2/8 lolos

| Tugas | Persona/perangkat | Hasil | Sebab |
|---|---|---|---|
| T1 status butir I19-L1-01 + catatan | Koordinator/laptop | ✅ 3 langkah (Ctrl+K → ketik → Enter) | — |
| T2 dokumen minggu ini | PJ OPD beban ringan/ponsel | ❌ | OPD tanpa butir prioritas tinggi melihat "Minggu ini" kosong; grup berisi terlipat → butuh klik ekstra tanpa petunjuk |
| T3 nilai, target, mengapa | Pimpinan/ponsel | ✅* | (kegagalan putaran 1 = selektor skrip, bukan situs; nilai 1,24 + target 2,50 ada di layar pertama) |
| T4 OPD tunggakan terbanyak + kirim tautan | Koordinator/laptop → ponsel | ❌ | Jawaban benar (Diskominfo 47) ada, URL = state, tetapi **tidak ada tombol Bagikan** — pengguna harus salin URL manual |
| T5 ringkasan 1 halaman untuk rapat | Pimpinan/laptop | ❌ | `/dashboard` dan `/asesor` **tanpa tombol Cetak** dan tanpa `@media print` (hasil Ctrl+P memuat header, marquee, menu) |

## Perbaikan (Patch 21)

1. `/opd/[slug]` Tugas saya: grup **pertama yang berisi** terbuka otomatis; grup terlipat diberi petunjuk "— ketuk untuk membuka" (desktop).
2. Header: tombol **Cetak** (ikon, ≥861px) → `window.print()`; gaya `@media print` global: header/strip/menu/drawer/tombol disembunyikan, panel terlipat dibuka, satu kolom, tanpa latar.
3. Footer: tombol **Bagikan tautan halaman ini** (WhatsApp, judul + URL) — berlaku semua halaman karena URL = state.

## Putaran 2 (Patch 21) — 8/8 lolos

| Tugas | Persona/perangkat | Langkah | Bukti |
|---|---|---|---|
| T1 | Koordinator/laptop | 3 | drawer: kode + status revisi + catatan |
| T2 | PJ Setda/ponsel | 1 | "Minggu ini · 6 butir" terbuka, aksi "Tanggapi catatan revisi asesor…", y=737px (layar pertama) |
| T2 | PJ BKPSDM/ponsel | 1 | "Berikutnya · 3 butir" terbuka otomatis, aksi "Siapkan dokumen level berikut…" |
| T3 | Pimpinan/ponsel | 2 | layar-1 dashboard: 1,24 + target 2,50 + Level 1; `/asesor` menjelaskan aspek terendah |
| T4 | Koordinator/laptop → ponsel | 2 | ubin pertama Diskominfo 47; penerima melihat hal sama; tombol Bagikan ada |
| T5 | Pimpinan/laptop | 1 | Cetak ada di /dashboard, /asesor, /pemdi; `@media print` aktif |

## Yang tetap harus diuji dengan orang nyata (tidak bisa disimulasikan)

- Apakah peserta **menemukan** Ctrl+K / tombol Cari untuk T1 (skrip mengasumsikannya).
- Apakah PJ OPD memahami istilah "revisi asesor" vs "draf lokal" tanpa penjelasan.
- Apakah Pimpinan puas dengan hasil cetak 1 halaman atau ingin ringkasan naratif.
- Waktu & salah-klik sesungguhnya (target: <120 detik, ≤2 salah-klik, ≥4/5 peserta).

Tulis hasil sesi nyata ke `docs/HASIL-UJI-TUGAS-<tanggal>.md` sesuai lembar catat §4 protokol; tugas yang gagal ≥2 peserta = P0 patch berikutnya.
