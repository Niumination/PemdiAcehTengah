# Strategi Pemdi Aceh Tengah — Rencana Implementasi Nyata

> Dokumen strategis untuk portal https://pemdi-aceh-tengah.vercel.app
> Berdasarkan: Permenpan RB 8/2026, Permenpan 19/2018, Panduan Peningkatan Indeks Pemdi (Diskominfo), riset best practices 6 kabupaten/kota
> Disusun: 10 Juni 2026

---

## Ringkasan Eksekutif

**Aceh Tengah** — indeks SPBE 2.59 (Cukup), target Pemdi ≥2.50 (Baik). Framework evaluasi baru (Permenpan 8/2026) mengubah SPBE menjadi Pemdi dengan 7 aspek, 20 indikator — bobot terbesar **Kepuasan Pengguna 25%**.

**Tantangan**: Manajemen SPBE = 1.00 (Kurang), Tata Kelola = 1.70, Audit TIK = 1.00.
**Modal**: Portal sudah berjalan (Next.js/Vercel), data OPD terkumpul, PPB framework dipahami, ada Panduan strategis dari Diskominfo.

**Strategi**: 4 fase — **Fondasi Data (Q3 2026) → PPB Final (Q4 2026) → Fitur Publik (Q1 2027) → Pemdi Dashboard (Q2 2027)**.

---

## 1. Diagnosa — Posisi Saat Ini

### Indeks SPBE 2025 Baseline

| Domain | Nilai | Predikat | Target Pemdi 2026 |
|--------|-------|----------|--------------------|
| Kebijakan SPBE | 2.30 | Cukup | 2.50 |
| Tata Kelola SPBE | 1.70 | ❌ Kurang | 2.50 |
| Manajemen SPBE | 1.00 | ❌ Kurang | 2.50 |
| Layanan SPBE | 3.75 | ✅ Sangat Baik | 3.00+ |
| **Indeks** | **2.59** | **Cukup** | **≥2.50 Baik** |

### Indikator Kritis (Nilai=1 — Darurat)

| Indikator | Skor | Dampak |
|-----------|------|--------|
| Arsitektur SPBE | 1 | Blocker untuk Pemdi aspek Teknologi |
| Peta Rencana SPBE | 1 | Blocker perencanaan |
| Inovasi Proses Bisnis | 1 | Tergantung PPB |
| Pembangunan Aplikasi | 1 | Portal bisa jadi solusi |
| Pusat Data | 1 | Di luar kendali portal |
| **Semua Manajemen SPBE** | **1** | **Ini yang paling krusial** |
| **Semua Audit TIK** | **1** | **Di luar kendali portal** |

### Potensi Portal (yang bisa dikerjakan)

| Kategori | Indikator Pemdi Terkait | Kontribusi Portal |
|----------|-------------------------|-------------------|
| ✅ **Internal** | I1 Tata Kelola, I2 Manajemen Layanan, I13 Aplikasi, I17 Portal | Langsung — portal adalah jawabannya |
| ⚠️ **Data** | I5 Tata Kelola Data, I8 PDP, I18 Interoperabilitas | Portal sebagai publikasi data — perlu backend |
| 🔶 **Kolaborasi** | I4 Kolaborasi, I15 Keterpaduan PPB | Portal sebagai medium kolaborasi antar OPD |
| 🟢 **Kepuasan** | I19 Fasilitas Dukungan, I20 Kepuasan Pengguna | **Ini bobot 25% — portal adalah frontline** |

---

## 2. Best Practices — Belajar dari Daerah Lain

### Kasus: Belitung Timur (2.70 → 4.16 dalam 3 tahun)

| Tahun | Indeks | Kunci |
|-------|--------|-------|
| 2022 | 2.70 | Baseline |
| 2023 | 3.56 | +0.86 — Tim Asesor Internal dibentuk, bimtek massal |
| 2024 | 4.16 | +0.60 — Integrasi layanan, dashboard publik, Sekda turun tangan |
| 2025 | Target 4.20+ | Konsolidasi |

