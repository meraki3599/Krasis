/*
  sections/pricing.js — Home section 08, "Transparent pricing. No surprises."
  Two panels from ui.plans() (full feature lists, counting prices, accent dots on Premium extras).
  Depends on: GSAP, ScrollTrigger, utils.js, ui.js, data/copy.js.
*/
(function (K) {
  K.sections = K.sections || {};

  K.sections.pricing = {
    render: function () {
      return '<section class="section pricing" aria-labelledby="pricing-title">' +
        K.ui.rule() +
        '<div class="container">' +
        '<div class="grid"><h2 class="h2 c-1-9" id="pricing-title" data-anim="lines">' + K.brk(K.copy.pricing.title) + "</h2></div>" +
        '<div class="mt-l" data-plans>' + K.ui.plans() + "</div>" +
        "</div>" +
        K.ui.counter(8) +
        "</section>";
    },
    mount: function (root) {
      K.$$(".plan", root).forEach(function (plan, i) {
        gsap.fromTo(plan, { opacity: 0, y: K.flags.reduced ? 0 : 40 }, {
          opacity: 1, y: 0, duration: 1.3, delay: i * 0.12,
          scrollTrigger: { trigger: plan, start: "top 85%", once: true }
        });
      });
    }
  };
})(window.KRASIS);
