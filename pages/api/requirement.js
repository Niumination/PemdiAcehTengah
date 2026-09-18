// API endpoint: /api/requirement
// Data requirement Peta Proses Bisnis Aceh Tengah berdasarkan Permenpan 19/2018
// Selaras dengan Peta Dokumen Kunci Bukti Dukung Pemdi (dokumen-kunci.json)
//
// Refactor Sprint A6 (2026-09-17): sebelumnya 192 baris data di-hardcode
// (salinan manual data/requirement.json — rawan drift senyap). Kini satu
// sumber: data/requirement.json (dipakai juga pages/requirement.js).
// Kontrak respons diverifikasi identik byte-per-byte sebelum refactor.
import requirementData from '@/data/requirement.json';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_ORIGIN || '')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Metode tidak diizinkan' });
  }
  res.status(200).json(requirementData)
}
