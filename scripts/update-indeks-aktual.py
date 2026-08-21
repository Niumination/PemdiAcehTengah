#!/usr/bin/env python3
"""[DEPRECATED] Metode lama penghitungan indeks aktual.

Digantikan oleh `scripts/hitung-capaian-pemdi.py` yang mengimplementasikan
rumus resmi PermenPANRB 8/2026 (Lampiran, hlm. -37- s.d. -39-):
  Indeks Aspek = Σ(wIj × NIj) / wAi ;  Indeks Pemdi = Σ(wAspek × Indeks Aspek)
dengan penanganan indikator eksternal (I5/I6/I7/I18) dan target indikator
dari Panduan Bab 4.2. Jangan jalankan script ini — jalankan:
  python3 scripts/hitung-capaian-pemdi.py
"""
import sys

sys.exit(
    "Script deprecated — gunakan: python3 scripts/hitung-capaian-pemdi.py "
    "(rumus resmi PermenPANRB 8/2026)"
)
