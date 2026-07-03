/* ================================================================
   MIKARO STUDIO — interactions (v5.1)
   image slots · slider · theater · perf gauges · motion pack ·
   tilt · magnetics · counters · clocks · nav mark · prefill
   ================================================================ */
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const MOBILE=matchMedia('(max-width:768px)').matches;

/* ---------- responsive image slots (Mike's files in /assets/img/) ---------- */
const IMG_SLOTS={
  heroMioSlot:{d:'/assets/img/miomika-hero-desktop.jpg',m:'/assets/img/miomika-hero-mobile.jpg',alt:'Miomika — live app'},
  mioMainSlot:{d:'/assets/img/miomika-case-desktop.jpg',m:'/assets/img/miomika-case-mobile.jpg',alt:'Miomika app'},
  heroOcSlot:{d:'/assets/img/opticlean-hero-desktop.jpg',m:'/assets/img/opticlean-hero-mobile.jpg',alt:'OptiClean live store'},
  ocMainSlot:{d:'/assets/img/opticlean-case-desktop.jpg',m:'/assets/img/opticlean-case-mobile.jpg',alt:'OptiClean storefront'}
};
Object.entries(IMG_SLOTS).forEach(([id,cfg])=>{
  const el=document.getElementById(id);if(!el)return;
  const img=new Image();
  img.onload=()=>{img.alt=cfg.alt;img.loading='lazy';img.decoding='async';
    const old=el.querySelector('img,svg');if(old)old.remove();
    el.prepend(img);el.classList.add('has-img');};
  img.src=MOBILE&&cfg.m?cfg.m:cfg.d;
});
(function(){const av=document.getElementById('zacAvatar');
  if(av){const img=new Image();img.onload=()=>{av.textContent='';img.alt='Dr. Zac';av.appendChild(img);};img.src='/assets/img/zac.jpg';}})();

/* ---------- case slider: known pair + auto-detected gallery shots ---------- */
(function(){
  const el=document.getElementById('caseSlider');if(!el)return;
  const key=el.dataset.project; // 'miomika' | 'opticlean'
  const base=['/assets/img/'+key+'-hero-desktop.jpg','/assets/img/'+key+'-case-desktop.jpg'];
  const maybe=[];for(let i=1;i<=6;i++)maybe.push('/assets/img/'+key+'-gallery-'+i+'.jpg');
  const found=[];let pending=base.length+maybe.length;
  function done(){
    if(--pending>0)return;
    const shots=base.filter(s=>found.includes(s)).concat(maybe.filter(s=>found.includes(s)));
    if(!shots.length)return; // keep placeholder
    build(shots);
  }
  [...base,...maybe].forEach(src=>{const im=new Image();im.onload=()=>{found.push(src);done();};im.onerror=done;im.src=src;});

  function build(shots){
    el.innerHTML=`
      <div class="bframe slider" style="width:min(100%,900px)">
        <div class="bbar2"><i></i><i></i><i></i><span class="url">${key==='miomika'?'miomika.com':'opticlean.mikaro.studio'}</span></div>
        <div class="track-wrap"><div class="track">${shots.map(s=>`<div><img src="${s}" alt="${key} screenshot" loading="lazy" decoding="async"></div>`).join('')}</div></div>
        ${shots.length>1?`
        <button class="sarrow sprev" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>
        <button class="sarrow snext" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></button>
        <div class="sdots">${shots.map((_,i)=>`<button aria-label="Slide ${i+1}"${i===0?' class="on"':''}></button>`).join('')}</div>`:''}
      </div>`;
    if(shots.length<2)return;
    const track=el.querySelector('.track'),dots=[...el.querySelectorAll('.sdots button')];
    let i=0,timer;
    function go(n){i=(n+shots.length)%shots.length;track.style.transform=`translateX(-${i*100}%)`;dots.forEach((d,k)=>d.classList.toggle('on',k===i));}
    function auto(){if(RM)return;clearInterval(timer);timer=setInterval(()=>go(i+1),4200);}
    el.querySelector('.sprev').addEventListener('click',()=>{go(i-1);auto();});
    el.querySelector('.snext').addEventListener('click',()=>{go(i+1);auto();});
    dots.forEach((d,k)=>d.addEventListener('click',()=>{go(k);auto();}));
    el.addEventListener('mouseenter',()=>clearInterval(timer));
    el.addEventListener('mouseleave',auto);
    auto();
  }
})();

