/*
  pages/work.js — Work index (#/work): giant title, category filters, editorial list rows with a floating
  preview that follows the cursor (fine pointers only). Rows open the case study (#/work/<slug>).
  Depends on: GSAP, utils.js, ui.js, data/projects.js.
*/
(function (K) {
  K.pages = K.pages || {};
  var FILTERS = ["All", "Hospitality", "Retail", "Creative", "E-commerce"];

  // Floating preview shows the supplied client logo
  function preview(p) {
    return '<div class="wpreview__logo">' + K.ui.logo(p.logo, "", { filter: p.logoFilter }) + "</div>";
  }

  K.pages.work = {
    title: "Work | Krasis",
    description: "Selected websites by Krasis: cinematic hospitality sites for 1BHK, 2BHK and Ballr, plus retail and brand builds.",
    render: function () {
      var filters = FILTERS.map(function (f, i) {
        return '<li><button type="button" class="filter label' + (i === 0 ? " is-active" : "") + '" data-filter="' + f + '" aria-pressed="' + (i === 0) + '">' + f + "</button></li>";
      }).join("");
      var rows = K.projects.map(function (p, i) {
        return '<li class="wrow" data-cat="' + K.esc(p.category) + '" data-slug="' + p.slug + '">' +
          '<a class="wrow__link" href="#/work/' + p.slug + '" data-cursor="View">' +
          '<span class="wrow__n label">' + K.pad(i + 1) + "</span>" +
          '<span class="wrow__name">' + K.esc(p.fullName) + "</span>" +
          '<span class="wrow__cat label">' + K.esc(p.category) + "</span>" +
          '<span class="wrow__year label">' + K.phText(p.year) + "</span>" +
          "</a></li>";
      }).join("");
      return '<section class="page-hero section" aria-labelledby="work-h1">' +
        K.ui.rule() +
        '<div class="container">' +
        '<h1 class="display page-hero__title" id="work-h1" data-anim="lines" data-manual>Work</h1>' +
        '<ul class="filters mt-l" aria-label="Filter projects by category">' + filters + "</ul>" +
        '<ul class="wlist mt-m">' + rows + "</ul>" +
        '<p class="wlist__empty body mute" hidden>No projects in this category yet.</p>' +
        "</div>" +
        '<div class="wpreview" aria-hidden="true"></div>' +
        "</section>";
    },
    mount: function (root) {
      var rows = K.$$(".wrow", root);
      var empty = K.$(".wlist__empty", root);
      K.$$(".filter", root).forEach(function (btn) {
        K.listen(btn, "click", function () {
          var f = btn.getAttribute("data-filter");
          K.$$(".filter", root).forEach(function (b) {
            b.classList.toggle("is-active", b === btn);
            b.setAttribute("aria-pressed", String(b === btn));
          });
          var shown = rows.filter(function (r) {
            var on = f === "All" || r.getAttribute("data-cat") === f;
            r.hidden = !on;
            return on;
          });
          empty.hidden = shown.length > 0;
          gsap.fromTo(shown, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.05 });
          ScrollTrigger.refresh();
        });
      });

      gsap.fromTo(rows, { opacity: 0, y: K.flags.reduced ? 0 : 24 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.07, delay: 0.3 });

      // Floating preview following the cursor
      if (!K.flags.finePointer) return;
      var pv = K.$(".wpreview", root);
      var xTo = gsap.quickTo(pv, "x", { duration: 0.6, ease: "power3.out" });
      var yTo = gsap.quickTo(pv, "y", { duration: 0.6, ease: "power3.out" });
      var list = K.$(".wlist", root);
      K.listen(window, "mousemove", function (e) { xTo(e.clientX); yTo(e.clientY); });
      rows.forEach(function (r) {
        K.listen(r, "mouseenter", function () {
          pv.innerHTML = preview(K.projectBySlug(r.getAttribute("data-slug")));
          list.classList.add("is-hovering");
          r.classList.add("is-hover");
          gsap.to(pv, { opacity: 1, scale: 1, duration: 0.6, overwrite: "auto" });
        });
        K.listen(r, "mouseleave", function () {
          list.classList.remove("is-hovering");
          r.classList.remove("is-hover");
          gsap.to(pv, { opacity: 0, scale: 0.9, duration: 0.5, overwrite: "auto" });
        });
      });
    },
    intro: function (root) { K.reveal.play(K.$(".page-hero__title", root)); }
  };
})(window.KRASIS);
