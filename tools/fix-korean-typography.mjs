import fs from 'fs';
import path from 'path';

function processKoreanHtml(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== '.git' && entry.name !== 'node_modules' && entry.name !== 'en') {
      processKoreanHtml(full);
    } else if (entry.isFile() && entry.name.endsWith('.html') && !full.includes(`${path.sep}en${path.sep}`)) {
      let content = fs.readFileSync(full, 'utf8');

      // 1. Ensure (주)한국아그로 never splits
      // Replace raw ㈜한국아그로 or (주)한국아그로 inside paragraphs/headings with nowrap if not already wrapped
      content = content.replace(/(?<!<span class="nowrap">)(?:㈜|\(주\))한국아그로/g, '<span class="nowrap">㈜한국아그로</span>');

      // Specifically in index.html hero-sub:
      if (full.endsWith('index.html')) {
        content = content.replace(
          '<p class="hero-sub reveal" data-delay="2">사람과 동물이 함께 건강한 미래를 만들어가는 ㈜한국아그로입니다.',
          '<p class="hero-sub reveal" data-delay="2">사람과 동물이 함께 건강한 미래를 만들어가는 <span class="nowrap">㈜한국아그로</span>입니다.'
        );
      }

      fs.writeFileSync(full, content, 'utf8');
      console.log(`Updated Korean typography in ${full}`);
    }
  }
}

processKoreanHtml('.');
console.log('Finished Korean typography enhancements');
