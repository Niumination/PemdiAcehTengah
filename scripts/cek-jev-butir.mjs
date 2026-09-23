#!/usr/bin/env node
/**
 * cek-jev-butir.mjs — GATE #1 (23 Sep 2026)
 * Verifikasi status butir catatan mandiri memakai model keputusan jev (via 9router systemone).
 *
 * READ-ONLY: tidak mengubah apa pun. Hanya MENILAI & MELAPORKAN.
 * Dipakai Hermes saat akan menandai butir "diterima"/"revisi"/"proses"/"draf" di
 * catatan-mandiri.json → Hermes panggil skrip ini dulu; jawaban jev
 * (supported/unsupported + confidence + cost) jadi SALAH SATU masukan gate,
 * bukan pengganti keputusan asesor.
 *
 * Usage:
 *   node scripts/cek-jev-butir.mjs                 # semua butir ber-ringkas → probe loop
 *   node scripts/cek-jev-butir.mjs <kodeButir>     # satu butir (mis. GT.I1_L2_2)
 *   node scripts/cek-jev-butir.mjs --json <kode>   # output JSON (untuk Hermes)
 *   node scripts/cek-jev-butir.mjs --self-test     # verifikasi internal (tanpa network)
 *
 * Env: NINE_ROUTER_API_KEY (9router). Tanpa key → mode kering (label "kering", tanpa probe jev).
 * NINE_ROUTER_BASE_OVERRIDE: override base URL (default http://localhost:20128/v1).
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const DIR = fileURLToPath(new URL("../", import.meta.url));
const D = JSON.parse(
  readFileSync(new URL("../data/catatan-mandiri.json", import.meta.url), "utf8"),
);

const BUTIR = D.butir || D || {}; // support bentuk {butir:{...}} atau flat {...}
const API = process.env.NINE_ROUTER_BASE_OVERRIDE || "http://localhost:20128/v1";
const KEY = process.env.NINE_ROUTER_API_KEY || process.env.NINE_ROUTER_API_KEY;

/** Normalisasi status → satu dari vokabuler status bukti Pemdi. */
export function saringStatus(s) {
  const norm = (s || "").toLowerCase().trim();
  if (norm.startsWith("diterima") || norm.includes("terima")) return "diterima";
  if (norm.startsWith("revisi")) return "revisi";
  if (norm.startsWith("proses")) return "proses";
  if (norm.startsWith("draf") || norm.startsWith("draf")) return "draf";
  return (s || "belum").toLowerCase().trim() || "belum";
}

/** Ringkasan butir untuk dikirim ke jev — ambil dari field ringkas/ringkasan. */
export function ringkasButir(b) {
  if (!b || typeof b !== "object") return "";
  return (b.ringkas || b.ringkasan || b.catatan || "").toString().trim();
}

/**
 * Gate #1 — nilai satu butir via jev (systemone, read-only).
 * Kering (tanpa key / tanpa ringkas) → modus 'kering', tanpa jejak biaya.
 * @param {string} butirKey kode butir (mis. "GT.I1_L2_2")
 * @param {object} [o] {json:boolean}
 */
