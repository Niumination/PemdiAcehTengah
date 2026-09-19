# Rencana Tahap Lanjut — Mobile UX Portal Pemdi Aceh Tengah

**Status:** RENCANA (belum dieksekusi) · disusun 19 Sep 2026
**Konteks:** Audit UI/UX live 19 Sep 2026 (11 rute × 3 viewport, browser camofox) menemukan
bahwa **`/layanan` adalah satu-satunya halaman yang benar-benar tidak mobile-friendly**, dan itu
sudah diperbaiki (commit `adf6334`, `dc94682`). Halaman lain berfungsi, tetapi belum menyajikan
tampilan mobile yang **ringkas meski padat informasi** — itu isi rencana ini.

---

## 1. Kondisi terukur saat ini (produksi, viewport 390px)

| Halaman | Tinggi | Setara layar | Berat HTML | Catatan |
|---------|-------:|-------------:|-----------:|---------|
| `/` beranda | 15.924 px | ~19 layar | 135 KB ✅ | 112 emoji · 3 kotak input · 2 pita berjalan |
| `/probis` | 18.205 px | ~22 layar | 114 KB | daftar panjang tanpa pelipatan |
| `/requirement` | 17.490 px | ~21 layar | 115 KB | **181 emoji** |
| `/pemdi` | 8.345 px ✅ | ~10 layar | **574 KB** | `__NEXT_DATA__` 386 KB |
| `/modul-indikator` | 8.151 px ✅ | ~10 layar | **490 KB** | `__NEXT_DATA__` 386 KB |
| `/layanan` | 7.920 px ✅ | ~9 layar | 81 KB | selesai diperbaiki |
| Footer (semua halaman) | 1.631 px | **20% halaman** | — | 3 kolom tautan + legal + SP4N |

Angka di atas adalah hasil ukur, bukan perkiraan; cara mengukurnya ada di skill
`pemdi-uiux-refinement` (bagian "Audit LIVE via camofox").

---

## 2. Prinsip yang dipakai

1. **Ringkas, bukan menghilangkan.** Konten dipangkas tampilannya (clamp/lipat), tetap bisa dibuka
   penuh — pola yang sudah terbukti di `/layanan` (clamp 2 baris, dilepas saat kartu dibuka).
2. **Kepadatan > panjang.** Target: setiap layar berisi informasi berguna, tanpa gulir berlebihan.
3. **Jangan ubah desktop.** Semua intervensi dibatasi `@media (max-width: 768px)`.
4. **Ukur sebelum dan sesudah.** Setiap item wajib punya angka pembanding (tinggi halaman,
   lebar kolom, jumlah elemen) dan tangkapan layar.

---

## 3. Item pekerjaan (belum dieksekusi)

### T2-1 · Section "Kategori Layanan" di `/layanan` — 941 px
Daftar kategori besar di bawah hasil (941 px) menduplikasi baris filter yang sudah ada di atas.
**Usul:** tampilkan sebagai lipatan (`<details>`) atau hapus di mobile karena filter sudah tersedia
dan melekat (sticky). **Dampak:** −800 px (≈1 layar). **Risiko:** rendah.

### T2-2 · Footer dipadatkan di mobile — 1.631 px (20% halaman, berlaku semua halaman)
Tiga kolom tautan + legal + banner SP4N tersusun vertikal.
**Usul:** di mobile jadikan `<details>` per kolom ("Navigasi", "Regulasi", "Kontak") dengan
ringkasan satu baris; sisakan baris legal. **Dampak:** −1.000 px di setiap halaman (~1 layar).
**Risiko:** rendah–sedang (footer dipakai semua halaman → uji 3 halaman).

### T2-3 · Beranda: tata letak ringkas — 19 layar
Isi beranda padat: hero, 5 kartu statistik, direktori, PPB, SKM, tabel OPD.
**Usul:** (a) kartu statistik 2×2 di mobile (pola `.layanan-stats` yang sudah terbukti);
(b) setiap blok besar diberi ringkasan + "lihat selengkapnya"; (c) hero dipendekkan di mobile
(judul + 2 CTA + pencarian, tanpa kartu tambahan). **Dampak:** 19 → ~10 layar. **Risiko:** sedang.

