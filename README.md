# Krasis — studio website

The Krasis portfolio and sales site: plain HTML, CSS and JavaScript, no build step.

## Open it

Double-click `index.html`. The whole site runs from that one file in any modern browser, offline, with no server and no install. Fonts, libraries and images are all in this folder.

Every page is a view inside `index.html`, swapped by a hash router:

| Route | View |
| --- | --- |
| `#/` | Home (10 sections) |
| `#/work` | Work index |
| `#/work/1bhk` (and every other slug) | Case study |
| `#/services` | Services |
| `#/process` | Process |
| `#/pricing` | Pricing |
| `#/about` | About |
| `#/contact` (`?plan=standard` / `?plan=premium`) | Contact |
| anything else | 404 |

## Folder map

```
index.html            page shell, meta, JSON-LD, ordered script tags
css/
  tokens.css          colours, type scale, spacing, font faces
  base.css            reset, type primitives, focus, a11y helpers
  layout.css          container, 12-col grid, rules, "+" markers, counters, dots, bands
  components.css      logo slots, placeholders, buttons, preloader, nav, menu, cursor, devices, plans, footer
  pages.css           every Home section and every view
  animations.css      keyframes + reduced-motion overrides
js/
  config.js           ← settings you edit (form endpoint, analytics, placeholder tags)
  data/copy.js        ← all site copy
  data/projects.js    ← all client projects (logos, screenshots, case study text)
  utils.js            namespace, flags, eases, view lifecycle, clipboard/toast
  reveal.js           split-text helper + declarative reveals (data-anim)
  ui.js               shared markup (logo element, buttons, devices, plans, footer)
  smooth-scroll.js    Lenis wired to the GSAP ticker
  cursor.js nav.js preloader.js squares.js grid-lines.js form.js
  hero.js             Home 01: the parallax hero (port of hero-parallax-react.html)
  sections/           Home 02–10, one file each
  pages/              one file per view
  router.js           hash router + page transitions
  main.js             boot
assets/
  fonts/              Montserrat (variable) + Instrument Serif, self-hosted woff2
  logos/              Krasis + client logos (supplied files only)
  images/             put project screenshots and founder photos here
  og/                 OG card + favicon (generated from the supplied logo)
  vendor/             GSAP 3.12.5, ScrollTrigger, CustomEase, Lenis 1.1.13 (classic builds)
```

## Logos

All logos live in `assets/logos/`. The site only ever renders these files. It never draws, retypes or approximates a logo.

| File | Status |
| --- | --- |
| `krasis.png` | supplied (cropped tight to the artwork) |
| `krasis-square.png` | supplied original, used on the hero parallax cards |
| `1bhk.png`, `2bhk.png`, `ballr.png`, `home-decor.png` | supplied |
| `luminae.png` | **missing**: drop the Luminae logo in with this exact name |

A missing file shows a dashed slot labelled `Add assets/logos/<file>`. The site also logs one 404 per missing logo in the browser console until the file is added. To use an SVG instead, change the extension in `js/data/projects.js` (client logos) or `js/ui.js` (`ui.krasis`).

Client logos turn monochrome via a CSS `filter` set per project (`logoFilter` in `projects.js`). The artwork itself is never edited.

## Contact form

Set your endpoint in `js/config.js`:

```js
formEndpoint: "https://formspree.io/f/xxxxxxx"
```

The form posts JSON to that endpoint. While the endpoint is empty, submitting opens the visitor's email app with a prefilled message to contactkrasis@gmail.com instead. A hidden honeypot field (`website`) silently drops bot submissions.

## Deploy

The folder is a static site with only relative paths, so you can upload it anywhere:

- **Netlify:** drag the folder onto app.netlify.com/drop.
- **Vercel:** `vercel deploy` from this folder (framework preset: Other).
- **Cloudflare Pages:** create a project, upload the folder, leave the build command empty.
- **GitHub Pages:** push the folder to a repo and enable Pages on the root.

Before launch, update `siteUrl` in `js/config.js`, the URLs in `sitemap.xml` and `robots.txt`, and use absolute URLs for `og:image` in `index.html`.

## Analytics

`js/config.js` → `analytics`: set `provider: "plausible"` with `plausibleDomain`, or `provider: "ga"` with `gaId`. Neither loads until you configure it. Plausible needs no cookie banner. GA may need one depending on your audience.

## Things to replace

These are marked in the UI with a dashed **Replace** tag or a grid placeholder (turn the tags off with `showPlaceholderTags: false` in `config.js` once done):

1. **Luminae logo:** `assets/logos/luminae.png`. A dark-on-white or dark-on-transparent PNG works; the site inverts it to light.
2. **Case study text:** `year`, `timeline`, `brief`, `approach` and `details` per project are placeholders (`placeholder: true`). Edit the text and set the flag to `false`.
3. **Project categories and types:** Home Decor and Luminae are set to Retail as best guesses. Confirm them.
4. **Founder photos and names:** the About page has two founder slots (`js/pages/about.js`). Remove one if you're a solo founder.
5. **Reply line:** `replyLine` in `config.js` ("We reply within 24 hours").
6. **Form endpoint:** `formEndpoint` in `config.js`.
7. **Domain:** `siteUrl`, `sitemap.xml`, `robots.txt` and the OG image URL.

## Notes on decisions

- **Hero:** per your instruction, the hero is the exact `hero-parallax-react.html` animation (three rows of logo cards tilting in and sliding apart over a 300vh scroll), rebuilt in GSAP so it runs offline without React. Only the text changed. That replaces the WebGL converging-grid hero in the brief. The grid-line canvas still appears as the bookend in the final CTA and on the 404.
- **Fonts:** the logo pairs a high-contrast serif italic ("Kra") with a heavy grotesk ("sis."). The accent font is **Instrument Serif Italic**, the closest Google match to that italic: narrow, sharp, high contrast. The heavy grotesk isn't used as a text face, because the brief fixes Montserrat as the system font and caps the site at two families.
- **`--text-mute`** is 0.56 white instead of 0.48 so small meta text passes WCAG AA (4.5:1) on `#0e0e0e`.
- **Squares cluster** is a 2D canvas, not WebGL, which is lighter for the same look.
- **Smooth scroll** (Lenis) runs on mouse and trackpad devices. Touch devices keep native scrolling, which feels better on phones.
- **Preloader** shows once per browser (localStorage). Set `alwaysShowPreloader: true` to see it every load.

## Not verified here

Lighthouse wasn't run as part of this build. Run it in Chrome DevTools on the deployed site.
