# MIKARO STUDIO — FINAL WEBSITE BRIEF
# Claude Code: Read every word before writing a single line of code.
# Reference file: index.html (existing — preserve ALL SVG logos, web mockups, photo, and content. Replace design/CSS entirely.)

═══════════════════════════════════════════════════════════
## 1. OWNER
═══════════════════════════════════════════════════════════
Name:     Majid Ahmadi (Mike)
Email:    majid.ahmadi86@gmail.com
WhatsApp: +66951967330  →  https://wa.me/66951967330
LINE:     mike_aj       →  https://line.me/ti/p/~mike_aj
LinkedIn: https://www.linkedin.com/in/majid-ahmadi86
TikTok:   https://www.tiktok.com/@survivalmodemike
Site:     https://mikaro.studio
Location: Bangkok, Thailand · Available worldwide


═══════════════════════════════════════════════════════════
## 2. DESIGN SYSTEM — ZERO EXCEPTIONS
═══════════════════════════════════════════════════════════

### CSS Variables (:root — dark mode default)
```css
:root {
  /* Backgrounds */
  --ink:        #080810;   /* hero, dark sections */
  --deep:       #0d0d18;   /* services, contact, footer */
  --surface:    #12121e;   /* cards on dark */

  /* Gold accent — ONLY accent color */
  --gold:       #C9A84C;
  --gold-light: #e8c96a;
  --gold-pale:  rgba(201,168,76,.08);
  --gold-border:rgba(201,168,76,.25);

  /* Light sections */
  --cream:      #F9F7F2;
  --white:      #ffffff;

  /* Typography */
  --text-dark:  #1a1a2e;
  --text-muted: #64748B;

  /* Borders */
  --border-d:   rgba(255,255,255,.07);
  --border-g:   rgba(201,168,76,.25);

  /* Footer */
  --footer-bg:  #040408;

  /* Transitions */
  --t: .32s cubic-bezier(.4,0,.2,1);
}
```

### Light Mode (class .light-mode on <body>)
```css
body.light-mode {
  --ink:        #f0ede6;
  --deep:       #e8e4dc;
  --surface:    #ffffff;
  --gold:       #8a6520;
  --gold-light: #a07828;
  --gold-pale:  rgba(138,101,32,.07);
  --gold-border:rgba(138,101,32,.25);
  --cream:      #ffffff;
  --white:      #f7f5f0;
  --text-dark:  #0f0f1a;
  --text-muted: #374151;
  --border-d:   rgba(0,0,0,.09);
  --border-g:   rgba(138,101,32,.25);
  --footer-bg:  #0f0f1a;  /* Footer always dark in BOTH themes */
}
/* CRITICAL: Footer is ALWAYS dark regardless of theme.
   Footer background: var(--footer-bg) which is dark in both modes.
   Footer text: always rgba(255,255,255,X) — never inherits light theme text colors. */
```

### Fonts (Google Fonts — load in this exact order)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600;700&display=optional" rel="stylesheet">
```
- Headings H1–H3: Cormorant Garamond (300/400 + italic)
- Body, UI, labels: Outfit (300/400/500/600/700)
- Note: Outfit replaces Inter (matches existing site font)

### Section Background Rhythm
```
nav            → rgba(8,8,16,.96) fixed, backdrop-blur(20px)
#hero          → var(--ink)
#services      → var(--deep)
#process       → var(--white) — text dark
#about         → var(--cream) — text dark
#portfolio     → var(--ink)
#proof         → var(--deep)
#testimonials  → var(--cream) — text dark
#journal-cta   → var(--ink)
#faq           → var(--white) — text dark
#contact       → var(--deep)
footer         → var(--footer-bg) ALWAYS DARK
```

### Icon System — CRITICAL
ALL icons throughout the site must use this exact spec:
- Library: Lucide icon set (stroke-based, consistent weight)
- Style: stroke only, NO fill, stroke-width: 1.6, stroke-linecap: round, stroke-linejoin: round
- Color: stroke="var(--gold)" on dark sections | stroke="var(--text-dark)" on light sections
- Size in icon box: 24×24px SVG
- Icon container: 48×48px box, border-radius 10px, background var(--gold-pale), border 1px var(--border-g)
- DO NOT use simple geometric placeholder icons — use proper Lucide paths

Service card icons (Lucide paths — use exactly):
  Logo & Brand Identity:
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>

  Web Design & Development (featured center card):
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M2 20h20"/>
      <path d="M8 7l4 4 4-4"/>
      <path d="M12 11v6"/>
    </svg>

  Full Brand + Marketing:
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>

  Digital Marketing Strategy:
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
      <path d="M18 10l-3-3-3 3"/>
      <path d="M12 4L9 7"/>
    </svg>

  AI Marketing Workshop:
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2z"/>
      <circle cx="8.5" cy="14.5" r="1.5"/>
      <circle cx="15.5" cy="14.5" r="1.5"/>
      <path d="M9 19c0-1.66 1.34-2 3-2s3 .34 3 2"/>
    </svg>

  English for Business:
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <path d="M8 10h8"/>
      <path d="M8 14h5"/>
    </svg>

Process step icons (Lucide, same spec):
  Discovery:   <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  Strategy:    <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  Creation:    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  Launch:      <path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>

Nav icons (contact methods in footer/contact section):
  WhatsApp:  standard WhatsApp path (use existing from index.html line 1403)
  LINE:      standard message bubble path (use existing from index.html line 1406)
  Email:     <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  LinkedIn:  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  Location:  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>

Proof section icons (keep from existing index.html — lines 1264–1277)
Chatbot icon (keep from existing — line 1411)


═══════════════════════════════════════════════════════════
## 3. LOGO — EXACT SVG (do not modify a single point)
═══════════════════════════════════════════════════════════
Use this EXACT SVG everywhere the logo appears:
```svg
<!-- NAV + FOOTER size: height="38" in nav, height="32" in footer -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 54" height="38" aria-label="Mikaro Studio">
  <polygon points="14,36 26,18 38,36 34,36 26,26 18,36" fill="#ffffff"/>
  <polygon points="26,36 38,18 50,36 46,36 38,26 30,36" fill="#C9A84C"/>
  <rect x="14" y="38" width="36" height="4" rx="2" fill="#ffffff" opacity="0.85"/>
  <text x="60" y="33" font-family="Outfit,system-ui,sans-serif" font-size="21" font-weight="600" fill="#ffffff" letter-spacing="-0.2">Mikaro</text>
  <text x="60" y="48" font-family="Outfit,system-ui,sans-serif" font-size="10" font-weight="400" fill="#C9A84C" letter-spacing="2.5">STUDIO</text>
