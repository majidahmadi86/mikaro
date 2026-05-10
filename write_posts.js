const fs = require("fs");
const path = require("path");

function p(html) {
  return html.replace(/\s+/g, " ").trim();
}

const articles = [
  {
    id: 1,
    slug: "website-losing-clients-signs",
    title: "5 Signs Your Website Is Quietly Losing You Clients Right Now",
    subtitle: "Traffic can look healthy while conversions quietly collapse.",
    category: "Web Design",
    tags: ["conversion", "UX", "Bangkok"],
    publishDate: "2025-06-01",
    readTime: "7 min read",
    author: "Mike",
    excerpt:
      "Most owners assume slow decline is normal. Here are five silent signals that your site is costing you qualified leads — and what to fix first.",
    content: p(`<h2 id="section-1">1. High bounce on mobile</h2><p>If analytics show mobile bounce climbing while desktop stays stable, layout and tap targets are usually the culprit. Visitors decide in seconds whether your site feels credible.</p><h2 id="section-2">2. Contact friction</h2><p>Every extra field or unclear next step reduces completions. WhatsApp buttons that blend into the footer rarely outperform a sticky, high-contrast action.</p><h2 id="section-3">3. Slow perceived load</h2><p>Even fast servers fail when hero images are unoptimised or fonts block rendering. Perceived speed beats raw Lighthouse scores for trust.</p><h2 id="section-4">4. Generic messaging</h2><p>Copy that could belong to any competitor trains visitors to price-shop. Specific outcomes and proof reduce hesitation.</p><h2 id="section-5">5. No visible SEO structure</h2><p>Thin headings and missing meta descriptions hurt discovery. A rebuild should pair messaging with technical basics.</p><p>If two or more signs show up, prioritise a focused redesign sprint rather than scattered tweaks.</p>`),
    featuredImage: "post-1.jpg",
    metaDescription:
      "Five silent signs your website leaks leads — mobile bounce, contact friction, slow loads, generic copy, weak SEO — with fixes that matter.",
    metaKeywords: "website conversion Bangkok, UX audit, mobile bounce",
  },
  {
    id: 2,
    slug: "timeless-vs-trendy-logo",
    title: "Timeless vs Trendy: What Makes a Logo Last 10 Years?",
    subtitle: "Trends fade; structure and restraint survive.",
    category: "Branding",
    tags: ["logo", "identity"],
    publishDate: "2025-06-08",
    readTime: "6 min read",
    author: "Mike",
    excerpt:
      "Trendy logos age quickly. Learn which choices survive rebrands and how to brief for longevity.",
    content: p(`<h2 id="section-1">Structure before decoration</h2><p>Marks built on simple geometry scale across signage, embroidery, and favicons. Ornamental flourishes rarely survive digital-first brands.</p><h2 id="section-2">Colour discipline</h2><p>Gold gradients look luxurious today but date faster than solid palettes anchored by one hero tone.</p><h2 id="section-3">Typography pairing</h2><p>Wordmarks age better when letterforms avoid ultra-thin strokes that disappear on small screens.</p><p>Ask your designer for monochrome reversals early — if it fails in black and white, it will fail outdoors.</p>`),
    featuredImage: "post-2.jpg",
    metaDescription:
      "How geometry, colour restraint, and typography choices keep a logo relevant for a decade.",
    metaKeywords: "logo design Bangkok, timeless branding",
  },
  {
    id: 3,
    slug: "ai-chatbots-bangkok-acquisition",
    title: "How AI Chatbots Are Changing Customer Acquisition for Bangkok Businesses",
    subtitle: "Automation works when it respects Thai chat habits.",
    category: "AI & Technology",
    tags: ["chatbot", "LINE", "WhatsApp"],
    publishDate: "2025-06-15",
    readTime: "8 min read",
    author: "Mike",
    excerpt:
      "Bangkok buyers expect instant replies on LINE and WhatsApp. Here's how AI assistants qualify leads without sounding robotic.",
    content: p(`<h2 id="section-1">Instant qualification</h2><p>Bots triage service fit before humans spend time on mismatched inquiries.</p><h2 id="section-2">Language nuance</h2><p>Mixed Thai-English prompts require tone calibration — canned translations destroy trust.</p><h2 id="section-3">Escalation paths</h2><p>The best flows push warm leads to humans with context attached.</p>`),
    featuredImage: "post-3.jpg",
    metaDescription:
      "AI chatbots for Bangkok businesses: qualification, bilingual tone, and smooth handoff to humans.",
    metaKeywords: "AI chatbot Bangkok, LINE automation",
  },
  {
    id: 4,
    slug: "bangkok-digital-marketing-2025",
    title: "The Bangkok Business Owner's Digital Marketing Guide for 2025",
    subtitle: "Channels stack — they rarely replace each other.",
    category: "Digital Marketing",
    tags: ["SEO", "strategy"],
    publishDate: "2025-06-22",
    readTime: "9 min read",
    author: "Mike",
    excerpt:
      "Search, social proof, and paid discovery still play different roles. Allocate budget where intent matches your offer.",
    content: p(`<h2 id="section-1">Intent layers</h2><p>SEO captures research mode; retargeting captures consideration; WhatsApp closes high-trust sales.</p><h2 id="section-2">Local proof</h2><p>Reviews and Thai-language landing pages outperform generic English-only pages for domestic buyers.</p>`),
    featuredImage: "post-4.jpg",
    metaDescription:
      "Practical 2025 digital marketing priorities for Bangkok owners balancing SEO, ads, and messaging apps.",
    metaKeywords: "digital marketing Bangkok 2025, SEO Thailand",
  },
  {
    id: 5,
    slug: "psychology-first-impressions-website",
    title: "The Psychology of First Impressions: Why Your Website Has 3 Seconds",
    subtitle: "Brains shortcut decisions — design for that reality.",
    category: "Web Design",
    tags: ["psychology", "UX"],
    publishDate: "2025-07-01",
    readTime: "6 min read",
    author: "Mike",
    excerpt:
      "Visitors pattern-match instantly. Visual hierarchy and proof density decide whether they scroll or bounce.",
    content: p(`<h2 id="section-1">Visual hierarchy</h2><p>Headlines, contrast, and whitespace guide eyes faster than paragraphs.</p><h2 id="section-2">Social proof placement</h2><p>Logos near the hero outperform testimonials buried below the fold.</p>`),
    featuredImage: "post-5.jpg",
    metaDescription:
      "Why first impressions form in seconds and how hierarchy and proof reduce bounce rates.",
    metaKeywords: "website psychology, first impressions UX",
  },
  {
    id: 6,
    slug: "logo-pricing-thailand-budgets",
    title: "Logo Design Pricing in Thailand: What You Actually Get at Each Budget",
    subtitle: "Transparent ranges — without hiding scope.",
    category: "Branding",
    tags: ["pricing", "Thailand"],
    publishDate: "2025-07-10",
    readTime: "7 min read",
    author: "Mike",
    excerpt:
      "Entry budgets buy exploration; mid tiers buy systems; premium buys differentiation and rollout support.",
    content: p(`<h2 id="section-1">Starter logos</h2><p>Fewer concepts but workable files for digital-first launches.</p><h2 id="section-2">Mid tier</h2><p>Brand palettes, typography rules, and export packs suitable for print partners.</p><h2 id="section-3">Premium</h2><p>Extended guidelines and stakeholder workshops.</p>`),
    featuredImage: "post-6.jpg",
    metaDescription:
      "What Thai logo budgets typically include at starter, mid, and premium scopes.",
    metaKeywords: "logo pricing Thailand, brand budget",
  },
  {
    id: 7,
    slug: "brief-designer-10-questions",
    title: "How to Brief a Designer: 10 Questions That Get You Better Results",
    subtitle: "Clarity beats inspiration boards alone.",
    category: "Web Design",
    tags: ["brief", "process"],
    publishDate: "2025-07-18",
    readTime: "8 min read",
    author: "Mike",
    excerpt:
      "Answer these ten prompts before kickoff and your designer spends time crafting — not guessing.",
    content: p(`<h2 id="section-1">Goals and constraints</h2><p>Business outcomes, deadlines, and technical limits upfront prevent rework.</p><h2 id="section-2">Audience specifics</h2><p>Who decides, who influences, and what objections appear.</p><p>Include competitors you admire and ones you avoid — both matter.</p>`),
    featuredImage: "post-7.jpg",
    metaDescription:
      "Ten briefing questions that align designers and stakeholders before creative work begins.",
    metaKeywords: "design brief, creative briefing Bangkok",
  },
  {
    id: 8,
    slug: "claude-chatgpt-gemini-bangkok",
    title: "Claude vs ChatGPT vs Gemini: Which AI Tool Works Best for Bangkok Businesses?",
    subtitle: "Match the model to your workflow — not the hype cycle.",
    category: "AI & Technology",
    tags: ["AI", "comparison"],
    publishDate: "2025-07-26",
    readTime: "7 min read",
    author: "Mike",
    excerpt:
      "Each flagship model shines at different tasks: drafting, analysis, or multilingual nuance.",
    content: p(`<h2 id="section-1">Drafting marketing copy</h2><p>Compare tone controls for Thai-English mixes.</p><h2 id="section-2">Analytical tasks</h2><p>Spreadsheet reasoning differs by release — benchmark on your data.</p>`),
    featuredImage: "post-8.jpg",
    metaDescription:
      "Practical comparison of leading AI assistants for Bangkok marketing and ops teams.",
    metaKeywords: "Claude vs ChatGPT Bangkok, AI tools business",
  },
  {
    id: 9,
    slug: "seo-roadmap-new-bangkok-websites",
    title: "From Zero to 1,000 Monthly Visitors: An SEO Roadmap for New Bangkok Websites",
    subtitle: "Structure first — shortcuts rarely compound.",
    category: "Digital Marketing",
    tags: ["SEO", "growth"],
    publishDate: "2025-08-05",
    readTime: "10 min read",
    author: "Mike",
    excerpt:
      "Technical foundations, topical clusters, and earned backlinks still outperform gimmicks.",
    content: p(`<h2 id="section-1">Technical baseline</h2><p>Indexability, speed, and schema before publishing dozens of thin pages.</p><h2 id="section-2">Content clusters</h2><p>Pillar pages supported by specific articles outperform isolated posts.</p>`),
    featuredImage: "post-9.jpg",
    metaDescription:
      "Step-by-step SEO roadmap for new Bangkok websites aiming for sustainable organic traffic.",
    metaKeywords: "SEO Bangkok, new website SEO roadmap",
  },
  {
    id: 10,
    slug: "business-english-edge-bangkok",
    title: "Why Business English Confidence Is the Hidden Edge Bangkok Professionals Are Missing",
    subtitle: "Communication affects deals as much as dashboards.",
    category: "Business English",
    tags: ["English", "career"],
    publishDate: "2025-08-14",
    readTime: "6 min read",
    author: "Mike",
    excerpt:
      "Fluency reduces friction in regional meetings, vendor calls, and investor updates.",
    content: p(`<h2 id="section-1">Meetings that move</h2><p>Clear agendas and confident summaries align multicultural teams faster.</p><h2 id="section-2">Written credibility</h2><p>Emails that sound decisive reduce back-and-forth.</p>`),
    featuredImage: "post-10.jpg",
    metaDescription:
      "Why spoken and written business English still drives outcomes for Bangkok professionals.",
    metaKeywords: "business English Bangkok, executive communication",
  },
];

fs.mkdirSync(path.join(__dirname, "journal"), { recursive: true });
fs.writeFileSync(
  path.join(__dirname, "journal", "posts.json"),
  JSON.stringify(articles, null, 2),
  "utf8"
);
console.log("Wrote journal/posts.json", articles.length);
