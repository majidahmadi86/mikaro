# MIKARO STUDIO — CI REFINEMENT SPEC
# Role: Senior Brand & UI Consultant
# For: Cursor Agent — surgical CSS/font changes ONLY
# Rule: Touch NOTHING else. No HTML restructure. No content edits. No SVG changes.

═══════════════════════════════════════════════════════════
## PHILOSOPHY OF THIS REFINEMENT
═══════════════════════════════════════════════════════════

This document merges Palette I (Obsidian Noir — warm violet-dark base, merlot power accent)
with Palette III (Maison Noir — antique champagne gold, burgundy depth).

The result: a single unified CI called "NOIR ATELIER" — a warm-obsidian base with
two accent registers (champagne gold for primary, merlot-burgundy for urgency/power).
The body text shifts from cold white to warm linen. No other studio in Bangkok is doing this.

RULE FOR CURSOR: Change ONLY what is listed here. If it is not listed — leave it exactly as-is.


═══════════════════════════════════════════════════════════
## 1. FONT SWAP — Replace in <head> of ALL HTML files
═══════════════════════════════════════════════════════════

### REMOVE this block entirely:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600;700&display=optional" rel="stylesheet">
```

### REPLACE with this exact block:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Jost:wght@300;400;500;600;700&display=optional" rel="stylesheet">
```

### WHY:
- Cormorant Garamond + Outfit = the single most recognizable AI-template pairing of 2024-25.
  Every Claude-built agency site uses it. It is a fingerprint.
- DM Serif Display: editorial, slightly geometric serif — used by luxury print publications,
  NOT by AI-generated sites. Has a natural elegance without the "template" softness of Cormorant.
- Jost: geometric sans with personality — not Inter, not Outfit, not Nunito.
  Reads as designed, not defaulted.

### APPLY NEW FONTS in assets/css/style.css:
Find every instance of:
  font-family: 'Cormorant Garamond', serif  →  replace with: font-family: 'DM Serif Display', serif
  font-family: 'Outfit', sans-serif         →  replace with: font-family: 'Jost', sans-serif
  font-family: Outfit, ...                  →  replace with: font-family: Jost, sans-serif

Also update the logo SVG inline font reference (section 3 of BRIEF.md):
  font-family="Outfit,system-ui,sans-serif"  →  font-family="Jost,system-ui,sans-serif"

DO NOT change any font-size, font-weight, or letter-spacing values. Only the family name.


═══════════════════════════════════════════════════════════
## 2. CSS VARIABLES — Replace :root block in assets/css/style.css
═══════════════════════════════════════════════════════════

### REMOVE the entire existing :root { } block and REPLACE with:

```css
:root {
  /* ─── Backgrounds — warm obsidian base (violet-wine undertone, not cold blue) ─── */
  --ink:        #0A0608;   /* hero, dark sections — warm near-black */
  --deep:       #100D10;   /* services, contact — deep plum-dark */
  --surface:    #18151A;   /* cards on dark — slightly lifted */

  /* ─── Primary accent — antique champagne gold (matte, not bright template gold) ─── */
  --gold:       #C4A06A;
  --gold-light: #DEC08A;
  --gold-pale:  rgba(196,160,106,.09);
  --gold-border:rgba(196,160,106,.22);

  /* ─── Power accent — merlot/burgundy (urgency tags, CTA hover, badges) ─── */
  --merlot:        #7A1828;
  --merlot-light:  #A02238;
  --merlot-pale:   rgba(122,24,40,.12);
  --merlot-border: rgba(122,24,40,.35);

  /* ─── Light sections ─── */
  --cream:      #F5F0E8;   /* warm ivory — not cold white */
  --white:      #FAF7F2;   /* off-white with warmth */

  /* ─── Typography ─── */
  --text-dark:  #1A1410;   /* warm near-black for light sections */
  --text-muted: #6B6560;   /* warm gray — not the cold #64748B */
  --text-body:  #E8E0D0;   /* linen-warm body text on dark (replaces pure white) */

  /* ─── Borders ─── */
  --border-d:   rgba(255,248,240,.06);   /* warm white border on dark */
  --border-g:   rgba(196,160,106,.22);

  /* ─── Footer ─── */
  --footer-bg:  #060406;   /* deepest warm-black */

  /* ─── Transitions ─── */
  --t: .32s cubic-bezier(.4,0,.2,1);
}
```

### ALSO REPLACE the light mode block:

