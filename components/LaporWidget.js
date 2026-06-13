import { useState, useEffect } from 'react';

export default function LaporWidget({ externalOpen, onExternalClose, hideFab }) {
  const [buka, setBuka] = useState(false);
  const [step, setStep] = useState('form'); // form | tracking | done
  const [laporan, setLaporan] = useState({ kategori: '', pesan: '', kontak: '' });
  const [trackId, setTrackId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tersimpan, setTersimpan] = useState(true);

  /* Sync external open control */
  useEffect(() => {
    if (externalOpen) {
      setBuka(true);
      setStep('form');
      setLaporan({ kategori: '', pesan: '', kontak: '' });
      setError(null);
    }
  }, [externalOpen]);

  const tutup = () => {
    setBuka(false);
    onExternalClose?.();
  };

  const handleKirim = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/lapor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kategori: laporan.kategori,
          pesan: laporan.pesan,
          kontak: laporan.kontak,
          halaman: typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      });
      const result = await res.json();
      if (result.success) {
        setTrackId(result.data.id);
        setTersimpan(!!result.tersimpan);
        setStep('done');
      } else {
        setError(result.error || 'Gagal mengirim');
      }
    } catch (err) {
      setError('Koneksi gagal. Coba lagi.');
    }
    setLoading(false);
  };

  return (
    <>
      {/* FAB — hanya muncul saat tidak dikontrol eksternal dan tidak disembunyikan */}
      {!externalOpen && !hideFab && (
        <button className="lapor-fab" onClick={() => { setBuka(true); setStep('form'); setLaporan({ kategori: '', pesan: '', kontak: '' }); }}>
          💬
        </button>
      )}

      {buka && (
        <div className="lapor-overlay" onClick={tutup}>
          <div className="lapor-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Lapor / Saran">
            <button className="lapor-close" onClick={tutup}>✕</button>
            <div className="lapor-header">
              <span className="lapor-icon">💬</span>
              <h3>Lapor / Saran</h3>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: '1rem' }}>
              Laporkan masalah, beri saran, atau sampaikan aspirasi Anda terkait layanan publik Aceh Tengah.
            </p>

            {/* Tab buttons */}
            <div className="lapor-tabs">
              <button
                className={`lapor-tab ${step === 'form' || step === 'done' ? 'active' : ''}`}
                onClick={() => setStep('form')}
              >✏️ Lapor Baru</button>
              <button
                className={`lapor-tab ${step === 'tracking' ? 'active' : ''}`}
                onClick={() => setStep('tracking')}
              >🔍 Lacak</button>
            </div>

            {step === 'form' && (
              <form onSubmit={handleKirim}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label className="lapor-label">Kategori</label>
                  <select
                    className="lapor-select"
                    value={laporan.kategori}
                    onChange={e => setLaporan({ ...laporan, kategori: e.target.value })}
                    required
                  >
                    <option value="">Pilih kategori...</option>
                    <option value="layanan">Masalah Layanan</option>
                    <option value="portal">Masalah Portal/Website</option>
                    <option value="saran">Saran/Masukan</option>
                    <option value="pungli">Indikasi Pungli</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label className="lapor-label">Deskripsi</label>
                  <textarea
                    className="lapor-textarea"
                    rows="3"
                    placeholder="Jelaskan masalah atau saran Anda..."
                    value={laporan.pesan}
                    onChange={e => setLaporan({ ...laporan, pesan: e.target.value })}
                    required
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="lapor-label">
                    Kontak <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(opsional — untuk follow-up)</span>
                  </label>
                  <input
                    type="text"
                    className="lapor-input"
                    placeholder="Email / No. HP"
                    value={laporan.kontak}
                    onChange={e => setLaporan({ ...laporan, kontak: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Mengirim...' : 'Kirim Laporan'}
                </button>
                {error && <div className="lapor-error">{error}</div>}
              </form>
            )}

            {step === 'tracking' && (
              <div style={{ padding: '1rem 0' }}>
                <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>
                  Masukkan ID laporan untuk cek status:
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    className="lapor-input"
                    style={{ flex: 1 }}
                    placeholder="Contoh: LAPOR-XXXXXX"
                  />
                  <button className="btn btn-outline btn-sm">Cek Status</button>
                </div>
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--gray-50)', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--muted)' }}>
                  🔧 Fitur tracking real-time sedang dalam pengembangan.
                  Saat ini laporan ditindaklanjuti manual oleh Tim Pemda Digital.
                </div>
              </div>
            )}

            {step === 'done' && (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Laporan Terkirim!</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                  ID Laporan Anda:
                </p>
                <div className="lapor-track-id">{trackId}</div>
                {!tersimpan && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--warning)', marginTop: '0.5rem' }}>
                    ⚠️ Laporan tercatat. Tim akan menindaklanjuti. Backend database akan diaktifkan segera.
                  </p>
                )}
                <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.75rem' }}>
                  Simpan ID ini untuk melacak status laporan.
                  Tim Pemda Digital akan menindaklanjuti dalam 3×24 jam.
                </p>
                <button className="btn btn-outline btn-sm" style={{ marginTop: '0.75rem' }} onClick={tutup}>
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .lapor-fab {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          box-shadow: var(--shadow-lg);
          z-index: 999;
          transition: transform 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lapor-fab:hover { transform: scale(1.1); }
        .lapor-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.4);
          z-index: 1000; display: flex; align-items: center; justify-content: center;
          padding: 1rem; backdrop-filter: blur(2px);
        }
        .lapor-modal {
          background: var(--white); border-radius: var(--radius-lg);
          padding: 1.5rem; max-width: 440px; width: 100%;
          position: relative; max-height: 90vh; overflow-y: auto;
          box-shadow: var(--shadow-xl);
        }
        .lapor-close {
          position: absolute; top: 0.75rem; right: 0.75rem;
          background: var(--gray-100); border: none; border-radius: 50%;
          width: 32px; height: 32px; cursor: pointer; font-size: 0.875rem;
          display: flex; align-items: center; justify-content: center;
          color: var(--gray-600);
        }
        .lapor-close:hover { background: var(--gray-200); }
        .lapor-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
        .lapor-icon { font-size: 1.25rem; }
        .lapor-header h3 { font-size: 1.125rem; margin: 0; }
        .lapor-tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
        .lapor-tab {
          padding: 0.5rem 1rem; border-radius: var(--radius); border: 1px solid var(--gray-200);
          background: var(--white); cursor: pointer; font-family: var(--font-body);
          font-size: 0.8125rem; font-weight: 500; transition: all 0.15s ease;
        }
        .lapor-tab.active { background: var(--primary-light); border-color: var(--primary); color: var(--primary); }
        .lapor-label { display: block; font-size: 0.8125rem; font-weight: 500; margin-bottom: 0.375rem; }
        .lapor-select, .lapor-input {
          width: 100%; padding: 0.625rem 0.75rem; border: 1px solid var(--gray-300);
          border-radius: var(--radius); font-family: var(--font-body); font-size: 0.875rem;
        }
        .lapor-textarea {
          width: 100%; padding: 0.625rem 0.75rem; border: 1px solid var(--gray-300);
          border-radius: var(--radius); font-family: var(--font-body); font-size: 0.875rem;
          resize: vertical; line-height: 1.5;
        }
        .lapor-select:focus, .lapor-input:focus, .lapor-textarea:focus {
          outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light);
        }
        .lapor-track-id {
          font-family: var(--font-mono); font-size: 0.875rem; font-weight: 700;
          color: var(--primary); background: var(--primary-light); padding: 0.5rem 1rem;
          border-radius: var(--radius); display: inline-block;
        }
        .lapor-error {
          margin-top: 0.75rem; padding: 0.5rem 0.75rem; background: #fff0f0;
          border: 1px solid #e0b3b3; border-radius: 6px; font-size: 0.8125rem;
          color: #b30000; text-align: center;
        }
      `}</style>
    </>
  );
}
