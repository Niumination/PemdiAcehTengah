# Inventaris konten yang ditampilkan

Dihasilkan oleh `npm run inventaris` (scripts/inventaris-konten.mjs). Jangan sunting tabel rute secara manual; sunting blok JTBD di bawah.

Prinsip audit konten: situs ini alat kerja (ruang kendali), bukan pajangan. Setiap panel harus menjawab **tugas siapa**, **dari data mana**, **aksinya apa**. Panel tanpa jawaban = kandidat dihapus/digabung.

## Rute → panel → sumber data

| Rute | Render | Sumber data | Panel (id · judul · ponsel) | Tautan aksi |
|---|---|---|---|---|
| `/404` | klien | — | — | — |
| `/admin` | ISR | lib/rkData<br>lib/ruangKendali<br>lib/overlay | h2: Masuk CMS<br>h2: Konten tampilan dashboard<br>h2: Log audit<br>h2: CMS Ruang Kendali<br>h2: Butir bercatatan mandiri | — |
| `/antrean` | ISR | lib/useUrlState<br>lib/rkData | h2: Antrean sampai | — |
| `/asesor` | ISR | data/evaluasi-asesor-2026.json<br>lib/rkData<br>lib/ruangKendali | `as-aspek` Skor per aspek — asesor vs simulasi butir<br>`as-verif` Peta verifikasi 20 indikator<br>`as-tabel` Catatan & rekomendasi tindak lanjut asesor per indikator · lipat<br>`as-interview` Catatan interviu · lipat | /antrean |
| `/cari` | SSG | lib/search-index | h2: Pencarian<br>h2: Contoh pencarian | — |
| `/dashboard` | ISR | data/opd.json<br>data/pemdi.json<br>lib/rkData<br>lib/pjButir | `kompas` Kompas Pemdi — 7 aspek · 20 indikator · 5 level<br>`antrean` Antrean prioritas tinggi<br>`asesor` Asesor vs simulasi per aspek · lipat<br>`beban` Beban per penanggung jawab · lipat<br>`linimasa` Linimasa evaluasi 2026 · lipat<br>`prasyarat` Prasyarat lintas indikator · lipat<br>`ppb` Peta Proses Bisnis (PPB) Level 0–1–2 · PermenPANRB 19/2018 · lipat<br>`opd` 52 perangkat daerah · butir Pemdi per OPD · lipat | /indikator, /antrean, /asesor, /requirement, /probis, /opd |
| `/glosarium` | klien | data/glosarium.json | — | — |
| `/indikator` | ISR | lib/rkData<br>lib/ruangKendali | h2: Matriks 20 indikator × 5 level | — |
| `/modul-indikator` | SSG | lib/useUrlState<br>lib/pemdiNilai<br>lib/ruangKendali | `modul-daftar` Daftar modul indikator<br>`modul-matriks` Matriks kebutuhan bukti dukung — Level 1 & 2 · lipat<br>`modul-dokumen` Peta dokumen kunci · lipat | — |
| `/opd` | SSG | data/opd.json<br>data/pemdi.json<br>lib/useUrlState<br>lib/format<br>lib/slugify<br>lib/pjButir | `opd-ubin` Peta ubin perangkat daerah<br>`opd-tabel` Daftar lengkap · lipat | — |
| `/opd/[slug]` | SSG | data/opd.json<br>data/pemdi.json<br>lib/format<br>lib/slugify<br>lib/ruangKendali<br>lib/cetak | `opd-butir-…` Tugas saya — bukti Pemdi yang menjadi tanggung jawab<br>`opd-ppb-…` Peta proses bisnis | /probis |
| `/pemdi` | ISR | data/pemdi.json<br>lib/rkData<br>lib/ruangKendali<br>lib/pemdiNilai | `aspek-…` (dinamis) | — |
| `/probis` | SSG | data/opd.json<br>lib/format<br>lib/slugify | `ppb-l0` L0 · Visi & misi<br>`ppb-beban` Beban keterlibatan OPD · lipat<br>`ppb-l1` L1 · Urusan pemerintahan · lipat<br>`ppb-l2` L2 · Proses bisnis per kategori · lipat | — |
| `/requirement` | klien | data/panduan-bukti-l1.json<br>data/requirement.json<br>data/draf-bukti-prioritas.json<br>lib/useUrlState<br>lib/pemdiNilai<br>lib/ruangKendali | `req-p0` (dinamis)<br>`req-p1` (dinamis) · lipat<br>`req-panduan` (dinamis) · lipat<br>`ppb-…` …. … | — |
| `/spbe` | ISR | data/opd.json<br>data/evaluasi-asesor-2026.json<br>lib/rkData<br>lib/ruangKendali | `spbe-skala` Posisi Aceh Tengah pada satu sumbu<br>`spbe-dial` SPBE vs target Pemdi<br>`spbe-domain` Empat domain SPBE → tujuh aspek Pemdi · lipat<br>`spbe-rek` Rekomendasi prioritas · lipat<br>`spbe-kuat` Kekuatan · lipat | /pemdi |

## Ringkasan

- 15 rute, 33 panel lipat (19 tertutup di ponsel secara bawaan).
- Sumber data yang dipakai: draf-bukti-prioritas.json, evaluasi-asesor-2026.json, glosarium.json, opd.json, panduan-bukti-l1.json, pemdi.json, requirement.json.

<!-- jtbd:mulai -->
## Matriks tugas (JTBD) per persona — diisi manual

| Persona | Tugas nyata | Halaman/panel yang menjawab | Aksi tersedia | Celah |
|---|---|---|---|---|
| Koordinator Pemdi (Diskominfo) | Tahu posisi indeks & apa yang paling mendesak minggu ini | /dashboard → Situasi, Antrean prioritas tinggi | tautan ke /antrean, cetak | — |
| Koordinator Pemdi | Siapkan sesi interviu asesor per indikator | /asesor → tabel & catatan interview | filter, cetak | — |
| PJ OPD | Tahu butir apa yang menjadi tugas OPD-ku dan apa langkah pertamanya | /opd/[slug] → Tugas saya | salin tautan, bagikan WA, cetak, buka drawer butir | — |
| PJ OPD | Menemukan contoh/format bukti untuk butir tertentu | /requirement, /modul-indikator | unduh panduan | belum ada tautan langsung dari Tugas saya ke panduan per butir |
| Pimpinan (Sekda/Kadis) | Ringkasan 1 layar untuk rapat: indeks, target, beban OPD | /pemdi, /dashboard → Situasi & Beban PJ | cetak | — |
<!-- jtbd:selesai -->
