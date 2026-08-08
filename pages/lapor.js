import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import TrackerStatus from '@/components/TrackerStatus';
import Sp4nBanner from '@/components/Sp4nBanner';

const KATEGORI = [
  { value: 'saran', label: '💡 Saran', desc: 'Ide atau usulan perbaikan' },
  { value: 'keluhan', label: '😟 Keluhan', desc: 'Ketidakpuasan terhadap layanan' },
  { value: 'pertanyaan', label: '❓ Pertanyaan', desc: 'Butuh informasi lebih lanjut' },
  { value: 'layanan', label: '🏛️ Layanan', desc: 'Terkait layanan publik' },
  { value: 'portal', label: '🌐 Portal', desc: 'Masalah teknis website' },
  { value: 'apresiasi', label: '👏 Apresiasi', desc: 'Pujian atau penghargaan' },
  { value: 'bug', label: '🐛 Bug', desc: 'Laporan error/kendala sistem' },
  { value: 'pungli', label: '🚫 Pungli', desc: 'Indikasi pungutan liar' },
  { value: 'lainnya', label: '📬 Lainnya', desc: 'Kategori lainnya' },
];

export default function LaporPage() {
  const [tab, setTab] = useState('kirim');

  return (
    <>
      <Head>
        <title>Lapor & Lacak — Pemdi Aceh Tengah</title>
        <meta name="description" content="Kirim laporan pengaduan dan lacak status tindak lanjut — Pemerintah Kabupaten Aceh Tengah. Indikator I19 Fasilitas Dukungan Pengguna PermenPANRB 8/2026." />
      </Head>

      <section data-reveal className="section-hero-skm">
        <div className="container">
          <Link href="/" className="back-link">← Beranda</Link>
          <div style={{ marginTop: '1rem' }}>
            <h1>Lapor & Lacak</h1>
            <p>Sampaikan laporan, saran, atau keluhan — dan pantau status tindak lanjutnya secara real-time.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <Sp4nBanner />

          {/* Tab nav */}
          <div className="lapor-tabs" role="tablist">
            <button
              role="tab"
              aria-selected={tab === 'kirim'}
              className={`lapor-tab ${tab === 'kirim' ? 'active' : ''}`}
              onClick={() => setTab('kirim')}
            >
              ✏️ Kirim Laporan
            </button>
            <button
              role="tab"
              aria-selected={tab === 'cek'}
              className={`lapor-tab ${tab === 'cek' ? 'active' : ''}`}
              onClick={() => setTab('cek')}
            >
              🔍 Cek Status
            </button>
          </div>

          {tab === 'kirim' && <FormLapor onSwitchToCek={() => setTab('cek')} />}
          {tab === 'cek' && <CekStatus />}

          <div className="lapor-footer-info">
            <p>
              <strong>Dasar Hukum:</strong> Peraturan Menteri PANRB No. 8 Tahun 2026 —
              Indikator I19 (Fasilitas Dukungan Pengguna, bobot 10%).
            </p>
            <p>
              Setiap laporan mendapatkan ID unik ({' '}
              <code style={{ background: 'var(--gray-100)', padding: '0.125rem 0.375rem', borderRadius: 4, fontSize: '0.75rem' }}>
                LAPOR-20260615-XXXXXX
              </code>{' '}
              ) yang bisa digunakan untuk memantau status tindak lanjut.
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .section-hero-skm {
          background: linear-gradient(135deg, #004098 0%, #002060 100%);
          color: white; padding: 2.5rem 0 2rem;
        }
        .section-hero-skm .back-link { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 0.875rem; }
        .section-hero-skm .back-link:hover { color: white; text-decoration: underline; }
        .section-hero-skm h1 { color: white; font-size: 2rem; margin-bottom: 0.5rem; }
        .section-hero-skm p { color: rgba(255,255,255,0.85) !important; font-size: 1rem; }

        .lapor-tabs {
          display: flex; gap: 0; margin-bottom: 1.5rem;
          background: var(--gray-100); border-radius: var(--radius) var(--radius) 0 0; overflow: hidden;
        }
        .lapor-tab {
          flex: 1; padding: 0.75rem 1rem; border: none; cursor: pointer;
          font-family: var(--font-body); font-size: 0.875rem; font-weight: 500;
          background: transparent; color: var(--gray-500); transition: all 0.15s;
        }
        .lapor-tab:hover { background: var(--gray-200); color: var(--gray-700); }
        .lapor-tab.active {
          background: var(--white); color: var(--primary); box-shadow: 0 -2px 0 var(--primary);
        }

        .lapor-footer-info {
          margin-top: 2rem; padding: 1.25rem;
          background: var(--gray-50); border-radius: var(--radius);
          font-size: 0.75rem; color: var(--gray-500); line-height: 1.8;
        }
        .lapor-footer-info p { margin: 0; }
        .lapor-footer-info p + p { margin-top: 0.5rem; }
      `}</style>
    </>
  );
}

function FormLapor({ onSwitchToCek }) {
  const [step, setStep] = useState('form'); // form | success
  const [kategori, setKategori] = useState('');
  const [pesan, setPesan] = useState('');
  const [kontak, setKontak] = useState('');
  const [halaman, setHalaman] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/lapor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kategori, pesan, kontak, halaman }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.data);
        setStep('success');
      } else {
        setError(json.error || 'Gagal mengirim laporan');
      }
    } catch (err) {
      setError('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  const isValid = kategori && pesan.trim().length >= 5;

  if (step === 'success' && result) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Laporan Terkirim!</h2>
        <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', maxWidth: '400px', margin: '0 auto 1rem' }}>
          Terima kasih. Laporan Anda telah tercatat dan akan segera ditindaklanjuti.
        </p>
        <div className="lapor-id-card">
          <div className="lapor-id-label">ID Pelacakan</div>
          <div className="lapor-id-value">{result.id}</div>
          <div className="lapor-id-hint">
            Simpan ID ini untuk mengecek status laporan Anda kapan saja.
          </div>
        </div>
        <div className="flex justify-center" style={{ gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => { setStep('form'); setKategori(''); setPesan(''); setKontak(''); setHalaman(''); }}>
            Kirim Lagi
          </button>
          <button className="btn btn-outline" onClick={onSwitchToCek}>
            🔍 Cek Status
          </button>
        </div>
        <style jsx>{`
          .lapor-id-card {
            background: var(--ok-bg); border: 1px solid var(--ok-border); border-radius: var(--radius);
            padding: 1rem 1.5rem; display: inline-block; text-align: center;
          }
          .lapor-id-label { font-size: 0.6875rem; color: var(--ok); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
          .lapor-id-value { font-size: 1.125rem; font-weight: 700; color: var(--ok); font-family: monospace; }
          .lapor-id-hint { font-size: 0.6875rem; color: var(--muted); margin-top: 0.375rem; }
        `}</style>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Kategori */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <label className="lapor-label">Kategori Laporan</label>
        <div className="lapor-kategori-grid">
          {KATEGORI.map(k => (
            <label key={k.value} className={`lapor-kategori-opt ${kategori === k.value ? 'selected' : ''}`}>
              <input type="radio" name="kategori" value={k.value}
                checked={kategori === k.value}
                onChange={() => setKategori(k.value)}
                style={{ display: 'none' }}
              />
              <span className="lapor-kat-icon">{k.value === k.label.split(' ')[0] ? k.label.split(' ')[0] : k.label.split(' ').slice(0, 1).join(' ')}</span>
              <div>
                <div className="lapor-kat-label">{k.label}</div>
                <div className="lapor-kat-desc">{k.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Pesan */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <label className="lapor-label">Isi Laporan <span className="lapor-req">*</span></label>
        <textarea
          className="lapor-textarea"
          rows="5"
          placeholder="Jelaskan laporan, saran, atau keluhan Anda secara detail..."
          value={pesan}
          onChange={e => setPesan(e.target.value)}
          maxLength={5000}
        />
        <div className="lapor-char-count">{pesan.length}/5000</div>
      </div>

      {/* Kontak + Halaman */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <div className="lapor-grid-2">
          <div>
            <label className="lapor-label">Kontak <span className="lapor-optional">(opsional)</span></label>
            <input className="lapor-input" type="text" placeholder="No. HP, email, atau akun medsos"
              value={kontak} onChange={e => setKontak(e.target.value)} maxLength={200} />
          </div>
          <div>
            <label className="lapor-label">Halaman Terkait <span className="lapor-optional">(opsional)</span></label>
            <input className="lapor-input" type="text" placeholder="URL halaman (jika ada)"
              value={halaman} onChange={e => setHalaman(e.target.value)} maxLength={200} />
          </div>
        </div>
      </div>

      {error && (
        <div className="lapor-error">❌ {error}</div>
      )}

      <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}
        disabled={!isValid || loading}>
        {loading ? 'Mengirim... ⏳' : 'Kirim Laporan ✉️'}
      </button>

      <style jsx>{`
        .lapor-label { display: block; font-size: 0.8125rem; font-weight: 600; color: var(--gray-700); margin-bottom: 0.625rem; }
        .lapor-req { color: var(--bad); }
        .lapor-optional { font-weight: 400; color: var(--gray-400); }

        .lapor-kategori-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
        .lapor-kategori-opt {
          display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem;
          border: 1px solid var(--gray-200); border-radius: var(--radius);
          cursor: pointer; transition: all 0.12s; font-size: 0.8125rem;
        }
        .lapor-kategori-opt:hover { border-color: var(--primary); background: var(--primary-light); }
        .lapor-kategori-opt.selected { border-color: var(--primary); background: var(--primary-50); }
        .lapor-kat-label { font-weight: 500; color: var(--gray-800); }
        .lapor-kat-desc { font-size: 0.6875rem; color: var(--gray-400); }

        .lapor-textarea {
          width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--gray-300);
          border-radius: var(--radius); font-family: var(--font-body); font-size: 0.875rem;
          resize: vertical; line-height: 1.6;
        }
        .lapor-textarea:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }
        .lapor-char-count { text-align: right; font-size: 0.6875rem; color: var(--gray-400); margin-top: 0.375rem; }

        .lapor-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .lapor-input {
          width: 100%; padding: 0.625rem 0.875rem; border: 1px solid var(--gray-300);
          border-radius: var(--radius); font-family: var(--font-body); font-size: 0.875rem;
        }
        .lapor-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }

        .lapor-error {
          padding: 0.75rem 1rem; background: var(--bad-bg); color: var(--bad);
          border-radius: var(--radius); font-size: 0.8125rem; margin-bottom: 1rem;
        }

        @media (max-width: 576px) {
          .lapor-kategori-grid { grid-template-columns: 1fr; }
          .lapor-grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </form>
  );
}

