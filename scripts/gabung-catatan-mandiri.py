#!/usr/bin/env python3
"""
gabung-catatan-mandiri.py — gabungkan data/catatan-mandiri.json ke data/pemdi.json
(field `catatan_mandiri` pada setiap butir bukti_dukung yang punya catatan).

Langkah TERAKHIR rantai regenerasi (lihat data/AGENTS.md):
  apply-eval-tahap1 → hitung-capaian → build-draf-prioritas → build-kebutuhan-bukti
  → sinkron-modul-indikator → gabung-catatan-mandiri

Idempoten: field `catatan_mandiri` selalu ditulis ulang dari sumber; butir yang
tidak ada di catatan-mandiri.json kehilangan field tersebut (bila pernah ada).
Tidak mengubah status/catatan asesor/nilai apa pun.

Validasi (exit 1 bila gagal):
  - setiap id butir di catatan-mandiri.json ada di pemdi.json
  - setiap kode `dok` di rujukan terdaftar di blok `dokumen`
  - butir berstatus `diterima` TIDAK boleh punya catatan mandiri (di luar cakupan)
  - path lokal dokumen (`path`) harus ada di public/
Opsi: --cek  → hanya validasi + laporan cakupan, tidak menulis.
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PEMDI = os.path.join(ROOT, 'data', 'pemdi.json')
CATATAN = os.path.join(ROOT, 'data', 'catatan-mandiri.json')
PUBLIC = os.path.join(ROOT, 'public')


def main():
    cek = '--cek' in sys.argv
    pemdi = json.load(open(PEMDI, encoding='utf-8'))
    cm = json.load(open(CATATAN, encoding='utf-8'))
    dokumen = cm['dokumen']
    butir = cm['butir']
    err = []

    for kode, d in dokumen.items():
        p = d.get('path')
        if p and not os.path.exists(os.path.join(PUBLIC, p.lstrip('/'))):
            err.append(f'dokumen {kode}: berkas tidak ada: {p}')

    index = {}
    for a in pemdi['aspek']:
        for ind in a['indikator']:
            for b in ind.get('bukti_dukung') or []:
                index[b['id']] = (ind, b)

    for bid, c in butir.items():
        if bid not in index:
            err.append(f'butir {bid} tidak ada di pemdi.json')
            continue
        ind, b = index[bid]
        if b.get('status') == 'diterima':
            err.append(f'butir {bid} berstatus diterima — di luar cakupan catatan mandiri')
        for r in c.get('rujukan') or []:
            if r.get('dok') not in dokumen:
                err.append(f'butir {bid}: kode dokumen tidak dikenal: {r.get("dok")}')
        for k in ('ringkas', 'jenis', 'pj', 'prioritas'):
            if not c.get(k):
                err.append(f'butir {bid}: field {k} kosong')
        if c.get('jenis') == 'revisi' and b.get('status') != 'revisi':
            err.append(f'butir {bid}: jenis=revisi tapi status pemdi={b.get("status")}')

    if err:
        print('GAGAL validasi catatan mandiri:')
        for e in err:
            print(' -', e)
        return 1

    # Tulis field catatan_mandiri (rujukan diresolusikan agar UI tidak perlu berkas kedua)
    n_set = 0
    n_hapus = 0
    per_ind = {}
    for a in pemdi['aspek']:
        for ind in a['indikator']:
            for b in ind.get('bukti_dukung') or []:
                c = butir.get(b['id'])
                if not c:
                    if 'catatan_mandiri' in b:
                        del b['catatan_mandiri']
                        n_hapus += 1
                    continue
                ruj = []
                for r in c.get('rujukan') or []:
                    d = dokumen[r['dok']]
                    ruj.append({
                        'kode': r['dok'],
                        'judul': d['judul'],
                        'bagian': r.get('bagian', ''),
                        'halaman': r.get('halaman', '—'),
                        'path': d.get('path'),
                        'url': d.get('url'),
                        'teks': d.get('teks'),
                        'status_dok': d.get('status', ''),
                    })
                b['catatan_mandiri'] = {
                    'jenis': c['jenis'],
                    'ringkas': c['ringkas'],
                    'rujukan': ruj,
                    'kebutuhan': c.get('kebutuhan') or [],
                    'pj': c.get('pj', ''),
                    'prioritas': c.get('prioritas', 'sedang'),
                    'versi': cm.get('versi'),
                }
                n_set += 1
                per_ind.setdefault(ind['id'], []).append(b['id'])

    pemdi['catatan_mandiri_meta'] = {
        'versi': cm.get('versi'),
        'tenggat': cm.get('tenggat'),
        'jumlah_butir': n_set,
        'revisi': sum(1 for c in butir.values() if c['jenis'] == 'revisi'),
        'gap': sum(1 for c in butir.values() if c['jenis'] == 'gap'),
        'indikator': sorted(per_ind, key=lambda s: int(s[1:])),
        'materi_asesor_eksternal': cm.get('materi_asesor_eksternal'),
        'sumber': 'data/catatan-mandiri.json',
    }

    print(f'catatan mandiri: {n_set} butir ditulis ({pemdi["catatan_mandiri_meta"]["revisi"]} revisi · '
          f'{pemdi["catatan_mandiri_meta"]["gap"]} gap level berikut), {n_hapus} dihapus, '
          f'{len(per_ind)} indikator')
    if cek:
        print('mode --cek: pemdi.json tidak ditulis')
        return 0
    json.dump(pemdi, open(PEMDI, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    return 0


if __name__ == '__main__':
    sys.exit(main())
