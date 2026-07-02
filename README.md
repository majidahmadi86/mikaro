# Mikaro Studio — mikaro.studio

Static production site (GitHub Pages).

## Structure
- `index.html` — the site (ASSETS config block at top of body for image slots)
- `css/main.css` — design system + all styles
- `js/main.js` — interactions (tilt, magnetics, counters, reveals, clock)
- `js/chat.js` — MIKA, the on-page studio guide
- `assets/` — favicons, og image, manifest
- `404.html` — branded not-found (served automatically by GitHub Pages)

## Editing
- Swap Miomika / Dr. Zac images: paste URLs in the `ASSETS` block in `index.html`.
- Social links: footer + contact section (`aria-label` Instagram / X / LinkedIn).
- Keep the existing `CNAME` file — it binds the custom domain.
