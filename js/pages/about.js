/*
  pages/about.js — About (#/about): Overview, Our Mission, the Home Vision/Mission (stacked),
  "Who you'll work with", and the outlined-squares cluster as ambient visual.
  Depends on: utils.js, ui.js, squares.js, sections/vision.js, data/copy.js.
*/
(function (K) {
  K.pages = K.pages || {};

  K.pages.about = {
    title: "About | Krasis",
    description: "Krasis is a premium web design and development studio in Pune, India, crafting bespoke, high-performance websites.",
    render: function () {
      var a = K.copy.about;
      return '<section class="page-hero section about-hero" aria-labelledby="about-h1">' +
        K.ui.rule() +
        '<div class="about__squares" aria-hidden="true"></div>' +
        '<div class="container grid">' +
        '<h1 class="display page-hero__title c-1-9" id="about-h1" data-anim="lines" data-manual>About</h1>' +
        '<h2 class="label c-1-5 mt-xl">Overview</h2>' +
        '<p class="lead c-5-11 mt-s" data-anim="fade">' + K.esc(a.overview) + "</p>" +
        "</div></section>" +

        '<section class="section" aria-labelledby="about-mission">' + K.ui.rule() +
        '<div class="container grid">' +
        '<h2 class="h2 c-1-9" id="about-mission" data-anim="lines">Our Mission</h2>' +
        '<p class="body c-6-12 mt-m" data-anim="fade">' + K.esc(a.mission) + "</p>" +
        "</div></section>" +

        K.sections.vision.render({ static: true, counter: false }) +

        '<section class="section team" aria-labelledby="team-h">' + K.ui.rule() +
        '<div class="container grid">' +
        '<h2 class="h2 c-1-9" id="team-h" data-anim="lines">Who you\'ll work with</h2>' +
        '<p class="lead c-6-12 mt-m" data-anim="fade">You work directly with the people building your site. No account managers, no middlemen.</p>' +
        "</div></section>";
    },
    mount: function (root) {
      var s = K.squares.mount(K.$(".about__squares", root), { count: 30, cx: 0.84, cy: 0.26, spread: 0.3 });
      K.onLeave(s.destroy);
      K.sections.vision.mount(root);
    },
    intro: function (root) { K.reveal.play(K.$(".page-hero__title", root)); }
  };
})(window.KRASIS);
