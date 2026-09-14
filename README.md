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

1. ~~Verify the email address~~ Confirmed as supplied (`innfo@wadinushakal.comm`). If it changes, update it in
   `src/data/site.js` and in the JSON-LD block of `index.html`.
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
- Hero: a full-bleed cinematic scene with the copy on the left and the truck, the logistics route and the
  status panel on the right; the left third of the scene is deepened so the copy reads over it. On tablets and
  phones the copy comes first with the truck below it, and the logistics layer is dropped. See *Hero*.
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

The hero recreates the reference artwork the owner supplied — cinematic UAE highway at sunset, the cargo
truck large and to the right, the copy on the left, a glowing logistics route and a smart-logistics panel —
but built as layers, not as that flat image.

**Background.** `hero-scene-wide.png` is the owner's artwork cropped to the scene alone (crop x 640-1672,
y 330-941 of `hero-scene.png`, which is kept unchanged as the source), so the truck, highway, sky and
skyline are in frame and the artwork's own headline, logo, buttons and panel are outside it. It is full-bleed
(`.hero__art`, `inset: 0`, `object-position: 56% 66%`) with two gradients over it: a directional wash that
deepens the left third behind the copy, and a closure along the bottom into the light page below. No white
overlay anywhere.

**Copy.** Everything readable is the site's own markup — eyebrow, a real `<h1>`, tagline, supporting line,
two real links ("Get a Quote" to `/contact`, "Explore Our Services" to `#services`) and the trust row. Left
aligned, never centred, capped so it stays out of the truck. The headline is deliberately smaller than the
global `--fs-hero` (`clamp(2rem, 1.35rem + 2.1vw, 3.35rem)`).

**Logistics layer** (`HeroAiLayer.vue`): a glowing route from Abu Dhabi to the destination with GPS pins, a
vehicle indicator travelling it, data points, a faint digital mesh and a glass status panel (Route Status /
Cargo / Destination). It is a design element, not live tracking — the drawing is `aria-hidden` and the panel
is labelled "Illustrative". Coordinates are a 1600 x 900 map of the hero; the route sits in the open sky
(x 880-1180, y 146-258), clear of the copy, the header capsule and the panel. Hidden below 900px, where the
sky band is too short for it.

**Colour.** The hero runs on local `--h-*` tokens (light type on the dark scene) so the rest of the site
stays on the light global palette. The copy, buttons and trust icons use the brand blue; the route, pins,
destination marker and panel accent use the artwork's gold.

**Header.** Over the hero the bar switches to dark glass (`is-over-hero` in `SiteHeader.vue`: home page,
not scrolled) with light nav and logo text, and returns to the light glass as soon as the page scrolls or on
any other page.

**Motion and performance.** Only the logistics layer animates — the route draws, pins pulse, data points and
the vehicle indicator travel the path, all on transform / opacity / stroke-dashoffset. A full-viewport
"camera drift" on the image was tried and **removed**: it cost real frames (scroll p95 33ms, 5.3% of frames
over 25ms) and dropped back to 0.0% without it. Two things the reference implies are not possible from a
single photograph and are deliberately absent: rotating wheels and suspension travel on the truck (those
need a 3D model, which was tried earlier, looked cartoonish and was heavy on this machine).

`scratchpad/measure-hero.mjs` (session-local) checks that the scene covers the section, the copy stays in the
left half and clear of the header, the destination marker and place labels do not clash with the panel,
header or copy, and that no leftovers from earlier hero versions are in the page.

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
