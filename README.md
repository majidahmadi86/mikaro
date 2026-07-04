# Mikaro Studio — mikaro.studio

Multi-page static production site (GitHub Pages).

## Pages
- `/` home · `/work.html` overview · `/work/miomika.html` + `/work/opticlean.html` cases
- `/services.html` (per-service CTAs) · `/ai-lab.html` (capabilities, build log, MIKA)
- `/contact.html` (FormSubmit form) · `/thanks.html` · `/404.html`

## Shared
- `css/main.css` — design system
- `js/main.js` — interactions + responsive image slots (see `assets/img/README.txt`)
- `js/chat.js` — MIKA widget: embeds via `data-mika`, floating launcher on every page

## Contact form (FormSubmit)
First real submission triggers a one-time activation email to majid.ahmadi86@gmail.com — click the link once and it's live forever. Same for the in-chat lead form.

## Editing
- Images: drop files into `assets/img/` with the exact names in the README there.
- Socials: footer `aria-label` Instagram / X / LinkedIn placeholders.
- Keep `CNAME` — it binds the custom domain.
