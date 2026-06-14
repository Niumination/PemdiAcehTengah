// API endpoint: /api/requirement
// Data requirement Peta Proses Bisnis Aceh Tengah berdasarkan Permenpan 19/2018

const requirementData = {
  summary: [
    { category: 'A. Dokumen Regulasi & Strategis', icon: '📜', count: 7, priority: 'WAJIB', kebutuhan: 'Setdakab, Bappeda, Bagian Hukum', description: 'Dasar hukum, RPJPD, Renstra, Renja, LAKIP' },
    { category: 'B. Struktur Organisasi 38 OPD', icon: '🏛️', count: 12, priority: 'WAJIB', kebutuhan: 'BKPSDM, Diskominfo', description: 'SOTK, Anjab, ABK, Tupoksi, Matriks Urusan' },
    { category: 'C. RPJMD & Renstra', icon: '🎯', count: 8, priority: 'WAJIB', kebutuhan: 'Bappeda', description: 'Qanun RPJMD, Logframe, 17 Prioritas HAMAS, IKU' },
    { category: 'D. Proses Bisnis per OPD', icon: '⚙️', count: 10, priority: 'WAJIB', kebutuhan: 'Seluruh 38 OPD', description: 'SIPOC, flowchart, wawancara langsung 38 Kepala OPD' },
    { category: 'E. Data Layanan Publik', icon: '🤝', count: 6, priority: 'WAJIB', kebutuhan: 'DPM-PTSP, OPD terkait', description: 'Standar Pelayanan, Maklumat, MPP, IKM, Pengaduan' },
    { category: 'F. Data SPBE & TIK', icon: '💻', count: 7, priority: 'WAJIB', kebutuhan: 'Diskominfo', description: 'Arsitektur SPBE, Peta Rencana, Master Plan TIK' },
    { category: 'G. SOP Existing', icon: '📋', count: 5, priority: 'WAJIB', kebutuhan: 'Bagian Organisasi, OPD', description: 'Kumpulan SOP, Gap analysis, SOP prioritas' },
    { category: 'H. Akses API / Sistem Digital', icon: '🔌', count: 10, priority: 'SANGAT DIBUTUHKAN', kebutuhan: 'Diskominfo, OPD terkait', description: 'SIPD, e-Keurani, e-Musrenbang, SP4N-LAPOR, Satu Data' },
    { category: 'I. Data Kecamatan (14)', icon: '🗺️', count: 5, priority: 'PENTING', kebutuhan: 'Kecamatan', description: 'Tupoksi, desa/kampung, layanan, demografis, ekonomi' },
    { category: 'J. Data Kepegawaian', icon: '👥', count: 4, priority: 'PENTING', kebutuhan: 'BKPSDM', description: 'Distribusi ASN, kompetensi, diklat, tipologi' },
    { category: 'K. Data Keuangan & Aset', icon: '💰', count: 4, priority: 'PENTING', kebutuhan: 'BPKAD', description: 'Struktur APBD, pagu indikatif, aset, PAD' },
    { category: 'L. Template & Tools', icon: '🧰', count: 5, priority: 'PENDUKUNG', kebutuhan: 'Internal', description: 'Template Simalungun ✅, Permenpan 19 ✅, BPMN tool' },
  ],

  categories: [
    {
      id: 'A', icon: '📜', name: 'Dokumen Regulasi & Strategis',
      description: 'Landasan hukum dan dokumen perencanaan yang menjadi acuan penyusunan PPB.',
      items: [
        { no: 'A1', data: 'Qanun / Perbup tentang Peta Proses Bisnis (jika sudah ada)', fungsi: 'Dasar hukum PPB', format: 'PDF/DOC', sumber: 'Bagian Hukum Setdakab' },
        { no: 'A2', data: 'SK Tim Reformasi Birokrasi Internal (RBI)', fungsi: 'Tim penyusun PPB', format: 'PDF/DOC', sumber: 'Bagian Organisasi Setdakab' },
        { no: 'A3', data: 'Roadmap Reformasi Birokrasi 2025-2030', fungsi: 'Acuan target RB', format: 'PDF/DOC', sumber: 'Bagian Organisasi' },
        { no: 'A4', data: 'RPJPD Aceh Tengah (2005-2025 / 2025-2045)', fungsi: 'Visi jangka panjang', format: 'PDF/DOC', sumber: 'Bappeda' },
        { no: 'A5', data: 'Renstra Kabupaten 2025-2030', fungsi: 'Strategi pembangunan', format: 'PDF/DOC', sumber: 'Bappeda' },
        { no: 'A6', data: 'Renja tahun berjalan (2026)', fungsi: 'Rencana kerja tahunan', format: 'PDF/DOC', sumber: 'Bappeda' },
        { no: 'A7', data: 'Laporan Kinerja (LAKIP) 2025', fungsi: 'Evaluasi kinerja', format: 'PDF/DOC', sumber: 'Setdakab/Bappeda' },
      ]
    },
    {
      id: 'B', icon: '🏛️', name: 'Struktur Organisasi 38 OPD',
      description: 'Data kelembagaan dan tugas pokok fungsi yang menjadi dasar identifikasi proses bisnis.',
      items: [
        { no: 'B1', data: 'Daftar 38 OPD + 14 Kecamatan (confirmed)', fungsi: 'Basis pemetaan', format: 'spreadsheet', sumber: 'BKPSDM' },
        { no: 'B2', data: 'SK SOTK (Struktur Organisasi Tugas Kerja)', fungsi: 'Mengetahui tupoksi', format: 'PDF', sumber: 'Bagian Organisasi' },
        { no: 'B3', data: 'Struktur organisasi per OPD (eselon III, IV)', fungsi: 'Pemetaan jabatan', format: 'Diagram/PDF', sumber: 'BKPSDM' },
        { no: 'B4', data: 'Analisis Jabatan (Anjab) per OPD', fungsi: 'Daftar posisi', format: 'DOC/PDF', sumber: 'BKPSDM' },
        { no: 'B5', data: 'Analisis Beban Kerja (ABK) per OPD', fungsi: 'Beban kerja unit', format: 'DOC/PDF', sumber: 'BKPSDM' },
        { no: 'B6', data: 'Tupoksi masing-masing OPD (dokumen resmi)', fungsi: 'Dasar identifikasi proses', format: 'PDF/DOC', sumber: 'Setdakab/OPD' },
        { no: 'B7', data: 'Matriks 24 Urusan Konkuren → OPD penanggung jawab', fungsi: 'Level 1 mapping', format: 'spreadsheet', sumber: 'Bappeda' },
        { no: 'B8', data: 'Uraian tugas setiap bidang/bidang dalam OPD', fungsi: 'Detail breakdown', format: 'DOC/PDF', sumber: 'Masing-masing OPD' },
        { no: 'B9', data: 'Alur koordinasi antar OPD (jika ada)', fungsi: 'Relasi antar OPD', format: 'Diagram', sumber: 'Setdakab' },
        { no: 'B10', data: 'Struktur Bagian/Subbagian di Setdakab', fungsi: 'Mekanisme koordinasi', format: 'DOC/PDF', sumber: 'Setdakab' },
        { no: 'B11', data: 'Daftar UPTD per Dinas', fungsi: 'Unit pelaksana teknis', format: 'DOC/PDF', sumber: 'OPD terkait' },
        { no: 'B12', data: 'Daftar jabatan fungsional (JF) dan struktural', fungsi: 'Siapa pemilik proses', format: 'spreadsheet', sumber: 'BKPSDM' },
      ]
    },
    {
      id: 'C', icon: '🎯', name: 'RPJMD & Renstra',
      description: 'Dokumen perencanaan strategis yang menjadi sumber penjabaran Level 0 dan Level 1 PPB.',
      items: [
        { no: 'C1', data: 'Qanun RPJMD No. 4/2025 (dokumen LENGKAP)', fungsi: 'VISI-MISI → Level 0', format: 'PDF', sumber: 'Bappeda' },
        { no: 'C2', data: 'Matriks logframe RPJMD (Visi-Misi-Tujuan-Sasaran-Indikator-Program)', fungsi: 'Pohon kinerja → Proses', format: 'spreadsheet', sumber: 'Bappeda' },
        { no: 'C3', data: '17 Sasaran Prioritas HAMAS (dokumen resmi)', fungsi: 'Strategi prioritas', format: 'DOC/PDF', sumber: 'Bappeda/Bag Protokol' },
        { no: 'C4', data: 'Indikator Kinerja Utama (IKU) daerah', fungsi: 'KPI level daerah', format: 'spreadsheet', sumber: 'Bappeda' },
        { no: 'C5', data: 'Renstra masing-masing 38 OPD', fungsi: 'Visi-misi OPD → Level 1-2', format: 'PDF/DOC', sumber: 'Masing-masing OPD' },
        { no: 'C6', data: 'Renja OPD tahun 2025 dan 2026', fungsi: 'Rencana tahunan', format: 'PDF/DOC', sumber: 'Masing-masing OPD' },
        { no: 'C7', data: 'IKU per OPD', fungsi: 'Indikator kinerja per OPD', format: 'spreadsheet', sumber: 'Masing-masing OPD' },
        { no: 'C8', data: 'PK (Perjanjian Kinerja) 2026', fungsi: 'Target tahunan OPD', format: 'DOC/PDF', sumber: 'Masing-masing OPD' },
      ]
    },
    {
      id: 'D', icon: '⚙️', name: 'Proses Bisnis per OPD',
      description: 'Data primer identifikasi proses bisnis yang harus dikumpulkan langsung dari 38 OPD melalui wawancara dan FGD.',
      items: [
        { no: 'D1', data: 'Daftar proses bisnis yang SUDAH ada di masing-masing OPD', fungsi: 'Baseline', format: 'DOC/XLS/Diagram', sumber: 'Masing-masing OPD' },
        { no: 'D2', data: 'PPB yang sudah disusun sebelumnya (jika ada)', fungsi: 'Jangan ulang kerja', format: 'Diagram/PDF', sumber: 'Masing-masing OPD' },
        { no: 'D3', data: 'Bagan alir (flowchart) proses kerja existing', fungsi: 'Input → Proses → Output', format: 'Diagram/PDF', sumber: 'Masing-masing OPD' },
        { no: 'D4', data: 'Matriks proses per bidang/subbidang', fungsi: 'Siapa mengerjakan apa', format: 'DOC/XLS', sumber: 'Masing-masing OPD' },
        { no: 'D5', data: 'Supplier & Input setiap proses', fungsi: 'Siapa pemasok data?', format: 'wawancara', sumber: 'OPD terkait' },
        { no: 'D6', data: 'Output & Customer setiap proses', fungsi: 'Ke mana hasil proses?', format: 'wawancara', sumber: 'OPD terkait' },
        { no: 'D7', data: 'Waktu siklus setiap proses', fungsi: 'Durasi proses', format: 'data lapangan', sumber: 'OPD terkait' },
        { no: 'D8', data: 'Volume transaksi per proses (bulanan/tahunan)', fungsi: 'Skala proses', format: 'data statistik', sumber: 'OPD terkait' },
        { no: 'D9', data: 'Wawancara minimal dengan 38 Kepala OPD / Kabid perencanaan', fungsi: 'Verifikasi proses', format: 'Notes', sumber: 'OPD' },
        { no: 'D10', data: 'FGD (Focus Group Discussion) lintas OPD', fungsi: 'Validasi relasi antar OPD', format: 'Notes', sumber: 'Setdakab/Organisasi' },
      ]
    },
    {
      id: 'E', icon: '🤝', name: 'Data Layanan Publik',
      description: 'Data layanan yang diberikan pemerintah ke masyarakat, menjadi dasar identifikasi proses inti (core process).',
      items: [
        { no: 'E1', data: 'Daftar layanan publik per OPD', fungsi: 'Jenis layanan ke masyarakat', format: 'DOC/XLS', sumber: 'Masing-masing OPD' },
        { no: 'E2', data: 'Standar Pelayanan (SP) per layanan', fungsi: 'Mutu layanan', format: 'DOC/PDF', sumber: 'Masing-masing OPD' },
        { no: 'E3', data: 'Maklumat Pelayanan per OPD', fungsi: 'Komitmen layanan', format: 'DOC/PDF', sumber: 'Masing-masing OPD' },
        { no: 'E4', data: 'Data MPP (Mal Pelayanan Publik)', fungsi: 'Layanan terpadu', format: 'DOC/PDF', sumber: 'DPM-PTSP' },
        { no: 'E5', data: 'Survey indeks kepuasan masyarakat (IKM)', fungsi: 'Feedback layanan', format: 'DOC/PDF', sumber: 'OPD terkait' },
        { no: 'E6', data: 'Pengaduan masyarakat (aspirasi/keluhan)', fungsi: 'Area perbaikan', format: 'Data/Sistem', sumber: 'Diskominfo/OPD' },
      ]
    },
    {
      id: 'F', icon: '💻', name: 'Data SPBE & TIK',
      description: 'Data Sistem Pemerintahan Berbasis Elektronik yang menjadi acuan digitalisasi proses bisnis.',
      items: [
        { no: 'F1', data: 'Dokumen Arsitektur SPBE (Perpres 132/2022)', fungsi: 'Domain proses bisnis dalam SPBE', format: 'PDF', sumber: 'Diskominfo' },
        { no: 'F2', data: 'Peta Rencana SPBE 2025-2030', fungsi: 'Target digitalisasi', format: 'PDF', sumber: 'Diskominfo' },
        { no: 'F3', data: 'Master Plan TIK / IT Master Plan', fungsi: 'Infrastruktur digital', format: 'PDF', sumber: 'Diskominfo' },
        { no: 'F4', data: 'Domain Proses Bisnis dalam SPBE (indikator 11-14)', fungsi: 'Nilai kematangan proses', format: 'Data SPBE', sumber: 'Diskominfo' },
        { no: 'F5', data: 'Data aplikasi/sistem yang sudah berjalan', fungsi: 'Aplikasi existing', format: 'spreadsheet', sumber: 'Diskominfo' },
        { no: 'F6', data: 'Arsitektur integrasi SIAT (Sistem Informasi Aceh Terintegrasi)', fungsi: 'Ekosistem digital Aceh', format: 'PDF', sumber: 'Diskominfo' },
        { no: 'F7', data: 'Akses ke dashboard e-Keurani', fungsi: 'Data kepegawaian', format: 'API/Web', sumber: 'BKPSDM' },
      ]
    },
    {
      id: 'G', icon: '📋', name: 'SOP Existing',
      description: 'Standar Operasional Prosedur yang sudah ada, menjadi dasar penyusunan Peta Lintas Fungsi (CFM).',
      items: [
        { no: 'G1', data: 'Kumpulan SOP existing per OPD', fungsi: 'Dasar penyusunan CFM', format: 'DOC/PDF', sumber: 'Masing-masing OPD' },
        { no: 'G2', data: 'Daftar SOP yang sudah ada vs yang belum', fungsi: 'Gap analysis', format: 'spreadsheet', sumber: 'Bagian Organisasi' },
        { no: 'G3', data: 'Format SOP standar Pemkab Aceh Tengah', fungsi: 'Template', format: 'DOC', sumber: 'Bagian Organisasi' },
        { no: 'G4', data: 'SOP prioritas (layanan publik, keuangan, kepegawaian)', fungsi: 'Core SOP', format: 'DOC/PDF', sumber: 'OPD prioritas' },
        { no: 'G5', data: 'SOP lintas OPD (proses yang melibatkan >1 OPD)', fungsi: 'Alur koordinasi', format: 'DOC/PDF', sumber: 'Setdakab' },
      ]
    },
    {
      id: 'H', icon: '🔌', name: 'Akses API / Sistem Digital',
      description: 'Akses ke sistem informasi yang sudah berjalan di Pemkab Aceh Tengah untuk integrasi data otomatis.',
      items: [
        { no: 'H1', data: 'Sistem Informasi Pemerintahan Daerah (SIPD)', fungsi: 'Perencanaan, penganggaran, pelaporan', format: 'API/read-only', sumber: 'Bappeda/BPKAD' },
        { no: 'H2', data: 'e-Kinerja/e-Keurani (BKPSDM)', fungsi: 'Data jabatan, ASN per OPD', format: 'API/read-only', sumber: 'BKPSDM' },
        { no: 'H3', data: 'Sistem Informasi Pembangunan Daerah (SIPD)', fungsi: 'Data program & kegiatan', format: 'API/read-only', sumber: 'Bappeda' },
        { no: 'H4', data: 'e-Budgeting / SIMRAL (BPKAD)', fungsi: 'Data anggaran per OPD', format: 'API/read-only', sumber: 'BPKAD' },
        { no: 'H5', data: 'e-Musrenbang (Bappeda)', fungsi: 'Usulan masyarakat → program', format: 'API/read-only', sumber: 'Bappeda' },
        { no: 'H6', data: 'Website acehtengahkab.go.id & subdomain OPD', fungsi: 'Data publik, profil OPD', format: 'scrape + API', sumber: 'Diskominfo' },
        { no: 'H7', data: 'PPID (Pejabat Pengelola Informasi dan Dokumentasi)', fungsi: 'Data publik, informasi berkala', format: 'API', sumber: 'Diskominfo' },
        { no: 'H8', data: 'MPP Digital / Portal Perizinan (DPM-PTSP)', fungsi: 'Data layanan terpadu', format: 'API/Web', sumber: 'DPM-PTSP' },
        { no: 'H9', data: 'Sistem Pengaduan Masyarakat (SP4N-LAPOR!)', fungsi: 'Data pengaduan per OPD', format: 'API', sumber: 'Diskominfo' },
        { no: 'H10', data: 'Satu Data Aceh Tengah (Diskominfo)', fungsi: 'Data statistik sektoral', format: 'API', sumber: 'Diskominfo' },
      ]
    },
    {
      id: 'I', icon: '🗺️', name: 'Data Kecamatan (14)',
      description: 'Data dari 14 kecamatan yang menjadi ujung tombak pelayanan publik tingkat bawah.',
      items: [
        { no: 'I1', data: 'Tupoksi kecamatan', fungsi: 'Proses bisnis level kecamatan', format: 'DOC/PDF', sumber: 'Masing-masing kecamatan' },
        { no: 'I2', data: 'Daftar desa/kampung (295 kampung + 1 kelurahan)', fungsi: 'Unit pelayanan terkecil', format: 'DOC/XLS', sumber: 'DPMK/Diskominfo' },
        { no: 'I3', data: 'Layanan kecamatan', fungsi: 'Layanan ke masyarakat', format: 'DOC/XLS', sumber: 'Kecamatan' },
        { no: 'I4', data: 'Data geografis & demografis per kecamatan', fungsi: 'Konteks pelayanan', format: 'DOC/XLS', sumber: 'Bappeda/Disdukcapil' },
        { no: 'I5', data: 'Data potensi ekonomi per kecamatan', fungsi: 'Ekonomi lokal', format: 'DOC/XLS', sumber: 'Bappeda/Dinas terkait' },
      ]
    },
    {
      id: 'J', icon: '👥', name: 'Data Kepegawaian',
      description: 'Data SDM Aparatur yang menjalankan proses bisnis di setiap OPD.',
      items: [
        { no: 'J1', data: 'Distribusi ASN per OPD (jumlah, golongan, pendidikan)', fungsi: 'Siapa menjalankan proses', format: 'spreadsheet', sumber: 'BKPSDM' },
        { no: 'J2', data: 'Data kompetensi ASN', fungsi: 'Kesesuaian orang-proses', format: 'spreadsheet', sumber: 'BKPSDM' },
        { no: 'J3', data: 'Data diklat/bimtek yang sudah diikuti', fungsi: 'Kapasitas SDM', format: 'spreadsheet', sumber: 'BKPSDM' },
        { no: 'J4', data: 'Jumlah ASN fungsional umum vs fungsional tertentu', fungsi: 'Tipologi SDM', format: 'spreadsheet', sumber: 'BKPSDM' },
      ]
    },
    {
      id: 'K', icon: '💰', name: 'Data Keuangan & Aset',
      description: 'Data anggaran dan aset yang menggambarkan alokasi sumber daya untuk setiap proses bisnis.',
      items: [
        { no: 'K1', data: 'Struktur APBD 2025-2026 per OPD', fungsi: 'Alokasi per proses', format: 'spreadsheet', sumber: 'BPKAD' },
        { no: 'K2', data: 'Data Pagu Indikatif per program/kegiatan', fungsi: 'Anggaran per proses bisnis', format: 'spreadsheet', sumber: 'BPKAD/Bappeda' },
        { no: 'K3', data: 'Data aset daerah per OPD', fungsi: 'Input proses', format: 'spreadsheet', sumber: 'BPKAD' },
        { no: 'K4', data: 'Data PAD (Pendapatan Asli Daerah) per sektor', fungsi: 'Proses pendapatan', format: 'spreadsheet', sumber: 'Badan Pendapatan' },
      ]
    },
    {
      id: 'L', icon: '🧰', name: 'Template & Tools',
      description: 'Alat bantu dan referensi untuk penyusunan PPB. Beberapa sudah tersedia dari riset sebelumnya.',
      items: [
        { no: 'L1', data: 'Template Excel PPB Kab. Simalungun ✅ SUDAH ADA', fungsi: 'Format kode: PB-ACT.X.XX', format: 'XLSX', sumber: '~/Documents/Work/Probis Aceh Jaya/PROBIS SIMALUNGUN/' },
        { no: 'L2', data: 'Dokumen Permenpan 19/2018 ✅ SUDAH ADA', fungsi: 'Framework', format: 'PDF', sumber: '~/Documents/Work/Probis Aceh Jaya/PROBIS SIMALUNGUN/' },
        { no: 'L3', data: 'Contoh PPB Kota Madiun (CFM detail) ✅ SUDAH ADA', fungsi: 'Referensi Lintas Fungsi', format: 'PDF', sumber: '~/Documents/Work/Probis Aceh Jaya/PROBIS SIMALUNGUN/' },
        { no: 'L4', data: 'Tool BPMN (Camunda Modeler / draw.io / Bizagi)', fungsi: 'Notasi standar internasional', format: 'Software', sumber: 'Perlu install' },
        { no: 'L5', data: 'Template SOP standar Pemkab Aceh Tengah', fungsi: 'Format dokumen SOP', format: 'DOC', sumber: '❌ Belum ada' },
      ]
    },
  ],

  outputs: [
    { title: 'Tabel Identifikasi Proses (Level 0)', description: 'Kode Proses, Nama Peta Proses, Level, Jenis Proses (Inti/Pendukung/Lainnya), OPD Utama, Visi/Misi Terkait' },
    { title: 'Tabel Identifikasi Subproses (Level 1)', description: 'Breakdown tiap proses menjadi subproses dengan kode PB-ACT.X.XX, program terkait, OPD penanggung jawab' },
    { title: 'Tabel Identifikasi Lintas Fungsi (CFM)', description: 'Pemetaan aktivitas per subproses dengan kolom OPD yang terlibat (YA/TIDAK) — dasar penyusunan SOP' },
    { title: 'Bagan Swimlane (CFM Diagram)', description: 'Diagram lintas fungsi dengan swimlane per OPD — menunjukkan alur kerja siapa melakukan apa' },
    { title: 'Diagram Peta Proses Bisnis Level 0 Interaktif', description: 'Online interactive tree di website + PDF untuk cetak/dokumentasi' },
    { title: 'Sistem Informasi PPB (Dashboard Publik)', description: 'Di https://pemdi-aceh-tengah.vercel.app — mode publik: ringkasan per level; mode internal: detail CFM, SOP' },
  ],
} // end requirementData

import { setCors } from '../../lib/cors';

export default function handler(req, res) {
  setCors(req, res);
  if (res.headersSent) return;
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
  res.status(200).json(requirementData);
}
