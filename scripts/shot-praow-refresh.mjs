/* Targeted PRAOW reshoot · card thumbnails + the redesigned appointment receipt.
   Not the full capture set: only what changed on the demo.
   Usage: node scripts/shot-praow-refresh.mjs [--raw] */
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'assets', 'img', 'proof');
const rawDir = join(root, '.shots');
mkdirSync(rawDir, { recursive: true });
const RAW = process.argv.includes('--raw');

/* The v1 build only lives on the preview host until the praow.mikaro.studio
   cutover completes · captures come from there, the site links to the domain. */
const DEMO = 'https://praow.mikaro.studio';

const exe = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
].find(p => existsSync(p));

async function encode(png, name, outW, maxKB) {
  let q = 82, buf;
  do {
    buf = await sharp(png).resize({ width: outW, withoutEnlargement: true }).webp({ quality: q }).toBuffer();
    q -= 5;
  } while (buf.length > maxKB * 1024 && q > 40);
  await sharp(buf).toFile(join(outDir, name + '.webp'));
  const m = await sharp(buf).metadata();
  console.log('  ->', name + '.webp', m.width + 'x' + m.height, Math.round(buf.length / 1024) + 'KB');
}

async function settle(page) {
  await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready.catch(() => {}); });
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; });
    const h = document.body.scrollHeight;
    for (let y = 0; y <= h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
}

const barH = page => page.evaluate(() => {
  const b = document.querySelector('[class*="z-demo-bar"]');
  return b ? Math.round(b.getBoundingClientRect().height) : 0;
});

const browser = await chromium.launch({ headless: true, executablePath: exe });

/* ---- 1 · card thumbnails, same crop and size the old ones used ---- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(DEMO + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await settle(p);
  const png = await p.screenshot({ type: 'png', scale: 'device', clip: { x: 0, y: await barH(p), width: 1440, height: 820 } });
  if (RAW) writeFileSync(join(rawDir, 'praow-card.png'), png);
  await encode(png, 'praow', 1200, 130);
  await ctx.close();
}
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, reducedMotion: 'reduce',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
  });
  const p = await ctx.newPage();
  await p.goto(DEMO + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await settle(p);
  const png = await p.screenshot({ type: 'png', scale: 'device', clip: { x: 0, y: await barH(p), width: 390, height: 700 } });
  if (RAW) writeFileSync(join(rawDir, 'praow-card-m.png'), png);
  await encode(png, 'praow-m', 390, 60);   // matches teakhouse-m.webp on the same rail
  await ctx.close();
}

/* ---- 2 · the redesigned receipt, driven through the whole wizard ---- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(DEMO + '/consultation', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await p.waitForTimeout(1000);

  const click = async (src, label) => {
    const hit = await p.evaluate(s => {
      const rx = new RegExp(s, 'i');   // button labels are uppercased in CSS, not in the DOM
      const b = [...document.querySelectorAll('button')].find(x => rx.test(x.textContent.trim()) && !x.disabled);
      if (b) { b.click(); return b.textContent.trim().slice(0, 34); }
      return null;
    }, src);
    console.log('   step:', label, '->', hit);
    await p.waitForTimeout(1000);
  };

  await click('^Botulinum', 'treatment');
  await click('^Continue$', 'continue');
  await click('^1[4-9]:[03]0$', 'time slot');
  await click('^Continue$', 'continue');
  await p.fill('#prw-name', 'Arisa Chaiyaporn');
  await p.fill('#prw-phone', '081 234 5678');
  await p.fill('#prw-email', 'arisa@example.com');
  await p.waitForTimeout(400);
  await click('^Continue$', 'continue');

  // PromptPay rather than the card tab · no card number is ever typed.
  // The QR here is a decorative mark on the deposit step, not a scannable code,
  // and the receipt itself carries no QR at all.
  await click('^PromptPay$', 'promptpay tab');
  const payBox = await p.evaluate(() => {
    const hits = [...document.querySelectorAll('div,section')]
      .filter(e => /Scan with any Thai banking app/.test(e.textContent || '')
        && /Card/.test(e.textContent || '') && e.getBoundingClientRect().height < 620);
    const el = hits[hits.length - 1];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.max(0, r.left - 34), y: r.top + window.scrollY - 34, w: r.width + 68, h: r.height + 68 };
  });
  console.log('   deposit panel:', JSON.stringify(payBox));
  if (payBox) {
    await p.evaluate(y => window.scrollTo(0, Math.max(0, y - 120)), payBox.y);
    await p.waitForTimeout(600);
    const top = Math.max(await barH(p), payBox.y - await p.evaluate(() => window.scrollY));
    const png = await p.screenshot({ type: 'png', scale: 'device', clip: { x: payBox.x, y: top, width: payBox.w, height: payBox.h } });
    if (RAW) writeFileSync(join(rawDir, 'pw-deposit.png'), png);
    await encode(png, 'pw-deposit', 1000, 90);
  }

  await click('^Pay ', 'pay and lock the slot');
  await p.waitForTimeout(3000);
  await settle(p);

  // the whole confirmation block: heading plus the perforated appointment card
  const box = await p.evaluate(() => {
    const el = document.querySelector('.prw-wrap');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.max(0, r.left - 30), y: r.top + window.scrollY - 30, w: r.width + 60, h: r.height + 60 };
  });
  console.log('   receipt box:', JSON.stringify(box));
  if (box) {
    await p.evaluate(y => window.scrollTo(0, Math.max(0, y - 130)), box.y);  // clear the sticky header
    await p.waitForTimeout(600);
    const top = Math.max(await barH(p), box.y - await p.evaluate(() => window.scrollY));
    const png = await p.screenshot({ type: 'png', scale: 'device', clip: { x: box.x, y: top, width: box.w, height: box.h } });
    if (RAW) writeFileSync(join(rawDir, 'pw-receipt.png'), png);
    await encode(png, 'pw-receipt', 1200, 110);
  }
  await ctx.close();
}

await browser.close();