/* ---------- AI pair-programming theater ---------- */
(function(){
  const stage=document.getElementById('theater');if(!stage)return;
  const dir=stage.querySelector('.dir'),code=stage.querySelector('.code');
  const SCENES=[
    {say:'<b>Mike:</b> Match the client\u2019s mockup \u2014 cream, marigold, Playfair.',
     code:[['c','/* brand DNA \u2014 extracted from one JPEG */'],['k','--cream'],['p',': '],['s','#F5EFE2'],['p',';\n'],['k','--marigold'],['p',': '],['s','#E8B23C'],['p',';\n'],['k','font-family'],['p',': '],['s','\u2019Playfair Display\u2019'],['p',', serif;']],
     ok:'\u2192 shipped \u00b7 opticlean.mikaro.studio \u25cf'},
    {say:'<b>Mike:</b> Wire a real checkout \u2014 euros and Swiss francs.',
     code:[['c','// api/create-checkout-session.js'],['p','\n'],['f','stripe'],['p','.checkout.sessions.'],['f','create'],['p','({\n  '],['k','currency'],['p',': cur, '],['k','line_items'],['p',': [bottle(q)],\n  '],['k','success_url'],['p',': '],['s','\u2019/merci\u2019'],['p','\n});']],
     ok:'\u2192 test card 4242 \u00b7 payment confirmed \u25cf'},
    {say:'<b>Mike:</b> The whole store in French and English \u2014 automatically.',
     code:[['c','// bilingual, detected from the browser'],['p','\n'],['f','setLang'],['p','(navigator.language.'],['f','startsWith'],['p','('],['s','\u2019fr\u2019'],['p',') ? '],['s','\u2019fr\u2019'],['p',' : '],['s','\u2019en\u2019'],['p',');\n'],['c','// 10 pages \u00b7 EUR/CHF \u00b7 SEO per locale']],
     ok:'\u2192 FR/EN live \u00b7 zero translation debt \u25cf'}
  ];
  let s=0,started=false;
  function esc(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;');}
  function playScene(){
    const sc=SCENES[s];
    dir.innerHTML='';code.innerHTML='';
    const db=document.createElement('div');db.className='db';db.innerHTML=sc.say;dir.appendChild(db);
    requestAnimationFrame(()=>setTimeout(()=>db.classList.add('show'),60));
    const toks=sc.code;let ti=0,ci=0,buf='';
    function type(){
      if(ti>=toks.length){
        code.innerHTML=buf;
        const ok=document.createElement('div');ok.className='db ok';ok.textContent=sc.ok;dir.appendChild(ok);
        requestAnimationFrame(()=>setTimeout(()=>ok.classList.add('show'),60));
        setTimeout(()=>{s=(s+1)%SCENES.length;playScene();},3600);return;
      }
      const[cls,txt]=toks[ti];
      buf+= ci===0 && cls!=='p' ? '<span class="'+cls+'">' : '';
      buf+=esc(txt[ci]||'');ci++;
      if(ci>=txt.length){ if(cls!=='p')buf+='</span>'; ti++;ci=0; }
      code.innerHTML=buf+'<span class="tcur2"></span>';
      setTimeout(type,RM?0:18);
    }
    setTimeout(type,RM?0:700);
  }
  const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting&&!started){started=true;io.disconnect();
    if(RM){dir.innerHTML='<div class="db show">'+SCENES[0].say+'</div><div class="db ok show">'+SCENES[0].ok+'</div>';return;}
    playScene();}});},{threshold:.3});
  io.observe(stage);
})();

/* ---------- perf gauges ---------- */
(function(){
  document.querySelectorAll('.gauge').forEach(g=>{
    const v=+g.dataset.val,r=48,C=2*Math.PI*r;
    g.innerHTML=`<svg viewBox="0 0 110 110"><circle cx="55" cy="55" r="${r}" fill="none" stroke="#EDE5DA" stroke-width="9"/><circle class="arc" cx="55" cy="55" r="${r}" fill="none" stroke="${g.classList.contains('blue')?'#2438FF':'#16A34A'}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg><span class="val">${g.dataset.label||v}</span>`+g.innerHTML;
    const arc=g.querySelector('.arc');
    const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){io.disconnect();
      arc.style.transition=RM?'none':'stroke-dashoffset 1.6s cubic-bezier(.22,1,.36,1)';
      requestAnimationFrame(()=>arc.style.strokeDashoffset=C*(1-v/100));}});},{threshold:.5});
    io.observe(g);
  });
})();

/* ---------- nav: active link + scroll mark ---------- */
(function(){
  const path=location.pathname.replace(/\.html$/,'').replace(/\/index$/,'/');
  document.querySelectorAll('.top-links a').forEach(a=>{
    const href=a.getAttribute('href').replace(/\.html$/,'');
    if(href!=='/'&&path.startsWith(href))a.classList.add('active');
    else if(href==='/'&&path==='/')a.classList.add('active');
  });
  addEventListener('scroll',()=>{document.body.classList.toggle('scrolled',scrollY>90);},{passive:true});
})();

