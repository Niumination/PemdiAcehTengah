import spbeData from '@/data/opd.json';

export default function handler(req, res) {
  // Data statis dari JSON — hanya berubah saat deploy.
  // Cache CDN 1 jam + stale-while-revalidate 1 hari (skill: next-cache)
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

  const spbe = spbeData.spbe;

  res.status(200).json({
    success: true,
    metadata: {
      pemda: spbeData.metadata.pemda,
      tahun: spbe.tahun,
    },
    indeks: {
      nilai: spbe.indeks,
      kategori: spbe.kategori,
      target_minimal: 3.0,
    },
    domain: spbe.domain,
    kekuatan: spbe.kekuatan,
    rekomendasi_prioritas: spbe.rekomendasi_prioritas,
  });
}