</svg>

<!-- CHATBOT AVATAR (in chat panel header) -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
  <polygon points="6,28 14,12 22,28 19,28 14,20 9,28" fill="#ffffff"/>
  <polygon points="14,28 22,12 30,28 27,28 22,20 17,28" fill="#C9A84C"/>
  <rect x="6" y="29.5" width="24" height="3" rx="1.5" fill="#ffffff" opacity="0.8"/>
</svg>

<!-- FAVICON (in <head>) — exact from existing site -->
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%230d1829'/%3E%3Cpolygon points='4,24 11,11 18,24 15,24 11,16 7,24' fill='%23ffffff'/%3E%3Cpolygon points='11,24 18,11 25,24 22,24 18,16 14,24' fill='%23C9A84C'/%3E%3Crect x='4' y='25' width='21' height='2.5' rx='1.25' fill='%23ffffff' opacity='.75'/%3E%3C/svg%3E"/>
```


═══════════════════════════════════════════════════════════
## 4. RESPONSIVE — CSS ONLY, NO JS SWITCHING
═══════════════════════════════════════════════════════════
The layout must respond automatically to screen size via CSS media queries.
NO JavaScript viewport detection. NO toggle buttons. Pure CSS responsive.

Breakpoints:
  @media (max-width: 1024px)  → tablet adjustments
  @media (max-width: 768px)   → mobile layout (main breakpoint)
  @media (max-width: 480px)   → small phone adjustments

Key responsive rules:
  Nav:         hamburger replaces links at 768px. Overlay menu full-screen.
  Hero:        grid-template-columns: 1fr at 768px. Photo col hidden at 768px.
  Services:    3-col → 1-col at 768px
  Process:     4-col → 2-col at 768px → 1-col at 480px. Steps::before connector hidden mobile.
  About:       2-col → 1-col at 768px
  Proof:       4-col → 2×2 at 768px
  Testimonials:2-col → 1-col at 768px
  Contact:     2-col → 1-col at 768px
  Footer:      3-col → 1-col at 768px
  Portfolio:   3-col → 2-col at 768px → 1-col at 480px
  Journal grid:3-col → 2-col at 768px → 1-col at 480px
  Service pages:2-col → 1-col at 768px

html { scroll-behavior: smooth; scroll-padding-top: 70px; }


═══════════════════════════════════════════════════════════
## 5. FILE STRUCTURE
═══════════════════════════════════════════════════════════
```
mikaro.studio/
├── index.html
├── journal.html
├── post.html
├── 404.html
├── sitemap.xml
├── robots.txt
├── config.js                 ← API keys only. IN .gitignore. Never push.
├── .gitignore
│
├── services/
│   ├── web-design.html
│   ├── logo-design.html
│   ├── brand-package.html
│   ├── digital-marketing.html
│   ├── ai-workshop.html
│   └── english-coaching.html
│
├── assets/
│   ├── css/style.css         ← Shared: nav, footer, variables, utilities
│   ├── js/
│   │   ├── main.js           ← Nav, chatbot, FAQ, form, counters, theme toggle
│   │   ├── journal.js        ← Fetch + render + filter blog
│   │   └── post.js           ← Post reader, TOC, progress bar, share
│   └── img/
│       └── (placeholder — user provides profile.jpg and og-cover.jpg)
│
└── journal/
    └── posts.json
