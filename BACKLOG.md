# PemdiAcehTengah — Sub-BACKLOG

**Project:** Portal Pemda Aceh Tengah
**Priority:** P1 — Critical
**Master:** `BACKLOG.md` (root)

## ✅ Completed

- [x] **Capaian nilai sesuai rumus resmi PermenPANRB 8/2026** — lib/pemdiNilai.js (Indeks Aspek Σ(wI×N)/wA; Indeks Σ(wA×IA); predikat Tabel 4; indikator eksternal I5/I6/I7/I18 field `eksternal`); /pemdi panel perhitungan + 4 kartu tolak ukur; indeks terverifikasi 0,38; proyeksi target 2,29 & skenario 2,375/2,50 — 19 Agu 2026
- [x] **Matriks Kebutuhan Bukti Dukung L1-L2** — docs/analisis-bukti-dukung-l1-l2.md (sumber NotebookLM dari Diskominfo) → data/kebutuhan-bukti-dukung.json (48 butir × 16 indikator; 10 lengkap · 19 belum · 19 perlu verifikasi) → section /modul-indikator#matriks-kebutuhan + tabel Panduan Bab 6 — 19 Agu 2026
- [x] **6 Quick Win 100%** — 52 OPD, 70 pages, 0 ESLint warnings — @pemdi-aceh-tengah
- [x] **Redesign UI Fase 0–5 (Kerawang Gayo)** — @pemdi-aceh-tengah
  - Fase 0: Tokens + motif SVG Kerawang Gayo, hook useMemo fix di /pemdi
  - Fase 1: Shell — Kerawang divider footer, motif ulen gov-strip, page transition, topbar gold
  - Fase 2: Home — hero aurora+emun, count-up KPI, marquee budaya, reveal-bar aspek
  - Fase 3: Data pages — pemdi, modul-indikator, spbe, probis, opd, dashboard-kepuasan
  - Fase 4: Layanan — layanan, cari, skm, faq, bantuan, lapor, tanya (hero Kerawang)
  - Fase 5: Info — glosarium, requirement, kebijakan-privasi, 404 (motif Kerawang)
- [x] **Fix QA anti-fail** — useCountUp/useInView (SSR target, fallback timeout), requirement.js CSR→SSR, data/requirement.json — console production 0 error
- [x] **Ground Truth NotebookLM** — 20 indikator (I1–I20), 222 item data dukung di `data/modul-indikator.json`; I5/I6/I7/I18 dikosongkan sesuai strategi (auto-scored + rawan tolak)

## 🟡 P2 — Active

- [ ] **Mengejar bukti dukung 2026** — gap 199/232 item (33 lengkap, 14%). Prioritas bobot: Kepuasan 25% → Data/Keamanan/Keterpaduan 15% → dll. PIC OPD per indikator sudah tampil di /pemdi
- [ ] **Backup ritme git** — push ke origin tiap akhir sesi kerja (sempat tertinggal 3 commit; sudah disinkronkan 10 Agu 2026)

## 🔄 Future

- [ ] **Phase Fondasi** — Pengembangan lebih lanjut portal — @pemdi-aceh-tengah

---

*Terakhir diperbarui: 10 Agu 2026 — Sinkronisasi git + backlog + dokumentasi env*
