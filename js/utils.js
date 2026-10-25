/*
  utils.js — shared helpers on window.KRASIS: DOM shortcuts, feature flags, eases, a tiny event bus,
  per-view lifecycle (gsap.context + matchMedia + cleanups), clipboard + toast, number formatting.
  Depends on: GSAP, ScrollTrigger, CustomEase (vendor), config.js.
*/
(function (K) {
  gsap.registerPlugin(ScrollTrigger, CustomEase);

  // Brand eases (see MOTION.md)
  CustomEase.create("kOut", "0.16, 1, 0.3, 1");
  CustomEase.create("kInOut", "0.76, 0, 0.24, 1");
  gsap.defaults({ ease: "kOut", duration: 1.2 });

  K.$ = function (sel, root) { return (root || document).querySelector(sel); };
  K.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var mqFine = window.matchMedia("(hover: hover) and (pointer: fine)");
  K.flags = {
    get reduced() { return mqReduced.matches; },
    get finePointer() { return mqFine.matches; },
    get mobile() { return window.innerWidth < 768; },
    get tablet() { return window.innerWidth >= 768 && window.innerWidth < 1024; }
  };
  // Media query used by every pinned / scrubbed sequence
  K.MQ_MOTION = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
  K.MQ_STATIC = "(max-width: 767px), (prefers-reduced-motion: reduce)";

  K.esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };

  // Text that may be a placeholder object { text, placeholder }
  K.txt = function (v) { return v && typeof v === "object" ? v.text : v; };
  K.isPh = function (v) { return !!(v && typeof v === "object" && v.placeholder); };
  K.phText = function (v, tag) {
    var html = K.esc(K.txt(v));
    return K.isPh(v) ? html + '<span class="ph-tag">' + (tag || "Replace") + "</span>" : html;
  };

  // Desktop-only line break after each sentence/question, so display headlines never wrap awkwardly
  K.brk = function (s) { return K.esc(s).replace(/([.?:]) (?=\S)/g, '$1<br class="br-d"> '); };

  K.inr = function (n) { return Math.round(n).toLocaleString("en-IN"); };
  K.pad = function (n, len) { n = String(n); while (n.length < (len || 2)) n = "0" + n; return n; };

  // ---------- Event bus ----------
  var handlers = {};
  K.on = function (name, fn) { (handlers[name] = handlers[name] || []).push(fn); };
  K.emit = function (name, data) { (handlers[name] || []).slice().forEach(function (fn) { fn(data); }); };

  // ---------- Per-view lifecycle ----------
  // Router creates a fresh view scope; sections register cleanups so nothing leaks between routes.
  K.view = null;
  K.createViewScope = function (root) {
    return { root: root, ctx: gsap.context(function () {}, root), mm: gsap.matchMedia(), cleanups: [] };
  };
  K.destroyViewScope = function (scope) {
    if (!scope) return;
    scope.cleanups.forEach(function (fn) { try { fn(); } catch (e) { /* ignore */ } });
    scope.mm.revert();
    scope.ctx.revert();
    ScrollTrigger.getAll().forEach(function (st) { st.kill(); });
  };
  // Run animation setup inside the current view's gsap.context
  K.add = function (fn) { return K.view.ctx.add(fn); };
  K.media = function (query, fn) { K.view.mm.add(query, fn); };
  K.onLeave = function (fn) { if (K.view) K.view.cleanups.push(fn); };
  K.listen = function (el, type, fn, opts) {
    el.addEventListener(type, fn, opts);
    K.onLeave(function () { el.removeEventListener(type, fn, opts); });
  };

  // ---------- Clipboard + toast ----------
  var toastTimer;
  K.toast = function (msg) {
    var t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-on"); }, 1800);
  };
  K.copyText = function (text) {
    function done() { K.toast("Copied"); }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else fallback();
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { K.toast(text); }
      document.body.removeChild(ta);
    }
  };
  // Global delegation for any [data-copy] element
  document.addEventListener("click", function (e) {
    var el = e.target.closest && e.target.closest("[data-copy]");
    if (!el) return;
    e.preventDefault();
    K.copyText(el.getAttribute("data-copy"));
  });

  // Route helper (hash router paths)
  K.href = function (path) { return "#" + path; };
})(window.KRASIS);
