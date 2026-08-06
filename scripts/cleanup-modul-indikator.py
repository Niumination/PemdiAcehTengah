#!/usr/bin/env python3
"""
cleanup-modul-indikator.py — Bersihkan data/modul-indikator.json dari artefak
ekstraksi ODL-PDF yang di-inject mentah (heading markdown, tabel, image ref,
<br>, duplikasi frasa, pecahan baris) sehingga UI menampilkan poin penting saja.

Ground truth: docs/modul-indikator/*.md (hasil ODL re-extraction, verified 6 Agu 2026)
Patch manual level cacat = diverifikasi dari markdown asli.

Run: python3 scripts/cleanup-modul-indikator.py
"""
import json, re, sys, shutil, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'data', 'modul-indikator.json')
DOCS = os.path.join(ROOT, 'docs', 'modul-indikator')

LEVEL_LABEL = {0: 'Baseline', 1: 'Initiate', 2: 'Emerging', 3: 'Established', 4: 'Leading', 5: 'Transformative'}

# ─────────────────────────── cleaners ───────────────────────────

def clean_core(t: str, strip_label_headers: bool = True) -> str:
    """Hapus artefak ekstraksi: image md, tabel, <br>, heading marker, bullet campur."""
    if not t:
        return ''
    # image markdown (baris penuh atau inline)
    t = re.sub(r'^\s*!\[[^\]]*\]\(<[^>]*>\)\s*$', '', t, flags=re.M)
    t = re.sub(r'!\[[^\]]*\]\(<[^>]*>\)', '', t)
    t = re.sub(r'!\[[^\]]*\]\([^)]*\)', '', t)
    # tabel separator & baris tabel kosong
    t = re.sub(r'^\s*\|?\s*:?-+:?\s*\|?\s*$', '', t, flags=re.M)
    t = re.sub(r'^\s*\|+\s*\|?\s*$', '', t, flags=re.M)
    # parse sel tabel: buang pipa pinggir, split sel dalam baris
    t = re.sub(r'^\s*\|(.*?)\|\s*$', r'\1', t, flags=re.M)
    t = re.sub(r'\|', '\n', t)
    # <br> → newline
    t = re.sub(r'<br\s*/?>', '\n', t, flags=re.I)
    # heading label berdiri sendiri → label inline / hapus
    t = re.sub(r'^#{1,6}\s*(Data Dukung:?|Data Pendukung:?)\s*$', 'Data Dukung:', t, flags=re.M | re.I)
    t = re.sub(r'^#{1,6}\s*Kondisi\s*$', 'Kondisi:', t, flags=re.M | re.I)
    if strip_label_headers:
        t = re.sub(r'^#{1,6}\s*(Kriteria|Deskripsi|Instansi Pembina|Objek yang diukur|SLA|Sistem Ticketing|Alur Pemasangan|pemasangan widget|Dasar Hukum|Kolaborasi|Pengelola Layanan Digital|Organisasi Masyarakat Sipil|Pemilik Layanan|Fungsi TIK|Syarat Organisasi Masyarakat Sipil|Prinsip GEDSI[^\n]*)\s*$', '', t, flags=re.M | re.I)
    # heading nyangkut: strip marker # dari awal baris
    t = re.sub(r'^#{1,6}\s+', '', t, flags=re.M)
    # awalan "Kriteria"/"Kondisi" yang nyangkut di awal kalimat (artefak heading+teks)
    t = re.sub(r'^(?:Kriteria|Kondisi)\s+(?=[A-Z])', '', t)
    # normalisasi bullet
    t = re.sub(r'^\s*[•●○▪]\s*', '- ', t, flags=re.M)
    t = re.sub(r'^\s*-\s*[•●○]\s*', '- ', t, flags=re.M)
    # bullet italic ODL: "- *teks" → "- teks"
    t = re.sub(r'^(\s*-\s*)\*\s*', r'\1', t, flags=re.M)
    # marker italic berpasangan "*teks*" → teks (jangan lintas baris)
    t = re.sub(r'\*([^*\n]+)\*', r'\1', t)
    # sisa asterisk telanjang sebelum huruf kapital (artefak marker italic)
    t = re.sub(r'\*+(?=[A-Z])', '', t)
    return t


