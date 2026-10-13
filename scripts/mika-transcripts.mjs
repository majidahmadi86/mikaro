/* MIKA test transcripts · EN and TH.
   Runs scripted conversations through the same brain the widget uses
   (js/chat.js createConversation), checks the facts that must hold, and,
   when ANTHROPIC_API_KEY is set, also sends the free-text prompts through
   api/mika.js (the Claude route) exactly as the site would.

   node scripts/mika-transcripts.mjs [out.md]      default: artifacts/mika-transcripts-v17.md */
import { createRequire } from 'module';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const chat = require(join(root, 'js', 'chat.js'));
const out = process.argv[2] || join(root, 'artifacts', 'mika-transcripts-v17.md');

const LINE = 'line.me/ti/p/l059F3WkI7';
const SCRIPTS = {
  en: [
    ['Live work', ['examples']],
    ['Hotel owner', ['hello', 'hotel']],
    ['Pricing ladder', ['pricing']],
    ['Luxury group', ['luxury', 'hotel group']],
    ['Solenne price', ['solenne']],
    ['Qualify after examples', ['examples', 'hotel', 'yes']]
  ],
  th: [
    ['ผลงาน', ['ผลงาน']],
    ['เจ้าของโรงแรม', ['สวัสดี', 'โรงแรม']],
    ['ราคา', ['ราคา']],
    ['กลุ่มโรงแรมลักชัวรี', ['ลักชัวรี', 'กลุ่มโรงแรม']],
    ['ราคา Solenne', ['Solenne ราคาเท่าไหร่']],
    ['หลังดูผลงาน', ['ผลงาน', 'โรงแรม', 'สนใจ']]
  ]
};
const FREE_TEXT = {
  en: ['We run three luxury resorts in Phuket and Bali. How much would Solenne cost us?', 'I have a 4-star hotel with a restaurant and a ballroom. Which package fits?', 'Show me your live hotel work.'],
  th: ['เรามีรีสอร์ตหรูสามแห่ง Solenne ราคาเท่าไหร่ครับ', 'โรงแรม 4 ดาวมีห้องอาหารและห้องจัดเลี้ยง ควรใช้แพ็กเกจไหน', 'ขอดูผลงานโรงแรมที่ออนไลน์จริง']
};

const checks = [];
function check(name, ok, detail = '') { checks.push({ name, ok, detail }); }

function rule(lang, q, a) {
  const solenneTalk = /solenne/i.test(a);
  if (solenneTalk) {
    // Solenne must never carry a number: look at the 90 characters after every mention
    // (16 languages / 13 currencies and the LINE id are allowed)
    const t = a.replace(LINE, '');
    const sol = [...t.matchAll(/solenne/gi)].map(m => t.slice(m.index, m.index + 90).split(/ · |\n| Teak House/)[0]).join(' | ');
    const nums = (sol.match(/\d[\d,]*/g) || []).filter(n => !['16', '13'].includes(n));
    check(`[${lang}] "${q}": no number quoted for Solenne`, nums.length === 0, nums.join(', '));
  }
  if (/\u2014/.test(a)) check(`[${lang}] "${q}": no em dash`, false);
}

const md = [];
md.push('# MIKA transcripts · v17', '', `Run: ${new Date().toISOString()} · js/chat.js scripted brain (the path the widget takes for chips and short queries).`, '');
for (const lang of ['en', 'th']) {
  md.push(`## ${lang.toUpperCase()} · scripted brain`, '');
  for (const [title, turns] of SCRIPTS[lang]) {
    md.push(`### ${title}`, '');
    const conv = chat.createConversation(lang);
    for (const q of turns) {
      const r = conv.ask(q);
      const acts = (r.acts || []).map(x => x.l + (x.h ? ` (${x.h})` : '')).join(' · ');
      md.push(`**Visitor:** ${q}`, '', `**MIKA** \`${r.id}\`: ${r.a.replace(/\n+/g, ' ')}`, '', acts ? `_Buttons:_ ${acts}` : '', '');
      rule(lang, q, r.a);
    }
  }
}

// facts that must hold
const F = chat.FACTS;
const tr = F.shared.trackRecord;
check('trackRecord order: Solenne, Teak House, PRAOW', tr.indexOf('Solenne') < tr.indexOf('Teak House') && tr.indexOf('Teak House') < tr.indexOf('PRAOW'));
for (const lang of ['en', 'th']) {
  const p = F[lang].proof;
  check(`[${lang}] proof order: Solenne, Teak House, PRAOW`, p.indexOf('Solenne') < p.indexOf('Teak House') && p.indexOf('Teak House') < p.indexOf('PRAOW'));
  const hotel = F[lang].qualify.hotel;
  check(`[${lang}] hotel answer names Teak House 119,000 and Teak House Plus 189,000`, /119,000/.test(hotel) && /Teak House Plus/.test(hotel) && /189,000/.test(hotel));
  check(`[${lang}] hotel answer links both demos`, hotel.includes('teakhouse.mikaro.studio') && hotel.includes('solenne.mikaro.studio'));
  check(`[${lang}] Solenne answer hands off to LINE`, F[lang].luxury.includes(LINE));
  const sys = F[lang].packages.find(p => p.name === 'Patient & Guest System').features.join(' ');
  check(`[${lang}] Patient & Guest System names Teak House and Teak House Plus`, /Teak House/.test(sys) && /Teak House Plus/.test(sys));
}
check('hotelPlatforms demo links', JSON.stringify(F.shared.hotelPlatforms.demoLinks) === JSON.stringify(['https://solenne.mikaro.studio', 'https://teakhouse.mikaro.studio']));

// Claude route
md.push('## Free text · Claude route (api/mika.js)', '');
if (!process.env.ANTHROPIC_API_KEY) {
  md.push('NOT RUN: `ANTHROPIC_API_KEY` is not set in this environment (it lives only in the Vercel project settings), so the Claude route could not be called. The prompts below are queued for a run with the key:', '');
  for (const lang of ['en', 'th']) for (const q of FREE_TEXT[lang]) md.push(`- [${lang}] ${q}`);
  md.push('');
} else {
  const { default: handler } = await import(join(root, 'api', 'mika.js').replace(/\\/g, '/').replace(/^([A-Z]):/, 'file:///$1:'));
  for (const lang of ['en', 'th']) {
    for (const q of FREE_TEXT[lang]) {
      let status = 0, body = null;
      const res = { status(c) { status = c; return this; }, json(b) { body = b; return this; } };
      await handler({ method: 'POST', body: { lang, messages: [{ role: 'user', content: q }] } }, res);
      const a = body && body.reply ? body.reply : `(error ${status} ${JSON.stringify(body)})`;
      md.push(`**Visitor [${lang}]:** ${q}`, '', `**MIKA (Claude):** ${a.replace(/\n+/g, ' ')}`, '');
      rule(lang, q, a);
    }
  }
}

md.push('## Checks', '');
for (const c of checks) md.push(`- ${c.ok ? 'PASS' : 'FAIL'} · ${c.name}${c.detail ? ' · ' + c.detail : ''}`);
const failed = checks.filter(c => !c.ok).length;
md.push('', `${checks.length - failed}/${checks.length} checks passed.`);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, md.join('\n') + '\n');
console.log(`${checks.length - failed}/${checks.length} checks passed · ${out}`);
process.exitCode = failed ? 1 : 0;
