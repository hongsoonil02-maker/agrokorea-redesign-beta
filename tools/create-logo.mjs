import sharp from 'sharp';
import fs from 'fs';

async function makeLogos() {
  // Read Korean logo metadata to match exact canvas height & layout
  const krMeta = await sharp('assets/img/logo.png').metadata();
  console.log('Target canvas:', krMeta.width, 'x', krMeta.height);

  // Extract green leaf emblem from footer-logo.png
  // The green leaf in logo.png has height ~93px inside 152px canvas (or vertically centered)
  const symbol = await sharp('assets/img/footer-logo.png')
    .resize({ height: 96 })
    .toBuffer();

  const symMeta = await sharp(symbol).metadata();

  const width = krMeta.width;   // 704
  const height = krMeta.height; // 152

  // Symbol left margin and text position matching Korean logo
  const symLeft = 6;
  const symTop = Math.round((height - symMeta.height) / 2);
  const textX = symLeft + symMeta.width + 18;

  // Use crisp typography for "Agrokorea"
  const svgText = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .logo-text {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          font-weight: 800;
          font-size: 78px;
          fill: #14231b;
          letter-spacing: -1.5px;
        }
      </style>
      <text x="${textX}" y="104" class="logo-text">Agrokorea</text>
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
    { input: symbol, top: symTop, left: symLeft },
    { input: svgText, top: 0, left: 0 }
  ])
  .png()
  .toFile('assets/img/logo-en.png');

  console.log('Successfully generated assets/img/logo-en.png matching exact dimensions (704x152)');
}

makeLogos();
