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

    // 2. Per dimensi — rata-rata tiap dimensi
    let perDimensi = {};
    for (const d of DIMENSI) {
      const { data } = await supabaseAdmin
        .from('skm')
        .select(d, { count: 'exact', head: false });
      if (data && data.length > 0) {
        const sum = data.reduce((acc, row) => acc + Number(row[d]), 0);
        perDimensi[d] = { label: DIMENSI_LABEL[d], rata_rata: parseFloat((sum / data.length).toFixed(2)), count: data.length };
      }
    }

    // 3. Per unit pelayanan
    const { data: perUnit, error: err2 } = await supabaseAdmin
      .rpc('skm_per_unit_stats');

    // 4. Tren bulanan (6 bulan terakhir)
    const { data: tren, error: err3 } = await supabaseAdmin
      .rpc('skm_tren_bulanan', { bulan_terakhir: 6 });

    // 5. Rating website dari rating_feedback
    let ratingWebsite = { rata_rata: 0, total: 0, distribusi: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    try {
      const { data: ratingData, error: err4 } = await supabaseAdmin
        .from('rating_feedback')
        .select('rating');
      if (ratingData && ratingData.length > 0) {
        const sum = ratingData.reduce((acc, r) => acc + r.rating, 0);
        ratingWebsite.rata_rata = parseFloat((sum / ratingData.length).toFixed(2));
        ratingWebsite.total = ratingData.length;
        ratingWebsite.distribusi = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratingData.forEach(r => { ratingWebsite.distribusi[r.rating]++; });
      }
    } catch {}

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
