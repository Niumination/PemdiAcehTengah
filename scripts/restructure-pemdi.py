#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Restrukturisasi pemdi.json: bukti_dukung = item GT per level, final evidence ditautkan."""
import json, re, os

BASE = '/Users/zaryu/Desktop/Niumination/apps/PemdiAcehTengah'
GT = json.load(open('/tmp/gt_struktur.json'))
EV = json.load(open('/tmp/final_evidence.json'))
d = json.load(open(os.path.join(BASE, 'data/pemdi.json')))

# URL sumber (JDIH/OpenData) dari analisis DeepScan
JDIH = {
    'Perbup 48': 'https://jdih.acehtengahkab.go.id/dih/detail/28818ade-468b-49d4-a133-ce77af0fd908',
    'Perbup 8': 'https://jdih.acehtengahkab.go.id/dih/detail/d6720ace-6bf0-426b-bb73-54b13f43a83b',
    'Perbup 126': 'https://jdih.acehtengahkab.go.id/dih/detail/e8187833-5111-4436-be42-68dfd5d80b76',
    'Perbup 73': 'https://jdih.acehtengahkab.go.id/dih/detail/2a0b0c2f-d693-4a15-9e7f-b42d7ab081eb',
    'Perbup 60': 'https://jdih.acehtengahkab.go.id/dih/detail/d9671249-08cc-4e6c-87f0-aa04f8ada75c',
    'Perbup 70': 'https://jdih.acehtengahkab.go.id/dih/detail/edee8e80-8f98-4038-b694-48706c86448a',
    'Perbup 9': 'https://jdih.acehtengahkab.go.id/dih/detail/af9a42bf-cea9-46c8-a739-9beb5d21e990',
    'Perbup 6': 'https://jdih.acehtengahkab.go.id/dih/detail/ade79cb3-cb2b-4b8e-bf31-b35ddeded969',
    'Perbup 137': 'https://jdih.acehtengahkab.go.id/dih/detail/6cd5c436-d64e-4068-bb08-2e0526d87cb5',
    'Perbup 30': 'https://jdih.acehtengahkab.go.id/dih/detail/407b38e8-5363-4b1a-bd3f-66c637164394',
    'Perbup 21': 'https://jdih.acehtengahkab.go.id/dih/detail/d0d9a4c9-089f-4e69-ad24-24b101057b62',
    'Literasi Digital': 'https://opendata.acehtengahkab.go.id/dataset/literasi-digital-sektor-pemerintahan-2023',
    'SOP EPSS': 'https://opendata.acehtengahkab.go.id/dataset/b07e4546-ff19-4041-b58b-6e456bb1f9c3',
    'RDTR': 'https://opendata.acehtengahkab.go.id/dataset/data-dan-peta-rdtr-yang-dikelola-di-aceh-tengah-tahun-2025',
    'SKM 2026': 'https://opendata.acehtengahkab.go.id/dataset/hasil-survei-kepuasan-masyarakat-di-kabupaten-aceh-tengah-bulan-januari-mei-tahun-2026',
    'Reviu Kinerja': 'https://opendata.acehtengahkab.go.id/dataset/laporan-hasil-reviu-laporan-kinerja-di-aceh-tengah-tahun-2025',
    'Pengawasan': 'https://opendata.acehtengahkab.go.id/dataset/laporan-hasil-pengawasan-kinerja-pemerintah-daerah-di-aceh-tengah-tahun-2025',
}

def clean_gt(text):
    """Bersihkan teks item GT: hapus leading *, **, dan semua citation [x], [x-y], [x, y]."""
    t = text.strip()
    t = re.sub(r'^[\*\s]+', '', t)
    # hapus citation di mana pun (tengah atau akhir), termasuk rentang dan koma
    t = re.sub(r'\s*\[\d+(?:[-,]\s*\d+)*(?:,\s*\d+)*\]', '', t)
    # rapikan spasi ganda & sebelum titik
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def norm(s):
    """Normalisasi untuk similarity."""
    s = s.lower()
    s = re.sub(r'[^a-z0-9\s]', ' ', s)
    return set(s.split())

def match_score(gt_item, ev_name):
    a = norm(clean_gt(gt_item))
    b = norm(ev_name)
    if not a or not b:
        return 0
    inter = len(a & b)
    return inter / max(len(a), len(b))

total_gt = 0
lengkap_count = 0
for a in d['aspek']:
    for ind in a.get('indikator', []):
        ik = ind['id']
        gt = GT.get(ik)
        if not gt:
            ind['bukti_dukung'] = []
            continue
        levels = gt['levels']
        new_bd = []
        # Untuk tiap level 1-5: tambahkan item GT
        for lv in range(1, 6):
            items = levels.get(str(lv), [])
            for idx, it in enumerate(items, 1):
                nama = clean_gt(it)
                bid = f"GT.{ik}_L{lv}_{idx}"
                item = {
                    'id': bid,
                    'level': lv,
                    'nama': nama,
                    'detail': 'Data Dukung Modul Indikator Pemdi',
                    'opd': ind.get('penanggung_jawab', {}).get('support', []) if isinstance(ind.get('penanggung_jawab'), dict) else [],
                    'status': 'belum',
                    'catatan': '',
                }
                total_gt += 1
                new_bd.append(item)
        # Tautkan evidence final: cari item GT paling cocok di level tsb
        for lv in range(1, 6):
            ev_key = f"{ik}_{lv}"
            ev = EV.get(ev_key)
            if not ev:
                continue
            lv_items = [b for b in new_bd if b['level'] == lv]
            if not lv_items:
                continue
            # pilih item dengan skor kemiripan tertinggi terhadap nama evidence
            best = max(lv_items, key=lambda b: match_score(b['nama'], ev['item']))
            best['status'] = 'lengkap'
            best['url_preview'] = ev['file']
            best['catatan'] = ev['catatan']
            # url_sumber: JDIH/OpenData dari sumber pertama yang dikenali
            src_urls = []
            for s in ev.get('sumber', []):
                for key, url in JDIH.items():
                    if key in s or key.lower() in s.lower():
                        src_urls.append(url)
                        break
            if src_urls:
                best['url_sumber'] = src_urls[0]
            lengkap_count += 1
        ind['bukti_dukung'] = new_bd
        ind['_l1_lengkap'] = any(b['level'] == 1 and b['status'] == 'lengkap' for b in new_bd)

d['total_item_bukti'] = total_gt
d['target_item_bukti'] = total_gt
d['total_item_manual'] = total_gt - lengkap_count
d['total_item_eksternal'] = 0

json.dump(d, open(os.path.join(BASE, 'data/pemdi.json'), 'w'), ensure_ascii=False, indent=1)
print(f"Total item GT: {total_gt} | Lengkap: {lengkap_count} | Belum: {total_gt - lengkap_count}")