```


═══════════════════════════════════════════════════════════
## 6. NAVIGATION
═══════════════════════════════════════════════════════════

### Desktop (>768px)
- Position: fixed, top 0, full width, z-index 900
- Background: rgba(8,8,16,.96), backdrop-filter: blur(20px)
- Height: 70px
- Border-bottom: 1px solid rgba(201,168,76,.15)
- Left: Logo SVG (exact from section 3, height 38px)
- Center links: About | Services | Design Portfolio | Results | FAQ
  - Font: Outfit 500, .8rem, uppercase, letter-spacing .07em
  - Color: rgba(255,255,255,.65) → var(--gold) on hover/active
  - Underline animation: width 0 → 100% on hover (gold, 1.5px)
  - Active section highlighted via IntersectionObserver
- Right: "Start Your Project →" — gold bg, navy text, border-radius 8px
- Services link: hover shows dropdown panel with 6 service page links
- On scroll >60px: background → rgba(13,24,41,1), box-shadow added

### Mobile (≤768px)
- Show hamburger (3 gold bars), hide nav links
- Hamburger animates to X when open (CSS transform)
- Overlay: full viewport, var(--ink) bg, slides in from right
- Same gold grid pattern as hero section
- Gold left border rule 3px
- Links: large Cormorant Garamond, numbered 01-06, stacked vertically
- Close on link click, close on outside tap, body scroll locked
- Footer of overlay: WhatsApp + LINE icon buttons

### Theme Toggle Button
- Position: in nav right side, after CTA button
- Icon: sun (light mode off) / moon (light mode on) — Lucide icons
- On click: toggles class .light-mode on <body>
- Saves preference to localStorage('mikaro-theme')
- On page load: reads localStorage and applies saved theme


═══════════════════════════════════════════════════════════
## 7. URGENCY BAR
═══════════════════════════════════════════════════════════
- Position: immediately below fixed nav (top: 70px when nav present, or static)
- Height: 40px
- Background: var(--gold)
- Text (Outfit 600, 13px, #080810): "Limited project slots this month — "
- Inline link (#080810, underline): "Chat with Mike now →"
  → https://wa.me/66951967330?text=Hi%20Mike%2C%20I%20saw%20you%20have%20limited%20slots.%20I%27d%20like%20to%20discuss%20a%20project.
- Dismiss X button (right side, #080810)
- Slides down on show (CSS translateY animation)
- Dismissed state: saved to sessionStorage. Reappears on next visit.
- GA4 event on link click: gtag('event','urgency_bar_click')


═══════════════════════════════════════════════════════════
## 8. HERO SECTION
═══════════════════════════════════════════════════════════
- Background: var(--ink)
- Desktop: grid 2-col (1.1fr 0.9fr), min-height 100vh, padding-top 70px
- Mobile: single column, photo hidden

### Left column
Eyebrow (pill badge, gold border, gold bg pale, gold text, pulse dot animation):
  "Bangkok Branding Studio · Web Design Services & Digital Solutions"

H1 (Cormorant Garamond 300, clamp(3rem,5vw,4.8rem), #fff, letter-spacing -.02em):
  "Brand · Design"
  <span class="accent" style="color:var(--gold);font-style:italic;display:block">· Strategy</span>

Description (Outfit 300, 1.05rem, rgba(255,255,255,.58), line-height 1.78, max-width 480px):
  "A premium branding studio crafting web design services, brand identities,
   AI chatbot development and digital solutions that position businesses
   to lead — not follow. Founded by a digital creator with 10+ years in the field."

Service chips row (flex, flex-wrap, gap .5rem):
  Chips: Brand Identity | Logo Design | Web Design | Marketing Strategy | AI Workshops
  Style: rgba(255,255,255,.05) bg, rgba(255,255,255,.1) border, rgba(255,255,255,.75) text

Buttons (flex, gap 1rem):
  Primary: "Start Your Project — Free Consultation"
    → #contact, .btn-g style (gold bg, navy text, border-radius 8px)
  Secondary: "Explore Mikaro Studio"
    → #services, .btn-o style (transparent, white border)

KPI stats row (border-top rgba white .07, padding-top 2rem, margin-top 3.2rem):
  10+ Years in the Field | 60+ Projects Delivered | 3 Service Disciplines
  Numbers: Cormorant Garamond 700, 2.2rem, var(--gold)
  Labels: Outfit 400, .7rem, rgba(255,255,255,.38), uppercase

### Right column (desktop only)
Exact structure from existing index.html:
- .hero-photo-frame with ::before gold border frame and ::after gradient overlay
- <img> tag pointing to assets/img/profile.jpg
- .hero-badge.b1 (bottom-left, gold bg): "60+ Projects Done" with large number
- .hero-badge.b2 (top-right, navy bg gold border): "5 Days" / "Site Live"

### Hero background elements
- .hero-grid-bg: CSS background-image grid pattern, rgba(201,168,76,.03)
- .hero-orb-1: 600px radial gradient orb, rgba(201,168,76,.07), top-right
- .hero-orb-2: 400px radial gradient orb, navy, bottom-left
- @keyframes rise: opacity 0→1, translateY 28px→0 (staggered on load)
- Gold left border rule: 3px solid var(--gold), position absolute left 0


═══════════════════════════════════════════════════════════
## 9. SERVICES SECTION — EXACT CARD ORDER AND CONTENT
═══════════════════════════════════════════════════════════
Background: var(--deep)
Grid: 3×2 (3 columns, 2 rows) on desktop. 1 column on mobile.

CARD ORDER (left to right, top to bottom):
Row 1: Logo & Brand Identity | [WEB DESIGN CENTER — FEATURED] | Full Brand + Marketing
Row 2: Digital Marketing Strategy | AI Marketing Workshop | English for Business

CENTER CARD (position 2, row 1) = Web Design & Development = class "featured"
  - Has .pkg-star badge: "Most Popular"
  - Background: rgba(201,168,76,.08)
  - Border: 1px solid rgba(201,168,76,.4)
  - Top gold bar (::before): opacity 1 always
  - CTA button: .pkg-cta (solid gold, not outline)

All cards structure:
```html
<div class="pkg-card [featured] reveal">
  [<div class="pkg-star">Most Popular</div>]   ← featured only
  <div class="pkg-icon">[LUCIDE SVG from section 2]</div>
  <div class="pkg-name">[Name]</div>
  <div class="pkg-desc">[Description]</div>
  <div class="pkg-features">
    <div class="pkg-feat">
      <div class="pkg-feat-icon"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
      [Feature text]
    </div>
    ... (5 features each)
  </div>
  <a href="#contact" class="pkg-cta [pkg-cta-o]">[CTA text]</a>
