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
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400..800&display=swap" />
      </Head>
      <body>
        {/* Inline script for theme FOUC prevention — runs before any paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var t;
                try { t = localStorage.getItem('theme'); } catch(e){}
                // Default SELALU light — palette Navy/Beige/Gold adalah tema resmi
                if (!t) t = 'light';
                document.documentElement.setAttribute('data-theme', t);
              })();
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
