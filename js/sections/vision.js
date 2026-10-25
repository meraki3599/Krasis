/*
  sections/vision.js — Home section 04, Vision → Mission.
  Desktop: the section pins for two viewport heights; Vision holds, Mission wipes up over it (clip-path),
  then the pull-quote reveals last. Mobile / reduced motion: the panels simply stack with once-only reveals.
  render(opts) is reused on the About page (opts.static skips the pin, opts.counter hides the counter).
  Depends on: GSAP, ScrollTrigger, utils.js, ui.js, data/copy.js.
*/
(function (K) {
  K.sections = K.sections || {};

  function panel(id, title, text) {
    return '<article class="vm__panel vm__panel--' + id + '" aria-labelledby="vm-' + id + '">' +
      '<h2 class="vm__title h1" id="vm-' + id + '">' + title + "</h2>" +
      '<p class="vm__text body">' + K.esc(text) + "</p>" +
      "</article>";
  }

  K.sections.vision = {
    render: function (opts) {
      opts = opts || {};
      var c = K.copy;
      return '<section class="vm' + (opts.static ? " vm--static" : "") + '" data-vm>' +
        '<div class="vm__inner container">' +
        K.ui.plus("plus--tl") + K.ui.plus("plus--tr") +
        '<div class="vm__panels">' +
        panel("vision", "Vision", c.vision) +
        panel("mission", "Mission", c.mission) +
        "</div>" +
        '<blockquote class="vm__quote serif"><p>' + K.esc(c.pullQuote) + "</p></blockquote>" +
        "</div>" +
        (opts.counter === false ? "" : K.ui.counter(4)) +
        "</section>";
    },

    mount: function (root) {
      var vm = K.$("[data-vm]", root);
      if (!vm) return;
      var vision = K.$(".vm__panel--vision", vm);
      var mission = K.$(".vm__panel--mission", vm);
      var quote = K.$(".vm__quote", vm);
      var isStatic = vm.classList.contains("vm--static");

      if (!isStatic) {
        K.media(K.MQ_MOTION, function () {
          vm.classList.add("is-pinned");
          var tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: vm, start: "top top", end: "+=200%", pin: true, scrub: 0.6, anticipatePin: 1 }
          });
          tl.fromTo(K.$$(".vm__title, .vm__text", vision), { yPercent: 20, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.12, stagger: 0.04 }, 0)
            .to({}, { duration: 0.18 })
            .fromTo(mission, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.35, ease: "power2.inOut" })
            .to(vision, { opacity: 0, yPercent: -6, duration: 0.3 }, "<")
            .fromTo(K.$$(".vm__title, .vm__text", mission), { yPercent: 14 }, { yPercent: 0, duration: 0.35 }, "<")
            .to(K.$(".vm__title", mission), { opacity: 0, yPercent: -30, duration: 0.15, ease: "power2.in" })
            .fromTo(quote, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, "-=0.05")
            .to({}, { duration: 0.1 });
          return function () { vm.classList.remove("is-pinned"); };
        });
      }

      // Stacked fallback (mobile, reduced motion, About page)
      K.media(isStatic ? "all" : K.MQ_STATIC, function () {
        [vision, mission, quote].forEach(function (el) {
          gsap.fromTo(el, { opacity: 0, y: K.flags.reduced ? 0 : 32 }, {
            opacity: 1, y: 0, duration: K.flags.reduced ? 0.6 : 1.2,
            scrollTrigger: { trigger: el, start: "top 85%", once: true }
          });
        });
      });
    }
  };
})(window.KRASIS);
