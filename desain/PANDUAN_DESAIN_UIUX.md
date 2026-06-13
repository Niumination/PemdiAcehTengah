# Panduan UI/UX — Pemdi Aceh Tengah
### Resmi · Informatif · Sederhana untuk dipahami banyak orang

Tujuan: menyajikan informasi yang **sangat padat dan penuh istilah teknis** (SPBE, Pemdi, Permenpan, indeks)
agar **mudah dimengerti warga awam**, tanpa menghilangkan kelengkapan untuk ASN/auditor.

> Lihat pratinjau visual: `desain/prototype-beranda.html` (buka di preview workspace).

---

## A. PRINSIP UTAMA (4)

1. **Progressive disclosure (ungkap bertahap).**
   Tampilkan ringkasan dulu; sembunyikan detail di accordion/tab/"Lihat selengkapnya".
   Layar tidak boleh membanjiri pembaca. Detail tetap ada, tapi atas permintaan.

2. **Plain language first (bahasa manusia dulu, istilah resmi kemudian).**
   Setiap konsep teknis dibuka dengan 1 kalimat sederhana ("Singkatnya: …"), baru sebut istilah & nomor regulasi.
   Sediakan kotak penjelas "❓ Apa itu …?" pada tiap istilah kunci (SPBE, Pemdi, Proses Bisnis, IKM).

3. **Hirarki visual yang tegas.**
   Eyebrow (label kecil) → Judul → 1 kalimat sub → konten. Satu ide besar per bagian.
   Spasi lega (white space) = bukan ruang kosong, tapi alat agar mata tidak lelah.

4. **Orientasi tugas (task-oriented), bukan orientasi dokumen.**
   Warga datang untuk *melakukan sesuatu* ("urus KTP", "lapor", "isi survei").
   Bagian "Apa yang ingin Anda lakukan hari ini?" diletakkan paling atas.

---

## B. KESAN RESMI PEMERINTAHAN

- **Strip resmi** di paling atas: "Situs Resmi Pemerintah Kabupaten Aceh Tengah" + bendera kecil.
- **Lambang/crest** konsisten (sudah ada "AT"). Idealnya pakai lambang daerah resmi.
- Warna inti **biru pemerintahan `#004098`** (sudah dipakai — pertahankan) + aksen merah `#c8102e` & emas `#b8860b` secukupnya untuk penekanan, bukan dekorasi.
- Tipografi **Inter** (sudah ada) — bersih, formal, mudah dibaca.
- Bahasa formal-ramah (bukan kaku, bukan gaul). Hindari emoji berlebihan pada konteks data resmi; gunakan ikon fungsional.

---

## C. POLA KOMPONEN (untuk meredam kepadatan)

| Masalah konten | Pola UI | Catatan |
|---|---|---|
| Banyak istilah teknis | **Kotak penjelas "❓ Apa itu…"** + glosarium | 1 kalimat awam dulu |
| Nilai indeks (angka) | **Gauge/lingkaran + bar per-domain + warna level** | "Cara baca" eksplisit |
| Daftar panjang (34 urusan, 52 OPD) | **Accordion / tab / tabel dengan cari & filter** | jangan tampil semua sekaligus |
| Banyak section di 1 halaman | **Navigasi lompat (anchor) + "kembali ke atas"** | + progress/aktif state |
| Alur/tahapan | **Stepper bernomor** dengan status (sedang/berikutnya) | |
| Data status | **Badge berwarna** (Baik/Cukup/Perlu perbaikan) | konsisten makna warna |

### Sistem warna status (konsisten di seluruh situs)
- 🟢 **Hijau** = Baik / sudah memenuhi target (≥ Level 3)
- 🟡 **Kuning** = Cukup / mendekati target
- 🔴 **Merah** = Perlu perbaikan / prioritas

Selalu sertakan **teks** di samping warna (jangan andalkan warna saja — aksesibilitas buta warna).

---

## D. URUTAN HALAMAN BERANDA (rekomendasi)

1. Strip resmi + header (sticky) + tombol **Cari Layanan**
2. **Hero**: 1 kalimat manfaat untuk warga + 2 tombol aksi + kotak "❓ Apa itu Pemdi?"
3. **Statistik kunci** (5 angka) — konteks cepat
4. **"Apa yang ingin Anda lakukan?"** (Layanan, Survei, Lapor) — taruh lebih dulu daripada teori
5. **Indeks SPBE** (gauge + domain) dengan "cara baca"
6. **Peta Proses Bisnis** (accordion) — detail teknis disembunyikan
7. **Perangkat Daerah** (tabel + cari/filter)
8. **Rekomendasi / Roadmap** (stepper)
9. **Tentang & Kontak** + footer resmi

> Prinsip: **warga awam dilayani di atas, detail teknis/ASN di bawah atau dalam panel.**

---

## E. AKSESIBILITAS (wajib untuk situs pemerintah)

- Kontras teks ≥ 4.5:1 (cek warna kuning/abu pada teks kecil).
- Semua interaktif bisa diakses keyboard; `:focus-visible` jelas.
- `<details>`/accordion native = aksesibel; jika custom, pakai `aria-expanded`.
- Skip-link (sudah ada ✓), heading berurutan (h1→h2→h3), `alt` pada gambar.
- Ukuran font dasar ≥ 16px; target sentuh ≥ 44px.
- Dukungan `prefers-reduced-motion` (kurangi animasi).

---

## F. RESPONSIF & PERFORMA

- Mobile-first (banyak warga akses via HP). Nav jadi menu hamburger.
- Grid runtuh ke 1–2 kolom di layar kecil.
- Lazy-load tabel besar (52 OPD) & komponen berat.
- Pertahankan font `display=swap` (sudah ada).

---

## G. MICROCOPY (contoh perbaikan bahasa)

| Sebelum (teknis) | Sesudah (awam dulu) |
|---|---|
| "Indeks SPBE 2025: 2.59" | "Nilai layanan digital kita: **2,59 dari 5** (Cukup). Target minimal 3." |
| "Mapping proses bisnis SPBE level 2" | "Bagaimana proses kerja pemerintah dipetakan — dari perencanaan sampai pengawasan." |
| "Domain Manajemen SPBE 1.00" | "Pengelolaan sistem digital: **perlu perbaikan** (1,00)." |
| "Isi Survei →" | "Beri nilai pelayanan (2 menit, anonim) →" |

---

## H. YANG DIPERTAHANKAN (sudah baik)
Token desain (`--primary #004098`, skala spasi, radius, shadow), font Inter, skip-link, struktur konten lengkap. Redesain ini **membangun di atas fondasi itu**, bukan membongkar total — jadi implementasi relatif aman & cepat.