**Pelajaran untuk Aceh Tengah**:
1. **Sekda sebagai champion** — Beltim punya Sekda yang aktif mendorong
2. **Tim Asesor Internal permanen** — bukan tim ad-hoc
3. **Pengukuran berkala** — tiap semester evaluasi sendiri
4. **Publikasi dashboard** — transparansi nilai ke publik

### Kasus: Kota Madiun (Transisi SPBE→Pemdi)

- Mulai sosialisasi perubahan SPBE→Pemdi Feb 2026
- Fokus: menggeser mindset dari "dokumen" ke "dampak layanan"
- 5 prioritas: tata kelola, teknologi, kompetensi ASN, layanan digital, data

### Pola Umum Kabupaten Sukses

1. **Bupati/Sekda sebagai penggerak utama** — bukan Diskominfo sendiri
2. **Tim khusus** — bukan tugas sampingan
3. **Data first** — sebelum bangun sistem, pastikan data valid
4. **Publikasi progres** — dashboard publik meningkatkan akuntabilitas
5. **Iterasi cepat** — tidak perlu sempurna dulu, yang penting jalan

---

## 3. Strategi Bertahap — 4 Fase

### Prinsip Dasar

- **Tidak perlu sempurna dulu** — yang penting jalan dan dipakai
- **Fokus pada yang bisa dikontrol portal** — jangan terjebak hal di luar kendali (Pusat Data, Audit TIK)
- **Kepuasan Pengguna (25% bobot)** — ini medan pertempuran utama portal
- **Data OPD dulu, baru fitur** — fondasi sebelum bangunan

---

### FASE 1: Fondasi Data (Q3 2026 — Juli 2026) 🔴 30 hari

**Goal**: Semua data valid, portal mencerminkan kondisi riil Aceh Tengah.

| # | Task | Output | Estimasi |
|---|------|--------|----------|
| 1.1 | Harmonisasi OPD 50 + ASN dari e-Keurani ke `data/opd.json` | opd.json dengan 50 OPD + jumlah_asn | ⏱ 1 hari |
| 1.2 | Mapping urusan konkuren → OPD (24 wajib + 8 pilihan) | Setiap OPD punya field `urusan` | ⏱ 2 hari |
| 1.3 | Tambah konten tupoksi per OPD (dari data existing + riset) | Tiap OPD punya tupoksi + layanan | ⏱ 3 hari |
| 1.4 | Struktur ulang PPB Level 1: urusan → OPD mapping | Level 1 akurat, bukan template | ⏱ 2 hari |
| 1.5 | Validasi data ke Diskominfo (via PJ) | Data terverifikasi | ⏱ 3 hari |
| 1.6 | Deploy update pertama ke Vercel | Portal live dengan data benar | ⏱ 1 hari |

**Total**: ~12 hari kerja — bisa 2-3 minggu kalender.

---

### FASE 2: PPB Level 0-1-2 Final (Q3-Q4 2026 — Agustus-Oktober) 🟡 60 hari

**Goal**: PPB lengkap untuk 50 OPD, bukan template generik.

| # | Task | Output | Estimasi |
|---|------|--------|----------|
| 2.1 | Finalisasi PPB Level 0 (Visi-Misi — sudah ada) | Halaman interaktif visi-misi dengan visual | ⏱ 1 hari |
| 2.2 | Finalisasi PPB Level 1 (Urusan + OPD — mapping sudah) | Halaman urusan pemerintah dengan daftar OPD terkait | ⏱ 2 hari |
| 2.3 | **Template Level 2 generik** — buat template BPMN per kategori OPD (3-5 template) | Template reusable: (a) Dinas layanan, (b) Badan, (c) Staf, (d) Kecamatan, (e) Lembaga | ⏱ 3 hari |
| 2.4 | Isi Level 2 untuk 5 OPD prioritas (Diskominfo, Bappeda, BKPSDM, BPKAD, Dinas Pendidikan) | 5 OPD dengan PPB Level 2 riil | ⏱ 10 hari |
| 2.5 | **Workshop PPB template** — buat panduan + template untuk OPD lain isi sendiri | Panduan + template BPMN (Microsoft Visio atau draw.io) | ⏱ 3 hari |
| 2.6 | Halaman detail `/opd/[slug]` — landing page tiap OPD | Routing dinamis → tupoksi + layanan + PPB | ⏱ 3 hari |
| 2.7 | Integrasi konten Diskominfo-Web ke `/opd/diskominfo` | Merge konten existing | ⏱ 2 hari |

