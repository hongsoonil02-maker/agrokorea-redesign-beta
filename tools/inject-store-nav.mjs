import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

const krBtn = `      <a class="btn-store-nav" href="https://smartstore.naver.com/petschury/profile" target="_blank" rel="noopener" aria-label="한국아그로 공식 네이버 스마트스토어 바로가기">
        <span class="n-logo">N</span><span class="store-text">스마트스토어</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg>
      </a>`;

const enBtn = `      <a class="btn-store-nav" href="https://smartstore.naver.com/petschury/profile" target="_blank" rel="noopener" aria-label="Official Naver SmartStore">
        <span class="n-logo">N</span><span class="store-text">SmartStore</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg>
      </a>`;

const krMobile = `  <div class="mobile-store-box">
    <a class="mobile-store-link" href="https://smartstore.naver.com/petschury/profile" target="_blank" rel="noopener">
      <span class="n-logo">N</span>
      <div class="ms-txt">
        <strong>공식 네이버 스마트스토어</strong>
        <span>한국아그로 공식 온라인몰 바로가기</span>
      </div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M7 7h10v10"/></svg>
    </a>
  </div>`;

const enMobile = `  <div class="mobile-store-box">
    <a class="mobile-store-link" href="https://smartstore.naver.com/petschury/profile" target="_blank" rel="noopener">
      <span class="n-logo">N</span>
      <div class="ms-txt">
        <strong>Official SmartStore</strong>
        <span>Visit Korea Agro Online Shop</span>
      </div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M7 7h10v10"/></svg>
    </a>
  </div>`;

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === 'assets') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getHtmlFiles(ROOT);
console.log(`Found ${files.length} HTML files.`);

let updatedCount = 0;

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf8');
  const isEn = filePath.includes(path.sep + 'en' + path.sep) || filePath.endsWith(path.sep + 'en');
  let changed = false;

  // 1. Check btn-store-nav
  if (!content.includes('btn-store-nav')) {
    const navLangRegex = /(<div class="nav-lang">[\s\S]*?<\/div>)/;
    if (navLangRegex.test(content)) {
      const btn = isEn ? enBtn : krBtn;
      content = content.replace(navLangRegex, `$1\n${btn}`);
      changed = true;
    } else {
      console.warn(`Could not find .nav-lang in ${filePath}`);
    }
  }

  // 2. Check mobile-store-box
  if (!content.includes('mobile-store-box')) {
    const mobileHeadRegex = /(<div class="mobile-menu-head">[\s\S]*?<\/div>)/;
    if (mobileHeadRegex.test(content)) {
      const mob = isEn ? enMobile : krMobile;
      content = content.replace(mobileHeadRegex, `$1\n${mob}`);
      changed = true;
    } else {
      console.warn(`Could not find .mobile-menu-head in ${filePath}`);
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
    console.log(`Updated: ${path.relative(ROOT, filePath)}`);
  }
}

console.log(`Finished. Updated ${updatedCount} files.`);