function CekStatus() {
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const handleCek = async (e) => {
    e.preventDefault();
    if (!id.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`/api/lapor/status?id=${encodeURIComponent(id.trim())}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else if (json.mockData) {
        setData(json.mockData);
      } else {
        setError(json.error || 'Laporan tidak ditemukan');
      }
    } catch {
      setError('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Form cari */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        <form onSubmit={handleCek}>
          <label className="cek-label">Masukkan ID Pelacakan</label>
          <p className="cek-hint">ID ada di email atau kartu konfirmasi setelah Anda mengirim laporan.</p>
          <div className="cek-input-group">
            <input
              className="cek-input"
              type="text"
              placeholder="LAPOR-20260615-XXXXXX"
              value={id}
              onChange={e => setId(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !id.trim()}>
              {loading ? '⏳' : '🔍 Cari'}
            </button>
          </div>
        </form>
      </div>

      {/* Hasil */}
      {error && (
        <div className="cek-error">
          <div className="cek-error-icon">😕</div>
          <div>
            <div className="cek-error-title">Laporan Tidak Ditemukan</div>
            <div className="cek-error-desc">{error}</div>
            <p className="cek-error-tip">Periksa kembali ID Anda. Format: <code>LAPOR-YYYYMMDD-XXXXXX</code></p>
          </div>
        </div>
      )}

      {data && (
        <TrackerStatus status={data.status} dibuat={data.dibuat} diperbarui={data.diperbarui} />
      )}

      <style jsx>{`
        .cek-label { display: block; font-size: 0.875rem; font-weight: 600; color: var(--gray-700); margin-bottom: 0.25rem; }
        .cek-hint { font-size: 0.75rem; color: var(--gray-400); margin: 0 0 0.75rem; }
        .cek-input-group { display: flex; gap: 0.5rem; }
        .cek-input {
          flex: 1; padding: 0.75rem 1rem; border: 2px solid var(--gray-300);
          border-radius: var(--radius); font-family: monospace; font-size: 0.9375rem;
          letter-spacing: 0.025em;
        }
        .cek-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }
        .cek-input::placeholder { font-family: var(--font-body); font-size: 0.8125rem; color: var(--gray-300); letter-spacing: 0; }

        .cek-error {
          display: flex; gap: 0.75rem; align-items: flex-start;
          padding: 1.25rem; background: var(--bad-bg); border: 1px solid var(--bad-border);
          border-radius: var(--radius); margin-bottom: 1.25rem;
        }
        .cek-error-icon { font-size: 1.5rem; }
        .cek-error-title { font-weight: 600; color: var(--bad); font-size: 0.875rem; }
        .cek-error-desc { font-size: 0.8125rem; color: var(--bad); margin-top: 0.125rem; }
        .cek-error-tip { font-size: 0.75rem; color: var(--bad); margin-top: 0.5rem; }
        .cek-error-tip code { background: var(--bad-border); padding: 0.125rem 0.375rem; border-radius: 4px; }
      `}</style>
    </div>
  );
}
