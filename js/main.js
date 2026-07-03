/* ================================================================
   MIKARO STUDIO — interactions
   responsive image slots · tilt · magnetics · bubbles · counters ·
   reveals · Bangkok clock · marquee · active nav · build-log typer
   ================================================================ */
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;

/* ---------- responsive image slots ----------
   Mike drops files into /assets/img/ with these exact names.
   Loader picks desktop or mobile by viewport, falls back to the
   drawn placeholder (or hotlinked live-store shot) when absent. */
const IMG_SLOTS={
  heroMioSlot:{d:'/assets/img/miomika-hero-desktop.jpg',m:'/assets/img/miomika-hero-mobile.jpg',alt:'Miomika — Miomi the cat'},
  mioMainSlot:{d:'/assets/img/miomika-case-desktop.jpg',m:'/assets/img/miomika-case-mobile.jpg',alt:'Miomika app'},
  mioCaseSlot:{d:'/assets/img/miomika-case-desktop.jpg',m:'/assets/img/miomika-case-mobile.jpg',alt:'Miomika app'},
  heroOcSlot:{d:'/assets/img/opticlean-hero-desktop.jpg',m:'/assets/img/opticlean-hero-mobile.jpg',alt:'OptiClean live store'},
  ocMainSlot:{d:'/assets/img/opticlean-case-desktop.jpg',m:'/assets/img/opticlean-case-mobile.jpg',alt:'OptiClean storefront'},
  ocCaseSlot:{d:'/assets/img/opticlean-case-desktop.jpg',m:'/assets/img/opticlean-case-mobile.jpg',alt:'OptiClean storefront'}
};
(function(){
  const mobile=matchMedia('(max-width:768px)').matches;
  Object.entries(IMG_SLOTS).forEach(([id,cfg])=>{
    const el=document.getElementById(id);if(!el)return;
    const img=new Image();
    img.onload=()=>{img.alt=cfg.alt;img.loading='lazy';img.decoding='async';const old=el.querySelector('img,svg');if(old)old.remove();el.prepend(img);el.classList.add('has-img');};
    img.src=mobile&&cfg.m?cfg.m:cfg.d;
  });
  const av=document.getElementById('zacAvatar');
  if(av){const img=new Image();img.onload=()=>{av.textContent='';img.alt='Dr. Zac';av.appendChild(img);};img.src='/assets/img/zac.jpg';}
})();

/* ---------- active nav ---------- */
(function(){
  const path=location.pathname.replace(/\/index\.html$/,'/');
  document.querySelectorAll('.top-links a').forEach(a=>{
    const href=a.getAttribute('href');
    if(href==='/'&&(path==='/'||path==='')) a.classList.add('active');
    else if(href!=='/'&&path.startsWith(href.replace('.html',''))) a.classList.add('active');
  });
})();

/* ---------- 3D tilt ---------- */
if(matchMedia('(pointer:fine)').matches&&!RM){
  document.querySelectorAll('.tilt').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(1200px) rotateX(${-y*3}deg) rotateY(${x*4}deg)`;
    });
    card.addEventListener('mouseleave',()=>{card.style.transform='';});
  });
}

/* ---------- magnetic buttons ---------- */
if(matchMedia('(pointer:fine)').matches&&!RM){
  document.querySelectorAll('.magnet').forEach(b=>{
    b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();
      b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.14}px,${(e.clientY-r.top-r.height/2)*.26}px)`;});
    b.addEventListener('mouseleave',()=>b.style.transform='');
  });
}

/* ---------- miomika bubbles ---------- */
(function(){
  const stage=document.getElementById('mioVis');if(!stage)return;
  const io=new IntersectionObserver(es=>{es.forEach(en=>{
    if(en.isIntersecting){
      const b1=document.getElementById('mb1'),b2=document.getElementById('mb2');
      if(b1)setTimeout(()=>b1.classList.add('show'),RM?0:300);
      if(b2)setTimeout(()=>b2.classList.add('show'),RM?0:1300);
      io.disconnect();
    }
  });},{threshold:.4});
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
    if(en.isIntersecting&&!started){
      started=true;io.disconnect();
      let li=0,ci=0,buf="";
      (function type(){
        if(li>=lines.length){out.innerHTML=buf;return;}
        buf+=lines[li][ci]||"";ci++;
        if(ci>lines[li].length){buf+="\n";li++;ci=0;}
        out.innerHTML=buf+'<span class="tcur"></span>';
        setTimeout(type,ci===0?170:(lines[li]&&lines[li][ci-1]==='.'?7:15));
      })();
    }
  });},{threshold:.3});
  io.observe(out);
})();

/* ---------- reveals ---------- */
const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});},{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

/* ---------- BKK clock ---------- */
function bkk(){try{
  const t=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Bangkok',hour:'2-digit',minute:'2-digit'}).format(new Date());
  document.querySelectorAll('[data-clock]').forEach(el=>el.textContent=t);
}catch(e){}}
bkk();setInterval(bkk,15000);

/* ---------- marquee dup ---------- */
(function(){const t=document.getElementById('mqt');if(t)t.innerHTML+=t.innerHTML;})();

/* ---------- contact form: service preselect from ?service= ---------- */
(function(){
  const sel=document.getElementById('cfService');if(!sel)return;
  const s=new URLSearchParams(location.search).get('service');
  if(s){[...sel.options].forEach(o=>{if(o.value===s)sel.value=s;});}
})();
