import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Portal Digital Pemerintah Daerah Kabupaten Aceh Tengah — Transformasi menuju Pemerintah Digital (Pemdi). Peta Proses Bisnis, Indeks SPBE, dan Rekomendasi Transformasi Digital." />
        <meta name="keywords" content="Aceh Tengah, SPBE, Pemerintah Digital, Pemdi, Peta Proses Bisnis, Transformasi Digital, Takengon" />
        <meta name="author" content="Pemdi Aceh Tengah" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Pemdi Aceh Tengah — Portal Digital Pemerintah Daerah" />
        <meta property="og:description" content="Transformasi menuju Pemerintah Digital Kabupaten Aceh Tengah. Open source government technology." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pemdi-aceh-tengah.vercel.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏛️</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
