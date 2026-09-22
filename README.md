# Wadi Nushakal — Website

Marketing website for **Wadi Nushakal**, a UAE transport & logistics company based in Beda Zayed, Al Dhafra, Abu Dhabi.
*Your Cargo, Our Commitment.*

**Frontend only**: HTML, CSS and [Vue.js 3](https://vuejs.org), built with [Vite](https://vite.dev). There is no
backend, database or server code. The build output is plain static files that any web host can serve.

- **Vue 3** single-file components (`.vue`: template + script + scoped CSS)
- **Vue Router**: two pages, the home page (`/`) and the contact page (`/contact`)
- **Plain CSS** with design tokens in `src/styles/global.css`
- **Three.js** for the 3D truck in the hero, loaded lazily after the page appears
- **vite-ssg** pre-renders each page to static HTML at build time (`dist/index.html`, `dist/contact/index.html`),
  which helps SEO and first-load speed. It then hydrates in the browser.
- **vite-imagetools** converts photos to AVIF/WebP at several sizes at build time

## Commands

| Command           | What it does                                      |
| ----------------- | ------------------------------------------------- |
| `npm install`     | Install dependencies                              |
| `npm run dev`     | Development server at `http://127.0.0.1:5173`     |
| `npm run build`   | Production build to `dist/` (static HTML/CSS/JS)  |
| `npm run preview` | Serve the production build locally                |
| `npm run watch`   | Rebuild `dist/` on every save (for VS Code Go Live) |

**Running from VS Code:**

- **Go Live** (Live Server / Five Server / Live Preview) serves the built site in `dist/` (see `.vscode/settings.json`).
  The "Wadi Nushakal: auto build" task (`npm run watch`) starts when the folder opens and rebuilds `dist/` on every
  save, and Go Live then reloads Chrome. The first time, VS Code asks to allow automatic tasks. Click **Allow**. If it
  isn't running, use Terminal → Run Task → "Wadi Nushakal: auto build", or run `npm run watch`.
- **F5** (Run → "Wadi Nushakal (Chrome)") starts `npm run dev` and opens Chrome, with instant hot reload.
- Double-clicking `index.html` can't work (it's the Vite source file). It shows these instructions instead.

**Deploy:** upload the contents of `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages,
cPanel/Apache, Nginx, S3…). The contact page is a real file at `contact/index.html`, so no rewrite rules are needed.

## Before launch

1. ~~Verify the email address~~ Corrected to `info@wadinushakal.com` (the supplied copy had a typo). If it
   changes, update it in `src/data/site.js` and in the JSON-LD block of `index.html`.
2. ~~Set the domain~~ Set to `https://wadinushakal.com` in `.env` (`VITE_SITE_URL`), used for the canonical links and
   social-share previews.
3. **Replace stock photos** with the company's own fleet photography when available (see *Images*).

## Project structure

```
index.html                ← page shell: site-wide <head> tags (Open Graph image, JSON-LD), font preload
src/
  main.js                 ← app entry (vite-ssg + router)
  router.js               ← routes (/ and /contact) and scroll behaviour for "/#section" links
  App.vue                 ← layout: header, <RouterView>, footer
  pages/
    HomePage.vue          ← home page: all sections (no contact form — "Get in Touch"/"Get a Quote" link to /contact)
    ContactPage.vue       ← contact page: hero, contact cards, form
  components/             ← one component per section
    SiteHeader.vue  HeroSection.vue  AboutSection.vue  ServicesSection.vue  FleetSection.vue
    WhyUsSection.vue  EveryMileSection.vue  UaeMapSection.vue  ContactForm.vue  SiteFooter.vue
    ui/                   ← AppIcon, AppLogo, NavLink, ResponsivePicture
  data/site.js            ← all company info & page copy (contact details, navigation, services, fleet, why-us…)
  data/images.js          ← optimised photo imports
  lib/head.js             ← per-page <title>, description, canonical URL
  lib/                    ← small browser helpers (scroll reveal, cursor glow, HUD, hero loader…)
  lib/hero/               ← Three.js scene: scene.js (setup/loop), truck.js, world.js, textures.js
  styles/global.css       ← design tokens, typography, container, buttons, reveal utilities
  assets/images/          ← source photos (+ CREDITS.md)
public/                   ← favicon, touch icon, og-image.jpg, robots.txt, fonts/
```

## Layout & typography

- Every section is full width. Its content sits in `.container`, a wide content area (max 1640px) with the same
  responsive side padding everywhere (`--gutter`: about 18–22px on phones, 40px on tablets, 64–96px on desktops).
  Sections then choose their own layout: left-aligned copy, two columns, grids. Nothing is centred by default.
- Header: logo on the left, navigation in the centre, "Get a Quote" on the right. Below 1100px the navigation moves
  into the hamburger menu.
- Hero: copy on the left on the plain background, the photograph in a panel on the right (from 46%) with the
  contact panel over it. On tablets and phones the copy sits above the photo, which fills the lower part of the
  section. No text is ever laid over the photograph, so it needs no overlay.
- Type scale tokens: `--fs-hero`, `--fs-h2`, `--fs-h3`, `--fs-lead` at the top of `global.css`.

## Brand colours & theme

Light theme. All colours are CSS variables at the top of `src/styles/global.css`:

| Token            | Value     | Used for                                                      |
| ---------------- | --------- | ------------------------------------------------------------- |
| `--bg`           | `#F5F5F5` | Page background                                               |
| `--brand`        | `#4A83B8` | Brand colour: logo, icons, lines, highlights, large text      |
| `--brand-strong` | `#3D76AD` | Button fill (white text on it meets WCAG AA contrast)         |
| `--brand-deep`   | `#2F6497` | Small text and links on light backgrounds (meets WCAG AA)     |
| `--text`         | `#0F1B2A` | Headings and body text                                        |