</div>
```

CARD CONTENT (exact from existing index.html):

Card 1 — Logo & Brand Identity (row 1, left)
  Icon: star/logo icon (section 2)
  Desc: "A professional logo and brand identity system that makes your business instantly recognisable and memorable."
  Features: Custom logo design (3 concepts) | Brand colour palette & typography | Business card design | All file formats (PNG, SVG, PDF) | 2 revision rounds
  CTA: "Get Your Logo in 48h →" (outline style)

Card 2 — Web Design & Development (row 1, CENTER, FEATURED)
  Icon: web/monitor icon (section 2)
  Desc: "A stunning, fast, mobile-first website that turns visitors into clients — built with conversion in mind from the first pixel."
  Features: Custom responsive website design | SEO-optimised structure & meta tags | Contact form + WhatsApp integration | Mobile & tablet optimised | 3 revision rounds + delivery
  CTA: "Get Your Site Live in 5 Days →" (solid gold)

Card 3 — Full Brand + Marketing (row 1, right)
  Icon: layers icon (section 2)
  Desc: "The complete package — logo, website, social media strategy, and ongoing marketing support to grow your brand from day one."
  Features: Everything in Logo + Web packages | Social media setup & strategy | Monthly content calendar | SEO & digital marketing plan | 1-month launch support
  CTA: "Launch My Brand →" (outline)

Card 4 — Digital Marketing Strategy (row 2, left)
  Icon: bar chart icon (section 2)
  Desc: "A data-driven marketing roadmap — from audience research and channel strategy to campaign execution and ROI tracking."
  Features: Market & competitor analysis | Multi-channel campaign strategy | SEO, paid ads & content plan | KPI dashboard & reporting | Monthly strategy sessions
  CTA: "Grow My Audience →" (outline)

Card 5 — AI Marketing Workshop (row 2, center)
  Icon: AI/robot icon (section 2)
  Desc: "Future-proof your team with practical, hands-on training in AI tools, prompt engineering, and AI-powered content creation."
  Features: ChatGPT & AI tools mastery | Prompt engineering for marketing | AI content creation workflows | Team or individual sessions | Post-workshop resource pack
  CTA: "Book Your AI Workshop →" (outline)

Card 6 — English for Business (row 2, right)
  Icon: chat bubble icon (section 2)
  Desc: "Confidence-building English training for professionals and corporate teams — practical, speaking-focused, and results-driven."
  Features: Business communication skills | Presentation & public speaking | Meetings, emails & negotiation | Individual or corporate group | In-person or online sessions
  CTA: "Speak With Confidence →" (outline)

Urgency note below section tag:
  "⚡ Limited availability — 3 project slots open this month. We respond within 2 hours."
  Style: Outfit .8rem, var(--gold), letter-spacing .04em


═══════════════════════════════════════════════════════════
## 10. COST ESTIMATOR WIDGET
═══════════════════════════════════════════════════════════
- Placed between Services and Process sections
- Background: var(--deep) (same — no visual break)
- Max-width: 660px, centered, padding 60px 24px
- Title (Cormorant Garamond 400, #fff, center): "How much will your project cost?"
- Subtitle (Outfit 300, muted, center): "Get an instant estimate — no obligation."

Step 1 — Select service (pill buttons, one active at a time):
  Logo Design | Website | Brand Package | Marketing | AI Workshop | English

Step 2 — Select size (changes based on step 1 selection):
  Logo: Basic | Standard | Premium
  Website: Landing Page | Business Site | E-commerce
  Brand Package: Starter | Professional | Enterprise
  Others: Basic | Standard | Premium

Step 3 — Display price range instantly on selection:
  Gold number, large Cormorant Garamond, center
  Note: "Final pricing confirmed after a 2-minute discovery call."

Price ranges (THB):
  Logo: Basic 5K-8K / Standard 8K-15K / Premium 15K-25K
  Website: Landing 12K-20K / Business 20K-45K / E-commerce 45K-90K
  Brand Package: Starter 20K-35K / Professional 35K-70K / Enterprise 70K-150K
  Marketing: Basic 8K-15K/mo / Standard 15K-30K/mo / Premium 30K+/mo
  AI Workshop: Basic 15K / Standard 25K / Premium 45K
  English: Basic 3K/mo / Standard 6K/mo / Premium 10K/mo

CTA below price: "Get an Exact Quote →"
  → WhatsApp pre-filled: "Hi Mike, I used your estimator. I need [service] ([size]). Can you confirm pricing?"


═══════════════════════════════════════════════════════════
## 11. PROCESS SECTION
═══════════════════════════════════════════════════════════
Background: var(--white) — text dark
Section tag: "The Process"
H2 (Cormorant Garamond 300, var(--text-dark)):
  "Simple. Transparent."
  italic gold line: "Results you can measure."

4-step horizontal timeline (desktop) / vertical (mobile):
- Each step: gold circle 48px (border 1.5px var(--gold)), number inside, title, description
- Connector: 1px dashed rgba(201,168,76,.3) between circles (desktop only, CSS ::before on .steps)
- Step circle background: var(--white) — so it sits on top of the connector line

Step icons (above number, small, use Lucide process icons from section 2):
1. Discovery — "Free 30-minute call. We learn your business, goals, and audience. No pressure, no jargon."
2. Strategy — "Define deliverables and timeline together. You approve everything before work begins."
3. Creation — "Build, share progress, review, and refine. Involved as much as you want."
4. Launch & Support — "Go live together. Post-launch support included."

CTA below (centered): "Book Your Free Call →"
  → https://wa.me/66951967330?text=Hi%20Mike%2C%20I%27d%20like%20to%20book%20a%20free%20discovery%20call.


═══════════════════════════════════════════════════════════
## 12. ABOUT SECTION
═══════════════════════════════════════════════════════════
Background: var(--cream)
2-column: .9fr image / 1.1fr text (desktop) → stacked (mobile)

Image column (exact from existing index.html structure):
- .about-img-box: border-radius 8px, overflow hidden, aspect-ratio 3/4
- <img src="assets/img/profile.jpg" alt="Mike, Founder of Mikaro Studio" loading="lazy">
- .about-img-deco: absolute, offset top -16px left -16px, gold border frame
- If profile.jpg missing: show initials "MA" centered, Cormorant Garamond, gold

Text column:
H3 (Cormorant Garamond 400, var(--text-dark)): "Where Branding Studio Expertise Meets Creative Craft"

Paragraphs (Outfit 300, .92rem, var(--text-muted), line-height 1.85):
  P1: "Mikaro Studio is a boutique digital studio founded by an experienced creator with over a decade across digital marketing, brand development, logo design, and web design. We help businesses stand out with smart strategy and compelling visuals — built to perform, not just look good."
  P2: "From early-stage startups to established brands, the studio delivers end-to-end creative and marketing work: brand identity systems, conversion-focused websites, marketing strategy, and AI-powered workshops for forward-thinking teams."

Pull quote (exact from existing):
  "Good design is marketing. Good marketing needs good design. We do both — and we only deliver what we'd put our name on."

2×4 skills grid (.about-grid2):
  Digital Marketing Strategy | Logo & Brand Identity Design
  Web Design & Development | AI-Powered Marketing Tools
  Social Media Growth | Business & Growth Consulting
  English for Business | Corporate Training

Each item: gold dot ::before, Outfit 500 .85rem, var(--text-dark)

Location badge pill: "📍 Bangkok · Available worldwide"

CTA: "Let's Talk →" → WhatsApp


═══════════════════════════════════════════════════════════
## 13. PORTFOLIO SECTION
═══════════════════════════════════════════════════════════
Background: var(--ink)
Section tag: "Design Portfolio"
H2: "Logo & Web Design Services — Sample Work"
Subtitle: "Professional design samples across industries."

Tabs: "Logo Design" (default) | "Web Design"
Tab style: Outfit 600, uppercase, letter-spacing .07em
Active: color #fff, border-bottom 2px var(--gold)
Inactive: color rgba(255,255,255,.45)

PRESERVE ALL 6 LOGO SVGs from index.html EXACTLY (lines ~750-943):
  Velare Luxury Hotels | Nexora AI Solutions | Breva Specialty Coffee
  Haven Group Real Estate | ApexFit Performance Studio | Veritas Education

PRESERVE ALL 6 WEB MOCKUP SVGs from index.html EXACTLY (lines ~950-1253):
  Premium Consultant | E-commerce Fashion | Restaurant | SaaS Tech | Real Estate | Personal Brand

Card redesign (new CSS, same SVG content):
  Background: var(--surface), border .5px var(--border-d), border-radius 10px
  Hover: border-color var(--border-g), translateY(-6px)


═══════════════════════════════════════════════════════════
## 14. PROOF / STATS SECTION
═══════════════════════════════════════════════════════════
Background: var(--deep)
No section title — just numbers, full confidence

4 stats (exact from existing index.html, preserve icons):
  10+ Years Across Brand, Design & Marketing (polyline icon)
  60+ Client Projects Delivered (star polygon icon)
  3 Core Service Disciplines (trending-up icon)
  100% Client Satisfaction Rate (users icon)

Numbers: Cormorant Garamond 700, ~3rem, var(--gold)
Labels: Outfit 400, .85rem, rgba(255,255,255,.5)
Icons: preserve from existing (lines 1264-1277)

ANIMATED COUNTERS: count from 0 to final value when section enters viewport
Duration: 1.5s, easeOut timing function

Takeaway banner below stats (exact from existing index.html lines 1280-1287):
  "Tell Us Your Idea — We'll Make It Real"
  "Logo in 48h · Website in 5 days · Reply in 2 hours · 3 slots left."
  "Get a Free Quote" button → #contact


═══════════════════════════════════════════════════════════
## 15. TESTIMONIALS SECTION
═══════════════════════════════════════════════════════════
Background: var(--cream)
Section tag: "What People Say"
H2: "Trusted by Clients & Partners"

Use exact testimonial content from existing index.html (lines 1295-1305).
Add 2 more cards to make 4 total (2×2 grid):

Card 3 — Mike delivered our website ahead of schedule. The design finally looks like the company we actually are — inquiry rates improved noticeably.
  Name: Sarah K. | Role: Marketing Director, Bangkok | Source: direct inquiry

Card 4 — Full brand package in two weeks. International clients immediately commented on how professional everything looked.
  Name: Nopparat T. | Role: CEO, Consulting Firm | Source: WhatsApp referral

All cards: white bg, border-radius 12px, padding 2rem, box-shadow
Each: large gold quote mark (Cormorant Garamond 5rem, opacity .15), 5 gold stars, quote text, name, role, "Verified Client" green badge


═══════════════════════════════════════════════════════════
## 16. JOURNAL CTA SECTION
═══════════════════════════════════════════════════════════
Background: var(--ink)
Centered, max-width 600px, padding 100px 24px
Section tag: "From the Blog"
H2 (Cormorant Garamond 300, #fff): "Insights on design, brand & digital growth."
Subtitle: "Practical articles for Bangkok business owners and international brands."
3 mini article cards (id="journal-cta-cards") — JS populates from posts.json
CTA: "Read the Journal →" → journal.html


═══════════════════════════════════════════════════════════
## 17. FAQ SECTION
═══════════════════════════════════════════════════════════
Background: var(--white) — text dark
Section tag: "Common Questions"
H2: "Frequently Asked"
Preserve all existing FAQ items from index.html (lines 1311-1335).
Add 4 more to reach 10 total:

7. Do you work with businesses outside Thailand?
   "Yes — most workflow is fully remote. Clients across SEA, Europe, Middle East."
8. Can you redesign an existing website without rebuilding?
   "Often yes. We assess in the discovery call at no cost."
9. Do you offer post-launch maintenance?
   "Yes. Monthly packages cover updates, security, and minor edits."
10. Do you work with Thai or multilingual websites?
    "Yes. English, Thai, and Persian. SEO handled per language."

Accordion: one open at a time, chevron rotates 90deg, smooth max-height animation
"Still have questions?" row at bottom with WhatsApp link


═══════════════════════════════════════════════════════════
## 18. CONTACT SECTION
═══════════════════════════════════════════════════════════
Background: var(--deep)
2-column (desktop) → stacked (mobile)
Preserve existing contact form structure from index.html (lines 1337-1370):
- Honeypot field (hp_website)
- Timestamp field (form_ts)
- Name, Email (required), Service select, Message
- WhatsApp submission (existing handleSubmit function)
- Existing validation JS (lines 1498-1591)

Left column additions:
- Contact methods with Lucide icons (WhatsApp, LINE, Email, Location)
- "⚡ Usually replies within 2 hours" badge
- WhatsApp and LINE direct links (styled prominently)


═══════════════════════════════════════════════════════════
## 19. FOOTER — ALWAYS DARK IN BOTH THEMES
═══════════════════════════════════════════════════════════
Background: var(--footer-bg) = #040408 in BOTH light and dark mode
Border-top: 1px solid rgba(201,168,76,.1)

CRITICAL light mode rule:
  footer { background: #040408 !important; }
  footer * { color values must use rgba(255,255,255,X) explicitly — NOT var(--text-dark) }

Logo: exact SVG (section 3, height 32px)
Tagline: "Design that means something." (rgba(255,255,255,.22))

3-column grid (desktop) → 1-col (mobile):
  Col 1: Logo + tagline + WhatsApp link
  Col 2: Navigate — About | Services | Design Portfolio | Results | FAQ | Contact
  Col 3: Services — Web Design | Logo Design | Brand Package | Digital Marketing | AI Workshop | English

Social row: LinkedIn icon link | TikTok icon link (from existing footer)
Bottom bar: "© 2025 Mikaro Studio · Bangkok, Thailand" | "Built with purpose."
All footer text: explicit rgba(255,255,255,X) — never inherits theme variables


═══════════════════════════════════════════════════════════
## 20. CTA SYSTEM — WHATSAPP PRE-FILLED MESSAGES
═══════════════════════════════════════════════════════════
Every CTA opens WhatsApp with a contextual pre-filled message.
URL pattern: https://wa.me/66951967330?text=URL_ENCODED_MESSAGE

| Location | Button Text | Pre-filled message |
|---|---|---|
| Hero primary | Start Your Project — Free Consultation | Hi Mike, I'd like to start a project with Mikaro Studio. |
| Hero secondary | Explore Mikaro Studio | → #services anchor |
| Each service card | [Card-specific CTA] | Hi Mike, I'm interested in [service name]. Can I get a quote? |
| Cost estimator | Get an Exact Quote → | Hi Mike, I used your estimator. I need [service] ([size]). Can you confirm pricing? |
| Process | Book Your Free Call → | Hi Mike, I'd like to book a free discovery call. |
| About | Let's Talk → | Hi Mike, I came across Mikaro Studio and would love to chat. |
| Portfolio | Get a Free Quote → | Hi Mike, I love your portfolio work. I'd like something similar. |
| Testimonials | Start Your Project → | Hi Mike, I saw your client results and I'm interested in working together. |
| FAQ bottom | Still Have Questions? → | Hi Mike, I have a question before starting my project. |
| Footer | Start a Project → | Hi Mike, I'd like to discuss a project with Mikaro Studio. |
| Urgency bar | Chat with Mike now → | Hi Mike, I saw you have limited slots. I'd like to discuss a project. |

Floating WhatsApp button (fixed, always visible):
  Position: fixed, bottom 100px, right 28px, z-index 997
  Style: 48px circle, var(--navy-deep) bg, 2px gold border (matches existing .float-btn)
  Animation: popIn .6s ease (existing @keyframes)
  → https://wa.me/66951967330 (generic message)

Floating LINE button:
  Position: fixed, bottom 48px, right 28px (matches existing .float-btn-ln)
  Same style as WhatsApp float
  → https://line.me/ti/p/~mike_aj

AI Chatbot button: fixed, bottom 154px, right 28px (above both floats)
  Use existing chat bubble structure from index.html lines 1410-1442


═══════════════════════════════════════════════════════════
## 21. AI CHATBOT — MAYA
═══════════════════════════════════════════════════════════
Preserve entire chatbot structure from existing index.html:
- .chat-bubble trigger button (line 1410)
- .chat-panel with logo avatar, chat header, messages, quick replies, input (lines 1415-1442)
- All existing JS: toggleChat, setQuickReplies, addMsg, sendChat, sendQuick (lines 1625-1737)

Upgrade the system prompt (replace SYSTEM_PROMPT const, lines 1595-1623):
```javascript
const SYSTEM_PROMPT = `You are Maya, the AI sales consultant for Mikaro Studio — a premium branding studio in Bangkok, Thailand. Your single goal: qualify leads and guide them to start a project.

LEAD QUALIFICATION FLOW:
1. Greet warmly. Ask what they need. Show quick replies: Logo / Website / Full Brand / Marketing / AI Workshop / English / Other
2. Ask about their business and goal
3. Ask their timeline: This week / This month / Just exploring
4. Summarise their need in 2 sentences. Recommend the exact right service.
5. Push to WhatsApp or LINE with light urgency.

SERVICES & HOOKS:
- Logo Design → "Your logo ready in 48 hours — 3 concepts, all formats"
- Website Design → "Your site live in 5 days — responsive, SEO-ready, converts visitors"
- Full Brand Launch → "Logo + website + social strategy in 2 weeks — best value"
- Digital Marketing → "More traffic, more leads — data-driven strategy that works"
- AI Workshop → "Your team using AI like pros — hands-on, practical, same day results"
- English for Business → "Speak with confidence in any business setting"

CONTACT (always push these):
- WhatsApp: https://wa.me/66951967330 (+66 951 967 330)
- LINE: https://line.me/ti/p/~mike_aj (ID: mike_aj)

LEAD CAPTURE: When visitor shares their name or service interest, silently POST to:
  fetch(window.MIKARO_SHEETS_URL, { method:'POST', body: JSON.stringify({name, service, timeline, timestamp: new Date().toISOString()}) })
  Do this silently — no UI confirmation, no error shown if it fails.

RULES:
- Keep replies short: 2-4 sentences max, or a short list
- NEVER reveal prices — "pricing depends on scope, get a free quote via WhatsApp"
- NEVER say you are offline or unavailable
- ALWAYS end with a clear next action (WhatsApp/LINE link or question)
- After 5 exchanges without conversion → show escalation card with WhatsApp + LINE buttons
- When ready: "We have 3 slots open this month — message us now to lock yours in"
- Warm, direct, professional — like a great sales consultant, not a bot`;
```

API key: loaded from window.MIKARO_AI_KEY in config.js
Fallback if key missing: show "Maya is unavailable right now" + WhatsApp + LINE buttons


═══════════════════════════════════════════════════════════
## 22. JOURNAL SYSTEM
═══════════════════════════════════════════════════════════

### posts.json — 10 complete articles
Each object requires ALL fields:
{
  "id": N, "slug": "url-slug", "title": "...", "subtitle": "...",
  "category": "Web Design|Branding|Digital Marketing|AI & Technology|Business English",
  "tags": [], "publishDate": "2025-06-01", "readTime": "5 min read",
  "author": "Mike", "excerpt": "2-3 sentences for cards",
  "content": "<h2>...</h2><p>...</p>",
  "featuredImage": "post-N.jpg",
  "metaDescription": "under 160 chars", "metaKeywords": "k1, k2"
}

10 articles — write full 600-900 word content for each:
1. "5 Signs Your Website Is Quietly Losing You Clients Right Now" (Web Design)
2. "Timeless vs Trendy: What Makes a Logo Last 10 Years?" (Branding)
3. "How AI Chatbots Are Changing Customer Acquisition for Bangkok Businesses" (AI & Technology)
4. "The Bangkok Business Owner's Digital Marketing Guide for 2025" (Digital Marketing)
5. "The Psychology of First Impressions: Why Your Website Has 3 Seconds" (Web Design)
6. "Logo Design Pricing in Thailand: What You Actually Get at Each Budget" (Branding)
7. "How to Brief a Designer: 10 Questions That Get You Better Results" (Web Design)
8. "Claude vs ChatGPT vs Gemini: Which AI Tool Works Best for Bangkok Businesses?" (AI & Technology)
9. "From Zero to 1,000 Monthly Visitors: An SEO Roadmap for New Bangkok Websites" (Digital Marketing)
10. "Why Business English Confidence Is the Hidden Edge Bangkok Professionals Are Missing" (Business English)

### journal.html
- Same nav + footer as index.html (link assets/css/style.css)
- Category filter tabs, skeleton loading, featured first post, 3-col grid
- Fetch from /journal/posts.json, render dynamically
- SEO: unique title, meta, canonical

### post.html
- Reading progress bar (3px gold, fixed top)
- Reads ?slug=, fetches posts.json, renders matching post
- TOC sidebar (desktop), share buttons (WhatsApp + copy link)
- Related articles (2 from same category)
- Dynamic SEO (document.title + meta description from post data)


═══════════════════════════════════════════════════════════
## 23. SERVICE PAGES (6 files in /services/)
═══════════════════════════════════════════════════════════
Each page: same nav + footer, unique H1/meta/canonical, JSON-LD Service schema
Hero: dark ink, service H1, benefit subtitle, primary CTA → WhatsApp
What's included: deliverables list
Turnaround + price range
2 relevant portfolio samples
2 relevant testimonials
5 service-specific FAQs
Bottom CTA: "Start Your [Service] →" → WhatsApp

Target keywords:
  web-design.html: "web design Bangkok", "website design Thailand"
  logo-design.html: "logo design Bangkok", "logo designer Thailand"
  brand-package.html: "branding studio Bangkok", "brand identity Thailand"
  digital-marketing.html: "digital marketing Bangkok", "SEO Thailand"
  ai-workshop.html: "AI workshop Bangkok", "ChatGPT training Thailand"
  english-coaching.html: "business English Bangkok", "English coaching Thailand"


═══════════════════════════════════════════════════════════
## 24. SEO
═══════════════════════════════════════════════════════════

### index.html <head> (exact)
```html
<title>Mikaro Studio | Web Design Services, Branding Studio & Digital Solutions — Bangkok</title>
<meta name="description" content="Mikaro Studio is a Bangkok-based branding studio offering web design services, logo design, AI chatbot development, and digital solutions. Get your logo in 48h or website live in 5 days."/>
<meta name="keywords" content="web design services Bangkok, branding studio Thailand, logo design Bangkok, AI chatbot development, digital solutions Bangkok"/>
<meta name="robots" content="index, follow"/>
<meta name="author" content="Mikaro Studio"/>
<link rel="canonical" href="https://mikaro.studio"/>
<meta name="theme-color" content="#080810"/>
<!-- OG tags (exact from existing) -->
<!-- Twitter card (exact from existing) -->
```

JSON-LD schemas in <head>:
1. LocalBusiness (ProfessionalService): full business info
2. WebSite with SearchAction
3. Person (Mike as founder)

Performance:
- Font preconnect before font link tag
- All images: loading="lazy", width, height, descriptive alt
- All non-critical JS: defer attribute
- Google Fonts: display=optional


═══════════════════════════════════════════════════════════
## 25. SECURITY FILES
═══════════════════════════════════════════════════════════

### config.js
```javascript
// IMPORTANT: This file is in .gitignore — NEVER push to GitHub
window.MIKARO_AI_KEY = "YOUR_ANTHROPIC_API_KEY_HERE";
window.MIKARO_SHEETS_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
```

### .gitignore
```
config.js
.env
node_modules/
*.log
.DS_Store
Thumbs.db
```

### Contact form anti-spam (existing from index.html — preserve exactly):
- Honeypot field (hp_website): display none
- Timestamp check: < 3 seconds = bot
- Live field validation
- Existing handleSubmit function with WhatsApp redirect

### server/middleware/security.js (VPS Phase 2 — create but not deployed yet)
- helmet() with CSP
- express-rate-limit: 100/15min general, 5/15min /api/contact
- CORS: origin https://mikaro.studio only
- JWT middleware skeleton

### .htaccess (Apache VPS)
- HTTPS redirect, security headers, GZIP, cache rules, 404 redirect


═══════════════════════════════════════════════════════════
## 26. ANALYTICS
═══════════════════════════════════════════════════════════
GA4 placeholder in all HTML files <head>:
```html
<!-- Replace GA_MEASUREMENT_ID with actual ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  if(localStorage.getItem('mikaro_consent') === 'yes') {
    gtag('config', 'GA_MEASUREMENT_ID');
  }
