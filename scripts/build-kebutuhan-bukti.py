#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Bangun data/kebutuhan-bukti-dukung.json — matriks kebutuhan bukti dukung Level 1-2.

Sumber kanonik: docs/analisis-bukti-dukung-l1-l2.md (NotebookLM — ekstraksi 20 PPTX
Modul Indikator Pemdi, PermenPANRB 8/2026). Setiap butir kebutuhan diperkaya:

  1. meta indikator (nama resmi, aspek, bobot, PIC) dari data/pemdi.json
  2. rujukan silang item modul (data/modul-indikator.json, level sama) via
     fuzzy-match difflib — hanya dipasangkan bila skor >= MODUL_MIN
  3. status ketersediaan indikatif dari bukti dukung existing (data/pemdi.json,
     id GT.*) via fuzzy-match — hanya bila skor >= STATUS_MIN; selain itu null
     (perlu verifikasi manual) supaya tidak ada klaim keliru
  4. tabel Panduan Bab 6 (docs/Panduan_Peningkatan_Indeks_Pemdi_Aceh_Tengah.md):
     target nilai + dokumen/format/PIC/cara-mendapatkan per indikator

Idempoten — aman dijalankan berulang. Output dibaca halaman /modul-indikator
(bagian "Matriks Kebutuhan Bukti Dukung").
"""
import json
import os
import re
from datetime import date
from difflib import SequenceMatcher

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def read(*path):
    with open(os.path.join(ROOT, *path), encoding="utf-8") as f:
        return f.read()


MODUL_MIN = 0.50   # ambang rujukan silang item modul
GT_MIN = 0.60      # ambang status indikatif (rantai modul→GT, atau langsung)

STOP = {"yang", "dan", "atau", "dengan", "untuk", "pada", "dalam", "oleh", "dari",
        "secara", "sebagai", "tersebut", "sudah", "telah", "ada", "adanya",
        "seperti", "misal", "misalnya", "berupa", "yaitu", "serta"}

# Sinonim domain administratif — menyamakan istilah sejenis saat tokenisasi
SINONIM = {"pembentukan": "penetapan", "sk": "penetapan", "salinan": "dokumen"}


def norm(s):
    return re.sub(r"\s+", " ", re.sub(r"[*_`>]", "", s or "")).strip()


def tokens(s):
    raw = [t for t in re.findall(r"[a-z0-9][a-z0-9,.-]{2,}", s.lower()) if t not in STOP]
    return {SINONIM.get(t, t) for t in raw}


def skor(a, b):
    """Skor kemiripan gabungan: rasio urutan + koefisien overlap token."""
    if not a or not b:
        return 0.0
    r = SequenceMatcher(None, a.lower(), b.lower()).ratio()
    ta, tb = tokens(a), tokens(b)
    ov = len(ta & tb) / min(len(ta), len(tb)) if ta and tb else 0.0
    return max(r, ov)


# ── 1. Parse dokumen sumber (struktur: ## Ix | Judul → ### L1/L2 → tabel) ──
def parse_sumber(text):
    indikator = []
    cur = cur_lv = None
    for line in text.splitlines():
        m = re.match(r"^## (I\d+) \| (.+)$", line.strip())
        if m:
            cur = {"indikator": m.group(1), "judul_sumber": m.group(2).strip(),
                   "catatan_grup": "", "level": []}
            indikator.append(cur)
            cur_lv = None
            continue
        if cur is None:
            continue
        m = re.match(r"^\*Catatan sumber: (.*)\*$", line.strip())
        if m:
            cur["catatan_grup"] = m.group(1).rstrip(".").strip()
            continue
        m = re.match(r"^### L([12]) — .+$", line.strip())
        if m:
            cur_lv = {"level": int(m.group(1)), "kebutuhan": []}
            cur["level"].append(cur_lv)
            continue
        if cur_lv and line.strip().startswith("|"):
            cells = [norm(c) for c in line.strip().strip("|").split("|")]
            if len(cells) >= 3 and cells[0].isdigit() and cells[1] and not set(cells[0]) - set("0123456789"):
                cur_lv["kebutuhan"].append({
                    "no": int(cells[0]),
                    "bukti": cells[1],
                    "kondisi": None if cells[2] in ("—", "-", "") else cells[2],
                })
    return indikator


# ── 2. Parse tabel Panduan Bab 6 (#### Indikator N — ...) ──
def parse_panduan(text):
    out = {}
    blocks = re.split(r"^#### ", text, flags=re.M)[1:]
    for b in blocks:
        m = re.match(r"Indikator (\d+) — (.+?) \(Bobot (\d+)%\)", b.splitlines()[0].strip())
        if not m:
            continue
        # Batasi blok sampai heading H2 berikutnya (## 7./8./9.) supaya tabel
        # Bab 7-8 (Kegiatan|PIC|Output, dst.) tidak bocor ke blok indikator.
        b = re.split(r"^## ", b, flags=re.M)[0]
        nomor = int(m.group(1))
        tm = re.search(r"\*\*Target Aceh Tengah: (nilai [^*]+?)\*\*", b)
        target = tm.group(1).strip() if tm else None
        dokumen = []
        for line in b.splitlines():
            if not line.strip().startswith("|"):
                continue
            cells = [norm(c) for c in line.strip().strip("|").split("|")]
            if not cells or cells[0] in ("Dokumen Bukti Dukung", "") or set(cells[0]) <= set("-: "):
                continue
            if len(cells) >= 4:  # Dokumen | Format | Penanggung Jawab | Cara
                dokumen.append({"dokumen": cells[0], "format": cells[1], "pic": cells[2], "cara": cells[3]})
            elif len(cells) == 3:  # Dokumen | Format | Cara
                dokumen.append({"dokumen": cells[0], "format": cells[1], "pic": None, "cara": cells[2]})
        if dokumen or target:
            out[f"I{nomor}"] = {"target": target, "dokumen": dokumen}
    return out


def main():
    sumber_text = read("docs", "analisis-bukti-dukung-l1-l2.md")
    panduan_text = read("docs", "Panduan_Peningkatan_Indeks_Pemdi_Aceh_Tengah.md")
    pemdi = json.loads(read("data", "pemdi.json"))
    modul = json.loads(read("data", "modul-indikator.json"))

    mods = {m["indikator_id"]: m for m in modul["modules"]}
    inds = {i["id"]: (a, i) for a in pemdi["aspek"] for i in a["indikator"]}
    panduan = parse_panduan(panduan_text)
    sumber = parse_sumber(sumber_text)

    total_item = 0
    status_count = {"lengkap": 0, "proses": 0, "belum": 0, None: 0}
    hasil = []
    for s in sumber:
        iid = s["indikator"]
        a, ind = inds.get(iid, (None, None))
        mod = mods.get(iid)

        def bersih_gt(nama):
            return re.sub(r"^\d+\.\s*", "", norm(nama))

        def assign_uniq(pairs):
            """Greedy bipartite unik: pasangan skor tertinggi dipakai lebih dulu."""
            used_a, used_b, out = set(), set(), {}
            for sc, ai, bi in sorted(pairs, key=lambda x: -x[0]):
                if ai in used_a or bi in used_b:
                    continue
                used_a.add(ai)
                used_b.add(bi)
                out[ai] = (bi, sc)
            return out

        # penugasan unik (greedy bipartite) per level: kebutuhan↔modul↔GT
        kebs_by_lv = {lv2["level"]: lv2["kebutuhan"] for lv2 in s["level"]}
        mod_by_lv, gt_by_lv = {}, {}
        for lk in (mod or {}).get("level_kriteria", []):
            if lk["level"] in kebs_by_lv:
                mod_by_lv[lk["level"]] = [norm(b["item"]) for b in lk.get("bukti_dukung", [])]
        for lv2 in s["level"]:
            gt_by_lv[lv2["level"]] = [b for b in (ind or {}).get("bukti_dukung", [])
                                      if b["level"] == lv2["level"]]

        match_mod, match_gt, match_dir = {}, {}, {}
        for lvl, kebs in kebs_by_lv.items():
            mods_l, gts_l = mod_by_lv.get(lvl, []), gt_by_lv.get(lvl, [])
            match_mod[lvl] = assign_uniq(
                [(skor(k["bukti"], mi), ki, mi_i) for ki, k in enumerate(kebs)
                 for mi_i, mi in enumerate(mods_l)])
            match_gt[lvl] = assign_uniq(
                [(skor(mi, bersih_gt(g["nama"])), mi_i, gi)
                 for mi_i, mi in enumerate(mods_l) for gi, g in enumerate(gts_l)])
            match_dir[lvl] = assign_uniq(
                [(skor(k["bukti"], bersih_gt(g["nama"])), ki, gi)
                 for ki, k in enumerate(kebs) for gi, g in enumerate(gts_l)])

        ent = {
            "indikator": iid,
            "nama": ind["nama"] if ind else s["judul_sumber"],
            "judul_sumber": s["judul_sumber"],
            "aspek": a["nama"] if a else (mod["aspek"] if mod else None),
            "aspek_singkat": a["singkat"] if a else None,
            "bobot": ind.get("bobot") if ind else None,
            "pic": (ind or {}).get("penanggung_jawab"),
            "catatan_grup": s["catatan_grup"] or None,
            "nilai_saat_ini": ind.get("nilai") if ind else None,
            "target_indikator": ind.get("target") if ind else None,
            "level": [],
        }
        for lv in s["level"]:
            lvl = lv["level"]
            mods_l = mod_by_lv.get(lvl, [])
            gts_l = gt_by_lv.get(lvl, [])
            m_mod = match_mod.get(lvl, {})   # ki -> (mi_i, skor)
            m_gt = match_gt.get(lvl, {})     # mi_i -> (gi, skor)
            m_dir = match_dir.get(lvl, {})   # ki -> (gi, skor)
            rows = []
            for ki, k in enumerate(lv["kebutuhan"]):
                total_item += 1
                # (a) jangkar: item modul pada level sama (penugasan unik)
                best_mod, best_mod_s, mod_i = None, 0.0, None
                if ki in m_mod:
                    mod_i, best_mod_s = m_mod[ki]
                    if best_mod_s >= MODUL_MIN:
                        best_mod = mods_l[mod_i]
                # (b) status indikatif: rantai kebutuhan→modul→GT, fallback langsung kebutuhan→GT
                best_gt, best_gt_s, via = None, 0.0, None
                if best_mod is not None and mod_i in m_gt and m_gt[mod_i][1] >= GT_MIN:
                    gi, best_gt_s = m_gt[mod_i]
                    best_gt, via = gts_l[gi], "modul"
                if best_gt is None and ki in m_dir and m_dir[ki][1] >= GT_MIN:
                    gi, best_gt_s = m_dir[ki]
                    best_gt, via = gts_l[gi], "langsung"
                status = best_gt["status"] if best_gt else None
                status_count[status] = status_count.get(status, 0) + 1
                rows.append({
                    **k,
                    "modul_item": best_mod,
                    "modul_match": round(best_mod_s, 2),
                    "status_indikasi": status,
                    "status_match": round(best_gt_s, 2),
                    "status_via": via if status else None,
                    "bukti_terkait": [{
                        "id": best_gt["id"], "nama": best_gt["nama"], "status": best_gt["status"],
                    }] if best_gt else [],
                })
            ent["level"].append({"level": lv["level"], "kebutuhan": rows})
        if iid in panduan:
            ent["panduan_bab6"] = panduan[iid]
        hasil.append(ent)

    out = {
        "judul": "Matriks Kebutuhan Bukti Dukung Pemdi — Level 1 & 2",
        "sumber": "Analisis Bukti Dukung Kematangan Pemerintah Digital (Level 1 & 2) — NotebookLM, ekstraksi 20 PPTX Modul Indikator Pemdi (docs/analisis-bukti-dukung-l1-l2.md)",
        "panduan": "docs/Panduan_Peningkatan_Indeks_Pemdi_Aceh_Tengah.md (Bab 6 — Panduan Teknis Pengumpulan Bukti Dukung per Indikator)",
        "dibangun": str(date.today()),
        "cakupan": {
            "indikator": len(hasil),
            "tidak_dibahas": ["I5 (SDI — eksternal)", "I6 (SJIG — eksternal)", "I7 (EPSS — eksternal)", "I18 (strategi tim)"],
            "level": [1, 2],
            "total_kebutuhan": total_item,
        },
        "status_indikasi": {
            "ket": "Status dipetakan otomatis (fuzzy-match) ke bukti dukung existing di data/pemdi.json — indikatif, tetap perlu verifikasi substansi kriteria level.",
            "lengkap": status_count.get("lengkap", 0),
            "proses": status_count.get("proses", 0),
            "belum": status_count.get("belum", 0),
            "perlu_verifikasi": status_count.get(None, 0),
        },
        "catatan_implementasi": "Untuk bukti dukung arsitektur (I1, I13, I14, I15), sangat krusial bagi operator Aceh Tengah untuk melakukan pengisian di portal SIAP Digital (SIA v3) secara berkala karena bukti utamanya adalah screenshot dari sistem tersebut.",
        "indikator": hasil,
    }
    with open(os.path.join(ROOT, "data", "kebutuhan-bukti-dukung.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)

    # ── ringkasan verifikasi ──
    print(f"indikator: {len(hasil)} · total kebutuhan: {total_item}")
    print(f"status indikasi: {out['status_indikasi']}")
    nomodul = [(e['indikator'], lv['level'], k['no']) for e in hasil for lv in e['level']
               for k in lv['kebutuhan'] if not k['modul_item']]
    nostatus = [(e['indikator'], lv['level'], k['no']) for e in hasil for lv in e['level']
                for k in lv['kebutuhan'] if not k['status_indikasi']]
    print(f"tanpa rujukan modul ({len(nomodul)}):", nomodul[:12])
    print(f"tanpa status ({len(nostatus)}):", nostatus[:12])
    for e in hasil:
        st = [k['status_indikasi'] or '?' for lv in e['level'] for k in lv['kebutuhan']]
        print(f"  {e['indikator']:<4} L1+L2={len(st):<2} status={st} panduan={'ya' if 'panduan_bab6' in e else 'TIDAK'}")


if __name__ == "__main__":
    main()
