/**
 * lib/sektorLayanan.js — 6 Sektor Layanan Terpadu (Sprint UI/UX Phase 2)
 *
 * Mengelompokkan 7 kategori data/layanan.json menjadi 6 kartu sektor GOV.UK-style
 * TANPA mengubah data: `kesehatan` + `sosial` dilebur menjadi "Kesehatan & Sosial".
 * Kategori baru yang belum dipetakan otomatis masuk sektor "Kecamatan & Gampong"
 * bila id-nya kecamatan, selain itu ke sektor terakhir yang cocok → tidak ada layanan hilang.
 */
export const SEKTOR = [
  { id: 'kependudukan', icon: '🆔', nama: 'Kependudukan & Capil', kategori: ['kependudukan'], contoh: 'KTP-el, KK, Akta' },
  { id: 'perizinan', icon: '🏬', nama: 'Perizinan & Usaha', kategori: ['perizinan'], contoh: 'NIB, IMB/PBG, SIUP' },
  { id: 'kesehatan-sosial', icon: '🚑', nama: 'Kesehatan & Sosial', kategori: ['kesehatan', 'sosial'], contoh: 'RSUD, BPJS, Bansos' },
  { id: 'pendidikan', icon: '🎓', nama: 'Pendidikan', kategori: ['pendidikan'], contoh: 'PPDB, Beasiswa' },
  { id: 'pajak', icon: '💰', nama: 'Pajak & Retribusi Daerah', kategori: ['pajak'], contoh: 'PBB-P2, BPHTB' },
  { id: 'kecamatan', icon: '🏛️', nama: 'Kecamatan & Gampong', kategori: ['kecamatan'], contoh: 'Surat pengantar, Domisili' },
];

/** 5 kata kunci populer (Phase 2 hero) → /cari?q= */
export const KATA_KUNCI_POPULER = [
  { label: 'KTP', query: 'KTP' },
  { label: 'KK', query: 'Kartu Keluarga' },
  { label: 'Perizinan', query: 'Perizinan' },
  { label: 'Pajak', query: 'Pajak' },
  { label: 'Lapor', query: 'Lapor' },
];

/**
 * @param {Array} kategoriList  data/layanan.json → kategori[]
 * @returns {Array<{...sektor, layanan: Array, opd: string[], jumlah: number, online: number}>}
 */
export function kelompokkanSektor(kategoriList = []) {
  const byId = new Map(kategoriList.map((k) => [k.id, k]));
  const terpakai = new Set();
  const hasil = SEKTOR.map((s) => {
    const kats = s.kategori.map((id) => byId.get(id)).filter(Boolean);
    kats.forEach((k) => terpakai.add(k.id));
    const layanan = kats.flatMap((k) => (k.layanan || []).map((l) => ({ ...l, kategori: k.nama, kategori_id: k.id })));
    const opd = [...new Set(kats.map((k) => k.opd).filter(Boolean))];
    return { ...s, layanan, opd, jumlah: layanan.length, online: layanan.filter((l) => l.online).length };
  });
  // Kategori tak terpetakan → jangan hilang
  kategoriList.filter((k) => !terpakai.has(k.id)).forEach((k) => {
    const tujuan = hasil[hasil.length - 1];
    const tambahan = (k.layanan || []).map((l) => ({ ...l, kategori: k.nama, kategori_id: k.id }));
    tujuan.layanan.push(...tambahan);
    tujuan.jumlah += tambahan.length;
    tujuan.online += tambahan.filter((l) => l.online).length;
  });
  return hasil;
}
