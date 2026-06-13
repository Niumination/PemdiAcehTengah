import { supabaseAdmin, isSupabaseReady } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  const origin = process.env.SITE_ORIGIN || '';
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string' || !/^LAPOR-\d{8}-[A-Z0-9]{6}$/i.test(id)) {
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