/* ---------- tilt / magnetics ---------- */
if(matchMedia('(pointer:fine)').matches&&!RM){
  document.querySelectorAll('.tilt').forEach(card=>{
    card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(1200px) rotateX(${-y*3}deg) rotateY(${x*4}deg)`;});
    card.addEventListener('mouseleave',()=>{card.style.transform='';});
  });
  document.querySelectorAll('.magnet').forEach(b=>{
    b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();
      b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.14}px,${(e.clientY-r.top-r.height/2)*.26}px)`;});
    b.addEventListener('mouseleave',()=>b.style.transform='');
  });
}

/* ---------- hero collage scroll parallax ---------- */
(function(){
  if(RM)return;
  const els=[['.fl-mio',.05],['.fl-oc',-.04],['.st1',.09],['.st2',-.07]].map(([s,f])=>[document.querySelector(s),f]).filter(([e])=>e);
  if(!els.length)return;
  addEventListener('scroll',()=>{const y=scrollY;if(y>900)return;
    els.forEach(([e,f])=>{e.style.marginTop=(y*f)+'px';});},{passive:true});
})();

/* ---------- miomika bubbles ---------- */
(function(){
  const stage=document.getElementById('mioVisWrap')||document.getElementById('mioVis');if(!stage)return;
  const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){
    const b1=document.getElementById('mb1'),b2=document.getElementById('mb2');
    if(b1)setTimeout(()=>b1.classList.add('show'),RM?0:300);
    if(b2)setTimeout(()=>b2.classList.add('show'),RM?0:1300);
    io.disconnect();}});},{threshold:.4});
  io.observe(stage);
})();

/* ---------- count-up ---------- */
(function(){
  const io=new IntersectionObserver(es=>{es.forEach(en=>{
    if(!en.isIntersecting)return;io.unobserve(en.target);
    const b=en.target,target=+b.dataset.count;
    if(RM||target===0){b.textContent=target;return;}
    let cur=0;const step=Math.max(1,Math.round(target/26));
    const iv=setInterval(()=>{cur=Math.min(target,cur+step);b.textContent=cur;if(cur>=target)clearInterval(iv);},40);
  });},{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(el=>io.observe(el));
})();

/* ---------- build-log typer (AI Lab) ---------- */
(function(){
  const out=document.getElementById('buildlog');if(!out)return;
  const lines=JSON.parse(document.getElementById('buildlog-lines').textContent);
  if(RM){out.textContent=lines.join("\n");return;}
  let started=false;
  const io=new IntersectionObserver(es=>{es.forEach(en=>{
    if(en.isIntersecting&&!started){started=true;io.disconnect();
      let li=0,ci=0,buf="";
      (function type(){
        if(li>=lines.length){out.innerHTML=buf;return;}
        buf+=lines[li][ci]||"";ci++;
        if(ci>lines[li].length){buf+="\n";li++;ci=0;}
        out.innerHTML=buf+'<span class="tcur">'+'</span>';
        setTimeout(type,ci===0?170:(lines[li]&&lines[li][ci-1]==='.'?7:15));
      })();}
  });},{threshold:.3});
  io.observe(out);
})();

/* ---------- motion pack: reveals (all variants) + zoom + stagger ---------- */
(function(){
  document.querySelectorAll('.serv-g .sv, .stats-g .stat, .proc-g .pst').forEach((el,i)=>{el.style.transitionDelay=(i%6)*.07+'s';});
  const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});},{threshold:.12});
  document.querySelectorAll('.rv,.rv-l,.rv-r,.rv-s,.zoomin').forEach(el=>io.observe(el));
})();

/* ---------- BKK clocks ---------- */
function bkk(){try{
  const t=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Bangkok',hour:'2-digit',minute:'2-digit'}).format(new Date());
  document.querySelectorAll('[data-clock]').forEach(el=>el.textContent=t);
}catch(e){}}
bkk();setInterval(bkk,15000);

/* ---------- marquee dup ---------- */
(function(){const t=document.getElementById('mqt');if(t)t.innerHTML+=t.innerHTML;})();

/* ---------- contact: ?service= preselect + ?want= prefill ---------- */
(function(){
  const q=new URLSearchParams(location.search);
  const sel=document.getElementById('cfService');
  if(sel){const s=q.get('service');if(s)[...sel.options].forEach(o=>{if(o.value===s)sel.value=s;});}
  const msg=document.querySelector('textarea[name="message"]');
  const want=q.get('want');
  if(msg&&want){msg.value='I want this — something like '+want+' for my brand. Here is my idea: ';msg.focus();msg.setSelectionRange(msg.value.length,msg.value.length);}
})();

