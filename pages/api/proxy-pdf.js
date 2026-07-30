/**
 * Proxy PDF dari JDIH Aceh Tengah — menghindari X-Frame-Options deny
 * Server-side fetch → return sebagai same-origin response
 * iframe di halaman bisa render tanpa XFO error
 */
export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Parameter url diperlukan' });
  }

  // Hanya izinkan URL dari JDIH Aceh Tengah
  if (!url.startsWith('https://jdih.acehtengahkab.go.id/')) {
    return res.status(403).json({ error: 'URL tidak diizinkan' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PemdiAcehTengah/1.0 (Proxy; +https://pemdi-aceh-tengah.vercel.app)',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Gagal fetch PDF: ${response.status} ${response.statusText}`,
      });
    }

    const contentType = response.headers.get('content-type') || 'application/pdf';
    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'inline; filename="preview.pdf"');
    res.setHeader('Content-Length', buffer.length);
    // Hapus header yang bisa ngeblok rendering
    res.setHeader('X-Frame-Options', 'SAMEORIGIN'); // aman karena same-origin
    res.setHeader('Cache-Control', 'public, max-age=3600'); // cache 1 jam
    res.send(buffer);
  } catch (error) {
    console.error('[proxy-pdf] Error:', error.message);
    res.status(502).json({ error: 'Gagal mengambil PDF dari server JDIH' });
  }
}
