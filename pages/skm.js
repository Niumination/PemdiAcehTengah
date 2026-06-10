import Head from 'next/head';
import Link from 'next/link';
import skmData from '@/data/skm.json';
import { useState } from 'react';

const SKALA_WARNA = {
  5: '#00703c',
  4: '#28a197',
  3: '#e65100',
  2: '#d4351c',
  1: '#c62828',
};

export default function SKMPage() {
  const [step, setStep] = useState(1); // 1=info, 2=survey, 3=thanks
  const [unit, setUnit] = useState('');
  const [skor, setSkor] = useState({});
  const [saran, setSaran] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const semuaTerisi = skmData.dimensi.every(d => skor[d.id] !== undefined) && unit;

  return (
    <>
      <Head>
        <title>Survei Kepuasan Masyarakat — Pemdi Aceh Tengah</title>
        <meta name="description" content="Survei Kepuasan Masyarakat (SKM) online — Pemerintah Kabupaten Aceh Tengah. PermenPANRB 8/2026 Indikator I19 & I20." />
      </Head>

      <section className="section-hero-skm">
        <div className="container">
          <Link href="/" className="back-link">← Beranda</Link>
          <div style={{ marginTop: '1rem' }}>
            <h1>Survei Kepuasan Masyarakat</h1>
            <p>Bantu kami meningkatkan kualitas layanan digital — isi survei kepuasan Anda</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '720px', margin: '0 auto' }}>
          {step === 1 && (
            <div>
              <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>Tentang Survei Ini</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
                  Survei Kepuasan Masyarakat (SKM) ini bertujuan mengukur kualitas pelayanan publik
                  di lingkungan Pemerintah Kabupaten Aceh Tengah. Survei ini merupakan bagian dari
                  pemenuhan <strong>Indikator I19 (Fasilitas Dukungan Pengguna)</strong> dan{' '}
                  <strong>I20 (Pengelolaan Kepuasan Pengguna)</strong> — PermenPANRB 8/2026.
                </p>
                <div className="flex items-center gap-2" style={{ marginTop: '1rem', fontSize: '0.8125rem', color: 'var(--muted)' }}>
                  <span>📊 {skmData.dimensi.length} dimensi penilaian</span>
                  <span>• 5 skala (1–5)</span>
                  <span>• 2 menit</span>
                </div>
              </div>

              <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>Unit Pelayanan</h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: '1rem' }}>
                  Pilih unit pelayanan yang ingin Anda nilai:
                </p>
                <div className="grid grid-2" style={{ gap: '0.5rem' }}>
                  {skmData.unit_pelayanan.map(u => (
                    <label key={u} className={`unit-option ${unit === u ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="unit"
                        value={u}
                        checked={unit === u}
                        onChange={() => setUnit(u)}
                        style={{ display: 'none' }}
                      />
                      <span>{u}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                onClick={() => setStep(2)}
                disabled={!unit}
              >
                Mulai Survei →
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                <div className="flex items-center justify-between mb-2">
                  <h2 style={{ fontSize: '1.125rem' }}>Penilaian</h2>
                  <span className="badge badge-blue">{unit}</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: '1rem' }}>
                  Beri nilai 1–5 untuk setiap dimensi berikut:
                </p>

                <div className="skala-row">
                  {skmData.skala.map(s => (
                    <div key={s.nilai} className="skala-label" style={{ color: SKALA_WARNA[s.nilai] }}>
                      <strong>{s.nilai}</strong> {s.label}
                    </div>
                  ))}
                </div>

                {skmData.dimensi.map(d => (
                  <div key={d.id} className="dimensi-row">
                    <div className="dimensi-header">
                      <span className="dimensi-id">{d.id}</span>
                      <div>
                        <div className="dimensi-nama">{d.nama}</div>
                        <div className="dimensi-desc">{d.deskripsi}</div>
                      </div>
                    </div>
                    <div className="dimensi-skor">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          className={`skor-btn ${skor[d.id] === n ? 'selected' : ''}`}
                          style={skor[d.id] === n ? { background: SKALA_WARNA[n], borderColor: SKALA_WARNA[n], color: 'white' } : {}}
                          onClick={() => setSkor({ ...skor, [d.id]: n })}
                        >{n}</button>
                      ))}
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: '1.5rem' }}>
                  <label style={{ fontWeight: 500, fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
                    Saran / Masukan <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(opsional)</span>
                  </label>
                  <textarea
                    className="skm-textarea"
                    rows="3"
                    placeholder="Tulis saran, kritik, atau masukan Anda..."
                    value={saran}
                    onChange={e => setSaran(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={!semuaTerisi}
              >
                {semuaTerisi ? 'Kirim Survei ✅' : `Isi semua dimensi dulu (${Object.keys(skor).length}/${skmData.dimensi.length})`}
              </button>
              <div className="flex justify-center" style={{ marginTop: '0.75rem' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setStep(1)}>← Kembali</button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Terima Kasih!</h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                Survei Anda telah tercatat. Partisipasi Anda membantu kami meningkatkan kualitas layanan
                publik di Kabupaten Aceh Tengah.
              </p>
              <div className="flex justify-center" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/" className="btn btn-primary">← Kembali ke Beranda</Link>
                <Link href="/layanan" className="btn btn-outline">Lihat Layanan Publik</Link>
              </div>
              <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--muted)' }}>
                Data Anda bersifat anonim. Tidak ada identitas pribadi yang dikumpulkan.
              </div>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .section-hero-skm {
          background: linear-gradient(135deg, #004098 0%, #002060 100%);
          color: white;
          padding: 2.5rem 0 2rem;
        }
        .section-hero-skm .back-link { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 0.875rem; }
        .section-hero-skm .back-link:hover { color: white; text-decoration: underline; }
        .section-hero-skm h1 { color: white; font-size: 2rem; margin-bottom: 0.5rem; }
        .section-hero-skm p { color: rgba(255,255,255,0.85) !important; font-size: 1rem; }

        .unit-option {
          display: flex; align-items: center; padding: 0.625rem 1rem;
          border: 1px solid var(--gray-200); border-radius: var(--radius);
          cursor: pointer; transition: all 0.15s ease; font-size: 0.8125rem;
        }
        .unit-option:hover { border-color: var(--primary); background: var(--primary-light); }
        .unit-option.selected { border-color: var(--primary); background: var(--primary-light); font-weight: 600; }
        .skala-row { display: flex; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
        .skala-label { font-size: 0.6875rem; background: var(--gray-50); padding: 0.25rem 0.625rem; border-radius: 100px; }

        .dimensi-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.875rem 0; border-bottom: 1px solid var(--gray-100); gap: 1rem;
        }
        .dimensi-row:last-child { border-bottom: none; }
        .dimensi-header { display: flex; align-items: flex-start; gap: 0.625rem; flex: 1; }
        .dimensi-id {
          width: 28px; height: 28px; border-radius: 6px; background: var(--primary-light);
          color: var(--primary); display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.6875rem; flex-shrink: 0;
        }
        .dimensi-nama { font-size: 0.875rem; font-weight: 500; }
        .dimensi-desc { font-size: 0.75rem; color: var(--muted); }
        .dimensi-skor { display: flex; gap: 0.25rem; flex-shrink: 0; }
        .skor-btn {
          width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--gray-300);
          background: var(--white); cursor: pointer; font-weight: 700; font-size: 0.8125rem;
          font-family: var(--font-body); color: var(--gray-600); transition: all 0.12s ease;
        }
        .skor-btn:hover { border-color: var(--primary); background: var(--primary-light); }
        .skor-btn.selected { border-color: var(--primary); }
        .skm-textarea {
          width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--gray-300);
          border-radius: var(--radius); font-family: var(--font-body); font-size: 0.875rem;
          resize: vertical; line-height: 1.5;
        }
        .skm-textarea:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }
        @media (max-width: 576px) {
          .dimensi-row { flex-direction: column; align-items: stretch; gap: 0.5rem; }
          .dimensi-skor { justify-content: flex-end; }
        }
      `}</style>
    </>
  );
}
