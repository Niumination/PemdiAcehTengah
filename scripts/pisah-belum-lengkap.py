#!/usr/bin/env python3
"""
Kelengkapan Level 1 → pisahkan bukti indikator yang L1 belum lengkap.

Aturan penilaian Pemdi: L1 tidak lengkap → L2 tidak dinilai. Indikator dengan
L1 belum lengkap: semua file buktinya dipindah ke public/bukti-dukung/belum-lengkap/,
referensi di data diupdate, dan indikator ditandai _l1_lengkap: false agar UI
menyembunyikan buktinya.

L1 lengkap = semua item level_kriteria[L1].bukti_dukung (modul-indikator.json)
terpenuhi oleh bukti status 'lengkap' di level 1 (pemdi.json).
Indikator eksternal (I5/I6/I7/I18, 0 item modul) = otomatis biarkan.
"""
import json, os, re, sys, subprocess

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(BASE, 'public', 'bukti-dukung')
BL = os.path.join(DIR, 'belum-lengkap')
JSON_PATH = os.path.join(BASE, 'data', 'pemdi.json')
MODUL_PATH = os.path.join(BASE, 'data', 'modul-indikator.json')

ASPEK_PREFIX = ('TataKelola', 'Penyelenggara', 'Data', 'KeamananSiber', 'Teknologi', 'Keterpaduan', 'Kepuasan')


def ind_of(fname):
    mm = re.match(r'^(?:' + '|'.join(ASPEK_PREFIX) + r')_I(\d+)_', fname)
    return f"I{int(mm.group(1))}" if mm else None


def main():
    only_plan = '--plan' in sys.argv

    # 1. hitung L1 lengkap per indikator
    m = json.load(open(MODUL_PATH))
    l1_items = {}
    for mod in m['modules']:
        for lk in mod.get('level_kriteria', []):
            if lk.get('level') == 1:
                l1_items[mod['indikator_id']] = len(lk.get('bukti_dukung', []) or [])

    p = json.load(open(JSON_PATH))
    l1_lengkap = {}
    for a in p['aspek']:
        for ind in a['indikator']:
            l1_lengkap[ind['id']] = sum(1 for b in ind.get('bukti_dukung', [])
                                        if b.get('level') == 1 and b.get('status') == 'lengkap')

    belum = {}
    for ind in sorted(set(l1_items) | set(l1_lengkap), key=lambda x: int(x.replace('I', ''))):
        items = l1_items.get(ind, 0)
        lkp = l1_lengkap.get(ind, 0)
        if items > 0 and lkp < items:
            belum[ind] = f"{lkp}/{items}"

    print(f"Indikator L1 belum lengkap ({len(belum)}): {belum}")

    # 2. file yang pindah (primary indikator belum lengkap)
    files = sorted(f for f in os.listdir(DIR) if not f.startswith('.'))
    move = [f for f in files if ind_of(f) in belum]
    print(f"File pindah ({len(move)}): {move}")

    if only_plan:
        return

    # 3. git mv ke belum-lengkap/
    os.makedirs(BL, exist_ok=True)
    for f in move:
        r = subprocess.run(['git', 'mv', os.path.join(DIR, f), os.path.join(BL, f)],
                           cwd=BASE, capture_output=True, text=True)
        if r.returncode != 0:
            print(f"  git mv GAGAL {f}: {r.stderr.strip()[:100]}")
            return
    print(f"✅ git mv {len(move)} file → belum-lengkap/")

    # 4. update referensi di pemdi.json
    txt = open(JSON_PATH).read()
    for f in move:
        txt = txt.replace(f'bukti-dukung/{f}', f'bukti-dukung/belum-lengkap/{f}')
    p = json.loads(txt)

    # 5. tandai indikator _l1_lengkap: false
    marked = 0
    for a in p['aspek']:
        for ind in a['indikator']:
            if ind['id'] in belum:
                ind['_l1_lengkap'] = False
                marked += 1
            else:
                ind['_l1_lengkap'] = True
    json.dump(p, open(JSON_PATH, 'w'), ensure_ascii=False, indent=1)
    print(f"✅ pemdi.json: {marked} indikator ditandai _l1_lengkap=false | referensi diupdate")

    # 6. verifikasi
    p2 = json.load(open(JSON_PATH))
    fisik = set(os.listdir(DIR)) | {os.path.join('belum-lengkap', f) for f in os.listdir(BL)}
    fisik_root = {f for f in os.listdir(DIR) if not f.startswith('.')}
    fisik_all = fisik_root | {f'belum-lengkap/{f}' for f in os.listdir(BL) if not f.startswith('.')}
    refs = set()
    for a in p2['aspek']:
        for ind in a['indikator']:
            for b in ind.get('bukti_dukung', []):
                for uf in ('url_preview', 'url_sumber'):
                    mm = re.search(r'bukti-dukung/([^/"?#]+)', b.get(uf, '') or '')
                    if mm:
                        refs.add(mm.group(1))
    miss = [r for r in refs if r not in fisik_all]
    print(f"Verifikasi: {len(refs)} referensi | file fisik {len(fisik_all)} | MISSING: {miss}")


if __name__ == '__main__':
    main()
