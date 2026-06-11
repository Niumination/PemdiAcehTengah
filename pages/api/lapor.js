import fs from 'fs';
import path from 'path';

const isDev = process.env.VERCEL_ENV !== 'production' && process.env.NODE_ENV !== 'production';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'laporan.json');

  // GET — ambil semua laporan (admin)
  if (req.method === 'GET') {
    try {
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        return res.status(200).json({ success: true, data });
      }
    } catch {}
    return res.status(200).json({ success: true, data: { laporan: [], total: 0 }, note: 'Filesystem read-only di production' });
  }

  // POST — simpan laporan baru
  if (req.method === 'POST') {
    const { kategori, pesan, kontak, halaman } = req.body;

    // Validasi
    if (!kategori || !pesan) {
      return res.status(400).json({ success: false, error: 'kategori dan pesan wajib diisi' });
    }

    const id = `LAPOR-${Date.now().toString(36).toUpperCase()}`;
    const laporanBaru = {
      id,
      kategori,
      pesan,
      kontak: kontak || '',
      halaman: halaman || '',
      status: 'baru',
      dibuat: new Date().toISOString(),
    };

    // Di development: simpan ke file
    if (isDev) {
      try {
        let db = { laporan: [] };
        try {
          db = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch {}
        db.laporan.unshift(laporanBaru);
        db.total = db.laporan.length;
        fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
        return res.status(201).json({ success: true, data: laporanBaru, tersimpan: true });
      } catch (err) {
        return res.status(500).json({ success: false, error: 'Gagal menyimpan: ' + err.message });
      }
    }

    // Di production (Vercel serverless): respons tanpa persist
    return res.status(201).json({
      success: true,
      data: laporanBaru,
      tersimpan: false,
      note: 'Laporan tercatat dengan ID ' + id +
        '. Tim Pemda Digital akan menindaklanjuti. ' +
        'Penyimpanan permanen akan diaktifkan setelah database terhubung.',
    });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
