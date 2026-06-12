import '@/styles/globals.css';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="theme-color" content="#1f6f43" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
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
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Analytics />
    </>
  );
}
