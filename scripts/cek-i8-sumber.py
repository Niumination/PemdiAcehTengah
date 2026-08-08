#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Cek isi I8 final & cari dokumen PDP di sumber lain."""
import fitz, os, re, subprocess

for f in ['public/bukti-dukung/final/I8_L1_Final.pdf', 'public/bukti-dukung/final/I8_L2_Final.pdf']:
    if os.path.exists(f):
        doc = fitz.open(f)
        full = ''.join(pg.get_text() for pg in doc)
        print(f"=== {f} ({len(doc)} hal) ===")
        print(full[:250].replace(chr(10), ' | '))
        print()

print("=== CARI DOKUMEN PDP DI SUMBER LAIN ===")
r = subprocess.run(['find', '/Users/zaryu/Documents', '-iname', '*pdp*', '-o', '-iname', '*pribadi*'],
                   capture_output=True, text=True)
print(r.stdout[:800] if r.stdout else "Documents: tidak ada")

r2 = subprocess.run(['find', '/tmp/ev-l1', '-iname', '*pdp*', '-o', '-iname', '*privasi*', '-o', '-iname', '*pribadi*'],
                    capture_output=True, text=True)
print("zip L1:", r2.stdout[:400] if r2.stdout else "tidak ada")

# cek semua PDF di arsip yang mungkin relevan PDP (Perbup 6 = klasifikasi keamanan)
print("\nArsip terkait keamanan/arsip:")
for f in sorted(os.listdir('arsip-bukti-dukung/bukti-dukung')):
    if any(k in f for k in ['Keamanan', 'Arsip', 'I8', 'Sandi']):
        print(f"  {f}")
