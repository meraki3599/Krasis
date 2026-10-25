/*
  smooth-scroll.js — Lenis smooth scrolling driven by the GSAP ticker so ScrollTrigger stays in sync.
  Disabled for prefers-reduced-motion and coarse pointers (native scroll there).
  Exposes K.scroll: { lenis, top(), stop(), start(), velocity(), direction() }.
  Depends on: Lenis, GSAP, ScrollTrigger, utils.js.
*/
(function (K) {
  var lenis = null;
  var lastY = 0, dir = 1, nativeVel = 0;

  function init() {
    if (!K.flags.reduced && K.flags.finePointer && window.Lenis) {
      lenis = new Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
      lenis.on("scroll", function (e) {
        dir = e.direction || dir;
        ScrollTrigger.update();
        K.emit("scroll", { y: e.scroll, dir: dir, velocity: e.velocity });
      });
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      window.addEventListener("scroll", function () {
        var y = window.scrollY;
        dir = y > lastY ? 1 : y < lastY ? -1 : dir;
        nativeVel = y - lastY;
        lastY = y;
        K.emit("scroll", { y: y, dir: dir, velocity: nativeVel });
      }, { passive: true });
    }
  }

  K.scroll = {
    init: init,
    get lenis() { return lenis; },
    top: function () {
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    },
    to: function (target) {
      if (lenis) lenis.scrollTo(target, { duration: 1.4 });
      else (typeof target === "number" ? window.scrollTo(0, target) : target.scrollIntoView());
    },
    stop: function () { if (lenis) lenis.stop(); document.documentElement.style.overflow = "hidden"; },
    start: function () { if (lenis) lenis.start(); document.documentElement.style.overflow = ""; },
    velocity: function () {
      if (lenis) return lenis.velocity;
      nativeVel *= 0.9; // decay so decorative skew springs back when native scrolling stops
      return nativeVel;
    },
    direction: function () { return dir; }
  };
})(window.KRASIS);