### T2-4 · `/probis` (22 layar) & `/requirement` (21 layar)
Keduanya daftar panjang 8 misi / 12 kategori.
**Usul:** lipatan per misi/kategori (`<details>`), item pertama terbuka.
**Dampak:** ~22 → ~5 layar. **Risiko:** rendah (pola lipatan sudah dipakai di `/pemdi`).

### T2-5 · Payload `/pemdi` dan `/modul-indikator` (574 KB / 490 KB)
`__NEXT_DATA__` masing-masing 386 KB karena seluruh JSON ikut untuk hidrasi.
**Usul (butuh keputusan arsitektur):** kirim hanya field yang dipakai komponen klien, atau ambil
data di klien untuk bagian yang interaktif. **Dampak:** potensi −300 KB/halaman.
**Risiko:** **tinggi** — menyentuh jalur data halaman utama; wajib bertahap + uji regresi.
**Catatan:** beranda sudah beres (233 → 135 KB) dengan pola perampingan field.

### T2-6 · Sapuan emoji
`/requirement` 181, beranda 112, `/glosarium` 50, `/spbe` 47.
**Usul:** pertahankan emoji sebagai ikon fungsional (navigasi, status), hapus dari judul bagian dan
teks kalimat. **Risiko:** rendah, tapi ini keputusan desain — perlu contoh 1 halaman dulu (usul:
`/requirement`) sebagai acuan, disetujui, baru disapu ke halaman lain.

### T2-7 · Widget mengambang menumpuk di mobile
Saat ini di satu layar bisa muncul: toast survei SKM + tombol rating ⭐ + panah naik + FAB lapor.
**Usul:** koordinasikan — tampilkan maksimum dua; tunda toast SKM bila widget lain aktif; kecilkan
area sentuh visual tanpa mengubah ukuran target sentuh (tetap ≥44 px).
**Risiko:** rendah–sedang (komponen global).

### T2-8 · Verifikasi kontras yang belum terukur
Kontras di atas latar **gradient** (sidebar, `gov-strip`, hero) tidak bisa dihitung probe.
**Usul:** pemeriksaan manual per komponen (mata + alat) pada tema terang dan gelap, 1 daftar temuan,
lalu perbaikan token. **Risiko:** rendah.

### T2-9 · Navigasi bawah (opsional, perlu keputusan pemilik)
Portal memakai sidebar off-canvas di mobile. Pola lazim pemda: bilah navigasi bawah tetap
(Beranda · Layanan · Lapor · Cari). **Dampak:** akses 1 ketuk ke jalur utama.
**Risiko:** sedang (menyentuh AppShell) — hanya dijalankan bila pemilik menyetujui arahnya.

---

## 4. Urutan eksekusi yang diusulkan

| Tahap | Item | Alasan urutan |
|-------|------|---------------|
| 1 | T2-1, T2-4 | Dampak besar, risiko rendah, pola sudah terbukti |
| 2 | T2-2 | Berlaku untuk semua halaman sekaligus |
| 3 | T2-3 | Beranda adalah pintu masuk warga |
| 4 | T2-6, T2-7 | Kerapian & kenyamanan setelah struktur beres |
| 5 | T2-8 | Penutup kualitas |
| 6 | T2-5, T2-9 | Butuh keputusan pemilik dan uji regresi lebih berat |

## 5. Kriteria selesai (per item)

1. Ukur ulang di produksi: tinggi halaman, lebar kolom, jumlah kontrol < 44 px = 0.
2. Perbandingan sebelum/sesudah berupa angka + tangkapan layar.
3. Desktop tidak berubah (ukur pada 1440 px).
4. `npm run build` sukses, `next lint` 0 error, `npm test` 20/20.
5. DOX (`AGENTS.md` + `styles/AGENTS.md`) diperbarui pada commit yang sama.

## 6. Yang TIDAK termasuk rencana ini

- Redesain visual/palet — identitas warna navy/beige/gold dipertahankan.
- Perubahan konten/angka indikator.
- Perubahan backend/API (kecuali T2-5 yang menyentuh cara data dikirim ke klien).
