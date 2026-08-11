import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = dirname(fileURLToPath(import.meta.url));
const outDir = join(root, '..', 'assets', 'img', 'proof');
mkdirSync(outDir, { recursive: true });

async function toWebp(png, dest, width = 1280, cap = 150) {
  let q = 80;
  const make = () => sharp(png).resize({ width, withoutEnlargement: true }).webp({ quality: q }).toBuffer();
  let buf = await make();
  while (buf.length > cap * 1024 && q > 40) { q -= 6; buf = await make(); }
  await sharp(buf).toFile(dest);
  const meta = await sharp(buf).metadata();
  console.log(dest, meta.width + 'x' + meta.height, Math.round(buf.length / 1024) + 'KB', 'q=' + q);
}

async function ready(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.evaluate(() => {
    try { localStorage.setItem('lang', 'en'); localStorage.setItem('teak-lang', 'en'); localStorage.setItem('locale', 'en'); } catch {}
    document.documentElement.lang = 'en';
    const els = [...document.querySelectorAll('button,a,[role="button"],[data-lang]')];
    const en = els.find(el => {
      const t = (el.textContent || '').trim();
      const lang = el.getAttribute('data-lang') || '';
      return lang === 'en' || /^\s*EN\s*$/i.test(t);
    });
    if (en) en.click();
  });
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready.catch(() => {});
    const imgs = [...document.images];
    await Promise.all(imgs.slice(0, 16).map(img => {
      if (img.complete && img.naturalWidth) return;
      return new Promise(res => { img.onload = res; img.onerror = res; setTimeout(res, 8000); });
    }));
  });
  await page.waitForTimeout(700);
}

const candidates = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];
const exe = candidates.find(p => existsSync(p)) || chromium.executablePath();
const browser = await chromium.launch({ headless: true, executablePath: exe });

// Guest world
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1.5 });
  console.log('capturing guest');
  await ready(page, 'https://teakhouse.mikaro.studio');
  const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
  await toWebp(png, join(outDir, 'hotelier-guest.webp'), 1280, 150);
  await page.close();
}

// Owner world
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1.5 });
  console.log('capturing owner');
  await ready(page, 'https://teakhouse.mikaro.studio/owner');
  const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1440, height: 940 } });
  await toWebp(png, join(outDir, 'hotelier-owner.webp'), 1280, 160);
  await page.close();
}

await browser.close();
console.log('done');
