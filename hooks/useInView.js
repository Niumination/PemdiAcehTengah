import { useState, useEffect, useRef } from 'react';

/**
 * useInView — IntersectionObserver hook ANTI-GAGAL.
 * - prefers-reduced-motion → langsung true (konten tetap terlihat).
 * - Tidak ada IO / ref null → langsung true.
 * - Fallback timeout 3s → paksa true (IO diblokir oleh lingkungan apapun).
 * @param {Object} opts { threshold, rootMargin, once }
 * @returns {[ref, inView]}
 */
export default function useInView({ threshold = 0.15, rootMargin = '0px 0px -40px 0px', once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setInView(true);
      return;
    }

    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold, rootMargin }
    );
    io.observe(el);

    const timer = setTimeout(() => setInView(true), 3000);

    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}