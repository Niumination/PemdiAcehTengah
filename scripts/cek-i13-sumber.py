#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""OCR cek dokumen aplikasi Bapokting/Gemasih/Lepat (KAK, Laporan, BAST)."""
import fitz, os

files = [
    'arsip-bukti-dukung/bukti-dukung/Teknologi_I13_05_KAK-Aplikasi-Bapokting_2026.pdf',
    'arsip-bukti-dukung/bukti-dukung/Teknologi_I13_06_Laporan-Aplikasi-Bapokting_2026.pdf',
    'arsip-bukti-dukung/bukti-dukung/Teknologi_I13_10_BAST-Aplikasi-Bapokting_2026.pdf',
    'arsip-bukti-dukung/bukti-dukung/Teknologi_I13_13_KAK-Aplikasi-Gemasih_2026.pdf',
]
for f in files:
    if not os.path.exists(f):
        print(f"MISS {f}")
        continue
    doc = fitz.open(f)
    txt = ''.join(pg.get_text() for pg in doc)
    ph = {
        'LAMBANG': ('[LAMBANG' in txt or '[LAMBAN' in txt),
        'DUMMY': any(k in txt.lower() for k in ['dummy', 'contoh', 'placeholder', 'lorem', 'xxx']),
        'NAMA/NIP': ('[NAMA' in txt or '[NIP' in txt),
    }
    flags = [k for k, v in ph.items() if v]
    print(f"{f.split('/')[-1]}: {len(doc)} hal, {len(txt)} ch, flags={flags if flags else 'BERSIH/TEXT'}")
    print(f"  awal: {txt[:150].replace(chr(10), ' | ') if txt else '[SCAN]'}")
    print()
