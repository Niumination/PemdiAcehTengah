# pages/ — DOX

## Purpose
Halaman Next.js Pages Router — entry points untuk user. SSG untuk konten statis (data JSON), client-side fetch untuk data dinamis (Supabase via API routes).

**20 route halaman + 12 API routes** *(DOX pass hardening 2026-09-17 — sebelumnya mengandung referensi komponen yang sudah dihapus)*

## Ownership — Halaman

| Route | File | Fungsi | Komponen Kunci |
|-------|------|--------|----------------|
| `/` | `index.js` | **Beranda** — mode internal (default): hanya `BerandaAsesor`, tanpa switcher. Bila `NEXT_PUBLIC_PERSONA_PUBLIK=on`: dual-persona (`?view=publik` default · `?view=asesor`). Publik: HeroPublik, 6 SektorLayanan, task hub, ServiceFinder, DashboardSKM — tanpa metrik birokrasi. Asesor: hero kokpit, KpiCards, gauge SPBE + AspekAccordion 7 aspek, PPB, OPDTable. Kedua panel SSR (`hidden`) di `.persona-stage` | PersonaSwitcher, usePersona, HeroPublik, SektorLayanan, KpiCards, AspekAccordion, OPDTable, SpbeGauge, ServiceFinder, DashboardSKM, GlossaryTooltip |
| `/pemdi` | `pemdi.js` | **Kokpit Pemdi (B1)** — 7 aspek × 20 indikator, **Simulasi Penilaian Mandiri** (hanya bukti `diterima`; lib/pemdiNilai.js), hero menampilkan ringkasan Tahap 1 eval.spbe.go.id, checklist bukti berkode `I#-L#-##` + baris 🔁 revisi dengan catatan asesor | DetailModal, KerawangDivider, CatatanTujuan |
| `/modul-indikator` | `modul-indikator.js` | **Modul Indikator + Matriks Kebutuhan Bukti** — 20 modul kriteria L1–L5 (ground truth), bukti per level, matriks kebutuhan L1–L2 | KerawangMotifs |
| `/opd` | `opd/index.js` | Indeks 52 Perangkat Daerah + layanan per OPD | OPDTable, KerawangMotifs |
| `/opd/[slug]` | `opd/[slug].js` | Detail per OPD — 52 halaman statis (SSG, `fallback: false`) | KerawangMotifs (via hero class) |
| `/layanan` | `layanan.js` | **Direktori layanan** — 25 layanan, 7 kategori | ServiceFinder, ServiceCard, SlaBadge |
| `/probis` | `probis.js` | Peta Proses Bisnis Level 0-1-2 interaktif (8 misi → 35 urusan → 78 proses) | DetailModal |
| `/spbe` | `spbe.js` | Dashboard SPBE 2025 — 4 domain (baseline laporan pemantauan) | SpbeGauge |
| `/skm` | `skm.js` | Survei Kepuasan Masyarakat — 8 dimensi skala 1–4, 43 unit layanan | KerawangMotifs |
| `/faq` | `faq.js` | 15 FAQ (4 kategori), jawaban kaya-link via sanitizeHtml | GlossaryTooltip |
| `/tanya` | `tanya.js` | Chatbot asisten virtual — pencocokan token terhadap korpus FAQ | KerawangMotifs |
| `/cari` | `cari.js` | Pencarian global Fuse.js — OPD, layanan, FAQ (index dibangun di getStaticProps) | — |
| `/glosarium` | `glosarium.js` | Glosarium istilah digital interaktif | GlossaryTooltip |
| `/bantuan` | `bantuan.js` | Pusat bantuan — FAQ + layanan | — |
| `/lapor` | `lapor.js` | Lapor & pengaduan — form + tracking ID + SP4N banner | TrackerStatus, Sp4nBanner, LaporWidget |
| `/dashboard-kepuasan` | `dashboard-kepuasan.js` | Dashboard publik hasil SKM + rating (I20) | DashboardSKM |
| `/requirement` | `requirement.js` | **Draf Bukti Dukung Prioritas** — tab Pemdi (19 revisi asesor + 24 butir gap, dari `draf-bukti-prioritas.json`) · tab PPB (83 requirements, 12 kategori) · panduan L1 | KerawangMotifs |
| `/admin` | `admin.js` | Admin dashboard — login Bearer, laporan + SKM | — |
| `/kebijakan-privasi` | `kebijakan-privasi.js` | Kebijakan Privasi & Perlindungan Data (UU PDP) | — |
| `/404` | `404.js` | Halaman tidak ditemukan | — |
| `/_app` | `_app.js` | App wrapper — AppShell, canonical + og:url dinamis, meta PWA, JSON-LD, Analytics | AppShell, SkmPrompt |
| `/_document` | `_document.js` | Document wrapper — font Plus Jakarta Sans (Google Fonts), theme FOUC guard, meta dasar | — |

### API Routes (12)

