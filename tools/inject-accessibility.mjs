import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

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
console.log(`Found ${files.length} HTML files to update accessibility.`);

let updatedCount = 0;

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(ROOT, filePath);
  const isEn = relPath.startsWith('en' + path.sep);
  
  // Calculate relative depth for script src
  const depth = relPath.split(path.sep).length - 1;
  let scriptPrefix = '';
  if (depth === 1) scriptPrefix = '../';
  else if (depth === 2) scriptPrefix = '../../';

  let changed = false;

  // 1. Inject accessibility script before </body>
  const scriptTag = `<script src="${scriptPrefix}js/accessibility.js"></script>`;
  if (!content.includes('accessibility.js')) {
    content = content.replace('</body>', `${scriptTag}\n</body>`);
    changed = true;
  }

  // 2. Inject policy button into .footer-bottom
  if (!content.includes('btn-a11y-policy')) {
    const policyBtnText = isEn ? 'Accessibility Policy' : '웹 접근성 정책';
    const policyBtnHtml = `<button type="button" class="btn-a11y-policy">${policyBtnText}</button>`;

    // If there is <nav aria-label="법적 고지"> or <nav aria-label="Legal">, append inside nav
    if (content.includes('</nav>\n    </div>\n  </div>\n</footer>')) {
      content = content.replace(
        /(<nav aria-label="[^"]*">[\s\S]*?)(<\/nav>\s*<\/div>\s*<\/div>\s*<\/footer>)/,
        `$1  ${policyBtnHtml}\n      $2`
      );
      changed = true;
    } else if (content.includes('<div class="footer-bottom">')) {
      content = content.replace(
        /(<div class="footer-bottom">\s*<p>[\s\S]*?<\/p>)/,
        `$1\n      ${policyBtnHtml}`
      );
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
    console.log(`Updated accessibility in: ${relPath}`);
  }
}

console.log(`Finished. Updated ${updatedCount} files with Web Accessibility Suite.`);
