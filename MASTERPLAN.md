# 🏛️ MASTERPLAN PEMDI ACEH TENGAH 2026–2029
## Transformasi Digital Terpadu Kabupaten Aceh Tengah

> **Dokumen ini adalah cetak biru strategis untuk mengubah portal informasi Pemdi Aceh Tengah menjadi platform digital pemerintahan yang terintegrasi, interoperabel, dan kolaboratif — sesuai amanat Permenpan RB 8/2026 (Pemerintah Digital), Perpres 95/2018 (SPBE), dan arsitektur INA Digital.**

**Versi:** 1.1 — 10 Juni 2026
**Status:** 🔵 Masterplan — Menunggu persetujuan stakeholder
**Penanggung Jawab:** Diskominfo Kabupaten Aceh Tengah

**Riwayat Perubahan:**
| Versi | Tanggal | Perubahan |
|-------|---------|-----------|
| 1.0 | 10 Juni 2026 | Dokumen awal — masterplan 3 tahun (2026–2029) |
| 1.1 | 10 Juni 2026 | Penyesuaian struktur OPD: 50 → **52 Perangkat Daerah** (restrukturisasi data dari dokumen resmi Diskominfo). 7 pemisahan OPD, 1 OPD baru (Dinas Perkebunan), 2 OPD dihapus (KORPRI & RSUD Datu Beru). Data Champion: 50→52. Portal: 63 halaman, 0 error. |

---

## DAFTAR ISI

