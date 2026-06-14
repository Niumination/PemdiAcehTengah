import { requireAdmin } from '../../../lib/adminAuth';
import { supabaseAdmin, isSupabaseReady } from '../../../lib/supabaseAdmin';
import { setCors } from '../../../lib/cors';

export default async function handler(req, res) {
  setCors(req, res);
  if (res.headersSent) return;

  const auth = requireAdmin(req);
  if (auth) return res.status(401).json(auth);

  if (!isSupabaseReady) {
    return res.status(503).json({ success: false, error: 'DB belum dikonfigurasi' });
  }

  const { limit = 100, offset = 0 } = req.query;

  const { data, error, count } = await supabaseAdmin
    .from('skm')
    .select('*', { count: 'exact' })
    .order('dibuat', { ascending: false })
    .range(Number(offset), Number(offset) + Number(limit) - 1);

  if (error) return res.status(500).json({ success: false, error: error.message });

  res.status(200).json({ success: true, data, total: count });
}
