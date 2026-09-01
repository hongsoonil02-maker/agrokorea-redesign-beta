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
      
      const depth = full.split(path.sep).length - 1;
      let scriptPath = 'js/multilingual.js';
      if (depth === 1) scriptPath = '../js/multilingual.js';
      if (depth === 2) scriptPath = '../../js/multilingual.js';
      
      if (!content.includes('multilingual.js')) {
        content = content.replace('</body>', `  <script src="${scriptPath}"></script>\n</body>`);
        fs.writeFileSync(full, content, 'utf8');
        console.log(`Injected into ${full}`);
      }
    }
  }
}

processDir('.');
console.log('Finished injecting multilingual script');
