/** POST /api/auth/keluar — hapus cookie sesi CMS. */
import { setCookieSesi } from '@/lib/cmsAuth';
export default function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }); }
  setCookieSesi(res, '', { hapus: true });
  return res.status(200).json({ ok: true });
}
