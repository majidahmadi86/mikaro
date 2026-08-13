/* The framed screenshots ship at 1600w but never render wider than ~1040 CSS px,
   and on a phone they render at ~350. That is up to 4x more pixels than the
   device needs · bytes and decode time both land on the main thread.
   This makes an 800w companion for every desktop shot and wires srcset/sizes
   into the showcase pages so a phone downloads the small one.
   Usage: node scripts/responsive-proof.mjs */
import sharp from 'sharp';
import { readFile, writeFile, readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const proof = join(root, 'assets', 'img', 'proof');

const files = (await readdir(proof)).filter(f => /^(th|pw)-.*\.webp$/.test(f) && !/-800\.webp$/.test(f));

const made = {};
for (const f of files) {
  const src = join(proof, f);
  const meta = await sharp(src).metadata();
  if (meta.width <= 900) { console.log('skip (already small)', f, meta.width); continue; }
  const dest = f.replace(/\.webp$/, '-800.webp');
  let q = 80, buf;
  do {
    buf = await sharp(src).resize({ width: 800 }).webp({ quality: q }).toBuffer();
    q -= 6;
  } while (buf.length > 60 * 1024 && q > 40);
  await sharp(buf).toFile(join(proof, dest));
  const m = await sharp(buf).metadata();
  made[f] = { dest, w: m.width, h: m.height, kb: Math.round(buf.length / 1024) };
  console.log(dest, m.width + 'x' + m.height, made[f].kb + 'KB');
}

/* how wide each frame actually renders · matches css/showcase.css */
const SIZES = [
  ['class="sc-pair', '(max-width:820px) 92vw, 540px'],
  ['class="sc-shot wide', '(max-width:1140px) 92vw, 1040px'],
  ['class="sc-shot ', '(max-width:980px) 92vw, 880px'],
  ['class="sc-worlds', '(max-width:820px) 92vw, 500px'],
  ['class="sc-phones', '(max-width:600px) 46vw, 300px'],
  ['class="sc-phone ', '(max-width:400px) 84vw, 330px']
];
const hintFor = (html, at) => {
  let best = -1, hint = '(max-width:1140px) 92vw, 1040px';
  for (const [marker, s] of SIZES) {
    const i = html.lastIndexOf(marker, at);
    if (i > best) { best = i; hint = s; }
  }
  return hint;
};

for (const page of ['teakhouse.html', 'praow.html', 'th/teakhouse.html', 'th/praow.html']) {
  const p = join(root, page);
  const html = await readFile(p, 'utf8');
  let n = 0;
  const out = html.replace(/<img src="\/assets\/img\/proof\/([a-z0-9-]+\.webp)"([^>]*?)>/g, (m, file, rest, offset) => {
    const info = made[file];
    if (!info) return m;
    rest = rest.replace(/\s+srcset="[^"]*"/, '').replace(/\s+sizes="[^"]*"/, '');
    n++;
    return `<img src="/assets/img/proof/${file}" srcset="/assets/img/proof/${info.dest} 800w, /assets/img/proof/${file} 1600w"`
      + ` sizes="${hintFor(html, offset)}"${rest}>`;
  });
  await writeFile(p, out);
  console.log(page, '->', n, 'images given a srcset');
}
