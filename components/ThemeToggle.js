import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'theme';

/* ── CSS variable definitions (injected via <style> for SSR safety) ── */
const themeCSS = `
  :root,
  [data-theme="light"] {
    --ink: #212529;
    --ink-secondary: #495057;
    --bg: #ffffff;
    --surface: #f8f9fa;
    --surface-hover: #f1f3f5;
    --surface-raise: #ffffff;
    --line: #dee2e6;
    --gold: #b8860b;
    --accent: #1d70b8;
  }
  [data-theme="dark"] {
    --ink: #e4e6eb;
    --ink-secondary: #b0b3b8;
    --bg: #18191a;
    --surface: #242526;
    --surface-hover: #3a3b3c;
    --surface-raise: #3a3b3c;
    --line: #3e4042;
    --gold: #f0c040;
    --accent: #6ea8fe;
  }
  /* Smooth transitions for theme changes */
  html {
    transition: background 0.25s ease, color 0.25s ease;
  }
  html *,
  html *::before,
  html *::after {
    transition: background-color 0.2s ease, border-color 0.2s ease,
      color 0.2s ease, box-shadow 0.2s ease;
  }
  @media (prefers-reduced-motion: reduce) {
    html,
    html *,
    html *::before,
    html *::after {
      transition-duration: 0s !important;
    }
  }
`;

/* ── Inject the theme <style> tag once ── */
let styleInjected = false;
function injectThemeStyle() {
  if (typeof document === 'undefined' || styleInjected) return;
  const existing = document.getElementById('__themeVars');
  if (existing) return;
  const style = document.createElement('style');
  style.id = '__themeVars';
  style.textContent = themeCSS;
  document.head.appendChild(style);
  styleInjected = true;
}

/* ── Persist and apply theme ── */
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

/* ── Component ── */
export default function ThemeToggle({ className, style: overrideStyle }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  /* Bootstrap */
  useEffect(() => {
    injectThemeStyle();
    const initial = getPreferredTheme();
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
    persistTheme(initial);
    setMounted(true);
  }, []);

  /* Listen for OS preference changes (only when user hasn't explicitly chosen) */
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

  /* Avoid flash: render invisible placeholder until mounted */
  if (!mounted) {
    return (
      <button
        aria-label="Beralih tema"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.25rem',
          padding: 6,
          borderRadius: 'var(--radius, 8px)',
          lineHeight: 1,
          visibility: 'hidden',
          ...overrideStyle,
        }}
        className={className}
      />
    );
  }

  const icon = theme === 'dark' ? '☀️' : '🌙';
  const label = theme === 'dark' ? 'Beralih ke tema terang' : 'Beralih ke tema gelap';

  return (
    <button
      onClick={toggle}
      aria-label={label}
      title={label}
      className={className}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.25rem',
        padding: 6,
        borderRadius: 'var(--radius, 8px)',
        lineHeight: 1,
        transition: 'transform 0.2s ease, opacity 0.2s ease',
        opacity: 0.85,
        ...overrideStyle,
      }}
    >
      {icon}
    </button>
  );
}
