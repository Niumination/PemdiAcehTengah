# Audit Kesesuaian Bukti Dukung Pemdi terhadap Modul Indikator

**Tanggal audit:** 10 Agustus 2026  
**Ruang lingkup:** Checklist di `/pemdi`, panduan/kriteria pada `/modul-indikator`, `data/pemdi.json`, dan seluruh **38 berkas** yang benar-benar tersedia di `public/bukti-dukung/` (termasuk `final/`).  
**Acuan:** kriteria per level pada `data/modul-indikator.json`, yang telah diturunkan dari Modul Pemdi/PermenPANRB 8 Tahun 2026.

## Kesimpulan eksekutif

**Belum, seluruh bukti dukkung belum dapat dinyatakan sesuai atau cukup untuk memenuhi level yang saat ini ditandai `lengkap`.** Bukti yang tersedia berguna sebagai bahan awal, tetapi banyak yang hanya membuktikan **adanya kebijakan, rencana, atau satu contoh layanan**; bukan pelaksanaan, cakupan, hasil, reviu, dan tindak lanjut yang diminta modul.

Temuan paling penting:

1. **33 entri saat ini berstatus `lengkap` perlu diturunkan minimal menjadi `proses` sambil diverifikasi/ditambah bukti.** Tidak ada satu pun indikator yang dapat disimpulkan memenuhi sebuah level secara utuh dari berkas yang diperiksa.
2. Ada **berkas kompilasi/draf** (`final/I1_L1_Final.pdf`, `I1_L4_Final.pdf`, `I19_L1_SLA-Layanan-Digital_2026.pdf`, `I20_L1_SKM-Online_2026.pdf`) yang tampil seperti bukti final, tetapi tidak mempunyai pengesahan, nomor naskah/berita acara, tanda tangan, tautan sistem, atau jejak sumber yang cukup. Berkas tersebut tidak boleh menjadi satu-satunya dasar status `lengkap`.
3. Ada **klaim cakupan yang melampaui isi bukti**: “seluruh”, “100%”, “semua layanan”, “integrasi nasional”, dan “jumlah transaksi satu tahun” tidak dibuktikan oleh matriks cakupan, log sistem, dashboard SIAP Digital, atau data periode satu tahun.
4. Dokumen pendukung seperti Perbup Arsitektur SPBE, Perbup standar pelayanan, SK tim, dan Renstra **relevan sebagai konteks/pedukung**, namun tidak boleh menggantikan bukti utama indikator yang spesifik.
5. Flag `_l1_lengkap` dalam data saat audit **tidak konsisten dengan status itemnya**. Contoh: I3, I8, I11, I12, I14, dan I17 bertanda `true` walaupun ada item L1 utama berstatus `belum`; I19 dan I20 bertanda `false` walaupun beberapa item L1 ditandai lengkap. Flag ini harus dihitung ulang dari item utama L1, bukan dipertahankan manual.

> **Keputusan audit:** pertahankan berkas sebagai bahan/pendukung; jangan hapus. Ubah klaim kelengkapan menjadi **`proses`** sampai daftar verifikasi di bawah terpenuhi. Bukti yang tidak relevan langsung tetap dapat ditampilkan sebagai “pendukung”, tetapi tidak dihitung untuk nilai/kelengkapan level.

---

## Metode dan batasan pemeriksaan

1. Setiap entri checklist dicocokkan dengan item bukti pada level yang sama di modul, bukan hanya dengan nama indikator.
2. Seluruh tautan lokal diverifikasi keberadaannya. Tidak ditemukan tautan lokal putus pada entri yang memiliki `url_preview`.
3. PDF diekstrak teksnya bila memungkinkan. Banyak PDF merupakan hasil pindai/image-only sehingga substansi dan pengesahannya tidak dapat divalidasi otomatis; kondisi ini sendiri berarti bukti perlu pemeriksaan visual/administratif sebelum dinyatakan lengkap.
4. Audit ini menilai **kecukupan bukti untuk klaim pada portal**, bukan mengesahkan kebenaran materiil sebuah keputusan/peraturan atau keadaan operasional di lapangan.