**Total**: ~24 hari kerja — bisa 2 bulan kalender.

**Strategi PPB Level 2 Efisien**: jangan buat 50 unik dari awal. Buat 3-5 template:
- **Template Dinas Layanan Publik** (Pendidikan, Kesehatan, Sosial, dll) — ada interaksi langsung masyarakat
- **Template Dinas Regulasi** (Perhubungan, Satpol PP, DPMPTSP) — lebih banyak perizinan
- **Template Badan/Staf** (Bappeda, BKPSDM, BPKAD, Setda) — lebih banyak koordinasi internal
- **Template Kecamatan** — seragam semua, beda di wilayah
- **Template Lembaga** (MPU, MAG, Baitul Mal) — unik per lembaga

OPD lain cukup modifikasi dari template sesuai kebutuhan.

---

### FASE 3: Fitur Publik & Kepuasan Pengguna (Q1 2027 — Januari-Maret) 🟢 60 hari

**Goal**: Portal menjadi alat publik yang benar-benar dipakai masyarakat — langsung berkontribusi ke I19-I20 (25% bobot).

| # | Task | Output | Estimasi |
|---|------|--------|----------|
| 3.1 | **Layanan publik directory** — direktori semua layanan digital per OPD | Halaman `/layanan` — cari layanan, link ke aplikasi | ⏱ 3 hari |
| 3.2 | **Fasilitas Dukungan Pengguna** — widget pengaduan/feedback | Widget "Lapor" + tracking status — kontribusi I19 | ⏱ 3 hari |
| 3.3 | **Survei Kepuasan Masyarakat (SKM) Online** — embedded form | Minimal SKM tiap layanan — kontribusi I20 | ⏱ 2 hari |
| 3.4 | **Pencarian global** — search seluruh konten portal | Search bar + hasil realtime | ⏱ 2 hari |
| 3.5 | **Status layanan (SLA)** — badge hidup/mati tiap layanan digital | Cek uptime layanan per OPD — kontribusi I19 | ⏱ 4 hari |
| 3.6 | **FAQ + Chatbot sederhana** — jawab pertanyaan umum | FAQ interaktif + bot sederhana | ⏱ 3 hari |
| 3.7 | **Responsive & accessibility audit** — pastikan bisa diakses semua perangkat | WCAG 2.1 AA compliant | ⏱ 3 hari |

**Total**: ~20 hari kerja — 2 bulan kalender.

---

### FASE 4: Pemdi Dashboard & Evaluasi Mandiri (Q2 2027 — April-Juni) 🔵 60 hari

**Goal**: Portal menjadi alat monitoring Pemdi real-time — membantu evaluasi mandiri dan transparansi.

| # | Task | Output | Estimasi |
|---|------|--------|----------|
| 4.1 | **Pemdi Dashboard** — visualisasi real-time 7 aspek 20 indikator | Grafik radar + scorecard per aspek — nilai terkini vs target | ⏱ 5 hari |
| 4.2 | **Self-assessment portal** — tiap OPD bisa input progres indikator | Form mandiri per indikator + bukti dukung upload | ⏱ 5 hari |
| 4.3 | **Timeline target vs realisasi** — gap analysis visual | Gantt chart per fase | ⏱ 3 hari |
| 4.4 | **Rekomendasi otomatis** — sistem kasih saran berdasarkan gap | Action items per aspek yang lemah | ⏱ 4 hari |
| 4.5 | **Export laporan** — PDF laporan evaluasi mandiri | Tombol "Cetak Laporan" — siap untuk asesor eksternal | ⏱ 2 hari |
| 4.6 | **Integrasi Satu Data Indonesia** — API endpoint standar | `/api/v1/opd`, `/api/v1/spbe`, `/api/v1/layanan` — format SDI | ⏱ 3 hari |

