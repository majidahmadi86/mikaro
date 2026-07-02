/* ================================================================
   MIKA — on-page studio guide (scripted, runs fully in-browser)
   ================================================================ */
/* ---------- MIKA chatbot ---------- */
(function(){
  const log=document.getElementById('chatLog'),form=document.getElementById('chatForm'),
        input=document.getElementById('chatInput'),chips=document.getElementById('chatChips');
  const A={
    build:`We design and build complete digital products: brand-true websites, e-commerce with real payments, and AI-powered apps. Two are live right now — <a href="https://miomika.com" target="_blank" rel="noopener">Miomika</a> and <a href="https://opticlean.mikaro.studio" target="_blank" rel="noopener">OptiClean</a>.`,
    work:`Scroll up and click them! 🐱 <a href="https://miomika.com" target="_blank" rel="noopener">Miomika</a> is our own voice-first AI companion; <a href="https://opticlean.mikaro.studio" target="_blank" rel="noopener">OptiClean</a> is a full bilingual store with a working Stripe checkout — test card 4242 4242 4242 4242.`,
    ai:`One human directs — taste, strategy, every decision. An AI partner builds at machine speed. That combo shipped a 10-page bilingual store with live checkout in days. Not AI-generated: AI-amplified. ⚡`,
    price:`Projects are scoped individually — a focused brand site and a full commerce build are different animals. Write to <a href="mailto:hello@mikaro.studio">hello@mikaro.studio</a> with what you're making and you'll get a straight answer fast.`,
    hi:`Hey! 👋 I'm MIKA, the studio's on-page guide. Ask me what we build, how the AI part works — or poke the buttons below.`,
    who:`Mikaro is a one-person creative technology studio in Bangkok — plus an AI development partner. Small on headcount, unreasonable on detail.`,
    contact:`Easiest way: <a href="mailto:hello@mikaro.studio">hello@mikaro.studio</a> — replies within a day, Bangkok time. 🇹🇭`,
    miomika:`Miomika is our flagship: a kawaii cat named Miomi who teaches Thai & English through real voice conversation. Teaching brain, speech pipeline, payments, admin — all in-house. <a href="https://miomika.com" target="_blank" rel="noopener">miomika.com</a>`,
    opticlean:`OptiClean by Dr. Zac — a vintage French apothecary brand we turned into a complete live store from a single reference image. 10 pages, FR/EN, EUR/CHF, working Stripe checkout. <a href="https://opticlean.mikaro.studio" target="_blank" rel="noopener">Visit it</a> and test-buy a bottle!`,
    fallback:`Good question — I'm a small on-page guide, so for the interesting conversations there's a human: <a href="mailto:hello@mikaro.studio">hello@mikaro.studio</a>. Meanwhile try: “what do you build?”, “pricing”, or “the AI part?”`
  };
  const routes=[
    [/miomi|cat|thai/i,'miomika'],
    [/opti|zac|store|shop|e-?com/i,'opticlean'],
    [/\b(hi|hello|hey|yo|sawa|สวัสดี)\b/i,'hi'],
    [/price|cost|budget|much|rate|quote/i,'price'],
    [/\bai\b|model|llm|gpt|claude|machine/i,'ai'],
    [/work|portfolio|live|project|show/i,'work'],
    [/build|do|service|offer|make/i,'build'],
    [/who|studio|about|you\b|team/i,'who'],
    [/contact|email|reach|talk|call/i,'contact'],
  ];
  function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML;}
  function add(cls,html){const m=document.createElement('div');m.className='msg '+cls;m.innerHTML=html;log.appendChild(m);log.scrollTop=log.scrollHeight;return m;}
  function botReply(key){
    const t=add('bot typing','<i></i><i></i><i></i>');
    setTimeout(()=>{t.classList.remove('typing');t.innerHTML=A[key];log.scrollTop=log.scrollHeight;},RM?0:650+Math.random()*450);
  }
  function handle(q){add('user',esc(q));let key='fallback';for(const[re,k]of routes){if(re.test(q)){key=k;break;}}botReply(key);}
  form.addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim();if(!q)return;input.value='';handle(q);});
  chips.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;handle(b.dataset.q);});
  const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){io.disconnect();botReply('hi');}});},{threshold:.35});
  io.observe(log);
})();
