import { useState } from 'react';

export default function ExpandablePanel({ title, children, defaultOpen = false, badge }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`panel ${open ? 'panel-open' : ''}`}>
      <button className="panel-trigger" onClick={() => setOpen(!open)}>
        <span className="panel-trigger-text">
          {title}
          {badge && <span className="panel-badge">{badge}</span>}
        </span>
        <span className={`panel-arrow ${open ? 'panel-arrow-open' : ''}`}>
          ▼
        </span>
      </button>
      {open && (
        <div className="panel-content">
          {children}
        </div>
      )}
      <style jsx>{`
        .panel {
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          overflow: hidden;
          transition: box-shadow 0.2s;
        }
        .panel:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .panel + .panel {
          margin-top: 0.5rem;
        }
        .panel-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.75rem 1rem;
          background: #f8f8f8;
          border: none;
          cursor: pointer;
          font-size: 0.9375rem;
          font-weight: 500;
          color: #0b0c0c;
          text-align: left;
          transition: background 0.15s;
        }
        .panel-trigger:hover {
          background: #f0f0f0;
        }
        .panel-trigger-text {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .panel-badge {
          background: #1d70b8;
          color: white;
          font-size: 0.75rem;
          padding: 0.125rem 0.5rem;
          border-radius: 12px;
          font-weight: 500;
        }
        .panel-arrow {
          font-size: 0.75rem;
          color: #505a5f;
          transition: transform 0.2s;
        }
        .panel-arrow-open {
          transform: rotate(180deg);
        }
        .panel-content {
          padding: 1rem;
          border-top: 1px solid #e5e5e5;
          font-size: 0.9375rem;
          line-height: 1.6;
          color: #333;
        }
      `}</style>
    </div>
  );
}
