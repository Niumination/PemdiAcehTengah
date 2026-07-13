import { supabaseAdmin, isSupabaseReady } from '../../../lib/supabaseAdmin';
import { requireAdmin, adminUnauthorized } from '../../../lib/adminAuth';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_ORIGIN || '');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!(await requireAdmin(req, res))) {
    return adminUnauthorized(res);
  }

  if (req.method === 'GET') {
    if (!isSupabaseReady) {
      return res.status(200).json({ data: [], total: 0, note: 'Supabase belum dikonfigurasi' });
    }

    const { status, limit = 100, offset = 0 } = req.query;

    let query = supabaseAdmin
      .from('laporan')
      .select('*', { count: 'exact' })
      .order('dibuat', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data, total: count || 0 });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
