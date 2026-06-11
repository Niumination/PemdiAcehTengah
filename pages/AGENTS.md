# pages/ — DOX

## Purpose

Halaman Next.js — entry points untuk user. SSR/SSG hybrid dengan data dari file JSON statis.

## Ownership — 11 Halaman + 3 API

| Route | File | Fungsi | Komponen Kunci |
|-------|------|--------|----------------|
| `/` | `index.js` | Beranda: Hero, ProBis, SPBE Gauge, OPD Table, Rekomendasi, Tentang | SpbeGauge, ProbisSection, OPDTable, Rekomendasi, DataBadge |
| `/pemdi` | `pemdi.js` | Dashboard Pemdi — 7 aspek, 20 indikator, RadarChart SVG, modal detail + PIC | DetailModal, DataBadge |
| `/opd/[slug]` | `opd/[slug].js` | Halaman detail per OPD — 52 halaman statis (SSG) | OPDTable, SlaBadge |
| `/layanan` | `layanan.js` | Direktori 27 layanan publik per kategori + badge SLA | SlaBadge |
| `/probis` | `probis.js` | Peta Proses Bisnis Level 0-1-2 interaktif | DetailModal |
| `/skm` | `skm.js` | Survei Kepuasan Masyarakat (8 dimensi) | — |
| `/faq` | `faq.js` | 15 FAQ dalam 4 kategori, accordion | — |
| `/tanya` | `tanya.js` | Chatbot asisten virtual — cari jawaban di FAQ | — |
| `/cari` | `cari.js` | Pencarian global — cari OPD, layanan, FAQ | — |
| `/requirement` | `requirement.js` | 83 requirements PPB dalam 12 kategori, 3 fase | Header, Footer |
| `/_app` | `_app.js` | App wrapper — Layout component, global styles | Layout |
| `/_document` | `_document.js` | Document wrapper — font Inter `<link>`, meta tags | — |
| `/api/opd` | `api/opd.js` | REST API: GET semua OPD (JSON) | — |
| `/api/spbe` | `api/spbe.js` | REST API: GET data SPBE (JSON) | — |
| `/api/requirement` | `api/requirement.js` | REST API: GET 83 requirements (JSON) | — |

## Data Flow

```
data/opd.json ──► api/opd.js (REST)
              ──► index.js (getStaticProps)
              ──► opd/[slug].js (getStaticPaths + getStaticProps)
              
data/pemdi.json ──► pemdi.js (import langsung)
data/layanan.json ──► layanan.js
data/faq.json ────► faq.js, tanya.js, cari.js
data/skm.json ────► skm.js
```

### Key Rules
- **SSG** untuk halaman yang bisa static (`/opd/[slug]`)
- **Import langsung** untuk data yang kecil (`pemdi.js` baca `data/pemdi.json`)
- **getStaticProps** untuk data besar (`index.js` baca `data/opd.json`)
- **API routes** untuk data dari sisi server (`/api/opd`)

## Halaman Detail

### `/` — Beranda (index.js)
- **Sections** (urutan): Hero → ProBis (Peta Proses Bisnis) → SPBE (Indeks) → OPD (Table) → Rekomendasi
- **Data source**: `data/opd.json` via `getStaticProps`, `data/pemdi.json` via import
- **Components used**: ProbisSection, SpbeGauge, Rekomendasi, OPDTable, DataBadge
- **Special**: Pemdi score badge di hero — dihitung dari `pemdiData.aspek`

### `/pemdi` — Dashboard Pemdi (pemdi.js)
- **Data source**: `data/pemdi.json`
- **Features**: RadarChart (SVG native — no Recharts dependency), skor per aspek, hitung indeks real-time
- **Modal**: Klik aspek → DetailModal dengan 100% inline styles (EARLIER: `styled-jsx` bug)
- **PIC**: Setiap indikator menampilkan penanggung jawab (lead OPD, support OPD, tim)

### `/opd/[slug]` — Detail OPD (opd/[slug].js)
- **Build**: `getStaticPaths` → generate 52 halaman
- **Slug**: derived dari nama OPD (lowercase, strip non-alphanumeric)
- **Data**: Nama OPD, singkat, level, urusan, jumlah ASN
- **Status**: Static generation, revalidate tersedia via ISR

### `/layanan` — Direktori Layanan (layanan.js)
- **Data source**: `data/layanan.json` (27 layanan, 7 kategori)
- **Features**: Kartu layanan per kategori, badge SLA (SlaBadge component)
- **Note**: Data masih partial — 14 online, 13 offline

### `/skm` — Survei Kepuasan (skm.js)
- **Data source**: `data/skm.json` (8 dimensi)
- **⚠️ Critical**: `data/skm.json` has 0 pertanyaan — dimensi kosong, form tidak berfungsi

### `/cari` — Pencarian Global (cari.js)
- **Search scope**: OPD, layanan, FAQ
- **Implementation**: Client-side filter

### `/tanya` — Chatbot Asisten (tanya.js)
- **Function**: Cari jawaban dari FAQ via keyword matching
- **Data source**: `data/faq.json`

### `/requirement` — Requirements (requirement.js)
- **Content**: 83 item dalam 12 kategori, 3 fase implementasi
- **API endpoint**: `/api/requirement` — JSON lengkap

## Work Guidance
- Halaman baru: buat file `.js` di `pages/`, tambah route di `Header.js`, update README.md + pages/AGENTS.md ini
- Untuk SSR: export `getStaticProps` atau `getServerSideProps`
- Untuk static page: export default component
- **Route naming**: Jangan ada spasi atau uppercase di nama file slug
- **`styled-jsx`** dihindari total (terbukti unreliable di Next.js 14 + Strict Mode + conditional mount)

## Verification
- `npm run build` — harus sukses tanpa error (63 pages generated)
- `curl -s -o /dev/null -w "%{http_code}" https://pemdi-aceh-tengah.vercel.app/` — HTTP 200

## Child DOX Index
| Path | Scope |
|------|-------|
| `api/AGENTS.md` | REST API routes — opd, spbe, requirement |
