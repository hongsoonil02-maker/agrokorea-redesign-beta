const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const urls = [
  // Home
  { loc: 'https://www.agrokorea.net/', priority: '1.0', changefreq: 'weekly', ko: 'https://www.agrokorea.net/', en: 'https://www.agrokorea.net/en/' },
  { loc: 'https://www.agrokorea.net/en/', priority: '0.9', changefreq: 'weekly', ko: 'https://www.agrokorea.net/', en: 'https://www.agrokorea.net/en/' },

  // KR Main Pages
  { loc: 'https://www.agrokorea.net/about.html', priority: '0.8', changefreq: 'monthly', ko: 'https://www.agrokorea.net/about.html', en: 'https://www.agrokorea.net/en/about.html' },
  { loc: 'https://www.agrokorea.net/history.html', priority: '0.8', changefreq: 'monthly', ko: 'https://www.agrokorea.net/history.html', en: 'https://www.agrokorea.net/en/history.html' },
  { loc: 'https://www.agrokorea.net/products.html', priority: '0.9', changefreq: 'weekly', ko: 'https://www.agrokorea.net/products.html', en: 'https://www.agrokorea.net/en/products.html' },
  { loc: 'https://www.agrokorea.net/news.html', priority: '0.8', changefreq: 'weekly', ko: 'https://www.agrokorea.net/news.html', en: 'https://www.agrokorea.net/en/news.html' },
  { loc: 'https://www.agrokorea.net/contact.html', priority: '0.8', changefreq: 'monthly', ko: 'https://www.agrokorea.net/contact.html', en: 'https://www.agrokorea.net/en/contact.html' },

  // EN Main Pages
  { loc: 'https://www.agrokorea.net/en/about.html', priority: '0.8', changefreq: 'monthly', ko: 'https://www.agrokorea.net/about.html', en: 'https://www.agrokorea.net/en/about.html' },
  { loc: 'https://www.agrokorea.net/en/history.html', priority: '0.8', changefreq: 'monthly', ko: 'https://www.agrokorea.net/history.html', en: 'https://www.agrokorea.net/en/history.html' },
  { loc: 'https://www.agrokorea.net/en/products.html', priority: '0.9', changefreq: 'weekly', ko: 'https://www.agrokorea.net/products.html', en: 'https://www.agrokorea.net/en/products.html' },
  { loc: 'https://www.agrokorea.net/en/news.html', priority: '0.8', changefreq: 'weekly', ko: 'https://www.agrokorea.net/news.html', en: 'https://www.agrokorea.net/en/news.html' },
  { loc: 'https://www.agrokorea.net/en/contact.html', priority: '0.8', changefreq: 'monthly', ko: 'https://www.agrokorea.net/contact.html', en: 'https://www.agrokorea.net/en/contact.html' },

  // KR Flagship
  { loc: 'https://www.agrokorea.net/products/rotagal.html', priority: '0.9', changefreq: 'weekly', ko: 'https://www.agrokorea.net/products/rotagal.html', en: 'https://www.agrokorea.net/en/products/rotagal.html' },
  { loc: 'https://www.agrokorea.net/products/vetacol.html', priority: '0.9', changefreq: 'weekly', ko: 'https://www.agrokorea.net/products/vetacol.html', en: 'https://www.agrokorea.net/en/products/vetacol.html' },
  { loc: 'https://www.agrokorea.net/products/parvogel.html', priority: '0.9', changefreq: 'weekly', ko: 'https://www.agrokorea.net/products/parvogel.html', en: 'https://www.agrokorea.net/en/products/parvogel.html' },
  { loc: 'https://www.agrokorea.net/products/monsmecta.html', priority: '0.9', changefreq: 'weekly', ko: 'https://www.agrokorea.net/products/monsmecta.html', en: 'https://www.agrokorea.net/en/products/monsmecta.html' },

  // EN Flagship
  { loc: 'https://www.agrokorea.net/en/products/rotagal.html', priority: '0.9', changefreq: 'weekly', ko: 'https://www.agrokorea.net/products/rotagal.html', en: 'https://www.agrokorea.net/en/products/rotagal.html' },
  { loc: 'https://www.agrokorea.net/en/products/vetacol.html', priority: '0.9', changefreq: 'weekly', ko: 'https://www.agrokorea.net/products/vetacol.html', en: 'https://www.agrokorea.net/en/products/vetacol.html' },
  { loc: 'https://www.agrokorea.net/en/products/parvogel.html', priority: '0.9', changefreq: 'weekly', ko: 'https://www.agrokorea.net/products/parvogel.html', en: 'https://www.agrokorea.net/en/products/parvogel.html' },
  { loc: 'https://www.agrokorea.net/en/products/monsmecta.html', priority: '0.9', changefreq: 'weekly', ko: 'https://www.agrokorea.net/products/monsmecta.html', en: 'https://www.agrokorea.net/en/products/monsmecta.html' },

  // KR Categories
  { loc: 'https://www.agrokorea.net/products/feed-additives.html', priority: '0.8', changefreq: 'monthly', ko: 'https://www.agrokorea.net/products/feed-additives.html', en: 'https://www.agrokorea.net/en/products/feed-additives.html' },
  { loc: 'https://www.agrokorea.net/products/compound-feed.html', priority: '0.8', changefreq: 'monthly', ko: 'https://www.agrokorea.net/products/compound-feed.html', en: 'https://www.agrokorea.net/en/products/compound-feed.html' },
  { loc: 'https://www.agrokorea.net/products/vet-pharma.html', priority: '0.8', changefreq: 'monthly', ko: 'https://www.agrokorea.net/products/vet-pharma.html', en: 'https://www.agrokorea.net/en/products/vet-pharma.html' },
  { loc: 'https://www.agrokorea.net/products/sanitation.html', priority: '0.8', changefreq: 'monthly', ko: 'https://www.agrokorea.net/products/sanitation.html', en: 'https://www.agrokorea.net/en/products/sanitation.html' },

  // EN Categories
  { loc: 'https://www.agrokorea.net/en/products/feed-additives.html', priority: '0.8', changefreq: 'monthly', ko: 'https://www.agrokorea.net/products/feed-additives.html', en: 'https://www.agrokorea.net/en/products/feed-additives.html' },
  { loc: 'https://www.agrokorea.net/en/products/compound-feed.html', priority: '0.8', changefreq: 'monthly', ko: 'https://www.agrokorea.net/products/compound-feed.html', en: 'https://www.agrokorea.net/en/products/compound-feed.html' },
  { loc: 'https://www.agrokorea.net/en/products/vet-pharma.html', priority: '0.8', changefreq: 'monthly', ko: 'https://www.agrokorea.net/products/vet-pharma.html', en: 'https://www.agrokorea.net/en/products/vet-pharma.html' },
  { loc: 'https://www.agrokorea.net/en/products/sanitation.html', priority: '0.8', changefreq: 'monthly', ko: 'https://www.agrokorea.net/products/sanitation.html', en: 'https://www.agrokorea.net/en/products/sanitation.html' }
];

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

for (const u of urls) {
  xml += '  <url>\n';
  xml += `    <loc>${u.loc}</loc>\n`;
  xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
  xml += `    <priority>${u.priority}</priority>\n`;
  if (u.ko && u.en) {
    xml += `    <xhtml:link rel="alternate" hreflang="ko" href="${u.ko}" />\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${u.en}" />\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${u.en}" />\n`;
  }
  xml += '  </url>\n';
}

xml += '</urlset>\n';

fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), xml, 'utf8');
console.log(`Generated sitemap.xml with ${urls.length} URLs.`);
