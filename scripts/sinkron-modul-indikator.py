#!/usr/bin/env python3
"""
scripts/sinkron-modul-indikator.py — Sinkronkan data/modul-indikator.json dengan
sumber kebenaran (21 Sep 2026, audit konsistensi konten Pemdi).

Yang disinkronkan (idempoten, tidak menyentuh kriteria/bukti_dukung/data_dukung items):
  1. `data_dukung_modul[].label`  → nama level resmi PermenPANRB 8/2026
     (Initiate/Emerging/Developing/Embedded/Leading) — sebelumnya memakai
     Established/Leading/Transformative (label lama, tidak ada di Permen).
  2. `rekomendasi[]`              → dihitung ulang dari data/pemdi.json dengan
     rumus level kontinu (sebelumnya statis dari data lama: "nilai 2.0", status
     "Proses" yang sudah tidak ada).
  3. `deskripsi`                  → teks utuh "Deskripsi Indikator" dari
     docs/permenpanrb 8 2026.pdf (sebelumnya terpotong 1 baris). Bahasa baku
     Permen dipertahankan apa adanya; pembersihan hanya spasi/pemenggalan baris.

Jalankan SETELAH hitung-capaian-pemdi.py. Butuh `pypdf` hanya bila deskripsi
perlu diekstrak ulang (cache: data/.cache-deskripsi-permen.json tidak dibuat —
hasil langsung ditulis ke modul-indikator.json).
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODUL = os.path.join(ROOT, 'data', 'modul-indikator.json')
PEMDI = os.path.join(ROOT, 'data', 'pemdi.json')
PDF = os.path.join(ROOT, 'docs', 'permenpanrb 8 2026.pdf')

LEVEL_LABEL = {1: 'Initiate', 2: 'Emerging', 3: 'Developing', 4: 'Embedded', 5: 'Leading'}
EKSTERNAL = {'I5', 'I6', 'I7', 'I18'}


def nilai_indikator(ind):
    bd = ind.get('bukti_dukung') or []
    lv = 0
    for l in range(1, 6):
        items = [b for b in bd if b['level'] == l and b.get('_peran') != 'pendukung']
        if items and all(b['status'] == 'diterima' for b in items):
            lv = l
        else:
            break
    return lv


def rekomendasi(ind, modul):
    r = []
    iid = ind['id']
    if iid in EKSTERNAL or ind.get('eksternal', {}).get('aktif'):
        e = ind.get('eksternal') or {}
        r.append(f"Indikator eksternal — nilai ditarik dari {e.get('sistem', 'instansi pembina')} ({e.get('pembina', '-')}); koordinasikan skor resmi, bukan bukti lokal.")
        return r
    n = nilai_indikator(ind)
    t = ind.get('target') or 0
    bd = ind.get('bukti_dukung') or []
    if n < 5:
        nx = n + 1
        kurang = [b for b in bd if b['level'] == nx and b.get('_peran') != 'pendukung' and b['status'] != 'diterima']
        arah = 'di bawah' if n < t else 'sudah mencapai'
        r.append(f"Level dicapai {n} ({arah} target {t:g}) — kejar Level {nx} ({LEVEL_LABEL[nx]}): {len(kurang)} butir belum diterima asesor.")
    rev = [b for b in bd if b['status'] == 'revisi']
    if rev:
        r.append(f"PRIORITAS — {len(rev)} bukti hasil asesor REVISI ({', '.join(b.get('eval', {}).get('kode') or b['id'] for b in rev)}): perbaiki sesuai catatan, unggah ulang di eval.spbe.go.id.")
    draf = sum(1 for b in bd if b['status'] == 'draf')
    if draf:
        r.append(f"{draf} bukti masih draf lokal — finalisasi (paraf/stempel/ttd) lalu unggah pada tahap berikutnya.")
    belum = sum(1 for b in bd if b['status'] == 'belum')
    if belum:
        r.append(f"{belum} butir belum ada dokumen — lihat contoh di Modul & draf di /requirement.")
    return r


def deskripsi_permen():
    try:
        from pypdf import PdfReader
    except ImportError:
        print('⚠️  pypdf tidak ada — deskripsi tidak diperbarui (pip install pypdf)')
        return {}
    if not os.path.exists(PDF):
        print('⚠️  PDF Permen tidak ditemukan — deskripsi tidak diperbarui')
        return {}
    txt = '\n'.join((p.extract_text() or '') for p in PdfReader(PDF).pages)
    parts = re.split(r'Indikator (\d+)\. ', txt)
    out = {}
    for i in range(1, len(parts) - 1, 2):
        n = int(parts[i]); body = parts[i + 1]
        m = re.search(r'Deskripsi Indikator:\s*(.*?)(?:Instansi Pembina|Peran Fungsi|Kurang\s*\(Merintis)', body, re.S)
        if not m or n in out:
            continue
        d = m.group(1)
        d = re.sub(r'- \d+ -\s*jdih\.menpan\.go\.id', '', d)              # nomor halaman
        # header tabel yang terulang saat deskripsi menyeberang halaman:
        # "Aspek Indikator Bobot Kuesioner 7 19 10% <Nama Indikator (kata berawalan kapital)>"
        d = re.sub(r'\s*Aspek Indikator Bobot Kuesioner\s*\d+\s+\d+\s+\d+%\s*(?:[A-Z][A-Za-z()/-]*\s*)+?(?=\s(?:[a-z]|\d+\.))', ' ', d)
        d = re.sub(r'\s+', ' ', d).strip()
        # Koreksi manual: kata terakhir sebelum pindah halaman ikut termakan pola header
        d = d.replace('bagi Instansi bersama dan tidak terbatas', 'bagi Instansi Pemerintah bersama dan tidak terbatas')
        d = d.replace('prinsip -prinsip', 'prinsip-prinsip').replace('( Cloud', '(Cloud').replace('( Service', '(Service')
        # I8: sub-judul yang menempel pada butir sebelumnya → pisahkan dengan tanda titik
        d = re.sub(r'(sertifikasi) (Kebijakan:)', r'\1. \2', d)
        d = re.sub(r'(Pemberitahuan PDP) (Penerapan teknis)', r'\1. \2', d)
        out[f'I{n}'] = d
    return out


def main():
    modul = json.load(open(MODUL, encoding='utf-8'))
    pemdi = json.load(open(PEMDI, encoding='utf-8'))
    ind = {i['id']: i for a in pemdi['aspek'] for i in a['indikator']}
    desk = deskripsi_permen()
    st = {'label': 0, 'reko': 0, 'desk': 0, 'teks': 0}
    # istilah level lama (NotebookLM) di dalam teks item/output → nama resmi Permen
    GANTI = [('level Established', 'level 3 (Developing)'), ('level Transformative', 'level 5 (Leading)'),
             ('(Established)', '(Developing)'), ('(Transformative)', '(Leading)')]
    def ganti(t, lv=None):
        for a, b in GANTI:
            t = t.replace(a, b)
        # "level Leading" ambigu (skema lama L4, Permen L5) → ikuti level baris tempatnya
        if lv in (4, 5):
            t = t.replace('level Leading', f'level {lv} ({LEVEL_LABEL[lv]})')
        return t
    for m in modul['modules']:
        iid = m['indikator_id']
        for lk in m.get('level_kriteria') or []:
            for b in lk.get('bukti_dukung') or []:
                for f in ('item', 'output'):
                    if b.get(f) and ganti(b[f], lk.get('level')) != b[f]:
                        b[f] = ganti(b[f], lk.get('level')); st['teks'] += 1
        for d in m.get('data_dukung_modul') or []:
            d['items'] = [ganti(x, d.get('level')) for x in d.get('items') or []]
        for d in m.get('data_dukung_modul') or []:
            lbl = LEVEL_LABEL.get(d.get('level'))
            if lbl and d.get('label') != lbl:
                d['label'] = lbl; st['label'] += 1
        if iid in ind:
            m['rekomendasi'] = rekomendasi(ind[iid], m); st['reko'] += 1
        if iid in desk and desk[iid] and m.get('deskripsi') != desk[iid]:
            m['deskripsi'] = desk[iid]; st['desk'] += 1
    modul['sinkron'] = {'tanggal': pemdi.get('perhitungan', {}).get('diperbarui'), 'sumber': 'scripts/sinkron-modul-indikator.py — pemdi.json + PermenPANRB 8/2026'}
    json.dump(modul, open(MODUL, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('✅ modul-indikator.json disinkronkan:', st)


if __name__ == '__main__':
    main()
