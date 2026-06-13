// Section — wrapper reusable untuk setiap section halaman
// Eyebrow → Title → Subtitle → Children
export default function Section({ eyebrow, title, subtitle, children, className = '', id, style }) {
  return (
    <section className={`section ${className}`} id={id} style={style}>
      <div className="container">
        {eyebrow && (
          <span className="badge badge-blue mb-2">{eyebrow}</span>
        )}
        {title && <h2>{title}</h2>}
        {subtitle && (
          <p style={{ color: 'var(--muted)', maxWidth: '640px', marginBottom: '1.5rem' }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
