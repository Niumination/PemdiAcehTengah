#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Cek kandidat I9: draf zip L1 + Laporan Pengawasan."""
import fitz, os, re

# 1. Draf dari zip L1
for f in ['/tmp/ev-l1/bukti-dukung/I09/i09-sk-tim-audit-keamanan-pemdi.pdf',
          '/tmp/ev-l1/bukti-dukung/I09/i09-rencana-audit-keamanan-pemdi-2026.pdf']:
    if os.path.exists(f):
        doc = fitz.open(f)
        txt = ''.join(pg.get_text() for pg in doc)
        ph = {
            'LAMBANG': '[LAMBANG' in txt,
            'DUMMY': any(k in txt.lower() for k in ['dummy', 'contoh', 'placeholder', 'xxx', 'lorem']),
            'NAMA/NIP': ('[NAMA' in txt or '[NIP' in txt or 'nama' in txt.lower() and 'xxx' in txt.lower()),
        }
        flags = [k for k, v in ph.items() if v]
        print(f"=== {f.split('/')[-1]} ({len(doc)} hal, {len(txt)}ch) ===")
        print(f"  placeholder: {flags if flags else 'BERSIH'}")
        print(f"  awal: {txt[:200].replace(chr(10),' | ')}")
        print()

# 2. Laporan Pengawasan Kinerja (xlsx) — isi
import openpyxl
p = 'arsip-bukti-dukung/bukti-dukung/KeamananSiber_I9_02_Laporan-Pengawasan-Kinerja_2026.xlsx'
if os.path.exists(p):
    wb = openpyxl.load_workbook(p, data_only=True)
    for ws in wb.worksheets:
        rows = list(ws.iter_rows(values_only=True))
        print(f"=== Laporan Pengawasan ({ws.title}): {len(rows)} baris ===")
        if rows:
            for r in rows[:5]:
                print('  ', [str(c)[:30] if c else '' for c in r][:6])
