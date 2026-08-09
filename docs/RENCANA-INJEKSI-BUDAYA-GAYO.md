# RENCANA INJECSI BUDAYA GAYO — Frontend PemdiAcehTengah

> **Versi:** 1.0 · **Tanggal:** 10 Agustus 2026
> **Status:** ✍️ Draf — menunggu persetujuan
> **Arah (dari klarifikasi user):** Kombinasi Kerawang Gayo (identitas utama) + motif Nusantara (pendukung) · **Strategi:** All-in semua 17 halaman publik

---

## 1. Filosofi & Riset Budaya (Sumber: Fitinline, KI Komunal DJKI)

**Kerawang Gayo** = warisan budaya tak benda (2014), dari kata "Ker" (daya pikir) + "Rawang" (bayangan fenomena alam). Ukiran pertama lahir di **umah pitu ruang** (rumah adat Gayo), sentra pengrajin Desa Bebesen, Takengon.

| # | Motif | Makna | Aplikasi di UI |
|---|-------|-------|----------------|
| 1 | **Emun Berangkat** (awan) | Kesatuan, kerukunan, kesepakatan — dinamis, selalu bergerak | Section separator, hero background |
| 2 | **Puter Tali** (pilinan tali) | Persatuan, tolong-menolong, kejujuran, lurus | Border dekoratif, divider animasi |
| 3 | **Pucuk Rebung** (segitiga) | Teguh pendirian, iman, rendah hati; generasi baru terus tumbuh | Card corner, progress bar, logo aksen |
| 4 | **Tapak Seleman** | Kemegahan, keadilan, pengayoman | Stat card utama (KPI) |
| 5 | **Pagar** | Pertahanan, ketertiban sosial | Divider antar section |
| 6 | **Ulen** (bulan) | Kekuatan, penerangan | Icon dekoratif, dark mode |
| 7 | **Rante** (rantai) | Persatuan kukuh, keterpaduan | Integrasi / keterpaduan (I15-I18), timeline |

