import { supabaseAdmin, isSupabaseReady } from '../../../lib/supabaseAdmin';
import { hashIp, rateLimit } from '../../../lib/security';

export default async function handler(req, res) {
  const origin = process.env.SITE_ORIGIN || '';
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Rate limit (audit S-4 2026-09-17): ID tracking bisa di-brute force,
  // jadi batasi 10 lookup/menit per IP.
  const ipHash = hashIp(req);
  if (!(await rateLimit(`lapor-status:${ipHash}`, { max: 10, windowMs: 60000 })).ok) {
    return res.status(429).json({ success: false, error: 'Terlalu banyak permintaan. Coba lagi nanti.' });
  }

  const { id } = req.query;

  // Terima ID lama (6 hex) maupun baru (12 hex) — audit S-4
  if (!id || typeof id !== 'string' || !/^LAPOR-\d{8}-[A-Z0-9]{6,12}$/i.test(id)) {
    return res.status(400).json({ success: false, error: 'ID laporan tidak valid' });
  }

  if (!isSupabaseReady) {
    return res.status(503).json({
      success: false,
      error: 'Database tidak tersedia',
      note: 'Laporan Anda sudah tercatat. Tim akan menindaklanjuti. Database permanen akan diaktifkan setelah konfigurasi.',
      mockData: {
        id,
        status: 'baru',
        dibuat: new Date().toISOString(),
      },
    });
  }

  const { data, error } = await supabaseAdmin
    .from('laporan')
    .select('id, status, dibuat, diperbarui')
    .eq('id', id)
    .single();

  if (error || !data) {
    return res.status(404).json({ success: false, error: 'Laporan tidak ditemukan. Periksa kembali ID Anda.' });
  }

  return res.status(200).json({ success: true, data });
}
