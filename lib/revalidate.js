/**
 * lib/revalidate.js — Segarkan halaman ISR rk setelah suntingan CMS.
 * Mengembalikan {ok:[...], gagal:[{path,error}]} supaya kegagalan terlihat di respons API
 * (bukan ditelan diam-diam). ISR 60 dtk tetap jadi jaring pengaman.
 */
export const HALAMAN_RK = ['/dashboard', '/indikator', '/antrean', '/admin'];

export async function segarkanHalaman(res, daftar = HALAMAN_RK) {
  const ok = []; const gagal = [];
  for (const path of daftar) {
    try { await res.revalidate(path); ok.push(path); }
    catch (e) { gagal.push({ path, error: e?.message || String(e) }); }
  }
  if (gagal.length) console.error('[cms] revalidate gagal:', gagal);
  return { ok, gagal };
}
