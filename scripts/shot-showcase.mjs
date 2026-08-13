/* Showcase capture · Teak House + PRAOW live demos -> /assets/img/proof/*.webp
   Usage: node scripts/shot-showcase.mjs [only-prefix] [--raw]
   Art-directed: retina source (dsf 2/3), reduced motion so nothing is caught
   mid-animation, lazy images forced, interactive states driven (info tip open,
   booking wizard on the slot step, mobile drawer open). The demo-only top bar
   is cropped out rather than hidden, so the page layout stays untouched. */
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = dirname(fileURLToPath(import.meta.url));
const outDir = join(root, '..', 'assets', 'img', 'proof');
const rawDir = join(root, '..', '.shots');
mkdirSync(outDir, { recursive: true });
mkdirSync(rawDir, { recursive: true });

const TEAK = 'https://teakhouse.mikaro.studio';
const PRAOW = 'https://praow-v1-preview.vercel.app';
const only = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : '';
const RAW = process.argv.includes('--raw');

const exe = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
].find(p => existsSync(p)) || chromium.executablePath();

const sizes = {};

async function encode(png, name, outW, maxKB) {
  const dest = join(outDir, name + '.webp');
  let q = 82;
  const run = () => sharp(png).resize({ width: outW, withoutEnlargement: true }).webp({ quality: q }).toBuffer();
  let buf = await run();
  while (buf.length > maxKB * 1024 && q > 40) { q -= 5; buf = await run(); }
  await sharp(buf).toFile(dest);
  const m = await sharp(buf).metadata();
  sizes[name] = { w: m.width, h: m.height };
  console.log('  ->', name, m.width + 'x' + m.height, Math.round(buf.length / 1024) + 'KB q=' + q);
}

async function settle(page) {
  await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready.catch(() => {}); });
  await page.evaluate(() => {
    document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; });
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.evaluate(async () => {
    const imgs = [...document.images].filter(i => i.getBoundingClientRect().width > 0);
    await Promise.all(imgs.map(img => (img.complete && img.naturalWidth)
      ? null
      : new Promise(r => { img.onload = img.onerror = r; setTimeout(r, 6000); })));
  });
  await page.waitForTimeout(600);
}

/* height of the demo-only bar pinned to the top of both demos */
async function barH(page) {
  return page.evaluate(() => {
    const b = document.querySelector('[class*="z-demo-bar"]');
    if (b) return Math.round(b.getBoundingClientRect().height);
    const c = [...document.querySelectorAll('div')].find(e => getComputedStyle(e).position === 'fixed'
      && e.getBoundingClientRect().top === 0 && e.getBoundingClientRect().height < 60
      && /Viewing/i.test(e.textContent || ''));
    return c ? Math.round(c.getBoundingClientRect().height) : 0;
  });
}

async function open(ctx, url) {
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(900);
  await settle(page);
  return page;
}

/* document-space top of the tightest element whose trimmed text starts with `t`
   (tightest = shortest textContent, so we anchor on the label itself and never
   on a wrapper that happens to begin with the same words) */
async function yOf(page, t, nth = 0) {
  return page.evaluate(([t, nth]) => {
    const els = [...document.querySelectorAll('h1,h2,h3,h4,b,strong,span,div,section,p,button,a,li,ol,ul,table')]
      .filter(e => (e.textContent || '').trim().startsWith(t) && e.getBoundingClientRect().height > 0)
      .sort((a, b) => a.textContent.trim().length - b.textContent.trim().length);
    const el = els[nth] || els[0];
    if (!el) return null;
    return Math.max(0, el.getBoundingClientRect().top + window.scrollY);
  }, [t, nth]);
}

async function scrollTo(page, y) {
  await page.evaluate(v => window.scrollTo(0, Math.max(0, v)), y);
  await page.waitForTimeout(700);
}

async function shoot(page, name, { w = 1440, h = 860, y = null, outW = 1600, maxKB = 150 } = {}) {
  const top = y == null ? await barH(page) : y;
  const png = await page.screenshot({ type: 'png', scale: 'device', clip: { x: 0, y: top, width: w, height: h } });
  if (RAW) writeFileSync(join(rawDir, name + '.png'), png);
  await encode(png, name, outW, maxKB);
}

const want = n => !only || n.startsWith(only);
const browser = await chromium.launch({ headless: true, executablePath: exe });

const deskCtx = await browser.newContext({
  viewport: { width: 1440, height: 960 }, deviceScaleFactor: 2, locale: 'en-GB', reducedMotion: 'reduce'
});

/* ============================ THE TEAK HOUSE ============================ */
if (want('th-guest-hero')) {
  const p = await open(deskCtx, TEAK + '/');
  await shoot(p, 'th-guest-hero', { h: 745 });
  await p.close();
}

if (want('th-owner-dash')) {
  const p = await open(deskCtx, TEAK + '/owner');
  await p.evaluate(() => {
    const b = [...document.querySelectorAll('button[aria-label]')]
      .find(x => /OTA commission saved/i.test(x.getAttribute('aria-label') || ''));
    if (b) b.click();
  });
  await p.waitForTimeout(600);
  await shoot(p, 'th-owner-dash', { h: 800 });
  await p.close();
}

if (want('th-rates')) {
  const p = await open(deskCtx, TEAK + '/owner/rates');
  await shoot(p, 'th-rates', { h: 840 });
  await p.close();
}

if (want('th-availability')) {
  const p = await open(deskCtx, TEAK + '/owner/calendar');
  await shoot(p, 'th-availability', { h: 800 });
  await p.close();
}

