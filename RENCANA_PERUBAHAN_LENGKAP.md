# Rencana Perubahan Lengkap — PemdiAcehTengah

> **Project:** Portal Pemda Aceh Tengah — https://pemdi-aceh-tengah.vercel.app
> **Basis:** V1 Snapshot (PemdiAcehTengah-V1.zip) + Produksi Saat Ini
> **Tanggal:** 15 Juli 2026
> **Repo:** `niumination/PemdiAcehTengah` (main)
> **Status:** ✅ Quick Win 6 fitur selesai — 🛠️ Memasuki Fase Fondasi

---

## 📋 Ringkasan Eksekutif

**Target:** Indeks Pemdi ≥ 2,50 (Baik) — saat ini baseline SPBE 2,59 (Cukup).

**Progress:**
| Fase | Status | Bobot Pemdi | Selesai |
|------|--------|-------------|---------|
| 🚀 Quick Win (6 fitur) | ✅ **SELESAI** | 47% | Early Jun 2026 |
| 🛠️ Fondasi (6 fitur) | 🟡 **DIMULAI** | 30% | — |
| 🔧 Lengkap (5 fitur) | ⏳ **Menunggu** | 23% | — |
| Fase 3 — Fitur Publik (Q1 2027) | ⏳ **Rencana** | Tambahan | Jan-Mar 2027 |
| Fase 4 — Pemdi Dashboard (Q2 2027) | ⏳ **Rencana** | Tambahan | Apr-Jun 2027 |

---

## 🔵 A. Perubahan Infrastructure & Konfigurasi

| # | Item | Keterangan | Prioritas | Status |
|---|------|-----------|-----------|--------|
| A-01 | **Supabase Rate Limiting** | Serverless-safe rate limiter via Supabase untuk API `/api/feedback`, `/api/lapor`, `/api/skm` | 🔴 P0 | ✅ **TERPASANG** (commit `fa83a8d`) |
| A-02 | **Security Headers — CSP Final** | Verifikasi CSP di `next.config.js` sudah aman — form-action, frame-ancestors, dan script-src sudah dikonfigurasi | 🔴 P0 | ✅ **TERPASANG** |
| A-03 | **XSS Sanitizer** | `lib/sanitize.js` — stripping event handler attributes di semua input user | 🔴 P0 | ✅ **TERPASANG** (commit `97b24a2`) |
| A-04 | ⬜ **.env.example** | Buat file `.env.example` — dokumentasi semua env var yang diperlukan (Supabase URL, dll) | 🟡 P1 | 🔴 BELUM |
| A-05 | ⬜ **Supabase RLS Policies** | Pastikan Row Level Security aktif untuk tabel `skm_responses` dan `laporan` | 🟡 P1 | ❓ Perlu Verifikasi |
| A-06 | ⬜ **CI/CD — Auto Deploy Verify** | GitHub Actions — jalankan `next build` otomatis tiap push ke `main` (cek error build) | 🟡 P1 | ❓ Perbaiki `.github/workflows/ci.yml` |
| A-07 | ⬜ **Error Tracking / Monitoring** | Integrasi error logging — sentry atau fallback console.error ke Supabase audit log | 🟢 P2 | 🔴 BELUM |

---

## 🛠️ B. Fase Fondasi (P1 — Next Sprint)

### B-1. F-07: Visual Chain PPB di Beranda (`/`)

**Goal:** Ganti `<details>` PPB dengan visual chain interaktif hirarkis.

| Task | File | Estimasi |
|------|------|----------|
| T-01 | Buat komponen `<PPBChain />` baru — visual chain 3 level (L0 → L1 → L2) | `components/PPBChain.js` | ⏱ 3 jam |
| T-02 | Integrasi ke `pages/index.js` — ganti bagian 4 `<details>` PPB saat ini | `pages/index.js` | ⏱ 1 jam |
| T-03 | State interaktif — L0 aktif, klik L1 → expand L2 connection | `components/PPBChain.js` | ⏱ 2 jam |
| T-04 | Data binding dari `data/pemdi.json` (struktur arsitektur PPB) | `data/pemdi.json` (existing) | ⏱ 1 jam |

