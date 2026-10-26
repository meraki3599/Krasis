/*
  pages/case.js — case study template (#/work/<slug>): title hero with a scroll-driven logo panel
  (the supplied client logo), meta row, brief, approach, details strip and a big next-project link.
  All content comes from data/projects.js; placeholder fields show a dashed "Replace" tag.
  Depends on: GSAP, ScrollTrigger, utils.js, ui.js, data/projects.js.
*/
(function (K) {
  K.pages = K.pages || {};

  K.pages.case = {
    title: function (params) { var p = K.projectBySlug(params.slug); return (p ? p.fullName : "Case study") + " | Krasis"; },
    description: function (params) { var p = K.projectBySlug(params.slug); return p ? p.fullName + ": " + K.txt(p.type) + " designed and built by Krasis." : ""; },
    exists: function (params) { return !!K.projectBySlug(params.slug); },

    render: function (params) {
      var p = K.projectBySlug(params.slug);
      var idx = K.projects.indexOf(p);
      var next = K.projects[(idx + 1) % K.projects.length];
      var meta = [
        ["Client", K.esc(p.fullName)],
        ["Services", K.esc(p.services.join(", "))],
        ["Year", K.phText(p.year)],
        ["Timeline", K.phText(p.timeline)]
      ].map(function (m) { return '<div class="cs-meta__item"><dt class="label">' + m[0] + "</dt><dd>" + m[1] + "</dd></div>"; }).join("");

      return '<section class="cs-hero" aria-labelledby="cs-title">' +
        K.ui.rule() +
        '<div class="container">' +
        '<p class="label cs-hero__kicker" data-anim="fade">' + K.esc(p.category) + " · " + K.phText(p.type) + "</p>" +
        '<h1 class="display cs-hero__title" id="cs-title" data-anim="lines" data-manual>' + K.esc(p.fullName) + "</h1>" +
        "</div>" +
        '<div class="cs-device container"><div class="cs-device__panel" data-cs-device>' + K.ui.logo(p.logo, p.fullName + " logo", { filter: p.logoFilter }) + "</div></div>" +
        "</section>" +

        '<section class="section cs-body">' +
        '<div class="container">' +
        '<dl class="cs-meta" data-anim="stagger">' + meta + "</dl>" +
        '<div class="grid mt-xl">' +
        '<h2 class="label c-1-5">The brief</h2>' +
        '<p class="lead c-5-11" data-anim="fade">' + K.phText(p.brief) + "</p>" +
        "</div>" +
        "</div>" +
        '<div class="container grid mt-xl">' +
        '<h2 class="label c-1-5">The approach</h2>' +
        '<p class="lead c-5-11" data-anim="fade">' + K.phText(p.approach) + "</p>" +
        "</div>" +
        '<div class="container mt-xl"><h2 class="label">Details</h2>' +
        '<ul class="cs-details mt-s" data-anim="stagger">' +
        p.details.map(function (d, i) { return '<li><span class="label">' + K.pad(i + 1) + '</span><p class="h3">' + K.phText(d) + "</p></li>"; }).join("") +
        "</ul></div>" +
        "</section>" +

        '<section class="cs-next">' +
        '<a class="cs-next__link container" href="#/work/' + next.slug + '" data-cursor="Next">' +
        '<span class="label">Next project</span>' +
        '<span class="cs-next__name display">' + K.esc(next.fullName) + "</span>" +
        "</a></section>";
    },

    mount: function (root) {
      var device = K.$("[data-cs-device]", root);
      K.media(K.MQ_MOTION, function () {
        gsap.fromTo(device, { rotateX: 18, scale: 0.86, yPercent: 6, transformPerspective: 1400, transformOrigin: "50% 0%" }, {
          rotateX: 0, scale: 1, yPercent: 0, ease: "none",
          scrollTrigger: { trigger: device, start: "top 95%", end: "top 25%", scrub: 0.6 }
        });
      });
    },
    intro: function (root) { K.reveal.play(K.$(".cs-hero__title", root)); }
  };
})(window.KRASIS);
