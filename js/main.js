/*
  main.js — boot. Runs last: placeholder tag toggle, analytics placeholder, global systems, then the router.
  Depends on: every other script (see the ordered list in index.html).
*/
(function (K) {
  function analytics() {
    var a = K.config.analytics || {};
    if (a.provider === "plausible" && a.plausibleDomain) {
      var s = document.createElement("script");
      s.defer = true;
      s.setAttribute("data-domain", a.plausibleDomain);
      s.src = "https://plausible.io/js/script.hash.js"; // hash-based routing build
      document.head.appendChild(s);
    } else if (a.provider === "ga" && a.gaId) {
      var g = document.createElement("script");
      g.async = true;
      g.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(a.gaId);
      document.head.appendChild(g);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", a.gaId);
      K.on("route", function (r) { window.gtag("event", "page_view", { page_path: r.path }); });
    }
  }

  function boot() {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!K.config.showPlaceholderTags) document.documentElement.classList.add("hide-ph");
    K.scroll.init();
    K.cursor.init();
    K.nav.init();
    analytics();
    // Wait for fonts so line measurement in the split-text reveals is accurate
    var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    var started = false;
    function start() { if (started) return; started = true; K.router.init(); }
    ready.then(start);
    setTimeout(start, 1500); // never block on a slow font
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window.KRASIS);
