/*
  sections/included.js — Home section 07, "Here's exactly what's included."
  Seven items, each with an SVG four-point star; the hairline under each draws and the text rises on scroll.
  Depends on: GSAP, ScrollTrigger, utils.js, ui.js, data/copy.js.
*/
(function (K) {
  K.sections = K.sections || {};

  K.sections.included = {
    render: function () {
      var c = K.copy.included;
      var items = c.items.map(function (t) {
        return '<li class="inc__item">' + K.ui.star() + '<span class="inc__text">' + K.esc(t) + '</span><span class="rule-x inc__rule" aria-hidden="true"></span></li>';
      }).join("");
      return '<section class="section included" aria-labelledby="inc-title">' +
        K.ui.rule() +
        '<div class="container grid">' +
        '<h2 class="h2 c-1-9" id="inc-title" data-anim="lines">' + K.esc(c.title) + "</h2>" +
        '<p class="body c-6-12 mt-m" data-anim="fade">' + K.esc(c.intro) + "</p>" +
        '<p class="label c-1-5 mt-l" data-anim="fade">' + K.esc(c.listLabel) + "</p>" +
        '<ul class="inc c-2-12 mt-s">' + items + "</ul>" +
        "</div>" +
        '<div class="dots included__dots" aria-hidden="true"></div>' +
        K.ui.counter(7) +
        "</section>";
    },
    mount: function (root) {
      K.$$(".inc__item", root).forEach(function (li) {
        var tl = gsap.timeline({ scrollTrigger: { trigger: li, start: "top 88%", once: true } });
        if (K.flags.reduced) { tl.fromTo(li, { opacity: 0 }, { opacity: 1, duration: 0.6 }); return; }
        tl.fromTo(K.$(".inc__rule", li), { scaleX: 0 }, { scaleX: 1, duration: 1.2 }, 0)
          .fromTo(K.$$(".star, .inc__text", li), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.06 }, 0.1);
      });
    }
  };
})(window.KRASIS);
