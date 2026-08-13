/* Production screenshots of the four showcase pages at the two report widths.
   Usage: node scripts/shot-pages.mjs */
import { chromium } from 'playwright-core';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, '.shots', 'pages');
await mkdir(out, { recursive: true });

const exe = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
].find(p => existsSync(p));

const browser = await chromium.launch({ headless: true, executablePath: exe });
const PAGES = [['teakhouse', '/teakhouse'], ['praow', '/praow'], ['th-teakhouse', '/th/teakhouse'], ['th-praow', '/th/praow']];

for (const [name, path] of PAGES) {
  for (const w of [1440, 390]) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: w === 390 ? 844 : 900 },
      deviceScaleFactor: 2, reducedMotion: 'reduce',
      locale: path.startsWith('/th') ? 'th-TH' : 'en-GB'
    });
    await ctx.addInitScript(v => { try { localStorage.setItem('mikaro-lang', v); } catch (e) {} },
      path.startsWith('/th') ? 'th' : 'en');
    const page = await ctx.newPage();
    await page.goto('https://mikaro.studio' + path, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) await document.fonts.ready.catch(() => {});
      document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; });
      const h = document.body.scrollHeight;
      for (let y = 0; y <= h; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);
    const file = join(out, `${name}-${w}.png`);
    await page.screenshot({ path: file, scale: 'css' });
    console.log(file);
    await ctx.close();
  }
}
await browser.close();