The two deeper blues are shades of the brand colour. `#4A83B8` alone is too light for small text or white button labels
to be readable (about 3.7:1 contrast; 4.5:1 is required).

## Editing content

Almost all text and contact details live in **`src/data/site.js`**: company name, email, phone, address, brand lines,
navigation, services, fleet categories, "why us" items and journey steps. The components read from it, so changes
appear everywhere at once.

## Contact page & form (frontend only)

The header's "Contact" link, the "Get a Quote" / "Get in Touch" buttons and the service "Enquire" links open
`/contact`. The service links pre-select that service in the form (`/contact?service=heavy`).

The form (full name, email, phone, company, service / transport requirement, message) validates in the browser.
Nothing is sent to or stored on a server. On submit, it opens the visitor's email app with the request pre-filled and
addressed to the company, and the page says so plainly. If you later want submissions delivered directly, a
third-party form service (Formspree, Basin…) can be wired into `onSubmit` in `ContactForm.vue`.

## Hero

The hero is the owner's own photograph of a cargo truck (`hero-logistics.jpg`), used exactly as delivered — no
crop, no colour edit. It is shown in a panel filling the right-hand side (`.hero__bg`, `inset: 0 0 0 46%`,
rounded on its left edge) with `object-position: 58% 64%` framing the truck and the containers. **Nothing is laid
over it** — no overlay, wash or fade — because the copy sits to its left on the plain page background, and
`.hero__content` is capped at `min(40rem, 42vw)` so no line of text can reach the photo. The only treatment is a
light `contrast(1.04) saturate(1.04)`, which suits the bright overcast sky and the site's light theme. On tablets
and phones the photo moves to the lower part of the hero (56%, and 50% on small phones) with a lower crop, and
the copy again sits above it on the plain background.

Over the photo sits one substantial panel (`.hero__panel`) rather than a scatter of small cards: the phone number
as a `tel:` link, the base in Al Dhafra, the transport types and a "Request a quote" link, on white glass with a
soft shadow. It is hidden below `1100px`, where the copy needs the full width and the contact details are a tap
away in the menu.

The animated smart-logistics overlay and the three floating HUD cards were **removed from the hero** at the
owner's request. `HeroAiLayer.vue` and `src/lib/hud.js` are still in the repository but nothing imports them, so
they are not shipped. `scratchpad/measure-hero.mjs` (session-local) checks that the contact panel never touches
the copy, the header or the ticker, and that no HUD or overlay markup has crept back in. **The Three.js scene is no longer loaded**, so `three` is not shipped in the
build at all. The files are kept for reference in `src/lib/hero/` (`scene.js`, `truck.js`, `world.js`, `textures.js`)
together with `src/lib/hero-loader.js`; nothing imports them. To bring the 3D truck back, import `initHeroScene` in
`HeroSection.vue` again and add a `<div class="hero__stage" data-hero-stage>` for the canvas. What that scene does, for
reference:

- Loaded with a dynamic `import()` after the page has loaded and the browser is idle, so it never blocks first paint.
- Setup runs in short steps that yield to the browser, so the page stays responsive while it loads.
- Resolution capped at 1.25×. If frames slow down, it lowers resolution further, then drops to 30 fps, and finally
  shows a still frame, so it never stutters.
- Renders at half rate while the page is being scrolled, so scrolling stays smooth.
- Pauses when off-screen or when the tab is hidden, and is fully disposed when you navigate to another page.
- Moving props fade out behind the headline column (a shader mask, not an overlay), so the copy stays readable while
  the scene remains fully visible.
- The rest of the page avoids costly effects: no backdrop blur, no SVG filters, and no endlessly animated full-width
  SVGs. Animations use `transform`/`opacity` only.
- Skipped when WebGL2 is unavailable, Save-Data is on, or graphics are software-rendered (no GPU). The hero then simply
  shows the photograph — nothing is missing or blank. Add `?force3d` to the URL to bypass the software check, for
  example for screenshots.
- `prefers-reduced-motion`: the scene shows a single still frame, and scroll/CSS animations are disabled.

The UAE map is an **illustrative visual**, not live tracking data, and is captioned accordingly. (The hero's
dashboard-style overlays, which carried the same caveat, are no longer part of the page.)

## Images

Photos in `src/assets/images/` are realistic Dubai / UAE road, port and truck photos from Unsplash (see
`src/assets/images/CREDITS.md`), except the hero photograph, which the owner supplied. `hero-logistics.jpg` is
the one behind the hero — used exactly as delivered, with the framing done in CSS (`object-position`)
(`hero-road.jpg` is the previous hero photo, kept in case it is wanted back). Note that the glob in
`src/data/images.js` is eager, so every `.jpg` in that folder is processed at build time whether it is used or
not — delete an image once nothing references it. To replace one, keep the same file name, or add a new `.jpg` and reference its name
(without extension) in `src/data/site.js`. For fleet photos, `focus` in `site.js` sets which part of the photo stays in
view on the narrow desktop cards.

The build creates AVIF + WebP at four widths. `npm run dev` creates lighter WebP-only variants so photos appear within
a few seconds (AVIF encoding on demand is slow).

## Font

Manrope (variable weight) is self-hosted from `public/fonts/` under the SIL Open Font License
(`public/fonts/OFL.txt`).
# Wadi-ushakal-website
