import { supabaseAdmin, isSupabaseReady } from '../../lib/supabaseAdmin';
import { sanitizeText, hashIp, rateLimit } from '../../lib/security';
import { setCors } from '../../lib/cors';

const UNSUR = ['persyaratan', 'prosedur', 'waktu', 'biaya', 'produk', 'kompetensi', 'perilaku', 'sarana'];

export default async function handler(req, res) {
  setCors(req, res);
  if (res.headersSent) return;

  // GET — ringkasan SKM
  if (req.method === 'GET') {
    if (!isSupabaseReady) {
      return res.status(503).json({ success: false, error: 'DB belum dikonfigurasi' });
    }
    const { data, error } = await supabaseAdmin.from('skm_ringkasan').select('*').single();
    if (error) return res.status(500).json({ success: false, error: 'Gagal memuat ringkasan' });
    return res.status(200).json({ success: true, data });
  }

  // Hanya POST dan GET
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, GET');
    return res.status(405).json({ success: false, error: 'Metode tidak diizinkan' });
  }

  // Rate limit
  const ipHash = hashIp(req);
  if (!rateLimit(`skm:${ipHash}`, { max: 3, windowMs: 300000 }).ok) {
    return res.status(429).json({ success: false, error: 'Terlalu banyak pengiriman. Coba lagi nanti.' });
  }

  const body = req.body || {};

  const record = {
    layanan: sanitizeText(body.layanan, 120),
    saran: sanitizeText(body.saran, 2000),
    ip_hash: ipHash,
  };

  for (const u of UNSUR) {
    const v = Number(body[u]);
    if (!Number.isInteger(v) || v < 1 || v > 4) {
      return res.status(400).json({ success: false, error: `Nilai '${u}' harus 1-4` });
    }
    record[u] = v;
  }

  if (!isSupabaseReady) {
    return res.status(503).json({ success: false, error: 'DB belum dikonfigurasi' });
  }

  const { error } = await supabaseAdmin.from('skm').insert(record);
  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ success: false, error: 'Gagal menyimpan survei.' });
  }

  return res.status(201).json({
    success: true,
    tersimpan: true,
    note: 'Terima kasih! Tanggapan Anda telah tersimpan.',
  });
}
