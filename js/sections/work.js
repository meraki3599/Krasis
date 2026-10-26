/*
  sections/work.js — Home section 05, "Our work".
  The "OUR WORK" title and subtitle sit above a strip that scrolls sideways (pinned + scrubbed) at every
  screen size, with one large card per client built from the supplied logo (monochrome via CSS filter).
  Hovering a card dims the others. With reduced motion the strip is a native swipe row with snap.
  Depends on: GSAP, ScrollTrigger, utils.js, ui.js, data/projects.js, data/copy.js.
*/
(function (K) {
  K.sections = K.sections || {};

  function card(p, i) {
    return '<li class="wcard">' +
      '<div class="wcard__link">' +
      '<div class="wcard__logo">' +
      '<span class="wcard__n label" aria-hidden="true">' + K.pad(i + 1) + "</span>" +
      '<span class="wcard__cat label">' + K.esc(p.category) + "</span>" +
      K.ui.logo(p.logo, p.fullName, { filter: p.logoFilter, lazy: true }) +
      "</div>" +
      '<div class="wcard__meta">' +
      '<h3 class="wcard__name h3">' + K.esc(p.fullName) + "</h3>" +
      '<p class="wcard__type label">' + K.esc(K.txt(p.type)) + "</p>" +
      "</div>" +
      "</div></li>";
  }

  K.sections.work = {
    render: function () {
      var c = K.copy.work;
      // Lead projects (the cinematic hospitality sites) first
      var ordered = K.projects.filter(function (p) { return p.lead; }).concat(K.projects.filter(function (p) { return !p.lead; }));
      return '<section class="work" aria-labelledby="work-title" data-hscroll>' +
        K.ui.rule() +
        // Heading sits above the strip and stays put while the cards slide
        '<div class="wintro container">' +
        '<h2 class="wintro__title upper" id="work-title" data-anim="lines">' + K.esc(c.title) + "</h2>" +
        '<div class="wintro__side">' +
        '<p class="lead wintro__sub" data-anim="fade">' + K.esc(c.subtitle) + "</p>" +
        '<p class="label wintro__hint" aria-hidden="true">Scroll <span>→</span></p>' +
        "</div></div>" +
        '<div class="hscroll__viewport"><ul class="hscroll__track">' +
        ordered.map(card).join("") +
        "</ul></div>" +
        '<div class="wprog container" aria-hidden="true"><span class="wprog__bar"><i></i></span>' +
        '<span class="wprog__count label">01 / ' + K.pad(ordered.length) + "</span></div>" +
        K.ui.counter(5) +
        "</section>";
    },

    mount: function (root) {
      var hs = K.$("[data-hscroll]", root);
      var viewport = K.$(".hscroll__viewport", hs);
      var track = K.$(".hscroll__track", hs);
      var cards = K.$$(".wcard", hs);

      // Hover dims the other cards
      cards.forEach(function (c) {
        K.listen(c, "mouseenter", function () { track.classList.add("is-hovering"); c.classList.add("is-hover"); });
        K.listen(c, "mouseleave", function () { track.classList.remove("is-hovering"); c.classList.remove("is-hover"); });
      });

      gsap.fromTo(cards, { opacity: 0, y: K.flags.reduced ? 0 : 30 }, {
        opacity: 1, y: 0, duration: 1.4, stagger: 0.1,
        scrollTrigger: { trigger: hs, start: "top 75%", once: true }
      });

      // Scroll-driven sideways movement on every screen size; only reduced motion falls back to swiping
      K.media("(prefers-reduced-motion: no-preference)", function () {
        hs.classList.add("is-pinned");
        function dist() { return Math.max(0, track.scrollWidth - viewport.clientWidth); }
        var fill = K.$(".wprog__bar i", hs);
        var count = K.$(".wprog__count", hs);
        var total = K.pad(cards.length);
        gsap.to(track, {
          x: function () { return -dist(); },
          ease: "none",
          scrollTrigger: {
            trigger: hs, start: "top top", end: function () { return "+=" + dist(); },
            pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
            onUpdate: function (self) {
              gsap.set(fill, { scaleX: self.progress });
              count.textContent = K.pad(Math.min(cards.length, Math.round(self.progress * (cards.length - 1)) + 1)) + " / " + total;
            }
          }
        });
        return function () { hs.classList.remove("is-pinned"); };
      });

      K.media("(prefers-reduced-motion: reduce)", function () {
        viewport.setAttribute("data-cursor", "Drag");
        return function () { viewport.removeAttribute("data-cursor"); };
      });
    }
  };
})(window.KRASIS);
