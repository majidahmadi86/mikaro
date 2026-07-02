/* ================================================================
   MIKARO STUDIO — interactions
   asset slots · 3D tilt · magnetic buttons · bubbles · counters ·
   reveals · Bangkok clock · marquee
   ================================================================ */
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;

/* ---------- asset slots: swap in real images with one URL each ---------- */
(function(){
  function slot(id,url,alt){
    if(!url)return;
    const el=document.getElementById(id);if(!el)return;
    const img=new Image();
    img.onload=()=>{el.innerHTML='';img.alt=alt;img.loading='lazy';img.decoding='async';el.appendChild(img);};
    img.src=url;
  }
  slot('heroMioSlot',ASSETS.mioHero,'Miomika app');
  slot('mioMainSlot',ASSETS.mioMain,'Miomika — Miomi the cat');
  if(ASSETS.zacPhoto){
    const av=document.getElementById('zacAvatar');
    const img=new Image();
    img.onload=()=>{av.textContent='';img.alt='Dr. Zac';av.appendChild(img);};
    img.src=ASSETS.zacPhoto;
  }
})();

/* ---------- 3D tilt on mega cards ---------- */
if(matchMedia('(pointer:fine)').matches&&!RM){
  document.querySelectorAll('.tilt').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
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
  const io=new IntersectionObserver(es=>{es.forEach(en=>{
    if(en.isIntersecting){
      setTimeout(()=>document.getElementById('mb1').classList.add('show'),RM?0:300);
      setTimeout(()=>document.getElementById('mb2').classList.add('show'),RM?0:1300);
      io.disconnect();
    }
  });},{threshold:.4});
  io.observe(document.getElementById('mioVis'));
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

/* ---------- reveals ---------- */
const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});},{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

/* ---------- BKK clock ---------- */
function bkk(){try{
  const t=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Bangkok',hour:'2-digit',minute:'2-digit'}).format(new Date());
  const c=document.getElementById('clock');if(c)c.textContent=t;
}catch(e){}}
bkk();setInterval(bkk,15000);

/* ---------- marquee dup ---------- */
(function(){const t=document.getElementById('mqt');t.innerHTML+=t.innerHTML;})();