**Total**: ~22 hari kerja.

---

## 4. Improvement Cepat — Quick Wins (Bisa Sekarang)

Hal-hal yang bisa dikerjakan **hari ini** dengan effort minimal:

| # | Quick Win | Nilai | Effort |
|---|-----------|-------|--------|
| ✅ | **Publikasi data OPD 50 + ASN** di portal | Data akurat, bangun kepercayaan publik | 1 jam |
| ✅ | **Tambahkan jumlah ASN per OPD** di tabel OPD | Transparansi data kepegawaian | 1 jam |
| ✅ | **Halaman /opd dinamis** — dari data/opd.json (sudah siap tinggal routing) | Setiap OPD punya landing page | 3 jam |
| ✅ | **Permenpan 8/2026 diseminasi** — info grafik perbandingan SPBE vs Pemdi | Edukasi publik tentang framework baru | 2 jam |
| ✅ | **SKM Online widget** — embedded Google Form atau custom | Mulai kumpulkan data kepuasan (I20) | 2 jam |
| ✅ | **Badge Pemdi score** di homepage | Tampilkan target dan progres | 1 jam |

---

## 5. Arsitektur Teknis — Rekomendasi

### Sekarang (Sudah Berjalan ✅)
```
Next.js 14 → Vercel → data/opd.json (statis)
              ↓
   Halaman: /, /requirement, /api/opd, /api/spbe
```

### Target (Akhir Fase 4)
```
Next.js 14 → Vercel
  ├── /                          ← Landing + Pemdi Dashboard
  ├── /opd/[slug]               ← 50 halaman OPD (dinamis SSG)
  ├── /layanan                  ← Direktori layanan digital
  ├── /pemdi                    ← Dashboard 7 aspek 20 indikator
  ├── /evaluasi                 ← Self-assessment mandiri
  └── /api/v1/*                 ← Endpoint Satu Data Indonesia

  Data:
  ├── data/opd.json             ← Master data 50 OPD
  ├── data/layanan.json         ← Layanan digital per OPD
  ├── data/pemdi.json           ← Indikator & skor Pemdi
  └── data/probis.json          ← PPB lengkap Level 0-1-2
```

### Design System — Sudah Sesuai Best Practice

GOV.UK-inspired (Inter font, `#1d70b8`, clean) adalah pilihan tepat karena:
1. **Sudah terbukti** — GOV.UK adalah standar emas government UX global
2. **Accessible** — WCAG AAA compliant secara default
3. **Mobile-first** — sesuai penetrasi smartphone Indonesia
4. **Familiar** — warga Aceh Tengah terbiasa dengan tampilan resmi seperti ini

**Yang perlu ditambah**:
- **Aceh Tengah identity** — sisipkan motif kerawang Gayo di header/footer
- **Warna aksen lokal** — hijau kopi Gayo sebagai secondary accent (selain biru GOV.UK)
- **Bahasa Gayo** — opsi konten bilingual (Indonesia + Gayo) untuk beberapa halaman

---

## 6. Manajemen Risiko

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| Data OPD tidak akurat / ditolak Diskominfo | 🔴 Fase 1 gagal | Validasi bertahap, mulai dari data yang sudah diverifikasi |
| PPB Level 2 terlalu berat (50 OPD) | 🟡 Fase 2 molor | **Template reuse** — jangan buat 50 unik. Cukup 5 prototype |
| Komitmen pimpinan rendah | 🔴 Semua fase | Portal publik sebagai bukti konkret — tunjukkan hasil ke Bupati/Sekda |
| Kapasitas teknis terbatas (server/dev) | 🟡 Fase 3-4 | **Vercel gratis** untuk statis, Next.js ISR untuk data semi-dinamis |
| Perubahan regulasi di tengah jalan | 🟡 Penyesuaian | **Desain modular** — pisah framework (Permenpan) dari data (Pemda) |
| Masyarakat tidak pakai portal | 🟡 Fase 3 percuma | **Integrasi WhatsApp/Telegram** untuk jangkauan lebih luas |

