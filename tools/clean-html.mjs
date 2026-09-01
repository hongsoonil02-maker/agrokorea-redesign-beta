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

cleanAllDir('.');
console.log('Complete cleanup done.');