**Kontribusi:** Indikator I-15 (Keterpaduan PPB) — bobot 4%

---

### B-2. F-08: Kalkulator Proyeksi Pemdi (`/pemdi`)

**Goal:** Slider interaktif simulasi kenaikan nilai per aspek.

| Task | File | Estimasi |
|------|------|----------|
| T-01 | Buat komponen `<PemdiCalculator />` — 7 slider aspek (A1-A7) dengan bobot | `components/PemdiCalculator.js` | ⏱ 3 jam |
| T-02 | Implementasi rumus: `Indeks = (0.10×A1)+(0.10×A2)+(0.15×A3)+(0.15×A4)+(0.10×A5)+(0.15×A6)+(0.25×A7)` | `components/PemdiCalculator.js` | ⏱ 1 jam |
| T-03 | Visual hasil — progress bar, badge predikat, delta dari baseline | `components/PemdiCalculator.js` | ⏱ 2 jam |
| T-04 | Integrasi ke halaman `/pemdi` — bagian baru setelah daftar 20 indikator | `pages/pemdi.js` | ⏱ 1 jam |

**Kontribusi:** Indikator I-1 (Tata Kelola Pemdi) — bobot 5%

---

### B-3. F-09: Rekomendasi Tracker (Beranda & `/pemdi`)

**Goal:** 7 rekomendasi prioritas + progress bar.

| Task | File | Estimasi |
|------|------|----------|
| T-01 | Buat komponen `<RekomendasiTracker />` — daftar 7 rekomendasi dengan status 🔴🟡🟢 | `components/RekomendasiTracker.js` | ⏱ 2 jam |
| T-02 | Progress bar (X/7 selesai) — visual persentase | `components/RekomendasiTracker.js` | ⏱ 1 jam |
| T-03 | Simpan status ke Supabase — `rekomendasi` table baru atau localStorage fallback | `lib/rekomendasi-db.js` (baru) | ⏱ 2 jam |
| T-04 | Integrasi ke Beranda (section setelah PPB chain) | `pages/index.js` | ⏱ 1 jam |

**Kontribusi:** Indikator I-1 (Tata Kelola) — bobot 5%

---

### B-4. F-10: Quick Rating SKM (Semua Halaman)

**Goal:** Prompt survey setelah 3+ kunjungan halaman — boost partisipasi SKM.

| Task | File | Estimasi |
|------|------|----------|
| T-01 | Buat komponen `<SkmPrompt />` — modal non-intrusive "Ada waktu 2 menit?" | `components/SkmPrompt.js` | ⏱ 2 jam |
| T-02 | Session counter — localStorage hitungan kunjungan halaman | `components/SkmPrompt.js` | ⏱ 1 jam |
| T-03 | Integrasi di `_app.js` — muncul setelah threshold 3 halaman | `pages/_app.js` | ⏱ 0,5 jam |
| T-04 | Link langsung ke form SKM `/skm` atau form inline | `components/SkmPrompt.js` | ⏱ 1 jam |

**Kontribusi:** Indikator I-20 (Pengelolaan Kepuasan) — bobot 15%

---

### B-5. F-11: FAQ → Knowledge Base (`/faq`)

**Goal:** Kategorisasi FAQ + search + feedback 👍/👎.

| Task | File | Estimasi |
|------|------|----------|
| T-01 | Restruktur data FAQ — tambah field `kategori`, `artikel_terkait[]` | `data/faq.json` | ⏱ 1 jam |
| T-02 | Kategori tabs/accordion di `/faq` | `pages/faq.js` | ⏱ 2 jam |
| T-03 | "Apakah ini membantu?" 👍/👎 — track ke Supabase | `components/FaqFeedback.js` (baru) | ⏱ 2 jam |
| T-04 | Search enhancement — filter by kategori | `pages/faq.js` | ⏱ 1 jam |

