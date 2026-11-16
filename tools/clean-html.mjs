import fs from 'fs';
import path from 'path';

function cleanAllDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== '.git' && entry.name !== 'node_modules') {
      cleanAllDir(full);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      let content = fs.readFileSync(full, 'utf8');

      // Strip any stray span tags or closed span tags around ㈜한국아그로
      content = content.replace(/㈜한국아그로<\/span>/g, '㈜한국아그로');
      content = content.replace(/\(주\)한국아그로<\/span>/g, '(주)한국아그로');
      content = content.replace(/<span class="nowrap">/g, '');
      content = content.replace(/<span class="text-nowrap">/g, '');

      fs.writeFileSync(full, content, 'utf8');
      console.log(`Cleaned stray tags in ${full}`);
    }
  }
}

function cleanProductGrids() {
  const files = [
    'products/feed-additives.html',
    'en/products/feed-additives.html',
    'products/compound-feed.html',
    'en/products/compound-feed.html'
  ];
  const expectedCounts = {
    'products/feed-additives.html': 38,
    'en/products/feed-additives.html': 38,
    'products/compound-feed.html': 12,
    'en/products/compound-feed.html': 12
  };

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const grid = content.match(/(<div class="prod-grid">)([\s\S]*?)\n      <\/div>/);
    if (!grid) throw new Error(`Product grid not found in ${file}`);

    const cards = [...grid[2].matchAll(/<a class="prod-card"[^>]*data-uid="([^"]+)"/g)].map(m => m[1]);
    if (cards.length !== expectedCounts[file] || new Set(cards).size !== cards.length) {
      throw new Error(`Unexpected product cards in ${file}: ${cards.join(', ')}`);
    }

    const remainder = content.slice(grid.index + grid[0].length);
    const sectionEnd = /\r?\n    <\/div>\r?\n  <\/section>/.exec(remainder);
    if (!sectionEnd) throw new Error(`Product section end not found in ${file}`);
    const containerEnd = grid.index + grid[0].length + sectionEnd.index;
    const cleaned = content.slice(0, grid.index) + grid[0] + content.slice(containerEnd);
    fs.writeFileSync(file, cleaned, 'utf8');
    console.log(`Removed duplicate product cards in ${file}`);
  }
}

if (process.argv.includes('--product-grids')) {
  cleanProductGrids();
} else {
  cleanAllDir('.');
  console.log('Complete cleanup done.');
}