**Warna sakral (dasar kain hitam `item`):**
- **Using (Kuning padi)** → keadilan & kemakmuran — simbol Reje (pemimpin) → **akan jadi `--primary`**
- **Ijo (Hijau)** → musyawarah (genap mupakat), kejayaan → **`--ok` / aksen pertumbuhan**
- **Ilang (Merah)** → keberanian menegakkan kebenaran → **`--bad` / peringatan**
- **Poteh (Putih)** → kesucian, membedakan baik-buruk → **`--surface`**
- **Item (Hitam tanah)** → bumi, bekerja untuk rakyat → **`--ink` / dasar tema**
- **Emas** sudah ada (#C6A75E) — dipertahankan sebagai kuning gayo

---

## 2. Design Tokens Baru (globals.css)

```css
:root {
  /* Kerawang Gayo palette — menggantikan navy murni */
  --kg-hitam:    #0E1220;   /* item — dasar hitam tanah */
  --kg-kuning:   #D4A83C;   /* using — kuning padi (keadilan & kemakmuran) */
  --kg-hijau:    #2E7D5B;   /* ijo — musyawarah, kejayaan */
  --kg-merah:    #B3402E;   /* ilang — keberanian hukum */
  --kg-putih:    #F7F4EC;   /* poteh — kesucian */

  /* Pemetaan ke variabel existing (tanpa breaking change) */
  --primary:      var(--kg-kuning);   /* gold jadi identitas REJE */
  --primary-deep: #A8872B;
  --ok:           var(--kg-hijau);
  --bad:          var(--kg-merah);
  --ink:          var(--kg-hitam);
  --surface:      #FFFFFF;
  --surface-2:    #F5F2E8;   /* cream = dasar kain */
}
```

**Typeface (karya anak bangsa + terbaca):**
- Headings: **Plus Jakarta Sans** (karya Jakarta — bersih, modern, gov-appropriate) `serif` fallback
- Body: **Inter** (existing — pertahankan)
- Mono (angka/ID): **JetBrains Mono** (existing)
- Aksen display: hanya untuk angka besar KPI

---

## 3. Arsitektur Motif (SVG inline — zero dependency)

Folder baru `components/motif/`:
- `MotifEmun.js` — awan geometris (pattern, animated drift)
- `MotifPuterTali.js` — pilinan tali (border/divider, animated rotation)
- `MotifPucukRebung.js` — segitiga piramida (corner aksen)
- `MotifRante.js` — rantai lingkaran (keterpaduan, timeline)
- `MotifPagar.js` — batas seksi (divider)
- `KerawangBorder.js` — reusable SVG border card
- `NusantaraPattern.js` — motif kawung/parang/megamendung sebagai pendukung (section alternate)

Semua **inline SVG ber-resolusi tak hingga** (bukan PNG) — ringan, tajam di retina, animatable via CSS.

---

## 4. Sistem Animasi (tren populer 2025-2026, CSS-first + IntersectionObserver)

| Animasi | Teknik | Dipakai di |
|---------|--------|-----------|
| **Scroll reveal stagger** | IO + class (existing `data-reveal` — di-upgrade) | Semua section |
| **Count-up angka KPI** | Hook `useCountUp` custom (tanpa lib) | Indeks 0,44 · SPBE 2,59 · 33/232 |
| **Progress bar masuk saat scroll** | IO + transform scaleX | Aspek cards, checklist |
| **Glassmorphism + gradient border** | `::after` conic-gradient | Card utama, navbar |
| **Gradient mesh (aurora)** | CSS radial-gradient animasi | Hero, section alt |
| **Marquee ticker budaya** | CSS keyframes translateX | Banner kepala (nama motif + maknanya) |
| **Hover micro-interaction** | transform/color (tanpa layout shift) | Semua card & tombol |
| **Page transition fade-up** | AppShell wrapper | Semua navigasi |
| **Ember drift (emun berangkat)** | SVG animateTransform | Hero background |
| **prefers-reduced-motion** | Media query — matikan semua | ⚠️ WAJIB |

**Aturan emas (dari impeccable & ui-ux-pro-max):**
- Entrance-only (fire sekali) — UI statis setelahnya
- 150-300ms micro-interaction, ease cubic-bezier(0.16,1,0.3,1)
- Tanpa glow hover berlebihan (data tool — clarity > decoration)
- `backdrop-filter: blur` → WASPADA stacking context (modal di luar filter parent)
- Semua ikon tetap header emoji? → pertahankan emoji di navigasi KONTEN (sudah jadi pola), tapi ikon fungsional baru pakai inline SVG

---

## 5. Tahapan Eksekusi (All-in, 17 halaman)

### Fase 0 — Foundation (design system) [BLOCKING]
- [ ] 0.1 Update `globals.css`: tokens Kerawang Gayo, gradient mesh, glass card, reveal baru, reduced-motion
- [ ] 0.2 Buat `hooks/useCountUp.js` + `hooks/useInView.js`
- [ ] 0.3 Buat `components/motif/*` (7 komponen SVG)
- [ ] 0.4 Buat `components/MarqueeBatik.js` + `components/KerawangCard.js` (wrapping card)

### Fase 1 — Shell global
- [ ] 1.1 `Header.js` — glass gradient border, navbar sticky blur, logo crest + emblem pucuk rebung
- [ ] 1.2 `Footer.js` — divider kerawang pagar, quote filosofi Gayo ("Ratip musara anguk…")
- [ ] 1.3 `Sidebar.js` / `AppShell.js` — page transition fade, motif emun bg
- [ ] 1.4 `ScrollTop.js`, `LaporWidget.js`, `RatingWidget.js` — restyle konsisten

### Fase 2 — Home (`index.js`)
- [ ] 2.1 Hero: gradient mesh + emun drift + marquee motif
- [ ] 2.2 KPI cards: count-up + tapak seleman border
- [ ] 2.3 Quick actions / layanan unggulan: kerawang card hover
- [ ] 2.4 Section budaya: strip penjelasan motif (pendidikan budaya digital)

### Fase 3 — Data pages (pemdi, modul-indikator, spbe, probis, opd, dashboard-kepuasan)
- [ ] 3.1 `pemdi.js` — matrix aspek (kerawang card), KPI count-up, checklist (puter tali divider)
- [ ] 3.2 `modul-indikator.js` — level progress (pucuk rebung), status badges
- [ ] 3.3 `spbe.js` — gauge (ulen = bulan gauge), domain bars
- [ ] 3.4 `probis.js` — chain (rante = rantai keterpaduan!)
- [ ] 3.5 `opd.js` — tabel dengan motif pagar divider
- [ ] 3.6 `dashboard-kepuasan.js` — chart restyle

### Fase 4 — Layanan (layanan, cari, skm, tanya, faq, bantuan, lapor)
- [ ] 4.1 `layanan.js` — service cards kerawang, SLA badges
- [ ] 4.2 `cari.js` — hasil pencarian bertema
- [ ] 4.3 `skm.js`, `tanya.js`, `faq.js`, `bantuan.js`, `lapor.js` — form & panel restyle

### Fase 5 — Info pages (glosarium, requirement, kebijakan-privasi, 404)
- [ ] 5.1 Semua halaman info — typography & spacing, pattern nusantara section alt

### Fase 6 — QA Loop (tanpa kesalahan)
- [ ] 6.1 Build + zero-error
- [ ] 6.2 Dogfood audit (tool-driven) — semua halaman, semua interaksi
- [ ] 6.3 A11y check: kontras AA, focus-visible, keyboard nav, reduced-motion
- [ ] 6.4 Responsive: 375/768/1024/1440, no horizontal scroll
- [ ] 6.5 Dark/light kedua-duanya
- [ ] 6.6 Deploy Vercel + verifikasi production
- [ ] 6.7 **Loop 2**: audit ulang visual, refine, ulangi sampai bersih

---

## 6. Batasan (anti-blunder)

- ⚠️ **JANGAN ubah struktur data** — hanya presentasi. `pemdi.json`, `modul-indikator.json` tetap
- ⚠️ **JANGAN tambah dependency berat** — CSS + SVG + hooks only (framer-motion TIDAK, user prefer bebas & ringan)
- ⚠️ **Pertahankan konten/makna** — emoji di konten sah; restyle bukan rewrite konten
- ⚠️ **Filosofi jangan diputar** — warna mengikuti makna asli (hijau=musyawarah, merah=keberanian, dst), bukan asal cakup
- ✅ **Verifikasi-before-completion** — setiap fase selesai = build + kontrol visual

## 7. Hasil Akhir yang Diharapkan

1. Identitas visual khas **Kerawang Gayo Aceh Tengah** — bangga karya anak bangsa
2. Motif Nusantara sebagai pendukung (section alternatif) — "Indonesia yang berkembang"
3. Animasi modern populer (scroll reveal, count-up, glass, gradient mesh, marquee) — tanpa framework berat
4. Ciri khas "pemerintah berkembang": bersih, terpercaya, modern, berbudaya
5. 17 halaman konsisten satu design system — 0 bug, 0 error, aksesibel