**Kontribusi:** Indikator I-19 (Fasilitas Dukungan Pengguna) — bobot 10%

---

### B-6. F-12: Halaman `/bantuan` (Halaman Baru)

**Goal:** Pusat bantuan — FAQ, SLA, kontak, status sistem.

| Task | File | Estimasi |
|------|------|----------|
| T-01 | Buat halaman `/bantuan` — layout pusat bantuan | `pages/bantuan.js` (baru) | ⏱ 2 jam |
| T-02 | Tabel SLA per layanan — data dari `data/layanan.json` | `pages/bantuan.js` | ⏱ 1 jam |
| T-03 | Kontak helpdesk — dinamis dari config | `pages/bantuan.js` | ⏱ 0,5 jam |
| T-04 | Status sistem (uptime) — static atau manual | `pages/bantuan.js` | ⏱ 1 jam |
| T-05 | Link SP4N LAPOR + embed | `pages/bantuan.js` | ⏱ 0,5 jam |
| T-06 | Tambah ke navigasi (Header/Sidebar) | `components/Header.js`, `components/Sidebar.js` | ⏱ 0,5 jam |

**Kontribusi:** Indikator I-19 (Fasilitas Dukungan) — bobot 10%

---

## 🔧 C. Fase Lengkap (P2 — Minggu 2-4)

### C-1. F-13: Open Data `/data` (Halaman Baru)

| Task | File | Estimasi |
|------|------|----------|
| T-01 | Buat halaman `/data` — daftar dataset publik | `pages/data.js` (baru) | ⏱ 3 jam |
| T-02 | Metadata per dataset (nama, sumber, update, format, download link) | `data/dataset.json` (baru) | ⏱ 2 jam |
| T-03 | Link ke portal Satu Data Indonesia + JDIH | `pages/data.js` | ⏱ 1 jam |

**Kontribusi:** I-5 (Tata Kelola Data) — bobot 5%

---

### C-2. F-14: Glosarium Enhanced (`/glosarium`)

| Task | File | Estimasi |
|------|------|----------|
| T-01 | Tambah field `kategori` di `data/glosarium.json` | `data/glosarium.json` | ⏱ 1 jam |
| T-02 | Filter by kategori + search enhancement | `pages/glosarium.js` | ⏱ 2 jam |
| T-03 | "Istilah terkait" — link antar istilah | `pages/glosarium.js` | ⏱ 1 jam |

**Kontribusi:** I-19 (Fasilitas Dukungan) — bobot 10%

---

### C-3. F-15: Evidence Checklist (`/pemdi`)

| Task | File | Estimasi |
|------|------|----------|
| T-01 | Buat komponen `<EvidenceChecklist />` — per indikator | `components/EvidenceChecklist.js` | ⏱ 2 jam |
| T-02 | Status checklist — terkoneksi ke Supabase atau JSON | `lib/evidence-db.js` (baru) | ⏱ 2 jam |
| T-03 | Filter — tampilkan yang belum lengkap saja | `components/EvidenceChecklist.js` | ⏱ 1 jam |

**Kontribusi:** Semua indikator — tool internal

---

### C-4. F-16: Roadmap Countdown (Beranda)

| Task | File | Estimasi |
|------|------|----------|
| T-01 | Buat komponen `<CountdownTimer />` — target Fase 4 (12 bulan) | `components/CountdownTimer.js` | ⏱ 1 jam |
| T-02 | Integrasi ke Beranda — section footer | `pages/index.js` | ⏱ 0,5 jam |

**Kontribusi:** I-1 (Tata Kelola) — bobot 5%

---

### C-5. F-17: PDP Compliance (`/kebijakan-privasi`)

