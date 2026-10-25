/*
  sections/problem.js — Home section 02, "The problem".
  Headline words scrub from 20% to 100% opacity; body arrives in three beats; final line set larger.
  All motion is declarative (data-anim, see reveal.js). Depends on: utils.js, ui.js, data/copy.js.
*/
(function (K) {
  K.sections = K.sections || {};

  K.sections.problem = {
    render: function () {
      var c = K.copy.problem;
      return '<section class="section problem" aria-labelledby="problem-title">' +
        K.ui.rule() +
        '<div class="container grid">' +
        '<h2 class="h2 c-1-9 problem__title" id="problem-title" data-anim="scrub-words">' + K.esc(c.title) + "</h2>" +
        '<div class="c-6-12 problem__body mt-l">' +
        c.body.map(function (p) { return '<p class="body" data-anim="fade">' + K.esc(p) + "</p>"; }).join("") +
        "</div>" +
        '<p class="c-2-10 problem__final h3 mt-xl" data-anim="lines">' + K.esc(c.final) + "</p>" +
        "</div>" +
        '<div class="dots problem__dots" aria-hidden="true"></div>' +
        K.ui.counter(2) +
        "</section>";
    },
    mount: function () {}
  };
})(window.KRASIS);