</script>
```

Custom events:
- chatbot_open | chatbot_engaged | whatsapp_click (with location param)
- form_submit (with service param) | service_card_click (with service param)
- theme_toggle (with theme param) | journal_read (with slug param)

Cookie consent banner (fixed bottom):
- Background var(--deep), border-top 1px var(--border-g)
- "We use analytics to improve your experience."
- Accept (gold) | Decline (ghost)
- localStorage('mikaro_consent'): 'yes' or 'no'
- GA4 only loads after Accept


═══════════════════════════════════════════════════════════
## 27. SITEMAP + ROBOTS
═══════════════════════════════════════════════════════════

sitemap.xml — include all URLs:
  https://mikaro.studio/ (1.0, weekly)
  https://mikaro.studio/journal.html (0.8, weekly)
  https://mikaro.studio/post.html (0.5, monthly)
  https://mikaro.studio/services/web-design.html (0.9, monthly)
  https://mikaro.studio/services/logo-design.html (0.9, monthly)
  https://mikaro.studio/services/brand-package.html (0.8, monthly)
  https://mikaro.studio/services/digital-marketing.html (0.8, monthly)
  https://mikaro.studio/services/ai-workshop.html (0.7, monthly)
  https://mikaro.studio/services/english-coaching.html (0.7, monthly)

robots.txt:
  User-agent: *
  Allow: /
  Disallow: /config.js
  Disallow: /journal/posts.json
  Disallow: /assets/js/
  Sitemap: https://mikaro.studio/sitemap.xml


═══════════════════════════════════════════════════════════
## 28. BUILD INSTRUCTIONS FOR CLAUDE CODE
═══════════════════════════════════════════════════════════
1. Read this entire BRIEF.md first. Then read index.html.
2. Create .gitignore and config.js FIRST before any other file.
3. Extract and preserve ALL SVG artwork from index.html exactly — never redraw or simplify.
4. Apply the new design system (CSS variables, fonts, section colors) completely.
5. The old navy/cream design is replaced — do not use #1B2A4A or Playfair Display anywhere.
6. Services grid: Logo | WEB DESIGN (CENTER, FEATURED) | Full Brand / Digital Marketing | AI Workshop | English
7. Footer: always dark background (#040408) in BOTH light and dark theme.
8. Responsive: CSS media queries only. No JS viewport switching. No toggle buttons visible to user.
9. All icons: Lucide stroke-based, weight 1.6, no fill — as specified in section 2.
10. Theme toggle: JS class toggle on <body>, localStorage persistence.
11. Mobile hamburger: pure CSS animation + JS class toggle, no libraries.
12. All colors via CSS variables — zero hardcoded hex in CSS rules (except footer explicit override).
13. Test mentally before finishing: every link has href, every button has purpose, no console errors.
14. Do not ask for clarification. If a minor spec detail is missing, make the best professional decision.