def drop_junk_lines(t: str) -> str:
    """Buang baris sampah (label kosong, angka telanjang, hanya simbol)."""
    lines = []
    for ln in t.split('\n'):
        s = ln.strip()
        if not s:
            continue
        if re.fullmatch(r'[\d\s.\-–—|]+', s):          # "1", "2", "1 2 3", "---"
            continue
        if re.fullmatch(r'(Kondisi|Kriteria|Data Dukung:?)', s, re.I):
            continue
        lines.append(s)
    return '\n'.join(lines)


def is_bullet(s: str) -> bool:
    return bool(re.match(r'^(-\s*|\d+[.)]\s+)', s))


def join_wrapped_lines(t: str) -> str:
    """Gabung baris yang nyambung (pecahan paragraf ODL line-wrap),
    termasuk lanjutan baris bullet yang tidak diakhiri tanda baca."""
    lines = t.split('\n')
    out = []
    for ln in lines:
        s = ln.strip()
        if not s:
            out.append('')
            continue
        prev = out[-1] if out else ''
        if prev and not prev.endswith(('.', ':', ';', '?', '!')) \
           and not prev.startswith(('Kondisi:', 'Data Dukung:')) \
           and not s.startswith(('Kondisi:', 'Data Dukung:')) \
           and not (is_bullet(prev) and is_bullet(s)):
            out[-1] = prev + ' ' + s
        else:
            out.append(s)
    return '\n'.join(out)


def dedup_lines(t: str) -> str:
    """Hapus poin yang duplikat / substring dari poin lain (artefak ODL)."""
    lines = [ln.strip() for ln in t.split('\n') if ln.strip()]
    norm = lambda s: re.sub(r'\s+', ' ', s.lower()).rstrip('.')
    kept = []
    for ln in lines:
        n = norm(ln)
        # duplikat eksak
        if any(norm(k) == n for k in kept):
            continue
        # substring (panjang >= 40): buang yang lebih pendek, pertahankan detail
        dup = False
        for k in kept:
            kn = norm(k)
            if len(n) >= 40 and len(kn) >= 40 and (n in kn or kn in n):
                dup = True
                break
        if not dup:
            kept.append(ln)
    return '\n'.join(kept)


def tidy(t: str) -> str:
    t = re.sub(r'\.{2,}', '.', t)
    t = re.sub(r'[ \t]+', ' ', t)
    t = re.sub(r'\n{3,}', '\n\n', t)
    t = re.sub(r'\s+$', '', t)
    return t.strip()


def clean_kriteria(text: str) -> str:
    if not text:
        return ''
    t = clean_core(text)
    t = drop_junk_lines(t)
    t = join_wrapped_lines(t)
    t = dedup_lines(t)
    t = tidy(t)
    return t


def clean_ddm(items) -> list:
    """data_dukung_modul: array pecahan baris → poin utuh."""
    if not isinstance(items, list):
        return []
    # gabung semua jadi teks, bersihkan, pecah jadi poin
    raw = '\n'.join(str(x) for x in items)
    t = clean_core(raw)
    t = drop_junk_lines(t)
    t = join_wrapped_lines(t)
    t = tidy(t)
    # pisah poin: baris bullet / label Data Dukung
    out = []
    for ln in t.split('\n'):
        s = ln.strip()
        if not s:
            continue
        if s.startswith('- '):
            out.append(s[2:].strip())
        elif s in ('Kondisi:', 'Data Dukung:'):
            continue
        else:
            out.append(s)
    # dedup
    seen, res = set(), []
    for x in out:
        k = re.sub(r'\s+', ' ', x.lower())
        if k not in seen:
            seen.add(k)
            res.append(x)
    return res


# ──────────────────────── manual patches (verified vs markdown) ────────────────────────

