import sharp from 'sharp';
import fs from 'fs';

async function makeLogos() {
  // 1. Ensure Korean logo is present at logo.png
  if (fs.existsSync('assets/img/logo-kr-backup.png')) {
    fs.copyFileSync('assets/img/logo-kr-backup.png', 'assets/img/logo.png');
  }

  // 2. Generate Foreign Logo: [Leaf Logo] Agrokorea (Title Case)
  const symbol = await sharp('assets/img/footer-logo.png')
    .resize({ height: 136 })
    .toBuffer();

  const symMeta = await sharp(symbol).metadata();

  const width = 800;
  const height = 152;
  const textX = symMeta.width + 24;

  const svgText = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .logo-text {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          font-weight: 800;
          font-size: 86px;
          fill: #14231b;
          letter-spacing: -2px;
        }
      </style>
      <text x="${textX}" y="106" class="logo-text">Agrokorea</text>
    </svg>
  `);

  await sharp({
    create: {
      width: width,
      height: height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([
    { input: symbol, top: Math.round((height - symMeta.height) / 2), left: 0 },
    { input: svgText, top: 0, left: 0 }
  ])
  .png()
  .toFile('assets/img/logo-en.png');

  console.log('Successfully generated assets/img/logo-en.png with Agrokorea (Title Case)');
}

makeLogos();
