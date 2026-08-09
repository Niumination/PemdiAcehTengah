import { useState, useEffect, useRef } from 'react';

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * useCountUp — animasi angka naik saat elemen masuk viewport.
 * Tanpa dependency eksternal; hormati prefers-reduced-motion (langsung ke target).
 *
 * @param {number} target     nilai akhir
 * @param {Object} opts       { duration(ms), decimals, start (mulai saat inView) }
 * @returns {[ref, displayValue]}
 */
export default function useCountUp(target, { duration = 1400, decimals = 0, start = true } = {}) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const startedRef = useRef(false);

  // IntersectionObserver ringan (tanpa dependency ke useInView agar mandiri)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      setInView(true);
      return;
    }
    if (!('IntersectionObserver' in window)) {
      setValue(target);
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  useEffect(() => {
    if (!inView || !start || startedRef.current) return;
    startedRef.current = true;

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }

    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      setValue(target * easeOutExpo(p));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, start, target, duration]);

  const display = Number.isFinite(value)
    ? value.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : target.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  return [ref, display];
}