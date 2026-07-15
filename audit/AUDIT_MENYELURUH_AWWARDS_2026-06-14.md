# Audit Menyeluruh & Roadmap Awwwards/Webby — Pemdi Aceh Tengah

- **Live:** https://pemdi-aceh-tengah.vercel.app
- **Repo:** https://github.com/Niumination/PemdiAcehTengah
- **Tanggal:** 14 Juni 2026
- **Target:** Tier pemenang [Webby Government](https://winners.webbyawards.com/winners) / [Awwwards](https://www.awwwards.com/)

---

## RINGKASAN EKSEKUTIF

Portal **fungsional & konten kuat** (Next.js 14 + Supabase). Live site: security headers ✅, PWA ✅, sitemap ✅, form lapor/SKM tersimpan ✅.

Gap ke tier award: **polish UI/UX**, **a11y form**, **performa bundle**, **motion design**, **DOX stale**.

| Dimensi | Skor | Target |
|---------|------|--------|
| Konten | 8.5 | 9.5 |
| UI/UX | 6.5→7.5* | 9.5 |
| A11y | 7→7.5* | 9.5 |
| Performa | 6 | 9 |
| SEO | 8 | 9.5 |

*Setelah perbaikan sesi ini

---

## PERBAIKAN DITERAPKAN (14 Juni 2026)

| File | Fix |
|------|-----|
| `LaporWidget.js` | `lain`→`lainnya`, focus trap, aria-labels |
| `DetailModal.js` | role=dialog, focus trap |
| `AppShell.js` | gov-strip, Footer, ScrollTop, event lapor |
| `ThemeToggle.js` | Hapus CSS konflik globals.css |
| `index.js` | hero id, layanan dinamis, kartu Lapor→modal |
| `skm.js` | Copy skala 1–4 |
| `layanan.json` | Ringkasan 25/12/13 |
| `cari.js` | meta description + hero token |
| `404.js` | Halaman 404 branded |
| `globals.css` | Brand #004098, footer, scroll-top, gov-strip |

---

## TEMUAN LIVE (SISA)

| ID | Pri | Temuan | Hermes |
|----|-----|--------|--------|
| L-05 | 🟡 | Tracking laporan placeholder | F3 |
| L-06 | 🟡 | Turnstile belum aktif | F4 |
| L-07 | 🟡 | SKM unit BAPENDA/Takengon stale | F5 |
| L-08 | 🟡 | Input search tanpa label | F1 |
| L-09 | 🟡 | Bundle opd.json besar | F6 |
| L-10 | 🟡 | No service worker | F6 |
| L-11 | 🟡 | Emoji nav vs SVG icons | F7 |
| L-12 | 🟡 | DOX AGENTS.md stale | F5 |

---

## PROMPT HERMES — deepseek-v4-flash-free

Jalankan berurutan. Clone repo, baca AGENTS.md, `npm run build` tiap fase.

### FASE 1 — Aksesibilitas Form
```
Portal Pemdi Aceh Tengah Next.js 14. Tugas: (1) label htmlFor pada input search OPDTable & layanan.js; (2) skm.js fieldset/legend + keyboard radio; (3) probis.js div→button+keyboard; (4) audit kontras badge light/dark WCAG 4.5:1; (5) ScrollTop offset mobile vs FAB. Update pages/AGENTS.md. npm run build.
```

### FASE 2 — Design System #004098
```
Grep hardcoded #0a4d8c #1d70b8 → var(--primary). Sync manifest theme_color. Migrasi styled-jsx requirement.js ke globals.css. Update styles/AGENTS.md token v2. Zero inline gradient di pages. npm run build.
```

### FASE 3 — Lapor Tracking + SKM UX
```
GET /api/lapor?id= wire ke tab Lacak LaporWidget. Status enum konsisten admin PATCH. skm success screen tampilkan ringkasan skor. index.js pakai pemdi.json aspek[].singkat. Update pages/api/AGENTS.md.
```

### FASE 4 — Keamanan Turnstile
```
Cloudflare Turnstile di LaporWidget+skm+api validasi. CORS /api/lapor SITE_ORIGIN bukan *. Sanitasi HTML server lib/security.js. Dokumentasi env README+lib/AGENTS.md.
```

### FASE 5 — Data & DOX Sync
```
Fix skm.json unit vs opd.daftar. data/AGENTS.md ASN 4507 layanan 25. Sync components/pages/styles AGENTS.md AppShell v2. Hapus/tandai legacy components. Root AGENTS versi next/react akurat.
```

### FASE 6 — Performa & PWA
```
dynamic import probis/pemdi. Pecah opd.json. Service worker cache shell. Lighthouse Performance≥90 A11y≥95. Update public/AGENTS.md.
```

### FASE 7 — UI Premium Awwwards
```
Hero mesh SVG stagger stats. Sidebar emoji→SVG icons. Reintegrasi SpbeGauge+ProbisSection premium. Typography clamp editorial. /pemdi radar animasi. Partner trust footer. Respect prefers-reduced-motion. Update desain/PANDUAN_DESAIN_UIUX.md.
```

### FASE 8 — SEO Structured Data
```
JSON-LD WebSite SearchAction /cari. ItemList /layanan. GovernmentOrganization /opd/[slug]. Clean title emoji. next-sitemap verify.
```

### FASE 9 — QA Final
```
Matrix 15 hal×light/dark×mobile. curl API+headers. Form lapor all kategori+skm+admin. npm run build 65+ pages. audit/HASIL_VERIFIKASI V3.
```

---

## VERIFIKASI

```bash
curl -sI https://pemdi-aceh-tengah.vercel.app/ | grep -iE 'content-security|x-frame'
curl -s -X POST https://pemdi-aceh-tengah.vercel.app/api/lapor \
  -H "Content-Type: application/json" \
  -d '{"kategori":"lainnya","pesan":"test"}'
npm run build
```

---

## REFERENSI

- `audit/LAPORAN_AUDIT_PemdiAcehTengah.md`
- `audit/HASIL_VERIFIKASI_PerbaikanV2.md`
- `desain/PANDUAN_DESAIN_UIUX.md`
- `docs/permenpanrb 8 2026.pdf`
