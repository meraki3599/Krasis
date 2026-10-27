#!/usr/bin/env node
/*
  tools/build-pages.js — generates one real HTML page per address so search engines can index every page.

  From index.html (the template) and the site's own data (config.js, data/seo.js, data/copy.js,
  data/projects.js) it writes:
    - index.html            title/description/canonical + readable home text (updated in place)
    - about/index.html, services/index.html, … one per page, same shell, own meta + text
    - 404.html              GitHub Pages' not-found page (same shell, noindex)
    - sitemap.xml           every page address

  The readable text sits inside <main id="view"> between the SEO:START/END markers. Browsers with
  JavaScript replace it with the animated view on load; crawlers and no-JS visitors read it as is.

  Run after changing any copy, project, title or description:   node tools/build-pages.js
  Depends on: Node.js (no packages).
*/
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const write = (f, s) => {
  fs.mkdirSync(path.dirname(path.join(ROOT, f)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, f), s);
};

// ---------- Load the site's data files exactly as the browser does ----------
const sandbox = { window: {} };
vm.createContext(sandbox);
["js/config.js", "js/data/seo.js", "js/data/copy.js", "js/data/projects.js"].forEach((f) => vm.runInContext(read(f), sandbox, { filename: f }));
const K = sandbox.window.KRASIS;
const { seo, copy, projects, config } = K;
const SITE = config.siteUrl.replace(/\/$/, "");

const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const txt = (v) => (v && typeof v === "object" ? v.text : v);
const p = (s) => `<p>${esc(s)}</p>`;
const list = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
const href = (route) => "/" + (route ? route + "/" : "");

// ---------- Readable text for each page (all taken from the live site's copy) ----------
const services = () => copy.intro.services.map((s) => `<h3>${esc(s.title)}</h3>${p(s.text.charAt(0).toUpperCase() + s.text.slice(1) + ".")}`).join("");
const steps = () => copy.process.steps.map((s) => `<h3>${esc(s.n + " " + s.title)}</h3>${p(s.text)}`).join("");
const brands = () => list(projects.map((x) => `${x.fullName} (${x.category}): ${txt(x.type)}`));
const plans = () => copy.pricing.plans.map((pl) =>
  `<h3>${esc(pl.name)}: ₹${pl.price.toLocaleString("en-IN")}/-*</h3>${list(pl.features.concat(pl.extras))}${pl.note ? p(pl.note) : ""}`
).join("") + p(copy.pricing.footnote);
const contact = () =>
  `<p>Email: <a href="mailto:${esc(config.email)}">${esc(config.email)}</a><br>` +
  `Instagram: <a href="https://www.instagram.com/${esc(config.instagram)}">@${esc(config.instagram)}</a><br>` +
  `Location: ${esc(config.location)}</p>`;

const BODY = {
  home: () =>
    `<h1>Get your website the right way: the Krasis way</h1>` +
    p(seo.home.description) +
    `<h2>${esc(copy.problem.title)}</h2>` + copy.problem.body.map(p).join("") + p(copy.problem.final) +
    `<h2>That's where Krasis comes in.</h2>` + p(copy.intro.body) + `<h3>${esc(copy.intro.listLabel)}</h3>` + services() + p(copy.intro.closing) +
    `<h2>Vision</h2>` + p(copy.vision) + `<h2>Mission</h2>` + p(copy.mission) +
    `<h2>${esc(copy.work.title)}</h2>` + p(copy.work.subtitle) + brands() +
    `<h2>${esc(copy.process.title)}</h2>` + steps() +
    `<h2>${esc(copy.included.title)}</h2>` + p(copy.included.intro) + list(copy.included.items) +
    `<h2>${esc(copy.pricing.title)}</h2>` + plans() +
    `<h2>${esc(copy.why.title)}</h2>` + p(copy.why.opening) + copy.why.contrasts.map(p).join("") + p(copy.why.pivot) + list(copy.why.principles) +
    `<h2>${esc(copy.cta.title)}</h2>` + contact(),
  work: () => `<h1>Work</h1>` + p(copy.work.subtitle) + brands(),
  services: () => `<h1>Services</h1>` + p(copy.intro.body) + services() + p("Tools we build with: GSAP, WebGL, Figma, modern web standards."),
  process: () => `<h1>${esc(copy.process.title)}</h1>` + steps(),
  pricing: () => `<h1>${esc(copy.pricing.title)}</h1>` + plans(),
  about: () => `<h1>About</h1><h2>Overview</h2>` + p(copy.about.overview) + `<h2>Our Mission</h2>` + p(copy.about.mission) +
    `<h2>Vision</h2>` + p(copy.vision) + `<h2>Who you'll work with</h2>` + p(copy.why.principles[1]),
  contact: () => `<h1>${esc(copy.cta.title)}</h1>` + contact() + p(config.replyLine + "."),
  notfound: () => `<h1>404</h1>` + p(copy.notFound)
};

const navLinks = () =>
  `<nav aria-label="Site pages"><ul>${copy.nav.map((n) => `<li><a href="${href(n.route)}">${esc(n.label)}</a></li>`).join("")}</ul></nav>`;

// ---------- Template handling ----------
const template = read("index.html");

function setMeta(html, page) {
  const s = seo[page];
  const url = s.path === null ? SITE + "/" : SITE + href(s.path);
  const rep = (re, val) => {
    if (!re.test(html)) throw new Error("Template is missing " + re);
    html = html.replace(re, val);
  };
  rep(/<title>[\s\S]*?<\/title>/, `<title>${esc(s.title)}</title>`);
  rep(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(s.description)}">`);
  rep(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(s.title)}">`);
  rep(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(s.description)}">`);
  rep(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
  rep(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);
  html = html.replace(/\n  <meta name="robots" content="noindex">/, "");
  if (page === "notfound") html = html.replace(/<link rel="canonical"[^>]*>/, `<meta name="robots" content="noindex">`);
  return html;
}

function setBody(html, page) {
  const block = `<!-- SEO:START (generated by tools/build-pages.js; replaced by the live view once JavaScript runs) -->\n` +
    `    <div class="seo-text">${navLinks()}${BODY[page]()}</div>\n    <!-- SEO:END -->`;
  const re = /<!-- SEO:START[\s\S]*?<!-- SEO:END -->/;
  if (!re.test(html)) throw new Error("Template is missing the SEO:START/END markers");
  return html.replace(re, block);
}

// Asset paths: "./x" works at the root; one folder down needs "../x"; 404.html can be served at any depth.
const rebase = (html, prefix) => html.replace(/(href|src)="\.\/(?!\/)/g, `$1="${prefix}`);

// ---------- Write everything ----------
let built = [];
write("index.html", setBody(setMeta(template, "home"), "home"));
built.push("index.html");

Object.keys(seo).forEach((page) => {
  const s = seo[page];
  if (page === "home" || s.path === null) return;
  const out = rebase(setBody(setMeta(template, page), page), "../");
  write(`${s.path}/index.html`, out);
  built.push(`${s.path}/index.html`);
});

write("404.html", rebase(setBody(setMeta(template, "notfound"), "notfound"), "/"));
built.push("404.html");

const urls = Object.values(seo).filter((s) => s.path !== null)
  .map((s) => `  <url><loc>${SITE}${href(s.path)}</loc><changefreq>monthly</changefreq><priority>${s.path ? "0.8" : "1.0"}</priority></url>`);
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generated by tools/build-pages.js -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
built.push("sitemap.xml");

console.log("Built:\n  " + built.join("\n  "));