1. [Visi & Misi Digital](#1-visi--misi-digital)
2. [Landasan Regulasi & Kebijakan](#2-landasan-regulasi--kebijakan)
3. [Arsitektur Saat Ini (Baseline)](#3-arsitektur-saat-ini-baseline)
4. [Arsitektur Target (To-Be)](#4-arsitektur-target-to-be)
5. [Peta Jalan 3 Tahun (2026–2029)](#5-peta-jalan-3-tahun-2026-2029)
6. [Tahap I — Fondasi Interoperabilitas (2026)](#6-tahap-i--fondasi-interoperabilitas-2026)
7. [Tahap II — Platform Terpadu (2027)](#7-tahap-ii--platform-terpadu-2027)
8. [Tahap III — Ekosistem Cerdas (2028–2029)](#8-tahap-iii--ekosistem-cerdas-2028-2029)
9. [Interoperabilitas & Integrasi](#9-interoperabilitas--integrasi)
10. [Stakeholder & Tata Kelola](#10-stakeholder--tata-kelola)
11. [Model Kolaborasi Aktif](#11-model-kolaborasi-aktif)
12. [Anggaran & Sumber Daya](#12-anggaran--sumber-daya)
13. [Indikator Keberhasilan (OKR)](#13-indikator-keberhasilan-okr)
14. [Risiko & Mitigasi](#14-risiko--mitigasi)
15. [Lampiran](#15-lampiran)

---

## 1. VISI & MISI DIGITAL

### VISI
**"Aceh Tengah Smart Regency 2029 — Pemerintahan Digital yang Terintegrasi, Tanggap, dan Inklusif"**

### MISI

| # | Misi | Target |
|---|------|--------|
| 1 | Menyatukan seluruh layanan publik dalam satu platform digital terpadu | Semua OPD terhubung, 100% layanan utama online |
| 2 | Mewujudkan interoperabilitas data antar OPD berbasis standar nasional | Zero data silo, API gateway tunggal |
| 3 | Mendorong partisipasi aktif masyarakat dalam perencanaan dan evaluasi kebijakan | 50.000+ warga menggunakan platform |
| 4 | Meningkatkan indeks Pemdi dari 1,68 ke ≥3,50 (kategori Sangat Baik) | Sesuai target Permenpan 8/2026 |
| 5 | Membangun ekosistem digital yang terbuka, aman, dan berkelanjutan | Open source, audit keamanan tahunan |

---

## 2. LANDASAN REGULASI & KEBIJAKAN

Kerangka regulasi yang mengikat dan mendorong transformasi ini:

| Regulasi | Dampak pada Masterplan |
|----------|------------------------|
| **Permenpan RB 8/2026** — Pemerintah Digital | Framework penilaian utama. 7 aspek, 20 indikator. Target ≥2,50 Pemdi |
| **Perpres 95/2018** — SPBE | Arsitektur SPBE tetap jadi fondasi teknis. Integrasi dengan 4 domain |
| **Permenpan 19/2018** — PPB | 3 level proses bisnis → dasar interoperabilitas layanan |
| **UU 23/2014** — Pemda | Pembagian urusan pusat-daerah → batasan integrasi |
| **Perpres 39/2019** — Satu Data Indonesia | Standar data, metadata, portal data terbuka |
| **Perpres 132/2022** — Arsitektur SPBE Nasional | Indeks SPBE Nasional, arsitektur referensi |
| **Perpres 95/2024** — INA Digital | Portal layanan nasional, SSO, API gateway nasional |
| **UU 27/2022** — Perlindungan Data Pribadi | Wajib: DPIA, enkripsi, consent management |
| **BSSN 8/2021** — Keamanan SPBE | Cloud governance, penetration testing, sertifikasi |
| **Qanun Aceh Tengah 4/2025** — Penyelenggaraan SPBE | Dasar hukum daerah, SK Tim Koordinasi |
| **Perbup terkait** — Tupoksi OPD, e-Government | Kewenangan OPD dalam pengelolaan data |

### Alignment dengan INA Digital

| Komponen INA Digital | Implementasi Aceh Tengah |
|----------------------|--------------------------|
| **Portal Nasional** | PemdiAcehTengah sebagai simpul daerah INA Digital |
| **INAku (super app)** | Integrasi API → layanan Aceh Tengah muncul di INAku |
| **INAdata (data hub)** | Satu Data Aceh Tengah → Satu Data Nasional |
| **INAgov (backend)** | Adopsi standar API nasional, service bus |
| **Digital ID** | Integrasi IKD (Identitas Kependudukan Digital) untuk SSO lokal |

---

## 3. ARSITEKTUR SAAT INI (BASELINE)

### Status Sekarang — Juni 2026

```
┌────────────────────────────────────────────────────────┐
│                   PEMDI ACEH TENGAH                     │
│                    (Next.js SSG)                        │
├────────────────────────────────────────────────────────┤
│  📊 Dashboard    📋 Layanan     🗺️ PPB     📝 SKM     │
│  ❓ FAQ           🔍 Cari       💬 Tanya               │
├────────────────────────────────────────────────────────┤
│  data/ layanan.json, pemdi.json, opd.json, faq.json    │
│  probis.json, berita.json                              │
├────────────────────────────────────────────────────────┤
│                      Vercel (CDN)                       │
│                   GitHub (source)                        │
└────────────────────────────────────────────────────────┘
```

**Update 10 Juni 2026:** Struktur OPD telah direstrukturisasi dari 50 → **52 Perangkat Daerah** berdasarkan dokumen resmi Diskominfo (`Jumlah Perangkat Daerah.docx`). Perubahan: 7 pemisahan OPD (Perdagangan-Koperasi, Pariwisata-Pemuda, Syari'at Islam-Pendidikan Dayah), 1 OPD baru (Dinas Perkebunan), 2 dihapus (KORPRI & RSUD Datu Beru). Total ASN: **4.507**. Portal: 63 halaman statis (Next.js SSG), 0 error.

### Assessment Matang vs Target Pemdi 8/2026

| Aspek Pemdi | Skor Skrg | Target | Gap |
|-------------|:---------:|:------:|:---:|
| 1. Kebijakan & Kelembagaan | 2,0 | 4,0 | 🟡 |
| 2. Layanan Digital Terpadu | 2,5 | 4,0 | 🟡 |
| 3. Data & Interoperabilitas | 1,0 | 3,5 | 🔴 KRITIS |
| 4. Infrastruktur & Keamanan | 1,5 | 3,5 | 🔴 KRITIS |
| 5. SDM Digital | 1,0 | 3,0 | 🔴 KRITIS |
| 6. Partisipasi & Inovasi | 2,0 | 4,0 | 🟡 |
| 7. Dampak & Keberlanjutan | 1,0 | 3,5 | 🔴 KRITIS |

**Rata-rata baseline:** 1,68 → **Target 2029:** ≥3,50 (Sangat Baik)

---

## 4. ARSITEKTUR TARGET (TO-BE)

```
                          ┌─────────────────────────────┐
                          │         PORTAL PUBLIK         │
                          │  pemdi.acehtengahkab.go.id   │
                          │  (Next.js + ISR + PWA)      │
                          └──────────────┬──────────────┘
                                         │
                          ┌──────────────┴──────────────┐
                          │     API GATEWAY (KONG/NGINX) │
                          │  ║ Auth ║ Rate ║ Log ║ Cache│
                          └──────────────┬──────────────┘
                                         │
              ┌──────────────────────────┼──────────────────────────┐
              │                          │                          │
    ┌─────────▼─────────┐    ┌──────────▼──────────┐  ┌───────────▼───────────┐
    │ SERVICE LAYER     │    │ DATA & PLATFORM     │  │ INTEGRATION LAYER    │
    │                   │    │                      │  │                      │
    │ Auth Service      │    │ Postgres (master)    │  │ INA Digital Gateway  │
    │ (NextAuth / Keycloak) │  Minio (S3 docs)      │  │  │
    │ Notification Svc  │    │ Meilisearch (search) │  │ Satu Data API        │
    │ (FCM/Email/WA)    │    │ Redis (cache/session)│  │ OSS-RBA (perizinan)  │
    │ Analytics Svc     │    │ Kafka (event bus)    │  │ SIGA/Dukcapil        │
    │ (PostHog/Matomo)  │    │ Elastic (log/observ) │  │ SIKS-NG (sosial)     │
    │ Report Svc        │    │ Minio (backup)       │  │ SIRUP (pengadaan)    │
    │ (PDF/Excel gen)   │    │                      │  │ e-Buddy (keuangan)   │
    └───────────────────┘    └──────────────────────┘  └──────────────────────┘
                                         │
                          ┌──────────────┴──────────────┐
                          │    ADMIN PANEL (Backstage)   │
                          │  RBAC: Admin OPD / Superadmin│
                          └─────────────────────────────┘
```

---

## 5. PETA JALAN 3 TAHUN (2026–2029)

```
TAHAP I                   TAHAP II                  TAHAP III
2026                     2027                      2028–2029
├────────────────────────┼─────────────────────────┼────────────────────────┤
│                         │                          │                       │
│ 🏗️ FONDASI             │ 🚀 PLATFORM TERPADU      │ 🧠 EKOSISTEM CERDAS   │
│                         │                          │                       │
│ • API Gateway           │ • Super App Mobile       │ • AI Decision Support │
│ • Database             │ • SSO Nasional (INAku)   │ • Predictive Analytics│
│ • Admin Panel          │ • Dashboard Bupati       │ • Smart City IoT      │
│ • Auth (Keycloak)      │ • Dashboard OPD          │ • Open Data Portal    │
│ • Data Migration       │ • Layanan Digital Penuh  │ • Citizen Lab         │
│ • Search (Meilisearch) │ • Lapor Publik 2.0       │ • Collaboration Space │
│ • Web Mail Domain      │ • Notifikasi Terpadu     │ • AI Chatbot Lanjutan │
│ • Sertifikat SSL       │ • Open Data              │ • Blockchain Audit    │
│ • Vulnerability Scan   │ • Integrasi OPD Prioritas│ • Digital Twin Kota   │
│                         │ • Manajemen Kinerja OPD  │                       │
│                         │ • Capacity Building ASN │                       │
└────────────────────────┴─────────────────────────┴────────────────────────┘
```

---

## 6. TAHAP I — FONDASI INTEROPERABILITAS (2026)

**Target:** Platform backend siap, data terintegrasi, API gateway berfungsi.

### 6.1 Infrastruktur & Backend

| # | Inisiatif | Detail Teknis | Timeline | PIC |
|---|-----------|--------------|----------|-----|
| 1.1 | **API Gateway** | Kong/NGINX + Docker. Routing, rate limiting, auth. | Q3 2026 | Diskominfo + DevOps |
| 1.2 | **Database** | PostgreSQL 16 (master) + TimescaleDB (timeseries) | Q3 2026 | DBA |
| 1.3 | **Auth Service** | Keycloak SSO — SAML/OIDC. Integrasi IKD (Identitas Digital) | Q3-Q4 2026 | Security + Diskominfo |
| 1.4 | **Search Engine** | Meilisearch — real-time, typo-tolerant, faceted | Q3 2026 | Developer |
| 1.5 | **Object Storage** | Minio S3 — dokumen, lampiran, aset statis | Q3 2026 | Infra |
| 1.6 | **Message Queue** | Kafka/RabbitMQ — event-driven untuk notifikasi | Q4 2026 | Backend |
| 1.7 | **Monitoring** | Grafana + Prometheus + Loki — log, metrics, trace | Q4 2026 | DevOps |

### 6.2 Data & Integrasi

| # | Inisiatif | Detail | Timeline |
|---|-----------|--------|----------|
| 2.1 | **Data Dictionary** | Standarisasi skema data seluruh OPD. Metadata Satu Data. | Q3 2026 |
| 2.2 | **Data Migration** | JSON → PostgreSQL. Validasi, cleansing, dedup. | Q3 2026 |
| 2.3 | **API Module Data OPD** | REST API: profil OPD, ASN, layanan, anggaran. | Q3-Q4 2026 |
| 2.4 | **Integrasi Dukcapil** | Verifikasi NIK via API SIAK/Dukcapil. | Q4 2026 |
| 2.5 | **Integrasi OSS-RBA** | Data perizinan dari BKPM/DPMPTSP. | Q4 2026 |
| 2.6 | **Integrasi SIKS-NG** | Data penerima bantuan sosial. | Q4 2026 |

### 6.3 Portal

| # | Inisiatif | Detail | Timeline |
|---|-----------|--------|----------|
| 3.1 | **Migrasi Next.js SSG → ISR** | Static → Incremental Static Regeneration. Update data tanpa rebuild. | Q3 2026 |
| 3.2 | **Admin Panel** | Next.js App Router + Server Actions. CRUD semua entitas. | Q3-Q4 2026 |
| 3.3 | **Web Mail Domain** | `@acehtengahkab.go.id` untuk seluruh OPD. | Q3 2026 |
| 3.4 | **SSL Sertifikat** | Wildcard SSL, HSTS, CSP headers. | Q3 2026 |
| 3.5 | **Analytics** | Matomo (self-hosted, GDPR compliant). | Q3 2026 |

### 6.4 Keamanan

| # | Inisiatif | Detail | Timeline |
|---|-----------|--------|----------|
| 4.1 | **Vulnerability Scan** | OWASP ZAP + SonarQube. Bulanan. | Q3 2026 |
| 4.2 | **Penetration Test** | Vendor eksternal. Tahunan. | Q4 2026 |
| 4.3 | **DPIA** | Data Protection Impact Assessment — UU PDP. | Q4 2026 |
| 4.4 | **Backup & DR** | Offsite backup (minio → object storage). RTO 4 jam. | Q4 2026 |

---

## 7. TAHAP II — PLATFORM TERPADU (2027)

**Target:** Semua OPD aktif, layanan digital penuh, dashboard eksekutif.

### 7.1 Portal & Layanan Digital

| # | Inisiatif | Detail | Dampak Pemdi |
|---|-----------|--------|:------------:|
| 5.1 | **Super App Mobile** | Flutter/React Native — Play Store + App Store. | Aspek 2 🟢 |
| 5.2 | **SSO INA Digital** | Login dengan IKD. Sinkronisasi sesi nasional. | Aspek 3 🟢 |
| 5.3 | **Layanan Digital Penuh** | Ajukan, upload, tracking, terbitkan — end-to-end untuk 10 layanan prioritas. | Aspek 2 🔴 |
| 5.4 | **Lapor Publik 2.0** | Tracking real-time, notifikasi, SLA response OPD. | Aspek 6 🟢 |
| 5.5 | **Notifikasi Terpadu** | WA Gateway (WATI/Fonnte) + Email + In-App Push. | Aspek 2 🟡 |
| 5.6 | **PWA Offline Mode** | Service worker — akses offline untuk data inti. | Aspek 6 🟡 |
| 5.7 | **Multi Bahasa** | Indonesia + Gayo + Inggris. | Aspek 6 🟡 |

### 7.2 Dashboard & Manajemen

| # | Inisiatif | Detail | Untuk Siapa |
|---|-----------|---------|-------------|
| 6.1 | **Dashboard Bupati/Wakil** | Real-time KPI 7 aspek Pemdi, anggaran, capaian prioritas daerah. | Eksekutif |
| 6.2 | **Dashboard OPD** | Kinerja OPD, serapan anggaran, progress SPBE, layanan. | Kepala OPD |
| 6.3 | **Manajemen Kinerja OPD** | Scorecard OPD: 20 indikator Pemdi, evaluasi bulanan. | Sekda, Inspektorat |
| 6.4 | **Visualisasi Interaktif** | GIS (Geoserver/Leaflet) — peta sebaran layanan, OPD, aset daerah. | Publik + Eksekutif |
| 6.5 | **Report Generator** | PDF/Excel otomatis untuk LPPD, LAKIP, e-Monev. | Admin OPD |

### 7.3 Integrasi Prioritas

| # | Sistem Target | Data yang Diintegrasikan | Manfaat |
|---|---------------|--------------------------|---------|
| 7.1 | **SIRUP/LKPP** | Pengadaan barang/jasa per OPD | Transparansi pengadaan |
| 7.2 | **e-Buddy/BPKAD** | APBD, realisasi, SIPD | Dashboard keuangan real-time |
| 7.3 | **SIMPEG/BKPSDM** | ASN per OPD, jabatan, kompetensi | Perencanaan SDM digital |
| 7.4 | **SIGA/SIAK** | Kependudukan, KK, KTP-el | Verifikasi otomatis |
| 7.5 | **SISKEUDES** | Data desa, ADD, pembangunan desa | Transparansi hingga desa |

### 7.4 SDM & Kapasitas

| # | Inisiatif | Target Peserta | Frekuensi |
|---|-----------|----------------|-----------|
| 8.1 | **Training API & Integrasi** | 30 developer OPD | 2x setahun |
| 8.2 | **Digital Literacy ASN** | 500 ASN per tahun | Bulanan |
| 8.3 | **Sertifikasi SPBE/Pemdi** | Tim IT Diskominfo | Tahunan |
| 8.4 | **Hackathon Pemda Digital** | 10 tim OPD + komunitas | Tahunan |
| 8.5 | **Study Banding** | 2 pemda maju per tahun | Semester |

---

## 8. TAHAP III — EKOSISTEM CERDAS (2028–2029)

**Target:** Aceh Tengah Smart Regency, AI-driven governance.

### 8.1 Kecerdasan & Otomasi

| # | Inisiatif | Detail | Teknologi |
|---|-----------|--------|-----------|
| 9.1 | **AI Decision Support** | Rekomendasi kebijakan berbasis data Pemdi & SPBE. | LLM + RAG |
| 9.2 | **Predictive Analytics** | Prediksi belanja, serapan anggaran, risiko layanan. | ML (XGBoost, Prophet) |
| 9.3 | **AI Chatbot Lanjutan** | Asisten virtual dengan RAG dari seluruh dokumen Pemda. | LangChain + OpenRouter |
| 9.4 | **Anomali Deteksi** | Deteksi dini kejanggalan anggaran, pengadaan, layanan. | ML (Isolation Forest) |
| 9.5 | **Otomasi Laporan** | Laporan LPPD, LAKIP, SPBE generate otomatis dari data. | NLP + Template Engine |

### 8.2 Smart City & IoT

| # | Inisiatif | Detail | Integrasi |
|---|-----------|--------|-----------|
| 10.1 | **Smart CCTV** | Traffic monitoring, keamanan, crowd detection. | AI Vision + Dashboard |
| 10.2 | **Smart Lighting** | Lampu jalan IoT — hemat energi 30%. | MQTT + SCADA |
| 10.3 | **Smart Water** | Monitoring debit air PDAM real-time. | IoT + GIS |
| 10.4 | **Smart Waste** | Monitoring TPS, rute angkutan sampah. | IoT + Fleet Mgmt |
| 10.5 | **Emergency Response** | Sistem peringatan dini bencana (banjir, longsor, gempa). | BMKG API + IoT + Notif |

### 8.3 Partisipasi & Transparansi

| # | Inisiatif | Detail |
|---|-----------|--------|
| 11.1 | **Open Data Portal** | Dataset publik seluruh OPD. CKAN/DCAT-AP standard. |
| 11.2 | **Citizen Lab** | Co-creation space — masyarakat ikut merancang layanan. |
| 11.3 | **Musrenbang Online** | Perencanaan pembangunan partisipatif digital. |
| 11.4 | **Blockchain Audit Trail** | Jejak audit transparan untuk pengadaan dan anggaran. |
| 11.5 | **Digital Twin Kota** | Model 3D interaktif Takengon — visualisasi pembangunan. |

### 8.4 Keberlanjutan

| # | Inisiatif | Detail |
|---|-----------|--------|
| 12.1 | **Open Source** | Publikasi seluruh kode di GitHub/Niumation. Lisensi MIT. |
| 12.2 | **Knowledge Transfer** | Dokumentasi penuh, video tutorial, SOP. |
| 12.3 | **Sustainability Fund** | Model pendanaan berkelanjutan (APBD + CSR + DAK). |
| 12.4 | **Audit Eksternal Tahunan** | BPK/Bawaslu untuk transparansi. |

---

## 9. INTEROPERABILITAS & INTEGRASI

### 9.1 Prinsip Interoperabilitas

```
┌─────────────────────────────────────────────────────────┐
│           4 LAYER INTEROPERABILITAS SPBE                 │
│  (Permenpan 8/2026 + Arsitektur SPBE Nasional)          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  🔗 LAYER TEKNIS                                         │
│  REST API (OpenAPI 3.1) / GraphQL                        │
│  JSON:API standar, HTTPS-only, JWT auth                  │
│  API versioning (v1, v2)                                 │
│  Rate limiting: 1000 req/min per client                  │
│                                                          │
│  📐 LAYER SEMANTIK                                       │
│  Satu Data Indonesia standar metadata                    │
│  Klasifikasi baku (KBKI, KBLI, KLS)                     │
│  Referensi data terpadu (K/L, Prov, Kab/Kota)           │
│                                                          │
│  🏛 LAYER ORGANISASI                                     │
│  SK Tim Koordinasi SPBE/Pemdi                            │
│  Data Champion per OPD                                   │
│  Forum CIO Aceh Tengah (bulanan)                         │
│                                                          │
│  ⚖ LAYER LEGAL                                           │
│  Perbup tentang Penyelenggaraan SPBE                     │
│  Perjanjian Kerja Sama Data antar OPD                    │
│  MoU dengan Kemendagri/KemenPAN RB                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 9.2 Standar API

```yaml
# Contoh Spesifikasi API Publik
openapi: 3.1.0
info:
  title: Pemdi Aceh Tengah API
  version: 1.0.0
  x-service-name: api-gateway
  x-contact: api@acehtengahkab.go.id

paths:
  /v1/opd:
    get:
      summary: Daftar OPD
      parameters:
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: per_page
          in: query
          schema: { type: integer, default: 20 }
        - name: urusan
          in: query
          schema: { type: string }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  data: { type: array, items: { $ref: '#/components/schemas/OPD' } }
                  meta: { $ref: '#/components/schemas/Pagination' }
      security:
        - bearerAuth: []

  /v1/layanan:
    get:
      summary: Direktori layanan publik
      parameters:
        - name: status
          in: query
          schema: { type: string, enum: [aktif, nonaktif, terbatas] }
        - name: online
          in: query
          schema: { type: boolean }
  components:
    securitySchemes:
      bearerAuth:
        type: http
        scheme: bearer
        bearerFormat: JWT
```

### 9.3 Sistematika Integrasi OPD

```
INTEGRASI OPD BARU MENGIKUTI PROTOKOL:

┌──────────┐     ┌──────────┐     ┌───────────┐     ┌──────────┐
│ 1. ASSESS   │──→ │ 2. ONBOARD │──→ │ 3. INTEGRATE│──→ │ 4. LIVE   │
│ - Data apa?│    │ - API key  │    │ - UAT      │    │ - Monitor │
│ - Format?  │    │ - Scope    │    │ - Dry run  │    │ - Review  │
│ - Urgensi? │    │ - Timeline │    │ - Dokumen  │    │ - Handover│
│ - PIC OPD? │    │ - RBAC     │    │ - Validasi │    │ - SLA     │
└──────────┘     └──────────┘     └───────────┘     └──────────┘
                                                        │
                                                        ▼
                                               Scorecard OPD
                                               (20 indikator)
```

### 9.4 Matriks Interoperabilitas Prioritas

| Sistem | OPD Pemilik | API Ready | Standar | Urgensi | Timeline |
|--------|-------------|:---------:|:-------:|:-------:|:--------:|
| Dukcapil (kependudukan) | Disdukcapil | ✅ SIAK | NIK | 🔴 | Q4 2026 |
| OSS-RBA (perizinan) | DPMPTSP | ✅ REST | NIB | 🔴 | Q4 2026 |
| SIKS-NG (bansos) | Dinsos | ✅ WS | DTKS | 🔴 | Q4 2026 |
| SIMPEG (kepegawaian) | BKPSDM | ⚠️ Partial | NIP | 🔴 | Q1 2027 |
| SIPD (keuangan) | BPKAD | ⚠️ Partial | Kode Rek | 🔴 | Q1 2027 |
| SIRUP (pengadaan) | Bagian PBJ | ✅ REST | Kode Barang | 🟡 | Q2 2027 |
| e-Musrenbang (perencanaan) | Bappeda | ❌ Belum | — | 🟡 | Q2 2027 |
| SISKEUDES (desa) | DPMK | ⚠️ Partial | Kode Desa | 🟡 | Q3 2027 |
| E-Puskesmas (kesehatan) | Dinkes | ❌ Belum | ICD-10 | 🟡 | Q3 2027 |
| e-SKL (sekolah) | Disdik | ❌ Belum | NPSN | 🟢 | 2028 |

---

## 10. STAKEHOLDER & TATA KELOLA

### 10.1 Struktur Tata Kelola

```
                    ┌─────────────────────────────┐
                    │    BUPATI ACEH TENGAH        │
                    │  (Pimpinan / Penanggung Jawab)│
                    └─────────────┬───────────────┘
                                  │
                    ┌─────────────┴───────────────┐
                    │   TIM PEMDI DAERAH (SK Bupati)│
                    │  Ketua: Sekda                │
                    │  Wakil: Kepala Diskominfo    │
                    │  Anggota: Seluruh Kepala OPD  │
                    └─────────────┬───────────────┘
                                  │
         ┌────────────────────────┼─────────────────────────┐
         │                        │                          │
  ┌──────▼──────┐        ┌───────▼───────┐        ┌───────▼───────┐
  │ TIM TEKNIS  │        │ TIM DATA      │        │ TIM ADOPSI   │
  │ Diskominfo  │        │ Bappeda+BPS   │        │ Setda+Inspek  │
  │             │        │               │        │               │
  │ • Infra     │        │ • Standar     │        │ • Change Mgmt │
  │ • Backend   │        │ • Metadata    │        │ • Training    │
  │ • Frontend  │        │ • Quality     │        │ • Sosialisasi │
  │ • Security  │        │ • Interop     │        │ • Evaluasi    │
  └─────────────┘        └───────────────┘        └───────────────┘
         │                        │                          │
         └────────────────────────┼──────────────────────────┘
                                  │
                    ┌─────────────┴───────────────┐
                    │   DATA CHAMPION PER OPD      │
                    │   (1 perangkat daerah)       │
                    └─────────────────────────────┘
```

### 10.2 Peran & Tanggung Jawab

| Stakeholder | Peran | Tanggung Jawab Utama |
|-------------|-------|---------------------|
| **Bupati** | Sponsor Utama | Kebijakan, penganggaran, keputusan strategis |
| **Sekda** | Ketua Tim Pemdi | Koordinasi lintas OPD, pemantauan progres, evaluasi |
| **Diskominfo** | Operator & Teknis | Infrastruktur, platform, API, keamanan, helpdesk |
| **Bappeda** | Perencanaan & Data | Satu Data, metadata, perencanaan digital, Musrenbang |
| **BPKAD** | Keuangan | Integrasi SIPD/e-Buddy, dashboard keuangan |
| **BKPSDM** | SDM & Kepegawaian | SIMPEG, kompetensi ASN, digital literacy |
| **Inspektorat** | Pengawasan | Audit teknis, evaluasi SPBE, kepatuhan |
| **Setda** | Kebijakan | Regulasi, SK, Perbup, surat edaran |
| **BPS** | Data Statistik | Statistik sektoral, metadata SDI |
| **Seluruh OPD** | Data Champion | Input data, update layanan, partisipasi pelatihan |
| **DPRK** | Legislatif | Pengawasan, dukungan regulasi, alokasi anggaran |
| **Masyarakat** | Pengguna | Partisipasi, feedback, adopsi layanan digital |
| **KemenPAN RB** | Pembina | Arahan kebijakan Pemdi, evaluasi nasional |
| **Kemendagri** | Pembina | Arahan SPBE, INA Digital, bantuan teknis |
| **Vendor/Developer** | Pelaksana Teknis | Pengembangan platform, maintenance, support |

### 10.3 Forum & Frekuensi

| Forum | Frekuensi | Peserta | Agenda |
|-------|-----------|---------|--------|
| **Rapat Tim Pemdi** | Bulanan | Sekda + Diskominfo + OPD kunci | Progres, blocker, keputusan |
| **Forum CIO Aceh Tengah** | Bulanan | Seluruh Data Champion OPD | Teknis, integrasi, standar data |
| **Rapat Evaluasi Pemdi** | Kwartalan | Tim Pemdi + OPD | Scorecard, asesmen, rencana aksi |
| **Laporan ke Bupati** | Semester | Sekda + Diskominfo | Capaian, anggaran, rekomendasi |
| **Rapat Koordinasi dengan Pusat** | Tahunan | Diskominfo + KemenPAN RB | Alignment INA Digital, Pemdi nasional |
| **Sosialisasi ke Masyarakat** | Tahunan | Semua OPD + Publik | Launching fitur baru, awareness |

---

## 11. MODEL KOLABORASI AKTIF

### 11.1 Ekosistem Kolaborasi

```
                      ┌─────────────────────────────┐
                      │     PUSAT / NASIONAL          │
                      │  KemenPAN RB, Kemendagri,    │
                      │  BSSN, Bappenas, LKPP        │
                      └──────────┬──────────────────┘
                                 │ Arahan & Standar
                                 ▼
  ┌─────────────┐    ┌─────────────────────────────┐    ┌─────────────┐
  │  PEMDA LAIN  │◄──→│      ACEH TENGAH            │◄──→│  SEKTOR     │
  │  (Aceh, dll) │    │   PEMERINTAH DIGITAL        │    │  PRIVAT     │
  └─────────────┘    └─────────────────────────────┘    └─────────────┘
                           │          │          │
                           ▼          ▼          ▼
                    ┌────────┐ ┌────────┐ ┌────────┐
                    │ OPD    │ │ OPD    │ │ OPD    │
                    │ INTI   │ │ PENDUK │ │ WILAYAH│
                    └────────┘ └────────┘ └────────┘
                           │          │          │
                           ▼          ▼          ▼
                    ┌─────────────────────────────┐
                    │   MASYARAKAT & KOMUNITAS     │
                    │  Warga, BUMD, Media, Kampus  │
                    └─────────────────────────────┘
```

### 11.2 Program Kolaborasi Konkret

| Program | Frekuensi | Pelaksana | Output |
|---------|-----------|-----------|--------|
| **Data Challenge** | Kwartalan | Bappeda + BPS | Dataset baru yang siap integrasi |
| **Sprint Integrasi** | Bulanan | Diskominfo + 1 OPD | 1 integrasi OPD baru selesai |
| **Digital Bootcamp** | 2x setahun | BKPSDM + Diskominfo | 30 ASN tersertifikasi digital |
| **Layanan Co-Design** | Semester | Semua OPD + Masyarakat | 3 layanan baru hasil partisipasi |
| **Open Data Hackathon** | Tahunan | Diskominfo + Komunitas IT | 5 aplikasi publik berbasis open data |
| **Pemda Knowledge Share** | Semester | Diskominfo + Pemda lain | Best practice, lesson learned |
| **Bupati Meet Citizen** | Bulanan | Setda + Publik | Dialog langsung via platform digital |

### 11.3 Insentif & Pengakuan

| Level | Pengakuan | Bentuk |
|-------|-----------|--------|
| 🥇 **OPD Teladan** | Penghargaan Bupati | Tambahan DAK, prioritas pengadaan IT |
| 🥇 **Data Champion Terbaik** | Sertifikat + Insentif | Tunjangan kinerja tambahan |
| 🥇 **Inovasi Digital** | Anugerah Inovasi Aceh Tengah | Publikasi nasional, reward |
| 🥇 **Unit Layanan Digital Terbaik** | Trophy Pemda Digital | Prioritas pelatihan, studi banding |

---

## 12. ANGGARAN & SUMBER DAYA

### 12.1 Estimasi Anggaran Indikatif

| Komponen | Tahun 1 (2026) | Tahun 2 (2027) | Tahun 3 (2028–29) | Total |
|----------|:--------------:|:--------------:|:-----------------:|:-----:|
| Infrastruktur & Hosting | Rp 250 Juta | Rp 150 Juta | Rp 200 Juta | Rp 600 Juta |
| Pengembangan Platform | Rp 350 Juta | Rp 500 Juta | Rp 400 Juta | Rp 1,25 M |
| Integrasi OPD | Rp 200 Juta | Rp 350 Juta | Rp 200 Juta | Rp 750 Juta |
| Keamanan & Audit | Rp 100 Juta | Rp 150 Juta | Rp 200 Juta | Rp 450 Juta |
| SDM & Pelatihan | Rp 150 Juta | Rp 200 Juta | Rp 250 Juta | Rp 600 Juta |
| Operasional & Maintenance | Rp 100 Juta | Rp 150 Juta | Rp 200 Juta | Rp 450 Juta |
| **Total** | **Rp 1,15 M** | **Rp 1,5 M** | **Rp 1,45 M** | **Rp 4,1 M** |

**Catatan:**
- Sumber dana: APBD (DAK, Dana Alokasi Khusus, APBD Murni) + CSR + Hibah
- Potensi efisiensi: Open source license → zero lisensi (kecuali infrastruktur)
- Nilai pengembalian: Efisiensi operasional Rp 500 Juta/tahun (pengurangan kertas, perjalanan dinas, waktu tunggu)

### 12.2 Sumber Daya Manusia

| Peran | Tipe | Jumlah | Tahun |
|-------|------|:------:|:-----:|
| DevOps Engineer | Full-time | 1 | 2026–2029 |
| Full-stack Developer | Full-time / Kontrak | 2 | 2026–2029 |
| Data Engineer | Full-time | 1 | 2026–2029 |
| UI/UX Designer | Kontrak | 1 | 2026–2027 |
| Security Engineer | Kontrak | 1 (paruh waktu) | 2026–2029 |
| Project Manager | Full-time | 1 | 2026–2029 |
| Data Champion OPD | In-house (existing ASN) | 52 | 2026–2029 |
| Helpdesk & Support | Full-time | 2 | 2027–2029 |

---

## 13. INDIKATOR KEBERHASILAN (OKR)

### 13.1 Key Results — Tahap I (2026)

| # | Key Result | Baseline | Target Q4 2026 | Metrik |
|---|-----------|:--------:|:--------------:|--------|
| KR-1 | Indeks Pemdi | 1,68 | ≥2,00 | Asesmen KemenPAN RB |
| KR-2 | API Gateway berfungsi | 0 | 10 endpoint | HTTP 200 rate ≥99.9% |
| KR-3 | OPD terintegrasi data | 0 | 10 OPD | Jumlah OPD dengan API aktif |
| KR-4 | Database terpusat | JSON | PostgreSQL + 5 tabel | Skema tervalidasi |
| KR-5 | Admin panel rilis | ❌ | ✅ | CRUD semua entitas |
| KR-6 | ASN terlatih | 0 | 50 ASN | Sertifikat digital literacy |
| KR-7 | Uptime platform | 0 | ≥99.5% | Monitoring Grafana |

### 13.2 Key Results — Tahap II (2027)

| # | Key Result | Baseline | Target Q4 2027 | Metrik |
|---|-----------|:--------:|:--------------:|--------|
| KR-8 | Indeks Pemdi | 2,00 | ≥2,80 | Asesmen KemenPAN RB |
| KR-9 | OPD terintegrasi penuh | 10 | 30 | API aktif + data terverifikasi |
| KR-10 | Layanan digital end-to-end | 0 | 10 layanan | Bisa ajukan online penuh |
| KR-11 | Dashboard eksekutif rilis | ❌ | ✅ | Bupati + Sekda + OPD |
| KR-12 | Super App mobile rilis | ❌ | ✅ | 1000+ download |
| KR-13 | Open data portal rilis | ❌ | ✅ | 50+ dataset publik |
| KR-14 | Pengguna aktif bulanan | 0 | 10.000 | Analytics Matomo |

### 13.3 Key Results — Tahap III (2028–2029)

| # | Key Result | Baseline | Target 2029 | Metrik |
|---|-----------|:--------:|:-----------:|--------|
| KR-15 | Indeks Pemdi | 2,80 | ≥3,50 | Asesmen KemenPAN RB |
| KR-16 | Smart City Index | Belum terukur | Masuk 50 besar nasional | Indeks Smart City |
| KR-17 | AI chatbot adoption | 0 | 20.000+ interaksi/bulan | Log chatbot |
| KR-18 | Open data adoption | 0 | 5 aplikasi publik | Hackathon output |
| KR-19 | Survei kepuasan digital | 0 | ≥4,0/5,0 | SKM modul digital |
| KR-20 | Efisiensi biaya operasional | 0 | Rp 500 Juta/tahun | Audit BPKAD |

---

## 14. RISIKO & MITIGASI

| Risiko | Dampak | Probabilitas | Mitigasi |
|--------|:------:|:------------:|----------|
| **R1 — Resistensi OPD** terhadap integrasi data | 🔴 Tinggi | 🔴 Tinggi | • Data Champion per OPD<br>• Insentif & pengakuan<br>• SK Bupati sebagai payung hukum<br>• Pendekatan bertahap, bukan revolusi |
| **R2 — Anggaran terbatas/tidak cair** | 🔴 Tinggi | 🟡 Sedang | • Prioritaskan open source<br>• Gunakan DAK & hibah<br>• Fase incremental, bukan big bang<br>• Tunjukkan quick wins |
| **R3 — Keamanan data & kebocoran** | 🔴 Tinggi | 🟡 Sedang | • DPIA sebelum setiap integrasi<br>• Penetration test rutin<br>• Enkripsi end-to-end<br>• BSSN compliance |
| **R4 — Penggantian pejabat** (Bupati/Sekda/Kadis) | 🟡 Sedang | 🔴 Tinggi | • Dokumen masterplan disahkan via Perbup<br>• Knowledge base lengkap<br>• Transisi kepemimpinan via SOP<br>• Keterlibatan DPRK |
| **R5 — Ketergantungan vendor** | 🟡 Sedang | 🟡 Sedang | • Open source code → zero vendor lock-in<br>• In-house team dibangun sejak awal<br>• Dokumentasi lengkap |
| **R6 — Infrastructure downtime** | 🟡 Sedang | 🟡 Sedang | • Multi-cloud/region backup<br>• SLA ≥99.9% dengan provider<br>• Disaster Recovery Plan |
| **R7 — Adopsi publik rendah** | 🟡 Sedang | 🟡 Sedang | • Kampanye digital & offline<br>• Integrasi dengan media sosial & WA<br>• User-friendly design<br>• Pelibatan komunitas & kampus |
| **R8 — Konflik data antar OPD** (siapa pemilik) | 🟡 Sedang | 🟡 Sedang | • SK Tim Data + Data Champion<br>• Satu Data Indonesia framework<br>• Data Dictionary resmi |
| **R9 — Perubahan regulasi pusat** | 🟡 Sedang | 🟡 Sedang | • Arsitektur modular → mudah adaptasi<br>• Ikut perkembangan INA Digital<br>• Anggota forum SPBE nasional |

---

## 15. LAMPIRAN

### A. Cetak Biru Arsitektur Teknis (Detail)
Diagram arsitektur 3-tier, deployment diagram, network topology, CI/CD pipeline, security architecture.

### B. Standar API & Data
OpenAPI 3.1 spec lengkap, contoh payload, JSON Schema, standar error codes.

### C. Format Data Dictionary
Template untuk setiap OPD: nama_data, sumber, format, frekuensi_update, PIC, akses.

### D. SOP Integrasi OPD
Langkah detail: assessment → onboarding → integrasi → UAT → live → monitoring.

### E. Template Perjanjian Kerja Sama Data
Draft MoU antar OPD, pernyataan keamanan data, DPIA form.

### F. Indikator Scorecard OPD
20 indikator Pemdi per OPD — rumus, target, frekuensi, sumber data.

### G. Rencana Anggaran Detail
RAB per komponen, per tahun, breakdown belanja modal vs operasional.

### H. Referensi Regulasi Lengkap
Link + ringkasan 25+ regulasi terkait.

### I. Glosarium
Definisi: Pemdi, SPBE, PPB, INA Digital, SDI, API Gateway, dll.

---

## STATUS MASTERPLAN

| Komponen | Status | Keterangan |
|----------|:------:|------------|
| Visi & Misi | ✅ Final | Disetujui |
| Arsitektur Target | ✅ Final | Arsitektur referensi |
| Peta Jalan 3 Tahun | ✅ Final | OKR per tahap |
| Tahap I Detail | ✅ Final | Siap eksekusi |
| Tahap II Detail | 🟡 Draft | Perlu detail integrasi 30 OPD |
| Tahap III Detail | 🟡 Konsep | Bergantung hasil Tahap I & II |
| Anggaran | 🟡 Estimasi | Perlu verifikasi dengan BPKAD/Keuangan |
| Tim & Tata Kelola | ✅ Final | SK Bupati diperlukan |
| Risiko | ✅ Final | Mitigasi teridentifikasi |

**Aksi Selanjutnya:**
|1. ❌ Presentasi ke Sekda / Diskominfo (belum pernah dilakukan)
|2. ⏳ Penerbitan SK Tim Pemdi Daerah oleh Bupati
|3. ⏳ Sosialisasi ke seluruh OPD
|4. ⏳ Eksekusi Tahap I — Q3 2026
|
|**Dokumen Terkait:**
|`STRATEGI_PEMDIACEHTENGAH.md` — Breakdown detail implementasi portal (4 fase: data, PPB, publik, dashboard)
|`docs/plan-v0.md` — Arsip perencanaan awal proyek (out of date — referensi historis)|
|
|---|
|
|*Dokumen ini disusun oleh Tim Pengembangan Pemda Digital Aceh Tengah — 10 Juni 2026*
*License: MIT — Seluruh konten terbuka untuk adaptasi oleh Pemda lain*
