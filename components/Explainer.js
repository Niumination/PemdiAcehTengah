// Explainer — kotak info "❓ Apa itu …?"
// Gold left border (#b8860b), inline-able
export default function Explainer({ term, children }) {
  return (
    <div
      className="explainer-box"
      role="region"
      aria-label={`Penjelasan: ${term}`}
    >
      <strong style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.9375rem', color: '#8b6914' }}>
        ❓ Apa itu {term}?
      </strong>
      <div className="explainer-content" style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--ink)' }}>
        {children}
      </div>
      <style jsx>{`
        .explainer-box {
          border-left: 4px solid #b8860b;
          background: #fefcf5;
          padding: 1rem 1.25rem;
          border-radius: 6px;
          margin: 1rem 0;
        }
        .explainer-content p:last-child {
          margin-bottom: 0;
        }
        @media (max-width: 640px) {
          .explainer-box {
            padding: 0.75rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