| Task | File | Estimasi |
|------|------|----------|
| T-01 | Perkuat halaman dengan UU 27/2022 — dasar hukum, hak subjek data | `pages/kebijakan-privasi.js` | ⏱ 1 jam |
| T-02 | Mekanisme consent — cookie/info banner | `components/ConsentBanner.js` (baru) | ⏱ 1 jam |
| T-03 | Kontak PPDP | `pages/kebijakan-privasi.js` | ⏱ 0,5 jam |

**Kontribusi:** I-8 (PDP) — bobot 2%

---

## 📊 D. Prioritas Perubahan — Ranking

| Rank | ID | Fitur | Bobot Pemdi | Effort | ROI |
|------|----|-------|-------------|--------|-----|
| 1 | **F-10** | Quick Rating SKM | **15%** | ⏱ ~4,5 jam | 🥇 **Tertinggi** |
| 2 | **F-12** | Halaman /bantuan | **10%** | ⏱ ~5,5 jam | 🥈 |
| 3 | **F-11** | FAQ → Knowledge Base | **10%** | ⏱ ~6 jam | 🥈 |
| 4 | **F-07** | Visual Chain PPB | 4% | ⏱ ~7 jam | 🥉 |
| 5 | **F-08** | Kalkulator Proyeksi Pemdi | 5% | ⏱ ~7 jam | 🥉 |
| 6 | **F-09** | Rekomendasi Tracker | 5% | ⏱ ~6 jam | 🥉 |
| 7 | **F-13** | Open Data /data | 5% | ⏱ ~6 jam | 🟢 |
| 8 | **F-14** | Glosarium Enhanced | 10% | ⏱ ~4 jam | 🟡 Partial |
| 9 | **F-15** | Evidence Checklist | — | ⏱ ~5 jam | 🟡 Internal tool |
| 10 | **F-16** | Roadmap Countdown | 5% | ⏱ ~1,5 jam | 🟢 Easy |
| 11 | **F-17** | PDP Compliance | 2% | ⏱ ~2,5 jam | 🟢 Regulatory |

**Prioritas Kerja:**
1. 🥇 **F-10** (ROI tertinggi — 15% bobot dengan 4,5 jam)
2. 🥇 **F-12** (10% bobot — halaman baru, dampak langsung)
3. 🥇 **F-11** (10% bobot — restruktur data existing)
4. 🥉 **F-08** + **F-09** (fondasi kalkulasi + tracking)
5. 🥉 **F-07** (visual — effort besar, bobot kecil tapi penting untuk completeness)
6. Sisanya sesuai estimasi

---

## 🔍 E. Temuan dari V1 Zip vs Produksi Saat Ini

Perbedaan signifikan antara V1 snapshot dan produksi saat ini:

| File V1 | Berubah di Produksi? | Catatan |
|---------|---------------------|---------|
| `components/AppShell.js` | ✅ **Berubah** | Quick Win updates |
| `components/DetailModal.js` | ✅ Berubah | — |
| `components/Footer.js` | ✅ Berubah | — |
| `components/LaporWidget.js` | ✅ Berubah | QW #3 — Status Tracker |
| `components/OPDTable.js` | ✅ Berubah | QW #6 — OPD detail pages |
| `components/ScrollTop.js` | ✅ Berubah | — |
| `components/Sidebar.js` | ✅ Berubah | — |
| `components/ThemeToggle.js` | ✅ Berubah | — |
| `data/layanan.json` | ✅ Berubah | Data update |
| `data/pemdi.json` | ✅ Berubah | 20 indikator data |
| `pages/cari.js` | ✅ Berubah | Search enhancement |
| `pages/index.js` | ✅ Berubah | Beranda + Rating Widget |
| `pages/pemdi.js` | ✅ Berubah | QW #5 — 20 indikator breakdown |
| `pages/skm.js` | ✅ Berubah | QW #2 — Dashboard SKM |
| `public/sitemap-0.xml` | ✅ Berubah | Regenerated |
| `styles/globals.css` | ✅ Berubah | CSS cleanup |