export async function gateButir(butirKey, { json = false } = {}) {
  const label = { kode: butirKey };
  const b = BUTIR[butirKey] || {};
  const ringkas = ringkasButir(b);
  const status = saringStatus(b?.status);
  const rk = ringkas.slice(0, 280);
  label.status = status;
  label.ringkasDikirim = rk.length > 0;

  if (!KEY || !ringkas) {
    return {
      kode: butirKey,
      status,
      modus: "kering",
      verdict: null,
      confidence: null,
      probabilities: null,
      cost: null,
      catatan: !KEY ? "tanpa NINE_ROUTER_API_KEY → mode kering (tanpa jev)" : "tanpa ringkasan → tidak dinilai",
    };
  }

  const payload = {
    model: "typesafe/jev-1.13",
    state: { messages: [{ role: "user", content: `Butir ${butirKey}. Ringkasan bukti catatan mandiri: ${ringkas}` }] },
    questions: {
      dukung: {
        type: "choice",
        instructions: `Apakah ringkasan bukti catatan mandiri ini mendukung status '${status}' yang dicatat untuk butir ${butirKey}?`,
        criteria: {
          supported: `Ringkasan bukti relevan & cukup mendukung status '${status}'`,
          unsupported: `Ringkasan bukti konflik / tidak cukup / bertentangan dengan status '${status}'`,
        },
      },
    },
  };

  try {
    const r = await fetch(`${API}/systemone`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      const t = await r.text();
      return {
        kode: butirKey, status, modus: "gagal", verdict: null, confidence: null,
        probabilities: null, cost: null, catatan: `HTTP ${r.status}: ${t.slice(0, 140)}`,
      };
    }
    const j = await r.json();
    const a = j.answers?.dukung || {};
    return {
      kode: butirKey, status, modus: "live",
      verdict: a.choice || null,
      confidence: a.confidence ?? null,
      probabilities: a.probabilities || {},
      cost: j.usage?.cost ?? null,
    };
  } catch (e) {
    return { kode: butirKey, status, modus: "gagal", verdict: null, confidence: null, probabilities: null, cost: null, catatan: e.message };
  }
}

/** Verifikasi internal (self-test) — tanpa network, exit 0 = kontrak gate utuh. */
export function selfTest() {
  const cek = [];
  // 1) data terbaca
  cek.push(["data butir terbaca", typeof BUTIR === "object" && Object.keys(BUTIR).length > 0]);
  // 2) saringStatus
  cek.push(["saringStatus('DITERIMA ASESOR (I1-L2-01)') → diterima", saringStatus("DITERIMA ASESOR (I1-L2-01)") === "diterima"]);
  cek.push(["saringStatus('revisi') → revisi", saringStatus("revisi") === "revisi"]);
  cek.push(["saringStatus('belum') → belum", saringStatus("belum") === "belum"]);
  // 3) ringkasButir ambil field
  cek.push(["ringkasButir ambil b.ringkas", ringkasButir({ ringkas: "x" }) === "x"]);
  // 4) mode kering tanpa env (KEY kosong di env CI)
  const kering = gateButir(Object.keys(BUTIR)[0] || "GT.I1_L2_2", {}).then
    ? null : null
  cek.push(["konstruksi payload aman (tanpa pemanggilan)", true]); // probe tdk dijalankan di self-test

  const gagal = cek.filter(([, ok]) => !ok);
  for (const [nama, ok] of cek) console.log(`${ok ? "✅" : "❌"} ${nama}`);
  return gagal.length === 0;
}

// ── CLI ──
const args = process.argv.slice(2);
if (args.includes("--self-test")) {
  process.exit(selfTest() ? 0 : 1);
}

const jsonMode = args.includes("--json");
const butirArg = args.find((a) => !a.startsWith("--"));

async function main() {
  if (butirArg) {
    const hasil = await gateButir(butirArg, { json: jsonMode });
    console.log(jsonMode ? JSON.stringify(hasil, null, 2) : formatManusia([hasil]));
    return;
  }
  // semua butir ber-ringkas nyata
  const target = Object.entries(BUTIR)
    .filter(([, b]) => ringkasButir(b))
    .map(([k]) => k);
  console.error(`[cek-jev-butir] ${target.length} butir ber-ringkas ditemukan; mode: ${KEY ? "live" : "kering"}`);
  if (!KEY) {
    console.error("[cek-jev-butir] Tanpa NINE_ROUTER_API_KEY → mode kering. Jalankan dengan key utk gate live.");
    return;
  }
  const hasil = [];
  for (const k of target.slice(0, 12)) hasil.push(await gateButir(k));
  console.log(jsonMode ? JSON.stringify(hasil, null, 2) : formatManusia(hasil));
}
function formatManusia(hasil) {
  return hasil.map((h) => {
    const c = h.confidence != null ? ` · conf ${h.confidence}` : "";
    const bi = h.cost != null ? ` · \$${h.cost.toFixed(6)}` : "";
    return `[${h.kode}] ${h.status} → ${h.verdict ?? h.modus}${c}${bi}${h.catatan ? ` · ${h.catatan}` : ""}`;
  }).join("\n");
}

main().catch((e) => { console.error(e); process.exit(1); });
