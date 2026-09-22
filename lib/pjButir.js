/**
 * lib/pjButir.js — Peta penanggung jawab (PJ) → jumlah butir bukti Pemdi (reposisi 22 Sep 2026)
 *
 * Sumber: pemdi.json → bukti_dukung[].catatan_mandiri.pj (teks bebas, mis.
 * "Diskominfo (Bidang APTIKA) + Bagian Hukum"). Setiap OPD yang disebut dalam teks
 * dihitung satu kali per butir. Dipakai OPDTable menggantikan kolom "layanan publik".
 * Murni JS agar bisa diuji dengan node:test.
 */

/** Alias singkatan OPD → pola pencarian (huruf kecil) pada teks PJ. */
const ALIAS = {
  diskominfo: ['diskominfo', 'kominfo', 'walidata', 'siap digital', 'persandian', 'aptika', 'bidang tik'],
  bkpsdm: ['bkpsdm'],
  bappeda: ['bappeda'],
  bpkad: ['bpkad'],
  inspektorat: ['inspektorat'],
  setda: ['setda', 'sekretariat daerah', 'bagian organisasi', 'bagian hukum', 'ppid utama'],
  disdukcapil: ['disdukcapil', 'dukcapil'],
  dpmptsp: ['dpmptsp'],
  dinsos: ['dinas sosial', 'dinsos'],
  pupr: ['pupr'],
};

function norm(s = '') {
  return String(s).toLowerCase();
}

/** Kumpulkan seluruh teks PJ dari pemdi.json → array string (satu per butir bercatatan). */
export function kumpulkanPJ(pemdi) {
  const out = [];
  for (const a of pemdi?.aspek || []) {
    for (const i of a.indikator || []) {
      for (const b of i.bukti_dukung || []) {
        const pj = b?.catatan_mandiri?.pj;
        if (pj) out.push(pj);
      }
    }
  }
  return out;
}

/** Jumlah butir yang menyebut OPD tertentu. `opd` = { nama, singkat }. */
export function hitungButirOPD(opd, daftarPJ) {
  const singkat = norm(opd?.singkat);
  const nama = norm(opd?.nama);
  const pola = new Set();
  if (singkat) pola.add(singkat);
  if (nama) pola.add(nama);
  for (const [kunci, alias] of Object.entries(ALIAS)) {
    if (singkat === kunci || nama.includes(kunci) || alias.some((x) => nama.includes(x))) {
      alias.forEach((x) => pola.add(x));
      pola.add(kunci);
    }
  }
  if (!pola.size) return 0;
  let n = 0;
  for (const pj of daftarPJ) {
    const t = norm(pj);
    if ([...pola].some((p) => p.length >= 4 && t.includes(p))) n += 1;
  }
  return n;
}

/** Peta id/nama OPD → jumlah butir; dipanggil di getStaticProps. */
export function petaButirOPD(daftarOPD, pemdi) {
  const daftarPJ = kumpulkanPJ(pemdi);
  const map = {};
  for (const o of daftarOPD || []) {
    map[o.id ?? o.nama] = hitungButirOPD(o, daftarPJ);
  }
  return map;
}
