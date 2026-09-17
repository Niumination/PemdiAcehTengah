import { supabaseAdmin, isSupabaseReady } from '../../../lib/supabaseAdmin';

const DIMENSI = ['persyaratan','prosedur','waktu','biaya','produk','kompetensi','perilaku','sarana'];
const DIMENSI_LABEL = {
  persyaratan: 'Persyaratan',
  prosedur: 'Prosedur',
  waktu: 'Waktu',
  biaya: 'Biaya',
  produk: 'Produk',
  kompetensi: 'Kompetensi',
  perilaku: 'Perilaku',
  sarana: 'Sarana',
};

export default async function handler(req, res) {
  const origin = process.env.SITE_ORIGIN || '';
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, error: 'Metode tidak diizinkan' });
  }

  // Statistik boleh stale 60 detik di CDN + SWR 5 menit (skill: next-cache)
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

  if (!isSupabaseReady) {
    // Fallback: return data dummy untuk development
    return res.status(200).json({ success: true, data: dummyData() });
  }

  try {
    // 1. SKM ringkasan — total respon & rata-rata keseluruhan
    const { data: ringkasan, error: err1 } = await supabaseAdmin
      .from('skm_ringkasan')
      .select('*')
      .single();
    if (err1) console.warn('[skm/stats] skm_ringkasan error:', err1.message);

    // 2. Per dimensi — 1 RPC agregat (jika fungsi skm_stats_dimensi sudah
    //    terpasang dari db/schema.sql), fallback: SATU query 8 kolom lalu
    //    hitung di JS. Menggantikan loop 8× full-table-select (audit A-3
    //    2026-09-17 yang membuat endpoint lambat & makin parah seiring
    //    jumlah responden tumbuh).
    let perDimensi = {};
    const { data: aggData, error: errAgg } = await supabaseAdmin
      .rpc('skm_stats_dimensi');

    if (!errAgg && aggData && typeof aggData === 'object' && !Array.isArray(aggData)) {
      for (const d of DIMENSI) {
        const v = aggData[d];
        if (v && typeof v.rata_rata !== 'undefined') {
          perDimensi[d] = { label: DIMENSI_LABEL[d], rata_rata: Number(v.rata_rata), count: Number(v.count || 0) };
        }
      }
    } else if (errAgg && errAgg.code !== 'PGRST202') {
      console.warn('[skm/stats] RPC skm_stats_dimensi error:', errAgg.message);
    }

    if (Object.keys(perDimensi).length === 0) {
      const { data: rows, error: errRows } = await supabaseAdmin
        .from('skm')
        .select('persyaratan,prosedur,waktu,biaya,produk,kompetensi,perilaku,sarana');
      if (errRows) {
        console.warn('[skm/stats] select skm error:', errRows.message);
      } else {
        for (const d of DIMENSI) {
          const vals = (rows || []).map((r) => Number(r[d])).filter((v) => Number.isFinite(v));
          if (vals.length > 0) {
            const sum = vals.reduce((a, b) => a + b, 0);
            perDimensi[d] = { label: DIMENSI_LABEL[d], rata_rata: Math.round((sum / vals.length) * 100) / 100, count: vals.length };
          }
        }
      }
    }

    // 3. Per unit pelayanan
    const { data: perUnit, error: err2 } = await supabaseAdmin
      .rpc('skm_per_unit_stats');
    if (err2) console.warn('[skm/stats] skm_per_unit_stats error:', err2.message);

    // 4. Tren bulanan (6 bulan terakhir)
    const { data: tren, error: err3 } = await supabaseAdmin
      .rpc('skm_tren_bulanan', { bulan_terakhir: 6 });
    if (err3) console.warn('[skm/stats] skm_tren_bulanan error:', err3.message);

    // 5. Rating website dari rating_feedback
    let ratingWebsite = { rata_rata: 0, total: 0, distribusi: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    try {
      const { data: ratingData, error: err4 } = await supabaseAdmin
        .from('rating_feedback')
        .select('rating');
      if (err4) console.warn('[skm/stats] rating_feedback error:', err4.message);
      if (ratingData && ratingData.length > 0) {
        const sum = ratingData.reduce((acc, r) => acc + r.rating, 0);
        ratingWebsite.rata_rata = parseFloat((sum / ratingData.length).toFixed(2));
        ratingWebsite.total = ratingData.length;
        ratingWebsite.distribusi = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratingData.forEach(r => { ratingWebsite.distribusi[r.rating]++; });
      }
    } catch (e) { console.warn('[skm/stats] rating loop error:', e.message); }

    return res.status(200).json({
      success: true,
      data: {
        total_respon: ringkasan?.total_responden || 0,
        rata_rata: ringkasan?.rata_skala_4 || 0,
        ikm_0_100: ringkasan?.ikm_0_100 || 0,
        per_dimensi: perDimensi,
        per_unit: Array.isArray(perUnit) ? perUnit : [],
        tren_bulanan: Array.isArray(tren) ? tren : [],
        rating_website: ratingWebsite,
      },
    });
  } catch (err) {
    console.error('SKM stats error:', err);
    return res.status(200).json({ success: true, data: dummyData() });
  }
}

function dummyData() {
  return {
    total_respon: 0,
    rata_rata: 0,
    ikm_0_100: 0,
    per_dimensi: Object.fromEntries(
      DIMENSI.map(d => [d, { label: DIMENSI_LABEL[d], rata_rata: 0, count: 0 }])
    ),
    per_unit: [],
    tren_bulanan: [],
    rating_website: { rata_rata: 0, total: 0, distribusi: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  };
}
