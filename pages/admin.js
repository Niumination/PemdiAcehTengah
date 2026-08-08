import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36);
}

function formatDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Fungsi IKM: hitung dari semua respons
function hitungIKM(responses) {
  if (!responses || responses.length === 0) return { responden: 0, rataan: 0, ikm: 0 };
  const unsurs = ['persyaratan','prosedur','waktu','biaya','produk','kompetensi','perilaku','sarana'];
  let totalSkor = 0, totalUnsur = 0;
  for (const r of responses) {
    for (const u of unsurs) {
      if (r[u] && r[u] >= 1 && r[u] <= 4) {
        totalSkor += Number(r[u]);
        totalUnsur++;
      }
    }
  }
  const rataan = totalUnsur > 0 ? totalSkor / totalUnsur : 0;
  const ikm = (rataan / 4) * 100;
  return { responden: responses.length, rataan: +rataan.toFixed(2), ikm: +ikm.toFixed(1) };
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState('ringkasan');
  const [laporan, setLaporan] = useState([]);
  const [skm, setSkm] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [laporanCount, setLaporanCount] = useState(0);
  const [skmCount, setSkmCount] = useState(0);
  const [updating, setUpdating] = useState(null);

  const token = typeof window !== 'undefined' ? sessionStorage.getItem('admin_token') : null;

  const fetchLaporan = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/laporan', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) { setLoggedIn(false); sessionStorage.removeItem('admin_token'); return; }
      const json = await res.json();
      if (json.data) { setLaporan(json.data); setLaporanCount(json.total); }
    } catch (e) { setError('Gagal memuat laporan: ' + e.message); }
  }, [token]);

  const fetchSkm = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/skm', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) { setLoggedIn(false); sessionStorage.removeItem('admin_token'); return; }
      const json = await res.json();
      if (json.data) { setSkm(json.data); setSkmCount(json.total); }
    } catch (e) { setError('Gagal memuat SKM: ' + e.message); }
  }, [token]);

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_token');
    if (saved) setLoggedIn(true);
    else setLoggedIn(false);
  }, []);

  useEffect(() => {
    if (loggedIn) {
      setLoading(true);
      Promise.all([fetchLaporan(), fetchSkm()]).finally(() => setLoading(false));
    }
  }, [loggedIn, fetchLaporan, fetchSkm]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/laporan', {
        headers: { 'Authorization': `Bearer ${password}` }
      });
      if (res.status === 401) { setLoginError('Token salah!'); return; }
      // Simpan password sebagai token Bearer
      sessionStorage.setItem('admin_token', password);
      setLoggedIn(true);
    } catch {
      setLoginError('Gagal terhubung ke server.');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdating(id);
    try {
      const res = await fetch('/api/lapor', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) fetchLaporan();
    } catch {}
    setUpdating(null);
  };

  if (!loggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--surface, #f5f7fa)',
      }}>
        <div className="card glow-card" style={{ maxWidth: 400, padding: '2rem', width: '100%' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>🔐 Admin — Pemdi Aceh Tengah</h1>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Masukkan password admin untuk mengakses dashboard.</p>
          <form onSubmit={handleLogin}>
            <input type="password" placeholder="Password admin" value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem', border: '1px solid var(--gray-300, #d1d5db)',
                borderRadius: 'var(--radius, 8px)', marginBottom: '0.75rem', fontSize: '1rem',
                fontFamily: 'var(--font-body)',
              }}
              autoFocus />
            {loginError && <p style={{ color: 'var(--bad)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>❌ {loginError}</p>}
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Masuk</button>
          </form>
        </div>
      </div>
    );
  }

  const ikm = hitungIKM(skm);

  return (
    <>
      <Head>
        <title>Admin Dashboard — Pemdi Aceh Tengah</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* HERO */}
      <section data-reveal style={{
        background: 'var(--hero-grad)',
        borderRadius: 'var(--r)',
        padding: '1.5rem 2rem',
        marginBottom: '1.5rem',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>📊 Admin — Pemdi Aceh Tengah</h1>
          </div>
          <button onClick={() => { setLoggedIn(false); sessionStorage.removeItem('admin_token'); }}
            className="btn btn-outline btn-sm"
            style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)' }}>
            Keluar
          </button>
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 2rem' }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {[
            { key: 'ringkasan', label: '📈 Ringkasan', badge: '' },
            { key: 'laporan', label: '📋 Laporan', badge: laporanCount },
            { key: 'skm', label: '📝 SKM', badge: skmCount },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`btn ${tab === t.key ? 'btn-primary' : 'btn-outline'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem' }}>
              {t.label}
              {t.badge > 0 && <span className="badge badge-blue">{t.badge}</span>}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {error && (
            <div className="card" style={{
              padding: '0.75rem', marginBottom: '1rem', fontSize: '0.875rem',
              background: 'var(--bad-bg)', border: '1px solid var(--bad-border)', color: 'var(--bad)',
            }}>
              ❌ {error}
              <button onClick={() => setError(null)} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--bad)' }}>✕</button>
            </div>
          )}

          {loading && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>⏳ Memuat data...</div>}

          {!loading && tab === 'ringkasan' && (
            <div>
              <div className="grid grid-4" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Laporan</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.25rem' }}>{laporanCount}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>Semua waktu</div>
                </div>
                <div className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total SKM</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.25rem' }}>{skmCount}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>Responden survei</div>
                </div>
                <div className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>IKM (0-100)</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: ikm.ikm >= 80 ? 'var(--ok)' : ikm.ikm >= 60 ? 'var(--warn)' : 'var(--bad)', marginTop: '0.25rem' }}>{ikm.responden > 0 ? ikm.ikm : '—'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{ikm.responden > 0 ? `Rataan ${ikm.rataan}/4 dari ${ikm.responden} responden` : 'Belum ada data'}</div>
                </div>
                <div className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kategori Laporan</div>
                  {['saran','keluhan','layanan','portal','pungli'].map(k => {
                    const count = laporan.filter(l => l.kategori === k).length;
                    return count > 0 ? <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.375rem', fontSize: '0.8125rem' }}>
                      <span style={{ color: 'var(--ink-secondary)' }}>{k}</span>
                      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{count}</span>
                    </div> : null;
                  })}
                </div>
              </div>
            </div>
          )}

          {!loading && tab === 'laporan' && (
            <div className="card glow-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, color: 'var(--ink)' }}>📋 Laporan Masuk ({laporanCount})</h2>
                <button onClick={fetchLaporan} className="btn btn-outline btn-sm">🔄 Refresh</button>
              </div>
              {laporan.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.875rem' }}>Belum ada laporan masuk.</div>
              ) : (
                <div className="tbl-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Kategori</th>
                        <th>Pesan</th>
                        <th>Kontak</th>
                        <th>Status</th>
                        <th>Tanggal</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {laporan.map((l, i) => (
                        <tr key={l.id}>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{l.id}</td>
                          <td><span className="badge badge-blue">{l.kategori}</span></td>
                          <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.pesan}>{l.pesan}</td>
                          <td style={{ color: 'var(--muted)' }}>{l.kontak || '—'}</td>
                          <td>
                            <select value={l.status || 'baru'} onChange={e => handleUpdateStatus(l.id, e.target.value)} disabled={updating === l.id}
                              style={{
                                padding: '0.25rem 0.5rem', borderRadius: 'var(--r-sm)', border: '1px solid var(--line)',
                                fontSize: '0.75rem', fontFamily: 'var(--font-body)',
                                background: l.status === 'baru' ? 'var(--warn-bg)' : l.status === 'diproses' ? 'var(--info-bg)' : l.status === 'selesai' ? 'var(--ok-bg)' : 'var(--surface)',
                              }}>
                              <option value="baru">🟡 Baru</option>
                              <option value="diproses">🔵 Diproses</option>
                              <option value="selesai">🟢 Selesai</option>
                              <option value="ditolak">🔴 Ditolak</option>
                            </select>
                          </td>
                          <td style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{formatDate(l.dibuat)}</td>
                          <td>
                            <button onClick={() => handleUpdateStatus(l.id, l.status === 'baru' ? 'diproses' : l.status === 'diproses' ? 'selesai' : 'baru')} disabled={updating === l.id}
                              className="btn btn-outline btn-sm"
                              style={{ fontSize: '0.75rem' }}>
                              {updating === l.id ? '⏳' : '⏭'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {!loading && tab === 'skm' && (
            <div className="card glow-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, color: 'var(--ink)' }}>📝 Hasil SKM ({skmCount} responden)</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--ink-secondary)' }}>IKM: <strong style={{ color: 'var(--primary)' }}>{ikm.ikm || '—'}</strong> (0-100)</span>
                  <button onClick={fetchSkm} className="btn btn-outline btn-sm">🔄 Refresh</button>
                </div>
              </div>
              {skm.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.875rem' }}>Belum ada data SKM.</div>
              ) : (
                <div className="tbl-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Layanan</th>
                        {['Persyaratan','Prosedur','Waktu','Biaya','Produk','Kompetensi','Perilaku','Sarana'].map(u => (
                          <th key={u} style={{ textAlign: 'center' }}>{u}</th>
                        ))}
                        <th>Saran</th>
                        <th>Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {skm.map((s, i) => (
                        <tr key={s.id}>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{skmCount - i}</td>
                          <td>{s.layanan || '-'}</td>
                          {['persyaratan','prosedur','waktu','biaya','produk','kompetensi','perilaku','sarana'].map(u => (
                            <td key={u} style={{ textAlign: 'center' }}>
                              <span style={{
                                display: 'inline-block', width: 28, height: 28, lineHeight: '28px', borderRadius: '50%',
                                background: s[u] >= 4 ? 'var(--ok-bg)' : s[u] >= 3 ? 'var(--warn-bg)' : 'var(--bad-bg)',
                                fontWeight: 600, fontSize: '0.75rem', color: s[u] >= 4 ? 'var(--ok)' : s[u] >= 3 ? 'var(--warn)' : 'var(--bad)',
                              }}>{s[u] || '-'}</span>
                            </td>
                          ))}
                          <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.75rem', color: 'var(--muted)' }} title={s.saran}>{s.saran || '—'}</td>
                          <td style={{ fontSize: '0.75rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{formatDate(s.dibuat)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
