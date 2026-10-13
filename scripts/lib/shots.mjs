/* Shared capture helpers for the live-demo screenshots.
   - launch(): headless Edge/Chrome through playwright-core
   - open(): goto + settle (fonts, lazy images, reduced motion)
   - demoBar(): height of the demo-only "Viewing: Guest site / Owner panel" bar,
     which is cropped out rather than hidden so the page layout stays untouched
   - encode(): WebP or AVIF under a byte budget, cut to an exact box
   - framed(): the browser-frame treatment used on mikaro.studio (.bframe):
     a #F3F0EA bar, three #DDD7CC dots and a white URL pill in Gabarito, drawn
     in a real page so the type matches the site, then baked into the image.
     Used where the slot has no HTML frame of its own (the home hero collage). */
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { existsSync, readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const imgDir = join(root, 'assets', 'img');
export const proofDir = join(imgDir, 'proof');
mkdirSync(proofDir, { recursive: true });

const exe = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome'
].find(p => existsSync(p));

export const PHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

export async function launch() {
  return chromium.launch({ headless: true, ...(exe ? { executablePath: exe } : {}) });
}

export function phone(browser, height = 844, dsf = 3) {
  return browser.newContext({
    viewport: { width: 390, height }, deviceScaleFactor: dsf, isMobile: true, hasTouch: true,
    reducedMotion: 'reduce', userAgent: PHONE_UA, locale: 'en-US', timezoneId: 'Asia/Bangkok'
  });
}

export function desktop(browser, width = 1440, height = 900, dsf = 2) {
  return browser.newContext({ viewport: { width, height }, deviceScaleFactor: dsf, reducedMotion: 'reduce', locale: 'en-US', timezoneId: 'Asia/Bangkok' });
}

export async function settle(page) {
  await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready.catch(() => {}); });
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; });
    const h = Math.min(document.body.scrollHeight, 6000);
    for (let y = 0; y <= h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
    window.scrollTo(0, 0);
  });
  await page.evaluate(async () => {
    const imgs = [...document.images].filter(i => i.getBoundingClientRect().width > 0);
    await Promise.all(imgs.map(img => (img.complete && img.naturalWidth) ? null
      : new Promise(r => { img.onload = img.onerror = r; setTimeout(r, 6000); })));
  });
  await page.waitForTimeout(1200);
}

export async function open(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await settle(page);
}

export function demoBar(page) {
  return page.evaluate(() => {
    const b = document.querySelector('[class*="z-demo-bar"]');
    return b ? Math.round(b.getBoundingClientRect().height) : 0;
  });
}

/* Encode to an exact w x h box (cover) under maxKB; fmt 'webp' or 'avif'. */
export async function encode(png, dest, w, h, maxKB, fmt = 'webp') {
  let q = fmt === 'avif' ? 62 : 82, buf;
  const run = () => {
    const s = sharp(png).resize({ width: w, height: h || undefined, fit: 'cover', position: 'top' });
    return (fmt === 'avif' ? s.avif({ quality: q, effort: 6 }) : s.webp({ quality: q })).toBuffer();
  };
  buf = await run();
  while (buf.length > maxKB * 1024 && q > 34) { q -= 5; buf = await run(); }
  await sharp(buf).toFile(dest);
  const m = await sharp(buf).metadata();
  console.log('  ->', dest.replace(root, '').replace(/\\/g, '/'), m.width + 'x' + m.height, Math.round(buf.length / 1024) + 'KB q=' + q);
  return { w: m.width, h: m.height, kb: Math.round(buf.length / 1024) };
}

/* Browser-frame treatment. W x H is the output size; shownW is the CSS width
   the slot is displayed at on mikaro.studio, so the bar reads at the same
   physical size as the .bframe bars on the page. Returns the content box (in
   CSS px of a viewport of width vw) the screenshot must fill. */
export function frameBox(W, H, shownW, vw) {
  const scale = W / shownW;
  const barH = Math.max(18, Math.min(28, Math.round(shownW * 0.075)));
  const cssH = H / scale;
  const contentH = cssH - barH;
  return { scale, barH, cssW: shownW, cssH, contentH, captureH: Math.round(vw * contentH / shownW) };
}

const gabarito = () => 'data:font/woff2;base64,' + readFileSync(join(root, 'assets', 'fonts', 'gabarito.woff2')).toString('base64');

export async function framed(browser, shotPng, url, W, H, shownW) {
  const box = frameBox(W, H, shownW, 1);
  const k = box.barH / 28;
  const ctx = await browser.newContext({ viewport: { width: Math.ceil(box.cssW), height: Math.ceil(box.cssH) }, deviceScaleFactor: box.scale });
  const page = await ctx.newPage();
  const shot = 'data:image/png;base64,' + Buffer.from(shotPng).toString('base64');
  await page.setContent(`<!doctype html><html><head><style>
    @font-face{font-family:G;src:url(${gabarito()}) format('woff2');font-weight:400 900}
    html,body{margin:0;background:#fff}
    #f{width:${box.cssW}px;height:${box.cssH}px;display:flex;flex-direction:column;overflow:hidden;background:#fff}
    .bar{flex:0 0 ${box.barH}px;box-sizing:border-box;display:flex;align-items:center;gap:${(5 * k).toFixed(2)}px;padding:0 ${(12 * k).toFixed(2)}px;background:#F3F0EA;border-bottom:1px solid #EDE5DA;min-width:0}
    .bar i{width:${(8 * k).toFixed(2)}px;height:${(8 * k).toFixed(2)}px;border-radius:50%;background:#DDD7CC;flex:0 0 auto}
    .url{margin-left:${(6 * k).toFixed(2)}px;font-family:G,Arial,sans-serif;font-weight:700;font-size:${(10 * k).toFixed(2)}px;line-height:1;color:#5D5A66;background:#fff;border-radius:999px;padding:${(4 * k).toFixed(2)}px ${(10 * k).toFixed(2)}px;flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .shot{flex:1 1 auto;min-height:0;width:100%;object-fit:cover;object-position:top;display:block}
  </style></head><body><div id="f"><div class="bar"><i></i><i></i><i></i><span class="url">${url}</span></div><img class="shot" src="${shot}"></div></body></html>`);
  await page.evaluate(async () => { await document.fonts.ready; const i = document.querySelector('.shot'); if (!i.complete) await new Promise(r => { i.onload = r; }); });
  const out = await page.locator('#f').screenshot({ type: 'png', scale: 'device' });
  await ctx.close();
  return out;
}
