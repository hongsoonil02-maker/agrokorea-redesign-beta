import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";

const rootDir = process.cwd();

function getHtmlFiles(dir) {
  let results = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    if (entry === "node_modules" || entry === ".git" || entry === "tools") continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getHtmlFiles(full));
    } else if (entry.endsWith(".html")) {
      results.push(full);
    }
  }
  return results;
}

const htmlFiles = getHtmlFiles(rootDir);
console.log(`Found ${htmlFiles.length} HTML files to audit:`);
htmlFiles.forEach(f => console.log(" - " + f.replace(rootDir, "").replace(/^[\\\/]/, "")));

let totalErrors = 0;
let totalWarnings = 0;

for (const filePath of htmlFiles) {
  const relPath = filePath.replace(rootDir, "").replace(/^[\\\/]/, "").replace(/\\/g, "/");
  const html = readFileSync(filePath, "utf8");
  const fileDir = dirname(filePath);

  console.log(`\n=== Auditing: ${relPath} ===`);

  // 1. Basic checks
  if (html.includes("noindex")) {
    console.warn(`[WARN] ${relPath} contains "noindex"`);
    totalWarnings++;
  }
  if (html.includes("beta-ribbon") || html.includes("beta-note")) {
    console.warn(`[WARN] ${relPath} still contains beta-ribbon or beta-note`);
    totalWarnings++;
  }
  if (html.includes("hongsoonil02-maker.github.io")) {
    console.error(`[ERROR] ${relPath} contains github.io URL`);
    totalErrors++;
  }

  // 2. Check all href links
  const hrefMatches = [...html.matchAll(/href="([^"#][^"]*)"/g)];
  for (const match of hrefMatches) {
    const url = match[1];
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("data:")) {
      continue;
    }
    const cleanUrl = url.split("?")[0].split("#")[0];
    if (!cleanUrl) continue;
    
    let targetPath;
    if (cleanUrl.startsWith("/")) {
      targetPath = join(rootDir, cleanUrl);
    } else {
      targetPath = resolve(fileDir, cleanUrl);
    }

    if (!existsSync(targetPath)) {
      console.error(`[ERROR] ${relPath}: Broken href -> "${url}" (Resolved: ${targetPath})`);
      totalErrors++;
    }
  }

  // 3. Check all src links
  const srcMatches = [...html.matchAll(/src="([^"]+)"/g)];
  for (const match of srcMatches) {
    const url = match[1];
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
      continue;
    }
    const cleanUrl = url.split("?")[0].split("#")[0];
    if (!cleanUrl) continue;

    let targetPath;
    if (cleanUrl.startsWith("/")) {
      targetPath = join(rootDir, cleanUrl);
    } else {
      targetPath = resolve(fileDir, cleanUrl);
    }

    if (!existsSync(targetPath)) {
      console.error(`[ERROR] ${relPath}: Broken src -> "${url}" (Resolved: ${targetPath})`);
      totalErrors++;
    }
  }

  // 4. Check CSS & JS references
  if (!html.includes("style.css")) {
    console.error(`[ERROR] ${relPath} is missing style.css`);
    totalErrors++;
  }
  if (!html.includes("main.js")) {
    console.warn(`[WARN] ${relPath} is missing main.js`);
    totalWarnings++;
  }
}

console.log(`\n================================`);
console.log(`Audit Finished: ${totalErrors} Errors, ${totalWarnings} Warnings`);
