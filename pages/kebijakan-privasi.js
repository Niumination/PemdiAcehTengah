import Head from 'next/head';
import Link from 'next/link';

export default function KebijakanPrivasi() {
  return (
    <>
      <Head>
        <title>Kebijakan Privasi & Perlindungan Data Pribadi — Pemdi Aceh Tengah</title>
        <meta
          name="description"
          content="Kebijakan privasi dan perlindungan data pribadi Portal Pemerintah Digital Kabupaten Aceh Tengah. Informasi jenis data, tujuan, hak pengguna, dan keamanan."
        />
      </Head>

      {/* ============ HERO ============ */}
      <section className="section-hero-privasi" style={{
        background: 'linear-gradient(135deg, #004098 0%, #002060 100%)',
        color: 'white',
        padding: '2.5rem 0 2rem',
      }}>
        <div className="container">
          <Link href="/" className="back-link" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.875rem' }}>
            ← Beranda
          </Link>
          <div style={{ marginTop: '1rem' }}>
            <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.5rem' }}>
              Kebijakan Privasi & Perlindungan Data Pribadi
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem' }}>
              Komitmen Pemerintah Kabupaten Aceh Tengah dalam melindungi data pribadi Anda
            </p>
          </div>
        </div>
      </section>

      {/* ============ CONTENT ============ */}
      <section className="section" style={{ padding: '2rem 0 3rem' }}>
        <div className="container" style={{ maxWidth: '800px' }}>

          {/* Pendahuluan */}
          <div className="card" style={{ padding: '1.5rem 2rem', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
              🔒 Pendahuluan
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)', lineHeight: 1.7, margin: 0 }}>
              Pemerintah Kabupaten Aceh Tengah melalui Portal Pemerintah Digital (Pemdi Aceh Tengah) berkomitmen untuk 
              melindungi privasi dan keamanan data pribadi setiap pengguna. Kebijakan Privasi ini menjelaskan bagaimana 
              kami mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi Anda sesuai dengan peraturan 
              perundang-undangan yang berlaku di Indonesia, termasuk Undang-Undang Nomor 27 Tahun 2022 tentang 
              Perlindungan Data Pribadi (UU PDP).
            </p>
          </div>

          {/* Jenis Data */}
          <div className="card" style={{ padding: '1.5rem 2rem', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
              📋 Jenis Data yang Dikumpulkan
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)', marginBottom: '0.75rem' }}>
              Kami mengumpulkan data sebagai berikut:
            </p>
            <ul style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
              <li><strong>Data Identitas:</strong> Nama, alamat email, nomor telepon (jika Anda mengisi formulir kontak atau laporan).</li>
              <li><strong>Data Teknis:</strong> Alamat IP, jenis browser, sistem operasi, waktu akses, dan halaman yang dikunjungi.</li>
              <li><strong>Data Survei:</strong> Tanggapan Survei Kepuasan Masyarakat (SKM) yang Anda berikan secara sukarela.</li>
              <li><strong>Data Laporan:</strong> Informasi yang Anda sampaikan melalui fitur Lapor/Saran.</li>
              <li><strong>Data Cookie:</strong> Informasi preferensi pengguna melalui cookie teknis dan fungsional.</li>
            </ul>
          </div>

          {/* Tujuan */}
          <div className="card" style={{ padding: '1.5rem 2rem', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
              🎯 Tujuan Penggunaan Data
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)', marginBottom: '0.75rem' }}>
              Data pribadi Anda digunakan untuk:
            </p>
            <ul style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
              <li>Menyediakan dan meningkatkan layanan publik portal Pemdi Aceh Tengah.</li>
              <li>Memproses dan menindaklanjuti laporan, saran, atau pertanyaan yang Anda sampaikan.</li>
              <li>Mengukur indeks kepuasan masyarakat terhadap layanan publik melalui SKM.</li>
              <li>Menganalisis pola penggunaan portal untuk perbaikan pengalaman pengguna.</li>
              <li>Memenuhi kewajiban pelaporan dan evaluasi Pemerintah Digital sesuai peraturan perundang-undangan.</li>
              <li>Keperluan keamanan sistem dan pencegahan penyalahgunaan.</li>
            </ul>
          </div>

          {/* Hak Pengguna */}
          <div className="card" style={{ padding: '1.5rem 2rem', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
              ⚖️ Hak Pengguna
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)', marginBottom: '0.75rem' }}>
              Sesuai dengan UU Perlindungan Data Pribadi, Anda berhak untuk:
            </p>
            <ul style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
              <li><strong>Hak Akses:</strong> Meminta informasi tentang data pribadi yang kami simpan.</li>
              <li><strong>Hak Koreksi:</strong> Meminta perbaikan data yang tidak akurat.</li>
              <li><strong>Hak Hapus:</strong> Meminta penghapusan data pribadi Anda dalam kondisi tertentu.</li>
              <li><strong>Hak Batasan:</strong> Meminta pembatasan pemrosesan data.</li>
              <li><strong>Hak Keberatan:</strong> Menolak penggunaan data untuk tujuan tertentu.</li>
              <li><strong>Hak Portabilitas:</strong> Meminta salinan data dalam format yang dapat dibaca.</li>
            </ul>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '0.75rem', marginBottom: 0 }}>
              Untuk menggunakan hak-hak di atas, silakan hubungi kami melalui kontak yang tercantum di bawah.
            </p>
          </div>

          {/* Cookie */}
          <div className="card" style={{ padding: '1.5rem 2rem', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
              🍪 Penggunaan Cookie
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)', lineHeight: 1.7, margin: 0 }}>
              Portal Pemdi Aceh Tengah menggunakan cookie untuk meningkatkan pengalaman pengguna. Cookie yang kami gunakan 
              bersifat teknis dan fungsional, tidak melacak aktivitas Anda di luar portal ini. Anda dapat mengatur 
              preferensi cookie melalui pengaturan peramban Anda. Dengan terus menggunakan portal ini, Anda menyetujui 
              penggunaan cookie sesuai kebijakan ini.
            </p>
          </div>

          {/* Keamanan */}
          <div className="card" style={{ padding: '1.5rem 2rem', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
              🛡️ Keamanan Data
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)', lineHeight: 1.7, margin: 0 }}>
              Kami menerapkan langkah-langkah keamanan teknis dan organisasi untuk melindungi data pribadi Anda dari 
              akses tidak sah, perubahan, pengungkapan, atau penghancuran. Langkah-langkah tersebut meliputi enkripsi 
              data (HTTPS/SSL), pembatasan akses, firewall, pemantauan keamanan rutin, dan prosedur penanganan insiden. 
              Namun, tidak ada metode transmisi atau penyimpanan data yang 100% aman. Kami akan terus memperbarui 
              sistem keamanan sesuai perkembangan teknologi dan ancaman.
            </p>
          </div>

          {/* Kontak */}
          <div className="card" style={{ padding: '1.5rem 2rem', marginBottom: '1rem', borderLeft: '4px solid var(--primary)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
              📞 Kontak & Pengaduan
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--ink-secondary)', lineHeight: 1.7, margin: 0 }}>
              Jika Anda memiliki pertanyaan, keluhan, atau ingin menggunakan hak Anda terkait data pribadi, 
              silakan hubungi:
            </p>
            <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--ink-secondary)' }}>
              <p style={{ marginBottom: '0.375rem' }}>
                <strong>Pejabat Pengelola Informasi dan Dokumentasi (PPID)</strong>
              </p>
              <p style={{ marginBottom: '0.375rem' }}>
                Dinas Komunikasi, Informatika, dan Persandian Kabupaten Aceh Tengah
              </p>
              <p style={{ marginBottom: '0.375rem' }}>
                📧 <a href="mailto:ppid@acehtengahkab.go.id" style={{ color: 'var(--primary)' }}>ppid@acehtengahkab.go.id</a>
              </p>
              <p style={{ marginBottom: '0.375rem' }}>
                🌐 <a href="https://acehtengahkab.go.id" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>acehtengahkab.go.id</a>
              </p>
              <p style={{ margin: 0 }}>
                📍 Jl. Takengon-Isaq, Kompleks Perkantoran Pemkab Aceh Tengah, Takengon
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="card" style={{ padding: '1rem 2rem', textAlign: 'center', background: 'var(--bg)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: 0 }}>
              Kebijakan ini diperbarui terakhir pada 14 Juni 2026. Perubahan akan diumumkan melalui halaman ini.
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '0.5rem 0 0' }}>
              <Link href="/" style={{ color: 'var(--primary)' }}>← Kembali ke Beranda</Link>
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
