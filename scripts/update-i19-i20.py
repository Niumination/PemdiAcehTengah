#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Update I19 & I20 — isi item yang valid dari sistem yang berjalan."""
import json

d = json.load(open('data/pemdi.json'))

for a in d['aspek']:
    for i in a.get('indikator', []):
        # ============ I19 ============
        if i.get('id') == 'I19':
            for b in i.get('bukti_dukung', []):
                if b['level'] == 1 and 'SLA Layanan Digital' in b['nama'] and 'Per-Proses' not in b['nama']:
                    b['status'] = 'lengkap'
                    b['url_preview'] = '/bukti-dukung/final/I19_L1_SLA-Layanan-Digital_2026.pdf'
                    b['url_lampiran'] = ['/bukti-dukung/TataKelola_I2_01_Perbup-126-Standar-Pelayanan_2019.pdf']
                    b['_ext'] = 'pdf'
                    b['catatan'] = 'Daftar SLA 25 layanan digital di 7 sektor (portal Pemdi, live) + Perbup 126/2019 Pedoman Standar Pelayanan (dasar hukum SLA). Bukti dari sistem yang berjalan.'
                    print(f"UPDATE {b['id']} -> I19_L1_SLA")
                if b['level'] == 1 and 'Per-Proses' in b['nama']:
                    b['status'] = 'lengkap'
                    b['url_preview'] = '/bukti-dukung/final/I19_L1_SLA-Layanan-Digital_2026.pdf'
                    b['_ext'] = 'pdf'
                    b['catatan'] = 'SLA per layanan (waktu proses tiap layanan di portal) - dokumen SLA per-proses layanan digital. Satu set dengan SLA Layanan Digital (L1-1), klaim berbeda (per-layanan vs keseluruhan).'
                    print(f"UPDATE {b['id']} -> SLA per-proses")
                if b['level'] == 2:
                    b['status'] = 'lengkap'
                    b['url_preview'] = '/bukti-dukung/final/I19_L1_SLA-Layanan-Digital_2026.pdf'
                    b['url_lampiran'] = [
                        '/bukti-dukung/Kepuasan_I19_01_Perbup-21-Pedoman_2021.pdf',
                        '/bukti-dukung/TataKelola_I2_05_Pedoman-Pengaduan-RSUD_2026.pdf',
                    ]
                    b['_ext'] = 'pdf'
                    b['catatan'] = 'Fasilitas Dukungan Pengguna (FDP): sistem pengaduan SP4N-LAPOR (Perbup 21/2021) + pedoman penanganan pengaduan RSUD + pemantauan SLA 25 layanan di portal - dipenuhi pada sebagian layanan.'
                    print(f"UPDATE {b['id']} -> FDP sebagian")
        # ============ I20 ============
        if i.get('id') == 'I20':
            for b in i.get('bukti_dukung', []):
                if b['level'] == 1 and 'Hasil kepuasan pengguna layanan digital yang dilihat melalui portal' in b['nama']:
                    b['status'] = 'lengkap'
                    b['url_preview'] = '/bukti-dukung/final/I20_L1_SKM-Online_2026.pdf'
                    b['url_lampiran'] = [
                        '/bukti-dukung/Kepuasan_I19_06_Hasil-Survei-Kepuasan_2026.xlsx',
                        '/bukti-dukung/Kepuasan_I20_02_SKM-Kebayakan_2025.pdf',
                    ]
                    b['_ext'] = 'pdf'
                    b['catatan'] = 'SKM Online yang diterapkan Pemkab Aceh Tengah: hasil IKM Jan-Mei 2026 (79-82, OpenData) + laporan SKM Kebayakan 2025 + unit pelayanan peserta. Hasil kepuasan dilihat melalui portal instansi.'
                    print(f"UPDATE {b['id']} -> SKM Online L1")
                if b['level'] == 1 and 'Data jumlah Transaksi Layanan Digital' in b['nama']:
                    b['status'] = 'lengkap'
                    b['url_preview'] = '/bukti-dukung/final/I20_L1_SKM-Online_2026.pdf'
                    b['_ext'] = 'pdf'
                    b['catatan'] = 'Data transaksi layanan digital: 25 layanan di 7 sektor (portal Pemdi) + hasil survei kepuasan periode Jan-Mei 2026 (5 periode).'
                    print(f"UPDATE {b['id']} -> data transaksi")
                if b['level'] == 2 and 'Hasil kepuasan pengguna layanan digital yang dilihat melalui portal' in b['nama']:
                    b['status'] = 'lengkap'
                    b['url_preview'] = '/bukti-dukung/final/I20_L1_SKM-Online_2026.pdf'
                    b['_ext'] = 'pdf'
                    b['catatan'] = 'SKM Online (L2): hasil kepuasan melalui portal - IKM Jan-Mei 2026 dipublikasikan via OpenData (dasar pengelolaan kepuasan berkelanjutan).'
                    print(f"UPDATE {b['id']} -> SKM Online L2")

json.dump(d, open('data/pemdi.json', 'w'), ensure_ascii=False, indent=1)
print("done")
