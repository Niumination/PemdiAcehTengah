import { useState } from 'react';

export default function ServiceFinder({ kategori, onFilter }) {
  const [cari, setCari] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [onlineFilter, setOnlineFilter] = useState('');

  const applyFilters = (updates = {}) => {
    const filters = {
      cari: updates.cari ?? cari,
      kategori: updates.kategori ?? kategoriFilter,
      status: updates.status ?? statusFilter,
      online: updates.online ?? onlineFilter,
    };
    onFilter?.(filters);
  };

  const handleSearch = (val) => {
    setCari(val);
    applyFilters({ cari: val });
  };

  const handleKategori = (val) => {
    setKategoriFilter(val);
    applyFilters({ kategori: val });
  };

  const handleStatus = (val) => {
    setStatusFilter(val);
    applyFilters({ status: val });
  };

  const handleOnline = (val) => {
    setOnlineFilter(val);
    applyFilters({ online: val });
  };

  const resetFilters = () => {
    setCari('');
    setKategoriFilter('');
    setStatusFilter('');
    setOnlineFilter('');
    onFilter?.({
      cari: '',
      kategori: '',
      status: '',
      online: '',
    });
  };

  const hasFilters = cari || kategoriFilter || statusFilter || onlineFilter;

  return (
    <div className="service-finder-section">
      <div className="finder-search-wrap">
        <span className="finder-search-icon">🔍</span>
        <input
          type="text"
          className="finder-search-input"
          placeholder="Cari layanan, kategori, atau OPD..."
          value={cari}
          onChange={(e) => handleSearch(e.target.value)}
          aria-label="Cari layanan publik"
        />
      </div>
      <div className="finder-filters">
        <div className="finder-filter-group">
          <label className="finder-filter-label">Kategori</label>
          <select
            className="finder-filter-select"
            value={kategoriFilter}
            onChange={(e) => handleKategori(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {kategori.map((k) => (
              <option key={k.id} value={k.id}>{k.ikon} {k.nama}</option>
            ))}
          </select>
        </div>
        <div className="finder-filter-group">
          <label className="finder-filter-label">Status</label>
          <select
            className="finder-filter-select"
            value={statusFilter}
            onChange={(e) => handleStatus(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
            <option value="Terbatas">Terbatas</option>
          </select>
        </div>
        <div className="finder-filter-group">
          <label className="finder-filter-label">Akses</label>
          <select
            className="finder-filter-select"
            value={onlineFilter}
            onChange={(e) => handleOnline(e.target.value)}
          >
            <option value="">Semua Akses</option>
            <option value="online">Online</option>
            <option value="offline">Offline (Datang Langsung)</option>
          </select>
        </div>
        {hasFilters && (
          <button className="finder-reset" onClick={resetFilters}>
            ↻ Reset Filter
          </button>
        )}
      </div>
    </div>
  );
}
