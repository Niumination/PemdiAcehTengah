#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fase A: Update nilai indikator & aspek = kondisi aktual bukti (level tertinggi semua-lengkap)."""
import json

d = json.load(open('data/pemdi.json'))

def nilai_indikator(ind):
    bd = ind.get('bukti_dukung', [])
    if not bd:
        return 0
    max_level = max(b['level'] for b in bd)
    for lv in range(1, max_level + 1):
        items = [b for b in bd if b['level'] == lv]
        if not items:
            continue
        if not all(b['status'] == 'lengkap' for b in items):
            return lv - 1
    return max_level

for a in d['aspek']:
    for ind in a['indikator']:
        nv = nilai_indikator(ind)
        ind['nilai'] = nv
        ind['nilai_aktual'] = nv
        ind['sumber'] = f"Bukti dukung terverifikasi ({sum(1 for b in ind.get('bukti_dukung',[]) if b['status']=='lengkap')}/{len(ind.get('bukti_dukung',[]))} item)"
    # nilai aspek = rata-rata tertimbang indikator
    inds = a['indikator']
    bobot_ind = sum(i.get('bobot', 1) for i in inds)
    nilai_a = sum(i['nilai'] * i.get('bobot', 1) for i in inds) / bobot_ind if bobot_ind else 0
    a['nilai'] = round(nilai_a, 2)
    a['nilai_aktual'] = round(nilai_a, 2)

total_bobot = sum(a['bobot'] for a in d['aspek'])
indeks = sum(a['nilai'] * a['bobot'] for a in d['aspek']) / total_bobot
indeks = round(indeks, 2)
d['indeks_aktual'] = indeks
d['indeks_label'] = 'Indeks dari Bukti Dukung Terverifikasi'
d['indeks_sumber'] = f"Dihitung dari {sum(1 for a in d['aspek'] for i in a['indikator'] for b in i.get('bukti_dukung',[]) if b['status']=='lengkap')} bukti lengkap · {d['total_item_bukti']} item"

json.dump(d, open('data/pemdi.json', 'w'), ensure_ascii=False, indent=1)
print(f"Indeks aktual: {indeks}")
for a in d['aspek']:
    print(f"  Aspek {a['id']}: {a['nilai']} (dari {[i['nilai'] for i in a['indikator']]})")