PATCHES = {
    ('I1', 1): (
        "Substansi Rencana Aksi Nasional Pemerintah Digital pada perencanaan Instansi Pemerintah dalam tahap penyusunan.\n"
        "- Perencanaan pada tingkat Instansi Pusat dapat berupa Rencana Strategis, Rencana Kerja, dan bentuk perencanaan instansi lainnya.\n"
        "- Perencanaan pada tingkat Pemerintah Daerah dapat berupa Rencana Pembangunan Jangka Menengah Daerah, Rencana Strategis Perangkat Daerah, Rencana Kerja, dan bentuk perencanaan instansi lainnya."
    ),
    ('I1', 5): (
        "- Langkah-langkah atau kegiatan nyata telah dilaksanakan sesuai reviu atas Substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah.\n"
        "- Telah memanfaatkan reviu Arsitektur Pemdi, pada seluruh Layanan Digital Pemerintah prioritas dan/atau Layanan Digital Pemerintah tematik, untuk mendukung transformasi tata kelola pelayanan publik dan pembangunan nasional.\n"
        "Data Dukung:\n"
        "- Bukti tindak lanjut reviu atas penerapan Tata Kelola Transformasi Digital Pemerintah.\n"
        "- Perubahan Substansi Rencana Aksi Nasional Pemerintah Digital pada perencanaan Instansi Pemerintah, berupa perbaikan/perubahan Arsitektur dan perubahan substansi perencanaan instansi."
    ),
    ('I4', 0): (
        "Kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah dalam penerapan Pemerintah Digital pada perencanaan Instansi Pemerintah."
    ),
    ('I8', 0): (
        "Uraian implementasi Pelindungan Data Pribadi (PDP) saat ini terhadap 7 kondisi penerapan PDP:\n"
        "- Belum memiliki tata kelola PDP\n"
        "- Belum ada program awareness dan kompetensi PDP bagi pegawai\n"
        "- Belum melakukan penunjukan Pejabat/Petugas PDP (DPO)\n"
        "- Belum terdapat mekanisme pemenuhan Hak Subjek Data\n"
        "- Belum terdapat mekanisme pemberitahuan pelindungan Data Pribadi\n"
        "- Belum terdapat mekanisme pengamanan Data Pribadi\n"
        "- Belum memiliki mekanisme Pengelolaan Risiko atau Dampak Data Pribadi"
    ),
    ('I17', 1): (
        "Substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan Portal Layanan Digital Pemerintah pada Instansi Pemerintah.\n"
        "Kondisi:\n"
        "Penerapan Portal Layanan Digital Pemerintah pada Instansi Pemerintah secara sewaktu-waktu atau bersifat sektoral dan terbatas pada layanan digital tertentu."
    ),
    ('I17', 5): (
        "- Penerapan Portal Layanan Digital Pemerintah Instansi Pemerintah telah terorganisir, terkelola secara terpadu, dan optimal, serta dilaksanakan reviu secara berkala, untuk transformasi tata kelola pelayanan publik dan pembangunan nasional, dalam memberikan layanan kepada masyarakat di setiap aspek kehidupan (Human-Based); dan/atau\n"
        "- Portal Layanan Digital Pemerintah untuk seluruh proses bisnis pada Instansi Pemerintah telah terintegrasi dengan Dasbor Presiden.\n"
        "- Tindak lanjut matriks pemantauan dalam Pemanfaatan Portal Layanan Digital Pemerintah Nasional serta laporan reviu pelaksanaan.\n"
        "Data Dukung:\n"
        "- Persentase pemanfaatan Portal Layanan Digital Pemerintah Nasional lebih dari 90% dari populasi pengguna."
    ),
    ('I19', 1): (
        "- Dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah.\n"
        "- Dalam tahap penyusunan SOP Layanan Digital Instansi Pemerintah dengan informasi rinci SLA.\n"
        "- Dalam tahap pengembangan sistem pemantauan pemenuhan dan kepatuhan SLA yang menjadi satu kesatuan dan terotomasi pada Layanan Digital Instansi Pemerintah.\n"
        "Data Dukung:\n"
        "- Terdapat dokumen SLA yang ditetapkan oleh Unit Kerja/Perangkat Daerah pengampu Layanan Digital dimaksud.\n"
        "- Terdapat Sistem Fasilitas Dukungan Pengguna.\n"
        "- Terdapat dasbor pemantauan SLA pada tiap Layanan Digital Pemerintah."
    ),
    ('I19', 2): (
        "- Telah memiliki Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah.\n"
        "- Telah memiliki SOP Layanan Digital Instansi Pemerintah dengan informasi rinci SLA.\n"
        "- Telah memiliki sistem pemantauan pemenuhan SLA Layanan Digital Instansi Pemerintah yang terotomatisasi.\n"
        "Data Dukung:\n"
        "- Penyedia layanan memberikan kanal interaksi dukungan secara pasif/reaktif, proaktif, dan bersifat personal (contact center, service desk, customer service).\n"
        "- Terdapat fitur tracking pada layanan dukungan pengguna untuk pemantauan pengaduan kendala penggunaan Layanan Digital Instansi Pemerintah.\n"
        "- Terdapat dasbor pemenuhan SLA untuk memantau kualitas setiap Layanan Digital Instansi Pemerintah.\n"
        "- Terdapat dasbor pemantauan proses dan SLA setiap tahapan layanan per-pengguna.\n"
        "- Standar SLA berdasarkan SOP yang ditetapkan oleh Unit Kerja/Perangkat Daerah pengampu Layanan Digital telah dipenuhi sebagian."
    ),
    ('I19', 3): (
        "- Telah memiliki Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah yang terintegrasi dengan dukungan layanan pengguna di tingkat nasional.\n"
        "- Telah memiliki SLA Layanan Digital Instansi Pemerintah yang sama dengan Layanan Digital Pemerintah di tingkat nasional.\n"
        "- Telah memiliki sistem pemantauan pemenuhan SLA Layanan Digital Instansi Pemerintah yang terintegrasi ke tingkat nasional.\n"
        "Data Dukung:\n"
        "- Penyedia layanan memberikan kanal interaksi dukungan secara pasif/reaktif, proaktif, dan bersifat personal serta terintegrasi dengan dukungan layanan pengguna di tingkat nasional.\n"
        "- Terdapat fitur tracking pada layanan dukungan pengguna yang terintegrasi ke tingkat nasional.\n"
        "- Terdapat dasbor pemenuhan SLA untuk memantau kualitas setiap Layanan Digital Instansi Pemerintah yang terintegrasi ke tingkat nasional.\n"
        "- Terdapat dasbor pemantauan proses dan SLA setiap tahapan layanan per-pengguna yang terintegrasi ke tingkat nasional."
    ),
    ('I19', 4): (
        "- Telah melaksanakan reviu dan evaluasi dari pemenuhan SLA Layanan Digital Instansi Pemerintah.\n"
        "- Pelaksanaan reviu dan evaluasi terhadap Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah dan sistem pemantauan pemenuhan SLA.\n"
        "Data Dukung:\n"
        "- Kepatuhan SLA Layanan Digital Instansi Pemerintah dilakukan evaluasi secara menyeluruh untuk mendukung pencapaian SLA di tingkat nasional.\n"
        "- Fasilitas dukungan pengguna layanan digital dilakukan evaluasi secara menyeluruh."
    ),
    ('I19', 5): (
        "- Tindak lanjut atas hasil reviu pelaksanaan pemenuhan SLA telah dilaksanakan.\n"
        "- Tindak lanjut atas hasil reviu Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah dan sistem pemantauan pemenuhan SLA telah dilaksanakan.\n"
        "Data Dukung:\n"
        "- Optimalisasi Layanan Dukungan Pengguna dalam rangka mendukung transformasi tata kelola pelayanan publik dan pembangunan, dalam memberikan layanan kepada masyarakat di setiap aspek kehidupan (Human-Based) yang berorientasi pada kemudahan pengguna."
    ),
    ('I20', 2): (
        "- Skor kepuasan pengguna telah digunakan untuk perbaikan Layanan Digital Instansi Pemerintah.\n"
        "- Survei dan masukan pengguna diproses secara berkala (minimal triwulanan) dan menjadi bagian dari evaluasi.\n"
        "- Pelibatan pengguna dan Organisasi Masyarakat Sipil (Civil Society Organization/CSO) yang memiliki keahlian terkait Layanan Digital.\n"
        "- Mulai diterapkan penilaian mandiri kepuasan pengguna setiap Layanan Digital Instansi Pemerintah.\n"
        "- Tersedia widget atau fitur umpan balik sederhana di layanan digital sebagai kanal akomodasi kebutuhan pengguna (contoh: pop-up rating, tombol \"Berikan Masukan\")."
    ),
    ('I20', 3): (
        "- Telah membentuk tim teknis dalam pengelolaan pengalaman dan kepuasan pengguna Layanan Digital Instansi Pemerintah.\n"
        "- Survei kepuasan pengguna dipublikasikan secara daring dalam bentuk dasbor untuk setiap Layanan Digital Instansi Pemerintah.\n"
        "- Semua Layanan Digital Instansi Pemerintah memiliki mekanisme umpan balik secara langsung (widget, chatbot, ulasan pengguna, dsb).\n"
        "- Telah dilaksanakan mystery guest/mystery shopper atas Layanan Instansi Pemerintah yang telah memanfaatkan teknologi digital oleh Instansi Pemerintah.\n"
        "- Survei dan data kepuasan digunakan dalam evaluasi pelaksanaan Pemdi dan dilaporkan secara berkala pada publik."
    ),
    ('I20', 4): (
        "- Memanfaatkan Forum Konsultasi Publik sebagai ruang temu daring pengguna dan penyedia layanan, minimal tiap semester.\n"
        "- Telah dilaksanakan mystery guest/mystery shopper audit atas Layanan Instansi Pemerintah yang telah memanfaatkan teknologi digital oleh Instansi Pemerintah, dengan berkoordinasi terlebih dahulu dengan instansi pembina atau Instansi Daerah setingkat lebih tinggi.\n"
        "- Desain ulang layanan dilakukan secara periodik berbasis hasil survei dan umpan balik digital pengguna.\n"
        "- Log perubahan layanan dipublikasikan sebagai bentuk akuntabilitas atas masukan publik.\n"
        "- Pemanfaatan Kecerdasan Artifisial dan Analisis Data untuk menganalisis sentimen pengguna, digunakan dalam evaluasi pelaksanaan Pemdi."
    ),
    ('I20', 5): (
        "- Data riwayat perubahan layanan berbasis kebutuhan pengguna, digunakan dalam evaluasi pelaksanaan Pemdi dan dilaporkan kepada publik secara berkala.\n"
        "- Telah memanfaatkan pengukuran tingkat kepuasan pengguna dengan mekanisme tepercaya untuk menjaga kredibilitas penilaian pada semua Layanan Digital Instansi Pemerintah."
    ),
}

