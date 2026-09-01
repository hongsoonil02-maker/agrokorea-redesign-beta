import fs from 'fs';
import path from 'path';

function processEnDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processEnDir(full);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      let content = fs.readFileSync(full, 'utf8');
      content = content.replace(/assets\/img\/logo\.png/g, 'assets/img/logo-en.png');
      content = content.replace(/alt=\"(㈜)?한국아그로\"/g, 'alt="AGROKOREA"');
      fs.writeFileSync(full, content, 'utf8');
      console.log(`Updated EN logo reference in ${full}`);
    }
  }
}

if (fs.existsSync('en')) {
  processEnDir('en');
}
