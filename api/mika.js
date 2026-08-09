import chat from '../js/chat.js';

const {FACTS}=chat;

const PERSONA=`You are MIKA, the AI assistant of Mikaro Studio, an AI-powered web studio in Bangkok. Warm, concise, confident, consultative. Answer in the user's language (Thai or English). Max ~120 words per reply. Always end with exactly one next step: a clickable proof link, one qualifying question, or the LINE handoff. Never use the em-dash character. Never use emojis.`;
const GUARDRAILS=`Only state facts present above. Never invent or estimate prices, discounts, dates, or features. Where an approved Thai phrasing exists in the facts, reuse it verbatim. If the question falls outside the facts, or the user wants negotiation or a human: answer warmly that the team replies personally and give LINE https://line.me/ti/p/l059F3WkI7. If the user's business type is unknown and relevant, ask the one qualifying question.`;
const FORMAT=`Keep every response under 80 words so it cannot be cut off. Use exactly one of these ending formats: PROOF means the final line is one proof URL; QUESTION means the final line is one qualifying question; LINE means the final line is https://line.me/ti/p/l059F3WkI7. A reply may contain only one URL total and may not mention any second action. For negotiation, discounts, or a human request, use LINE. For an answer that uses live proof, use PROOF and do not mention LINE, a demo, or a question. For an off-topic request, briefly decline, state what MIKA helps with, then use QUESTION. Before sending, verify that the reply is complete and follows these rules.`;
const SYSTEM=`${PERSONA}

VERIFIED FACTS, THE SOLE SOURCE OF TRUTH:
${JSON.stringify(FACTS,null,2)}

${GUARDRAILS}

${FORMAT}`;

function cleanReply(value){
  return String(value||'')
    .replace(/—/g,' · ')
    .replace(/\p{Extended_Pictographic}/gu,'')
    .trim();
}

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'POST only'});
  try{
    const {messages,lang}=req.body||{};
    if(!Array.isArray(messages)||!messages.length)return res.status(400).json({error:'bad request'});
    const key=process.env.ANTHROPIC_API_KEY;
    if(!key)return res.status(500).json({error:'not configured'});
    const hist=messages
      .filter(m=>m&&['user','assistant'].includes(m.role)&&String(m.content||'').trim())
      .slice(-8)
      .map(m=>({role:m.role,content:String(m.content).slice(0,500)}));
    if(!hist.length||hist[hist.length-1].role!=='user')return res.status(400).json({error:'bad request'});
    const language=lang==='th'?'Thai':'English';
    const r=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{
        'x-api-key':key,
        'anthropic-version':'2023-06-01',
        'content-type':'application/json'
      },
      body:JSON.stringify({
        model:'claude-haiku-4-5',
        max_tokens:400,
        temperature:0.3,
        system:SYSTEM+'\n\nReply in '+language+'.',
        messages:hist
      })
    });
    if(!r.ok){
      const body=await r.text().catch(()=>'');
      console.error('MIKA_ANTHROPIC status='+r.status+' body='+String(body).slice(0,500));
      return res.status(502).json({error:'upstream'});
    }
    const data=await r.json();
    const reply=cleanReply(data&&data.content&&data.content.filter(x=>x.type==='text').map(x=>x.text).join('\n'));
    if(!reply)return res.status(502).json({error:'empty'});
    const usage=data.usage||{};
    return res.status(200).json({
      reply,
      usage:{
        input_tokens:Number(usage.input_tokens)||0,
        output_tokens:Number(usage.output_tokens)||0
      }
    });
  }catch(e){
    console.error('MIKA_SERVER '+String(e&&e.message||e).slice(0,300));
    return res.status(500).json({error:'server'});
  }
}
