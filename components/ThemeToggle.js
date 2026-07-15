import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'theme';

function persistTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* localStorage unavailable */
  }
}

function getPreferredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export default function ThemeToggle({ className, style: overrideStyle }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getPreferredTheme();
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
    persistTheme(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) {
          const next = e.matches ? 'dark' : 'light';
          setTheme(next);
          document.documentElement.setAttribute('data-theme', next);
        }
      } catch {
        /* ignore */
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      persistTheme(next);
      return next;
    });
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Beralih tema"
        className={`theme-tg ${className || ''}`.trim()}
        style={{ visibility: 'hidden', ...overrideStyle }}
      />
    );
  }

  const label = theme === 'dark' ? 'Beralih ke tema terang' : 'Beralih ke tema gelap';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`theme-tg ${className || ''}`.trim()}
      style={overrideStyle}
    >
      <span className="sun" aria-hidden="true">☀️</span>
      <span className="moon" aria-hidden="true">🌙</span>
    </button>
  );
}
