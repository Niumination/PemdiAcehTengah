# Audit UI/UX Menyeluruh Portal Pemdi Aceh Tengah

**Tanggal:** 10 Agustus 2026  
**Tujuan desain:** portal pemerintahan yang sederhana dan modern di permukaan, tetap mampu menangani informasi padat, mudah ditemukan, jelas konteksnya, dan nyaman dipakai pada layar kecil maupun desktop.

## Prinsip keputusan

1. **Satu tugas utama per tampilan.** Informasi rinci dibuka bertahap melalui filter, accordion, panel detail, atau tautan konteks—bukan seluruh teks sekaligus.
2. **Navigasi dan pencarian selalu tersedia.** Pengguna tidak perlu kembali ke beranda untuk mencari layanan, OPD, regulasi, atau indikator.
3. **Ringkas di luar, rinci di dalam.** Kartu menampilkan status/angka/aksi; dokumen, tabel panjang, dan penjelasan teknis dibuka sesuai kebutuhan.
4. **Tidak memakai iframe untuk menduplikasi halaman portal sendiri.** Iframe halaman internal membuat navigasi ganda, masalah fokus/scroll, URL yang tidak dapat dibagikan, serta membebani perangkat. Untuk informasi internal yang relatif sama, gunakan ringkasan dan tautan konteks atau komponen data bersama. Iframe hanya layak untuk sumber eksternal yang memang perlu dipratinjau (misalnya PDF) dan harus diberi judul, fallback tautan, serta batas tinggi yang responsif.
5. **Aksesibilitas dan mobile bukan tahap akhir.** Target sentuh minimum 44px di perangkat kecil, fokus keyboard terlihat, struktur heading konsisten, tabel dapat di-scroll, dan animasi menghormati `prefers-reduced-motion`.

## Temuan prioritas

| Prioritas | Temuan | Dampak pengguna | Keputusan perbaikan |
|---|---|---|---|
| P0 | Sidebar desktop sebelumnya tersembunyi secara default, sementara halaman memiliki banyak rute. | Pengguna tidak melihat peta portal dan cenderung tersesat. | Sidebar ditampilkan default pada desktop; tetap dapat diringkas manual. |
| P0 | Shortcut `⌘/Ctrl + K` sudah ditulis di sidebar tetapi belum menjalankan aksi. | Ekspektasi pengguna keyboard tidak terpenuhi. | Diaktifkan menuju pencarian global `/cari`. |
| P0 | Pencarian global tidak mudah dijangkau dari halaman selain sidebar. | Penemuan informasi rendah pada halaman panjang/padat. | Tombol Cari ditempatkan pada topbar seluruh halaman. |
| P1 | Halaman data padat (`/pemdi`, `/modul-indikator`, `/spbe`, `/probis`, `/requirement`, `/opd`) berisiko membuat pengguna membaca terlalu banyak sebelum bertindak. | Beban kognitif tinggi dan sulit membedakan ringkasan vs rincian. | Terapkan pola ringkasan → filter → detail bertahap; gunakan status, jumlah, dan CTA yang konsisten. |
| P1 | Informasi terkait tersebar lintas halaman, terutama Pemdi ↔ Modul Indikator ↔ Requirement ↔ SPBE ↔ ProBis. | Banyak perpindahan halaman untuk membandingkan konteks. | Gunakan panel “Informasi terkait” berbasis data dan deep-link (`?modul=…`, filter/anchor), bukan duplikasi/iframe halaman. |
| P1 | Topbar pada perangkat kecil berpotensi penuh oleh breadcrumb dan aksi. | Navigasi cepat sulit disentuh/dibaca. | Breadcrumb mobile hanya menampilkan halaman aktif; label aksi dipadatkan menjadi ikon dengan `aria-label`. |
| P2 | Beberapa pola visual global sangat aktif (marquee, reveal, hover kartu). | Berisiko terasa ramai pada portal yang sudah padat informasi. | Batasi gerak pada elemen dekoratif, prioritaskan hierarki dan whitespace; semua gerak harus opsional/reduced-motion. |
| P2 | Iframe PDF sudah digunakan pada preview. | PDF perlu dibaca tanpa kehilangan konteks, tetapi harus aman/responsif. | Pertahankan hanya untuk preview dokumen yang memang diperlukan; sediakan “Buka file asli” sebagai fallback. |

## Arsitektur informasi dan integrasi yang dianjurkan

### Jalur warga

`Beranda → Direktori Layanan → Detail/tautan layanan → Pengaduan atau SKM → Bantuan/FAQ`

