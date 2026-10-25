/*
  sections/work.js — Home section 05, "Our work".
  1) Logo wall of the supplied client logos (monochrome via CSS filter), slow staggered fade-in;
     hovering one dims the rest and shows its project type.
  2) Horizontal project scroller: pinned + scrubbed on desktop, native swipe with snap on mobile.
  Depends on: GSAP, ScrollTrigger, utils.js, ui.js, data/projects.js, data/copy.js.
*/
(function (K) {
  K.sections = K.sections || {};

  function wall() {
    return K.projects.map(function (p) {
      return '<li class="lwall__item">' +
        '<a class="lwall__link" href="#/work/' + p.slug + '" data-cursor="View case study" aria-label="' + K.esc(p.fullName) + ', view case study">' +
        K.ui.logo(p.logo, p.fullName, { cls: "lwall__logo", filter: p.logoFilter, lazy: true }) +
        '<span class="lwall__type label">' + K.esc(K.txt(p.type)) + "</span>" +
        "</a></li>";
    }).join("");
  }

  function card(p, i) {
    return '<article class="pcard">' +
      '<a class="pcard__link" href="#/work/' + p.slug + '" data-cursor="View">' +
      '<div class="pcard__media">' + K.ui.devices(p) + "</div>" +
      '<div class="pcard__meta">' +
      '<span class="label">' + K.pad(i + 1) + "</span>" +
      '<h3 class="pcard__name h3">' + K.esc(p.fullName) + "</h3>" +
      '<span class="label">' + K.phText(p.year) + "</span>" +
      "</div>" +
      '<ul class="tags">' + p.services.map(function (s) { return '<li class="tag">' + K.esc(s) + "</li>"; }).join("") + "</ul>" +
      "</a></article>";
  }

  K.sections.work = {
    render: function () {
      var c = K.copy.work;
      // Lead case studies (the cinematic hospitality sites) first
      var ordered = K.projects.filter(function (p) { return p.lead; }).concat(K.projects.filter(function (p) { return !p.lead; }));
      return '<section class="section work" aria-labelledby="work-title">' +
        K.ui.rule() +
        '<div class="container grid">' +
        '<h2 class="h1 upper c-1-9" id="work-title" data-anim="lines">' + K.esc(c.title) + "</h2>" +
        '<p class="lead c-6-12 mt-m" data-anim="fade">' + K.esc(c.subtitle) + "</p>" +
        "</div>" +
        '<div class="container"><ul class="lwall mt-l" data-lwall>' + wall() + "</ul></div>" +
        '<div class="hscroll mt-xl" data-hscroll>' +
        '<div class="hscroll__head container"><p class="label">Selected projects</p><p class="label hscroll__hint">Scroll</p></div>' +
        '<div class="hscroll__viewport" data-cursor-mobile="Drag"><div class="hscroll__track">' + ordered.map(card).join("") + "</div></div>" +
        "</div>" +
        K.ui.counter(5) +
        "</section>";
    },

    mount: function (root) {
      var wallEl = K.$("[data-lwall]", root);
      var items = K.$$(".lwall__item", wallEl);

      // Slow staggered fade-in
      gsap.fromTo(items, { opacity: 0, y: K.flags.reduced ? 0 : 20 }, {
        opacity: 1, y: 0, duration: 1.4, stagger: 0.12,
        scrollTrigger: { trigger: wallEl, start: "top 85%", once: true }
      });
      // Hover dims the rest
      items.forEach(function (it) {
        K.listen(it, "mouseenter", function () { wallEl.classList.add("is-hovering"); it.classList.add("is-hover"); });
        K.listen(it, "mouseleave", function () { wallEl.classList.remove("is-hovering"); it.classList.remove("is-hover"); });
      });

      var hs = K.$("[data-hscroll]", root);
      var viewport = K.$(".hscroll__viewport", hs);
      var track = K.$(".hscroll__track", hs);

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