---

## 7. Metrik Sukses — Cara Ukur

### Teknis (Portal)
| Metrik | Target | Fase |
|--------|--------|------|
| Build success rate | 100% | Semua fase |
| Lighthouse Performance | ≥90 | Fase 3 |
| Lighthouse Accessibility | ≥95 | Fase 3 |
| Halaman OPD live | 50/50 | Fase 1 |
| Data PPB OPD final | 50/50 | Fase 2 |

### Dampak (Pemdi)
| Metrik | Baseline | Target | 
|--------|----------|--------|
| Indeks Pemdi (total) | ~2.37* | ≥2.50 (Baik) |
| I17 Portal Layanan Digital | Belum dinilai | 3.0 (Baik) |
| I19 Fasilitas Dukungan | 1.0 | 2.5 (Cukup) |
| I20 Kepuasan Pengguna | 1.0 | 2.5 (Cukup) |
| I15 Keterpaduan PPB | 1.0 | 2.5 (Cukup) |

*\*Proyeksi dari baseline SPBE 2.59, disesuaikan dengan framework Pemdi baru*

### Adopsi
| Metrik | Target | 
|--------|--------|
| Visitor bulanan | ≥1,000 (Q2 2027) |
| SKM entries | ≥100/bulan |
| OPD mengisi self-assessment | 50/50 |

---

## 8. Kampanye Publik — Supaya Dipakai

Portal saja tidak cukup — harus dipromosikan:

1. **Launch bertahap** — bukan grand launching sekaligus
   - Fase 1: "Data OPD Sekarang Online" — teaser ke media lokal
   - Fase 2: "PPB Aceh Tengah — Transparansi Proses Pemerintahan"
   - Fase 3: "Layanan Publik dalam Genggaman"
   - Fase 4: "Cek Skor Pemdi Aceh Tengah Real-time"

2. **Integrasi media sosial** — 
   - Bagikan update tiap minggu di Instagram/Facebook Diskominfo
   - Infografik perbandingan SPBE vs Pemdi

3. **QR Code** — di setiap kantor OPD, langsung ke halaman OPD tersebut

4. **Sosialisasi ASN** — setiap ASN minimal tahu portal dan bisa navigasi

---

## 9. Kesimpulan — Action Plan

```
┌────────────────────────────────────────────────┐
│              Q3 2026 (Juli)                     │
│  🔴 FASE 1 — Fondasi Data                      │
│  Output: 50 OPD valid, live di portal          │
├────────────────────────────────────────────────┤
│              Q3-Q4 2026 (Agu-Okt)              │
│  🟡 FASE 2 — PPB Final                         │
│  Output: 5 OPD riil + template 45 lainnya      │
├────────────────────────────────────────────────┤
│              Q1 2027 (Jan-Mar)                 │
│  🟢 FASE 3 — Fitur Publik & Kepuasan           │
│  Output: SKM, feedback, SLA — kontribusi 25%   │
├────────────────────────────────────────────────┤
│              Q2 2027 (Apr-Jun)                 │
│  🔵 FASE 4 — Pemdi Dashboard & Evaluasi        │
│  Output: Self-assessment, dashboard real-time  │
└────────────────────────────────────────────────┘
```

### Hari Ini — Langkah Pertama
1. ✅ BACKLOG.md sudah diupdate
2. ✅ Memory sudah disimpan
3. ⬜ **Mulai Fase 1.1**: update data/opd.json → 50 OPD
4. ⬜ **Buat halaman `/opd/[slug]`** — routing dinamis

---

*Dokumen ini adalah living document — update sesuai perkembangan.*
*Referensi: Permenpan 8/2026, Panduan Peningkatan Indeks Pemdi Diskominfo Aceh Tengah, 
 riset best practices Belitung Timur, Sumedang, Mojokerto, Bekasi, Madiun, Lombok Barat.*