**Semua perubahan V1 → Produksi sudah di-push ke GitHub.** Tidak ada perubahan yang hilang.

---

## ⚠️ F. Potensi Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| **Rate limit Supabase** — Free tier punya batas request/jam | API lapor/feedback bisa error | ✅ Already implemented rate limiter (`lib/rate-limit-db.js`) |
| **Data OPD/ASN tidak sinkron** — data statis di `data/opd.json` bisa outdated | Informasi tidak akurat | Buat mekanisme update periodik via admin dashboard atau webhook |
| **Next.js 14 → 15 upgrade** — ketinggalan 2 major version | Security & perf issues | Rencana upgrade setelah Fase Fondasi selesai |
| **Supabase free tier DB size** (500MB) | Data SKM/laporan bisa overflow | Monitor usage, siapkan scaling plan |
| **OpenCode model gratis rate limit** — development terhambat | Delay pengerjaan | Distribusi task ke multi-tool (mimo, opencode, dll) |
| **Belum ada staging environment** | Risk deploy langsung ke prod | Tambah branch `develop` + Vercel preview deployment |

---

## 📁 G. Struktur File yang Akan Berubah

### File Baru
```
components/PPBChain.js          — F-07
components/PemdiCalculator.js   — F-08
components/RekomendasiTracker.js— F-09
components/SkmPrompt.js         — F-10
components/FaqFeedback.js       — F-11
components/EvidenceChecklist.js — F-15
components/CountdownTimer.js    — F-16
components/ConsentBanner.js     — F-17
pages/bantuan.js                — F-12 (baru)
pages/data.js                   — F-13 (baru)
lib/rekomendasi-db.js           — F-09 (baru)
lib/evidence-db.js              — F-15 (baru)
data/dataset.json               — F-13 (baru)
```

### File yang Dimodifikasi
```
pages/index.js                  — F-07, F-09, F-16
pages/pemdi.js                  — F-08, F-15
pages/_app.js                   — F-10
pages/faq.js                    — F-11
pages/glosarium.js              — F-14
pages/kebijakan-privasi.js      — F-17
components/Header.js            — F-12 (navigasi)
components/Sidebar.js           — F-12 (navigasi)
data/faq.json                   — F-11 (restruktur)
data/glosarium.json             — F-14 (tambah kategori)
```

---

## 🚀 H. Cara Eksekusi

### Per Sprint

**Sprint 1 — Fondasi (5-7 hari):**
1. F-10: Quick Rating SKM (ROI tertinggi, effort rendah) 🥇
2. F-12: Halaman /bantuan (baru, langsung kelihatan) 🥇
3. F-11: FAQ → Knowledge Base (restruktur data) 🥇

**Sprint 2 — Fondasi Lanjutan (5-7 hari):**
1. F-08: Kalkulator Proyeksi Pemdi
2. F-09: Rekomendasi Tracker
3. F-07: Visual Chain PPB

**Sprint 3 — Lengkap (5-7 hari):**
1. F-13: Open Data
2. F-14: Glosarium Enhanced
3. F-15: Evidence Checklist
4. F-16: Roadmap Countdown
5. F-17: PDP Compliance

---

## 📝 I. Catatan Teknis

- **Framework:** Next.js 14 (Pages Router) + React 18
- **Database:** Supabase (Postgres) — untuk data SKM, laporan, feedback
- **CSS:** Custom `globals.css` — tidak pakai Tailwind (sengaja)
- **Hosting:** Vercel (production)
- **Data statis:** JSON di `data/` — di-commit ke repo (transparan)
- **Search:** Fuse.js (client-side)
- **Auth:** Admin basic auth di `lib/adminAuth.js`

---
*Dokumen ini disusun berdasarkan analisis terhadap PemdiAcehTengah-V1.zip dan kode produksi saat ini.*
*Referensi: PRD_PORTAL_PEMDI.md, STRATEGI_PEMDIACEHTENGAH.md, MASTERPLAN.md*
