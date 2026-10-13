/* Solenne screenshots · re-take every Solenne image on mikaro.studio from LIVE
   production (https://solenne.mikaro.studio), with the browser-frame treatment.

   Re-run after the Solenne copy changes:   node scripts/solenne-shots.mjs
   Only some of them:                        node scripts/solenne-shots.mjs hero proof page

   Writes (file names are stable, so no HTML has to change):
     hero   assets/img/solenne-hero-desktop.webp      1343x632  home hero, landscape slot (frame baked in)
            assets/img/solenne-hero-desktop-288.webp   288x136
            assets/img/solenne-hero-mobile.webp        600x1132 same slot under 768px (frame baked in)
     proof  assets/img/proof/solenne.webp              1200x683 proof cards (home, /work, /business)
            assets/img/proof/solenne-m.webp            390x700
     page   assets/img/proof/so-*.webp (+ -800)        /solenne and /th/solenne
   The proof and page images sit inside the site's own HTML browser frames
   (.bframe / .sc-frame), so only the hero images carry a baked frame. */
import { launch, phone, desktop, open, demoBar, encode, framed, frameBox, imgDir, proofDir } from './lib/shots.mjs';
import { join } from 'path';

const SITE = 'https://solenne.mikaro.studio';
const URL_LABEL = 'solenne.mikaro.studio';
const want = new Set(process.argv.slice(2).filter(a => !a.startsWith('--')));
const run = k => !want.size || want.has(k);

const browser = await launch();

/* ---------- hero (landscape slot: 1343/632 desktop, 600/1132 under 768px) ---------- */
if (run('hero')) {
  console.log('hero · desktop');
  {
    const W = 1343, H = 632, shown = 272, vw = 1440;
    const box = frameBox(W, H, shown, vw);
    const ctx = await desktop(browser, vw, 860, 1);
    const p = await ctx.newPage();
    await open(p, SITE + '/');
    const top = await demoBar(p);
    const png = await p.screenshot({ type: 'png', clip: { x: 0, y: top, width: vw, height: box.captureH } });
    const out = await framed(browser, png, URL_LABEL, W, H, shown);
    await encode(out, join(imgDir, 'solenne-hero-desktop.webp'), W, H, 40);
    await encode(out, join(imgDir, 'solenne-hero-desktop-288.webp'), 288, 136, 14);
    await ctx.close();
  }
  console.log('hero · phone');
  {
    const W = 600, H = 1132, shown = 234, vw = 390;
    const box = frameBox(W, H, shown, vw);
    const ctx = await phone(browser, 844, 3);
    const p = await ctx.newPage();
    await open(p, SITE + '/');
    const top = await demoBar(p);
    const png = await p.screenshot({ type: 'png', scale: 'device', clip: { x: 0, y: top, width: vw, height: box.captureH } });
    const out = await framed(browser, png, URL_LABEL, W, H, shown);
    await encode(out, join(imgDir, 'solenne-hero-mobile.webp'), W, H, 26);
    await ctx.close();
  }
}

/* ---------- proof cards ---------- */
if (run('proof')) {
  console.log('proof');
  {
    const ctx = await desktop(browser, 1440, 860, 1);
    const p = await ctx.newPage();
    await open(p, SITE + '/');
    const top = await demoBar(p);
    const png = await p.screenshot({ type: 'png', clip: { x: 0, y: top, width: 1440, height: 820 } });
    await encode(png, join(proofDir, 'solenne.webp'), 1200, 683, 120);
    await ctx.close();
  }
  {
    const ctx = await phone(browser, 760, 2);
    const p = await ctx.newPage();
    await open(p, SITE + '/');
    const top = await demoBar(p);
    const png = await p.screenshot({ type: 'png', scale: 'device', clip: { x: 0, y: top, width: 390, height: 700 } });
    await encode(png, join(proofDir, 'solenne-m.webp'), 390, 700, 45);
    await ctx.close();
  }
}

/* ---------- /solenne page ---------- */
async function pageShot(name, path, { scrollTo, click, wait = 0, h = 800, maxKB = 130 } = {}) {
  const ctx = await desktop(browser, 1440, h + 60, 1.5);
  const p = await ctx.newPage();
  await open(p, SITE + path);
  const top = await demoBar(p);
  if (click) {
    await p.locator(click).first().click({ timeout: 8000 }).catch(e => console.log('  click skipped:', e.message.split('\n')[0]));
    await p.waitForTimeout(1200);
  }
  let y = 0;
  if (scrollTo) {
    y = await p.evaluate(([t, top]) => {
      const el = [...document.querySelectorAll('h1,h2,h3,p,span,div,section')]
        .find(e => e.children.length < 6 && new RegExp(t, 'i').test(e.textContent || '') && e.getBoundingClientRect().height > 0);
      if (!el) return 0;
      const abs = el.getBoundingClientRect().top + scrollY;
      return Math.max(0, abs - top - 110);
    }, [scrollTo, top]);
    await p.evaluate(v => window.scrollTo(0, v), y);
    await p.waitForTimeout(1400);
  }
  if (wait) await p.waitForTimeout(wait);
  const png = await p.screenshot({ type: 'png', scale: 'device', clip: { x: 0, y: top, width: 1440, height: h } });
  const H = Math.round(1600 * h / 1440);
  await encode(png, join(proofDir, name + '.webp'), 1600, H, maxKB);
  await encode(png, join(proofDir, name + '-800.webp'), 800, Math.round(H / 2), Math.round(maxKB / 3));
  await ctx.close();
}

if (run('page')) {
  console.log('page');
  await pageShot('so-collection', '/', { h: 800 });
  await pageShot('so-trip', '/trip', { h: 800 });
  await pageShot('so-journey', '/trip', { scrollTo: 'From the car at the airport', h: 800 });
  await pageShot('so-occasions', '/occasions', { h: 800 });
  await pageShot('so-estate', '/estate', { h: 800 });
  await pageShot('so-partners', '/agents', { h: 800 });
  await pageShot('so-mytrip', '/my-trip', { h: 800 });
  await pageShot('so-owner', '/owner', { h: 800, wait: 1500 });
  {
    const ctx = await phone(browser, 760, 2);
    const p = await ctx.newPage();
    await open(p, SITE + '/');
    const top = await demoBar(p);
    const png = await p.screenshot({ type: 'png', scale: 'device', clip: { x: 0, y: top, width: 390, height: 700 } });
    await ctx.close();
  }
}

await browser.close();
console.log('done');
