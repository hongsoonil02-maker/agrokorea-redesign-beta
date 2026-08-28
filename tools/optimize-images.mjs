// One-off image re-compression for oversized JPG/PNG assets.
// Keeps same filename/format so no HTML changes are needed.
// Backs up originals to assets/img/_orig-backup/ before overwriting,
// and never overwrites an existing backup, so re-running is safe and
// cannot re-compress an already-optimized file on top of its original.
//
// Usage:
//   node tools/optimize-images.mjs            optimize oversized images
//   node tools/optimize-images.mjs --restore  restore originals from backup
import sharp from "sharp";
import { promises as fs } from "node:fs";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "assets", "img");
const BACKUP = path.join(ROOT, "_orig-backup");
const THRESHOLD = 500 * 1024; // only touch files over 500 KB
const MAX_W = 1600;           // no displayed image needs more than this
const JPG_Q = 78;
const PNG_Q = 82;

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "_orig-backup") continue;
      out.push(...(await walk(full)));
    } else if (/\.(jpe?g|png)$/i.test(e.name)) {
      out.push(full);
    }
  }
  return out;
}

function rel(p) {
  return path.relative(process.cwd(), p);
}

async function restore() {
  if (!existsSync(BACKUP)) {
    console.error(`No backup directory found at ${rel(BACKUP)}. Nothing to restore.`);
    process.exit(1);
  }
  const backups = await walk(BACKUP);
  let restored = 0;
  for (const b of backups) {
    const target = path.join(ROOT, path.relative(BACKUP, b));
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(b, target);
    restored++;
    console.log(`restore ${rel(target)}`);
  }
  console.log(`\nDone. ${restored} originals restored from ${rel(BACKUP)}.`);
}

async function optimize() {
  const files = await walk(ROOT);
  let saved = 0, count = 0, skippedBackup = 0;
  for (const file of files) {
    const stat = await fs.stat(file);
    if (stat.size <= THRESHOLD) continue;

    const backupPath = path.join(BACKUP, path.relative(ROOT, file));
    // Never re-process a file that already has a backup: the current file
    // may already be an optimized (lossy) version, and re-compressing would
    // degrade it further and risk overwriting the pristine original.
    if (existsSync(backupPath)) {
      console.log(`skip  ${rel(file)} (backup exists; already processed)`);
      skippedBackup++;
      continue;
    }

    const isPng = /\.png$/i.test(file);
    const input = await fs.readFile(file);
    const img = sharp(input, { failOn: "none" });
    const meta = await img.metadata();
    let pipeline = img.rotate();
    if (meta.width && meta.width > MAX_W) {
      pipeline = pipeline.resize({ width: MAX_W, withoutEnlargement: true });
    }
    pipeline = isPng
      ? pipeline.png({ quality: PNG_Q, compressionLevel: 9, palette: true })
      : pipeline.jpeg({ quality: JPG_Q, mozjpeg: true });

    const buf = await pipeline.toBuffer();
    if (buf.length >= stat.size * 0.95) {
      console.log(`skip  ${rel(file)} (${Math.round(stat.size / 1024)}KB, no meaningful gain)`);
      continue;
    }

    await fs.mkdir(path.dirname(backupPath), { recursive: true });
    await fs.copyFile(file, backupPath);
    await fs.writeFile(file, buf);

    const delta = stat.size - buf.length;
    saved += delta;
    count++;
    console.log(
      `opt   ${rel(file)}  ${Math.round(stat.size / 1024)}KB -> ${Math.round(buf.length / 1024)}KB  (-${Math.round(delta / 1024)}KB)`
    );
  }
  console.log(`\nDone. ${count} files optimized, ${Math.round(saved / 1024)}KB saved total.`);
  if (skippedBackup) {
    console.log(`${skippedBackup} file(s) skipped because a backup already exists (re-run safe).`);
  }
  console.log(`Originals backed up in ${rel(BACKUP)}. Restore with: node tools/optimize-images.mjs --restore`);
}

const isRestore = process.argv.slice(2).some((a) => a === "--restore");
(isRestore ? restore() : optimize()).catch((e) => {
  console.error(e);
  process.exit(1);
});
