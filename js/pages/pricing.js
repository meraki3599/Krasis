/*
  pages/pricing.js — Pricing (#/pricing): the two plan panels (larger) and a plan comparison table
  (SVG star = included, thin dash = not included), the single footnote and a closing CTA.
  Depends on: GSAP, utils.js, ui.js, data/copy.js.
*/
(function (K) {
  K.pages = K.pages || {};

  K.pages.pricing = {
    title: "Pricing | Krasis",
    description: "Transparent pricing. Standard ₹20,000 or Premium ₹25,000 for a fully custom website from Krasis.",
    render: function () {
      var c = K.copy.pricing;
      var std = c.plans[0], pre = c.plans[1];
      var yes = K.ui.star() + '<span class="sr-only">Included</span>';
      var no = '<span class="dash" aria-hidden="true"></span><span class="sr-only">Not included</span>';
      var rows = pre.features.map(function (f) { return [f, true, true]; })
        .concat(pre.extras.map(function (f) { return [f, false, true]; }))
        .map(function (r) {
          return '<tr><th scope="row">' + K.esc(r[0]) + "</th><td>" + (r[1] ? yes : no) + "</td><td>" + (r[2] ? yes : no) + "</td></tr>";
        }).join("");

      return '<section class="page-hero section" aria-labelledby="pricing-h1">' + K.ui.rule() +
        '<div class="container grid">' +
        '<h1 class="display page-hero__title c-1-12" id="pricing-h1" data-anim="lines" data-manual>' + K.brk(c.title) + "</h1>" +
        "</div>" +
        '<div class="container mt-xl plans--lg" data-plans>' + K.ui.plans({ idSuffix: "-p" }) + "</div>" +
        "</section>" +
        '<section class="section compare" aria-labelledby="compare-h">' +
        '<div class="container">' +
        '<h2 class="h2" id="compare-h" data-anim="lines">Compare plans</h2>' +
        '<div class="compare__wrap mt-l" data-anim="fade"><table class="compare__table">' +
        '<caption class="sr-only">Benefits and features in the Standard and Premium plans</caption>' +
        '<thead><tr><th scope="col" class="label">Benefits and features</th><th scope="col" class="label">' + std.name + '</th><th scope="col" class="label">' + pre.name + "</th></tr></thead>" +
        "<tbody>" + rows + "</tbody>" +
        '<tfoot><tr><th scope="row">Price</th><td>₹' + K.inr(std.price) + "/-*</td><td>₹" + K.inr(pre.price) + "/-*</td></tr></tfoot>" +
        "</table></div>" +
        '<p class="footnote">' + K.esc(c.footnote) + "</p>" +
        '<div class="mt-l grid"><p class="h3 c-1-7" data-anim="lines">Pick a plan, or tell us what you need and we\'ll point you to the right one.</p>' +
        '<div class="c-1-7 mt-m" data-anim="fade">' + K.ui.btn("Start a project", "#/contact", { cls: "btn--lg" }) + "</div></div>" +
        "</div></section>";
    },
    mount: function (root) {
      K.$$(".plan", root).forEach(function (plan, i) {
        gsap.fromTo(plan, { opacity: 0, y: K.flags.reduced ? 0 : 40 }, {
          opacity: 1, y: 0, duration: 1.3, delay: 0.3 + i * 0.12,
          scrollTrigger: { trigger: plan, start: "top 92%", once: true }
        });
      });
    },
    intro: function (root) { K.reveal.play(K.$(".page-hero__title", root)); }
  };
})(window.KRASIS);
