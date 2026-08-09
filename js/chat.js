/* ================================================================
   MIKA · studio guide widget
   MIKA.mount(el) renders a chat instance; a floating launcher is
   added automatically on every page (skip with <body data-no-fab>).
   Scripted intent brain with keyword scoring, in-answer action
   chips, and Claude fallback for unmatched free text.
   ================================================================ */
(function(){
const HAS_DOM=typeof document!=='undefined';
const RM=HAS_DOM&&matchMedia('(prefers-reduced-motion:reduce)').matches;
const FORM_ENDPOINT='https://formsubmit.co/ajax/84f718f8c2666a5284f748d3db5c6d02';
const MIKA_API='/api/mika';
const AI_MESSAGE_LIMIT=20;
const AI_TIMEOUT_MS=6000;
const TH=HAS_DOM&&document.documentElement.lang==='th';
const LINE_URL='https://line.me/ti/p/l059F3WkI7';

/* MIKA FACTS: SINGLE SOURCE OF TRUTH
   Any directive that changes packages, prices, policies, proof links,
   or features must update this facts module in the same commit. */
const FACTS=Object.freeze({
  shared:{
    performanceQuality:'Speed and on-page SEO are standard in every package, never an add-on: optimized images, font strategy, clean structure, meta and sitemap. Our own site scores 97/100 on Google PageSpeed mobile. Every build is bilingual-capable (Thai + English). All work happens on a private preview link and nothing goes live until the client approves it.',
    trackRecord:'Live work includes: The Teak House (complete hotel booking system, teakhouse.mikaro.studio), PRAOW (clinic system, praow.mikaro.studio), OptiClean (real online store, opticlean.mikaro.studio), Balzac Antiques (real client in Switzerland, balzacantiques.ch), Miomika (our own AI language app, miomika.com).',
    process:'How working with us goes: free demo in your name within 48 hours (2 adjustment rounds) → you approve → 50% deposit → we build on a private preview with revision rounds at every milestone → balance → your site goes live → 30-day care warranty (90 days on Flagship).'
  },
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
      revisions:'Full projects include revision rounds at every milestone, from design to pre-launch. Nothing goes live until you approve it.',
      payment:'Projects start with a 50% deposit; the remaining 50% is due before the site goes live. Until then, everything runs on a private preview link, so you see the finished work before final payment. For Flagship and custom projects we split into three milestones: 40% to start, 30% on design approval, 30% before launch. We accept Thai bank transfer and PromptPay; card payment is available on request.'
    },
    proof:'Live proof: teakhouse.mikaro.studio · owner PIN 1234 · praow.mikaro.studio · balzacantiques.ch',
    positioning:'An AI-powered studio: senior creative direction with an AI-scale engineering engine. We ship international-grade systems in weeks, not months.',
    services:'We design and build complete digital products: brand-true websites, e-commerce with real payments, and AI-powered apps.',
    needCustomers:'That is exactly what we build for. Today your customers find you on Google and social media, and they judge in seconds: if they can see your work, your prices, and book or buy right there, they become customers. That is the system we ship.\n\nSo I can point you right: what kind of business do you run · a shop, a hotel, a clinic or salon, a restaurant, or something else?',
    qualify:{
      shop:"For a shop, the right fit is the Professional package (69,000 THB): a full store where customers browse your products, see prices, and order with real online payment · plus a back office where you update stock and prices yourself. Two live examples: opticlean.mikaro.studio and balzacantiques.ch.\n\nAnd you don't have to imagine it: I can have a free demo page built from your real products within 48 hours · no cost, no obligation. Want to start there?",
      hotel:"For a hotel or resort, the Patient & Guest System (119,000 THB) is built for exactly this: guests book direct with a deposit, an AI concierge answers them at 2am in Thai and English, and the 15-18% OTA commission stays with you. See it live: teakhouse.mikaro.studio · owner dashboard: teakhouse.mikaro.studio/owner (PIN 1234).\n\nI can also have a free demo built in your hotel's own name within 48 hours. Shall we?",
      clinicSalon:"For a clinic, salon, spa or massage studio, the Patient & Guest System (119,000 THB) does the heavy lifting: online booking with deposits that end no-shows, an AI receptionist answering in Thai and English around the clock, and your own management panel. Live example: praow.mikaro.studio.\n\nA free demo in your clinic's name is possible within 48 hours as well. Would you like that?",
      restaurant:'For a restaurant or cafe, the Essential package (39,000 THB) gets you credible fast: menu, photos, location, hours and contact that works · live in 2 weeks. The Professional (69,000 THB) adds online ordering. Browse our live work: mikaro.studio/work.\n\nThe free 48-hour demo applies to you too: one page from your real menu, no cost. Interested?',
      other:"Happy to point you right · tell me a little about what your business sells or does, and I'll tell you exactly which package fits, with a live example to click."
    },
    demoYes:"Perfect · let's start. Send your business name and a few photos of your products or work on LINE, and the free demo starts today: line.me/ti/p/l059F3WkI7. Within 48 hours you'll have a link with your name on it.",
    contact:"That falls outside my verified facts. The team replies personally · use LINE or the contact form and they'll confirm it directly.",
    fallback:"Good question · and I want to get it exactly right for you. The quickest path: tell me what kind of business you run, and I'll point you to the right package with a live example. For anything beyond my knowledge, the team replies personally on LINE.",
    handoff:'For anything beyond my knowledge, the team replies personally on LINE.',
    greeting:"Hello · I'm MIKA, the studio's guide. Ask me about packages, prices, timelines, warranty, the free demo, revisions, or live examples."
  },
  th:{
    packages:[
      {name:'Essential',price:'39,000 บาท',timeline:'ธุรกิจของคุณ น่าเชื่อถือบน Google ภายใน 2 สัปดาห์',included:['เว็บ 5 หน้า สองภาษา เขียนโดยเจ้าของภาษา','ข้อความเข้าอีเมลและ LINE ของคุณ','โหลดไวใน 2 วินาทีบนมือถือ','ปุ่ม LINE และปุ่มโทรทุกหน้า ลูกค้าแตะครั้งเดียว คุยกับคุณได้ทันที','ตั้งค่า Google Business ให้ลูกค้าแถวคุณค้นหาเจอ']},
      {name:'Professional',price:'69,000 บาท',timeline:'ส่งมอบใน 2-3 สัปดาห์',included:['ทุกอย่างใน Essential พร้อมด้วย:','AI ต้อนรับไทย + อังกฤษ ตลอด 24 ชั่วโมง','จองคิวออนไลน์ ยืนยันในไม่ถึงหนึ่งนาที','รีวิว Google แสดงบนเว็บจริง','หน้าบริการและแกลเลอรีครบชุด ขายงานให้คุณระหว่างที่คุณทำงาน']},
      {name:'Patient & Guest System',price:'119,000 บาท',timeline:'ส่งมอบใน 2-3 สัปดาห์',included:['ทุกอย่างใน Professional พร้อมด้วย เลือกตามธุรกิจของคุณ:','คลินิก: ระบบปรึกษา + มัดจำที่ลดการเบี้ยวนัด','โรงแรม: จองตรง เก็บค่าคอม 15-18%','แผงควบคุมของคุณเอง','คลินิก: คนไข้ต่างชาติส่งเคสพร้อมรูป รับใบประเมินราคา และแกลเลอรีผลงานก่อน/หลัง','โรงแรมและวิลล่า: ชำระด้วยบัตรและ PromptPay ไม่เสียค่า Booking.com','แก้ห้อง ทรีตเมนต์ ราคา และการจองได้ด้วยตัวเอง']},
      {name:'Flagship Acquisition',price:'189,000 บาท',timeline:'ส่งมอบใน 2-3 สัปดาห์',included:['ทุกอย่างข้างต้น พร้อมด้วย:','ภาษาที่ 3 สำหรับตลาดของคุณ','หน้าเว็บออกแบบให้ติดอันดับ Google','ดูแลต่อเนื่อง 90 วันหลังเปิดตัว','จีนหรืออาหรับสำหรับคนไข้ต่างชาติ เยอรมันหรือฝรั่งเศสสำหรับสายที่พัก','ระบบติดตามผล เห็นชัดว่าลูกค้าแต่ละรายมาจากช่องทางไหน']},
      {name:'Signature',price:'ราคาตามโปรเจกต์',timeline:'กำหนดเวลาตามขอบเขตโปรเจกต์',included:['โปรเจกต์ที่จริงจัง เริ่มจากการคุยกัน']}
    ],
    policies:{
      warrantyLine:'รวมการรับประกันดูแล 30 วัน · แก้บั๊กฟรี',
      flagshipWarrantyLine:'รวมการรับประกันดูแล 90 วัน',
      demoLine:'ปรับแก้ได้ 2 รอบ',
      warranty:'ทุกแพ็กเกจมีการรับประกันดูแล 30 วันหลังส่งมอบ แก้บั๊กและข้อผิดพลาดให้ฟรีทั้งหมด แพ็กเกจ Flagship ขยายเป็น 90 วันครับ',
      demo:'เดโม่ฟรีคือ 1 คอนเซปต์ สร้างในชื่อธุรกิจของคุณภายใน 48 ชั่วโมง ปรับแก้ได้ 2 รอบ หากยังไม่ถูกใจ เราแยกย้ายกันด้วยดี ไม่มีค่าใช้จ่ายใดๆ ครับ ส่วนโปรเจกต์เต็มมีรอบปรับแก้ทุกช่วงงาน ไม่มีอะไรออนไลน์จนกว่าคุณจะอนุมัติครับ',
      revisions:'โปรเจกต์เต็มมีรอบปรับแก้ในทุกช่วงของงานครับ ตั้งแต่ดีไซน์จนถึงก่อนออนไลน์ ไม่มีอะไรเผยแพร่จนกว่าคุณจะอนุมัติครับ',
      payment:'โปรเจกต์เริ่มงานด้วยมัดจำ 50% และชำระส่วนที่เหลือ 50% ก่อนเว็บไซต์ออนไลน์จริงครับ ระหว่างนั้นงานทั้งหมดอยู่บนลิงก์พรีวิวส่วนตัว คุณได้เห็นงานเสร็จสมบูรณ์ก่อนชำระยอดสุดท้ายครับ สำหรับแพ็กเกจ Flagship และงานสเกลพิเศษ แบ่งชำระ 3 งวดครับ: 40% เริ่มงาน · 30% เมื่ออนุมัติดีไซน์ · 30% ก่อนออนไลน์ รับชำระผ่านโอนธนาคารและพร้อมเพย์ หรือบัตรเครดิตได้ตามตกลงครับ'
    },
    proof:'ผลงานจริง · teakhouse.mikaro.studio · owner PIN 1234 · praow.mikaro.studio · balzacantiques.ch',
    positioning:'สตูดิโอที่ขับเคลื่อนด้วย AI · ความคิดสร้างสรรค์จากทีมมากประสบการณ์ เสริมด้วยพลังวิศวกรรม AI เต็มรูปแบบ พร้อมส่งมอบระบบระดับสากลภายในไม่กี่สัปดาห์ ไม่ใช่หลายเดือน',
    services:'เราออกแบบและสร้างโปรดักต์ดิจิทัลครบวงจร: เว็บไซต์ที่ตรงแบรนด์ อีคอมเมิร์ซพร้อมระบบชำระเงินจริง และแอปพลัง AI',
    needCustomers:'เรื่องนี้ตรงกับสิ่งที่เราสร้างพอดีเลยครับ ทุกวันนี้ลูกค้าหาคุณเจอบน Google และโซเชียล และตัดสินใจในไม่กี่วินาที ถ้าเขาเห็นสินค้า เห็นราคา แล้วสั่งซื้อหรือจองได้ทันที เขาก็กลายเป็นลูกค้าครับ นั่นคือระบบที่เราสร้างให้\n\nขอถามนิดเดียวครับ ธุรกิจของคุณเป็นแบบไหน ร้านค้า โรงแรม คลินิกหรือซาลอน ร้านอาหาร หรืออย่างอื่นครับ',
    qualify:{
      shop:'สำหรับร้านค้า แพ็กเกจที่เหมาะที่สุดคือ Professional (69,000 บาท) ครับ ร้านค้าออนไลน์เต็มรูปแบบ ลูกค้าดูสินค้า เห็นราคา และสั่งซื้อพร้อมชำระเงินออนไลน์ได้จริง พร้อมระบบหลังบ้านให้คุณแก้ราคาและสต็อกเองครับ ดูตัวอย่างจริงได้ที่ opticlean.mikaro.studio และ balzacantiques.ch\n\nและไม่ต้องจินตนาการครับ เราทำหน้าเดโม่ฟรีจากสินค้าจริงของร้านคุณได้ภายใน 48 ชั่วโมง ไม่มีค่าใช้จ่าย ไม่มีข้อผูกมัด สนใจเริ่มจากตรงนี้ไหมครับ',
      hotel:'สำหรับโรงแรมหรือรีสอร์ท ระบบ Patient & Guest System (119,000 บาท) สร้างมาเพื่อสิ่งนี้เลยครับ แขกจองตรงพร้อมมัดจำ มี AI ตอบแขกได้ตอนตี 2 ทั้งไทยและอังกฤษ และค่าคอม 15-18% ของ OTA อยู่กับโรงแรมครับ ดูระบบจริง: teakhouse.mikaro.studio · แผงเจ้าของ: teakhouse.mikaro.studio/owner (PIN 1234)\n\nทำเดโม่ฟรีในชื่อโรงแรมของคุณได้ภายใน 48 ชั่วโมงด้วยครับ สนใจไหมครับ',
      clinicSalon:'สำหรับคลินิก ซาลอน สปา หรือร้านนวด ระบบ Patient & Guest System (119,000 บาท) ช่วยได้ตรงจุดครับ จองคิวออนไลน์พร้อมมัดจำ ลดปัญหาลูกค้าเบี้ยวนัด มี AI ต้อนรับตอบลูกค้าทั้งไทยและอังกฤษตลอดเวลา พร้อมแผงจัดการของคุณเอง ดูตัวอย่างจริง: praow.mikaro.studio\n\nทำเดโม่ฟรีในชื่อคลินิกของคุณภายใน 48 ชั่วโมงได้เช่นกันครับ สนใจไหมครับ',
      restaurant:'สำหรับร้านอาหารหรือคาเฟ่ แพ็กเกจ Essential (39,000 บาท) ทำให้ร้านดูน่าเชื่อถือได้เร็วครับ เมนู รูป พิกัด เวลาเปิด ติดต่อได้จริง ออนไลน์ใน 2 สัปดาห์ ส่วน Professional (69,000 บาท) เพิ่มระบบสั่งอาหารออนไลน์ครับ ดูผลงานจริงได้ที่ mikaro.studio/work\n\nเดโม่ฟรี 48 ชั่วโมงใช้กับร้านคุณได้เหมือนกันครับ หน้าเดียวจากเมนูจริงของร้าน ไม่มีค่าใช้จ่ายครับ สนใจไหมครับ',
      other:'ยินดีแนะนำครับ เล่าให้ฟังนิดหนึ่งว่าธุรกิจของคุณขายอะไรหรือทำอะไร แล้วผมจะบอกได้เลยว่าแพ็กเกจไหนเหมาะ พร้อมตัวอย่างจริงให้กดดูครับ'
    },
    demoYes:'เยี่ยมเลยครับ เริ่มกันเลยครับ ส่งชื่อธุรกิจและรูปสินค้าหรือผลงานสัก 2-3 รูปมาทาง LINE ได้เลยครับ: line.me/ti/p/l059F3WkI7 ภายใน 48 ชั่วโมงคุณจะได้ลิงก์เดโม่ในชื่อของคุณครับ',
    contact:'คำถามดีมาก · ฉันเป็นไกด์ตัวเล็ก ๆ เรื่องลึก ๆ ให้มนุษย์ตอบดีกว่า ฝากอีเมลไว้แล้วเราจะติดต่อกลับภายในหนึ่งวัน หรือลองปุ่มด้านล่างนี้',
    fallback:'คำถามดีครับ และผมอยากตอบให้ตรงที่สุดครับ ทางที่เร็วที่สุดคือบอกผมว่าธุรกิจของคุณเป็นแบบไหน แล้วผมจะแนะนำแพ็กเกจที่เหมาะพร้อมตัวอย่างจริงให้เลยครับ ส่วนเรื่องที่เกินข้อมูลของผม ทีมงานตอบเองทาง LINE ครับ',
    handoff:'ส่วนเรื่องที่เกินข้อมูลของผม ทีมงานตอบเองทาง LINE ครับ',
    greeting:'สวัสดีค่ะ · ฉันคือ MIKA ไกด์ประจำสตูดิโอ ถามได้เลยว่าเราสร้างอะไร ระบบ AI ทำงานอย่างไร ราคาเป็นแบบไหน หรือกดปุ่มด้านล่างได้เลย'
  }
});

