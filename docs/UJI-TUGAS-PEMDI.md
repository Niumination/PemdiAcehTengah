# Uji Tugas Pengguna — Ruang Kendali Pemdi (Patch 16, disusun 25 Sep 2026)

Tujuan: memastikan situs berfungsi sebagai **alat kerja**, bukan pajangan. Ukurannya bukan "bagus/tidak", melainkan **apakah orang yang tepat menyelesaikan tugasnya sendiri, cepat, tanpa salah**. Hasil uji ini menjadi pembanding skor heuristik (`audit/AUDIT-UIUX-KONTEN-25-SEP.md` §7) dan menentukan isi Tahap C–E.

## 1. Peserta (3 persona, 1–2 orang tiap persona)
| Persona | Siapa | Perangkat yang dipakai saat uji |
|---|---|---|
| **Koordinator** | Staf Diskominfo (Bid. Layanan E-Government) yang mengelola bukti & catatan mandiri | Laptop (peramban sehari-hari) **dan** ponsel pribadi |
| **PJ OPD** | Operator/Kasubbag di 2 OPD berbeda — satu dengan beban tinggi (Setda/BKPSDM), satu ringan (Dinsos/PUPR) | Ponsel pribadi dulu, baru laptop |
| **Pimpinan** | Sekda/Asisten/Kadis Kominfo — pembaca 2 menit sebelum rapat | Ponsel |

Peserta **tidak** diberi penjelasan situs sebelumnya. Fasilitator hanya membacakan tugas.

## 2. Tugas (5, dibacakan apa adanya; peserta boleh menyerah)
| # | Tugas (bacakan) | Jawaban benar (untuk fasilitator) | Halaman ideal |
|---|---|---|---|
| T1 | "Cari status butir **I19-L1-01** dan apa catatan asesor untuknya." | Revisi · Diskominfo · catatan dari `catatan_mandiri` | Palet cari / `/pemdi#I19` |
| T2 | "Sebagai PJ **{OPD peserta}**: dokumen apa saja yang harus Anda siapkan minggu ini, dan mana yang paling mendesak?" | Daftar butir P0 OPD tsb di `/requirement` atau `/opd/[slug]` | `/opd/[slug]` |
| T3 | "Berapa nilai Pemdi kita sekarang, berapa targetnya, dan **mengapa** angkanya segitu?" | 1,24 (asesor KemenPANRB) · target 2,50 · penjelasan Level 1 + aspek terendah | `/dashboard` → `/asesor` |
| T4 | "OPD mana yang paling banyak tunggakan bukti? Kirimkan tautannya ke saya lewat WhatsApp." | Diskominfo (47) — tautan yang dibuka penerima harus menunjukkan hal yang sama | `/opd` (URL = state) |
| T5 | "Buat ringkasan 1 halaman untuk rapat Sekda besok." | Cetak/PDF dari dashboard atau `/asesor` | Tombol Cetak |

## 3. Prosedur (≈15 menit/peserta)
1. Izin lisan: "Kami menguji situsnya, bukan Anda. Boleh berhenti kapan saja. Layar direkam/dicatat."
2. Minta peserta **berpikir keras** (ucapkan apa yang dicari dan apa yang dilihat).
3. Bacakan T1–T5 berurutan. Jangan membantu; boleh bertanya balik "Menurut Anda di mana?".
4. Catat per tugas: **selesai / selesai dengan bantuan / gagal**, **waktu (detik)**, **salah-klik** (klik yang tidak menuju jawaban), **kutipan** peserta (kebingungan, keluhan, pujian).
5. Setelah T5: 3 pertanyaan — "Apa yang paling membingungkan?", "Apa yang akan Anda pakai tiap minggu?", "Apa yang tidak perlu ada?".

## 4. Lembar catat (salin per peserta)
```
Peserta: ____ (persona: ____)  Perangkat: ____  Tanggal: ____
| Tugas | Hasil (S/SB/G) | Detik | Salah-klik | Kutipan |
| T1 | | | | |
| T2 | | | | |
| T3 | | | | |
| T4 | | | | |
| T5 | | | | |
Paling membingungkan: 
Akan dipakai tiap minggu: 
Tidak perlu ada: 
```

## 5. Ambang keberhasilan & tindak lanjut
- Target: tiap tugas **≥ 4 dari 5 peserta selesai tanpa bantuan dalam < 120 detik** dan ≤ 2 salah-klik.
- Tugas yang gagal oleh ≥ 2 peserta = **cacat P0 UX** → masuk patch berikutnya sebelum perbaikan kosmetik apa pun.
- Jawaban "tidak perlu ada" yang disebut ≥ 2 peserta = kandidat panel yang dihapus (audit konten §4 dokumen audit).
- Rekap ditulis ke `docs/HASIL-UJI-TUGAS-<tanggal>.md`: tabel hasil, 5 temuan teratas, keputusan.

## 6. Etika & data
Tidak merekam wajah; tangkapan layar boleh. Nama peserta tidak dimuat di repo — cukup persona dan OPD.
