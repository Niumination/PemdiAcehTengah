/**
 * lib/useUrlState.js — state yang tercermin di URL (Patch 18, Tahap C; pedoman desain/PEDOMAN-ANTARMUKA.md §Navigasi & state).
 *
 * Filter, tab, dan saringan yang layak dibagikan (mis. dikirim ke PJ OPD lewat WhatsApp) disimpan di query string
 * sehingga tautan yang dibuka penerima menampilkan keadaan yang sama.
 *
 *   const [pri, setPri] = useUrlState('pri', '');
 *
 * - Nilai awal = `awal` (aman untuk SSG/hidrasi); setelah router siap, nilai dibaca dari `?kunci=`.
 * - Perubahan ditulis dengan `router.replace` shallow (tanpa memuat ulang data, tanpa menambah riwayat).
 * - Nilai sama dengan `awal` → parameter dihapus dari URL agar tautan tetap bersih.
 */
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

export default function useUrlState(kunci, awal = '') {
  const router = useRouter();
  const [nilai, setNilai] = useState(awal);

  useEffect(() => {
    if (!router.isReady) return;
    const q = router.query[kunci];
    const v = Array.isArray(q) ? q[0] : q;
    setNilai(v == null || v === '' ? awal : v);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query[kunci]]);

  const set = useCallback((baru) => {
    const v = typeof baru === 'function' ? baru(nilai) : baru;
    setNilai(v);
    if (!router.isReady) return;
    const query = { ...router.query };
    if (v == null || v === '' || v === awal) delete query[kunci]; else query[kunci] = String(v);
    router.replace({ pathname: router.pathname, query }, undefined, { shallow: true, scroll: false });
  }, [router, kunci, awal, nilai]);

  return [nilai, set];
}
