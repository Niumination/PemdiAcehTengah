/**
 * KerawangHero — hero section seragam bertema Kerawang Gayo.
 * Wrapper pola berulang: hero-grad + motif dekoratif + gold-head.
 * Props: eyebrow, title, children (paragraf & konten tambahan), motif, backLink
 */
import { MotifEmun, MotifUlen, MotifTapak, MotifRante, MotifPucukRebung } from './KerawangMotifs';

const MOTIFS = {
  emun: (s) => <MotifEmun size={s} animated={false} />,
  ulen: (s) => <MotifUlen size={Math.round(s * 0.35)} />,
  tapak: (s) => <MotifTapak size={Math.round(s * 0.4)} />,
  rante: (s) => <MotifRante size={Math.round(s * 0.6)} />,
  rebung: (s) => <MotifPucukRebung size={Math.round(s * 0.3)} />,
};

export default function KerawangHero({
  eyebrow,
  title,
  titleClass = 'gold-head',
  children,
  motif = 'emun',
  backLink = null,
  padding = '2.5rem 2rem',
  borderRadius = 'var(--r)',
  style,
}) {
  const Top = MOTIFS[motif] || MOTIFS.emun;
  return (
    <section
      data-reveal
      style={{
        background: 'var(--hero-grad)',
        borderRadius,
        padding,
        marginBottom: '2rem',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {motif && (
        <>
          <div style={{ position: 'absolute', top: -20, right: 6, opacity: 0.5, pointerEvents: 'none' }} aria-hidden="true">
            {Top(300)}
          </div>
          <div style={{ position: 'absolute', bottom: -12, left: 12, opacity: 0.32, pointerEvents: 'none' }} aria-hidden="true">
            {Top(200)}
          </div>
        </>
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {backLink}
        {eyebrow && (
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7, marginBottom: '0.5rem' }}>
            {eyebrow}
          </div>
        )}
        <h1 className={titleClass} style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: children ? '0.75rem' : 0, lineHeight: 1.2 }}>
          {title}
        </h1>
        {children && (
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: 640, marginTop: '0.25rem' }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}