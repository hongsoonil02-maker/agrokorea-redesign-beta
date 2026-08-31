import { writeFileSync } from "node:fs";

function parseDetail(html) {
  const result = {};
  const imgM = html.match(/<img[^>]+src="(https:\/\/www\.agrokorea\.kr\/\/upload\/product\/[^"]+)"[^>]*>\s*\n\s*<h3/);
  result.image = imgM ? imgM[1] : "";
  const nameM = html.match(/<h3 class="product-name">\s*([^<]+)\s*<\/h3>/);
  result.name = nameM ? nameM[1].trim() : "";
  const fields = ["제품설명","주요성분 및 함량","대상축종","용법 및 용량","포장단위","제품유효기간","제조사 및 원산지"];
  const jsFields = ["description","ingredients","targetLivestock","usage","packaging","shelfLife","manufacturer"];
  const liRegex = /<li>\s*<b>([^<]+)<\/b>\s*([\s\S]*?)\s*<\/li>/g;
  let m;
  while ((m = liRegex.exec(html)) !== null) {
    const label = m[1].trim();
    let value = m[2].replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
    const idx = fields.indexOf(label);
    if (idx >= 0) result[jsFields[idx]] = value;
  }
  return result;
}

async function main() {
  const products = [];
  const uids = [17,18,19,20,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,131,132,133,134,135,136];
  const catByUid = {};
  [17,18,19,20,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,131,132,133,134,135,136].forEach(u => catByUid[u] = "cat4");
  [56,57,58,59,60,61,62,63,64,65,66,67].forEach(u => catByUid[u] = "cat5");

  for (const uid of uids) {
    try {
      const res = await fetch(`https://www.agrokorea.kr/kor/products/feed.html?bmain=view&uid=${uid}`, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
      });
      const text = await res.text();
      const data = parseDetail(text);
      data.uid = uid;
      data.cat = catByUid[uid] || "cat4";
      products.push(data);
      console.log(`✓ uid=${uid} ${data.name}`);
      await new Promise(r => setTimeout(r, 150));
    } catch (e) {
      console.error(`✗ uid=${uid}: ${e.message}`);
    }
  }

  function esc(s) { return String(s).replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n"); }
  const items = products.map(p => {
    let obj = `  {"uid":${p.uid},"name":"${esc(p.name)}","cat":"${p.cat}","image":"${p.image}"`;
    ["description","ingredients","targetLivestock","usage","packaging","shelfLife","manufacturer"].forEach(f => {
      obj += `,"${f}":"${esc(p[f] || "")}"`;
    });
    return obj + "}";
  });
  writeFileSync("js/product-data.js", "window.PRODUCT_DATA = [\n" + items.join(",\n") + "\n];\n", "utf8");
  console.log(`\n✓ Wrote ${products.length} products to js/product-data.js`);
}

main().catch(e => { console.error(e); process.exit(1); });