```css
body.light-mode {
  --ink:        #EDE8DF;
  --deep:       #E4DED5;
  --surface:    #FAF7F2;
  --gold:       #8A6830;
  --gold-light: #A07838;
  --gold-pale:  rgba(138,104,48,.07);
  --gold-border:rgba(138,104,48,.22);
  --merlot:        #6A1422;
  --merlot-light:  #8A1C2E;
  --merlot-pale:   rgba(106,20,34,.08);
  --merlot-border: rgba(106,20,34,.28);
  --cream:      #FAF7F2;
  --white:      #F0EBE2;
  --text-dark:  #120F0A;
  --text-muted: #4A4540;
  --text-body:  #1A1410;
  --border-d:   rgba(0,0,0,.08);
  --border-g:   rgba(138,104,48,.22);
  --footer-bg:  #0A0608;   /* ALWAYS dark in both themes — do not change */
}
```


═══════════════════════════════════════════════════════════
## 3. GLOBAL TEXT COLOR — One targeted change in style.css
═══════════════════════════════════════════════════════════

The existing site likely uses `color: #fff` or `color: rgba(255,255,255,X)` for body text
on dark sections. We warm these up — this is one of the biggest "AI template" tells.

In assets/css/style.css, find and replace:

  color: #ffffff              →  color: var(--text-body)         (for body/paragraph text on dark bg)
  color: rgba(255,255,255,.58) →  color: rgba(232,224,208,.55)    (subdued body text)
  color: rgba(255,255,255,.65) →  color: rgba(232,224,208,.62)    (nav link default)
  color: rgba(255,255,255,.75) →  color: rgba(232,224,208,.72)    (chip text)
  color: rgba(255,255,255,.38) →  color: rgba(232,224,208,.40)    (KPI labels)
  color: rgba(255,255,255,.07) →  (leave as-is — this is a border, not text)

DO NOT change white text inside .light-mode overrides.
DO NOT change rgba values used as backgrounds or border-color — only text colors.


═══════════════════════════════════════════════════════════
## 4. NAVIGATION — Targeted style.css changes
═══════════════════════════════════════════════════════════

### Nav background (find the nav/header selector):
```css
/* BEFORE */
background: rgba(8,8,16,.96);
border-bottom: 1px solid rgba(201,168,76,.15);

/* AFTER */
background: rgba(10,6,8,.97);
border-bottom: 1px solid rgba(196,160,106,.12);
```

### Nav on scroll (the scrolled state class, likely .scrolled or .nav-scrolled):
```css
/* BEFORE */
background: rgba(13,24,41,1);

/* AFTER */
background: rgba(10,6,8,1);
```

### Nav link hover color — already uses var(--gold), no change needed.

### "Start Your Project" CTA button in nav:
```css
/* BEFORE — likely gold bg with dark text */
background: var(--gold);
color: #080810;  (or similar dark)

/* AFTER */
background: var(--gold);
color: #0A0608;
border: none;
letter-spacing: 0.06em;
```


═══════════════════════════════════════════════════════════
## 5. URGENCY BAR — Replace gold background with merlot
═══════════════════════════════════════════════════════════

The gold urgency bar is the #1 AI-template tell on the page.
Every AI-built site uses a gold announcement bar. Merlot makes it a brand statement.

Find the urgency bar selector (likely .urgency-bar or similar):
```css
/* BEFORE */
background: var(--gold);
color: #080810;

/* AFTER */
background: var(--merlot);
color: #F5E8D0;
border-bottom: 1px solid var(--merlot-light);
```

Also update the dismiss X button and inline link color:
```css
/* Link inside urgency bar */
color: #F5E8D0;
text-decoration: underline;
text-underline-offset: 3px;

/* X dismiss button */
color: rgba(245,232,208,.7);
```


═══════════════════════════════════════════════════════════
## 6. HERO SECTION — Targeted changes
═══════════════════════════════════════════════════════════

### Hero background orbs — reduce the template "glow" effect:
Find .hero-orb-1 and .hero-orb-2:
```css
/* .hero-orb-1 — BEFORE */
background: radial-gradient(circle, rgba(201,168,76,.07) 0%, transparent 70%);

/* .hero-orb-1 — AFTER (cooler, more subtle) */
background: radial-gradient(circle, rgba(196,160,106,.05) 0%, transparent 65%);

/* .hero-orb-2 — AFTER (add merlot warmth at bottom) */
background: radial-gradient(circle, rgba(122,24,40,.06) 0%, transparent 60%);
```

