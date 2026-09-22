/**
 * lib/ruangKendali.js — Model tampilan Dashboard "Ruang Kendali" (Patch 1, 22 Sep 2026)
 *
 * Mengubah data/pemdi.json (+ catatan mandiri yang sudah digabung ke bukti_dukung)
 * menjadi struktur ringkas yang dipakai /dashboard, /indikator, /antrean dan drawer:
 *   - ringkasIndikator(pemdi)  → 20 baris {id, nama, aspek, bobot, levelDicapai, levelBerikut,
 *                                 eksternal, stat{diterima,revisi,draf,belum,total}, butir[]}
 *   - antreanButir(pemdi)      → butir bercatatan mandiri, urut prioritas → indikator
 *   - bebanPJ(antrean, daftarOPD) → beban per OPD (memakai lib/pjButir)
 *   - kunciPJ(teks)            → nama OPD utama dari teks PJ bebas
 *   - hariKe(iso, now)         → selisih hari (bulat ke atas) untuk hitung mundur
 *
 * Murni JS (tanpa React) supaya bisa diuji dengan node:test dan dipakai di getStaticProps.
 */
import { fokusLevel, statistikIndikator, nilaiIndikator } from './pemdiNilai.js';
import { hitungButirOPD } from './pjButir.js';

export const PRIORITAS_URUT = { tinggi: 0, sedang: 1, rendah: 2 };

/** Warna aspek (token CSS) berdasarkan id aspek 1..7. */
export function warnaAspek(idAspek) {
  return `var(--rk-asp${Math.min(7, Math.max(1, Number(idAspek) || 1))})`;
}

/** Nama OPD utama dari teks PJ bebas: "Diskominfo (Bidang APTIKA) + Bagian Hukum" → "Diskominfo". */
export function kunciPJ(teks = '') {
  return String(teks)
    .split(' (')[0]
    .split(' + ')[0]
    .split(' / ')[0]
    .split(',')[0]
    .split(' & ')[0]
    .replace(/\s+dan\s+.*$/i, '')
    .trim();
}

/** Kode portal I#-L#-## dari id GT.I1_L2_3 → "I1-L2-03". */
export function kodePortal(id = '') {
  const m = /^GT\.I(\d+)_L(\d+)_(\d+)$/.exec(id);
  if (!m) return id;
  return `I${m[1]}-L${m[2]}-${String(m[3]).padStart(2, '0')}`;
}

/** 20 baris indikator untuk Kompas / matriks. */
export function ringkasIndikator(pemdi) {
  const rows = [];
  for (const a of pemdi?.aspek || []) {
    for (const ind of a.indikator || []) {
      const f = fokusLevel(ind);
      const st = statistikIndikator(ind);
      const n = nilaiIndikator(ind);
      const perLevel = {};
      for (let l = 1; l <= 5; l += 1) perLevel[l] = { total: 0, diterima: 0, revisi: 0, draf: 0, belum: 0, proses: 0 };
      for (const b of ind.bukti_dukung || []) {
        const l = Number(b.level) || 1;
        if (!perLevel[l]) continue;
        perLevel[l].total += 1;
        perLevel[l][b.status in perLevel[l] ? b.status : 'belum'] += 1;
      }
      rows.push({
        id: ind.id,
        nama: ind.nama,
        aspekId: a.id,
        aspekNama: a.singkat || a.nama,
        bobot: ind.bobot,
        nilai: typeof n.nilai === 'number' ? n.nilai : Number(ind.nilai_aktual ?? ind.nilai ?? 0),
        levelDicapai: f.levelDicapai,
        levelBerikut: f.levelBerikut,
        eksternal: f.eksternal,
        pjLead: ind.penanggung_jawab?.lead || '',
        stat: { total: st.total, diterima: st.diterima, revisi: st.revisi, draf: st.draf, belum: st.belum, proses: st.proses },
        perLevel,
        catatanMandiri: (ind.bukti_dukung || []).filter((b) => b.catatan_mandiri).length,
      });
    }
  }
  return rows;
}

/** Semua butir bercatatan mandiri, siap ditampilkan sebagai antrean. */
export function antreanButir(pemdi) {
  const out = [];
  for (const a of pemdi?.aspek || []) {
    for (const ind of a.indikator || []) {
      for (const b of ind.bukti_dukung || []) {
        const cm = b.catatan_mandiri;
        if (!cm) continue;
        out.push({
          id: b.id,
          kode: kodePortal(b.id),
          level: Number(b.level) || 1,
          nama: b.nama,
          status: b.status || 'belum',
          jenis: cm.jenis || 'gap',
          prioritas: cm.prioritas || 'sedang',
          pj: cm.pj || '',
          pjKunci: kunciPJ(cm.pj || ''),
          // ringkas/kebutuhan lengkap ada di indikatorPenuh (drawer); di sini cukup cuplikan agar payload ringan
          ringkas: (cm.ringkas || '').slice(0, 160),
          kebutuhan: Array.isArray(cm.kebutuhan) ? cm.kebutuhan.slice(0, 1).map((k) => String(k).slice(0, 120)) : [],
          nKebutuhan: Array.isArray(cm.kebutuhan) ? cm.kebutuhan.length : 0,
          indikatorId: ind.id,
          indikatorNama: ind.nama,
          aspekId: a.id,
          aspekNama: a.singkat || a.nama,
          bobot: ind.bobot,
        });
      }
    }
  }
  out.sort((x, y) => {
    const p = (PRIORITAS_URUT[x.prioritas] ?? 9) - (PRIORITAS_URUT[y.prioritas] ?? 9);
    if (p) return p;
    // bobot indikator besar dulu, lalu urutan indikator
    if (y.bobot !== x.bobot) return y.bobot - x.bobot;
    return String(x.id).localeCompare(String(y.id), 'id');
  });
  return out;
}

/** Beban per OPD: hanya OPD yang punya ≥1 butir (keputusan pemilik 22 Sep 2026). */
export function bebanPJ(antrean, daftarOPD) {
  const daftarPJ = antrean.map((b) => b.pj);
  const rows = [];
  for (const o of daftarOPD || []) {
    const total = hitungButirOPD(o, daftarPJ);
    if (!total) continue;
    const bagi = { tinggi: 0, sedang: 0, rendah: 0 };
    for (const b of antrean) {
      if (hitungButirOPD(o, [b.pj])) bagi[b.prioritas in bagi ? b.prioritas : 'sedang'] += 1;
    }
    rows.push({ id: o.id ?? o.nama, singkat: o.singkat || o.nama, nama: o.nama, total, ...bagi });
  }
  rows.sort((a, b) => b.total - a.total || a.singkat.localeCompare(b.singkat, 'id'));
  return rows;
}

/** Filter antrean ke satu OPD (memakai alias pjButir agar "Walidata" tetap = Diskominfo). */
export function antreanUntukOPD(antrean, opd) {
  if (!opd) return antrean;
  return antrean.filter((b) => hitungButirOPD(opd, [b.pj]) > 0);
}

/** Selisih hari kalender (WIB) dari `now` ke tanggal ISO `yyyy-mm-dd`; negatif bila lewat. */
export function hariKe(iso, now = new Date()) {
  const target = new Date(`${iso}T00:00:00+07:00`);
  const awal = new Date(now);
  return Math.ceil((target - awal) / 86400000);
}

/** Format angka id-ID dua desimal. */
export function fmt2(n) {
  return Number(n || 0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
