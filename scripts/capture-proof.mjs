import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root=dirname(fileURLToPath(import.meta.url));
const outDir=join(root,'..','assets','img','proof');
mkdirSync(outDir,{recursive:true});

const sites=[
  {slug:'praow',url:'https://praow.mikaro.studio'},
  {slug:'mali',url:'https://mali.mikaro.studio'},
  {slug:'opticlean',url:'https://opticlean.mikaro.studio'},
  {slug:'outsiders',url:'https://outsiderslegal.mikaro.studio'}
];

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
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});

for(const s of sites){
  console.log('capturing',s.url);
  await page.goto(s.url,{waitUntil:'networkidle',timeout:60000}).catch(async()=>{
    await page.goto(s.url,{waitUntil:'domcontentloaded',timeout:60000});
  });
  await page.waitForTimeout(1200);
  const png=await page.screenshot({type:'png',clip:{x:0,y:0,width:1440,height:820}});
  let q=78;
  const resize=()=>sharp(png).resize({width:1200,withoutEnlargement:true}).webp({quality:q}).toBuffer();
  let buf=await resize();
  while(buf.length>150*1024&&q>40){
    q-=6;
    buf=await resize();
  }
  const dest=join(outDir,s.slug+'.webp');
  await sharp(buf).toFile(dest);
  console.log(s.slug,Math.round(buf.length/1024)+'KB','q='+q);
}
await browser.close();
console.log('done');
