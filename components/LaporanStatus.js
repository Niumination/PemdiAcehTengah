/**
 * LaporanStatus — Tracking status laporan warga dengan timeline steps
 * Props:
 *   id — string ID laporan (format: LAPOR-xxx)
 *
 * Fetch dari /api/lapor?id=xxx
 * Menampilkan: ID laporan, status badge, timeline visual, respon admin
 */
import { useState, useEffect } from 'react';

const STATUS_LABEL = {
  baru: '🔵 Baru',
  diproses: '🟡 Diproses',
  selesai: '🟢 Selesai',
  ditolak: '🔴 Ditolak',
};

const STATUS_URUTAN = ['baru', 'diproses', 'selesai'];

export default function LaporanStatus({ id = '' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id || id.trim() === '') return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const res = await fetch(`/api/lapor?id=${encodeURIComponent(id.trim())}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.error || 'Laporan tidak ditemukan');
        }
      } catch (err) {
        setError('Gagal menghubungi server. Coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // --- RENDER ---
  const rootStyle = {
    background: 'var(--surface)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--r)',
    padding: '1.5rem',
    boxShadow: 'var(--sh-sm)',
  };

  /* ============ LOADING ============ */
  if (loading) {
    return (
      <div className="lapor-status-root" style={rootStyle}>
        <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⏳</div>
          <p style={{ fontSize: '0.9375rem' }}>Memuat data laporan...</p>
        </div>
      </div>
    );
  }

  /* ============ ERROR ============ */
  if (error) {
    return (
      <div className="lapor-status-root" style={rootStyle}>
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>❌</div>
          <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--danger-red)', marginBottom: '0.25rem' }}>
            {error}
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
            Periksa kembali ID laporan Anda
          </p>
        </div>
      </div>
    );
  }

  /* ============ EMPTY (belum ada ID) ============ */
  if (!data) {
    return (
      <div className="lapor-status-root" style={rootStyle}>
        <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📋</div>
          <p style={{ fontSize: '0.9375rem' }}>Masukkan ID laporan untuk melihat status</p>
        </div>
      </div>
    );
  }

  /* ============ DATA ============ */
  const { status = 'baru', dibuat, diupdate, respon_admin, kategori, pesan } = data;
  const ditolak = status === 'ditolak';
  const isTerminal = status === 'selesai' || ditolak;

  // Tentukan langkah timeline yang sudah complete / active
  const getStepStatus = (step) => {
    if (ditolak) {
      // Kalau ditolak, semua langkah normal selesai, tapi langkah terakhir jadi ditolak
      if (step === 'baru') return 'complete';
      if (step === 'diproses') return 'complete';
      return 'inactive';
    }
    const idxStep = STATUS_URUTAN.indexOf(step);
    const idxCurrent = STATUS_URUTAN.indexOf(status);
    if (idxStep < idxCurrent) return 'complete';
    if (idxStep === idxCurrent) return 'active';
    return 'inactive';
  };

  return (
    <div className="lapor-status-root" style={rootStyle}>
      {/* Header: ID + status */}
      <div className="lapor-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>ID LAPORAN</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, color: 'var(--ink)' }}>
              {data.id}
            </div>
          </div>
          <span
            className="lapor-status-badge"
            style={{
              padding: '0.375rem 0.875rem',
              borderRadius: 99,
              fontWeight: 700,
              fontSize: '0.75rem',
              background:
                status === 'baru' ? 'var(--primary-50)' :
                status === 'diproses' ? 'var(--warn-bg)' :
                status === 'selesai' ? 'var(--ok-bg)' :
                'var(--bad-bg)',
              color:
                status === 'baru' ? 'var(--primary)' :
                status === 'diproses' ? 'var(--warning-amber)' :
                status === 'selesai' ? 'var(--forest-green)' :
                'var(--danger-red)',
            }}
          >
            {STATUS_LABEL[status] || status}
          </span>
        </div>

        {/* Info tambahan */}
        <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: 'var(--muted)' }}>
          {kategori && <span>Kategori: <strong style={{ color: 'var(--ink-secondary)' }}>{kategori}</strong></span>}
          {dibuat && (
            <span>
              Dikirim: {new Date(dibuat).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </span>
          )}
          {diupdate && (
            <span>
              Diperbarui: {new Date(diupdate).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </span>
          )}
        </div>

        {pesan && (
          <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg)', borderRadius: 'var(--r-xs)', fontSize: '0.8125rem', color: 'var(--ink-secondary)' }}>
            <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--ink)' }}>Pesan Anda:</strong>
            {pesan}
          </div>
        )}
      </div>

      {/* --- Timeline Visual --- */}
      <div className="lapor-timeline" style={{ position: 'relative', padding: '0.5rem 0' }}>
        <div
          className="lapor-timeline-line"
          style={{
            position: 'absolute',
            left: 15,
            top: 24,
            bottom: 24,
            width: 2,
            background: 'var(--line)',
            borderRadius: 1,
          }}
        />

        {/* Step: Baru */}
        <LaporTimelineStep
          label="Laporan Diterima"
          date={dibuat}
          status={getStepStatus('baru')}
          isLast={ditolak}
        />

        {/* Step: Diproses */}
        <LaporTimelineStep
          label="Sedang Diproses"
          date={diupdate}
          status={getStepStatus('diproses')}
          isLast={ditolak}
        />

        {/* Step: Selesai / Ditolak */}
        <LaporTimelineStep
          label={ditolak ? 'Ditolak' : 'Selesai'}
          date={diupdate}
          status={ditolak ? 'rejected' : getStepStatus('selesai')}
          isLast={true}
          isRejected={ditolak}
        />
      </div>

      {/* Respon admin */}
      {respon_admin && (
        <div
          className="lapor-admin-response"
          style={{
            marginTop: '1rem',
            padding: '0.875rem 1rem',
            background: 'var(--primary-50)',
            borderRadius: 'var(--r-xs)',
            borderLeft: '3px solid var(--primary)',
          }}
        >
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--primary)', marginBottom: '0.375rem' }}>
            💬 Respon Admin
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--ink-secondary)', lineHeight: 1.5, margin: 0 }}>
            {respon_admin}
          </p>
        </div>
      )}
    </div>
  );
}

/* === Sub-component: Satu langkah timeline === */
function LaporTimelineStep({ label, date, status, isLast = false, isRejected = false }) {
  const isComplete = status === 'complete';
  const isActive = status === 'active';
  const isInactive = status === 'inactive';

  const dotColor = isRejected
    ? 'var(--danger-red)'
    : isComplete
    ? 'var(--forest-green)'
    : isActive
    ? 'var(--lake-cyan)'
    : 'var(--line)';

  const dotBg = isRejected
    ? 'var(--bad-bg)'
    : isComplete
    ? 'var(--ok-bg)'
    : isActive
    ? '#e0f7f6'
    : 'var(--surface)';

  const dotSymbol = isRejected
    ? '✕'
    : isComplete
    ? '✓'
    : isActive
    ? '●'
    : '○';

  return (
    <div
      className="lapor-step"
      style={{
        display: 'flex',
        gap: '1rem',
        paddingBottom: isLast ? 0 : '1.25rem',
        position: 'relative',
        minHeight: 48,
        alignItems: 'flex-start',
      }}
    >
      {/* Dot */}
      <div
        className={'step-dot step-dot-' + (isComplete ? 'complete' : isActive ? 'active' : 'inactive')}
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 700,
          background: dotBg,
          color: dotColor,
          border: `2px solid ${dotColor}`,
          flexShrink: 0,
          zIndex: 1,
          position: 'relative',
          transition: 'all 0.3s',
        }}
      >
        {dotSymbol}
      </div>

      {/* Content */}
      <div className="step-label" style={{ paddingTop: '0.25rem' }}>
        <div
          style={{
            fontSize: '0.875rem',
            fontWeight: isActive || isComplete ? 700 : 500,
            color: isActive ? 'var(--lake-cyan)' : isComplete ? 'var(--forest-green)' : isRejected ? 'var(--danger-red)' : 'var(--muted)',
          }}
        >
          {label}
        </div>
        {date && (
          <div style={{ fontSize: '0.6875rem', color: 'var(--muted)', marginTop: '0.125rem' }}>
            {new Date(date).toLocaleDateString('id-ID', {
              year: 'numeric', month: 'short', day: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </div>
        )}
      </div>
    </div>
  );
}
