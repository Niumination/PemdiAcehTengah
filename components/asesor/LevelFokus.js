/**
 * LevelFokus — pembungkus "fokus level" untuk daftar bukti per level (21 Sep 2026).
 *
 * Aturan tampil (lib/pemdiNilai.js → fokusLevel):
 *   - Level DICAPAI (semua butir utama diterima asesor) → terbuka, badge hijau.
 *   - Level BERIKUT (levelDicapai + 1) → terbuka, badge biru "Target berikutnya".
 *   - Level lain → tertutup default; header tetap terlihat (ringkas: x/y diterima)
 *     dan bisa dibuka/ditutup dengan klik (state lokal per indikator, tanpa localStorage).
 *
 * Komponen ini TIDAK mengubah data — hanya mengatur visibilitas. Render isi level
 * diserahkan ke `children(level)` sehingga /pemdi (kartu) dan /modul-indikator
 * (tabel/kriteria) bisa memakai markup masing-masing.
 *
 * Props:
 *   ind        objek indikator pemdi.json (untuk fokusLevel)
 *   levels     array level yang dirender, default [1..5]
 *   ringkas    (level) => string singkat di header saat tertutup (mis. "2/4 diterima")
 *   warna      peta LEVEL_WARNA
 *   children   (level, { terbuka, peran }) => node isi level
 *   layout     'grid' | 'stack' — grid utk kartu /pemdi, stack utk tabel modul
 */
import { useState } from 'react';
import { LEVEL_LABEL, LEVEL_NAMA_RESMI, fokusLevel, peranLevel } from '@/lib/pemdiNilai';

const PERAN_STYLE = {
  dicapai: { color: 'var(--ok)', bg: 'var(--ok-bg)', icon: '✅' },
  berikut: { color: 'var(--primary)', bg: 'var(--primary-bg)', icon: '🎯' },
  lewat: { color: 'var(--muted)', bg: 'var(--surface-2)', icon: '↩' },
  nanti: { color: 'var(--muted)', bg: 'var(--surface-2)', icon: '⏭' },
};

export function RingkasFokus({ ind, compact = false }) {
  const f = fokusLevel(ind);
  if (f.eksternal) {
    return (
      <span className="fokus-ringkas" style={{ color: 'var(--warn)' }}>
        ⏳ Indikator eksternal — nilai ditetapkan instansi pembina; butir di bawah hanya konteks
      </span>
    );
  }
  return (
    <span className="fokus-ringkas">
      {f.levelDicapai >= 1
        ? <><strong style={{ color: 'var(--ok)' }}>✅ Level {f.levelDicapai} dicapai</strong>{!compact && <span className="muted"> ({LEVEL_LABEL[f.levelDicapai]})</span>}</>
        : <strong style={{ color: 'var(--bad)' }}>⬜ Belum ada level yang dicapai</strong>}
      {f.levelBerikut && (
        <> · <strong style={{ color: 'var(--primary)' }}>🎯 Target berikutnya: Level {f.levelBerikut}</strong>{!compact && <span className="muted"> ({LEVEL_LABEL[f.levelBerikut]})</span>}</>
      )}
      {!f.levelBerikut && <> · <strong style={{ color: 'var(--ok)' }}>Level maksimal tercapai</strong></>}
    </span>
  );
}

export default function LevelFokus({ ind, levels = [1, 2, 3, 4, 5], ringkas, warna = {}, children, layout = 'grid', idPrefix = 'lv' }) {
  const fokus = fokusLevel(ind);
  // `null` = ikuti default fokus; true/false = pilihan pengguna (klik)
  const [manual, setManual] = useState({});
  const isOpen = (lv) => (manual[lv] == null ? fokus.tampil.has(lv) : manual[lv]);
  const toggle = (lv) => setManual((m) => ({ ...m, [lv]: !isOpen(lv) }));
  const adaTersembunyi = levels.some((lv) => !isOpen(lv));
  const bukaSemua = () => setManual(Object.fromEntries(levels.map((lv) => [lv, true])));
  const kembaliFokus = () => setManual({});

  return (
    <div className={`lvfokus lvfokus-${layout}`}>
      <div className="lvfokus-bar">
        <RingkasFokus ind={ind} />
        <span className="lvfokus-act">
          {adaTersembunyi
            ? <button type="button" className="lvfokus-btn" onClick={bukaSemua}>Buka semua level</button>
            : <button type="button" className="lvfokus-btn" onClick={kembaliFokus}>Kembali ke fokus</button>}
        </span>
      </div>
      <div className={layout === 'grid' ? 'lvfokus-grid' : 'lvfokus-stack'}>
        {levels.map((lv) => {
          const open = isOpen(lv);
          const peran = peranLevel(lv, fokus);
          const ps = PERAN_STYLE[peran?.key] || PERAN_STYLE.nanti;
          const w = warna[lv] || 'var(--muted)';
          const panelId = `${idPrefix}-${ind?.id || 'x'}-${lv}`;
          return (
            <section key={lv} className={`lvfokus-item ${open ? 'open' : 'closed'} peran-${peran?.key || 'nanti'}`} aria-labelledby={`${panelId}-h`}>
              <h5 className="lvfokus-h" id={`${panelId}-h`} style={{ margin: 0 }}>
                <button
                  type="button"
                  className="lvfokus-head"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => toggle(lv)}
                  title={`${LEVEL_NAMA_RESMI[lv] || ''} — ${peran?.ket || ''}`}
                >
                  <span className="lvfokus-lv" style={{ color: w, background: `${w}18` }}>L{lv} · {LEVEL_LABEL[lv]}</span>
                  {peran && <span className="lvfokus-peran" style={{ color: ps.color, background: ps.bg }}>{ps.icon} {peran.label}</span>}
                  <span className="lvfokus-ringkas">{ringkas ? ringkas(lv) : ''}</span>
                  <span className="lvfokus-chev" aria-hidden="true">{open ? '▴' : '▾'}</span>
                </button>
              </h5>
              <div id={panelId} className="lvfokus-body" hidden={!open}>
                {open ? children(lv, { terbuka: open, peran }) : null}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
