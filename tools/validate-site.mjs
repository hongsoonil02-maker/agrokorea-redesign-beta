import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const files = [
  "index.html",
  "about.html",
  "history.html",
  "products.html",
  "news.html",
  "notices.html",
  "contact.html",
  "privacy.html",
  "terms.html",
  "products/rotagal.html",
  "products/vetacol.html",
  "products/parvogel.html",
  "products/monsmecta.html",
  "products/feed-additives.html",
  "products/compound-feed.html",
  "products/vet-pharma.html",
  "products/sanitation.html",
  "en/index.html",
  "en/about.html",
  "en/history.html",
  "en/products.html",
  "en/news.html",
  "en/notices.html",
  "en/contact.html",
  "en/privacy.html",
  "en/terms.html",
  "en/products/rotagal.html",
  "en/products/vetacol.html",
  "en/products/parvogel.html",
  "en/products/monsmecta.html",
  "en/products/feed-additives.html",
  "en/products/compound-feed.html",
  "en/products/vet-pharma.html",
  "en/products/sanitation.html"
];

let fail = 0;
let passed = 0;

for (const f of files) {
  const html = readFileSync(f, "utf8");
  const checks = [
    [!html.includes("noindex"), `${f}: no noindex`],
    [!html.includes("beta-ribbon") && !html.includes("beta-note"), `${f}: no beta remnants`],
    [html.includes("agrokorea.net"), `${f}: agrokorea.net referenced`],
    [!/hongsoonil02-maker\.github\.io/.test(html), `${f}: no github.io absolute URLs`],
    [html.includes("chatbot.js"), `${f}: chatbot included`],
    [html.includes("apple-touch-icon"), `${f}: apple icon linked`],
    [html.includes("menuOpen"), `${f}: mobile menu included`]
  ];
  const storeUrl = "https://smartstore.naver.com/petschury/profile";
  const storeLinkCount = html.split(`href="${storeUrl}"`).length - 1;
  checks.push([storeLinkCount >= 2, `${f}: smart store linked in desktop and mobile navigation`]);
  const jsonld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (jsonld) {
    try { JSON.parse(jsonld[1]); checks.push([true, `${f}: JSON-LD valid`]); }
    catch (e) { checks.push([false, `${f}: JSON-LD BROKEN ${e.message}`]); }
  }
  for (const [ok, label] of checks) {
    if (!ok) {
      fail++;
      console.log("FAIL:", label);
    } else {
      passed++;
    }
  }
}

console.log("\nHTML checks complete.");

// Product data, card and local image integrity
const productContext = { window: {} };
new Function("window", readFileSync("js/product-data.js", "utf8"))(productContext.window);
const products = productContext.window.PRODUCT_DATA;
const productByUid = new Map();
const cardUids = new Set();
let productCardCount = 0;

function productCheck(ok, label) {
  if (ok) passed++;
  else { fail++; console.log("FAIL:", label); }
}

for (const product of products) {
  productCheck(!productByUid.has(String(product.uid)), `product-data.js: duplicate UID ${product.uid}`);
  productByUid.set(String(product.uid), product);
  productCheck(!/^https?:\/\//.test(product.image), `UID ${product.uid}: image is local`);
  productCheck(existsSync(product.image.replace(/^\/+/, "")), `UID ${product.uid}: image exists`);
}

for (const file of [
  "products/feed-additives.html", "products/compound-feed.html",
  "products/vet-pharma.html", "products/sanitation.html",
  "en/products/feed-additives.html", "en/products/compound-feed.html",
  "en/products/vet-pharma.html", "en/products/sanitation.html"
]) {
  const html = readFileSync(file, "utf8");
  const pageUids = new Set();
  productCheck(html.includes("product-data.js"), `${file}: product data loaded`);
  for (const match of html.matchAll(/<a class="prod-card"[^>]*data-uid="([^"]+)"/g)) {
    const uid = match[1];
    productCardCount++;
    productCheck(!pageUids.has(uid), `${file}: UID ${uid} appears once`);
    productCheck(productByUid.has(uid), `${file}: UID ${uid} has data`);
    pageUids.add(uid);
    cardUids.add(uid);
  }
  for (const match of html.matchAll(/<img class="prod-img" src="([^"]+)"/g)) {
    productCheck(existsSync(resolve(dirname(file), match[1])), `${file}: card image exists (${match[1]})`);
  }
}
for (const uid of productByUid.keys()) {
  productCheck(cardUids.has(uid), `UID ${uid}: product card exists`);
}
console.log(`Product validation complete: ${products.length} records, ${productCardCount} localized cards.`);
console.log(`\nValidation complete: ${passed} checks passed, ${fail} failures.`);

// chatbot reply sanity
const { localReply } = await import("../js/chatbot.js").catch(() => ({ localReply: null }));
console.log(localReply ? "note: chatbot module imported" : "chatbot is IIFE-only (expected, browser runtime)");
process.exit(fail ? 1 : 0);
