// Stepper — daftar tahapan dengan status aktif/berikutnya
// Props: steps = [{ title, desc, status: 'aktif'|'selesai'|'berikutnya' }]
export default function Stepper({ steps = [] }) {
  return (
    <div className="stepper" role="list" aria-label="Tahapan">
      {steps.map((step, i) => {
        const isActive = step.status === 'aktif';
        const isDone = step.status === 'selesai';
        const isNext = step.status === 'berikutnya';
        return (
          <div
            key={i}
            className={`stepper-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''} ${isNext ? 'next' : ''}`}
            role="listitem"
            aria-current={isActive ? 'step' : undefined}
          >
            <div className="stepper-left">
              <div className={`stepper-circle ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                {isDone ? '✓' : i + 1}
              </div>
              {i < steps.length - 1 && <div className={`stepper-line ${isDone ? 'done' : ''}`} />}
            </div>
            <div className="stepper-content">
              <div className="stepper-title">{step.title}</div>
              {step.desc && <div className="stepper-desc">{step.desc}</div>}
            </div>
          </div>
        );
      })}
      <style jsx>{`
        .stepper {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding: 0.5rem 0;
        }
        .stepper-step {
          display: flex;
          gap: 0.875rem;
          min-height: 60px;
        }
        .stepper-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 32px;
          flex-shrink: 0;
        }
        .stepper-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8125rem;
          font-weight: 700;
          background: var(--line);
          color: var(--muted);
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .stepper-circle.done {
          background: var(--ok);
          color: white;
        }
        .stepper-circle.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 0 0 4px var(--primary-50);
        }
        .stepper-line {
          width: 2px;
          flex: 1;
          min-height: 20px;
          background: var(--line);
          margin: 4px 0;
        }
        .stepper-line.done {
          background: var(--ok);
        }
        .stepper-content {
          padding-bottom: 1.5rem;
          flex: 1;
        }
        .stepper-title {
          font-weight: 600;
          font-size: 0.9375rem;
          color: var(--ink);
          margin-top: 0.375rem;
        }
        .stepper-desc {
          font-size: 0.8125rem;
          color: var(--muted);
          margin-top: 0.25rem;
          line-height: 1.5;
        }
        .stepper-step.next .stepper-title {
          color: var(--muted-light);
        }
        .stepper-step:last-child .stepper-content {
          padding-bottom: 0;
        }
        @media (max-width: 640px) {
          .stepper-circle {
            width: 28px;
            height: 28px;
            font-size: 0.75rem;
          }
          .stepper-left {
            width: 28px;
          }
        }
      `}</style>
    </div>
  );
}
