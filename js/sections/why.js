/*
  sections/why.js — Home section 09, "Why not just use Wix? Or hire a big agency?"
  The two contrast columns dim out (scrubbed) as the Krasis pivot arrives; four principles then reveal one at a time.
  The outlined-squares cluster drifts behind as ambient texture.
  Depends on: GSAP, ScrollTrigger, utils.js, ui.js, squares.js, data/copy.js.
*/
(function (K) {
  K.sections = K.sections || {};

  K.sections.why = {
    render: function () {
      var c = K.copy.why;
      return '<section class="section why" aria-labelledby="why-title">' +
        K.ui.rule() +
        '<div class="why__squares" aria-hidden="true"></div>' +
        '<div class="container grid">' +
        '<h2 class="h2 c-1-9" id="why-title" data-anim="lines">' + K.brk(c.title) + "</h2>" +
        '<p class="lead c-1-7 mt-m" data-anim="fade">' + K.esc(c.opening) + "</p>" +
        '<div class="why__contrasts c-1-12 mt-l">' +
        c.contrasts.map(function (t) { return '<p class="body why__contrast" data-anim="fade">' + K.esc(t) + "</p>"; }).join("") +
        "</div>" +
        '<p class="why__pivot h3 c-2-10 mt-xl" data-anim="lines">' + K.esc(c.pivot) + "</p>" +
        '<ol class="why__principles c-2-12 mt-l">' +
        c.principles.map(function (t, i) {
          return '<li class="why__principle"><span class="label">' + K.pad(i + 1) + '</span><p class="h3" data-anim="lines">' + K.esc(t) + "</p></li>";
        }).join("") +
        "</ol>" +
        "</div>" +
        K.ui.counter(9) +
        "</section>";
    },
    mount: function (root) {
      var section = K.$(".why", root);
      if (!section) return;
      var s = K.squares.mount(K.$(".why__squares", section), { count: 22, cx: 0.78, cy: 0.42, spread: 0.36 });
      K.onLeave(s.destroy);

      if (K.flags.reduced) return;
      gsap.to(K.$$(".why__contrast", section), {
        opacity: 0.28, ease: "none",
        scrollTrigger: { trigger: K.$(".why__pivot", section), start: "top 90%", end: "top 45%", scrub: true }
      });
      K.$$(".why__principle", section).forEach(function (li) {
        gsap.fromTo(K.$(".label", li), { opacity: 0 }, { opacity: 1, duration: 1, scrollTrigger: { trigger: li, start: "top 85%", once: true } });
      });
    }
  };
})(window.KRASIS);
