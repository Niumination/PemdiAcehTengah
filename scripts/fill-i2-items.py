#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tandai I2 L1-1 lengkap dengan Renstra+Renja."""
import json

d = json.load(open('data/pemdi.json'))

n = 0
for a in d['aspek']:
    for i in a.get('indikator', []):
        if i.get('id') != 'I2':
            continue
        for b in i.get('bukti_dukung', []):
            if b['level'] == 1 and 'Substansi sebagian Rencana Aksi Nasional' in b['nama']:
                b['status'] = 'lengkap'
                b['url_preview'] = '/bukti-dukung/final/I2_L11_Substansi-RAN_2026.pdf'
                b['_ext'] = 'pdf'
                b['catatan'] = 'Renstra Diskominfo 2025-2029 + Renja Diskominfo TA 2026 - substansi RAN Pemdi pada perencanaan IPPD (sebagian). Satu set dokumen dengan I1 L2 (wajar multi-indikator: substansi RAN Pemdi diminta modul I1 dan I2).'
                n += 1
                print(f"UPDATE {b['id']} -> I2_L11_Substansi-RAN_2026.pdf")

json.dump(d, open('data/pemdi.json', 'w'), ensure_ascii=False, indent=1)
print(f"Updated: {n}")
