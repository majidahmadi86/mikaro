/* ================================================================
   MIKA · studio guide widget
   MIKA.mount(el) renders a chat instance; a floating launcher is
   added automatically on every page (skip with <body data-no-fab>).
   Scripted intent brain with keyword scoring, in-answer action
   chips, and a lead-capture form wired to FormSubmit.
   Runs fully in-browser; the lead form is the only network call.
   ================================================================ */
(function(){
const HAS_DOM=typeof document!=='undefined';
const RM=HAS_DOM&&matchMedia('(prefers-reduced-motion:reduce)').matches;
const FORM_ENDPOINT='https://formsubmit.co/ajax/84f718f8c2666a5284f748d3db5c6d02';
const TH=HAS_DOM&&document.documentElement.lang==='th';
const LINE_URL='https://line.me/ti/p/l059F3WkI7';

const FACTS=Object.freeze({
  en:{
    packages:[
      {name:'Essential',price:'39,000 THB',timeline:'Your business, credible on Google in 2 weeks.',included:['Natives-written bilingual 5-page site','Enquiries to your inbox and LINE','Under 2 seconds on mobile','LINE and phone buttons on every page · one tap and the customer is talking to you','Google Business profile set up so nearby customers actually find you']},
      {name:'Professional',price:'69,000 THB',timeline:'Delivered in 2-3 weeks',included:['Everything in Essential, plus:','AI receptionist in Thai + English, 24 hours','Online booking confirmed in under a minute','Google reviews live on the site','Full services and gallery pages that sell your work while you work']},
      {name:'Patient & Guest System',price:'119,000 THB',timeline:'Delivered in 2-3 weeks',included:["Everything in Professional, plus · built in your industry's flavor:",'Clinics: consultation funnel + deposits that end no-shows','Hotels: direct booking, keep the 15-18%','Your own admin panel','Clinics: foreign patients send their case and photos, you reply with a quote. Before/after galleries that convince.','Hotels and villas: card and PromptPay payment · no Booking.com cut','Admin: rooms, treatments, prices, bookings · change anything yourself']},
      {name:'Flagship Acquisition',price:'189,000 THB',timeline:'Delivered in 2-3 weeks',included:['Everything above, plus:','Third language for your market','Pages engineered to rank on Google','90 days of post-launch iteration','Chinese or Arabic for medical travel, German or French for hospitality','Tracking that shows you exactly where every enquiry came from']},
      {name:'Signature',price:'Custom scope',timeline:'Custom scope',included:['Every serious project starts with a conversation.']}
    ],
    policies:{
      warrantyLine:'30-day care warranty included · bugs and fixes free',
      flagshipWarrantyLine:'90-day care warranty included',
      demoLine:'Includes two rounds of adjustments.',
      warranty:'Every package includes a 30-day care warranty after launch: bugs, glitches and fixes are on us, free. The Flagship package extends this to 90 days.',
      demo:"The free demo is one concept, built in your name within 48 hours, with up to two rounds of adjustments included. If it's still not right after that, we part as friends · no charge, no obligation. Full projects include structured revision rounds at every milestone, so nothing ships until you approve it.",
      revisions:'Full projects include revision rounds at every milestone, from design to pre-launch. Nothing goes live until you approve it.'
    },
    proof:'Live proof: teakhouse.mikaro.studio · owner PIN 1234 · praow.mikaro.studio · balzacantiques.ch',
    positioning:'An AI-powered studio: senior creative direction with an AI-scale engineering engine. We ship international-grade systems in weeks, not months.',
    services:'We design and build complete digital products: brand-true websites, e-commerce with real payments, and AI-powered apps.',
    contact:"That falls outside my verified facts. The team replies personally · use LINE or the contact form and they'll confirm it directly.",
    greeting:"Hello · I'm MIKA, the studio's guide. Ask me about packages, prices, timelines, warranty, the free demo, revisions, or live examples."
  },
  th:{
    packages:[
      {name:'Essential',price:'39,000 บาท',timeline:'ธุรกิจของคุณ น่าเชื่อถือบน Google ภายใน 2 สัปดาห์',included:['เว็บ 5 หน้า สองภาษา เขียนโดยเจ้าของภาษา','ข้อความเข้าอีเมลและ LINE ของคุณ','โหลดไวใน 2 วินาทีบนมือถือ','ปุ่ม LINE และปุ่มโทรทุกหน้า ลูกค้าแตะครั้งเดียว คุยกับคุณได้ทันที','ตั้งค่า Google Business ให้ลูกค้าแถวคุณค้นหาเจอ']},
      {name:'Professional',price:'69,000 บาท',timeline:'ส่งมอบใน 2-3 สัปดาห์',included:['ทุกอย่างใน Essential พร้อมด้วย:','AI ต้อนรับไทย + อังกฤษ ตลอด 24 ชั่วโมง','จองคิวออนไลน์ ยืนยันในไม่ถึงหนึ่งนาที','รีวิว Google แสดงบนเว็บจริง','หน้าบริการและแกลเลอรีครบชุด ขายงานให้คุณระหว่างที่คุณทำงาน']},
      {name:'Patient & Guest System',price:'119,000 บาท',timeline:'ส่งมอบใน 2-3 สัปดาห์',included:['ทุกอย่างใน Professional พร้อมด้วย เลือกตามธุรกิจของคุณ:','คลินิก: ระบบปรึกษา + มัดจำที่ลดการเบี้ยวนัด','โรงแรม: จองตรง เก็บค่าคอม 15-18%','แผงควบคุมของคุณเอง','คลินิก: คนไข้ต่างชาติส่งเคสพร้อมรูป รับใบประเมินราคา และแกลเลอรีผลงานก่อน/หลัง','โรงแรมและวิลล่า: ชำระด้วยบัตรและ PromptPay ไม่เสียค่า Booking.com','แก้ห้อง ทรีตเมนต์ ราคา และการจองได้ด้วยตัวเอง']},
      {name:'Flagship Acquisition',price:'189,000 บาท',timeline:'ส่งมอบใน 2-3 สัปดาห์',included:['ทุกอย่างข้างต้น พร้อมด้วย:','ภาษาที่ 3 สำหรับตลาดของคุณ','หน้าเว็บออกแบบให้ติดอันดับ Google','ดูแลต่อเนื่อง 90 วันหลังเปิดตัว','จีนหรืออาหรับสำหรับคนไข้ต่างชาติ เยอรมันหรือฝรั่งเศสสำหรับสายที่พัก','ระบบติดตามผล เห็นชัดว่าลูกค้าแต่ละรายมาจากช่องทางไหน']},
      {name:'Signature',price:'ราคาตามโปรเจกต์',timeline:'ราคาตามโปรเจกต์',included:['โปรเจกต์ที่จริงจัง เริ่มจากการคุยกัน']}
    ],
    policies:{
      warrantyLine:'รวมการรับประกันดูแล 30 วัน · แก้บั๊กฟรี',
      flagshipWarrantyLine:'รวมการรับประกันดูแล 90 วัน',
      demoLine:'ปรับแก้ได้ 2 รอบ',
      warranty:'ทุกแพ็กเกจมีการรับประกันดูแล 30 วันหลังส่งมอบ แก้บั๊กและข้อผิดพลาดให้ฟรีทั้งหมด แพ็กเกจ Flagship ขยายเป็น 90 วันครับ',
      demo:'เดโม่ฟรีคือ 1 คอนเซปต์ สร้างในชื่อธุรกิจของคุณภายใน 48 ชั่วโมง ปรับแก้ได้ 2 รอบ หากยังไม่ถูกใจ เราแยกย้ายกันด้วยดี ไม่มีค่าใช้จ่ายใดๆ ครับ ส่วนโปรเจกต์เต็มมีรอบปรับแก้ทุกช่วงงาน ไม่มีอะไรออนไลน์จนกว่าคุณจะอนุมัติครับ',
      revisions:'โปรเจกต์เต็มมีรอบปรับแก้ในทุกช่วงของงานครับ ตั้งแต่ดีไซน์จนถึงก่อนออนไลน์ ไม่มีอะไรเผยแพร่จนกว่าคุณจะอนุมัติครับ'
    },
    proof:'ผลงานจริง · teakhouse.mikaro.studio · owner PIN 1234 · praow.mikaro.studio · balzacantiques.ch',
    positioning:'สตูดิโอที่ขับเคลื่อนด้วย AI · ความคิดสร้างสรรค์จากทีมมากประสบการณ์ เสริมด้วยพลังวิศวกรรม AI เต็มรูปแบบ พร้อมส่งมอบระบบระดับสากลภายในไม่กี่สัปดาห์ ไม่ใช่หลายเดือน',
    services:'เราออกแบบและสร้างโปรดักต์ดิจิทัลครบวงจร: เว็บไซต์ที่ตรงแบรนด์ อีคอมเมิร์ซพร้อมระบบชำระเงินจริง และแอปพลัง AI',
    contact:'คำถามดีมาก · ฉันเป็นไกด์ตัวเล็ก ๆ เรื่องลึก ๆ ให้มนุษย์ตอบดีกว่า ฝากอีเมลไว้แล้วเราจะติดต่อกลับภายในหนึ่งวัน หรือลองปุ่มด้านล่างนี้',
    greeting:'สวัสดีค่ะ · ฉันคือ MIKA ไกด์ประจำสตูดิโอ ถามได้เลยว่าเราสร้างอะไร ระบบ AI ทำงานอย่างไร ราคาเป็นแบบไหน หรือกดปุ่มด้านล่างได้เลย'
  }
});

function packageLadder(lang){
  return FACTS[lang].packages.map(p=>p.name+' '+p.price).join(' · ')+' · Full details: mikaro.studio/business';
}
function packageTimelines(lang){
  return FACTS[lang].packages.map(p=>p.name+': '+p.timeline).join(' · ');
}
function actions(lang,type){
  const th=lang==='th';
  if(type==='proof')return [
    {h:'https://teakhouse.mikaro.studio',l:th?'ดูเว็บจริง ↗':'Teak House ↗',x:1},
    {h:'https://praow.mikaro.studio',l:th?'ดูเว็บจริง ↗':'PRAOW ↗',x:1},
    {h:'https://balzacantiques.ch',l:th?'ดูเว็บจริง ↗':'Balzac Antiques ↗',x:1}
  ];
  if(type==='ai')return [{h:th?'/th/ai-lab':'/ai-lab',l:th?'ชม AI Lab':'Visit the AI Lab'}];
  if(type==='business')return [{h:th?'/th/business':'/business',l:th?'รายละเอียดทั้งหมด':'Full details'}];
  if(type==='services')return [{h:th?'/th/services':'/services',l:th?'บริการทั้งหมด':'All services'}];
  return [
    {h:LINE_URL,l:th?'แอด LINE':'Chat on LINE',x:1},
    {h:th?'/th/contact':'/contact',l:th?'เปิดฟอร์มติดต่อ':'Open the contact form'}
  ];
}
function buildIntents(lang){
  const f=FACTS[lang],th=lang==='th';
  return [
    {id:'greeting',k:th?['สวัสดี','หวัดดี']:['hi','hello','hey','sawasdee','bonjour','good morning','good evening'],a:f.greeting,acts:actions(lang,'services')},
    {id:'services',k:th?['สร้างอะไร','ทำอะไร','บริการ','เราสร้างอะไร']:['build','do you do','services','offer','make','capab'],a:f.services,acts:actions(lang,'services')},
    {id:'warranty',k:th?['รับประกัน','ประกัน']:['warranty','guarantee','covered','coverage'],a:f.policies.warranty,acts:actions(lang,'business')},
    {id:'demo',k:th?['เดโม่','ฟรี']:['free demo','demo','prototype','free'],a:f.policies.demo,acts:actions(lang,'business')},
    {id:'revisions',k:th?['แก้ไข','ปรับ','รอบแก้','รีวิว']:['revisions','revision','adjust','changes','approval','approve'],a:f.policies.revisions,acts:actions(lang,'business')},
    {id:'pricing',k:th?['ราคา','แพ็กเกจ','งบ','เท่าไหร่','ค่าใช้จ่าย','แพง','โรงแรม','คลินิก']:['price','pricing','package','cost','budget','much','rate','quote','fee','pay','hotel system','clinic system'],a:packageLadder(lang),acts:actions(lang,'business')},
    {id:'timeline',k:th?['กี่วัน','นานไหม','กี่สัปดาห์','ระยะเวลา','เมื่อไหร่']:['how long','timeline','time','fast','deadline','when','delivery','weeks'],a:packageTimelines(lang),acts:actions(lang,'business')},
    {id:'examples',k:th?['ผลงาน','ตัวอย่าง','เคส','พอร์ต','teakhouse','praow','balzac']:['examples','example','work','portfolio','case','proof','live','teakhouse','praow','balzac','miomika','opticlean'],a:f.proof,acts:actions(lang,'proof')},
    {id:'identity',k:th?['ใคร','ai','เอไอ','ปัญญาประดิษฐ์','สตูดิโอ']:['who are you','who','about','team','studio','founder','mike','ai','artificial','llm'],a:f.positioning,acts:actions(lang,'ai')},
    {id:'contact',k:th?['ติดต่อ','คุย','จ้าง','เริ่ม','line']:['contact','email','reach','talk','call','hire','start','line'],a:f.contact,acts:actions(lang,'contact')}
  ];
}

const INTENTS=buildIntents('en');
const TH_INTENTS=buildIntents('th');
const FALLBACK={id:'fallback',a:FACTS.en.contact,acts:actions('en','contact')};
const TH_FALLBACK={id:'fallback',a:FACTS.th.contact,acts:actions('th','contact')};
const TH_HI=TH_INTENTS[0];

/* ---------- brain ---------- */
function hasKeyword(s,k){
  if(/^[a-z0-9]+$/i.test(k)&&k.length<=3){
    const escaped=k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    return new RegExp('(^|\\W)'+escaped+'(?=$|\\W)','i').test(s);
  }
  return s.includes(k);
}
function pick(q,useThai=TH){
  const s=q.toLowerCase();let best=null,score=0;
  const POOL=useThai?TH_INTENTS:INTENTS;
  for(const it of POOL){
    let n=0;for(const k of it.k){if(hasKeyword(s,k))n+=k.length>3?2:1;}
    if(n>score){score=n;best=it;}
  }
  return score>0?best:(useThai?TH_FALLBACK:FALLBACK);
}

if(typeof module!=='undefined'&&module.exports){
  module.exports={FACTS,INTENTS,TH_INTENTS,pick,answer:(q,lang)=>pick(q,lang==='th').a};
  return;
}

/* ---------- ui ---------- */
function esc(t){const d=document.createElement('div');d.textContent=t;return d.innerHTML;}
const ICON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z"/><path d="M9 11h.01M13 11h.01M17 11h.01"/></svg>';

function mount(root){
  root.innerHTML=`
  <div class="chat">
    <div class="chat-bar"><span class="av">M</span>MIKA · studio guide<span class="on"><span style="width:8px;height:8px;border-radius:50%;background:#22C55E;display:inline-block"></span>online</span></div>
    <div class="chat-log" aria-live="polite"></div>
    <div class="chat-chips">
      ${TH?'<button data-q="เราสร้างอะไร">เราสร้างอะไร?</button><button data-q="ผลงาน">ผลงานจริง</button><button data-q="เอไอ">ระบบ AI</button><button data-q="ราคา">ราคา</button>':'<button data-q="What do you build?">What do you build?</button><button data-q="show me the live work">Live work</button><button data-q="how does the ai part work">The AI part</button><button data-q="pricing">Pricing</button>'}
    </div>
    <form class="chat-in">
      <input type="text" placeholder="${TH?'ถาม MIKA เกี่ยวกับสตูดิโอ…':'Ask MIKA about the studio…'}" autocomplete="off" aria-label="Message MIKA">
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
    const t=add('bot',TH?'ฝากอีเมลกับรายละเอียดสั้น ๆ หนึ่งบรรทัด · ส่งตรงถึงสตูดิโอ':'Leave your email and one line about the project · it goes straight to the studio.');
    const f=document.createElement('form');f.className='mk-lead';
    f.innerHTML=`<input type="email" name="email" placeholder="you@email.com" required>
      <textarea name="message" placeholder="${TH?'เล่าสั้น ๆ เกี่ยวกับโปรเจกต์ (ไม่บังคับ)':'One line about your project (optional)'}"></textarea>
      <button type="submit">${TH?'ส่งถึงสตูดิโอ':'Send to the studio'}</button>`;
    t.appendChild(f);log.scrollTop=log.scrollHeight;
    f.addEventListener('submit',async e=>{
      e.preventDefault();
      const btn=f.querySelector('button');btn.disabled=true;btn.textContent='Sending…';
      try{
        const r=await fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
          body:JSON.stringify({email:f.email.value,message:f.message.value||'(from MIKA chat)',_subject:'New lead via MIKA · mikaro.studio'})});
        if(!r.ok)throw 0;
        t.innerHTML=TH?'ส่งเรียบร้อย เราจะตอบกลับภายในหนึ่งวัน · ขอบคุณค่ะ':'Sent. You will hear back within a day · thank you.';
      }catch(err){
        t.innerHTML=TH?'สายตรงสะดุดนิดหน่อย ใช้<a href="/th/contact">ฟอร์มติดต่อ</a>แทนได้เลย · ช่องทางนั้นชัวร์เสมอ':'Hmm, the direct line hiccuped. Please use the <a href="/contact">contact form</a> instead · it always works.';
      }
      log.scrollTop=log.scrollHeight;
    });
  }

  function handle(q,label){
    add('user',esc(label||q));
    reply(pick(q));
  }

  form.addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim();if(!q)return;input.value='';handle(q);});
  chips.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;handle(b.dataset.q,b.textContent);});

  const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){io.disconnect();reply(TH?TH_HI:INTENTS[0]);}});},{threshold:.3});
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
