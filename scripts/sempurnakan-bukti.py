#!/usr/bin/env python3
"""Perbaikan & penyempurnaan sesi audit ulang 6 Agu 2026."""
import json, os, re, subprocess

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(BASE, 'public', 'bukti-dukung')
BL = os.path.join(DIR, 'belum-lengkap')
JSON_PATH = os.path.join(BASE, 'data', 'pemdi.json')
MAPPING_PATH = os.path.join(BASE, 'data', 'bukti-dokumen-mapping.json')

def gmv(src, dst):
    r = subprocess.run(['git', 'mv', src, dst], cwd=BASE, capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  ⚠️ git mv {os.path.basename(src)}: {r.stderr.strip()[:80]}")
    else:
        print(f"  ✓ {os.path.basename(src)} → {os.path.basename(dst)}")

# 1. File moves: indikator TAMPIL pakai file yang masih di belum-lengkap
print("=== 1. file moves ===")
gmv(os.path.join(BL, 'Data_I8_01_Perbup-6-Sistem-Pemdi_2025.pdf'), os.path.join(DIR, 'Data_I8_01_Perbup-6-Sistem-Pemdi_2025.pdf'))
gmv(os.path.join(BL, 'Kepuasan_I19_06_Hasil-Survei-Kepuasan_2026.xlsx'), os.path.join(DIR, 'Kepuasan_I19_06_Hasil-Survei-Kepuasan_2026.xlsx'))
# Rename screenshot I17 → nomor item benar (URL=04, Screenshot=05, Daftar=06)
gmv(os.path.join(DIR, 'Keterpaduan_I17_02_Screenshot-Portal_2026.png'), os.path.join(DIR, 'Keterpaduan_I17_05_Screenshot-Portal_2026.png'))
gmv(os.path.join(DIR, 'Keterpaduan_I17_03_Daftar-Layanan-Portal_2026.png'), os.path.join(DIR, 'Keterpaduan_I17_06_Daftar-Layanan-Portal_2026.png'))

# 2. Update pemdi.json
print("\n=== 2. pemdi.json ===")
txt = open(JSON_PATH).read()
# refs setelah move
txt = txt.replace('bukti-dukung/belum-lengkap/Data_I8_01_Perbup-6-Sistem-Pemdi_2025.pdf', 'bukti-dukung/Data_I8_01_Perbup-6-Sistem-Pemdi_2025.pdf')
txt = txt.replace('bukti-dukung/belum-lengkap/Kepuasan_I19_06_Hasil-Survei-Kepuasan_2026.xlsx', 'bukti-dukung/Kepuasan_I19_06_Hasil-Survei-Kepuasan_2026.xlsx')
txt = txt.replace('bukti-dukung/Keterpaduan_I17_02_Screenshot-Portal_2026.png', 'bukti-dukung/Keterpaduan_I17_05_Screenshot-Portal_2026.png')
txt = txt.replace('bukti-dukung/Keterpaduan_I17_03_Daftar-Layanan-Portal_2026.png', 'bukti-dukung/Keterpaduan_I17_06_Daftar-Layanan-Portal_2026.png')
p = json.loads(txt)

for a in p['aspek']:
    for ind in a['indikator']:
        if ind['id'] == 'I17':
            for b in ind['bukti_dukung']:
                # _dokumen_kunci [29] untuk bukti portal baru
                if b['id'] in ('P1.I17_1', 'P1.I17_2', 'P1.I17_3'):
                    b['_dokumen_kunci'] = [29]
                # B17.1 screenshot portal — file sudah ada (P1.I17_2 pakai file sama) → isi
                if b['id'] == 'B17.1':
                    b['status'] = 'lengkap'
                    b['_ext'] = 'png'
                    b['_peran'] = 'utama'
                    b['url_preview'] = '/bukti-dukung/Keterpaduan_I17_05_Screenshot-Portal_2026.png'
                    b['url_sumber'] = '/bukti-dukung/Keterpaduan_I17_05_Screenshot-Portal_2026.png'
                    b['detail'] = 'Tangkapan layar portal digital Pemkab Aceh Tengah (pemdi-aceh-tengah.vercel.app) — file sama dengan P1.I17_2'
                    b['catatan'] = 'Screenshot penuh antarmuka portal utama — bukti nyata keberadaan portal (file sama dengan P1.I17_2, multi-bukti wajar).'
                if b['id'] in ('P1.I17_1',):
                    b['catatan'] = "URL portal layanan digital daerah (acehtengahkab.go.id) — sesuai kriteria L1 I17 'Portal Layanan Digital Pemerintah pada Instansi Pemerintah'. Bukti URL: portal resmi Pemkab."
json.dump(p, open(JSON_PATH, 'w'), ensure_ascii=False, indent=1)
print("  ✓ _dokumen_kunci [29] utk P1.I17_1/2/3; B17.1 diisi lengkap")

# 3. Update mapping
print("\n=== 3. mapping ===")
mp = json.load(open(MAPPING_PATH))
for i in mp['indikator']:
    if i['indikator_id'] == 'I17':
        ada = {b['id'] for b in i['bukti']}
        for bid, nama in [('P1.I17_1', 'Portal Layanan Digital Pemerintah Kab. Aceh Tengah (acehtengahkab.go.id)'),
                          ('P1.I17_2', 'Screenshot Portal Layanan Digital Pemerintah Daerah'),
                          ('P1.I17_3', 'Daftar Layanan Digital Pemerintah pada Portal')]:
            if bid not in ada:
                i['bukti'].append({'id': bid, 'nama': nama, 'level': 1, 'status': 'lengkap',
                                   'dokumen_kunci': [29], 'sumber': 'baru'})
        break
# stats update
total = sum(len(i['bukti']) for i in mp['indikator'])
terpetakan = sum(1 for i in mp['indikator'] for b in i['bukti'] if b.get('dokumen_kunci'))
mp['stats'] = {'total_bukti': total, 'terpetakan': terpetakan, 'belum_terpetakan': total - terpetakan}
json.dump(mp, open(MAPPING_PATH, 'w'), ensure_ascii=False, indent=1)
print(f"  ✓ stats: {mp['stats']}")

# 4. verifikasi referensi ↔ file fisik
fisik = {f for f in os.listdir(DIR) if not f.startswith('.')} | {f'belum-lengkap/{f}' for f in os.listdir(BL) if not f.startswith('.')}
refs = set()
for a in p['aspek']:
    for ind in a['indikator']:
        for b in ind.get('bukti_dukung', []):
            for uf in ('url_preview', 'url_sumber'):
                m = re.search(r'bukti-dukung/([^/"?#]+)', b.get(uf, '') or '')
                if m: refs.add(m.group(1))
miss = [r for r in refs if r not in fisik]
print(f"\n=== verifikasi: {len(refs)} referensi | {len(fisik)} file | MISSING: {miss}")
print(f"=== belum-lengkap sekarang: {sorted(f for f in os.listdir(BL) if not f.startswith('.'))}")
