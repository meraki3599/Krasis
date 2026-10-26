/*
  router.js — hash router (#/, #/work, #/services, #/process, #/pricing, #/about, #/contact).
  Every change runs the page transition: panel slides up over the page (350ms), the old view's
  ScrollTriggers/listeners are destroyed, the new view renders + mounts, scroll resets, panel slides away (350ms).
  Hashes that don't start with "#/" (e.g. the skip link) are ignored. Unknown routes render the 404 view.
  Depends on: GSAP, utils.js, reveal.js, ui.js, nav.js, smooth-scroll.js, pages/*.
*/
(function (K) {
  var viewEl, panel, busy = false, pending = null, first = true;

  function parse() {
    var raw = (location.hash || "#/").slice(1);
    if (raw.charAt(0) !== "/") return null;
    var q = {};
    var parts = raw.split("?");
    (parts[1] || "").split("&").forEach(function (kv) {
      if (!kv) return;
      var p = kv.split("=");
      q[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || "");
    });
    var path = parts[0].replace(/\/+$/, "") || "/";
    var seg = path.split("/").filter(Boolean);
    var page = "notfound", params = {};
    if (!seg.length) page = "home";
    else if (seg.length === 1 && ["work", "services", "process", "pricing", "about", "contact"].indexOf(seg[0]) > -1) page = seg[0];
    return { path: path, page: page, params: params, query: q };
  }

  function setMeta(page, route) {
    var title = typeof page.title === "function" ? page.title(route.params) : page.title;
    var desc = typeof page.description === "function" ? page.description(route.params) : page.description;
    document.title = title;
    var m = document.querySelector('meta[name="description"]');
    if (m && desc) m.setAttribute("content", desc);
    var og = document.querySelector('meta[property="og:title"]');
    if (og) og.setAttribute("content", title);
  }

  function swap(route) {
    var page = K.pages[route.page];
    K.destroyViewScope(K.view);
    viewEl.innerHTML = page.render(route.params, route.query) + K.ui.footer(!!page.compactFooter);
    K.scroll.top();
    setMeta(page, route);
    K.view = K.createViewScope(viewEl);
    K.add(function () {
      page.mount(viewEl, route.params, route.query);
      K.reveal.scan(viewEl);
      mountFooter();
    });
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    K.emit("route", route);
    // Refresh again once images in the new view have sized themselves
    K.$$("img", viewEl).forEach(function (img) {
      if (!img.complete) img.addEventListener("load", function () { ScrollTrigger.refresh(); }, { once: true });
    });
    return page;
  }

  function mountFooter() {
    var mark = K.$("[data-footer-mark]", viewEl);
    if (!mark || K.flags.reduced) return;
    gsap.fromTo(mark, { yPercent: 30, opacity: 0 }, {
      yPercent: 0, opacity: 1, duration: 1.4,
      scrollTrigger: { trigger: mark, start: "top 95%", once: true }
    });
  }

  function focusView() {
    if (first) return;
    viewEl.focus({ preventScroll: true });
  }

  function go() {
    var route = parse();
    if (!route) return;
    if (busy) { pending = route; return; }
    busy = true;

    if (first) {
      // Initial load: preloader (first visit) or straight in
      var page = swap(route);
      K.preloader.run(function () {
        document.body.classList.remove("is-loading");
        ScrollTrigger.refresh();
        if (page.intro) page.intro(viewEl);
        first = false;
        done();
      });
      return;
    }

    var reduced = K.flags.reduced;
    gsap.timeline({ onComplete: done })
      .set(panel, { y: 0, yPercent: 100 })
      .to(panel, { yPercent: 0, duration: reduced ? 0.01 : 0.35, ease: "kInOut" })
      .add(function () { route._page = swap(route); focusView(); })
      .to(panel, { yPercent: -100, duration: reduced ? 0.01 : 0.35, ease: "kInOut" })
      .add(function () { if (route._page.intro) route._page.intro(viewEl); }, reduced ? ">" : "-=0.15");
  }

  function done() {
    busy = false;
    // A link clicked mid-transition: run once more for the latest hash
    if (pending) { pending = null; go(); }
  }

  function init() {
    viewEl = document.getElementById("view");
    panel = document.getElementById("transition");
    // Hand the panel's off-screen position to GSAP (percent-based, so it survives resizes)
    gsap.set(panel, { y: 0, yPercent: 100 });
    window.addEventListener("hashchange", go);
    // Skip link: focus the content without touching the hash
    var skip = K.$("[data-skip]");
    skip.addEventListener("click", function (e) { e.preventDefault(); viewEl.focus(); });
    if (!location.hash || location.hash === "#") history.replaceState(null, "", "#/");
    go();
  }

  K.router = { init: init };
})(window.KRASIS);