### Klasifikasi yang dipakai

| Status audit | Arti |
|---|---|
| **Sesuai terbatas / proses** | Dokumen berhubungan langsung, tetapi belum membuktikan seluruh unsur, cakupan, periode, atau pengesahan yang diminta. |
| **Pendukung saja** | Relevan sebagai dasar hukum/konteks, tetapi bukan bukti inti item modul. |
| **Tidak sesuai untuk item** | Substansi dokumen tidak menjawab item bukti; jangan dihitung. |
| **Belum ada** | Belum ada berkas atau tautan pembuktian yang dapat diuji. |

---

## Inventaris berkas yang ditemukan

| Kelompok | Jumlah | Catatan audit |
|---|---:|---|
| Tata kelola / I1–I4 | 18 | Ada draf peta rencana, RPJMD/RPJMK, RKA, SK Tim, dan dokumen rapat; sebagian image-only. |
| Keamanan I9/I12 | 3 | SK Tim Asesor dapat diekstrak; dua SK CSIRT image-only. |
| Layanan I17/I19/I20 | 5 | Ada URL portal, daftar SLA buatan/kompilasi, SKM; sebagian klaim belum dapat diverifikasi. |
| Aplikasi I13 | 6 | BAST dan screenshot aplikasi hanya membuktikan contoh aplikasi, bukan tata kelola portofolio aplikasi. |
| Perbup/pedoman pendukung | 6 | Relevan sebagai kebijakan atau standar umum; tidak otomatis memenuhi item pelaksanaan. |
| **Total** | **38** | Tidak ada berkas primer untuk I3, I5–I8, I10–I11, I14–I16, dan I18. |

---

## Hasil per indikator dan keputusan

