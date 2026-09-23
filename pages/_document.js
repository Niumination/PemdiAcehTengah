import { NOINDEX } from '@/lib/modeSitus';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        <meta charSet="utf-8" />
        <meta name="keywords" content="Aceh Tengah, SPBE, Pemerintah Digital, Pemdi, Peta Proses Bisnis, Transformasi Digital, Takengon" />
        <meta name="author" content="Pemdi Aceh Tengah" />
        <meta name="robots" content={NOINDEX ? "noindex, nofollow" : "index, follow"} />
        {/* description & og:url di-set per-halaman (pages/*.js + _app.js canonical)
            — jangan duplikat di sini (pemeriksaan ulang 2026-09-17) */}
        <meta property="og:title" content="Pemdi Aceh Tengah — Portal Digital Pemerintah Daerah" />
        <meta property="og:description" content="Transformasi menuju Pemerintah Digital Kabupaten Aceh Tengah. Open source government technology." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        {/* Font Plus Jakarta Sans di-self-host via next/font/local — lihat _app.js (Sprint B1) */}
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
                // Patch 8: lebar halaman (penuh | 1800 | 1440), default penuh
                var l; try { l = localStorage.getItem('pemdi:lebar'); } catch(e){}
                if (l !== '1800' && l !== '1440') l = 'penuh';
                document.documentElement.setAttribute('data-lebar', l);
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