### Hero grid background — reduce opacity (too obvious as an AI pattern):
Find .hero-grid-bg:
```css
/* BEFORE */
background-image: ...; /* whatever grid pattern — rgba(201,168,76,.03) */

/* AFTER — reduce opacity */
opacity: 0.4;   /* add this line — makes grid feel more atmospheric */
```

### Hero eyebrow pill badge:
```css
/* BEFORE */
background: rgba(201,168,76,.08);
border: 1px solid rgba(201,168,76,.25);
color: var(--gold);

/* AFTER */
background: rgba(196,160,106,.07);
border: 1px solid rgba(196,160,106,.20);
color: var(--gold-light);
letter-spacing: 0.08em;
font-size: 0.72rem;   /* slightly smaller — reads as more refined */
```

### H1 accent span (the italic "· Strategy" line):
No color change needed — still uses var(--gold).
ADD this if not present:
```css
.hero h1 .accent {
  font-style: italic;
  color: var(--gold);
  opacity: 0.92;   /* very slightly dialed back — not 100% saturated */
}
```

### KPI stat numbers (the 10+, 60+, 3 counters):
```css
/* BEFORE — likely Cormorant Garamond bold gold */
font-family: 'Cormorant Garamond', serif;
color: var(--gold);

/* AFTER */
font-family: 'DM Serif Display', serif;
color: var(--gold);
font-style: italic;   /* DM Serif Display's italic is its most distinctive weight */
```

### Hero badges (.hero-badge.b1 and .hero-badge.b2):
```css
/* .hero-badge.b1 (gold bg, dark text) — BEFORE */
background: var(--gold);
color: #080810;

/* AFTER */
background: var(--gold);
color: #0A0608;
font-family: 'Jost', sans-serif;
letter-spacing: 0.04em;
```


═══════════════════════════════════════════════════════════
## 7. SERVICE CARDS — Targeted changes only
═══════════════════════════════════════════════════════════

### All cards background and border:
```css
/* .pkg-card — BEFORE */
background: var(--surface);
border: 1px solid var(--border-d);

/* AFTER */
background: var(--surface);
border: 1px solid rgba(196,160,106,.10);   /* slightly warmer border */
```

### Featured card (Web Design — center card):
```css
/* .pkg-card.featured — BEFORE */
background: rgba(201,168,76,.08);
border: 1px solid rgba(201,168,76,.4);

/* AFTER */
background: rgba(196,160,106,.07);
border: 1px solid rgba(196,160,106,.32);
box-shadow: 0 0 48px rgba(196,160,106,.06);   /* very subtle warm glow */
```

### "Most Popular" badge (.pkg-star):
```css
/* BEFORE — likely gold bg */
background: var(--gold);
color: #080810;

/* AFTER — merlot makes it feel scarce, not promotional */
background: var(--merlot);
color: #F5E8D0;
letter-spacing: 0.1em;
font-size: 0.65rem;
```

### CTA buttons on cards:
```css
/* Outline CTA (.pkg-cta-o) — BEFORE */
border: 1px solid rgba(201,168,76,.4);
color: var(--gold);

/* AFTER */
border: 1px solid rgba(196,160,106,.35);
color: var(--gold);
letter-spacing: 0.05em;
```

### Card icon boxes (.pkg-icon):
```css
/* BEFORE */
background: var(--gold-pale);
border: 1px solid var(--border-g);

/* AFTER */
background: rgba(196,160,106,.07);
border: 1px solid rgba(196,160,106,.18);
```


═══════════════════════════════════════════════════════════
## 8. PROCESS SECTION (light bg) — Keep clean, refine typography
═══════════════════════════════════════════════════════════

This section is on var(--white) / var(--cream) background.
Most AI sites make this too clean/clinical. Add subtle warmth.

```css
/* Process section background */
#process {
  background: var(--white);   /* now #FAF7F2 — warm ivory not cold white */
}

/* Step numbers — make them feel more editorial */
.process-step .step-num {
  font-family: 'DM Serif Display', serif;
  font-style: italic;
  color: var(--gold);
  opacity: 0.6;   /* ghosted step number is more refined than full-opacity */
}

/* Step headings */
.process-step h3 {
  font-family: 'DM Serif Display', serif;
  color: var(--text-dark);   /* now warm near-black #1A1410 */
}
```


═══════════════════════════════════════════════════════════
## 9. TESTIMONIALS / PROOF SECTION
═══════════════════════════════════════════════════════════

### Star ratings — switch from gold to merlot for "earned" feel:
```css
/* Star rating elements */
.stars, .star, [class*="star"] {
  color: var(--merlot-light);   /* deep wine stars = vintage credibility */
}
```