| Indikator | Bukti yang benar-benar ada / konteks | Putusan kesesuaian | Keputusan status dan tindakan wajib |
|---|---|---|---|
| **I1 Tata Kelola Pemdi** | Draf Peta Rencana 2025–2029, RPJMD/RPJMK, Renstra/Renja, RKA/DPA, SK/rapat Tim, laporan reviu, Perbup 48/2025. | **Sesuai terbatas.** Draf memang relevan untuk L1, RKA relevan untuk anggaran, dan Perbup arsitektur relevan. Namun draf belum disahkan; RPJMD/Renstra tidak otomatis membuktikan substansi RAN secara lengkap; tidak ada bukti pengisian SIAP Digital; klaim seluruh/100% pada L3 tidak didukung matriks cakupan; laporan reviu perlu naskah dinas/BA pengesahan. | Turunkan seluruh klaim `lengkap` L1–L4 menjadi **proses** kecuali setelah verifikasi dokumen sumber. Jangan klaim L2 sebelum tangkapan/dashboard SIAP Digital untuk sebagian layanan; jangan klaim L3 sebelum matriks seluruh substansi, seluruh layanan prioritas, dan persentase EGA/RKAD tersedia. L4 harus memuat tanggal, pelaksana, BA/notulen, temuan, rekomendasi, serta disposisi/tindak lanjut. |
| **I2 Manajemen Layanan Digital** | Perbup 126/2019 standar pelayanan, Pedoman Pengaduan RSUD, Renstra, berkas kompilasi L1/L2. | **Pendukung/sesuai terbatas.** Standar pelayanan dan pedoman keluhan satu RSUD bukan bukti pelaksanaan manajemen layanan digital pemerintah secara menyeluruh. Tidak tampak katalog layanan digital, owner, SLA terukur, SOP insiden/perubahan, monitoring, atau bukti pelaksanaan pada layanan yang disebut. | Ubah L1-1, L1-2, L2-1 ke **proses**. Susun register layanan digital, SOP manajemen layanan, bukti tiket/monitoring, dan matriks layanan mana yang tercakup. Jangan gunakan Perbup umum sebagai bukti tunggal pelaksanaan. |
| **I3 SDM Pemdi** | Tidak ada berkas primer. | **Belum ada.** Catatan yang menolak survei Literasi Digital 2023 sebagai pengganti penggunaan aplikasi/kompetensi sudah tepat. | Tetapkan `_l1_lengkap: false`. Minta BKPSDM: peta kompetensi, bukti MyASN, laporan penggunaan sistem kerja digital, komunitas belajar, microlearning, daftar peserta dan capaian. |
| **I4 Kolaborasi Pemdi** | SK Bupati 555/395/DISKOMINFO/2026; PDF rapat kolaborasi/undangan/notulen (image-only); rencana kolaborasi belum tersedia. | **Sesuai terbatas.** SK cukup kuat untuk L1-1 setelah otentikasi. Dokumen rapat dapat mendukung L1-3 bila undangan, daftar hadir, notulen, peserta lintas PD, dan agenda dapat dibaca. Akan tetapi L1-2 (rencana kolaborasi dalam substansi RAN/perencanaan) kosong. | SK dapat tetap **proses menuju lengkap** setelah cek tanda tangan/berlaku. L1 sebagai level tetap **belum lengkap** sampai rencana kolaborasi lintas PD dalam dokumen perencanaan tersedia. Jangan menilai L2+ sebelum bukti cakupan/persentase dan hasil kolaborasi tersedia. |
| **I5 Tata Kelola Data / ISDI** | Tidak ada hasil/nilai resmi ISDI. | **Belum ada**; indikator berbasis hasil eksternal tidak dapat diganti SK/Perbup. | `_l1_lengkap: false`; lampirkan hasil resmi ISDI sesuai periode evaluasi. |
| **I6 Informasi Geospasial / SJIG** | Tidak ada hasil/nilai resmi SJIG. | **Belum ada.** | `_l1_lengkap: false`; lampirkan hasil resmi SJIG. |
| **I7 Statistik / EPSS** | Tidak ada hasil/nilai resmi EPSS. | **Belum ada.** | `_l1_lengkap: false`; lampirkan hasil EPSS resmi, bukan SOP statistik saja. |
| **I8 Pelindungan Data Pribadi** | Tidak ada berkas primer yang ditautkan. | **Belum ada.** Kebijakan umum/Perbup SPBE tidak cukup untuk membuktikan tata kelola PDP, inventaris pemrosesan, penilaian risiko, dan penerapan. | Tetapkan `_l1_lengkap: false`; siapkan kebijakan PDP, register data/pemrosesan, penetapan peran, SOP hak subjek data, dan bukti penerapan. |
| **I9 Audit Keamanan** | SK Tim Asesor Internal Pemdi 2026. | **Sesuai terbatas.** SK membuktikan penetapan tim, bukan audit keamanan, ruang lingkup, metode, temuan, laporan, atau tindak lanjut audit. | Ubah status `lengkap` menjadi **proses** dan `_l1_lengkap: false` sampai laporan audit keamanan/Pentest atau audit yang dipersyaratkan, BA, temuan, dan rencana tindak lanjut tersedia. |
| **I10 Keamanan Siber / IKASANDI** | Tidak ada Indeks KAMI/hasil IKASANDI yang tersedia di folder saat audit. | **Belum ada.** | `_l1_lengkap: false`; unggah hasil resmi Indeks KAMI/IKASANDI beserta periode dan identitas instansi. |
| **I11 Kriptografi / IKASANDI** | Tidak ada berkas primer kebijakan/implementasi kriptografi yang tersedia. | **Belum ada.** | `_l1_lengkap: false`; lampirkan kebijakan persandian yang sah serta bukti penerapan layanan/sertifikat/rekam penggunaan sesuai kriteria level. |
| **I12 Penanganan Insiden Siber** | SK CSIRT Aceh Tengah 2026 dan SK Tim CSIRT 2024, keduanya image-only. | **Sesuai terbatas.** SK dapat membuktikan pembentukan organisasi jika sah, tetapi belum membuktikan kapabilitas penanganan: SOP, kanal pelaporan, latihan/insiden, tiket, koordinasi, SLA, dan hasil. | Ubah status `lengkap` menjadi **proses**; `_l1_lengkap: false` sampai SK dapat diverifikasi dan paket operasi CSIRT disertakan. |
| **I13 Aplikasi Pemdi** | BAST aplikasi Lepat, screenshot Bapokting dan Gemasih, Renstra, berkas L1–L3 image-only. | **Sesuai terbatas.** Screenshot/BAST membuktikan contoh aplikasi atau serah terima, bukan daftar/portofolio aplikasi, klasifikasi layanan, kepatuhan arsitektur, SDLC, atau pemantauan aplikasi yang diminta. | Ubah seluruh `lengkap` I13 ke **proses**; `_l1_lengkap: false`. Siapkan inventaris aplikasi, matriks aplikasi–layanan–owner–status–arsitektur, bukti SDLC/UAT/keamanan, dan laporan implementasi sesuai cakupan level. |
| **I14 Infrastruktur Pemdi** | Tidak ada bukti infrastruktur primer. | **Belum ada.** Arsitektur umum tidak menggantikan inventaris/kinerja infrastruktur. | `_l1_lengkap: false`; siapkan inventaris DC/cloud/jaringan, topologi, SLA, kapasitas, monitoring, DR/BCP, serta bukti layanan yang beroperasi. |
| **I15 Keterpaduan Proses Bisnis** | Perbup 48/2025 berpotensi sebagai dasar arsitektur. | **Pendukung saja.** Kriteria memerlukan proses bisnis as-is/to-be, keterpaduan lintas sektor, pengisian SIAP Digital, dan kemudian reviu/tindak lanjut; tidak ada artefak tersebut di folder. | Ubah status `lengkap` menjadi **proses** dan `_l1_lengkap: false`. Lampirkan peta proses/BPMN, matriks lintas sektor, bukti SIAP Digital dan berita acara reviu. |
| **I16 Integrasi Aplikasi** | Tidak ada bukti primer; dokumen portal L2 hanya mencantumkan judul “Laporan & Matriks Integrasi Aplikasi” tanpa substansi yang dapat diekstrak/divalidasi. | **Belum ada.** | `_l1_lengkap: false`; siapkan matriks integrasi, API/pertukaran data, hasil UAT/integration test, log pemantauan, dan laporan pelaksanaan sesuai cakupan level. |
| **I17 Portal Layanan Digital** | URL `acehtengahkab.go.id`, berkas portal/screenshot, Perbup 30/2022, berkas L2 berisi halaman/label tetapi belum substansi yang dapat diuji. | **L1 sesuai terbatas; L2 tidak cukup.** URL dapat membuktikan keberadaan portal pada hari pemeriksaan, tetapi perlu tangkapan ber-tanggal, katalog layanan yang benar-benar digital, dan penjelasan hubungan portal dengan instansi. Perbup adalah pendukung. Bukti L2 belum membuktikan rencana pemaduan atau siklus hidup sebagian layanan. | Turunkan L1-1/L1-2 dan L2-2 menjadi **proses** sampai ada capture ber-tanggal, daftar layanan+URL/transaksi, owner, dan bukti operasi. Tetapkan `_l1_lengkap: false` bila bukti portal tidak dapat diverifikasi visual/operasional. Jangan klaim portal nasional, pemanfaatan, atau UI standar nasional tanpa bukti masing-masing. |
| **I18 Interoperabilitas Data** | Tidak ada arsitektur data dari SIAP Digital atau hasil aspek interoperabilitas SDI. | **Belum ada.** | `_l1_lengkap: false`; lampirkan arsitektur data SIAP Digital dan hasil SDI yang menunjukkan rentang nilai level. |
| **I19 Fasilitas Dukungan Pengguna** | Daftar SLA 25 layanan (1 halaman/kompilasi), Perbup 21/2021, hasil survei XLSX. | **Tidak cukup untuk status lengkap.** Daftar SLA tidak memuat nomor dokumen, pengesahan, pemilik layanan, versi, indikator kepatuhan, atau tautan layanan; bahkan sejumlah nomenklatur perlu diverifikasi mutakhir. Daftar waktu layanan bukan bukti FDP/ticketing dan pemantauan SLA. | Ubah L1-1, L1-2, L2-1 menjadi **proses**; `_l1_lengkap: false`. Ganti/kuatkan dengan SLA resmi per layanan/proses, kanal bantuan, SOP eskalasi, log tiket, dashboard kepatuhan SLA, dan bukti cakupan sebagian layanan. |
| **I20 Pengelolaan Kepuasan Pengguna** | PDF SKM Online 2026 (kompilasi nilai IKM Jan–Mei), SKM Kecamatan Kebayakan 2025. | **Sesuai terbatas untuk konteks SKM, tidak cukup untuk item digital.** IKM umum dan satu laporan kecamatan tidak membuktikan kepuasan pengguna *layanan digital* melalui portal. Daftar 25 layanan bukan “jumlah transaksi selama satu tahun”; belum ada kelompok rentan, tindak lanjut, umpan balik, atau tim teknis. | Ubah L1-1, L1-2, L2-1 menjadi **proses**; `_l1_lengkap: false`. Lampirkan dashboard/ekspor sistem kepuasan digital, denominator dan transaksi 12 bulan, segmentasi kelompok rentan, laporan tindak lanjut, dan bukti publikasi. |

