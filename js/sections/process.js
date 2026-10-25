/*
  sections/process.js — Home section 06, "Simple process. Zero guesswork."
  Desktop: headline sticks in the left column while six steps scroll past on the right; the step crossing
  the centre is active (full opacity, others 25%) and a vertical progress line fills with scroll.
  Mobile: an accordion list with the same hairlines (one step open at a time).
  Depends on: GSAP, ScrollTrigger, utils.js, ui.js, data/copy.js.
*/
(function (K) {
  K.sections = K.sections || {};

  K.sections.process = {
    render: function () {
      var c = K.copy.process;
      var steps = c.steps.map(function (s, i) {
        return '<li class="pstep' + (i === 0 ? " is-active is-open" : "") + '">' +
          '<button class="pstep__head" type="button" aria-expanded="' + (i === 0) + '" aria-controls="pstep-' + i + '">' +
          '<span class="pstep__n">' + s.n + "</span>" +
          '<span class="pstep__title h3">' + K.esc(s.title) + "</span>" +
          '<span class="pstep__toggle" aria-hidden="true"></span>' +
          "</button>" +
          '<div class="pstep__body" id="pstep-' + i + '"><p class="body">' + K.esc(s.text) + "</p></div>" +
          "</li>";
      }).join("");
      return '<section class="section process" aria-labelledby="process-title">' +
        K.ui.rule() +
        '<div class="container grid process__grid">' +
        '<div class="c-1-5 process__aside"><h2 class="h2 process__title" id="process-title" data-anim="lines">' + K.esc(c.title) + "</h2></div>" +
        '<div class="c-6-12 process__list-wrap">' +
        '<span class="process__track" aria-hidden="true"><span class="process__fill"></span></span>' +
        '<ol class="process__list">' + steps + "</ol>" +
        "</div></div>" +
        K.ui.counter(6) +
        "</section>";
    },

    mount: function (root) {
      var section = K.$(".process", root);
      if (!section) return;
      var steps = K.$$(".pstep", section);
      var list = K.$(".process__list", section);

      function setActive(i) { steps.forEach(function (s, k) { s.classList.toggle("is-active", k === i); }); }

      K.media("(min-width: 768px)", function () {
        section.classList.add("is-desktop");
        // Every step is visible on desktop, so the heads report expanded
        steps.forEach(function (s) { K.$(".pstep__head", s).setAttribute("aria-expanded", "true"); });
        steps.forEach(function (s, i) {
          ScrollTrigger.create({
            trigger: s, start: "top 55%", end: "bottom 55%",
            onToggle: function (self) { if (self.isActive) setActive(i); }
          });
        });
        if (!K.flags.reduced) {
          gsap.fromTo(K.$(".process__fill", section), { scaleY: 0 }, {
            scaleY: 1, ease: "none",
            scrollTrigger: { trigger: list, start: "top 55%", end: "bottom 55%", scrub: true }
          });
        }
        return function () {
          section.classList.remove("is-desktop");
          steps.forEach(function (s) { K.$(".pstep__head", s).setAttribute("aria-expanded", String(s.classList.contains("is-open"))); });
        };
      });

      // Accordion behaviour (only meaningful on mobile; desktop CSS shows every body)
      steps.forEach(function (s) {
        var head = K.$(".pstep__head", s);
        K.listen(head, "click", function () {
          if (section.classList.contains("is-desktop")) return;
          var open = !s.classList.contains("is-open");
          steps.forEach(function (o) {
            o.classList.remove("is-open");
            K.$(".pstep__head", o).setAttribute("aria-expanded", "false");
          });
          if (open) { s.classList.add("is-open"); head.setAttribute("aria-expanded", "true"); }
          ScrollTrigger.refresh();
        });
      });
    }
  };
})(window.KRASIS);
