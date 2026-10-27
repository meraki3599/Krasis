/*
  sections/cta.js — Home section 10, final call to action and visual bookend.
  Perspective grid lines diverge outward (scrubbed) behind the huge supplied logo and the closing line.
  Depends on: GSAP, ScrollTrigger, utils.js, ui.js, grid-lines.js, data/copy.js.
*/
(function (K) {
  K.sections = K.sections || {};

  K.sections.cta = {
    render: function () {
      return '<section class="section cta" aria-labelledby="cta-title">' +
        '<div class="cta__grid" aria-hidden="true"></div>' +
        '<div class="container cta__inner">' +
        K.ui.plus("plus--tl") + K.ui.plus("plus--accent plus--tr") +
        '<div class="cta__mark" data-anim="fade">' + K.ui.krasis("", { lazy: true }) + "</div>" +
        '<h2 class="h2 cta__title mt-l" id="cta-title" data-anim="lines">' + K.esc(K.copy.cta.title) + "</h2>" +
        '<div class="cta__links mt-m" data-anim="fade">' + K.ui.contactLinks() + "</div>" +
        '<div class="mt-l" data-anim="fade">' + K.ui.btn("Start a project", K.link("contact"), { cls: "btn--lg" }) + "</div>" +
        "</div>" +
        K.ui.counter(10) +
        "</section>";
    },
    mount: function (root) {
      var section = K.$(".cta", root);
      if (!section) return;
      var g = K.gridLines.mount(K.$(".cta__grid", section), { progress: K.flags.reduced ? 1 : 0.05 });
      K.onLeave(g.destroy);
      if (K.flags.reduced) return;
      var state = { p: 0.05 };
      gsap.to(state, {
        p: 1, ease: "none",
        onUpdate: function () { g.setProgress(state.p); },
        scrollTrigger: { trigger: section, start: "top 90%", end: "center center", scrub: 0.6 }
      });
    }
  };
})(window.KRASIS);
