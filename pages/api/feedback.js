import { supabaseAdmin, isSupabaseReady } from '../../lib/supabaseAdmin';
import { sanitizeText, hashIp, rateLimit } from '../../lib/security';

export default async function handler(req, res) {
  const origin = process.env.SITE_ORIGIN || '';
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (!isSupabaseReady) {
    return res.status(503).json({ success: false, error: 'DB belum dikonfigurasi' });
  }

  // GET — statistik rating
  if (req.method === 'GET') {
    const { halaman } = req.query;
    let query = supabaseAdmin.from('rating_feedback');
    if (halaman) {
      query = query.select('rating', { count: 'exact' }).eq('halaman', halaman);
    } else {
      query = query.select('rating');
    }
    const { data, error } = await query;
    if (error) return res.status(500).json({ success: false, error: 'Gagal memuat rating' });

    const total = data.length;
    const rata = total > 0 ? (data.reduce((s, r) => s + r.rating, 0) / total) : 0;
    const distribusi = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    data.forEach(r => { distribusi[r.rating] = (distribusi[r.rating] || 0) + 1; });

    return res.status(200).json({
      success: true,
      data: { total, rata_rata: Math.round(rata * 100) / 100, distribusi },
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ success: false, error: 'Metode tidak diizinkan' });
  }

  // Rate limit
  const ipHash = hashIp(req);
  if (!rateLimit(`feedback:${ipHash}`, { max: 10, windowMs: 300000 }).ok) {
    return res.status(429).json({ success: false, error: 'Terlalu banyak. Coba lagi nanti.' });
  }

  const body = req.body || {};
  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, error: 'Rating harus 1-5' });
  }

  const record = {
    halaman: sanitizeText(body.halaman || '/', 200),
    rating,
    komentar: sanitizeText(body.komentar || '', 1000),
    ip_hash: ipHash,
  };

  const { error } = await supabaseAdmin.from('rating_feedback').insert(record);
  if (error) {
    console.error('Supabase insert error (feedback):', error);
    return res.status(500).json({ success: false, error: 'Gagal menyimpan rating.' });
  }

  return res.status(201).json({
    success: true,
    tersimpan: true,
    note: 'Terima kasih atas penilaian Anda!',
  });
}
