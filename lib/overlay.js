/**
 * lib/overlay.js — Gabungkan overlay CMS (Postgres) ke data dasar JSON (murni, teruji).
 * JSON tetap sumber dasar; DB hanya menimpa bidang yang boleh diedit:
 *   butir: status, catatan_mandiri.{ringkas,pj,prioritas,kebutuhan}
 *   konten: marquee, pengumuman, tenggat
 * Nama butir/kriteria PermenPANRB 8/2026 TIDAK pernah ditimpa.
 */
export const STATUS_SAH = ['diterima', 'revisi', 'proses', 'draf', 'belum'];
export const PRIORITAS_SAH = ['tinggi', 'sedang', 'rendah'];
export const KONTEN_SAH = {
  marquee: { tipe: 'teks', maks: 400, label: 'Running text bar atas' },
  pengumuman: { tipe: 'teks', maks: 600, label: 'Pengumuman di dashboard (kosongkan untuk sembunyikan)' },
  tenggat: { tipe: 'tanggal', label: 'Tenggat revisi internal (YYYY-MM-DD)' },
};

/** Validasi patch butir; kembalikan {ok, patch|error}. */
export function validasiPatchButir(masuk = {}) {
  const p = {};
  if (masuk.status !== undefined) {
    if (!STATUS_SAH.includes(masuk.status)) return { ok: false, error: `status harus salah satu: ${STATUS_SAH.join(', ')}` };
    p.status = masuk.status;
  }
  if (masuk.prioritas !== undefined) {
    if (!PRIORITAS_SAH.includes(masuk.prioritas)) return { ok: false, error: `prioritas harus: ${PRIORITAS_SAH.join(', ')}` };
    p.prioritas = masuk.prioritas;
  }
  if (masuk.ringkas !== undefined) {
    if (typeof masuk.ringkas !== 'string' || masuk.ringkas.length > 4000) return { ok: false, error: 'ringkas harus teks ≤ 4000 karakter' };
    p.ringkas = masuk.ringkas.trim();
  }
  if (masuk.pj !== undefined) {
    if (typeof masuk.pj !== 'string' || masuk.pj.length > 200) return { ok: false, error: 'pj harus teks ≤ 200 karakter' };
    p.pj = masuk.pj.trim();
  }
  if (masuk.kebutuhan !== undefined) {
    if (!Array.isArray(masuk.kebutuhan) || masuk.kebutuhan.length > 20 || masuk.kebutuhan.some((k) => typeof k !== 'string' || k.length > 500)) {
      return { ok: false, error: 'kebutuhan harus daftar ≤ 20 teks (≤ 500 karakter)' };
    }
    p.kebutuhan = masuk.kebutuhan.map((k) => k.trim()).filter(Boolean);
  }
  if (!Object.keys(p).length) return { ok: false, error: 'Tidak ada bidang yang diubah' };
  return { ok: true, patch: p };
}

export function validasiKonten(kunci, nilai) {
  const m = KONTEN_SAH[kunci];
  if (!m) return { ok: false, error: 'kunci konten tidak dikenal' };
  if (m.tipe === 'teks') {
    if (typeof nilai !== 'string' || nilai.length > m.maks) return { ok: false, error: `teks ≤ ${m.maks} karakter` };
    return { ok: true, nilai: nilai.trim() };
  }
  if (m.tipe === 'tanggal') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(nilai)) || Number.isNaN(Date.parse(nilai))) return { ok: false, error: 'format tanggal YYYY-MM-DD' };
    return { ok: true, nilai: String(nilai) };
  }
  return { ok: false, error: 'tipe tidak didukung' };
}

/**
 * Terapkan baris overlay ke salinan dalam pemdi.json.
 * @param {object} pemdi data/pemdi.json
 * @param {Array} baris [{id,status,ringkas,pj,prioritas,kebutuhan,diubah_oleh,diubah_pada}]
 * @returns {{pemdi: object, diterapkan: number}}
 */
export function terapkanOverlay(pemdi, baris = []) {
  if (!baris.length) return { pemdi, diterapkan: 0 };
  const peta = new Map(baris.map((r) => [r.id, r]));
  let n = 0;
  const salin = {
    ...pemdi,
    aspek: (pemdi.aspek || []).map((a) => ({
      ...a,
      indikator: (a.indikator || []).map((ind) => ({
        ...ind,
        bukti_dukung: (ind.bukti_dukung || []).map((b) => {
          const o = peta.get(b.id);
          if (!o) return b;
          n += 1;
          const cm = b.catatan_mandiri || (o.ringkas || o.pj || o.prioritas || o.kebutuhan ? { jenis: b.status === 'revisi' ? 'revisi' : 'gap', rujukan: [] } : null);
          return {
            ...b,
            status: o.status || b.status,
            catatan_mandiri: cm ? {
              ...cm,
              ringkas: o.ringkas ?? cm.ringkas,
              pj: o.pj ?? cm.pj,
              prioritas: o.prioritas ?? cm.prioritas,
              kebutuhan: o.kebutuhan ?? cm.kebutuhan,
              versi: o.diubah_pada ? String(o.diubah_pada).slice(0, 10) : cm.versi,
              sumber: 'cms',
            } : null,
          };
        }),
      })),
    })),
  };
  return { pemdi: salin, diterapkan: n };
}

/** Susun berkas ekspor: catatan-mandiri.json + overlay → JSON siap diserap ke repo. */
export function susunEkspor(catatanMandiri, baris = [], now = new Date()) {
  const butir = { ...(catatanMandiri.butir || {}) };
  const status = {};
  for (const r of baris) {
    if (r.status) status[r.id] = r.status;
    const lama = butir[r.id] || { jenis: 'gap', rujukan: [], kebutuhan: [] };
    if (r.ringkas || r.pj || r.prioritas || r.kebutuhan) {
      butir[r.id] = {
        ...lama,
        ...(r.ringkas != null ? { ringkas: r.ringkas } : {}),
        ...(r.pj != null ? { pj: r.pj } : {}),
        ...(r.prioritas != null ? { prioritas: r.prioritas } : {}),
        ...(r.kebutuhan != null ? { kebutuhan: r.kebutuhan } : {}),
      };
    }
  }
  return {
    ...catatanMandiri,
    versi: now.toISOString().slice(0, 10),
    dasar_versi: catatanMandiri.versi,
    hash_dasar: 'terserap',
    diekspor_pada: now.toISOString(),
    status_overlay: status,
    butir,
  };
}
