#!/usr/bin/env python3
"""Sinkronkan data/pemdi.json dengan hasil Penilaian Tahap 1 di eval.spbe.go.id.

Konvensi kode file bukti: I{ind}-L{level}-{NN}.pdf  ⇔  item modul GT.I{ind}_L{level}_{NN}
(NN = nomor urut butir bukti di dalam level pada Modul Indikator resmi).

Vokabuler status (sejak 20 Sep 2026 — reposisi Opsi B):
  diterima : diunggah ke portal, dinilai asesor, hasil DITERIMA  → dihitung dalam simulasi indeks
  revisi   : diunggah ke portal, dinilai asesor, hasil REVISI    → berkas tidak disimpan di repo
  proses   : diunggah ke portal, belum ada hasil                  (belum ada di tahap 1)
  draf     : draf lokal / arsip kerja, BELUM diunggah ke portal   → tidak dihitung
  belum    : belum ada dokumen

Idempoten. Backup: data/pemdi.json.bak-tahap1 (sekali).
Jalankan: python3 scripts/apply-eval-tahap1.py
"""
import json
import os
import re
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "pemdi.json")
PDF_DIR = os.path.join(ROOT, "public", "bukti-dukung", "final")
TANGGAL = "2026-09-20"

DITERIMA = sorted(f[:-4] for f in os.listdir(PDF_DIR) if re.fullmatch(r"I\d+-L\d-\d{2}\.pdf", f))
LABEL = {
    "I1-L1-01": "Peta Rencana Pemdi 2025-2029 (rancangan awal memuat substansi RAN Pemdi)",
    "I1-L2-01": "Qanun RPJMD Kabupaten Aceh Tengah 2025-2029",
    "I1-L2-03": "Dokumentasi konsolidasi Tim Koordinasi Pemdi (undangan, daftar hadir, notulen)",
    "I2-L1-01": "Qanun RPJMD 2025-2029 + Renstra Diskominfo (substansi RAN Pemdi)",
    "I2-L1-02": "Laporan manajemen layanan digital internal Jan–Jun 2026",
    "I3-L1-01": "Dokumen peta kompetensi digital ASN (16 hlm.)",
    "I3-L1-02": "Laporan pemanfaatan aplikasi kerja digital + rekap pengguna",
    "I4-L1-01": "SK Bupati 555/395/2026 Tim Koordinasi Pemdi",
    "I4-L1-03": "Dokumentasi kolaborasi antar perangkat daerah (9 hlm.)",
    "I11-L1-01": "Inventarisasi aset enkripsi + laporan awal kriptografi 2026",
    "I12-L1-01": "Laporan penanganan insiden siber + register Jan–Jun 2026",
    "I13-L1-01": "Dokumentasi pengembangan aplikasi (KAK, BA, screenshot)",
    "I17-L1-01": "Rencana Aksi Super App Alpukat Gayo (portal layanan digital)",
    "I17-L1-02": "Portal layanan digital IPPD + matriks integrasi aplikasi",
    "I17-L2-01": "Rencana layanan digital yang dipadukan pada portal (Rencana Aksi Alpukat Gayo)",
    "I17-L2-02": "Tangkapan layar portal terpadu (siklus hidup ASN & publik)",
    "I20-L1-01": "SKM Online Triwulan II 2026 — 52 unit layanan",
    "I20-L1-02": "Rekap transaksi/respons SKM Online Triwulan II 2026",
}

