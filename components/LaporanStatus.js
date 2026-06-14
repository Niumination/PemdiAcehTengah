import { useState } from 'react';

const STATUS_MAP = {
  diterima: { label: 'Diterima', icon: '📩' },
  ditinjau: { label: 'Ditinjau', icon: '🔍' },
  diproses: { label: 'Diproses', icon: '⚙️' },
  selesai: { label: 'Selesai', icon: '✅' },
  ditolak: { label: 'Ditolak', icon: '❌' },
};

const STATUS_ORDER = ['diterima', 'ditinjau', 'diproses', 'selesai'];

export default function LaporanStatus({ onClose }) {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const cariLaporan = async (e) => {
    e.preventDefault();
    const id = trackingId.trim();
    if (!id) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/lapor?id=${encodeURIComponent(id)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Laporan tidak ditemukan');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) => STATUS_ORDER.indexOf(status);

  return (
    <div className="modal-tracking-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose?.();
    }}>
      <div className="modal-tracking">
        <div className="modal-tracking-header">
          <h3>📋 Lacak Status Laporan</h3>
          <button className="modal-tracking-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-tracking-body">
          <form className="modal-tracking-search" onSubmit={cariLaporan}>
            <input
              type="text"
              className="modal-tracking-input"
              placeholder="Masukkan ID laporan (cth: LAP-2406-XXXX)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              aria-label="ID Laporan"
            />
            <button
              type="submit"
              className="modal-tracking-btn"
              disabled={loading || !trackingId.trim()}
            >
              {loading ? '⏳' : 'Cari'}
            </button>
          </form>

          {error && (
            <div className="tracking-error">
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>😕</div>
              {error}
            </div>
          )}

          {result && (
            <div className="tracking-result">
              <div className="tracking-result-header">
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                    {result.judul || 'Laporan'}
                  </div>
                  <div className="tracking-id">ID: {result.id}</div>
                </div>
                <span className={`status-badge ${result.status || 'diterima'}`}>
                  <span className="dot" />
                  {STATUS_MAP[result.status]?.label || 'Diterima'}
                </span>
              </div>

              <div className="tracking-timeline">
                {STATUS_ORDER.map((s, i) => {
                  const currentIdx = getStatusIndex(result.status);
                  const isCompleted = i < currentIdx;
                  const isActive = i === currentIdx;
                  const stepStatus = result.status === 'ditolak' && i === 3
                    ? 'ditolak'
                    : s;

                  // Hide future steps if rejected
                  if (result.status === 'ditolak' && i > currentIdx + 1) return null;

                  return (
                    <div
                      key={s}
                      className={`tracking-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    >
                      <span className="tracking-step-dot" />
                      <div className="tracking-step-label">
                        {STATUS_MAP[s]?.icon} {STATUS_MAP[s]?.label}
                      </div>
                      {isActive && result.updated_at && (
                        <div className="tracking-step-date">
                          {new Date(result.updated_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </div>
                      )}
                      {result.status === 'ditolak' && s === 'diproses' && (
                        <div className="tracking-step-date" style={{ color: 'var(--danger)' }}>
                          ⚠️ Laporan ditolak
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {result.status === 'selesai' && result.tanggapan && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--gray-50)', borderRadius: 'var(--radius)', fontSize: '0.8125rem' }}>
                  <strong>Tanggapan:</strong>
                  <p style={{ margin: '0.375rem 0 0', color: 'var(--gray-600)' }}>{result.tanggapan}</p>
                </div>
              )}
            </div>
          )}

          {!result && !error && (
            <div className="tracking-empty">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📌</div>
              <p>Masukkan ID laporan untuk melihat status terkini</p>
              <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                ID laporan didapatkan saat Anda mengirim laporan melalui tombol 💬
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
