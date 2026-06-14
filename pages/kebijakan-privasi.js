import Head from 'next/head';
import Link from 'next/link';

export default function KebijakanPrivasi() {
  return (
    <>
      <Head>
        <title>Kebijakan Privasi — Pemdi Aceh Tengah</title>
        <meta name="description" content="Kebijakan privasi portal Pemdi Aceh Tengah — bagaimana data Anda dikumpulkan, digunakan, dan dilindungi sesuai UU PDP 27/2022." />
        <meta property="og:title" content="Kebijakan Privasi — Pemdi Aceh Tengah" />
        <meta property="og:description" content="Kebijakan privasi portal Pemdi Aceh Tengah — bagaimana data Anda dikumpulkan, digunakan, dan dilindungi." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pemdi-aceh-tengah.vercel.app/kebijakan-privasi" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kebijakan Privasi — Pemdi Aceh Tengah" />
        <meta name="twitter:description" content="Kebijakan privasi portal Pemdi Aceh Tengah — UU PDP 27/2022 compliant." />
      </Head>

      <section className="section-hero-privasi">
        <div className="container">
          <Link href="/" className="back-link">← Beranda</Link>
          <div style={{ marginTop: '1rem' }}>
            <h1>Kebijakan Privasi</h1>
            <p>Bagaimana kami mengelola dan melindungi data pribadi Anda — sesuai UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (PDP)</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '2rem', lineHeight: 1.8 }}>
            <p style={{ fontSize: '0.875rem', color: '#505a5f', marginBottom: '1.5rem' }}>
              <strong>Terakhir diperbarui:</strong> 14 Juni 2026
            </p>

            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.75rem' }}>1. Pendahuluan</h2>
            <p style={{ fontSize: '0.875rem', color: '#333' }}>
              Portal <strong>Pemdi Aceh Tengah</strong> (https://pemdi-aceh-tengah.vercel.app) adalah portal
              digital resmi Pemerintah Kabupaten Aceh Tengah yang dikelola oleh Dinas Komunikasi dan Informatika
              (Diskominfo) Kabupaten Aceh Tengah. Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan,
              menggunakan, menyimpan, dan melindungi data pribadi pengguna, sesuai dengan ketentuan{' '}
              <strong>Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)</strong>.
            </p>

            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.75rem' }}>2. Data yang Dikumpulkan</h2>
            <p style={{ fontSize: '0.875rem', color: '#333' }}>Kami mengumpulkan data berikut:</p>
            <ul style={{ fontSize: '0.875rem', color: '#333', paddingLeft: '1.25rem', marginBottom: '1rem' }}>
              <li><strong>Data yang Anda berikan secara sukarela:</strong> Nama (opsional), kontak (opsional), pesan/saran melalui fitur Lapor, dan respons Survei Kepuasan Masyarakat (SKM).</li>
              <li><strong>Data teknis otomatis:</strong> Alamat IP (dihash — tidak tersimpan dalam bentuk asli), jenis browser, halaman yang dikunjungi, durasi kunjungan, dan data agregat lainnya melalui Vercel Analytics.</li>
              <li><strong>Cookie fungsional:</strong> Kami tidak menggunakan cookie pelacak. Session storage digunakan semata untuk menyimpan token sesi admin (tidak untuk pengguna umum).</li>
            </ul>

            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.75rem' }}>3. Tujuan Penggunaan Data</h2>
            <p style={{ fontSize: '0.875rem', color: '#333' }}>Data yang dikumpulkan digunakan untuk:</p>
            <ul style={{ fontSize: '0.875rem', color: '#333', paddingLeft: '1.25rem', marginBottom: '1rem' }}>
              <li>Meningkatkan kualitas layanan publik dan portal digital</li>
              <li>Menganalisis kepuasan pengguna melalui SKM (bersifat agregat dan anonim)</li>
              <li>Menindaklanjuti laporan, saran, atau pengaduan yang masuk</li>
              <li>Menyusun laporan Indeks Pemerintah Digital (Pemdi) — khususnya indikator I19 dan I20</li>
              <li>Memantau dan mengamankan infrastruktur portal dari ancaman siber</li>
            </ul>

            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.75rem' }}>4. Perlindungan Data</h2>
            <p style={{ fontSize: '0.875rem', color: '#333' }}>
              Kami menerapkan langkah-langkah keamanan teknis dan organisasi untuk melindungi data pribadi Anda:
            </p>
            <ul style={{ fontSize: '0.875rem', color: '#333', paddingLeft: '1.25rem', marginBottom: '1rem' }}>
              <li>Enkripsi HTTPS/TLS untuk seluruh komunikasi dengan portal</li>
              <li>IP hashing (SHA-256) — alamat IP tidak disimpan dalam bentuk asli</li>
              <li>Content Security Policy (CSP) headers untuk mencegah XSS dan serangan injeksi</li>
              <li>Rate limiting pada endpoint API untuk mencegah penyalahgunaan</li>
              <li>Cloudflare Turnstile CAPTCHA pada form publik (tanpa pelacakan)</li>
              <li>Tidak ada data sensitif (seperti nomor KTP, alamat lengkap, data keuangan) yang dikumpulkan</li>
            </ul>

            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.75rem' }}>5. Penyimpanan & Retensi Data</h2>
            <p style={{ fontSize: '0.875rem', color: '#333' }}>
              Data disimpan di <strong>Supabase</strong> (platform database terkelola) yang memenuhi standar keamanan
              industri. Data survei dan laporan disimpan selama diperlukan untuk keperluan evaluasi layanan dan
              pelaporan Pemdi. Anda dapat meminta penghapusan data Anda dengan menghubungi kami melalui kontak
              di bawah.
            </p>

            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.75rem' }}>6. Hak Anda (UU PDP 27/2022)</h2>
            <p style={{ fontSize: '0.875rem', color: '#333' }}>
              Berdasarkan UU PDP 27/2022, Anda memiliki hak-hak berikut terkait data pribadi Anda:
            </p>
            <ul style={{ fontSize: '0.875rem', color: '#333', paddingLeft: '1.25rem', marginBottom: '1rem' }}>
              <li>Hak untuk mengetahui tujuan pemrosesan data</li>
              <li>Hak untuk mengakses data pribadi Anda</li>
              <li>Hak untuk memperbaiki data yang tidak akurat</li>
              <li>Hak untuk menghapus data pribadi Anda</li>
              <li>Hak untuk membatasi pemrosesan data</li>
              <li>Hak untuk menarik persetujuan pemrosesan data</li>
            </ul>

            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.75rem' }}>7. Pengungkapan ke Pihak Ketiga</h2>
            <p style={{ fontSize: '0.875rem', color: '#333' }}>
              Kami tidak menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga untuk
              tujuan komersial. Data dapat diungkapkan jika diwajibkan oleh hukum atau peraturan perundang-undangan
              yang berlaku, atau dalam rangka proses hukum yang sah.
            </p>

            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.75rem' }}>8. Perubahan Kebijakan</h2>
            <p style={{ fontSize: '0.875rem', color: '#333' }}>
              Kebijakan privasi ini dapat diperbarui dari waktu ke waktu. Perubahan signifikan akan
              diinformasikan melalui portal. Kami menyarankan Anda untuk meninjau halaman ini secara berkala.
            </p>

            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.75rem' }}>9. Kontak</h2>
            <p style={{ fontSize: '0.875rem', color: '#333' }}>
              Jika Anda memiliki pertanyaan, kekhawatiran, atau ingin menggunakan hak Anda berdasarkan UU PDP,
              silakan hubungi:
            </p>
            <div className="card" style={{ padding: '1rem', background: '#f8f9fa', marginTop: '0.5rem', fontSize: '0.875rem' }}>
              <strong>Dinas Komunikasi dan Informatika Kabupaten Aceh Tengah</strong><br />
              Jl. Nyak Neh No. 1, Takengon, Aceh Tengah<br />
              Email: <a href="mailto:diskominfoacehtengah@gmail.com" style={{ color: '#1d70b8' }}>diskominfoacehtengah@gmail.com</a><br />
              Portal: <a href="https://acehtengahkab.go.id" target="_blank" rel="noopener noreferrer" style={{ color: '#1d70b8' }}>acehtengahkab.go.id</a>
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb', fontSize: '0.75rem', color: '#888', textAlign: 'center' }}>
              Portal Pemdi Aceh Tengah — Open Source Government Technology.{' '}
              <Link href="/" style={{ color: '#1d70b8' }}>Kembali ke Beranda</Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .section-hero-privasi {
          background: linear-gradient(135deg, #004098 0%, #002060 100%);
          color: white;
          padding: 2.5rem 0 2rem;
        }
        .section-hero-privasi .back-link { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 0.875rem; }
        .section-hero-privasi .back-link:hover { color: white; text-decoration: underline; }
        .section-hero-privasi h1 { color: white; font-size: 2rem; margin-bottom: 0.5rem; }
        .section-hero-privasi p { color: rgba(255,255,255,0.85) !important; font-size: 1rem; }
      `}</style>
    </>
  );
}
