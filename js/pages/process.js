/*
  pages/process.js — Process (/process/): the six steps as a long storytelling page.
  Desktop: a sticky visual (giant outlined numeral + a progress ring that fills across all six steps)
  swaps as each full-height step passes the centre. Mobile: numerals sit inline above each step.
  Depends on: GSAP, ScrollTrigger, utils.js, ui.js, data/copy.js.
*/
(function (K) {
  K.pages = K.pages || {};
  var R = 46, C = 2 * Math.PI * R;

  K.pages.process = {
    render: function () {
      var c = K.copy.process;
      var nums = c.steps.map(function (s, i) {
        return '<span class="pv__num' + (i === 0 ? " is-active" : "") + '">' + s.n + "</span>";
      }).join("");
      var steps = c.steps.map(function (s, i) {
        return '<article class="pp-step" aria-labelledby="pp-' + i + '">' +
          '<span class="pp-step__num" aria-hidden="true">' + s.n + "</span>" +
          '<p class="label">Step ' + s.n + " / 06</p>" +
          '<h2 class="h2 mt-s" id="pp-' + i + '" data-anim="lines">' + K.esc(s.title) + "</h2>" +
          '<p class="lead mt-m" data-anim="fade">' + K.esc(s.text) + "</p>" +
          "</article>";
      }).join("");

      return '<section class="page-hero section" aria-labelledby="process-h1">' + K.ui.rule() +
        '<div class="container grid">' +
        '<h1 class="display page-hero__title c-1-12" id="process-h1" data-anim="lines" data-manual>' + K.brk(c.title) + "</h1>" +
        "</div></section>" +
        '<section class="pp" aria-label="The six steps">' +
        '<div class="container pp__grid">' +
        '<div class="pp__visual" aria-hidden="true"><div class="pv">' +
        '<svg class="pv__ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="' + R + '" class="pv__ring-bg"/><circle cx="50" cy="50" r="' + R + '" class="pv__ring-fill" style="stroke-dasharray:' + C + ";stroke-dashoffset:" + C + '"/></svg>' +
        '<div class="pv__nums">' + nums + "</div>" +
        K.ui.plus("pv__plus") +
        "</div></div>" +
        '<div class="pp__steps">' + steps + "</div>" +
        "</div></section>" +
        '<section class="section"><div class="container grid">' +
        '<p class="h2 c-1-9" data-anim="lines">Ready when you are.</p>' +
        '<div class="c-1-9 mt-m" data-anim="fade">' + K.ui.btn("Start with a conversation", K.link("contact"), { cls: "btn--lg" }) + "</div>" +
        "</div></section>";
    },
    mount: function (root) {
      var nums = K.$$(".pv__num", root);
      var steps = K.$$(".pp-step", root);
      var fill = K.$(".pv__ring-fill", root);
      K.media("(min-width: 1024px)", function () {
        steps.forEach(function (s, i) {
          ScrollTrigger.create({
            trigger: s, start: "top 50%", end: "bottom 50%",
            onToggle: function (self) {
              if (!self.isActive) return;
              nums.forEach(function (n, k) { n.classList.toggle("is-active", k === i); });
            }
          });
        });
        gsap.fromTo(fill, { strokeDashoffset: C }, {
          strokeDashoffset: 0, ease: "none",
          scrollTrigger: { trigger: K.$(".pp__steps", root), start: "top 50%", end: "bottom 50%", scrub: true }
        });
      });
    },
    intro: function (root) { K.reveal.play(K.$(".page-hero__title", root)); }
  };
})(window.KRASIS);