# ──────────────────────────── main ────────────────────────────

def main():
    with open(DATA, encoding='utf-8') as f:
        data = json.load(f)

    shutil.copy2(DATA, DATA + '.bak-clean')

    mods = data['modules']
    stats = {'levels': 0, 'patched': 0, 'ddm_items': 0}
    for m in mods:
        # level_kriteria
        for item in m.get('level_kriteria') or []:
            lv = item.get('level')
            if lv is None:
                continue
            stats['levels'] += 1
            key = (m['indikator_id'], lv)
            if key in PATCHES:
                item['kriteria'] = PATCHES[key]
                stats['patched'] += 1
            else:
                item['kriteria'] = clean_kriteria(item.get('kriteria', ''))
            item['label'] = LEVEL_LABEL.get(lv, f'Level {lv}')
        # data_dukung_modul
        ddm = m.get('data_dukung_modul')
        if ddm:
            cleaned = clean_ddm(ddm)
            m['data_dukung_modul'] = cleaned
            stats['ddm_items'] += len(cleaned)
        # deskripsi modul: buang artefak tabel/image, pertahankan heading section
        if m.get('deskripsi'):
            d = clean_core(m['deskripsi'], strip_label_headers=False)
            d = join_wrapped_lines(drop_junk_lines(d))
            d = tidy(d)
            m['deskripsi'] = d

    with open(DATA, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print('✅ Selesai. Backup: data/modul-indikator.json.bak-clean')
    print(stats)


if __name__ == '__main__':
    main()
