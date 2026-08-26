#!/usr/bin/env node
/**
 * Ecount ERP inventory sync (local tool — NOT part of the public website).
 *
 * Flow: Zone lookup -> OAPILogin -> GetListInventoryBalanceStatus
 * Writes tools/ecount/out/inventory.json for inspection.
 *
 * Usage:
 *   node tools/ecount/ecount-sync.mjs [YYYYMMDD]
 *
 * NOTE: GetListInventoryBalanceStatus is rate-limited (about once per 10 min).
 * Single-product View calls allow 1/sec.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

// --- env ---
for (const line of readFileSync(join(root, ".env"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
}
const COM_CODE = process.env.COM_CODE;
const USER_ID = process.env.USER_ID;
const CERT_KEY = process.env.API_CERT_KEY;
const LAN = process.env.LAN_TYPE || "ko-KR";
if (!COM_CODE || !USER_ID || !CERT_KEY) {
  console.error("Missing COM_CODE / USER_ID / API_CERT_KEY in .env");
  process.exit(1);
}

const OUT_DIR = join(root, "tools", "ecount", "out");
mkdirSync(OUT_DIR, { recursive: true });

async function post(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
    signal: AbortSignal.timeout(20000)
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, json };
}

function die(msg, extra) {
  console.error(`ERROR: ${msg}`);
  if (extra) console.error(JSON.stringify(extra, null, 2));
  process.exit(1);
}

// 1) Zone lookup (prod gateway)
const zoneRes = await post("https://oapi.ecount.com/OAPI/V2/Zone", { COM_CODE });
if (String(zoneRes.json?.Status) !== "200" || !zoneRes.json?.Data?.ZONE) {
  die("Zone lookup failed", zoneRes.json);
}
const ZONE = String(zoneRes.json.Data.ZONE);
const BASE = `https://oapi${ZONE}.ecount.com`;
console.log(`Zone=${ZONE} base=${BASE}`);

// 2) OAPILogin
const loginRes = await post(`${BASE}/OAPI/V2/OAPILogin`, {
  COM_CODE,
  USER_ID,
  API_CERT_KEY: CERT_KEY,
  LAN_TYPE: LAN,
  ZONE
});
const SESSION_ID = loginRes.json?.Data?.Datas?.SESSION_ID;
if (!SESSION_ID) {
  die(
    `Login failed [${loginRes.json?.Data?.Code}] ${loginRes.json?.Data?.Message ?? ""}`,
    loginRes.json
  );
}
console.log("Login OK (SESSION_ID acquired)");
writeFileSync(join(OUT_DIR, "session.json"), JSON.stringify({ BASE, ZONE, at: new Date().toISOString() }, null, 2));

// 3) Inventory balance list (rate-limited: 1 call / 10 min)
const date = (process.argv[2] || new Date().toISOString().slice(0, 10).replace(/-/g, ""));
const invRes = await post(
  `${BASE}/OAPI/V2/InventoryBalance/GetListInventoryBalanceStatus?SESSION_ID=${encodeURIComponent(SESSION_ID)}`,
  { BASE_DATE: date, PROD_CD: "" }
);

const status = String(invRes.json?.Status ?? "");
console.log(`Inventory Status=${status}`);
if (!status.startsWith("2")) {
  // Save error response for diagnosis instead of dying silently
  console.log(JSON.stringify(invRes.json, null, 2).slice(0, 1500));
}
writeFileSync(join(OUT_DIR, "inventory.json"), JSON.stringify(invRes.json, null, 2));

const rows =
  invRes.json?.Data?.Datas ??
  invRes.json?.Data?.Datas?.Datas ??
  null;

if (Array.isArray(rows)) {
  console.log(`Rows: ${rows.length}`);
  console.log("Sample fields:", Object.keys(rows[0] ?? {}).join(", "));
} else {
  console.log("Inspect tools/ecount/out/inventory.json for response shape.");
}
console.log("\nDone. Raw responses saved under tools/ecount/out/ (gitignored).");
