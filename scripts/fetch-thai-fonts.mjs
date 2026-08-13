/* Self-host the Thai subsets of Prompt and Sarabun.
   The showcase pages are perf-gated, and the Google Fonts stylesheet costs ~2.5s
   of first paint on Thai text: it arrives late, then applies as a fresh
   stylesheet and re-shapes the whole document. Pulling just the Thai subsets
   local removes the third-party round trip entirely. Latin glyphs are left out
   on purpose · they fall through to Gabarito / Figtree, which is the brand face.
   Both families are OFL. Re-run only if the upstream files change.
   Usage: node scripts/fetch-thai-fonts.mjs */
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'assets', 'fonts');
await mkdir(outDir, { recursive: true });

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const CSS = 'https://fonts.googleapis.com/css2?family=Prompt:wght@700;900&family=Sarabun:wght@400;600;700&display=swap';

const css = await (await fetch(CSS, { headers: { 'user-agent': UA } })).text();

// walk the @font-face blocks and keep only the Thai unicode-range ones
const blocks = css.split('@font-face').slice(1);
const wanted = [];
for (const b of blocks) {
  if (!/U\+0E01-0E5B/.test(b)) continue;
  const fam = /font-family:\s*'([^']+)'/.exec(b)[1];
  const wt = /font-weight:\s*(\d+)/.exec(b)[1];
  const url = /src:\s*url\(([^)]+)\)/.exec(b)[1];
  const range = /unicode-range:\s*([^;]+);/.exec(b)[1].trim();
  wanted.push({ fam, wt, url, range, file: `${fam.toLowerCase()}-thai-${wt}.woff2` });
}
if (!wanted.length) throw new Error('no Thai subsets found in the Google CSS');

for (const w of wanted) {
  const buf = Buffer.from(await (await fetch(w.url, { headers: { 'user-agent': UA } })).arrayBuffer());
  await writeFile(join(outDir, w.file), buf);
  console.log(w.file, Math.round(buf.length / 1024) + 'KB', '<-', w.url);
}

const out = wanted.map(w => `@font-face{font-family:'${w.fam}';font-style:normal;font-weight:${w.wt};font-display:swap;`
  + `src:url('/assets/fonts/${w.file}') format('woff2');unicode-range:${w.range}}`).join('\n');
console.log('\n--- paste into css/showcase.css ---\n' + out);
await writeFile(join(root, '.shots', 'thai-fontface.css'), out).catch(() => {});
