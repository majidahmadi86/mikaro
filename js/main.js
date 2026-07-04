/* ================================================================
   MIKARO STUDIO — interactions (v5.1)
   image slots · slider · theater · perf gauges · motion pack ·
   tilt · magnetics · counters · clocks · nav mark · prefill
   ================================================================ */
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const MOBILE=matchMedia('(max-width:768px)').matches;

/* ---------- responsive image slots (Mike's files in /assets/img/) ---------- */
const IMG_SLOTS={
  heroMioSlot:{d:'/assets/img/miomika-hero-desktop.jpg',m:['/assets/img/miomika-hero-mobile.jpg','/assets/img/miomika-hero-desktop-mobile.jpg'],alt:'Miomika — live app',lcp:true},
  mioMainSlot:{d:'/assets/img/miomika-case-desktop.jpg',m:['/assets/img/miomika-case-mobile.jpg','/assets/img/miomika-case-desktop-mobile.jpg'],alt:'Miomika app'},
  heroOcSlot:{d:'/assets/img/opticlean-hero-desktop.jpg',m:['/assets/img/opticlean-hero-mobile.jpg','/assets/img/opticlean-hero-desktop-mobile.jpg'],alt:'OptiClean live store',lcp:true},
  ocMainSlot:{d:'/assets/img/opticlean-case-desktop.jpg',m:['/assets/img/opticlean-case-mobile.jpg','/assets/img/opticlean-case-desktop-mobile.jpg'],alt:'OptiClean storefront'}
};
Object.entries(IMG_SLOTS).forEach(([id,cfg])=>{
  const el=document.getElementById(id);if(!el)return;
  const list=MOBILE&&cfg.m?[].concat(cfg.m,cfg.d):[cfg.d];
  let n=0;
  (function tryNext(){
    if(n>=list.length)return;
    const img=new Image();
    img.onload=()=>{img.alt=cfg.alt;
      if(cfg.lcp){img.loading='eager';img.fetchPriority='high';}else{img.loading='lazy';}
      img.decoding='async';
      const old=el.querySelector('img,svg');if(old)old.remove();
      el.prepend(img);el.classList.add('has-img');};
    img.onerror=()=>{n++;tryNext();};
    img.src=list[n];
  })();
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
    {say:'<b>Direction:</b> Match the client\u2019s mockup \u2014 cream, marigold, Playfair.',
     code:[['c','/* brand DNA \u2014 extracted from one JPEG */'],['k','--cream'],['p',': '],['s','#F5EFE2'],['p',';\n'],['k','--marigold'],['p',': '],['s','#E8B23C'],['p',';\n'],['k','font-family'],['p',': '],['s','\u2019Playfair Display\u2019'],['p',', serif;']],
     ok:'\u2192 shipped \u00b7 opticlean.mikaro.studio \u25cf'},
    {say:'<b>Direction:</b> Wire a real checkout \u2014 euros and Swiss francs.',
     code:[['c','// api/create-checkout-session.js'],['p','\n'],['f','stripe'],['p','.checkout.sessions.'],['f','create'],['p','({\n  '],['k','currency'],['p',': cur, '],['k','line_items'],['p',': [bottle(q)],\n  '],['k','success_url'],['p',': '],['s','\u2019/merci\u2019'],['p','\n});']],
     ok:'\u2192 test card 4242 \u00b7 payment confirmed \u25cf'},
    {say:'<b>Direction:</b> The whole store in French and English \u2014 automatically.',
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

/* ---------- v5.4: mobile menu + photo socials ---------- */
(function(){
  const wrap=document.querySelector('.top .wrap');
  if(wrap&&!document.querySelector('.burger-btn')){
    const b=document.createElement('button');
    b.className='burger-btn';b.setAttribute('aria-label','Open menu');b.setAttribute('aria-expanded','false');
    b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    wrap.appendChild(b);
    const p=document.createElement('div');p.className='mnav';p.setAttribute('role','dialog');p.setAttribute('aria-label','Menu');
    p.innerHTML='<button class="mclose" aria-label="Close menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'
      +'<a class="mlink" href="/" style="--d:.05s">Home</a>'
      +'<a class="mlink" href="/work" style="--d:.12s">Work</a>'
      +'<a class="mlink" href="/services" style="--d:.19s">Services</a>'
      +'<a class="mlink" href="/ai-lab" style="--d:.26s">AI Lab</a>'
      +'<a class="mlink" href="/contact" style="--d:.33s">Contact</a>'
      +'<a class="btn btn-blue mcta" href="/contact">Start a project</a>';
    document.body.appendChild(p);
    function open(){p.classList.add('open');b.setAttribute('aria-expanded','true');}
    function close(){p.classList.remove('open');b.setAttribute('aria-expanded','false');}
    b.addEventListener('click',open);
    p.querySelector('.mclose').addEventListener('click',close);
    p.addEventListener('click',e=>{if(e.target.closest('a'))close();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  }
  document.querySelectorAll('.socials').forEach(s=>{
    const mio=s.querySelector('a[aria-label="Miomika"]');
    if(mio)mio.innerHTML='<img src="/assets/img/miomi-head.png" alt="Miomika" loading="lazy">';
    if(!s.querySelector('a[aria-label="OptiClean"]')){
      const oc=document.createElement('a');
      oc.href='https://opticlean.mikaro.studio';oc.target='_blank';oc.rel='noopener';
      oc.setAttribute('aria-label','OptiClean');oc.title='OptiClean by Dr. Zac';
      oc.innerHTML='<img src="/assets/img/zac.jpg" alt="OptiClean by Dr. Zac" loading="lazy">';
      if(mio&&mio.nextSibling)s.insertBefore(oc,mio.nextSibling);else s.appendChild(oc);
    }
  });
})();

/* ---------- v5.6: menu restructure + blueprint builder ---------- */
(function(){
  const p=document.querySelector('.mnav');
  if(p&&!p.querySelector('.mhead')){
    const close=p.querySelector('.mclose');
    const head=document.createElement('div');head.className='mhead';
    head.innerHTML='<a class="logo" href="/"><i></i>mikaro</a>';
    head.appendChild(close);
    const body=document.createElement('div');body.className='mbody';
    [...p.querySelectorAll('.mlink,.mcta')].forEach(el=>body.appendChild(el));
    p.prepend(head);p.appendChild(body);
  }
})();
(function(){
  const root=document.getElementById('blueprint');if(!root)return;
  const types=[...root.querySelectorAll('.bp-type')],adds=[...root.querySelectorAll('.bp-add')];
  const elP=document.getElementById('bpPages'),elT=document.getElementById('bpTime'),
        elB=document.getElementById('bpBudget'),elS=document.getElementById('bpStack'),
        send=document.getElementById('bpSend');
  const STACK={website:['Design system','Custom code','Hosting'],ecommerce:['Design system','Cart + Stripe','Hosting'],ai:['LLM brain','Voice pipeline','Custom code','Hosting']};
  function tick(el){el.classList.remove('tick');void el.offsetWidth;el.classList.add('tick');}
  function calc(){
    const t=types.find(b=>b.classList.contains('on'));
    const on=adds.filter(b=>b.classList.contains('on'));
    let pages=+t.dataset.pages,w1=+t.dataset.w1,w2=+t.dataset.w2;
    on.forEach(b=>{pages+=+b.dataset.p;});
    w2+=Math.ceil(on.length/2);
    elP.textContent=pages;elT.textContent=w1+'\u2013'+w2+' weeks';elB.textContent=t.dataset.b;
    [elP,elT,elB].forEach(tick);
    elS.innerHTML=STACK[t.dataset.type].concat(on.map(b=>b.dataset.add)).map(s=>'<span class="sp2">'+s+'</span>').join('');
    const want='Blueprint: '+t.textContent.trim()+(on.length?' + '+on.map(b=>b.dataset.add).join(', '):'');
    send.href='/contact?service='+t.dataset.type+'&want='+encodeURIComponent(want);
  }
  types.forEach(b=>b.addEventListener('click',()=>{types.forEach(x=>x.classList.remove('on'));b.classList.add('on');calc();}));
  adds.forEach(b=>b.addEventListener('click',()=>{b.classList.toggle('on');calc();}));
  calc();
})();

/* ---------- v5.7: mobile menu rebuilt from scratch ---------- */
(function(){
  document.querySelectorAll('.burger-btn,.mnav').forEach(e=>e.remove());
  const wrap=document.querySelector('.top .wrap');if(!wrap)return;
  const burger=document.createElement('button');
  burger.className='mm-burger';burger.setAttribute('aria-label','Open menu');burger.setAttribute('aria-expanded','false');
  burger.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  wrap.appendChild(burger);
  const mm=document.createElement('div');
  mm.className='mm';mm.setAttribute('role','dialog');mm.setAttribute('aria-modal','true');mm.setAttribute('aria-label','Menu');
  mm.innerHTML=
    '<div class="mm-top"><a class="logo" href="/"><i></i>mikaro</a>'
    +'<button class="mm-x" aria-label="Close menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'
    +'<nav class="mm-links" aria-label="Mobile">'
    +'<a href="/" style="--d:.04s">Home</a>'
    +'<a href="/work" style="--d:.1s">Work</a>'
    +'<a href="/services" style="--d:.16s">Services</a>'
    +'<a href="/ai-lab" style="--d:.22s">AI Lab</a>'
    +'<a href="/contact" style="--d:.28s">Contact</a>'
    +'</nav>'
    +'<div class="mm-foot"><a class="btn btn-blue" href="/contact">Start a project →</a></div>';
  document.body.appendChild(mm);
  function open(){mm.classList.add('open');document.documentElement.classList.add('mm-lock');document.body.classList.add('mm-lock');burger.setAttribute('aria-expanded','true');}
  function close(){mm.classList.remove('open');document.documentElement.classList.remove('mm-lock');document.body.classList.remove('mm-lock');burger.setAttribute('aria-expanded','false');}
  burger.addEventListener('click',open);
  mm.querySelector('.mm-x').addEventListener('click',close);
  mm.addEventListener('click',e=>{if(e.target.closest('a'))close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
})();

/* ---------- v5.8: cursor spotlight + hero pointer drift ---------- */
(function(){
  if(RM||!matchMedia('(pointer:fine)').matches)return;
  document.querySelectorAll('.mega,.sv').forEach(card=>{
    const g=document.createElement('span');g.className='glow';card.appendChild(g);
    card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect();
      g.style.left=(e.clientX-r.left)+'px';g.style.top=(e.clientY-r.top)+'px';});
  });
  const hero=document.querySelector('.hero');
  if(hero){
    const drift=[['.fl-mio',14],['.fl-oc',-18],['.fl-chat',26],['.fl-chat2',-22],['.st1',30],['.st2',-26]]
      .map(([s,f])=>[hero.querySelector(s),f]).filter(([e])=>e);
    hero.addEventListener('mousemove',e=>{
      const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5;
      drift.forEach(([el,f])=>{el.style.marginLeft=(x*f).toFixed(1)+'px';});
    });
    hero.addEventListener('mouseleave',()=>drift.forEach(([el])=>el.style.marginLeft=''));
  }
})();
