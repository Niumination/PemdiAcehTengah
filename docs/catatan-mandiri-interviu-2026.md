# Catatan Mandiri per Butir — Persiapan Interviu Asesor Eksternal KemenPANRB (Pemdi 2026)

> **Status materi asesor eksternal: BELUM DITERIMA — akan menyusul.** Daftar pertanyaan/materi evaluasi dari asesor eksternal KemenPANRB belum dikirim ke tim per 21 Sep 2026. Seluruh catatan di bawah disusun dari **catatan asesor tahap 1** (eval.spbe.go.id, sinkron 20 Sep 2026) dan Modul Indikator PermenPANRB 8/2026. Begitu materi diterima: perbarui `data/catatan-mandiri.json → materi_asesor_eksternal` dan sesuaikan butir yang terdampak, lalu jalankan `python3 scripts/gabung-catatan-mandiri.py`.

**Tenggat:** Senin, 28 September 2026 (5 hari kerja). Jadwal nasional: interviu 21–30 Sep, visitasi 1–30 Okt 2026.

## Cakupan (keputusan pemilik, 21 Sep 2026)

- Hanya **butir hasil REVISI** (19) dan **butir yang belum diterima pada *level berikut*** setiap indikator (29) — total **48 butir pada 20 indikator**. Butir yang sudah **diterima asesor tidak disentuh**.
- Catatan ditulis **per butir** (bukan per indikator) supaya bisa langsung ditempel ke kolom catatan setiap unggahan di eval.spbe.go.id.
- Rujukan hanya ke dokumen yang **ada di repo** (`public/bukti-dukung/final/` 18 PDF diterima; `public/panduan-bukti-l1/` 39 draf) — dengan **nomor halaman PDF**; regulasi (Perbup) dirujuk lewat **tautan JDIH** karena salinannya tidak ada di repo. Tiga PDF hasil pindai (I3-L1-01, I4-L1-03, I13-L1-01) tidak punya lapisan teks → hanya catatan umum tanpa halaman.
- Bahasa baku PermenPANRB 8/2026 tidak diparafrasakan; status butir & catatan asesor tetap salinan apa adanya.

## Cara pakai

1. Buka `/pemdi` (checklist per indikator) atau `/modul-indikator` (tabel bukti per level). Butir revisi/level berikut memiliki kartu **📝 Catatan mandiri** → **📋 Salin** menyalin teks siap tempel (judul, kode, catatan asesor, catatan mandiri, rujukan bernomor + tautan, PJ).
2. Bilah **Catatan mandiri: N butir** per indikator → **Salin semua**, **⬇️ DOCX** (berkas Word untuk diunggah/diedit), **🖨️ Cetak / PDF** (dialog cetak peramban → Simpan sebagai PDF).
3. Kolom **"Masih harus disiapkan sebelum unggah"** adalah daftar kerja PJ sampai 28 Sep — bukan untuk ditempel ke portal.
4. Mengubah isi: edit **hanya** `data/catatan-mandiri.json`, lalu `python3 scripts/gabung-catatan-mandiri.py` dan `npm test`.

## Pola temuan asesor tahap 1 yang harus dihindari saat unggah ulang

| Pola | Contoh butir | Yang diminta asesor |
|---|---|---|
| RKA/DPA rekap tanpa item kegiatan yang relevan | I4-L1-02, I13-L1-02 | Halaman rincian sub kegiatan yang memuat kegiatan dimaksud (kolaborasi lintas PD / pengembangan aplikasi) atau dokumen perencanaan yang eksplisit memuat substansinya (Renstra Bab IV, Peta Rencana Bab V, Rencana Kolaborasi) |
| Dokumen "mirip" tapi objek berbeda | I9-L1-01 (SK Tim Asesor ≠ SK Tim Auditor), I1-L2-02 (evaluasi ≠ penyusunan), I19-L1-02 (daftar SLA ≠ dasbor SLA), I15-L1-01 (pasal Perbup ≠ arsitektur di SIAP Digital) | Objek persis seperti nama butir; judul berkas mengikuti istilah asesor |
| Instrumen usang | I10-L1-01 (Indeks KAMI 2023) | IKASANDI ≤ 12 bulan, terisi di portal BSSN |
| Belum diunggah (10 butir) | I8, I12, I13, I14, I16, I20 | Draf sudah ada di `public/panduan-bukti-l1/` — finalisasi nomor/tanggal/TTD dan ganti tangkapan layar placeholder dengan yang riil |
| Ditolak otomatis (2 butir) | I4-L2-02, I12-L2-01 | Tidak perlu diunggah sebelum L1 diterima |

