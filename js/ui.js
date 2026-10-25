/*
  ui.js — shared markup builders (strings). Logo elements only ever render the supplied files;
  a missing file turns into a labelled empty slot, never a drawn logo.
  Depends on: utils.js, data/copy.js, data/projects.js.
*/
(function (K) {
  var esc = K.esc;
  var ui = {};

  // ---------- Logos ----------
  ui.logo = function (src, alt, opts) {
    opts = opts || {};
    var style = opts.filter ? ' style="filter:' + esc(opts.filter) + '"' : "";
    var size = opts.w ? ' width="' + opts.w + '" height="' + opts.h + '"' : "";
    return '<span class="logo ' + (opts.cls || "") + '"' + (opts.unit ? " data-unit" : "") + ">" +
      '<img src="./' + esc(src) + '" alt="' + esc(alt) + '"' + size + style +
      (opts.lazy ? ' loading="lazy" decoding="async"' : "") +
      ' onerror="KRASIS.ui.missing(this)" data-src="' + esc(src) + '"></span>';
  };
  ui.krasis = function (cls, opts) {
    opts = opts || {};
    return ui.logo("assets/logos/krasis.png", opts.alt == null ? "Krasis" : opts.alt, {
      cls: "logo--krasis " + (cls || ""), w: 840, h: 235, unit: opts.unit, lazy: opts.lazy
    });
  };
  // Replaces a broken logo image with a neutral slot naming the expected file
  ui.missing = function (img) {
    var slot = document.createElement("span");
    slot.className = "logo-slot";
    slot.textContent = "Add " + img.getAttribute("data-src");
    slot.setAttribute("role", "img");
    slot.setAttribute("aria-label", img.alt || "Logo missing");
    img.replaceWith(slot);
  };

  // ---------- Small glyphs ----------
  ui.star = function () {
    return '<span class="star" aria-hidden="true"><svg viewBox="0 0 16 16"><path fill="currentColor" d="M8 0 C8.6 4.6 11.4 7.4 16 8 C11.4 8.6 8.6 11.4 8 16 C7.4 11.4 4.6 8.6 0 8 C4.6 7.4 7.4 4.6 8 0Z"/></svg></span>';
  };
  ui.plus = function (cls) { return '<span class="plus ' + (cls || "") + '" aria-hidden="true"></span>'; };
  ui.counter = function (n, total, cls) {
    return '<p class="counter ' + (cls || "") + '" aria-hidden="true">(' + K.pad(n) + "/" + K.pad(total || 10) + ")</p>";
  };
  ui.rule = function () { return '<span class="rule-y" data-anim="rule-y" aria-hidden="true"></span>'; };
  ui.arrow = function () {
    return '<svg class="btn__arrow" viewBox="0 0 16 10" aria-hidden="true"><path d="M0 5h15M11 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1"/></svg>';
  };
  ui.igIcon = function () {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="12" cy="12" r="4.4" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="17.6" cy="6.4" r="1" fill="currentColor"/></svg>';
  };
  ui.btn = function (label, href, opts) {
    opts = opts || {};
    return '<a class="btn ' + (opts.cls || "") + '" href="' + esc(href) + '" data-magnetic>' +
      '<span class="btn__dot" aria-hidden="true"></span><span>' + esc(label) + "</span>" + ui.arrow() + "</a>";
  };

  // ---------- Media placeholders ----------
  ui.media = function (src, label, cls, alt) {
    if (src) return '<img class="' + (cls || "") + '" src="./' + esc(src) + '" alt="' + esc(alt || "") + '" loading="lazy" decoding="async">';
    return '<div class="ph ' + (cls || "") + '"><span class="ph__label">' + esc(label || "Project screenshot goes here") +
      '</span><span class="ph__hint">Set the image path in js/data/projects.js</span></div>';
  };
  ui.devices = function (p) {
    return '<div class="devices">' +
      '<div class="laptop"><div class="laptop__screen">' + ui.media(p.images.desktop, "Project screenshot goes here", "", p.name + " website on desktop") + '</div><div class="laptop__base"></div></div>' +
      '<div class="phone">' + ui.media(p.images.mobile, "Mobile screenshot", "", p.name + " website on mobile") + "</div>" +
      "</div>";
  };

  // ---------- Pricing panels ----------
  ui.plans = function (opts) {
    opts = opts || {};
    var c = K.copy.pricing;
    return '<div class="plans">' + c.plans.map(function (p) {
      var items = p.features.map(function (f) {
        return "<li>" + ui.star() + "<span>" + esc(f) + "</span></li>";
      }).concat(p.extras.map(function (f) {
        return '<li class="is-extra">' + ui.star() + "<span>" + esc(f) + '</span><span class="dot-accent" aria-label="Premium extra"></span></li>';
      })).join("");
      return '<article class="plan plan--' + p.id + '" aria-labelledby="plan-' + p.id + (opts.idSuffix || "") + '">' +
        '<h3 class="plan__name label" id="plan-' + p.id + (opts.idSuffix || "") + '">' + esc(p.name) + "</h3>" +
        '<p class="plan__price" aria-label="' + esc("₹" + K.inr(p.price) + " (see footnote)") + '">₹<span data-anim="count" data-count="' + p.price + '">' + K.inr(p.price) + "</span>/-<sup>*</sup></p>" +
        (p.note ? '<p class="plan__note">' + esc(p.note) + "</p>" : "") +
        '<ul class="plan__list">' + items + "</ul>" +
        '<div class="plan__cta">' + ui.btn(p.cta, "#/contact?plan=" + p.id, { cls: p.id === "premium" ? "" : "btn--ghost" }) + "</div>" +
        "</article>";
    }).join("") + "</div>" +
    '<p class="footnote">' + esc(c.footnote) + "</p>";
  };

  // Email (click to copy) + Instagram
  ui.contactLinks = function () {
    var cfg = K.config;
    return '<button type="button" class="link-draw" data-copy="' + esc(cfg.email) + '" data-cursor="Copy" aria-label="Copy email address ' + esc(cfg.email) + '">' + esc(cfg.email) + "</button>" +
      '<a class="link-draw ig" href="https://www.instagram.com/' + esc(cfg.instagram) + '" target="_blank" rel="noopener">' + ui.igIcon() + "@" + esc(cfg.instagram) + "</a>";
  };

  // ---------- Footer (appended to every view by the router) ----------
  ui.footer = function (compact) {
    var cfg = K.config;
    var links = ["Work", "Services", "Pricing", "About", "Contact"].map(function (l) {
      return '<a href="#/' + l.toLowerCase() + '">' + l + "</a>";
    }).join("");
    // Compact footer (Home): the final CTA section already carries the headline
    return '<footer class="footer' + (compact ? " footer--compact" : "") + '" data-footer>' +
      '<div class="container">' +
      ui.plus("plus--tl") +
      (compact ? "" : '<h2 class="footer__title h2" data-anim="lines">' + esc(K.copy.cta.title) + "</h2>") +
      (compact ? "" : '<div class="footer__contact" data-anim="fade">' + ui.contactLinks() + "</div>") +
      '<div class="footer__mark" data-footer-mark>' + ui.krasis("", { lazy: true }) + "</div>" +
      '<div class="footer__bar label"><nav class="footer__links" aria-label="Footer">' + links + "</nav>" +
      "<span>© 2026 Krasis. " + esc(cfg.location) + "</span></div>" +
      "</div></footer>";
  };

  K.ui = ui;
})(window.KRASIS);
