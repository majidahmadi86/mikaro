/* ================================================================
   MIKA — studio guide widget
   MIKA.mount(el) renders a chat instance; a floating launcher is
   added automatically on every page (skip with <body data-no-fab>).
   Scripted intent brain with keyword scoring, in-answer action
   chips, and a lead-capture form wired to FormSubmit.
   Runs fully in-browser; the lead form is the only network call.
   ================================================================ */
(function(){
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const FORM_ENDPOINT='https://formsubmit.co/ajax/majid.ahmadi86@gmail.com';

/* ---------- brain ---------- */
const INTENTS=[
 {k:['hi','hello','hey','sawasdee','สวัสดี','bonjour','good morning','good evening'],a:`Hello — I'm MIKA, the studio's guide. Ask me what we build, how the AI part works, what things cost, or use the buttons below.`,acts:[{q:'What do you build?',l:'What do you build?'},{q:'pricing',l:'Pricing'}]},
 {k:['build','do you do','services','offer','make','capab'],a:`We design and build complete digital products: brand-true websites, e-commerce with real payments, and AI-powered apps. Two are live right now — Miomika and OptiClean — and you can click both.`,acts:[{h:'/work.html',l:'See the work'},{h:'/services.html',l:'All services'}]},
 {k:['work','portfolio','case','project','live','show','example'],a:`Everything in our portfolio is in production — no mockups. Miomika is our own voice-first AI companion; OptiClean is a complete bilingual store with a working Stripe checkout (test card 4242 4242 4242 4242).`,acts:[{h:'/work/miomika.html',l:'Miomika case'},{h:'/work/opticlean.html',l:'OptiClean case'}]},
 {k:['miomika','miomi','cat','thai','language','learn'],a:`Miomika is our flagship: a voice-first companion where Miomi the cat teaches Thai and English through real conversation. Teaching brain, speech pipeline, payments with referrals, full admin console — all in-house.`,acts:[{h:'https://miomika.com',l:'Visit miomika.com ↗',x:1},{h:'/work/miomika.html',l:'Read the case'}]},
 {k:['opticlean','zac','store','shop','ecommerce','e-commerce','stripe','checkout'],a:`OptiClean by Dr. Zac — a vintage French apothecary brand we turned into a complete live store from a single reference image. Ten bilingual pages, EUR/CHF, working Stripe checkout. Try a test purchase with card 4242 4242 4242 4242.`,acts:[{h:'https://opticlean.mikaro.studio',l:'Enter the store ↗',x:1},{h:'/work/opticlean.html',l:'Read the case'}]},
 {k:['ai','artificial','llm','gpt','claude','model','machine','automat'],a:`Mikaro pairs senior creative direction with an AI-accelerated engineering pipeline — every decision human, every build amplified. The AI Lab page shows exactly how.`,acts:[{h:'/ai-lab.html',l:'Visit the AI Lab'}]},
 {k:['price','cost','budget','much','rate','quote','fee','pay'],a:`Projects are scoped individually — a focused brand site and a full commerce build are different animals. Tell me roughly what you're making and I'll connect you, or leave your email and Mike replies within a day.`,acts:[{q:'__lead',l:'Leave my email'},{h:'/contact.html',l:'Contact form'}]},
 {k:['time','long','timeline','fast','deadline','when','delivery'],a:`Efficient without cutting corners. A focused brand site typically lands in 2–3 weeks; commerce and AI builds are scoped case by case — you get a concrete timeline before anything starts.`,acts:[{q:'__lead',l:'Get an estimate'}]},
 {k:['process','how do you work','steps','method','workflow'],a:`Four steps, no mystery: Listen (the brief is written together), Design (a system built from your world, never a UI kit), Build (custom code end to end — payments, languages, admin), Ship (live on a URL, measured, improved).`,acts:[{h:'/services.html',l:'Services'},{h:'/contact.html',l:'Start a project'}]},
 {k:['language','bilingual','french','thai','english','translat'],a:`We've shipped Thai, English and French so far — proper language switching with per-locale SEO, not machine-translated afterthoughts.`,acts:[{h:'/work/opticlean.html',l:'See a bilingual build'}]},
 {k:['where','location','bangkok','based','country','remote'],a:`Bangkok, Thailand — working worldwide. It's <b data-clock>--:--</b> here right now, and Mike usually replies within a day.`,acts:[{h:'/contact.html',l:'Contact'}]},
 {k:['contact','email','reach','talk','call','hire','start'],a:`Two ways: the contact form (fastest — it lands straight in Mike's inbox), or leave your email right here and he'll write to you.`,acts:[{h:'/contact.html',l:'Open the form'},{q:'__lead',l:'Leave my email'}]},
 {k:['who','about','team','studio','founder','mike'],a:`Mikaro is a creative technology studio in Bangkok — senior creative direction paired with an AI-accelerated engineering pipeline. Compact, uncompromising on detail — and everything in the portfolio is live.`,acts:[{h:'/work.html',l:'Proof'}]},
 {k:['seo','performance','speed','lighthouse','schema'],a:`Every build ships with structured data, sitemaps, lazy loading and zero framework bloat — fast by construction, not by afterthought.`,acts:[{q:'What do you build?',l:'What else is included?'}]}
];
const FALLBACK={a:`Good question — I'm a compact guide, so for the interesting conversations there's a human. Leave your email and Mike replies within a day, or try one of these.`,acts:[{q:'__lead',l:'Leave my email'},{q:'What do you build?',l:'What do you build?'},{q:'pricing',l:'Pricing'}]};

function pick(q){
  const s=q.toLowerCase();let best=null,score=0;
  for(const it of INTENTS){
    let n=0;for(const k of it.k){if(s.includes(k))n+=k.length>3?2:1;}
    if(n>score){score=n;best=it;}
  }
  return score>0?best:FALLBACK;
}

/* ---------- ui ---------- */
function esc(t){const d=document.createElement('div');d.textContent=t;return d.innerHTML;}
const ICON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z"/><path d="M9 11h.01M13 11h.01M17 11h.01"/></svg>';

function mount(root){
  root.innerHTML=`
  <div class="chat">
    <div class="chat-bar"><span class="av">M</span>MIKA — studio guide<span class="on"><span style="width:8px;height:8px;border-radius:50%;background:#22C55E;display:inline-block"></span>online</span></div>
    <div class="chat-log" aria-live="polite"></div>
    <div class="chat-chips">
      <button data-q="What do you build?">What do you build?</button>
      <button data-q="show me the live work">Live work</button>
      <button data-q="how does the ai part work">The AI part</button>
      <button data-q="pricing">Pricing</button>
    </div>
    <form class="chat-in">
      <input type="text" placeholder="Ask MIKA about the studio…" autocomplete="off" aria-label="Message MIKA">
      <button type="submit" aria-label="Send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
    </form>
  </div>`;
  const log=root.querySelector('.chat-log'),form=root.querySelector('.chat-in'),
        input=form.querySelector('input'),chips=root.querySelector('.chat-chips');

  function add(cls,html){const m=document.createElement('div');m.className='msg '+cls;m.innerHTML=html;log.appendChild(m);log.scrollTop=log.scrollHeight;return m;}

  function renderActs(m,acts){
    if(!acts||!acts.length)return;
    const w=document.createElement('div');w.className='acts';
    acts.forEach(a=>{
      if(a.h){const el=document.createElement('a');el.href=a.h;el.textContent=a.l;if(a.x){el.target='_blank';el.rel='noopener';}w.appendChild(el);}
      else{const el=document.createElement('button');el.type='button';el.textContent=a.l;el.addEventListener('click',()=>a.q==='__lead'?lead():handle(a.q,a.l));w.appendChild(el);}
    });
    m.appendChild(w);log.scrollTop=log.scrollHeight;
  }

  function reply(intent){
    const t=add('bot typing','<i></i><i></i><i></i>');
    setTimeout(()=>{
      t.classList.remove('typing');t.innerHTML=intent.a;
      renderActs(t,intent.acts);log.scrollTop=log.scrollHeight;
      try{const c=t.querySelector('[data-clock]');if(c){c.textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Bangkok',hour:'2-digit',minute:'2-digit'}).format(new Date());}}catch(e){}
    },RM?0:600+Math.random()*450);
  }

  function lead(){
    const t=add('bot','Leave your email and one line about the project — it goes straight to Mike.');
    const f=document.createElement('form');f.className='mk-lead';
    f.innerHTML=`<input type="email" name="email" placeholder="you@email.com" required>
      <textarea name="message" placeholder="One line about your project (optional)"></textarea>
      <button type="submit">Send to Mike</button>`;
    t.appendChild(f);log.scrollTop=log.scrollHeight;
    f.addEventListener('submit',async e=>{
      e.preventDefault();
      const btn=f.querySelector('button');btn.disabled=true;btn.textContent='Sending…';
      try{
        const r=await fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
          body:JSON.stringify({email:f.email.value,message:f.message.value||'(from MIKA chat)',_subject:'New lead via MIKA — mikaro.studio'})});
        if(!r.ok)throw 0;
        t.innerHTML='Sent. Mike replies within a day — thank you.';
      }catch(err){
        t.innerHTML='Hmm, the direct line hiccuped. Please use the <a href="/contact.html">contact form</a> instead — it always works.';
      }
      log.scrollTop=log.scrollHeight;
    });
  }

  const HIST=[];
  async function aiReply(q){
    const t=add('bot typing','<i></i><i></i><i></i>');
    try{
      const r=await fetch('/api/mika',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:HIST})});
      if(!r.ok)throw 0;
      const d=await r.json();
      if(!d.reply)throw 0;
      HIST.push({role:'assistant',content:d.reply});
      t.classList.remove('typing');
      t.innerHTML=esc(d.reply).replace(/\n/g,'<br>');
      if(/contact|budget|price|quote|start/i.test(q+d.reply))renderActs(t,[{h:'/contact',l:'Open the contact form'}]);
      log.scrollTop=log.scrollHeight;
    }catch(err){
      t.remove();
      reply(pick(q));
    }
  }
  function handle(q,label){
    add('user',esc(label||q));
    HIST.push({role:'user',content:q});
    aiReply(q);
  }

  form.addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim();if(!q)return;input.value='';handle(q);});
  chips.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;handle(b.dataset.q,b.textContent);});

  const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){io.disconnect();reply(INTENTS[0]);}});},{threshold:.3});
  io.observe(log);
  return {open:()=>{}};
}

/* ---------- embeds ---------- */
document.querySelectorAll('[data-mika]').forEach(mount);

/* ---------- floating launcher ---------- */
if(!document.body.hasAttribute('data-no-fab')){
  const fab=document.createElement('button');
  fab.className='mika-fab';fab.setAttribute('aria-label','Chat with MIKA');
  fab.innerHTML=ICON+'<span class="pulse"></span>';
  const panel=document.createElement('div');
  panel.className='mika-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-label','MIKA studio guide');
  document.body.appendChild(panel);document.body.appendChild(fab);
  let mounted=false;
  fab.addEventListener('click',()=>{
    if(!mounted){mount(panel);mounted=true;}
    panel.classList.toggle('open');
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')panel.classList.remove('open');});
}
})();
