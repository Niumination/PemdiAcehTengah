import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollTop from './ScrollTop';

export default function Layout({ children }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className={loaded ? 'page-loaded' : 'page-loading'}>
      <Header />
      <main>{children}</main>
      <Footer />
      <ScrollTop />
    </div>
  );
}
