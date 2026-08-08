#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Cek kandidat I11 dari zip: inventarisasi & lampiran teknis kriptografi."""
import fitz, os

files = [
    '/tmp/ev-l1/bukti-dukung/I11/i11-inventarisasi-aset-dienkripsi-dan-laporan-awal-kriptografi.pdf',
    '/tmp/ev-l1/bukti-dukung/I11/i11-lampiran-teknis-bukti-konfigurasi-kriptografi.pdf',
]
for f in files:
    doc = fitz.open(f)
    txt = ''.join(pg.get_text() for pg in doc)
    ph = {
        'LAMBANG': '[LAMBANG' in txt,
        'DUMMY': any(k in txt.lower() for k in ['dummy', 'contoh', 'placeholder', 'xxx', 'lorem']),
        'NAMA/NIP': ('[NAMA' in txt or '[NIP' in txt),
    }
    flags = [k for k, v in ph.items() if v]
    print(f"=== {f.split('/')[-1]} ({len(doc)} hal, {len(txt)}ch) ===")
    print(f"  placeholder: {flags if flags else 'BERSIH'}")
    print(f"  awal: {txt[:300].replace(chr(10), ' | ')}")
    print()
