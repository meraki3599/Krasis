/*
  sections/work.js — Home section 05, "Our work".
  One pinned strip that scrolls sideways (scrubbed) on desktop: the giant "OUR WORK" title and subtitle,
  then one large card per client built from the supplied logo (monochrome via CSS filter). Hovering a card
  dims the others. On mobile / reduced motion the strip is a native swipe row with snap.
  Depends on: GSAP, ScrollTrigger, utils.js, ui.js, data/projects.js, data/copy.js.
*/
(function (K) {
  K.sections = K.sections || {};

  function card(p, i) {
    return '<li class="wcard">' +
      '<a class="wcard__link" href="#/work/' + p.slug + '" data-cursor="View case study" aria-label="' + K.esc(p.fullName) + ', view case study">' +
      '<div class="wcard__logo">' + K.ui.logo(p.logo, p.fullName, { filter: p.logoFilter, lazy: true }) + "</div>" +
      '<div class="wcard__meta">' +
      '<span class="label">' + K.pad(i + 1) + "</span>" +
      '<h3 class="wcard__name h3">' + K.esc(p.fullName) + "</h3>" +
      "</div>" +
      '<p class="wcard__type label">' + K.esc(K.txt(p.type)) + "</p>" +
      "</a></li>";
  }

  K.sections.work = {
    render: function () {
      var c = K.copy.work;
      // Lead case studies (the cinematic hospitality sites) first
      var ordered = K.projects.filter(function (p) { return p.lead; }).concat(K.projects.filter(function (p) { return !p.lead; }));
      return '<section class="work" aria-labelledby="work-title" data-hscroll>' +
        K.ui.rule() +
        '<div class="hscroll__viewport"><ul class="hscroll__track">' +
        '<li class="wintro">' +
        '<h2 class="wintro__title upper" id="work-title" data-anim="lines">' + K.esc(c.title) + "</h2>" +
        '<p class="lead wintro__sub" data-anim="fade">' + K.esc(c.subtitle) + "</p>" +
        '<p class="label wintro__hint" aria-hidden="true">Scroll <span>→</span></p>' +
        "</li>" +
        ordered.map(card).join("") +
        "</ul></div>" +
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

      K.media(K.MQ_MOTION, function () {
        hs.classList.add("is-pinned");
        function dist() { return Math.max(0, track.scrollWidth - viewport.clientWidth); }
        gsap.to(track, {
          x: function () { return -dist(); },
          ease: "none",
          scrollTrigger: {
            trigger: hs, start: "top top", end: function () { return "+=" + dist(); },
            pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1
          }
        });
        return function () { hs.classList.remove("is-pinned"); };
      });

      K.media(K.MQ_STATIC, function () {
        viewport.setAttribute("data-cursor", "Drag");
        return function () { viewport.removeAttribute("data-cursor"); };
      });
    }
  };
})(window.KRASIS);
