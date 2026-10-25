/*
  sections/intro.js — Home section 03, "That's where Krasis comes in."
  The sentence reveals by line, then "Krasis" (accent serif) scales up slightly with a soft glow.
  Specialism rows shift right and show a "+" on hover (CSS).
  Depends on: GSAP, ScrollTrigger, utils.js, ui.js, data/copy.js.
*/
(function (K) {
  K.sections = K.sections || {};

  K.sections.intro = {
    render: function () {
      var c = K.copy.intro;
      var rows = c.services.map(function (s) {
        return '<li class="srow">' +
          '<span class="srow__n label">' + s.n + "</span>" +
          '<h3 class="srow__title h3">' + K.esc(s.title) + "</h3>" +
          '<p class="srow__text mute">' + K.esc(s.text) + "</p>" +
          '<span class="srow__plus plus" aria-hidden="true"></span>' +
          "</li>";
      }).join("");
      return '<section class="section intro" aria-labelledby="intro-title">' +
        K.ui.rule() +
        '<div class="glow intro__glow" aria-hidden="true"></div>' +
        '<div class="container grid">' +
        '<h2 class="h1 c-1-9 intro__title" id="intro-title" data-anim="lines">That\'s where <em class="serif intro__em">Krasis</em> comes in.</h2>' +
        '<p class="body c-6-12 mt-l" data-anim="fade">' + K.esc(c.body) + "</p>" +
        '<p class="label c-1-6 mt-xl" data-anim="fade">' + K.esc(c.listLabel) + "</p>" +
        '<ul class="srows mt-s" data-anim="stagger">' + rows + "</ul>" +
        '<p class="lead c-2-10 mt-xl" data-anim="lines">' + K.esc(c.closing) + "</p>" +
        "</div>" +
        K.ui.counter(3) +
        "</section>";
    },
    mount: function (root) {
      var em = K.$(".intro__em", root);
      if (!em || K.flags.reduced) return;
      gsap.set(em, { display: "inline-block", transformOrigin: "50% 70%" });
      gsap.fromTo(em, { scale: 1, textShadow: "0 0 0px rgba(236,235,230,0)" }, {
        scale: 1.06,
        textShadow: "0 0 42px rgba(236,235,230,0.28)",
        duration: 1.4,
        delay: 0.8,
        ease: "kOut",
        scrollTrigger: { trigger: em, start: "top 85%", once: true }
      });
    }
  };
})(window.KRASIS);
