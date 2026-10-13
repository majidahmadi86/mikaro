/* The Teak House screenshots · re-take every Teak House image on mikaro.studio
   from LIVE production (https://teakhouse.mikaro.studio).

   node scripts/teakhouse-shots.mjs            everything
   node scripts/teakhouse-shots.mjs hero proof page

   Writes (stable names):
     hero   assets/img/teakhouse-hero-desktop.webp     735x920  home hero, portrait slot, phone view (frame baked in)
            assets/img/teakhouse-hero-desktop-368.webp 368x461
            assets/img/teakhouse-hero-mobile.webp      480x808  same slot under 768px (frame baked in)
     proof  assets/img/proof/teakhouse.webp            1200x683 proof cards
            assets/img/proof/teakhouse-m.webp          390x700
     page   assets/img/proof/th-*.webp (+ -800)        /teakhouse and /th/teakhouse */
import { launch, phone, desktop, open, demoBar, encode, framed, frameBox, imgDir, proofDir } from './lib/shots.mjs';
import { join } from 'path';

const SITE = 'https://teakhouse.mikaro.studio';
const URL_LABEL = 'teakhouse.mikaro.studio';
const want = new Set(process.argv.slice(2).filter(a => !a.startsWith('--')));
const run = k => !want.size || want.has(k);

const browser = await launch();

/* Phone view with the booking dock in frame: scroll until the "Check rates"
   button sits just inside the bottom of the crop; the sticky header (logo and
   Book) stays at the top, so the frame reads header, headline, dock. */
async function phoneHero(captureH, anchor = 'check rates', pad = 14) {
  const ctx = await phone(browser, 844, 3);
  const p = await ctx.newPage();
  await open(p, SITE + '/');
  const top = await demoBar(p);
  const btnBottom = await p.evaluate((a) => {
    const b = [...document.querySelectorAll('button,a,label,div')].find(e => e.children.length < 4 && new RegExp(a, 'i').test(e.textContent || '') && e.getBoundingClientRect().height > 0);
    return b ? b.getBoundingClientRect().bottom + scrollY : 0;
  }, anchor);
  const y = Math.max(0, Math.round(btnBottom + pad - (top + captureH)));
  await p.evaluate(v => window.scrollTo(0, v), y);
  await p.waitForTimeout(1500);
  const png = await p.screenshot({ type: 'png', scale: 'device', clip: { x: 0, y: top, width: 390, height: captureH } });
  await ctx.close();
  return png;
}

if (run('hero')) {
  console.log('hero');
  {
    const W = 735, H = 920, shown = 352;
    const png = await phoneHero(frameBox(W, H, shown, 390).captureH, 'Wed|Thu|Fri|Sat|Sun|Mon|Tue', 84);
    const out = await framed(browser, png, URL_LABEL, W, H, shown);
    await encode(out, join(imgDir, 'teakhouse-hero-desktop.webp'), W, H, 40);
    await encode(out, join(imgDir, 'teakhouse-hero-desktop-368.webp'), 368, 461, 16);
  }
  {
    const W = 480, H = 808, shown = 289;
    const png = await phoneHero(frameBox(W, H, shown, 390).captureH);
    const out = await framed(browser, png, URL_LABEL, W, H, shown);
    await encode(out, join(imgDir, 'teakhouse-hero-mobile.webp'), W, H, 26);
  }
}

if (run('proof')) {
  console.log('proof');
  {
    const ctx = await desktop(browser, 1440, 860, 1);
    const p = await ctx.newPage();
    await open(p, SITE + '/');
    const top = await demoBar(p);
    const png = await p.screenshot({ type: 'png', clip: { x: 0, y: top, width: 1440, height: 820 } });
    await encode(png, join(proofDir, 'teakhouse.webp'), 1200, 683, 120);
    await ctx.close();
  }
  {
    const ctx = await phone(browser, 760, 2);
    const p = await ctx.newPage();
    await open(p, SITE + '/');
    const top = await demoBar(p);
    const png = await p.screenshot({ type: 'png', scale: 'device', clip: { x: 0, y: top, width: 390, height: 700 } });
    await encode(png, join(proofDir, 'teakhouse-m.webp'), 390, 700, 45);
    await ctx.close();
  }
}

async function pageShot(name, path, { scrollTo, offset = 110, click, wait = 0, h = 800, maxKB = 130 } = {}) {
  const ctx = await desktop(browser, 1440, h + 60, 1.5);
  const p = await ctx.newPage();
  await open(p, SITE + path);
  const top = await demoBar(p);
  if (scrollTo) {
    const y = await p.evaluate(([t, top, off]) => {
      const el = [...document.querySelectorAll('h1,h2,h3,p,span,div,section')]
        .find(e => e.children.length < 6 && new RegExp(t, 'i').test(e.textContent || '') && e.getBoundingClientRect().height > 0);
      return el ? Math.max(0, el.getBoundingClientRect().top + scrollY - top - off) : 0;
    }, [scrollTo, top, offset]);
    await p.evaluate(v => window.scrollTo(0, v), y);
    await p.waitForTimeout(1400);
  }
  if (click) {
    await p.locator(click).first().click({ timeout: 8000 }).catch(e => console.log('  click skipped:', e.message.split('\n')[0]));
    await p.waitForTimeout(1500);
  }
  if (wait) await p.waitForTimeout(wait);
  const png = await p.screenshot({ type: 'png', scale: 'device', clip: { x: 0, y: top, width: 1440, height: h } });
  const H = Math.round(1600 * h / 1440);
  await encode(png, join(proofDir, name + '.webp'), 1600, H, maxKB);
  await encode(png, join(proofDir, name + '-800.webp'), 800, Math.round(H / 2), Math.round(maxKB / 3));
  await ctx.close();
}

async function phoneShot(name, path, { click, h = 700 } = {}) {
  const ctx = await phone(browser, h + 60, 2);
  const p = await ctx.newPage();
  await open(p, SITE + path);
  const top = await demoBar(p);
  if (click) {
    await p.locator(click).first().click({ timeout: 8000 }).catch(e => console.log('  click skipped:', e.message.split('\n')[0]));
    await p.waitForTimeout(1500);
  }
  const png = await p.screenshot({ type: 'png', scale: 'device', clip: { x: 0, y: top, width: 390, height: h } });
  await encode(png, join(proofDir, name + '.webp'), 780, h * 2, 80);
  await ctx.close();
}

if (run('page')) {
  console.log('page');
  await pageShot('th-guest-hero', '/', { h: 800, maxKB: 150 });
  await pageShot('th-rooms', '/', { scrollTo: 'Six ways to stay by the river', h: 800 });
  await pageShot('th-offers', '/offers', { scrollTo: 'Three quiet reasons', offset: 160, h: 800 });
  await pageShot('th-dining', '/dining', { scrollTo: 'From the kitchen', offset: 200, h: 800 });
  await pageShot('th-events', '/events', { h: 800 });
  await pageShot('th-reserve', '/book', { wait: 3000, h: 800 });
  await pageShot('th-owner-dash', '/owner', { wait: 1500, h: 800 });
  await pageShot('th-concierge', '/', { click: 'button[aria-label*="oncierge" i], button[aria-label*="chat" i]', wait: 1000, h: 800 });
  await phoneShot('th-mobile', '/');
  await phoneShot('th-mobile-menu', '/', { click: 'header button[aria-controls="mobile-nav-drawer"], header button[aria-label*="enu" i]' });
}

await browser.close();
console.log('done');
