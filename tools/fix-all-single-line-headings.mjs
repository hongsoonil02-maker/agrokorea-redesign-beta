import fs from 'fs';
import path from 'path';

function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Remove <br /> in page titles and section headings
  content = content.replace(/<h1 id="pageTitle"([^>]*)>([^<]*)<br\s*\/?>([^<]*)<\/h1>/g, '<h1 id="pageTitle"$1>$2 $3</h1>');
  content = content.replace(/<h2 id="ceoTitle"([^>]*)>([^<]*)<br\s*\/?>([^<]*)<\/h2>/g, '<h2 id="ceoTitle"$1>$2 $3</h2>');
  content = content.replace(/<h2 id="newsTitle"([^>]*)>([^<]*)<br\s*\/?>([^<]*)<\/h2>/g, '<h2 id="newsTitle"$1>$2 $3</h2>');

  // Clean double spaces
  content = content.replace(/\s{2,}/g, ' ');

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Processed headings in ${file}`);
}

const files = [
  'about.html',
  'en/about.html',
  'history.html',
  'en/history.html',
  'news.html',
  'en/news.html',
  'contact.html',
  'en/contact.html',
  'products.html',
  'en/products.html'
];

files.forEach(f => {
  if (fs.existsSync(f)) processFile(f);
});

console.log('Finished updating single-line headings across subpages');