# Catatan asesor AKTUAL dari eval.spbe.go.id (disalin 20 Sep 2026). jenis:
#   tidak_tepat      → berkas diunggah tapi substansi salah  (susun ulang dokumen yang benar)
#   belum_diunggah   → butir dinilai, tidak ada berkas         (buat & unggah)
#   otomatis_ditolak → ditolak karena level sebelumnya ditolak (selesaikan level bawah dulu)
REVISI_DETAIL = {
    "I1-L2-02":  ("tidak_tepat", "Bukti dukung yang disampaikan tidak tepat yaitu bukti pelaksanaan pembahasan evaluasi kinerja pemerintah digital, semestinya adalah kegiatan kolaboratif yang dilaksanakan di bawah koordinasi Tim Koordinasi Pemerintah Digital dalam penyusunan perencanaan pemerintah digital pemerintah daerah."),
    "I4-L1-02":  ("tidak_tepat", "Dalam bukti dukung yang diberikan berupa RKA Diskominfo, belum terdapat item kegiatan terkait rencana kolaborasi antar unit kerja dalam penerapan pemerintah digital."),
    "I4-L2-02":  ("otomatis_ditolak", "Otomatis ditolak karena tingkat kematangan sebelumnya ditolak."),
    "I8-L1-01":  ("belum_diunggah", "Dokumen pendukung/evidence terkait belum tersedia dan belum diunggah."),
    "I9-L1-01":  ("tidak_tepat", "Bukti dukung yang diberikan tidak tepat berupa SK Tim Asesor Internal Evaluasi Kinerja Pemdi, semestinya berupa SK Tim Auditor Internal Pemerintah Digital pemerintah daerah."),
    "I10-L1-01": ("tidak_tepat", "Bukti dukung yang diberikan tidak sesuai yaitu Indeks KAMI tahun 2023, semestinya adalah hasil penilaian IKASANDI yang dilaksanakan maksimal 1 tahun terakhir."),
    "I12-L1-02": ("belum_diunggah", "Dokumen pendukung/evidence terkait belum tersedia dan belum diunggah."),
    "I12-L2-01": ("otomatis_ditolak", "Otomatis ditolak karena tingkat kematangan sebelumnya ditolak."),
    "I13-L1-02": ("tidak_tepat", "Pada dokumen RKA/DPA yang diberikan belum ditemukan program/kegiatan terkait Pengembangan Aplikasi."),
    "I13-L2-01": ("belum_diunggah", "Dokumen pendukung/evidence terkait belum tersedia dan belum diunggah."),
    "I13-L2-02": ("belum_diunggah", "Dokumen pendukung/evidence terkait belum tersedia dan belum diunggah."),
    "I13-L3-01": ("belum_diunggah", "Dokumen pendukung/evidence terkait belum tersedia dan belum diunggah."),
    "I14-L1-01": ("belum_diunggah", "Dokumen pendukung/evidence terkait belum tersedia dan belum diunggah."),
    "I14-L1-02": ("belum_diunggah", "Dokumen pendukung/evidence terkait belum tersedia dan belum diunggah."),
    "I15-L1-01": ("tidak_tepat", "Bukti dukung yang disampaikan tidak tepat berupa penjelasan pasal terkait Arsitektur SPBE, semestinya penyusunan arsitektur proses bisnis yang sudah diimplementasikan pada SIAP Digital."),
    "I16-L1-01": ("belum_diunggah", "Dokumen pendukung/evidence terkait belum tersedia dan belum diunggah."),
    "I19-L1-02": ("tidak_tepat", "Bukti dukung yang diberikan tidak tepat berupa daftar layanan dan SLA-nya, semestinya adalah dasbor pemantauan SLA layanan digital pemerintah daerah."),
    "I20-L1-03": ("belum_diunggah", "Dokumen pendukung/evidence terkait belum tersedia dan belum diunggah."),
    "I20-L1-04": ("belum_diunggah", "Dokumen pendukung/evidence terkait belum tersedia dan belum diunggah."),
}
REVISI = list(REVISI_DETAIL)

def kode_to_id(kode):
    m = re.fullmatch(r"I(\d+)-L(\d)-(\d{2})", kode)
    return f"GT.I{int(m[1])}_L{int(m[2])}_{int(m[3])}", f"I{int(m[1])}", int(m[2])