/* ---------- v5.2 scroll engine: parallax depth + marquee velocity + clip reveals ---------- */
(function(){
  if(RM)return;
  document.querySelectorAll('.mega .bframe').forEach(el=>el.dataset.sp='0.42');
  document.querySelectorAll('.case-hero .bframe').forEach(el=>el.dataset.sp='0.3');
  document.querySelectorAll('.testi-card .avatar').forEach(el=>el.dataset.sp='0.22');
  document.querySelectorAll('.perf-badges').forEach(el=>el.dataset.sp='0.2');
  document.querySelectorAll('.cta-card h2').forEach(el=>el.dataset.sp='0.16');
  const els=[...document.querySelectorAll('[data-sp]')].map(el=>[el,parseFloat(el.dataset.sp)]);
  const mq=document.querySelector('.mq');
  let lastY=scrollY,vel=0;
  (function frame(){
    const y=scrollY;
    vel+=((Math.min(Math.abs(y-lastY),50))*(y>=lastY?1:-1)-vel)*.1;lastY=y;
    els.forEach(([el,f])=>{
      const r=el.getBoundingClientRect();
      const p=(innerHeight-r.top)/(innerHeight+r.height);
      if(p>-.2&&p<1.2)el.style.transform='translateY('+((p-.5)*f*-150).toFixed(1)+'px)';
    });
    if(mq)mq.style.transform='skewX('+(-vel*.3).toFixed(2)+'deg)';
    requestAnimationFrame(frame);
  })();
  const clips=document.querySelectorAll('.shead h2,.phero h1,.ai h2,.perf-copy h3');
  clips.forEach(el=>el.classList.add('clipin'));
  const cio=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');cio.unobserve(en.target);}});},{threshold:.35});
  clips.forEach(el=>cio.observe(el));
})();

/* ---------- v5.3: word-split headlines + auto-motion for every element ---------- */
(function(){
  if(RM)return;
  function wsplit(el){
    const units=[];
    [...el.childNodes].forEach(n=>{
      if(n.nodeType===3){
        n.textContent.split(/(\s+)/).forEach(w=>{
          if(!w)return;
          if(/^\s+$/.test(w)){units.push(document.createTextNode(' '));return;}
          const s=document.createElement('span');s.className='wu';
          const i=document.createElement('i');i.textContent=w;s.appendChild(i);units.push(s);
        });
      }else if(n.nodeType===1){
        if(n.tagName==='BR'){units.push(document.createElement('br'));return;}
        const s=document.createElement('span');s.className='wu';
        const i=document.createElement('i');i.appendChild(n.cloneNode(true));s.appendChild(i);units.push(s);
      }
    });
    el.textContent='';units.forEach(u=>el.appendChild(u));
    [...el.querySelectorAll('.wu')].forEach((u,k)=>u.style.setProperty('--d',(k*.055)+'s'));
    el.classList.add('wsplit');
  }
  const heads=document.querySelectorAll('.phero h1,.shead h2,.hero h1,.ai h2,.mega h3,.perf-copy h3,.cta-card h2,.consult-band h3');
  heads.forEach(h=>{try{wsplit(h);}catch(e){}});
  const hio=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('hin');hio.unobserve(en.target);}});},{threshold:.5});
  heads.forEach(h=>hio.observe(h));

  const AUTO='.mega .txt>p,.mega .txt .tag,.mega .txt .stats-row,.mega .txt .btn-row,.phero .pill,.phero p,.case-body>*,.meta,.ct-card,.cform .cf,.cform button,.cside>*,.next-proj,.consult-band,.hero .sub,.hero-ctas,.hero-proof,.hero .badge,.serv-g .sv,.proc-g .pst,.bloq,.theater,.perf-badges>div';
  const seen=new Set();
  document.querySelectorAll(AUTO).forEach(el=>{
    if(seen.has(el)||el.classList.contains('rv')||el.classList.contains('rv-s'))return;
    seen.add(el);el.classList.add('arv');
  });
  const groups=new Map();
  document.querySelectorAll('.arv').forEach(el=>{
    const p=el.parentElement;if(!groups.has(p))groups.set(p,0);
    const k=groups.get(p);groups.set(p,k+1);
    el.style.setProperty('--d',(k*.09)+'s');
  });
  const aio=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');aio.unobserve(en.target);}});},{threshold:.15});
  document.querySelectorAll('.arv').forEach(el=>aio.observe(el));
})();
