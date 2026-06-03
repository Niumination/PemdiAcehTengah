import spbeData from '@/data/opd.json';

export default function handler(req, res) {
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
