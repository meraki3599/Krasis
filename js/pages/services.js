/*
  pages/services.js — Services (/services/): the four specialisms as full-height chapters
  (counter, hairline, what it means in practice, tools), then a CTA.
  Depends on: utils.js, ui.js, data/copy.js.
*/
(function (K) {
  K.pages = K.pages || {};

  // Short, practical expansions of the four specialisms (headings and one-liners come from copy.js)
  var chapters = [
    {
      lead: "Every site starts from a blank canvas and your brand, never a theme.",
      practice: ["Art direction shaped around your brand", "Layouts, type and colour designed in Figma", "Hand-written front-end, no page builders", "Content structure that guides people to act"]
    },
    {
      lead: "Motion with a reason: it leads the eye, tells the story and makes the site feel alive.",
      practice: ["Scroll-driven storytelling and pinned sequences", "Text and image reveals choreographed to scroll", "WebGL and canvas moments where they earn it", "Smooth scrolling tuned to feel effortless"]
    },
    {
      lead: "Designed for the phone in your hand as carefully as the screen on your desk.",
      practice: ["Layouts crafted for mobile, tablet and desktop", "Touch-friendly navigation and tap targets", "Fast loading and optimised media", "Accessible, semantic, standards-based markup"]
    },
    {
      lead: "One team from the first call to launch day, and still here after.",
      practice: ["Discovery, proposal and clear pricing", "Design, development, review and revisions", "Launch support, we're with you on go-live day", "Files, access and full ownership handed over"]
    }
  ];
  var tools = ["GSAP", "WebGL", "Figma", "Modern web standards"];

  K.pages.services = {
    render: function () {
      var c = K.copy.intro.services;
      var html = '<section class="page-hero section" aria-labelledby="services-h1">' + K.ui.rule() +
        '<div class="container grid">' +
        '<h1 class="display page-hero__title c-1-9" id="services-h1" data-anim="lines" data-manual>Services</h1>' +
        '<p class="lead c-6-12 mt-m" data-anim="fade">Four things, done properly. Every one of them built around your brand.</p>' +
        "</div></section>";

      html += c.map(function (s, i) {
        var ch = chapters[i];
        return '<section class="chapter" aria-labelledby="svc-' + i + '">' +
          K.ui.rule() + K.ui.plus("plus--tr") +
          '<div class="container grid">' +
          '<p class="label c-1-5">' + s.n + "</p>" +
          '<h2 class="h2 c-1-9 mt-s" id="svc-' + i + '" data-anim="lines">' + K.esc(s.title) + "</h2>" +
          '<p class="lead c-2-10 mt-m" data-anim="fade">' + K.esc(s.text.charAt(0).toUpperCase() + s.text.slice(1)) + ". " + K.esc(ch.lead) + "</p>" +
          '<div class="c-6-12 mt-l"><p class="label">In practice</p>' +
          '<ul class="practice mt-s" data-anim="stagger">' + ch.practice.map(function (p) { return "<li>" + K.ui.star() + "<span>" + K.esc(p) + "</span></li>"; }).join("") + "</ul></div>" +
          "</div>" +
          K.ui.counter(i + 1, 4) +
          "</section>";
      }).join("");

      html += '<section class="section tools" aria-labelledby="tools-h">' +
        '<div class="container grid">' +
        '<h2 class="label c-1-5" id="tools-h">Tools we build with</h2>' +
        '<ul class="tools__list c-1-12 mt-s" data-anim="stagger">' + tools.map(function (t) { return '<li class="h2">' + K.esc(t) + "</li>"; }).join("") + "</ul>" +
        '<div class="c-1-9 mt-xl" data-anim="fade">' + K.ui.btn("Start a project", K.link("contact"), { cls: "btn--lg" }) + "</div>" +
        "</div></section>";
      return html;
    },
    mount: function () {},
    intro: function (root) { K.reveal.play(K.$(".page-hero__title", root)); }
  };
})(window.KRASIS);
