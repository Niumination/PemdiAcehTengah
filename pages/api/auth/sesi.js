/** GET /api/auth/sesi — { sesi: {peran, opd} | null, cmsAktif, dbAktif } untuk halaman /admin. */
import { verifikasiToken, bacaCookie, cmsAktif } from '@/lib/cmsAuth';
import { dbAktif } from '@/lib/db';
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ sesi: verifikasiToken(bacaCookie(req)), cmsAktif: cmsAktif(), dbAktif: dbAktif() });
}
