# pages/ — DOX

## Purpose
Halaman Next.js — entry points untuk user. SSR/SSG hybrid dengan data dari file JSON statis.

**16 halaman real + 7 API routes**

## Ownership — 16 Halaman

| Route | File | Fungsi | Komponen Kunci |
|-------|------|--------|----------------|
| `/` | `index.js` | **Beranda** — AwardHero premium, QuickActions, SPBE gauge, OPD table, rekomendasi, LaporanStatus, TopographicBackdrop | AwardHero, QuickActions, OPDTable, SpbeGauge, ProbisSection, Rekomendasi, SlaBadge, LaporWidget, LaporanStatus, TopographicBackdrop, Header, Footer |
| `/pemdi` | `pemdi.js` | **Dashboard Pemdi** — 7 aspek 20 indikator, capaian terverifikasi rumus resmi (lib/pemdiNilai.js), panel 🧮 perhitungan + tolak ukur, checklist bukti per indikator, catatan mandiri | DetailModal, TopographicBackdrop, KerawangMotifs, useCountUp |
| `/modul-indikator` | `modul-indikator.js` | **Modul Indikator + Matriks Kebutuhan Bukti** — 20 modul kriteria L1-L5 (ground truth NotebookLM), bukti existing per level/dokumen kunci, section 📌 matriks kebutuhan L1-L2 (data/kebutuhan-bukti-dukung.json) | KerawangMotifs |
| `/opd/[slug]` | `opd/[slug].js` | Detail per OPD — 52 halaman statis (SSG) | OPDTable, SlaBadge |
| `/layanan` | `layanan.js` | **Direktori layanan** — 27 layanan, 7 kategori, ServiceFinder interaktif | ServiceFinder, ServiceCard, SlaBadge |
| `/probis` | `probis.js` | Peta Proses Bisnis Level 0-1-2 interaktif (78 proses) | DetailModal |
| `/spbe` | `spbe.js` | Dashboard SPBE — 47 indikator, 8 domain | SpbeGauge |
| `/skm` | `skm.js` | Survei Kepuasan Masyarakat (8 dimensi × 3 pertanyaan = 24 item) | — |
| `/faq` | `faq.js` | 15 FAQ (4 kategori) + accordion interaktif | Accordion |
| `/tanya` | `tanya.js` | Chatbot asisten virtual — cari jawaban dari FAQ | — |
| `/cari` | `cari.js` | Pencarian global — OPD, layanan, FAQ, real-time | — |
| `/glosarium` | `glosarium.js` | Istilah/Daftar glosarium interaktif | Accordion, GlossaryTooltip |
| `/requirement` | `requirement.js` | 83 requirements PPB, 12 kategori, 3 fase | Header, Footer |
| `/admin` | `admin.js` | Admin dashboard — ringkasan IKM, daftar laporan, data SKM | — |
| `/kebijakan-privasi` | `kebijakan-privasi.js` | **Kebijakan Privasi & Perlindungan Data** — 7 seksi, statis | — |
| `/404` | `404.js` | **Halaman Tidak Ditemukan** — illustrasi, QuickActions inline | — |
| `/_app` | `_app.js` | App wrapper — Layout, global styles, meta tags | Layout |
| `/_document` | `_document.js` | Document wrapper — font Inter, meta tags, PWA manifest | — |

### API Routes (7)
| Route | File | Methods | Fungsi | Status |
|-------|------|---------|--------|--------|
| `/api/opd` | `api/opd.js` | GET | Daftar lengkap OPD (52 entries) | ✅ |
| `/api/spbe` | `api/spbe.js` | GET | Data SPBE 2025 (47 indikator) | ✅ |
| `/api/requirement` | `api/requirement.js` | GET | 83 requirements PPB | ✅ |
| `/api/lapor` | `api/lapor.js` | POST • PATCH **• GET?id=xxx** | Laporan warga (CRUD) → Supabase | ✅ (GET baru di P1) |
| `/api/skm` | `api/skm.js` | GET • POST | Survei Kepuasan Masyarakat → Supabase | ✅ |
| `/api/admin/laporan` | `api/admin/laporan.js` | GET | Daftar laporan admin → Supabase | ✅ |
| `/api/admin/skm` | `api/admin/skm.js` | GET | Data SKM admin → Supabase | ✅ |

*(Detail API contracts lihat `api/AGENTS.md`)*

## Data Flow
```
data/opd.json ──► api/opd.js (REST)
              ──► index.js (getStaticProps)
              ──► opd/[slug].js (getStaticPaths + getStaticProps)
              
data/pemdi.json ──► pemdi.js (import langsung)
data/kebutuhan-bukti-dukung.json ──► modul-indikator.js (matriks kebutuhan L1-L2)
lib/pemdiNilai.js ──► pemdi.js, modul-indikator.js, PemdiCalculator (rumus resmi + predikat Tabel 4)
data/layanan.json ──► layanan.js
data/faq.json ────► faq.js, tanya.js, cari.js
data/skm.json ────► skm.js

Supabase ─────────► api/lapor.js (POST/PATCH/GET laporan)
                   ► api/skm.js (GET/POST survei SKM)
                   ► api/admin/laporan.js (GET admin laporan)
                   ► api/admin/skm.js (GET admin SKM)
                   ► admin.js (frontend via fetch ke /api/admin/*)
```

### Key Rules
- **SSG** untuk halaman static (`/opd/[slug]` — 52 halaman)
- **Import langsung** untuk data kecil (`pemdi.js` baca `data/pemdi.json`)
- **getStaticProps** untuk data besar (`index.js` baca `data/opd.json`)
- **API routes** untuk server-side data (`/api/opd`)
- **Supabase** untuk persist data dinamis — laporan warga & survei SKM
- **Admin API** memerlukan Bearer token (`ADMIN_TOKEN` env var)

## Work Guidance
- Halaman baru: buat `.js` di `pages/`, tambah route di Header, update komponen index, update DOX
- Halaman statis: export default function component
- SSG: export `getStaticProps` atau `getStaticPaths + getStaticProps`
- **Route naming**: lowercase, pakai `-` (kebab-case), slug tanpa spasi
- **styled-jsx** dihindari total (unreliable di Next.js 14 + Strict Mode + conditional mount)
- **Error handling**: setiap halaman harus graceful fallback (tidak crash seluruh app)

## Verification
- `npm run build` — harus sukses, 52 OPD + 16 pages lainnya = 69 total (Vercel)
- `curl -s -o /dev/null -w "%{http_code}" https://pemdi-aceh-tengah.vercel.app/` — HTTP 200
- API: curl semua 7 endpoint

## Child DOX Index
| Path | Scope |
|------|-------|
| `api/AGENTS.md` | REST API routes — 7 endpoint: opd, spbe, requirement, lapor, skm, admin/laporan, admin/skm |