- Beranda harus memprioritaskan pencarian layanan dan tiga aksi utama: cari layanan, lapor, isi survei.
- `/layanan` menjadi sumber daftar layanan; halaman lain cukup menaut ke kategori/layanan relevan, jangan menyalin katalog ke banyak halaman.
- `/lapor`, `/skm`, `/faq`, dan `/bantuan` perlu saling memberi CTA kontekstual: pengguna yang tidak menemukan jawaban dapat lapor; pengguna setelah layanan dapat memberi kepuasan.

### Jalur transparansi dan transformasi digital

`Pemdi → Modul Indikator → Requirement/Dokumen → Bukti → kembali ke indikator`

- `/pemdi`: ringkasan 7 aspek dan status indikator; detail indikator membuka deep-link ke `/modul-indikator?modul=N`.
- `/modul-indikator`: kriteria dan bukti. Tambahkan ringkasan indikator terkait dari Pemdi/Requirement sebagai kartu/tautan, bukan iframe.
- `/requirement`: tampilkan referensi balik ke indikator/modul bila tersedia.
- `/spbe` dan `/probis`: beri CTA terkait ke indikator Pemdi yang relevan (I1/I13–I18), dengan satu kalimat alasan hubungan.

### Jalur organisasi

`OPD → layanan OPD → proses bisnis OPD → kanal layanan/pengaduan`

- Halaman detail OPD perlu blok tautan berurutan, bukan sekadar daftar panjang: layanan yang dikelola, proses bisnis, PIC/kontak, dan aksi bantuan.

## Peta pekerjaan implementasi

### Fase 1 — Fondasi lintas halaman (dikerjakan pada perubahan awal ini)

- [x] Sidebar desktop tampil sebagai navigasi awal dan tetap bisa diringkas.
- [x] Tombol pencarian global ada di topbar setiap halaman.
- [x] `⌘/Ctrl + K` menjalankan navigasi ke pencarian global.
- [x] Topbar mobile dipadatkan: breadcrumb disingkat dan label aksi disembunyikan secara visual tetapi tetap punya label aksesibel.
- [ ] Audit kontras elemen inline/hardcode per halaman.
- [ ] Audit urutan heading, label form, dan navigasi keyboard per halaman.

### Fase 2 — Pola informasi padat

- [ ] Standarkan komponen: `PageHeader`, status ringkas, filter bar, tabel responsif, empty state, panel detail, dan blok “Informasi terkait”.
- [ ] Ubah halaman paling padat terlebih dahulu: `/pemdi`, `/modul-indikator`, `/requirement`, `/spbe`, `/probis`.
- [ ] Pastikan tabel memiliki header lengket/pengguliran horizontal yang jelas pada mobile bila kolom tidak dapat dipadatkan.
- [ ] Pastikan nilai “lengkap”, bukti, dan indeks hanya memakai data yang sudah diaudit.

### Fase 3 — Integrasi antar halaman

- [ ] Tambahkan deep-link/filter yang dapat dibagikan antara Pemdi, Modul Indikator, Requirements, SPBE, dan ProBis.
- [ ] Tambahkan kartu ringkasan terkait berbasis data bersama; tidak membuat salinan informasi yang berpotensi tidak sinkron.
- [ ] Tambahkan embed PDF hanya di modal preview/dokumen pendukung dengan fallback tautan baru.

### Fase 4 — Validasi nyata

- [ ] Uji rute publik pada desktop 1440px, tablet 768px, dan mobile 360px.
- [ ] Uji keyboard: Tab/Shift+Tab, fokus modal, Escape, dan shortcut pencarian.
- [ ] Uji pembaca layar untuk landmark, menu, breadcrumb, form, dan modal.
- [ ] Uji performa: tidak ada animasi layout berat atau duplikasi halaman dalam iframe.
- [ ] Jalankan build produksi dan periksa seluruh tautan internal/eksternal penting.

## Perubahan awal yang telah diterapkan

- `components/AppShell.js`
  - sidebar desktop tidak lagi tersembunyi ketika pertama membuka portal;
  - pencarian global tersedia pada topbar;
  - shortcut `⌘/Ctrl + K` berfungsi menuju `/cari`;
  - aksi topbar mempunyai label aksesibel di layar kecil.
- `styles/globals.css`
  - topbar mobile dipadatkan tanpa menyembunyikan fungsi inti;
  - breadcrumb nonaktif disembunyikan pada mobile agar judul halaman tetap terbaca.

## Catatan iframe

Permintaan iframe akan diterapkan secara selektif setelah sumbernya ditentukan. **Tidak akan menyematkan seluruh halaman internal ke dalam iframe** karena itu menurunkan pengalaman pengguna dan aksesibilitas. Kandidat yang tepat hanyalah:

1. preview PDF/dokumen resmi pada modal, dengan link asli;
2. dashboard eksternal yang mengizinkan embedding dan relevan langsung;
3. bukan halaman portal internal yang dapat diakses lebih baik melalui deep-link atau panel ringkasan.
