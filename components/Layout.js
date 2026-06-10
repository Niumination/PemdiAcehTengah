import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollTop from './ScrollTop';
import LaporWidget from './LaporWidget';

export default function Layout({ children }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className={loaded ? 'page-loaded' : 'page-loading'}>
      {/* Skip to content — WCAG 2.4.1 */}
      <a href="#main-content" className="skip-link">Langsung ke konten utama</a>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <ScrollTop />
      <LaporWidget />
    </div>
  );
}
