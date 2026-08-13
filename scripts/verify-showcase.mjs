/* Gate check for the showcase pages.
   Serves the repo locally with Vercel-style cleanUrls, then for every page at
   every gate width asserts: no horizontal scroll, every reveal block settled,
   no image wider than the viewport, no overlapping headings, all links resolve.
   Usage: node scripts/verify-showcase.mjs [--shots] */
import { chromium } from 'playwright-core';
import { createServer } from 'http';
import { readFile, stat, mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname, extname, normalize } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 8787;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.xml': 'application/xml', '.ico': 'image/x-icon'
};

async function resolveFile(pathname) {
  let p = decodeURIComponent(pathname.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const abs = join(root, normalize(p).replace(/^(\.\.[/\\])+/, ''));
  for (const cand of [abs, abs + '.html', join(abs, 'index.html')]) {
    try { const s = await stat(cand); if (s.isFile()) return cand; } catch {}
  }
  return null;
}

const server = createServer(async (req, res) => {
  const file = await resolveFile(req.url);
  if (!file) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
  res.end(await readFile(file));
});
await new Promise(r => server.listen(PORT, r));
const BASE = `http://localhost:${PORT}`;

const exe = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
].find(p => existsSync(p)) || chromium.executablePath();

const PAGES = ['/teakhouse', '/praow', '/th/teakhouse', '/th/praow'];
const WIDTHS = [360, 390, 768, 1093, 1366, 1440];
const SHOTS = process.argv.includes('--shots');

const browser = await chromium.launch({ headless: true, executablePath: exe });
let fails = 0;
const fail = (...a) => { fails++; console.log('  FAIL', ...a); };

for (const path of PAGES) {
  console.log('\n=== ' + path);
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    // /_vercel/insights only exists on Vercel; it is expected to 404 locally
    page.on('response', r => {
      if (r.status() >= 400 && !r.url().includes('/_vercel/')) errors.push('HTTP ' + r.status() + ' ' + r.url());
    });
    await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.evaluate(() => { document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; }); });
    // walk the page so every reveal / lazy image has had its chance
    await page.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y <= h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);

    const r = await page.evaluate(() => {
      const de = document.documentElement;
      const vw = de.clientWidth;
      const over = [...document.querySelectorAll('body *')]
        .filter(e => !e.closest('.skip'))   // skip-to-content is parked offscreen until focused
        .filter(e => {
          const b = e.getBoundingClientRect();
          return b.width > 0 && b.height > 0 && (b.right > vw + 1.5 || b.left < -1.5);
        })
        .slice(0, 6)
        .map(e => e.tagName + '.' + String(e.className && (e.className.baseVal || e.className)).slice(0, 44)
          + ' [' + Math.round(e.getBoundingClientRect().left) + ',' + Math.round(e.getBoundingClientRect().right) + ']');

      const unrevealed = [...document.querySelectorAll('.rv,.rv-l,.rv-r,.rv-s,.clipin')]
        .filter(e => {
          const cs = getComputedStyle(e);
          return parseFloat(cs.opacity) < 0.99 || (cs.transform !== 'none' && cs.transform !== 'matrix(1, 0, 0, 1, 0, 0)');
        }).length;

      // heading / neighbour overlap: does a section heading box intersect the next block?
      const overlaps = [];
      const heads = [...document.querySelectorAll('h1,h2,h3,.sc-cap,.sc-list .it,.sc-li')];
      for (const h of heads) {
        const a = h.getBoundingClientRect();
        if (a.height === 0) continue;
        const sib = h.nextElementSibling;
        if (!sib) continue;
        const b = sib.getBoundingClientRect();
        if (b.height === 0) continue;
        if (a.bottom > b.top + 2 && a.top < b.bottom && a.left < b.right && a.right > b.left) {
          overlaps.push(h.tagName + ':' + (h.textContent || '').trim().slice(0, 24));
        }
      }

      const imgs = [...document.images].filter(i => i.getBoundingClientRect().width > vw + 1).length;
      const broken = [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.currentSrc || i.src);

      return {
        vw, docW: de.scrollWidth, bodyW: document.body.scrollWidth,
        over, unrevealed, overlaps: overlaps.slice(0, 5), imgs, broken: broken.slice(0, 5),
        lang: de.lang, imgCount: document.images.length
      };
    });

    const scrolls = r.docW > r.vw + 1 || r.bodyW > r.vw + 1;
    const bad = scrolls || r.over.length || r.unrevealed || r.overlaps.length || r.imgs || r.broken.length || errors.length;
    console.log(`  ${String(w).padStart(4)}px  doc=${r.docW} vw=${r.vw}  imgs=${r.imgCount}  ${bad ? '' : 'OK'}`);
    if (scrolls) fail(path, w, 'horizontal scroll doc=' + r.docW + ' vw=' + r.vw);
    if (r.over.length) fail(path, w, 'out of viewport:', r.over.join(' | '));
    if (r.unrevealed) fail(path, w, r.unrevealed + ' reveal blocks not settled');
    if (r.overlaps.length) fail(path, w, 'overlap:', r.overlaps.join(' | '));
    if (r.imgs) fail(path, w, r.imgs + ' images wider than viewport');
    if (r.broken.length) fail(path, w, 'broken images:', r.broken.join(' | '));
    if (errors.length) fail(path, w, 'console/network:', [...new Set(errors)].slice(0, 4).join(' | '));

    if (SHOTS && (w === 390 || w === 1440)) {
      const dir = join(root, '.shots', 'verify');
      await mkdir(dir, { recursive: true });
      const name = path.replace(/\//g, '_').replace(/^_/, '') + '-' + w + '.png';
      await page.screenshot({ path: join(dir, name), fullPage: false });
    }
    await ctx.close();
  }

  // every internal link on the page must resolve
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  const links = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href]')]
    .map(a => a.getAttribute('href'))
    .filter(h => h && h.startsWith('/')))]);
  for (const l of links) {
    const res = await page.request.get(BASE + l).catch(() => null);
    if (!res || res.status() >= 400) fail(path, 'dead internal link', l, res && res.status());
  }
  console.log('  links checked:', links.length);
  await ctx.close();
}

await browser.close();
server.close();
console.log(fails ? `\n${fails} FAILURES` : '\nALL GATES PASS');
process.exit(fails ? 1 : 0);
