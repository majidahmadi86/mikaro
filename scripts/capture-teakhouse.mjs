import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root=dirname(fileURLToPath(import.meta.url));
const outDir=join(root,'..','assets','img','proof');
mkdirSync(outDir,{recursive:true});

async function toProofWebp(png,dest){
  let q=78;
  const resize=()=>sharp(png).resize({width:1200,withoutEnlargement:true}).webp({quality:q}).toBuffer();
  let buf=await resize();
  while(buf.length>150*1024&&q>40){
    q-=6;
    buf=await resize();
  }
  await sharp(buf).toFile(dest);
  const meta=await sharp(buf).metadata();
  console.log(dest,meta.width+'x'+meta.height,Math.round(buf.length/1024)+'KB','q='+q);
}

async function waitReady(page){
  await page.goto('https://teakhouse.mikaro.studio',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForLoadState('networkidle',{timeout:15000}).catch(()=>{});
  await page.evaluate(()=>{
    try{
      localStorage.setItem('lang','en');
      localStorage.setItem('teak-lang','en');
      localStorage.setItem('locale','en');
    }catch{}
    document.documentElement.lang='en';
    const btns=[...document.querySelectorAll('button,a,[role="button"],[data-lang]')];
    const en=btns.find(el=>{
      const t=(el.textContent||'').trim();
      const lang=el.getAttribute('data-lang')||'';
      return lang==='en'||/^\s*EN\s*$/i.test(t)||/english/i.test(el.getAttribute('aria-label')||'');
    });
    if(en)en.click();
  });
  await page.evaluate(async()=>{
    if(document.fonts&&document.fonts.ready)await document.fonts.ready.catch(()=>{});
    const imgs=[...document.images];
    await Promise.all(imgs.slice(0,12).map(img=>{
      if(img.complete&&img.naturalWidth)return;
      return new Promise(res=>{
        const done=()=>res();
        img.onload=done;img.onerror=done;
        setTimeout(done,8000);
      });
    }));
  });
  await page.waitForTimeout(500);
}

const edgeCandidates=[
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];
const exe=edgeCandidates.find(p=>existsSync(p))||chromium.executablePath();
const browser=await chromium.launch({
  headless:true,
  executablePath:exe
});

{
  const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  console.log('capturing desktop 1440 EN hero');
  await waitReady(page);
  const png=await page.screenshot({type:'png',clip:{x:0,y:0,width:1440,height:820}});
  await toProofWebp(png,join(outDir,'teakhouse.webp'));
  await page.close();
}

{
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
  console.log('capturing mobile 390');
  await waitReady(page);
  const png=await page.screenshot({type:'png',clip:{x:0,y:0,width:390,height:700}});
  await toProofWebp(png,join(outDir,'teakhouse-m.webp'));
  await page.close();
}

await browser.close();
console.log('done');
