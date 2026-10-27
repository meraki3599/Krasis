/*
  router.js — page router. On a web server pages have real addresses (/, /work/, /services/, /process/,
  /pricing/, /about/, /contact/) driven by history.pushState; old #/about links are rewritten to /about/.
  Opened from disk (file://) it falls back to hash addresses (#/about) so index.html still double-clicks.
  Every change runs the page transition: panel slides up over the page (350ms), the old view's
  ScrollTriggers/listeners are destroyed, the new view renders + mounts, scroll resets, panel slides away (350ms).
  Hashes that don't start with "#/" (e.g. the skip link) are ignored. Unknown addresses render the 404 view.
  Depends on: GSAP, utils.js, reveal.js, ui.js, nav.js, smooth-scroll.js, pages/*.
*/
(function (K) {
  var viewEl, panel, busy = false, pending = null, first = true;
  var PAGES = ["work", "services", "process", "pricing", "about", "contact"];

  // The current address as "/about?plan=x" (path mode) or from "#/about?plan=x" (file mode)
  function current() {
    if (K.pathMode) return location.pathname.replace(/index\.html$/, "") + location.search;
    var raw = (location.hash || "#/").slice(1);
    return raw.charAt(0) === "/" ? raw : null;
  }

  function parse() {
    var raw = current();
    if (raw === null) return null;
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
    else if (seg.length === 1 && PAGES.indexOf(seg[0]) > -1) page = seg[0];
    return { path: path, page: page, params: params, query: q };
  }

  // Title, description, canonical and share tags from data/seo.js
  function setMeta(route) {
    var seo = K.seo[route.page] || K.seo.notfound;
    document.title = seo.title;
    function set(sel, attr, val) { var el = document.querySelector(sel); if (el) el.setAttribute(attr, val); }
    set('meta[name="description"]', "content", seo.description);
    set('meta[property="og:title"]', "content", seo.title);
    set('meta[property="og:description"]', "content", seo.description);
    if (seo.path !== null) {
      var url = K.config.siteUrl + "/" + (seo.path ? seo.path + "/" : "");
      set('link[rel="canonical"]', "href", url);
      set('meta[property="og:url"]', "content", url);
    }
  }

  function swap(route) {
    var page = K.pages[route.page];
    K.destroyViewScope(K.view);
    viewEl.innerHTML = page.render(route.params, route.query) + K.ui.footer(!!page.compactFooter);
    K.scroll.top();
    setMeta(route);
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

  // In path mode, internal links navigate without a full reload
  function onClick(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    var url = new URL(a.getAttribute("href"), location.href);
    if (url.origin !== location.origin || url.hash) return;
    var seg = url.pathname.replace(/index\.html$/, "").split("/").filter(Boolean);
    if (seg.length > 1 || (seg.length === 1 && PAGES.indexOf(seg[0]) === -1)) return;
    e.preventDefault();
    if (url.pathname + url.search === location.pathname + location.search) return;
    history.pushState(null, "", url.pathname + url.search);
    go();
  }

  function init() {
    viewEl = document.getElementById("view");
    panel = document.getElementById("transition");
    // Hand the panel's off-screen position to GSAP (percent-based, so it survives resizes)
    gsap.set(panel, { y: 0, yPercent: 100 });
    // Skip link: focus the content without touching the address
    var skip = K.$("[data-skip]");
    skip.addEventListener("click", function (e) { e.preventDefault(); viewEl.focus(); });
    if (K.pathMode) {
      // Old #/about links (and anything shared before real addresses) land on /about/
      if (/^#\//.test(location.hash)) {
        var old = location.hash.slice(2).split("?");
        history.replaceState(null, "", K.link(old[0].replace(/\/+$/, ""), old[1]));
      }
      document.addEventListener("click", onClick);
      window.addEventListener("popstate", go);
    } else {
      window.addEventListener("hashchange", go);
      if (!location.hash || location.hash === "#") history.replaceState(null, "", "#/");
    }
    go();
  }

  K.router = { init: init };
})(window.KRASIS);