---

## Bukti yang perlu diganti atau diperbarui segera

| Berkas / jenis bukti | Masalah | Keputusan |
|---|---|---|
| `final/I1_L1_Final.pdf` | Berstatus **DRAFT**, kolom paraf/tanda tangan masih placeholder. | Boleh sebagai bukti penyusunan L1 bila dilengkapi undangan, notulen, daftar hadir, dan pengantar; **bukan** bukti dokumen perencanaan final. Finalisasi/penetapan perlu dilakukan sebelum klaim lebih tinggi. |
| `final/I1_L2_Final.pdf` dan `I1_L31_Perencanaan-Full_2026.pdf` | Dokumen RPJMD/RPJMK sama dipakai untuk “sebagian” dan “seluruh”; belum ada matriks substansi RAN dan bukti SIAP Digital. | Pertahankan sebagai lampiran pendukung, tambah matriks silang halaman/substansi RAN dan bukti SIAP Digital. Hapus klaim “seluruh/100%” bila belum dapat dibuktikan. |
| `final/I1_L33_Konsolidasi-Tim-Full_2026.pdf` | Klaim 100% menggunakan paket rapat yang sama dengan L2; PDF image-only. | Gunakan untuk L2 setelah cek visual. Untuk L3 perlu rekap cakupan seluruh unit/substansi dan BA hasil konsolidasi. |
| `final/I1_L4_Final.pdf` | Laporan reviu memuat narasi/temuan, tetapi perlu kejelasan pelaksana, nomor, tanggal, pengesahan, daftar hadir/BA dan tindak lanjut. | Revisi menjadi naskah dinas/BA reviu yang sah; status proses. |
| `final/I2_L1_Final.pdf`, `I2_L2_Final.pdf` | Kebijakan/kompilasi tidak menunjukkan manajemen layanan digital yang dilaksanakan dan cakupannya. | Ganti/tambah register layanan, SOP operasional, tiket, laporan SLA dan monitoring. |
| `final/I13_L1_Final.pdf`, `I13_L2_Final.pdf`, `I13_L3_Final.pdf` | Mayoritas image-only; screenshot dan BAST bukan bukti manajemen portofolio aplikasi. | Jadikan lampiran contoh; bukti utama harus inventaris, matriks, laporan pelaksanaan dan bukti pengujian. |
| `final/I17_L2_Final.pdf` dan `Keterpaduan_I17_02_PortalLayanan_2026.pdf` | Isi yang dapat diekstrak hanya judul/halaman, tidak menunjukkan rencana, siklus hidup, integrasi nasional, atau metrik pemanfaatan. | Perbarui dengan capture portal ber-URL/tanggal, katalog layanan, analitik/log, rencana pemaduan, dan evidence operasi. |
| `final/I19_L1_SLA-Layanan-Digital_2026.pdf` | Daftar SLA tanpa pengesahan/pemantauan; sebagian istilah layanan harus dicek kesesuaiannya dengan layanan aktual. | Ganti dengan SLA yang ditetapkan pemilik layanan dan dashboard/log kepatuhan/tiket. |
| `final/I20_L1_SKM-Online_2026.pdf` | Nilai IKM bulanan tidak otomatis merupakan kepuasan layanan digital; tidak ada transaksi 12 bulan/tindak lanjut/kelompok rentan. | Perbarui dengan ekspor dashboard layanan digital dan laporan analisis-tindak lanjut yang dapat diaudit. |
| Perbup 48, Perbup 126, Perbup 21, Renstra, RKA/DPA | Dokumen resmi/potensial resmi tetapi sebagian dipakai melampaui substansinya. | **Tetap simpan sebagai pendukung**, petakan hanya ke klaim yang benar-benar dimuat di halaman/ketentuan terkait. |
| SK Tim Pemdi, SK Asesor, SK CSIRT | SK membuktikan pembentukan/penetapan, bukan otomatis pelaksanaan atau hasil. | Pertahankan untuk item penetapan; tambahkan bukti operasi, laporan, BA, dan tindak lanjut. |