| Route | File | Methods | Fungsi | Auth |
|-------|------|---------|--------|------|
| `/api/health` | `api/health.js` | GET | Health check app + DB (dipantau uptime monitor) | — |
| `/api/opd` | `api/opd.js` | GET | Daftar lengkap OPD (52) | — |
| `/api/spbe` | `api/spbe.js` | GET | Data SPBE 2025 | — |
| `/api/requirement` | `api/requirement.js` | GET | 83 requirements PPB | — |
| `/api/lapor` | `api/lapor.js` | POST • PATCH | Kirim laporan warga / update status admin → Supabase | PATCH: Bearer |
| `/api/lapor/status` | `api/lapor/status.js` | GET | Tracking status by ID (rate-limit 10/menit) | — |
| `/api/skm` | `api/skm.js` | GET • POST | Ringkasan & submit survei SKM → Supabase | — |
| `/api/skm/stats` | `api/skm/stats.js` | GET | Statistik SKM (RPC `skm_stats_dimensi` / fallback 1 query) + tren + rating | — |
| `/api/feedback` | `api/feedback.js` | GET • POST | Rating halaman ★ → Supabase | — |
| `/api/proxy-pdf` | `api/proxy-pdf.js` | GET | Proxy PDF JDIH (whitelist host + content-type) | — |
| `/api/admin/laporan` | `api/admin/laporan.js` | GET | Daftar laporan — admin | Bearer |
| `/api/admin/skm` | `api/admin/skm.js` | GET | Data SKM — admin | Bearer |

## Data Flow
```
data/opd.json ──► api/opd.js (REST), index.js, opd/index.js, opd/[slug].js (SSG)
data/pemdi.json ──► pemdi.js, index.js, PemdiCalculator utilities (import langsung)
data/modul-indikator.json + dokumen-kunci + bukti-mapping + kebutuhan ──► pemdi.js, modul-indikator.js
data/layanan.json ──► layanan.js, index.js, opd/index.js, search-index
data/faq.json ────► faq.js, tanya.js, bantuan.js, search-index
data/skm.json ────► skm.js, search-index
lib/pemdiNilai.js ──► pemdi.js, modul-indikator.js, test/pemdiNilai.test.mjs (rumus resmi + predikat Tabel 4)

Supabase (service role, SERVER-ONLY) ──► api/lapor.js, api/lapor/status.js, api/skm.js,
                                          api/skm/stats.js, api/feedback.js, api/admin/*,
                                          api/health.js, lib/rate-limit-db.js
```

### Key Rules
- **SSG** untuk halaman statis (`/opd/[slug]` — 52 halaman, `fallback: false`)
- **getStaticProps** untuk data besar & search index (`index.js`, `cari.js`)
- **API routes** untuk data dinamis & server-side (Supabase tidak pernah diakses dari client)
- **Admin API** memerlukan Bearer token (env `ADMIN_PASSWORD`; `ADMIN_TOKEN` legacy dihapus 18 Sep 2026) — compare constant-time
- **Rate limit** semua endpoint tulis publik + `/api/lapor/status` (RPC atomic `bump_rate_limit`)
- **Health**: `GET /api/health` → 200 sehat / 503 gagal — pantau dengan uptime monitor

## Work Guidance
- Halaman baru: buat `.js` di `pages/`, tambahkan link di `Sidebar.js` + label breadcrumb di `AppShell.js`, update DOX
- Route naming: kebab-case
- styled-jsx dihindari (unreliable di Next 14 + Strict Mode + conditional mount)
- Error handling: setiap halaman harus graceful fallback
- **Test**: perubahan pada lib/pemdiNilai.js atau data/pemdi.json wajib `npm test` hijau (16 pin rumus termasuk indeks 0,35 & 232 bukti (18/19/0/12/183), dari 20 tes suite)
- **Status bukti**: gunakan `STATUS_META`/`statistikIndikator` dari `lib/pemdiNilai.js` — jangan definisikan ulang di halaman. `/requirement` = **Draf Bukti Dukung Prioritas** (tab `pemdi`, data `draf-bukti-prioritas.json`) + tab `ppb` (83 kebutuhan PPB, data `requirement.json`)

## Verification
- `npm run lint` — 0 error (4 warning `<img>` di modul-indikator dikenal)
- `npm test` — 20/20 pass (16 rumus Pemdi + 4 requirement)
- `npm run build` — sukses, semua route ter-generate


## Mode internal (21 Sep 2026)

`middleware.js` (root) me-404-kan rute publik saat `NEXT_PUBLIC_PERSONA_PUBLIK` bukan `on`: `/layanan /skm /lapor /faq /tanya /bantuan /dashboard-kepuasan /kebijakan-privasi /admin` dan API `/api/lapor* /api/skm* /api/feedback /api/admin*`. Berkas halamannya **tetap ada** di repo (jangan dihapus) — daftar rute di `lib/modeSitus.js`.
