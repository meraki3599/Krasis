/*
  pages/notfound.js — 404 view for any unknown #/route: giant "404" over glitching, breathing grid lines.
  Depends on: utils.js, ui.js, grid-lines.js, data/copy.js.
*/
(function (K) {
  K.pages = K.pages || {};

  K.pages.notfound = {
    title: "Page not found | Krasis",
    description: "This page doesn't exist. Your next website should.",
    render: function () {
      return '<section class="nf" aria-labelledby="nf-h1">' +
        '<div class="nf__grid" aria-hidden="true"></div>' +
        '<div class="container nf__inner">' +
        K.ui.plus("plus--accent plus--tr") +
        '<h1 class="nf__code" id="nf-h1" data-anim="lines" data-manual data-label="404, page not found">404</h1>' +
        '<p class="h3 nf__line" data-anim="fade">' + K.esc(K.copy.notFound) + "</p>" +
        '<div class="mt-m" data-anim="fade">' + K.ui.btn("Back home", "#/") + "</div>" +
        '<div class="nf__mark">' + K.ui.krasis("", { alt: "Krasis" }) + "</div>" +
        "</div></section>";
    },
    mount: function (root) {
      var g = K.gridLines.mount(K.$(".nf__grid", root), { mode: "glitch", progress: 0.6 });
      K.onLeave(g.destroy);
    },
    intro: function (root) { K.reveal.play(K.$(".nf__code", root)); }
  };
})(window.KRASIS);
