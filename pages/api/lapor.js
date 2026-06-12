import { supabaseAdmin, isSupabaseReady } from '../../lib/supabaseAdmin';
import {
  sanitizeText, hashIp, rateLimit, verifyTurnstile, generateLaporId,
} from '../../lib/security';

const KATEGORI_VALID = ['saran', 'keluhan', 'pertanyaan', 'apresiasi', 'bug', 'lainnya'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_ORIGIN || '*');

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'Gunakan dashboard admin untuk membaca laporan.',
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Metode tidak diizinkan' });
  }

  // Rate limit per IP
  const ipHash = hashIp(req);
  if (!rateLimit(`lapor:${ipHash}`, { max: 5, windowMs: 60000 }).ok) {
    return res.status(429).json({ success: false, error: 'Terlalu banyak permintaan. Coba lagi nanti.' });
  }

  const { kategori, pesan, kontak, halaman, turnstileToken } = req.body || {};

  // Turnstile anti-bot verification
  if (!(await verifyTurnstile(turnstileToken, req.headers['x-forwarded-for']))) {
    return res.status(403).json({ success: false, error: 'Verifikasi anti-bot gagal.' });
  }

  // Sanitize inputs
  const kat = sanitizeText(kategori, 50).toLowerCase();
  const msg = sanitizeText(pesan, 5000);
  const kon = sanitizeText(kontak, 200);
  const hal = sanitizeText(halaman, 300);

  if (!kat || !msg) {
    return res.status(400).json({ success: false, error: 'Kategori dan pesan wajib diisi' });
  }
  if (!KATEGORI_VALID.includes(kat)) {
    return res.status(400).json({ success: false, error: 'Kategori tidak valid' });
  }
  if (msg.length < 5) {
    return res.status(400).json({ success: false, error: 'Pesan terlalu pendek (min 5 karakter)' });
  }

  // Cek ketersediaan database
  if (!isSupabaseReady) {
    return res.status(503).json({ success: false, error: 'Database belum dikonfigurasi.' });
  }

  // Simpan ke Supabase
  const id = generateLaporId();
  const { data, error } = await supabaseAdmin
    .from('laporan')
    .insert({
      id,
      kategori: kat,
      pesan: msg,
      kontak: kon,
      halaman: hal,
      status: 'baru',
      ip_hash: ipHash,
    })
    .select('id, kategori, status, dibuat')
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ success: false, error: 'Gagal menyimpan laporan.' });
  }

  return res.status(201).json({
    success: true,
    tersimpan: true,
    data,
    note: `Laporan tersimpan dengan ID ${data.id}. Simpan ID ini untuk memantau tindak lanjut.`,
  });
}
