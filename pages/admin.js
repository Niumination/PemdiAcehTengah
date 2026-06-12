import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';

const ADMIN_API_TOKEN = 'admin-token-pemdi-2026';

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
      <div style={{ maxWidth: 400, margin: '80px auto', padding: '2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔐 Admin — Pemdi Aceh Tengah</h1>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Masukkan password admin untuk mengakses dashboard.</p>
        <form onSubmit={handleLogin}>
          <input type="password" placeholder="Password admin" value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: 8, marginBottom: '0.75rem', fontSize: '1rem' }}
            autoFocus />
          {loginError && <p style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '0.5rem' }}>❌ {loginError}</p>}
          <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#1f6f43', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>Masuk</button>
        </form>
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
      <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#f3f4f6', minHeight: '100vh' }}>
        {/* Header */}
        <header style={{ background: '#1f6f43', color: 'white', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>📊 Admin — Pemdi Aceh Tengah</h1>
          <button onClick={() => { setLoggedIn(false); sessionStorage.removeItem('admin_token'); }}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.8125rem' }}>Keluar</button>
        </header>

        {/* Tab bar */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { key: 'ringkasan', label: `📈 Ringkasan`, badge: '' },
            { key: 'laporan', label: `📋 Laporan`, badge: laporanCount },
            { key: 'skm', label: `📝 SKM`, badge: skmCount },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ padding: '0.5rem 1rem', borderRadius: 8, border: tab === t.key ? '2px solid #1f6f43' : '1px solid #d1d5db', background: tab === t.key ? '#e8f5e9' : 'white', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              {t.label}
              {t.badge > 0 && <span style={{ background: '#1f6f43', color: 'white', borderRadius: 999, padding: '0.0625rem 0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>{t.badge}</span>}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 2rem' }}>
          {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.875rem' }}>❌ {error}
            <button onClick={() => setError(null)} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}>✕</button>
          </div>}

          {loading && <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>⏳ Memuat data...</div>}

          {!loading && tab === 'ringkasan' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Laporan</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1f6f43', marginTop: '0.25rem' }}>{laporanCount}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>Semua waktu</div>
                </div>
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total SKM</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1f6f43', marginTop: '0.25rem' }}>{skmCount}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>Responden survei</div>
                </div>
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>IKM (0-100)</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: ikm.ikm >= 80 ? '#1f6f43' : ikm.ikm >= 60 ? '#e65100' : '#dc2626', marginTop: '0.25rem' }}>{ikm.responden > 0 ? ikm.ikm : '—'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>{ikm.responden > 0 ? `Rataan ${ikm.rataan}/4 dari ${ikm.responden} responden` : 'Belum ada data'}</div>
                </div>
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kategori Laporan</div>
                  {['saran','keluhan','layanan','portal','pungli'].map(k => {
                    const count = laporan.filter(l => l.kategori === k).length;
                    return count > 0 ? <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.375rem', fontSize: '0.8125rem' }}>
                      <span style={{ color: '#374151' }}>{k}</span>
                      <span style={{ fontWeight: 600 }}>{count}</span>
                    </div> : null;
                  })}
                </div>
              </div>
            </div>
          )}

          {!loading && tab === 'laporan' && (
            <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>📋 Laporan Masuk ({laporanCount})</h2>
                <button onClick={fetchLaporan} style={{ background: '#f3f4f6', border: '1px solid #d1d5db', padding: '0.375rem 0.75rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.75rem' }}>🔄 Refresh</button>
              </div>
              {laporan.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>Belum ada laporan masuk.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                    <thead>
                      <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>ID</th>
                        <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Kategori</th>
                        <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Pesan</th>
                        <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Kontak</th>
                        <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Status</th>
                        <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Tanggal</th>
                        <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {laporan.map((l, i) => (
                        <tr key={l.id} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                          <td style={{ padding: '0.625rem 0.75rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>{l.id}</td>
                          <td style={{ padding: '0.625rem 0.75rem' }}><span style={{ background: '#e8f5e9', padding: '0.125rem 0.5rem', borderRadius: 4, fontSize: '0.75rem' }}>{l.kategori}</span></td>
                          <td style={{ padding: '0.625rem 0.75rem', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.pesan}>{l.pesan}</td>
                          <td style={{ padding: '0.625rem 0.75rem', color: '#6b7280' }}>{l.kontak || '—'}</td>
                          <td style={{ padding: '0.625rem 0.75rem' }}>
                            <select value={l.status || 'baru'} onChange={e => handleUpdateStatus(l.id, e.target.value)} disabled={updating === l.id}
                              style={{ padding: '0.25rem 0.5rem', borderRadius: 4, border: '1px solid #d1d5db', fontSize: '0.75rem', background: l.status === 'baru' ? '#fff3cd' : l.status === 'diproses' ? '#cce5ff' : l.status === 'selesai' ? '#d4edda' : 'white' }}>
                              <option value="baru">🟡 Baru</option>
                              <option value="diproses">🔵 Diproses</option>
                              <option value="selesai">🟢 Selesai</option>
                              <option value="ditolak">🔴 Ditolak</option>
                            </select>
                          </td>
                          <td style={{ padding: '0.625rem 0.75rem', fontSize: '0.75rem', color: '#6b7280' }}>{formatDate(l.dibuat)}</td>
                          <td style={{ padding: '0.625rem 0.75rem' }}>
                            <button onClick={() => handleUpdateStatus(l.id, l.status === 'baru' ? 'diproses' : l.status === 'diproses' ? 'selesai' : 'baru')} disabled={updating === l.id}
                              style={{ background: 'none', border: '1px solid #d1d5db', padding: '0.25rem 0.5rem', borderRadius: 4, cursor: 'pointer', fontSize: '0.75rem' }}>
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
            <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>📝 Hasil SKM ({skmCount} responden)</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#374151' }}>IKM: <strong style={{ color: '#1f6f43' }}>{ikm.ikm || '—'}</strong> (0-100)</span>
                  <button onClick={fetchSkm} style={{ background: '#f3f4f6', border: '1px solid #d1d5db', padding: '0.375rem 0.75rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.75rem' }}>🔄 Refresh</button>
                </div>
              </div>
              {skm.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>Belum ada data SKM.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                    <thead>
                      <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: 600 }}>#</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: 600 }}>Layanan</th>
                        <th style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 600 }}>Persyaratan</th>
                        <th style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 600 }}>Prosedur</th>
                        <th style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 600 }}>Waktu</th>
                        <th style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 600 }}>Biaya</th>
                        <th style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 600 }}>Produk</th>
                        <th style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 600 }}>Kompetensi</th>
                        <th style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 600 }}>Perilaku</th>
                        <th style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 600 }}>Sarana</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: 600 }}>Saran</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: 600 }}>Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {skm.map((s, i) => (
                        <tr key={s.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>{skmCount - i}</td>
                          <td style={{ padding: '0.5rem' }}>{s.layanan || '-'}</td>
                          {['persyaratan','prosedur','waktu','biaya','produk','kompetensi','perilaku','sarana'].map(u => (
                            <td key={u} style={{ padding: '0.5rem', textAlign: 'center' }}>
                              <span style={{ display: 'inline-block', width: 28, height: 28, lineHeight: '28px', borderRadius: '50%', background: s[u] >= 4 ? '#e8f5e9' : s[u] >= 3 ? '#fff3cd' : '#fef2f2', fontWeight: 600, fontSize: '0.75rem' }}>{s[u] || '-'}</span>
                            </td>
                          ))}
                          <td style={{ padding: '0.5rem', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.75rem', color: '#6b7280' }} title={s.saran}>{s.saran || '—'}</td>
                          <td style={{ padding: '0.5rem', fontSize: '0.75rem', color: '#6b7280', whiteSpace: 'nowrap' }}>{formatDate(s.dibuat)}</td>
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
