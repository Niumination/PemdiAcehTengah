/**
 * Health check — dipakai uptime monitor (UptimeRobot / Vercel Cron / Better Uptime).
 * 200 = aplikasi + database hidup; 503 = ada komponen mati (monitor harus alert).
 * Audit P0-L1 2026-09-17: backend produksi sempat mati berbulan-bulan tanpa
 * ada yang sadar karena tidak ada endpoint kesehatan yang bisa dipantau.
 */
import { supabaseAdmin, isSupabaseReady } from '../../lib/supabaseAdmin';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ status: 'error', error: 'Method not allowed' });
  }

  const started = Date.now();

  if (!isSupabaseReady) {
    return res.status(503).json({
      status: 'unhealthy',
      app: 'ok',
      db: 'not_configured',
      detail: 'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY belum diset',
      latencyMs: 0,
      checkedAt: new Date().toISOString(),
    });
  }

  const { error } = await supabaseAdmin
    .from('laporan')
    .select('id', { count: 'exact', head: true });

  if (error) {
    return res.status(503).json({
      status: 'unhealthy',
      app: 'ok',
      db: 'error',
      detail: error.message,
      latencyMs: Date.now() - started,
      checkedAt: new Date().toISOString(),
    });
  }

  return res.status(200).json({
    status: 'ok',
    app: 'ok',
    db: 'ok',
    latencyMs: Date.now() - started,
    checkedAt: new Date().toISOString(),
  });
}
