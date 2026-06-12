import { supabaseAdmin, isSupabaseReady } from '../../lib/supabaseAdmin';
import {
  sanitizeText, hashIp, rateLimit, generateLaporId,
} from '../../lib/security';

const KATEGORI_VALID = ['saran', 'keluhan', 'pertanyaan', 'apresiasi', 'bug', 'lainnya', 'layanan', 'portal', 'pungli'];

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, PATCH, GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(405).json({ success: false, error: 'Gunakan /api/admin/laporan' });
  }

  if (req.method === 'PATCH') {
    const { id, status } = req.body;
    if (!id || !['baru','diproses','selesai','ditolak'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Parameter tidak valid' });
    }
    if (!isSupabaseReady) {
      return res.status(503).json({ success: false, error: 'Database belum dikonfigurasi' });
    }
    const { error } = await supabaseAdmin.from('laporan').update({ status }).eq('id', id);
    if (error) return res.status(500).json({ success: false, error: error.message });
    return res.status(200).json({ success: true, tersimpan: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const ip = hashIp(req);

  // Rate limit: max 5 post per menit per IP
  if (!rateLimit(`lapor:${ip}`, { max: 5, windowMs: 60000 }).ok) {
    return res.status(429).json({ success: false, error: 'Terlalu banyak permintaan. Coba lagi nanti.' });
  }

  const { kategori, pesan, kontak, halaman } = req.body;

  // Validasi
  if (!kategori || !KATEGORI_VALID.includes(kategori)) {
    return res.status(400).json({ success: false, error: 'Kategori tidak valid' });
  }
  if (!pesan || typeof pesan !== 'string') {
    return res.status(400).json({ success: false, error: 'Pesan wajib diisi' });
  }

  const pesanClean = sanitizeText(pesan, 5000);
  const kontakClean = sanitizeText(kontak || '', 200);

  if (pesanClean.length < 5) {
    return res.status(400).json({ success: false, error: 'Pesan minimal 5 karakter' });
  }

  const id = generateLaporId();
  const laporanData = {
    id,
    kategori,
    pesan: pesanClean,
    kontak: kontakClean,
    halaman: sanitizeText(halaman || '', 200),
    status: 'baru',
    dibuat: new Date().toISOString(),
  };

  // Simpan ke Supabase
  if (isSupabaseReady) {
    const { error } = await supabaseAdmin.from('laporan').insert({
      id: laporanData.id,
      kategori: laporanData.kategori,
      pesan: laporanData.pesan,
      kontak: laporanData.kontak || null,
      halaman: laporanData.halaman || null,
      status: laporanData.status,
      ip_hash: ip,
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ success: false, error: 'Gagal menyimpan laporan.' });
    }

    return res.status(201).json({ success: true, data: laporanData, tersimpan: true });
  }

  // Fallback tanpa DB
  return res.status(201).json({
    success: true,
    data: laporanData,
    tersimpan: false,
    note: `Laporan tercatat dengan ID ${id}. Tim Pemda Digital akan menindaklanjuti. Penyimpanan permanen akan diaktifkan setelah database terhubung.`,
  });
}