---

## Urutan perbaikan yang disarankan

1. **Koreksi data dan tampilan lebih dahulu.** Jangan tampilkan angka “lengkap” atau nilai indeks yang berasal dari entri di atas sampai verifikasi selesai. Hitung ulang `_l1_lengkap` menggunakan seluruh item L1 utama dan status audit.
2. **Pisahkan bukti utama dari pendukung.** Perbup, Renstra, RKA, dan SK dapat tetap diberi label `pendukung`; bukti utama harus menjawab persis nama item pada level modul.
3. **Bangun register verifikasi per bukti**: ID bukti, indikator/item level, berkas/URL, halaman atau screen, tanggal/periode, penerbit/penandatangan, cakupan, hasil audit, kekurangan, PIC, dan status. Ini mencegah satu dokumen diklaim untuk banyak level tanpa dasar.
4. **Selesaikan L1 per indikator sebelum mengumpulkan L2–L5.** Ketentuan berjenjang membuat klaim level lebih tinggi tidak dapat dipakai ketika satu item utama L1 masih kosong.
5. **Utamakan kekosongan berisiko tinggi:** I3, I8–I12, I14–I16, I18–I20; kemudian validasi I1, I2, I4, I13, I17 yang sudah memiliki bahan awal.
6. **Gunakan bukti operasional dan terukur.** Sertakan URL/screenshot bertanggal, ekspor log/dashboard, BA/notulen/daftar hadir, matriks cakupan, dokumen pengesahan, laporan hasil, rekomendasi, dan bukti tindak lanjut—sesuai item level.

## Keputusan akhir

- **Tidak ada bukti perlu dihapus hanya karena audit ini.** Banyak berkas masih bermanfaat sebagai kebijakan, konteks, atau bahan penyusunan.
- **Bukti perlu diperbarui/diganti sebagai bukti utama** apabila hanya berupa draf tanpa pengesahan, daftar/kompilasi tanpa sumber, screenshot tanpa URL/tanggal, atau kebijakan umum tanpa bukti pelaksanaan.
- **Bukti yang tidak relevan untuk klaim level** harus dipindahkan menjadi `pendukung` atau tidak dipetakan pada item tersebut; terutama kebijakan umum yang dipakai untuk membuktikan implementasi, hasil, cakupan 100%, audit, maupun tindak lanjut.
- Sebelum unggah ke `eval.spbe.go.id`, lakukan **verifikasi visual dan administratif oleh PIC/pejabat penerbit** untuk seluruh PDF pindai serta validasi kondisi portal/dasbor yang bersifat dinamis.
