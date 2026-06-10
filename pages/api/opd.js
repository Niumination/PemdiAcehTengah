import opdData from '@/data/opd.json';

export default function handler(req, res) {
  const { search, level, jenis, limit } = req.query;

  let data = [...opdData.opd.daftar];

  // Filter by search
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((d) =>
      d.nama.toLowerCase().includes(q) ||
      d.urusan.toLowerCase().includes(q) ||
      d.singkat.toLowerCase().includes(q)
    );
  }

  // Filter by level (Staf, Badan, Dinas, Lembaga, Kecamatan)
  if (level) {
    const levels = level.split(',').map(l => l.trim().toLowerCase());
    data = data.filter((d) => levels.includes(d.level.toLowerCase()));
  }

  // Filter by jenis (instansi, kecamatan)
  if (jenis) {
    const jenisList = jenis.split(',').map(j => j.trim().toLowerCase());
    data = data.filter((d) => jenisList.includes(d.jenis));
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
      total_instansi: opdData.opd.ringkasan.instansi,
      total_kecamatan: opdData.opd.ringkasan.kecamatan,
      total_asn: opdData.opd.ringkasan.total_asn,
      sumber: opdData.metadata.sumber,
      sumber_asn: opdData.metadata.sumber_asn,
    },
    data,
  });
}