function packageLadder(lang){
  return FACTS[lang].packages.map(p=>p.name+' '+p.price).join(' · ')+' · Full details: mikaro.studio/business';
}
function packageTimelines(lang){
  return FACTS[lang].packages.map(p=>p.name+': '+p.timeline).join(' · ');
}
function bizTypeActions(lang){
  return lang==='th'
    ?[{q:'ร้านค้า',l:'ร้านค้า'},{q:'โรงแรม',l:'โรงแรม'},{q:'คลินิก · ซาลอน',l:'คลินิก · ซาลอน'},{q:'ร้านอาหาร',l:'ร้านอาหาร'},{q:'อื่นๆ',l:'อื่นๆ'}]
    :[{q:'shop',l:'Shop'},{q:'hotel',l:'Hotel'},{q:'clinic · salon',l:'Clinic · Salon'},{q:'restaurant',l:'Restaurant'},{q:'other',l:'Other'}];
}
function qualifyActions(lang,type){
  const th=lang==='th',live=th?'ดูเว็บจริง ↗':'View live ↗';
  const yes={q:th?'สนใจ':'yes',l:th?'สนใจ':'Yes'};
  if(type==='shop')return [{h:'https://opticlean.mikaro.studio',l:live,x:1},{h:'https://balzacantiques.ch',l:live,x:1},yes];
  if(type==='hotel')return [{h:'https://teakhouse.mikaro.studio',l:live,x:1},{h:'https://teakhouse.mikaro.studio/owner',l:th?'แผงเจ้าของ':'Owner dashboard',x:1},yes];
  if(type==='clinic-salon')return [{h:'https://praow.mikaro.studio',l:live,x:1},yes];
  if(type==='restaurant')return [{h:'https://mikaro.studio/work',l:th?'ดูผลงาน':'Browse live work',x:1},yes];
  return actions(lang,'business');
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
function buildQualifyIntents(lang){
  const f=FACTS[lang].qualify,th=lang==='th';
  return [
    {id:'clinic-salon',priority:1,k:th?['คลินิก','ซาลอน','ร้านเสริมสวย','สปา','นวด','ร้านนวด','มาสสาจ','ทำผม','ทำเล็บ','เสริมสวย','ความงาม']:['clinic','salon','spa','massage','nails','hair','beauty','wellness'],a:f.clinicSalon,acts:qualifyActions(lang,'clinic-salon')},
    {id:'restaurant',priority:1,k:th?['ร้านอาหาร','คาเฟ่','ร้านกาแฟ']:['restaurant','cafe'],a:f.restaurant,acts:qualifyActions(lang,'restaurant')},
    {id:'hotel',priority:1,k:th?['โรงแรม','รีสอร์ท','ที่พัก']:['hotel','resort'],a:f.hotel,acts:qualifyActions(lang,'hotel')},
    {id:'shop',k:th?['ร้านค้า','ขายของ','ร้าน']:['shop','store','sell'],a:f.shop,acts:qualifyActions(lang,'shop')},
    {id:'other',k:th?['อื่นๆ']:['other'],a:f.other,acts:actions(lang,'business')}
  ];
}
function buildDemoYesIntent(lang){
  const th=lang==='th';
  return {id:'demo-yes',k:th?['สนใจ','เอา','ได้','ตกลง']:['yes','ok','sure','interested'],a:FACTS[lang].demoYes,acts:[{h:LINE_URL,l:th?'แอด LINE':'Start on LINE',x:1}]};
}
function buildIntents(lang){
  const f=FACTS[lang],th=lang==='th';
  const qualify=buildQualifyIntents(lang);
  return [
    {id:'greeting',k:th?['สวัสดี','หวัดดี']:['hi','hello','hey','sawasdee','bonjour','good morning','good evening'],a:f.greeting,acts:actions(lang,'services')},
    {id:'services',k:th?['สร้างอะไร','ทำอะไร','บริการ','เราสร้างอะไร']:['build','do you do','services','offer','make','capab'],a:f.services,acts:actions(lang,'services')},
    {id:'need-customers',k:th?['ลูกค้าเพิ่ม','อยากได้ลูกค้า','ยอดขาย','อยากขายดี','โปรโมท']:['more customer','grow','sales','marketing','get customers'],a:f.needCustomers,acts:bizTypeActions(lang)},
    {id:'warranty',k:th?['รับประกัน','ประกัน']:['warranty','guarantee','covered','coverage'],a:f.policies.warranty,acts:actions(lang,'business')},
    {id:'demo',k:th?['เดโม่','ฟรี']:['free demo','demo','prototype','free'],a:f.policies.demo,acts:actions(lang,'business')},
    {id:'revisions',k:th?['แก้ไข','ปรับ','รอบแก้','รีวิว']:['revisions','revision','adjust','changes','approval','approve'],a:f.policies.revisions,acts:actions(lang,'business')},
    {id:'payment',k:th?['ชำระ','จ่าย','มัดจำ','ผ่อน','งวด']:['payment','pay','deposit','installment'],a:f.policies.payment,acts:actions(lang,'business')},
    {id:'pricing',k:th?['ราคา','แพ็กเกจ','งบ','เท่าไหร่','ค่าใช้จ่าย','แพง']:['price','pricing','package','cost','budget','much','rate','quote','fee','hotel system','clinic system'],a:packageLadder(lang),acts:actions(lang,'business')},
    {id:'timeline',k:th?['กี่วัน','นานไหม','กี่สัปดาห์','ระยะเวลา','เมื่อไหร่']:['how long','timeline','time','fast','deadline','when','delivery','weeks'],a:packageTimelines(lang),acts:actions(lang,'business')},
    ...qualify,
    {id:'examples',k:th?['ผลงาน','ตัวอย่าง','เคส','พอร์ต','teakhouse','praow','balzac']:['examples','example','work','portfolio','case','proof','live','teakhouse','praow','balzac','miomika','opticlean'],a:f.proof,acts:actions(lang,'proof')},
    {id:'identity',k:th?['ใคร','ai','เอไอ','ปัญญาประดิษฐ์','สตูดิโอ']:['who are you','who','about','team','studio','founder','mike','ai','artificial','llm'],a:f.positioning,acts:actions(lang,'ai')},
    {id:'contact',k:th?['ติดต่อ','คุย','จ้าง','เริ่ม','line']:['contact','email','reach','talk','call','hire','start','line'],a:f.contact,acts:actions(lang,'contact')}
  ];
}

const INTENTS=buildIntents('en');
const TH_INTENTS=buildIntents('th');
const QUALIFY_INTENTS=buildQualifyIntents('en');
const TH_QUALIFY_INTENTS=buildQualifyIntents('th');
const DEMO_YES_INTENT=buildDemoYesIntent('en');
const TH_DEMO_YES_INTENT=buildDemoYesIntent('th');
const FALLBACK={id:'fallback',a:FACTS.en.fallback,acts:[...bizTypeActions('en'),...actions('en','contact')]};
const TH_FALLBACK={id:'fallback',a:FACTS.th.fallback,acts:[...bizTypeActions('th'),...actions('th','contact')]};
const HANDOFF={id:'handoff',a:FACTS.en.handoff,acts:actions('en','contact')};
const TH_HANDOFF={id:'handoff',a:FACTS.th.handoff,acts:actions('th','contact')};
const TH_HI=TH_INTENTS[0];

/* ---------- brain ---------- */
function hasKeyword(s,k){
  if(/^[a-z0-9]+$/i.test(k)&&k.length<=3){
    const escaped=k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    return new RegExp('(^|\\W)'+escaped+'(?=$|\\W)','i').test(s);
  }
  return s.includes(k);
}
function normalizeQuery(q){
  return String(q).trim().toLowerCase().replace(/[?!.,:;…]+$/g,'').replace(/\s+/g,' ');
}
function isCoreLocalQuery(q,useThai=TH){
  const s=normalizeQuery(q);
  if(s==='hotle websit how much')return true;
  if(!s||s.split(' ').length>3)return false;
  const pool=[
    ...(useThai?TH_INTENTS:INTENTS),
    ...(useThai?TH_QUALIFY_INTENTS:QUALIFY_INTENTS),
    useThai?TH_DEMO_YES_INTENT:DEMO_YES_INTENT
  ];
  return pool.some(it=>it.k.some(k=>normalizeQuery(k)===s));
}
function matchIntent(q,useThai=TH){
  const s=q.toLowerCase();let best=null,score=0;
  const POOL=useThai?TH_INTENTS:INTENTS;
  const specific=pickFrom(q,(useThai?TH_QUALIFY_INTENTS:QUALIFY_INTENTS).filter(it=>it.priority));
  for(const it of POOL){
    if(specific&&it.id==='shop')continue;
    let n=0;for(const k of it.k){if(hasKeyword(s,k))n+=k.length>3?2:1;}
    const beatsGenericTie=n===score&&n>0&&it.priority&&best&&['need-customers','shop'].includes(best.id);
    if(n>score||beatsGenericTie){score=n;best=it;}
  }
  return score>0?best:null;
}
function pick(q,useThai=TH){
  return matchIntent(q,useThai)||(useThai?TH_FALLBACK:FALLBACK);
}
function pickFrom(q,pool){
  const s=q.toLowerCase();let best=null,score=0;
  const specific=pool.filter(it=>it.priority&&it.k.some(k=>hasKeyword(s,k)));
  const candidates=specific.length?specific:pool;
  for(const it of candidates){
    let n=0;for(const k of it.k){if(hasKeyword(s,k))n+=k.length>3?2:1;}
    if(n>score||(n===score&&n>0&&(it.priority||0)>(best&&best.priority||0))){score=n;best=it;}
  }
  return score>0?best:null;
}
function createConversation(lang){
  const useThai=lang==='th';
  let awaitingBizType=false;
  let awaitingDemoYes=false;
  let fallbackLoop=false;
  function useFallback(){
    awaitingBizType=true;
    fallbackLoop=true;
    return useThai?TH_FALLBACK:FALLBACK;
  }
  return {
    ask(q,allowFallback=true){
      if(awaitingDemoYes&&pickFrom(q,[useThai?TH_DEMO_YES_INTENT:DEMO_YES_INTENT])){
        awaitingDemoYes=false;
        return useThai?TH_DEMO_YES_INTENT:DEMO_YES_INTENT;
      }
      if(awaitingBizType){
        const qualified=pickFrom(q,useThai?TH_QUALIFY_INTENTS:QUALIFY_INTENTS);
        if(qualified){
          if(qualified.id==='other'){
            fallbackLoop=true;
            return qualified;
          }
          awaitingBizType=false;
          fallbackLoop=false;
          awaitingDemoYes=true;
          return qualified;
        }
        if(fallbackLoop){
          awaitingBizType=false;
          fallbackLoop=false;
          return useThai?TH_HANDOFF:HANDOFF;
        }
        fallbackLoop=true;
        return (useThai?TH_QUALIFY_INTENTS:QUALIFY_INTENTS).find(it=>it.id==='other');
      }
      const result=matchIntent(q,useThai);
      if(!result)return allowFallback?useFallback():null;
      if(result.id==='need-customers'){
        awaitingBizType=true;
        fallbackLoop=false;
      }
      if(result.id==='other'){
        awaitingBizType=true;
        fallbackLoop=true;
      }
      if(['shop','hotel','clinic-salon','restaurant'].includes(result.id))awaitingDemoYes=true;
      return result;
    },
    fallback:useFallback,
    state(){return {awaitingBizType,awaitingDemoYes,fallbackLoop};}
  };
}

if(typeof module!=='undefined'&&module.exports){
  module.exports={FACTS,INTENTS,TH_INTENTS,QUALIFY_INTENTS,TH_QUALIFY_INTENTS,DEMO_YES_INTENT,TH_DEMO_YES_INTENT,FALLBACK,TH_FALLBACK,HANDOFF,TH_HANDOFF,isCoreLocalQuery,matchIntent,pick,createConversation,answer:(q,lang)=>pick(q,lang==='th').a};
  return;
}

/* ---------- ui ---------- */
function esc(t){const d=document.createElement('div');d.textContent=t;return d.innerHTML;}
const ICON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z"/><path d="M9 11h.01M13 11h.01M17 11h.01"/></svg>';

function mount(root){
  const conversation=createConversation(TH?'th':'en');
  const history=[];
  let aiMessages=0;
  let pending=false;
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
  function remember(role,content){
    history.push({role,content:String(content).slice(0,500)});
    if(history.length>16)history.splice(0,history.length-16);
  }
  function linkify(text){
    return esc(text).replace(/\b(https?:\/\/[^\s<]+|(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s<]*)?)/gi,raw=>{
      let url=raw,trail='';
      while(/[.,!?;:]$/.test(url)){trail=url.slice(-1)+trail;url=url.slice(0,-1);}
      const href=/^https?:\/\//i.test(url)?url:'https://'+url;
      return '<a href="'+href+'" target="_blank" rel="noopener">'+url+'</a>'+trail;
    }).replace(/\n/g,'<br>');
  }

  function renderActs(m,acts){
    if(!acts||!acts.length)return;
    const w=document.createElement('div');w.className='acts';
    acts.forEach(a=>{
      if(a.h){const el=document.createElement('a');el.href=a.h;el.textContent=a.l;if(a.x){el.target='_blank';el.rel='noopener';}w.appendChild(el);}
      else{const el=document.createElement('button');el.type='button';el.textContent=a.l;el.addEventListener('click',()=>a.q==='__lead'?lead():handle(a.q,a.l,true));w.appendChild(el);}
    });
    m.appendChild(w);log.scrollTop=log.scrollHeight;
  }

  function reply(intent){
    const t=add('bot typing','<i></i><i></i><i></i>');
    setTimeout(()=>{
      t.classList.remove('typing');t.innerHTML=intent.a.replace(/\n/g,'<br>');
      renderActs(t,intent.acts);log.scrollTop=log.scrollHeight;
      try{const c=t.querySelector('[data-clock]');if(c){c.textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Bangkok',hour:'2-digit',minute:'2-digit'}).format(new Date());}}catch(e){}
    },RM?0:600+Math.random()*450);
  }

  async function aiReply(){
    if(aiMessages>=AI_MESSAGE_LIMIT){
      const fallback=conversation.fallback();
      remember('assistant',fallback.a);
      reply(fallback);
      return;
    }
    aiMessages+=1;
    pending=true;
    input.disabled=true;
    form.querySelector('button').disabled=true;
    const typing=add('bot typing','<i></i><i></i><i></i>');
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),AI_TIMEOUT_MS);
    try{
      const response=await fetch(MIKA_API,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({messages:history.slice(-8),lang:TH?'th':'en'}),
        signal:controller.signal
      });
      if(!response.ok)throw new Error('MIKA API '+response.status);
      const data=await response.json();
      if(!data||!data.reply)throw new Error('Empty MIKA reply');
      const answer=String(data.reply).slice(0,3000);
      remember('assistant',answer);
      typing.classList.remove('typing');
      typing.innerHTML=linkify(answer);
      log.scrollTop=log.scrollHeight;
    }catch(err){
      typing.remove();
      const fallback=conversation.fallback();
      remember('assistant',fallback.a);
      reply(fallback);
    }finally{
      clearTimeout(timer);
      pending=false;
      input.disabled=false;
      form.querySelector('button').disabled=false;
      input.focus();
    }
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

  function handle(q,label,forceLocal=false){
    if(pending)return;
    const clipped=String(q).slice(0,500);
    add('user',esc(label||clipped));
    remember('user',clipped);
    const local=(forceLocal||isCoreLocalQuery(clipped,TH))?conversation.ask(clipped,false):null;
    if(local){
      remember('assistant',local.a);
      reply(local);
      return;
    }
    aiReply();
  }

  form.addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim();if(!q)return;input.value='';handle(q);});
  chips.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;handle(b.dataset.q,b.textContent,true);});

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
