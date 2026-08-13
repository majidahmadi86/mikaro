/* Hero collage slots · the two platform screenshots, cut to the exact aspect
   ratios the original collage boxes use so no CSS has to move:
     .fl-mio .ph.has-img   735/920  desktop · 480/808   under 768px  -> PRAOW
     .fl-oc  .ph.has-img  1343/632  desktop · 600/1132  under 768px  -> Teak House
   Every slot is object-fit:cover, so each file is cut to its box exactly.
   Usage: node scripts/shot-hero-slots.mjs */
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'assets', 'img');
mkdirSync(out, { recursive: true });

const exe = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
].find(p => existsSync(p));

const barH = page => page.evaluate(() => {
  const b = document.querySelector('[class*="z-demo-bar"]');
  return b ? Math.round(b.getBoundingClientRect().height) : 0;
});

async function settle(page) {
  await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready.catch(() => {}); });
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; });
    const h = document.body.scrollHeight;
    for (let y = 0; y <= h; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 25)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
}

async function encode(png, name, w, h, maxKB) {
  let q = 84, buf;
  do {
    buf = await sharp(png).resize({ width: w, height: h, fit: 'cover' }).webp({ quality: q }).toBuffer();
    q -= 5;
  } while (buf.length > maxKB * 1024 && q > 42);
  await sharp(buf).toFile(join(out, name));
  console.log('  ->', name, w + 'x' + h, Math.round(buf.length / 1024) + 'KB');
}

const browser = await chromium.launch({ headless: true, executablePath: exe });

/* PRAOW · portrait slot */
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 488 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, reducedMotion: 'reduce',   // 735/920
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
  });
  const p = await ctx.newPage();
  await p.goto('https://praow.mikaro.studio/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await settle(p);
  const top = await barH(p);
  const png = await p.screenshot({ type: 'png', scale: 'device', clip: { x: 0, y: top, width: 390, height: 488 } });
  await encode(png, 'praow-hero-desktop.webp', 735, 920, 105);
  const png2 = await p.screenshot({ type: 'png', scale: 'device', clip: { x: 0, y: top, width: 390, height: 657 } });
  await encode(png2, 'praow-hero-mobile.webp', 480, 808, 70);
  await ctx.close();
}

/* The Teak House · landscape slot */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 678 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });   // 1343/632
  const p = await ctx.newPage();
  await p.goto('https://teakhouse.mikaro.studio/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await settle(p);
  const top = await barH(p);
  const png = await p.screenshot({ type: 'png', scale: 'device', clip: { x: 0, y: top, width: 1440, height: 678 } });
  await encode(png, 'teakhouse-hero-desktop.webp', 1343, 632, 120);
  await ctx.close();
}
/* the mobile slot for the Teak House is portrait, so it needs its own capture */
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 736 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, reducedMotion: 'reduce',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
  });
  const p = await ctx.newPage();
  await p.goto('https://teakhouse.mikaro.studio/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await settle(p);
  const top = await barH(p);
  const png = await p.screenshot({ type: 'png', scale: 'device', clip: { x: 0, y: top, width: 390, height: 736 } });
  await encode(png, 'teakhouse-hero-mobile.webp', 600, 1132, 80);
  await ctx.close();
}

await browser.close();
