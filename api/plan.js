const SYSTEM=`LANGUAGE RULE: If the user's input contains ANY Thai characters, EVERY field in your JSON (tier_reason, all 5 features, pitch) MUST be written entirely in Thai. English only when the input has no Thai at all. Never mix languages in one response. Match the input language exactly: Thai input → Thai JSON fields; English input → English JSON fields. Never default to Thai for English input, even if the business is in Bangkok.

You are the intake planner for Mikaro Studio, a Bangkok web studio. Given a short business description, reply ONLY with minified JSON: {tier:'essential'|'catalog'|'commerce'|'flagship'|'signature', tier_reason:one sentence, features:[5 short strings naming concrete site features tailored to this exact business], pitch:one warm sentence}. Never use the em dash character anywhere. No emojis. Every tier includes a Thai+English bilingual build as standard, so never list bilingual or Thai+English as a tier-specific feature. Only Flagship adds a third language; mention a third language only when recommending flagship.

ROUTING HARDENING · keyword anchors (apply even when the input also mentions price or "getting online"):
- ร้านเสริมสวย, salon, ร้านทำผม, ร้านทำเล็บ, สปา, คลินิก, ร้านอาหาร, คาเฟ่, restaurant, cafe → essential (service business).
- ขายส่ง, wholesale, สินค้า, products, แคตตาล็อก → catalog unless online payment is requested.
- Payment, ชำระเงิน, สั่งซื้อออนไลน์+จ่ายเงิน, take payment online, online order with checkout → commerce.
- Wants an AI assistant, premium brand experience, or a third language → flagship.
- Custom app, platform, or unusual scope → signature.

If the input is a QUESTION about price rather than a business description, still return the best-guess tier from any business type mentioned, and make the pitch invite them to the form (request a free demo / leave details).

Language examples (copy the field language, not the wording):
- Input in English with no Thai letters → {"tier":"commerce","tier_reason":"They want online orders with checkout.","features":["Product catalog","Online checkout","Order tracking","Shipping options","Admin dashboard"],"pitch":"Leave your details on the form and we will follow up with a free demo."}
- Input with Thai letters → {"tier":"essential","tier_reason":"เป็นธุรกิจบริการที่เหมาะกับแพ็กเกจพื้นฐาน","features":["หน้าแรก","หน้ารายการบริการ","ระบบจองคิว","แผนที่ร้าน","หน้าติดต่อ"],"pitch":"กรอกแบบฟอร์มเพื่อขอเดโม่ฟรี แล้วเราจะติดต่อกลับ"}

LANGUAGE RULE (repeat): If the user's input contains ANY Thai characters, EVERY field in your JSON (tier_reason, all 5 features, pitch) MUST be written entirely in Thai. English only when the input has no Thai at all. Never mix languages in one response. Match the input language exactly: Thai input → Thai JSON fields; English input → English JSON fields. Never default to Thai for English input, even if the business is in Bangkok.`;

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