def main():
    bak = DATA + ".bak-tahap1"
    if not os.path.exists(bak):
        shutil.copy(DATA, bak)
    d = json.load(open(DATA, encoding="utf-8"))

    by_ind = {ind["id"]: ind for a in d["aspek"] for ind in a["indikator"]}

    # 1. Lebur entri duplikat hasil inject lama (_eval_final) ke item modul kanonik.
    dihapus = 0
    for ind in by_ind.values():
        before = len(ind.get("bukti_dukung", []))
        ind["bukti_dukung"] = [b for b in ind.get("bukti_dukung", []) if not b.get("_eval_final")]
        dihapus += before - len(ind["bukti_dukung"])

    # 2. Semua status lama 'lengkap'/'proses' → 'draf' (belum pernah dinilai asesor);
    #    buang url_preview yang berkasnya tidak ada lagi di repo.
    diturunkan = 0
    for ind in by_ind.values():
        for b in ind["bukti_dukung"]:
            b.pop("_eval_final", None)
            if b.get("status") in ("lengkap", "proses"):
                b["status"] = "draf"
                diturunkan += 1
            u = b.get("url_preview")
            if u and u.startswith("/") and not os.path.exists(os.path.join(ROOT, "public", u.lstrip("/"))):
                b["_arsip"] = u  # jejak nama berkas lama (tidak tersedia publik)
                b.pop("url_preview", None)
                b.pop("_ext", None)
            b.pop("eval", None)

    # 3. Terapkan hasil Tahap 1.
    def apply(kode, hasil):
        bid, ind_id, lv = kode_to_id(kode)
        ind = by_ind[ind_id]
        item = next((b for b in ind["bukti_dukung"] if b["id"] == bid), None)
        if item is None:
            raise SystemExit(f"Item modul {bid} tidak ditemukan untuk kode {kode}")
        item["status"] = hasil
        item.pop("eval", None)  # tulis ulang di akhir → urutan key stabil (diff bersih saat rerun)
        if hasil == "diterima":
            item["url_preview"] = f"/bukti-dukung/final/{kode}.pdf"
            item["_ext"] = "pdf"
            item["catatan"] = LABEL.get(kode, item.get("catatan", ""))
        else:
            item.pop("url_preview", None)
            item.pop("_ext", None)
            item["catatan"] = REVISI_DETAIL[kode][1]
        item.pop("_arsip", None)
        item["eval"] = {"tahap": 1, "kode": kode, "hasil": hasil, "portal": "eval.spbe.go.id", "tanggal": TANGGAL}
        if hasil == "revisi":
            item["eval"]["jenis"] = REVISI_DETAIL[kode][0]

    for k in DITERIMA:
        apply(k, "diterima")
    for k in REVISI:
        apply(k, "revisi")

    # 4. Ringkasan & metadata global.
    stat = {"total": 0, "diterima": 0, "revisi": 0, "proses": 0, "draf": 0, "belum": 0}
    for ind in by_ind.values():
        for b in ind["bukti_dukung"]:
            stat["total"] += 1
            stat[b["status"]] += 1
    d["total_item_bukti"] = stat["total"]
    d["total_item_manual"] = stat["belum"]
    d["penilaian_tahap1"] = {
        "portal": "https://eval.spbe.go.id",
        "tanggal_sinkron": TANGGAL,
        "status": "Tahap 1 selesai dinilai — menunggu jadwal unggah revisi & tahap berikutnya",
        "dinilai": len(DITERIMA) + len(REVISI),
        "diterima": len(DITERIMA),
        "revisi": len(REVISI),
        "kode_diterima": DITERIMA,
        "kode_revisi": REVISI,
        "revisi_per_jenis": {j: sorted(k for k, (jj, _) in REVISI_DETAIL.items() if jj == j) for j in ("tidak_tepat", "belum_diunggah", "otomatis_ditolak")},
        "indikator_disentuh": sorted({kode_to_id(k)[1] for k in DITERIMA + REVISI}, key=lambda s: int(s[1:])),
        "konvensi_kode": "I{indikator}-L{level}-{nomor urut butir bukti di dalam level pada Modul Indikator}",
    }
    d["indeks_label"] = "Simulasi Penilaian Mandiri — bukan nilai resmi asesor"
    d["indeks_sumber"] = (
        f"Rumus resmi PermenPANRB 8/2026 · hanya bukti ber-status DITERIMA pada eval.spbe.go.id yang dihitung "
        f"({stat['diterima']} diterima · {stat['revisi']} revisi · {stat['draf']} draf lokal · {stat['belum']} belum · {stat['total']} item)"
    )
    d["catatan"] = (
        f"STATUS TAHAP 1 (sinkron {TANGGAL}): {stat['diterima']} bukti DITERIMA asesor, {stat['revisi']} REVISI, "
        f"{stat['draf']} draf lokal belum diunggah, {stat['belum']} belum ada (total {stat['total']} item). "
        "Nilai indikator = level kontinu yang seluruh butir bukti utamanya DITERIMA. "
        "Indikator eksternal I5/I6/I7/I18 memakai nilai minimum 1 selama skor eksternal belum tersedia."
    )
    d["perhitungan"]["nilai_indikator"] = "Tingkat kematangan 1–5 — level kontinu dengan seluruh butir bukti utama ber-status DITERIMA asesor"
    d["perhitungan"]["diperbarui"] = TANGGAL

    json.dump(d, open(DATA, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"duplikat dilebur: {dihapus} · diturunkan ke draf: {diturunkan} · diterima: {len(DITERIMA)} · revisi: {len(REVISI)}")
    print("stat:", stat)


if __name__ == "__main__":
    main()