if (want('th-dining')) {
  const p = await open(deskCtx, TEAK + '/dining');
  await scrollTo(p, (await yOf(p, 'Breakfast on the pier')) - 160);
  await shoot(p, 'th-dining', { h: 800 });
  await p.close();
}

if (want('th-events')) {
  const p = await open(deskCtx, TEAK + '/events');
  await shoot(p, 'th-events', { h: 655 });
  await p.close();
}

if (want('th-events-cal')) {
  const p = await open(deskCtx, TEAK + '/events');
  const y = await yOf(p, 'Sunday jazz brunch');
  await scrollTo(p, (y || 1500) - 520);
  await shoot(p, 'th-events-cal', { h: 790 });
  await p.close();
}

if (want('th-owner-dining')) {
  const p = await open(deskCtx, TEAK + '/owner/dining');
  await shoot(p, 'th-owner-dining', { h: 800 });
  await p.close();
}

if (want('th-owner-events')) {
  const p = await open(deskCtx, TEAK + '/owner/events');
  await shoot(p, 'th-owner-events', { h: 760 });
  await p.close();
}

if (want('th-book')) {
  const p = await open(deskCtx, TEAK + '/book?room=loft');
  const y = await p.locator('text=Choose your room').first()
    .evaluate(el => el.getBoundingClientRect().top + window.scrollY).catch(() => 400);
  await scrollTo(p, y + 400);
  await shoot(p, 'th-book', { h: 800 });
  await p.close();
}

if (want('th-seats')) {
  const p = await open(deskCtx, TEAK + '/events/reserve?event=ev-jazz-brunch');
  const y = await p.locator('text=Which evening').first()
    .evaluate(el => el.getBoundingClientRect().top + window.scrollY).catch(() => 900);
  await scrollTo(p, y + 285);
  await shoot(p, 'th-seats', { h: 800 });
  await p.close();
}

if (want('th-dining-th')) {
  const p = await open(deskCtx, TEAK + '/dining');
  await p.evaluate(() => {
    const a = [...document.querySelectorAll('a,button')].find(e => (e.textContent || '').trim() === 'ไทย');
    if (a) a.click();
  });
  await p.waitForTimeout(3000);
  await settle(p);
  const y = await yOf(p, 'อาหารเช้าริมท่าน้ำ');
  await scrollTo(p, (y == null ? 1400 : y) - 150);
  await shoot(p, 'th-dining-th', { h: 800 });
  await p.close();
}

/* ================================ PRAOW ================================ */
if (want('pw-hero')) {
  const p = await open(deskCtx, PRAOW + '/');
  await shoot(p, 'pw-hero', { h: 800 });
  await p.close();
}

if (want('pw-treatments')) {
  const p = await open(deskCtx, PRAOW + '/treatments');
  const y = await yOf(p, 'Injectables');
  await scrollTo(p, (y || 0) - 245);
  await shoot(p, 'pw-treatments', { h: 820 });
  await p.close();
}

if (want('pw-results')) {
  const p = await open(deskCtx, PRAOW + '/results');
  const y = await p.locator('text=Drag to compare').first()
    .evaluate(el => el.getBoundingClientRect().top + window.scrollY).catch(() => 1000);
  await scrollTo(p, y - 610);
  await shoot(p, 'pw-results', { h: 800 });
  await p.close();
}

if (want('pw-booking')) {
  const p = await open(deskCtx, PRAOW + '/consultation');
  await p.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find(x => /^I am not sure yet/.test(x.textContent.trim()));
    if (b) b.click();
  });
  await p.waitForTimeout(500);
  await p.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find(x => /^Continue$/i.test(x.textContent.trim()));
    if (b) b.click();
  });
  await p.waitForTimeout(1600);
  await settle(p);
  const y = await yOf(p, 'Choose a date');
  await scrollTo(p, (y || 0) - 210);
  await shoot(p, 'pw-booking', { h: 840 });
  await p.close();
}

if (want('pw-clinic')) {
  const p = await open(deskCtx, PRAOW + '/clinic');
  await shoot(p, 'pw-clinic', { h: 820 });
  await p.close();
}

if (want('pw-calendar')) {
  const p = await open(deskCtx, PRAOW + '/clinic?tab=calendar');
  await shoot(p, 'pw-calendar', { h: 900 });
  await p.close();
}

if (want('pw-clients')) {
  const p = await open(deskCtx, PRAOW + '/clinic?tab=clients');
  await shoot(p, 'pw-clients', { h: 820 });
  await p.close();
}

if (want('pw-treatments-th')) {
  const p = await open(deskCtx, PRAOW + '/lang/th?next=%2Ftreatments');
  await shoot(p, 'pw-treatments-th', { h: 760 });
  await p.close();
}

/* =============================== MOBILE =============================== */
const mobCtx = await browser.newContext({
  viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, reducedMotion: 'reduce',
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
});

if (want('th-mobile')) {
  const p = await open(mobCtx, TEAK + '/');
  await shoot(p, 'th-mobile', { w: 390, h: 700, outW: 780, maxKB: 100 });
  await p.close();
}

if (want('th-mobile-menu')) {
  const p = await open(mobCtx, TEAK + '/');
  await p.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find(x => /menu/i.test(x.getAttribute('aria-label') || ''));
    if (b) b.click();
  });
  await p.waitForTimeout(1000);
  await shoot(p, 'th-mobile-menu', { w: 390, h: 660, y: 0, outW: 780, maxKB: 100 });
  await p.close();
}

if (want('pw-mobile')) {
  const p = await open(mobCtx, PRAOW + '/');
  await shoot(p, 'pw-mobile', { w: 390, h: 645, outW: 780, maxKB: 100 });
  await p.close();
}

await browser.close();
console.log('\n' + JSON.stringify(sizes));
