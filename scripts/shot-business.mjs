import { chromium } from 'playwright-core';
import { createServer } from 'http';
import { readFileSync, existsSync, mkdirSync, statSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=join(root,'artifacts','screens');
mkdirSync(outDir,{recursive:true});

const mime={
  '.html':'text/html; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.js':'application/javascript; charset=utf-8',
  '.webp':'image/webp',
  '.png':'image/png',
  '.jpg':'image/jpeg',
  '.svg':'image/svg+xml',
  '.woff2':'font/woff2',
  '.json':'application/json'
};

function serve(port){
  return new Promise(resolve=>{
    const server=createServer((req,res)=>{
      let p=decodeURIComponent((req.url||'/').split('?')[0]);
      if(p.endsWith('/'))p+='index.html';
      if(p==='/th')p='/th/index.html';
      // cleanUrls: /th/business -> th/business.html
      let file=join(root,p.replace(/^\//,''));
      if(!existsSync(file)&&existsSync(file+'.html'))file=file+'.html';
      if(!existsSync(file)||statSync(file).isDirectory()){
        res.writeHead(404);res.end('404');return;
      }
      const type=mime[extname(file)]||'application/octet-stream';
      res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'});
      res.end(readFileSync(file));
    });
    server.listen(port,'127.0.0.1',()=>resolve(server));
  });
}

const widths=[360,390,430,768,1440];
const pages=[
  {slug:'th-business',path:'/th/business'},
  {slug:'en-business',path:'/business'}
];

const port=4177;
const server=await serve(port);
const browser=await chromium.launch({headless:true,executablePath:chromium.executablePath()});

for(const pageDef of pages){
  for(const w of widths){
    const page=await browser.newPage({viewport:{width:w,height:900},deviceScaleFactor:1});
    const url=`http://127.0.0.1:${port}${pageDef.path}`;
    console.log('shot',url,'@',w);
    await page.goto(url,{waitUntil:'networkidle',timeout:60000}).catch(async()=>{
      await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
    });
    // wait fail-open + fonts
    await page.waitForTimeout(2400);
    // force reveals visible for inspection baseline
    await page.evaluate(()=>{
      document.querySelectorAll('.rv,.rv-l,.rv-r,.rv-s,.arv,.zoomin').forEach(el=>el.classList.add('in'));
      document.querySelectorAll('.wsplit').forEach(el=>el.classList.add('hin'));
    });
    await page.evaluate(async()=>{
      const imgs=[...document.querySelectorAll('.biz-proof img')];
      await Promise.all(imgs.map(img=>{
        if(img.complete&&img.naturalWidth)return Promise.resolve();
        return new Promise(res=>{img.onload=img.onerror=()=>res(); img.loading='eager'; if(img.dataset.src)img.src=img.dataset.src; else img.src=img.src;});
      }));
    });
    await page.waitForTimeout(400);
    const dest=join(outDir,`${pageDef.slug}-${w}.png`);
    await page.screenshot({path:dest,fullPage:true,type:'png'});
    // metrics for checklist
    const metrics=await page.evaluate(()=>{
      const heads=[...document.querySelectorAll('.shead h2,.phero h1')];
      const faded=[...document.querySelectorAll('.rv,.arv')].filter(el=>{
        const o=getComputedStyle(el).opacity;return parseFloat(o)<0.95;
      }).length;
      const imgs=[...document.querySelectorAll('.biz-proof img')];
      const imgOk=imgs.every(img=>img.complete&&img.naturalWidth>0);
      const pkgs=document.querySelectorAll('.biz-pkg').length;
      const sticky=document.getElementById('bizSticky');
      const stickyOn=!!(sticky&&sticky.classList.contains('on'));
      const pad=getComputedStyle(document.body).paddingBottom;
      const h2=heads.map(h=>({
        text:h.textContent.trim().slice(0,40),
        lh:getComputedStyle(h).lineHeight,
        ov:getComputedStyle(h).overflow
      }));
      const firstTier=document.querySelector('.biz-pkg')?.getAttribute('data-tier')||'';
      return {faded,imgOk,imgs:imgs.length,pkgs,stickyOn,pad,h2,firstTier,wsplit:!!document.querySelector('.wsplit')};
    });
    console.log(JSON.stringify({page:pageDef.slug,w,...metrics}));
    await page.close();
  }
}

await browser.close();
server.close();
console.log('done ->',outDir);
