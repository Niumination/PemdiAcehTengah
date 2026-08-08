import '@/styles/globals.css';
import AppShell from '@/components/AppShell';
import SkmPrompt from '@/components/SkmPrompt';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
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
        <meta property="og:image" content="https://pemdi-aceh-tengah.vercel.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="https://pemdi-aceh-tengah.vercel.app/og-image.png" />
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
      <AppShell>
        <Component {...pageProps} />
      </AppShell>
      <SkmPrompt />
      <Analytics />
    </>
  );
}
