const SYSTEM=`You are the intake planner for Mikaro Studio, a Bangkok web studio. Given a short business description, reply ONLY with minified JSON: {tier:'essential'|'catalog'|'commerce'|'flagship'|'signature', tier_reason:one sentence, features:[5 short strings naming concrete site features tailored to this exact business], pitch:one warm sentence}. Reply in the language of the input. Never use the em dash character anywhere. No emojis. Every tier includes a Thai+English bilingual build as standard, so never list bilingual or Thai+English as a tier-specific feature. Only Flagship adds a third language; mention a third language only when recommending flagship. Service business with no product catalog → essential. Product seller without online payment need → catalog. Wants to take payment online → commerce. Wants an AI assistant, premium brand experience, or a third language → flagship. Custom app, platform, or unusual scope → signature.`;

const Tiers=['essential','catalog','commerce','flagship','signature'];
const hits=new Map();
function limited(ip){
  const now=Date.now();
  let row=hits.get(ip);
  if(!row||now-row.t>3600000){row={t:now,n:0};hits.set(ip,row);}
  if(row.n>=10)return true;
  row.n++;
  return false;
}
function valid(p){
  if(!p||typeof p!=='object')return false;
  if(!Tiers.includes(p.tier))return false;
  if(typeof p.tier_reason!=='string'||!p.tier_reason.trim())return false;
  if(typeof p.pitch!=='string'||!p.pitch.trim())return false;
  if(!Array.isArray(p.features)||p.features.length!==5)return false;
  if(!p.features.every(f=>typeof f==='string'&&f.trim()))return false;
  return true;
}
function scrub(s){return String(s||'').replace(/\u2014/g,', ').trim();}

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:true});
  try{
    const ip=(req.headers['x-forwarded-for']||'').toString().split(',')[0].trim()||req.socket?.remoteAddress||'unknown';
    if(limited(ip))return res.status(429).json({error:true});
    const {description}=req.body||{};
    const text=String(description||'').trim().slice(0,800);
    if(text.length<8)return res.status(400).json({error:true});
    const key=process.env.MIKARO_STUDIO;
    if(!key)return res.status(500).json({error:true});
    const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{
        'Authorization':'Bearer '+key,
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        model:'llama-3.3-70b-versatile',
        response_format:{type:'json_object'},
        temperature:0.4,
        messages:[
          {role:'system',content:SYSTEM},
          {role:'user',content:text}
        ]
      })
    });
    if(!r.ok){
      const body=await r.text().catch(()=>'');
      console.error('PLAN_DIAG status='+r.status+' body='+String(body).slice(0,500)+' parse=failed');
      return res.status(502).json({error:true});
    }
    const data=await r.json();
    const raw=String(data&&data.choices&&data.choices[0]&&data.choices[0].message&&data.choices[0].message.content||'').trim();
    const cleaned=raw.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();
    let parsed;
    try{parsed=JSON.parse(cleaned);}catch(e){
      console.error('PLAN_DIAG status='+r.status+' body='+String(raw).slice(0,300)+' parse=failed');
      return res.status(200).json({error:true});
    }
    if(!valid(parsed))return res.status(200).json({error:true});
    return res.status(200).json({
      tier:parsed.tier,
      tier_reason:scrub(parsed.tier_reason),
      features:parsed.features.map(scrub),
      pitch:scrub(parsed.pitch)
    });
  }catch(e){
    return res.status(500).json({error:true});
  }
}
