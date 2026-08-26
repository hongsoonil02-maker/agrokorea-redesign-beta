import { readFileSync } from "node:fs";

const files = [
  "index.html",
  "about.html",
  "history.html",
  "products.html",
  "news.html",
  "contact.html",
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
  "en/contact.html",
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

console.log(`\nValidation complete: ${passed} checks passed, ${fail} failures.`);

// chatbot reply sanity
const { localReply } = await import("../js/chatbot.js").catch(() => ({ localReply: null }));
console.log(localReply ? "note: chatbot module imported" : "chatbot is IIFE-only (expected, browser runtime)");
process.exit(fail ? 1 : 0);
