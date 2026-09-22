import '@/styles/globals.css';
import localFont from 'next/font/local';
import AppShell from '@/components/AppShell';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Analytics } from '@vercel/analytics/react';

/**
 * Sprint B1 (2026-09-18): Plus Jakarta Sans di-self-host via next/font/local
 * (variable TTF 400–800, lihat fonts/OFL.txt). Menggantikan 3 <link> Google
 * Fonts di _document → nol request pihak ketiga, nol render-blocking, font
 * fallback otomatis, dan CSP style-src/font-src cukup 'self'.
 */
const plusJakartaSans = localFont({
  src: '../fonts/PlusJakartaSans-Variable.ttf',
  weight: '400 800',
  display: 'swap',
  variable: '--font-pjs',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pemdi-aceh-tengah.vercel.app';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  // Canonical & og:url — tanpa query/hash, home tanpa trailing path (audit SEO 2026-09-17)
  const cleanPath = (router.asPath || '/').split('?')[0].split('#')[0];
  const canonical = `${SITE_URL}${cleanPath === '/' ? '' : cleanPath}`;

  return (
    <>
      <Head>
        <link rel="canonical" href={canonical} />
        <meta property="og:url" content={canonical} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#1F2A44" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#10162A" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Pemdi Aceh Tengah" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="mask-icon" href="/icons/icon-maskable-512.png" color="#1F2A44" />
        <meta property="og:image" content="https://pemdi-aceh-tengah.vercel.app/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="https://pemdi-aceh-tengah.vercel.app/og-image.jpg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "GovernmentOrganization",
            "name": "Pemerintah Kabupaten Aceh Tengah",
            "alternateName": "Pemdi Aceh Tengah",
            "url": "https://pemdi-aceh-tengah.vercel.app",
            "logo": "https://pemdi-aceh-tengah.vercel.app/icons/icon-512.png",
            "areaServed": "Kabupaten Aceh Tengah, Aceh, Indonesia",
            "sameAs": ["https://acehtengahkab.go.id"]
          }) }}
        />
      </Head>
      <div className={plusJakartaSans.variable}>
        <AppShell>
          <Component {...pageProps} />
        </AppShell>
      </div>
      <Analytics />
    </>
  );
}