### Testimonial card border:
```css
.testimonial-card, .review-card {
  border: 1px solid rgba(196,160,106,.12);
  background: var(--surface);
}
```


═══════════════════════════════════════════════════════════
## 10. FOOTER — Already dark. Minor refinements only.
═══════════════════════════════════════════════════════════

```css
footer {
  background: var(--footer-bg);   /* now #060406 — deepest warm-black */
  border-top: 1px solid rgba(196,160,106,.10);
}

/* Footer "Design that means something." tagline */
footer .tagline, footer .footer-tagline {
  font-family: 'DM Serif Display', serif;
  font-style: italic;
  color: var(--gold);
  opacity: 0.7;
}

/* Footer nav links */
footer a {
  color: rgba(232,224,208,.45);
}
footer a:hover {
  color: var(--gold);
}
```


═══════════════════════════════════════════════════════════
## 11. LOGO SVG — One color reference update
═══════════════════════════════════════════════════════════

In the logo SVG (both nav and footer instances), the gold polygon uses fill="#C9A84C".
Update this to match the new champagne gold:

```svg
<!-- BEFORE -->
<polygon points="26,36 38,18 50,36 46,36 38,26 30,36" fill="#C9A84C"/>
<text ... fill="#C9A84C" ...>STUDIO</text>

<!-- AFTER -->
<polygon points="26,36 38,18 50,36 46,36 38,26 30,36" fill="#C4A06A"/>
<text ... fill="#C4A06A" ...>STUDIO</text>
```

Also update the favicon inline SVG in <head>:
  fill='%23C9A84C'  →  fill='%23C4A06A'

And the chatbot avatar SVG:
  fill="#C9A84C"  →  fill="#C4A06A"


═══════════════════════════════════════════════════════════
## 12. DO THIS / NOT THAT — Rules for Cursor Agent
═══════════════════════════════════════════════════════════

✅ DO:
- Change CSS variable values in :root and body.light-mode ONLY
- Swap the Google Fonts link tag (exact replacement above)
- Find-replace font-family names across style.css
- Apply the logo gold color hex update (#C9A84C → #C4A06A) in SVG fill attributes
- Apply the urgency bar background change (gold → merlot)
- Apply the "Most Popular" badge color change (gold → merlot)
- Update star ratings to merlot
- Add `--text-body`, `--merlot`, `--merlot-light`, `--merlot-pale`, `--merlot-border` as new variables
- Update rgba(255,255,255,X) body text values to rgba(232,224,208,X) on dark sections

❌ DO NOT:
- Restructure any HTML
- Change any class names
- Remove or reorder any sections
- Modify any SVG artwork paths or shapes (only the fill color hex on gold polygons/text)
- Change font-size, font-weight, line-height, or letter-spacing values
- Add new CSS classes unless specified above
- Change any JavaScript
- Touch journal.html, post.html, or service pages — unless applying the same font swap
- Use the old gold value #C9A84C anywhere after this change
- Use cold blue-black (#080810 or #0d0d18) — the new warm-dark values replace these
- Add gradients, glows, or animation beyond what already exists


═══════════════════════════════════════════════════════════
## 13. WHAT MAKES THIS NON-AI-TEMPLATE
═══════════════════════════════════════════════════════════

After these changes, here is what separates Mikaro Studio from AI-generated sites:

1. WARM BASE  — #0A0608 has a violet-wine undertone. Cold blue-black (#080810) is the template default.
2. MATTE GOLD — #C4A06A is desaturated and warm. Bright #C9A84C reads as a CSS variable default.
3. MERLOT     — A second power accent. No AI template uses burgundy. It signals scarcity and premium.
4. LINEN TEXT — rgba(232,224,208,X) body text on dark. Pure white body text is the AI fingerprint.
5. DM SERIF   — Used by The Economist, Kinfolk, and luxury editorial. Not in the AI site library.
6. JOST       — Geometric but with personality. Not Inter, not Outfit, not Nunito.
7. WINE STARS — Merlot star ratings evoke aged credibility, not generic review widgets.

The color distance from the current palette is deliberate but conservative:
  - Backgrounds shift by ~5% warmth (invisible on first glance, felt over time)
  - Gold shifts by ~10% toward matte/antique (clearly different side by side)
  - Merlot is a new accent that appears in 3 places only: urgency bar, "Most Popular" badge, stars
  - Body text warms from cold white to linen (invisible to most, felt as "quality")

This is the difference between a template and a brand.
