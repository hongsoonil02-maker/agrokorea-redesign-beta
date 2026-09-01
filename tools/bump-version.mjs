import fs from 'fs';
import path from 'path';

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== '.git' && entry.name !== 'node_modules') {
      processDir(full);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      let content = fs.readFileSync(full, 'utf8');
      if (content.includes('style.css?v=')) {
        content = content.replace(/style\.css\?v=[0-9_]+/g, 'style.css?v=20260901_16');
      }
      fs.writeFileSync(full, content, 'utf8');
    }
  }
}

processDir('.');
console.log('Bumped CSS version tag to 20260901_16');
