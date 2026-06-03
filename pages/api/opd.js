import opdData from '@/data/opd.json';

export default function handler(req, res) {
  const { search, level, limit } = req.query;

  let data = [...opdData.opd.instansi];

  // Filter by search
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((d) =>
      d.nama.toLowerCase().includes(q) ||
      d.urusan.toLowerCase().includes(q)
    );
  }

  // Filter by level
  if (level) {
    const levels = level.split(',');
    data = data.filter((d) => levels.includes(d.level.toLowerCase()));
  }

  // Limit
  const total = data.length;
  if (limit) {
    data = data.slice(0, parseInt(limit));
  }

  res.status(200).json({
    success: true,
    total,
    returned: data.length,
    metadata: {
      pemda: opdData.metadata.pemda,
      total_perangkat_daerah: opdData.opd.total_perangkat_daerah,
      total_instansi: opdData.opd.total_instansi,
      total_kecamatan: opdData.opd.total_kecamatan,
      sumber: opdData.metadata.sumber,
    },
    data,
  });
}
