/**
 * ServiceCard — Kartu layanan publik
 * Props:
 *   layanan — { nama, kategori, deskripsi, slug, waktu, biaya, persyaratan, status, sla }
 *   onClick  — callback saat kartu diklik (opsional)
 */
import { useState } from 'react';

export default function ServiceCard({ layanan = {}, onClick }) {
  const [expanded, setExpanded] = useState(false);
  const {
    nama = 'Layanan',
    kategori = 'Umum',
    deskripsi = '',
    waktu = '-',
    biaya = '-',
    status = 'Aktif',
    sla = '',
    persyaratan = '',
  } = layanan;

  const truncated = deskripsi.length > 100 ? deskripsi.slice(0, 100) + '…' : deskripsi;
  const slaNum = typeof sla === 'string' ? parseInt(sla) : typeof sla === 'number' ? sla : 0;
  const slaColor = slaNum >= 90 ? 'var(--forest-green)' : slaNum >= 80 ? 'var(--warning-amber)' : 'var(--danger-red)';

  const handleClick = () => {
    if (onClick) {
      onClick(layanan);
    } else {
      setExpanded((prev) => !prev);
    }
  };

  return (
    <div
      className="service-card"
      onClick={handleClick}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r)',
        padding: '1.25rem',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        boxShadow: 'var(--sh-sm)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--sh)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = 'var(--sh-sm)';
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      aria-expanded={expanded}
    >
      {/* Header: ikon + nama + badge kategori */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div
          className="service-icon"
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'var(--primary-50)',
            display: 'grid',
            placeItems: 'center',
            fontSize: '1.125rem',
            flexShrink: 0,
            color: 'var(--primary)',
          }}
        >
          📋
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="service-name" style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--ink)', marginBottom: '0.25rem' }}>
            {nama}
          </div>
          <span
            className="service-category"
            style={{
              display: 'inline-block',
              fontSize: '0.6875rem',
              fontWeight: 600,
              padding: '0.125rem 0.5rem',
              borderRadius: 99,
              background: 'var(--primary-50)',
              color: 'var(--primary)',
            }}
          >
            {kategori}
          </span>
        </div>
        {status === 'Aktif' && (
          <span
            className="service-status"
            style={{
              fontSize: '0.625rem',
              fontWeight: 700,
              padding: '0.125rem 0.5rem',
              borderRadius: 99,
              background: 'var(--ok-bg)',
              color: 'var(--forest-green)',
              whiteSpace: 'nowrap',
            }}
          >
            Aktif
          </span>
        )}
      </div>

      {/* Deskripsi */}
      <p className="service-desc" style={{ fontSize: '0.8125rem', color: 'var(--ink-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
        {expanded ? deskripsi : truncated}
      </p>

      {/* Expanded details */}
      {expanded && (
        <div style={{ marginBottom: '0.75rem', animation: 'fadeIn 0.2s ease' }}>
          {waktu && waktu !== '-' && (
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-secondary)', marginBottom: '0.25rem' }}>
              ⏱ Waktu: <strong>{waktu}</strong>
            </div>
          )}
          {biaya && (
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-secondary)', marginBottom: '0.25rem' }}>
              💰 Biaya: <strong>{biaya}</strong>
            </div>
          )}
          {persyaratan && (
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-secondary)', marginBottom: '0.25rem' }}>
              📋 Syarat: <strong>{persyaratan}</strong>
            </div>
          )}
        </div>
      )}

      {/* Footer: waktu + SLA badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        <span className="sla-badge" style={{ fontSize: '0.6875rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          ⏱ {waktu}
        </span>
        {sla && (
          <span
            className="sla-badge"
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '0.125rem 0.5rem',
              borderRadius: 99,
              background: slaNum >= 90 ? 'var(--ok-bg)' : slaNum >= 80 ? 'var(--warn-bg)' : 'var(--bad-bg)',
              color: slaColor,
            }}
          >
            SLA {slaNum}%
          </span>
        )}
      </div>
    </div>
  );
}
