import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'laporan.json');

  // GET — ambil semua laporan (admin)
  if (req.method === 'GET') {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      res.status(200).json({ success: true, data });
    } catch {
      res.status(200).json({ success: true, data: { laporan: [], total: 0 } });
    }
    return;
  }

  // POST — simpan laporan baru
  if (req.method === 'POST') {
    const { kategori, pesan, kontak, halaman } = req.body;

    if (!kategori || !pesan) {
      res.status(400).json({ success: false, error: 'kategori dan pesan wajib diisi' });
      return;
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

    let db = { laporan: [] };
    try {
      db = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch {
      // file baru
    }

    db.laporan.unshift(laporanBaru);
    db.total = db.laporan.length;
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));

    res.status(201).json({ success: true, data: laporanBaru });
    return;
  }

  res.status(405).json({ success: false, error: 'Method not allowed' });
}
