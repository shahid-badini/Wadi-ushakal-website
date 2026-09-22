# Wadi Nushakal — Website

Marketing website for **Wadi Nushakal**, a UAE transport & logistics company based in Beda Zayed, Al Dhafra, Abu Dhabi.
*Your Cargo, Our Commitment.*

**Frontend only**: HTML, CSS and [Vue.js 3](https://vuejs.org), built with [Vite](https://vite.dev). There is no
backend, database or server code. The build output is plain static files that any web host can serve.

- **Vue 3** single-file components (`.vue`: template + script + scoped CSS)
- **Vue Router**: two pages, the home page (`/`) and the contact page (`/contact`)
- **Plain CSS** with design tokens in `src/styles/global.css`
- **Three.js** for the live 3D hero scene, loaded lazily after first paint (its own ~560 KB chunk)
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
    HomePage.vue          ← home page: all sections (no contact form — "Get Started" links to /contact)
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
- Header: logo on the left, navigation in the centre, "Get Started" on the right. Below 1100px the navigation moves
  into the hamburger menu.
- No section eyebrows: the small uppercase labels above each heading ("About Wadi Nushakal", "Our Services"…) were
  removed at the owner's request — the headings already name each section.
- Hero: a live 3D desert-highway scene filling the section, with the copy on the left and the truck, the
  logistics route and the status panel to the right. On tablets and phones the copy comes first with the truck
  framed below it, and the logistics layer is dropped. See *Hero*.
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

The header's "Contact" link, the "Get Started" buttons and the service "Enquire" links open `/contact`. Two of
them carry something through in the query string, which `ContactForm.vue` reads on mount:

- the service "Enquire" links pre-select that service (`/contact?service=heavy`);
- the hero's "Get Started" box takes the email typed into it and pre-fills the email field
  (`/contact?email=…`, only when it looks like an address).

**There is no login or account system**, and the hero's email box is not a signup: nothing is sent or stored
anywhere by it. It is a shortcut into the quote form. Adding real accounts would need a backend (or a service
like Firebase/Supabase), which this project deliberately does not have.

The form (full name, email, phone, company, service / transport requirement, message) validates in the browser.
Nothing is sent to or stored on a server. On submit, it opens the visitor's email app with the request pre-filled and
addressed to the company, and the page says so plainly. If you later want submissions delivered directly, a
third-party form service (Formspree, Basin…) can be wired into `onSubmit` in `ContactForm.vue`.

## Hero

The hero is a **live 3D scene** (Three.js): a Wadi Nushakal truck driving forward down a desert highway in
clear daylight. The wheels turn, the cab rides its suspension, the world streams past the truck (which stays
put, so the scene is endless and cheap), and the camera drifts slowly with the pointer. `src/lib/hero/` builds
it — `scene.js` (setup, lighting, camera, render loop), `world.js` (sky, dunes, road, roadside props),
`truck.js`, `textures.js` — and `src/lib/hero-loader.js` mounts it.

**How it loads.** After first paint, once the browser is idle, so it never blocks the initial render. It is
skipped entirely when WebGL2 is missing, when Save-Data is on, or when WebGL is software-rendered; in those
cases the CSS horizon in `.hero__sky` is what shows, so the hero is never blank. `?force3d` bypasses the
software check (headless Chrome trips it, so the test scripts use it).

**Smoothness.** Resolution is capped at 1.25x and steps down (1x, 0.8x) if frames slow; below ~45 fps it
drops to half rate, and on very slow devices it settles on a single still frame. It renders at half rate
while the page is being scrolled, and pauses completely when off-screen or when the tab is hidden. Measured
on the owner's machine: idle 0.0% and scroll 0.1% of frames over 25 ms.

**Copy and overlays.** Everything readable is HTML/SVG on top: eyebrow, a real `<h1>`, tagline, supporting
line, two real links and the trust row, left aligned and capped at 34rem. `HeroAiLayer.vue` adds the glowing
Abu Dhabi to Destination route with GPS pins, a vehicle indicator, data points and a glass status panel
(labelled "Illustrative" — there is no live tracking). The copy uses the site's light tokens; the route and
panel accent use gold.

Two things were tried here and **removed for cause** — don't reintroduce them:

- A white wash over the scene behind the copy, and later a `text-shadow` halo on the copy. The wash was the
  "white shade" the owner objected to; the halo made every glyph look smudged. The scene behind the copy is
  light desert and sky, so the dark type reads unaided — the copy just sets `font-smoothing`/
  `optimizeLegibility` and nothing else.
- A full-viewport camera drift on a background image (before the 3D scene): it cost scroll p95 33 ms and
  5.3% janky frames, versus 0.0% without it.

Earlier versions of this section are worth knowing about, because the same ground was covered several times:
a photo in a right-hand panel, a full-bleed photo, a dark cinematic treatment, and the owner's reference
artwork used flat with the copy hidden behind it. The artwork files are still in `src/assets/images/`
(`hero-scene.png` whole, `hero-scene-wide.png` cropped to the scene) if a photo hero is ever wanted back.

`scratchpad/measure-hero.mjs` (session-local) checks that the 3D stage covers the section, that a canvas
actually mounted, that the copy is visible and clear of the header, that the route markers and labels do not
clash with the panel or the copy, and that no leftovers from the earlier versions are in the page.

The UAE map is an **illustrative visual**, not live tracking data, and is captioned accordingly. (The hero's
dashboard-style overlays, which carried the same caveat, are no longer part of the page.)

## Images

Photos in `src/assets/images/` are realistic Dubai / UAE road, port and truck photos from Unsplash (see
`src/assets/images/CREDITS.md`), except the hero photograph, which the owner supplied. `hero-logistics.jpg` is
the owner's reference artwork, and `hero-scene-wide.png` is that same file cropped to the scene alone — the
crop is what the hero uses (see *Hero*). `hero-logistics.jpg` and `hero-road.jpg` are earlier hero photos,
kept in case they are wanted back. Note that the glob in
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