## Prasyarat lintas indikator (paling menentukan)

- **SIAP Digital (digital.spbe.go.id) harus benar-benar terisi** — domain Proses Bisnis (I15), Aplikasi (I13), Infrastruktur (I14), Data (I18), Layanan (I1 L2). Tangkapan layar + ekspor dengan nama instansi & tanggal.
- **IKASANDI BSSN 2026 harus terisi di portal** (I10, I12) — instrumen lokal saja tidak cukup.
- **Persona publik portal** (`/layanan`, `/dashboard-kepuasan`, `/kebijakan-privasi`) saat ini nonaktif (`NEXT_PUBLIC_PERSONA_PUBLIK` off) — aktifkan sementara di lingkungan lokal saat mengambil tangkapan layar untuk I19/I20/I8.

## Daftar 48 butir

| Ind | Kode eval | Level | Jenis | Prioritas | PJ | Butir |
|---|---|---|---|---|---|---|
| I1 | `I1-L2-02` | L2 | 🔁 revisi | tinggi | Diskominfo (Sekretariat Tim Koordinasi Pemdi) | Pengisian Arsitektur Pemerintah Digital pada sebagian Layanan Digital… |
| I1 | `—` | L2 | 🎯 level berikut | tinggi | Diskominfo (Sekretariat/Perencanaan) + BPKAD | Perencanaan dan Anggaran yang mendukung sebagian substansi Rencana Aks… |
| I2 | `—` | L2 | 🎯 level berikut | sedang | Diskominfo + Disdukcapil | Bukti Pelaksanaan Manajemen pada sebagian Layanan Digital Pemerintah. |
| I3 | `—` | L1 | 🎯 level berikut | sedang | BKPSDM + Diskominfo | Dokumentasi pelaksanaan komunitas belajar. |
| I3 | `—` | L1 | 🎯 level berikut | sedang | Diskominfo + BKPSDM | Laporan penggunaan microlearning internal (modul singkat, video, e-lea… |
| I3 | `—` | L1 | 🎯 level berikut | rendah | BKPSDM | tampilan dashboar instansional pada myasn.bkn.go.id |
| I4 | `I4-L1-02` | L1 | 🔁 revisi | tinggi | Sekretariat Tim Koordinasi Pemdi (Diskominfo) + Setda Bag. Organisasi | Substansi Rencana Aksi Nasional Pemerintah Digital pada perencanaan In… |
| I4 | `I4-L2-02` | L2 | 🔁 revisi | sedang | Diskominfo | Bukti Pelaksanaan Kolaborasi antar Instansi Pemerintah dalam menerapka… |
| I5 | `—` | L1 | 🎯 level berikut | sedang | Bappeda (Koordinator Forum SDI) + Diskominfo (Walidata) | Indeks Satu Data Indonesia (SDI). |
| I6 | `—` | L1 | 🎯 level berikut | rendah | Diskominfo + Dinas PUPR/Bappeda | Indeks Simpul Jaringan Informasi Geospasial (BIG). |
| I7 | `—` | L1 | 🎯 level berikut | rendah | Diskominfo (Bidang Statistik & Persandian) | Indeks Pembangunan Statistik (BPS). |
| I8 | `I8-L1-01` | L1 | 🔁 revisi | tinggi | Diskominfo + Bagian Hukum Setda | Uraian kondisi existing tata kelola PDP, hasil identifikasi kebutuhan… |
| I8 | `—` | L1 | 🎯 level berikut | sedang | Diskominfo + BKPSDM | Uraian pelatihan yang pernah diikuti pegawai, hasil identifikasi kebut… |
| I8 | `—` | L1 | 🎯 level berikut | sedang | Diskominfo + Bagian Organisasi & Bagian Hukum | Uraian struktur organisasi dan fungsi yang saat ini menangani PDP, has… |
| I8 | `—` | L1 | 🎯 level berikut | sedang | Diskominfo + PPID Utama | Uraian proses penanganan permintaan Hak Subjek Data yang berjalan saat… |
| I8 | `—` | L1 | 🎯 level berikut | sedang | Diskominfo | Uraian penyampaian informasi kepada pengguna layanan digital yang saat… |
| I8 | `—` | L1 | 🎯 level berikut | sedang | Diskominfo (Persandian & Keamanan Informasi) | Uraian pengamanan atau kontrol keamanan yang telah diterapkan saat ini… |
| I8 | `—` | L1 | 🎯 level berikut | sedang | Diskominfo | Uraian kondisi pengelolaan risiko yang berjalan saat ini, hasil identi… |
| I9 | `I9-L1-01` | L1 | 🔁 revisi | tinggi | Diskominfo (Koordinator Pemdi) + Inspektorat + Bagian Hukum | Penetapan Tim Audit yang ditetapkan oleh Koordinator Pemerintah Digita… |
| I9 | `—` | L1 | 🎯 level berikut | tinggi | Inspektorat + Diskominfo | Dokumen Perencanaan Audit IPPD. |
| I10 | `I10-L1-01` | L1 | 🔁 revisi | tinggi | Diskominfo (Bidang Persandian & Keamanan Informasi) | 1. Nilai IKASANDI pada area Keamanan Siber. 0 < IKASANDI < 1,5. |
| I11 | `—` | L2 | 🎯 level berikut | sedang | Diskominfo (Bidang Persandian) | Laporan pelaksanaan penerapan teknologi kriptografi (Sesuai Keputusan… |
| I12 | `I12-L1-02` | L1 | 🔁 revisi | tinggi | Diskominfo (Bidang Persandian & Keamanan Informasi) | Nilai IKASANDI pada area Penanganan Insiden Siber. 0 < IKASANDI < 1,50… |
| I12 | `I12-L2-01` | L2 | 🔁 revisi | sedang | Diskominfo (Bidang Persandian) + Bagian Hukum | Penetapan TTIS. |
| I13 | `I13-L1-02` | L1 | 🔁 revisi | tinggi | Diskominfo (Bidang TIK/APTIKA + Perencanaan) | Substansi Rencana Aksi Pemerintah Digital pada Perencanaan Instansi Pe… |
| I13 | `—` | L1 | 🎯 level berikut | tinggi | Diskominfo (admin SIAP Digital) | Aplikasi Pemerintah Digital pada Arsitektur Teknologi Pemerintah Digit… |
| I13 | `I13-L2-01` | L2 | 🔁 revisi | tinggi | Diskominfo (Bidang TIK/APTIKA) | Dokumentasi pembangunan/pengembangan aplikasi Pemerintah Digital**, ya… |
| I13 | `I13-L2-02` | L2 | 🔁 revisi | tinggi | Diskominfo + Bappeda | Substansi Rencana Aksi Pemerintah Digital pada Perencanaan Instansi Pe… |
| I13 | `I13-L3-01` | L3 | 🔁 revisi | rendah | Diskominfo | Dokumentasi pengembangan/ pembangunan aplikasi Pemerintah Digital**. |
| I14 | `I14-L1-01` | L1 | 🔁 revisi | tinggi | Diskominfo (Bidang TIK — infrastruktur) | Dasbor Ekosistem Pusat Data yang dimanfaatkan oleh IPPD. |
| I14 | `I14-L1-02` | L1 | 🔁 revisi | tinggi | Diskominfo (Bidang TIK — jaringan) | Screenshot Pemakaian Jaringan Intra. |
| I14 | `—` | L1 | 🎯 level berikut | sedang | Diskominfo (Bidang TIK) | Screenshot Topologi Jaringan Intra IPPD atau Pusat Data yang digunakan… |
| I14 | `—` | L1 | 🎯 level berikut | tinggi | Diskominfo (admin SIAP Digital) | Infrastruktur Digital pada Arsitektur Teknologi Pemerintah Digital dar… |
| I15 | `I15-L1-01` | L1 | 🔁 revisi | tinggi | Diskominfo (admin SIAP Digital) + Setda Bagian Organisasi | Proses Bisnis Pemerintah Digital untuk mendukung Layanan Digital pada… |
| I15 | `—` | L1 | 🎯 level berikut | tinggi | Diskominfo (admin SIAP Digital) | Screenshot yang menggambarkan proses bisnis pada layanan digital SIAP… |
| I16 | `I16-L1-01` | L1 | 🔁 revisi | tinggi | Diskominfo (Bidang APTIKA) | Laporan Pelaksanaan Integrasi Aplikasi yang berisikan matriks integras… |
| I16 | `—` | L1 | 🎯 level berikut | sedang | Diskominfo (Bidang APTIKA) | Matriks pemantauan integrasi aplikasi. |
| I16 | `—` | L1 | 🎯 level berikut | sedang | Diskominfo (Bidang APTIKA) + PD pemilik aplikasi | Matriks pengintegrasian aplikasi dapat berisi: Dokumentasi rapat; Doku… |
| I17 | `—` | L3 | 🎯 level berikut | sedang | Diskominfo + DPMPTSP + Disdukcapil | Portal Layanan Digital Pemerintah pada Instansi Pemerintah pada seluru… |
| I17 | `—` | L3 | 🎯 level berikut | rendah | Diskominfo (Bidang APTIKA) | Kesesuaian desain antarmuka dan pengalaman pengguna dengan standar nas… |
| I17 | `—` | L3 | 🎯 level berikut | rendah | Diskominfo | Dasbor matriks pemantauan data Pemanfaatan Portal Layanan Digital Peme… |
| I17 | `—` | L3 | 🎯 level berikut | rendah | Diskominfo | Persentase pemanfaatan Portal Layanan Digital Pemerintah Nasional lebi… |
| I18 | `—` | L1 | 🎯 level berikut | tinggi | Diskominfo (Walidata, admin SIAP Digital) + Bappeda | Arsitektur Data Pemerintah Digital dari SIAP Digital. (disesuaikan den… |
| I18 | `—` | L1 | 🎯 level berikut | sedang | Bappeda + Diskominfo | Indeks SDI pada Aspek Interoperabilitas Data. 0 < SDI < 12,5. |
| I19 | `—` | L1 | 🎯 level berikut | tinggi | Diskominfo (Unit Pengelola Layanan Digital) | Dokumen Service Level Agreement (SLA) Layanan Digital. |
| I19 | `I19-L1-02` | L1 | 🔁 revisi | tinggi | Diskominfo (Unit Pengelola Layanan Digital / helpdesk) | Dokumen Service Level Agreement (SLA) Per-Proses Layanan Digital. |
| I20 | `I20-L1-03` | L1 | 🔁 revisi | tinggi | Setda Bagian Organisasi + Diskominfo + Dinas Sosial | Bukti pelibatan perwakilan kelompok rentan dalam upaya pengelolaan kep… |
| I20 | `I20-L1-04` | L1 | 🔁 revisi | tinggi | Setda Bagian Organisasi + Diskominfo | Bukti tindak lanjut pengelolaan kepuasan pengguna layanan digital. |

## Rujukan halaman kunci (hasil ekstraksi teks PDF, 21 Sep 2026)

| Dokumen | Bagian yang sering dirujuk | Halaman PDF |
|---|---|---|
| RPJMD 2025–2029 (I1-L2-01, 409 hal.) | Isu strategis no. 8 Digitalisasi (Indeks SPBE 2,28; integrasi SIPD/SIA ke EGA; indikator digital lintas OPD) | 237–238 (II-209–210) |
| | Tabel 3 Program Unggulan — "Aceh Tengah Satu Data" | 281 (III-38) |
| | Sub kegiatan Kominfo: portal terintegrasi, SPLP, kabupaten cerdas; keamanan informasi & persandian; statistik sektoral | 331–333 (III-88–90) |
| | Bab IV program PD: 2.16.03 Aplikasi Informatika (Indeks SPBE 2,88→3,36), 2.20.02 Statistik (IPS), 2.21.02 Persandian | 379, 381 (IV-14, IV-16) |
| Renstra Diskominfo 2025–2029 (I1-L2-03, 53 hal.) | Tugas Bidang TIK (aplikasi generik/spesifik, keamanan informasi) | 15 (hal. 12) |
| | Program 2.16.03 + sub kegiatan 0024 jaringan intra, 0025 portal, 0033 pusat kendali, 0034 SPLP, 0036 internet, 0037 koordinasi tata kelola SPBE, 0038 kabupaten cerdas | 44–48 (hal. 41–45) |
| Peta Rencana Pemdi 2025–2029 (I1-L1-01, 20 hal.) | Bab III arah kebijakan & strategi per aspek; 3.3 tahapan | 9–10 |
| | Bab IV 4.1 target level per indikator 2025–2029 | 11 |
| | Bab V program & kegiatan prioritas A–G; 5.8 anggaran indikatif | 13–14 |
| SK Bupati 555/395/2026 Tim Koordinasi Pemdi (I4-L1-01, 8 hal.) | Diktum KESATU–KELIMA; Lampiran I susunan; Lampiran II uraian tugas (Koordinator PEMDI = Wakil Ketua/Kadis Kominfo; Pokja per aspek) | 3, 4, 5–8 |
| Laporan Manajemen Layanan Digital (I2-L1-02, 25 hal.) | Bab III 5 domain; Bab IV alur tiket; Lampiran B–E | 12–17, 21–25 |
