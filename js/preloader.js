/*
  preloader.js — first-visit intro (~2.6s incl. wipe, skippable with click, Esc, Enter or Space).
  Line draws across the centre while the counter runs (000/100) → line splits, logo mask-reveals →
  300ms hold → screen wipes upward. Calls done() exactly when the wipe finishes.
  Depends on: GSAP, utils.js, config.js.
*/
(function (K) {
  var KEY = "krasis:seen";

  function seen() {
    try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; }
  }
  function remember() {
    try { localStorage.setItem(KEY, "1"); } catch (e) { /* private mode */ }
  }

  function run(done) {
    var el = document.getElementById("preloader");
    if ((seen() && !K.config.alwaysShowPreloader) || K.flags.reduced) {
      el.remove();
      done();
      return;
    }
    remember();
    el.classList.add("is-on");
    var halves = K.$$(".preloader__line span", el);
    var logo = K.$(".preloader__logo", el);
    var out = K.$("[data-count-out]", el);
    var skipBtn = K.$(".preloader__skip", el);
    var count = { v: 0 };

    var tl = gsap.timeline({
      onComplete: function () {
        el.remove();
        document.removeEventListener("keydown", onKey);
        done();
      }
    });

    tl.to(count, {
      v: 100, duration: 1.1, ease: "power2.inOut",
      onUpdate: function () { out.textContent = K.pad(Math.round(count.v), 3); }
    }, 0)
      .to(halves[0], { scaleX: 1, duration: 0.55, ease: "power2.in" }, 0)
      .to(halves[1], { scaleX: 1, duration: 0.55, ease: "power2.out" }, 0.55)
      // Split: each half retreats to its outer edge while the logo opens from the centre
      .set(halves[1], { transformOrigin: "right center" }, 1.1)
      .to(halves[0], { scaleX: 0, duration: 0.55, ease: "kInOut" }, 1.1)
      .to(halves[1], { scaleX: 0, duration: 0.55, ease: "kInOut" }, 1.1)
      .to(logo, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "kInOut" }, 1.1)
      .to(".preloader__count, .preloader__skip", { opacity: 0, duration: 0.4 }, 1.2)
      // Hold 300ms, then wipe up
      .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "kInOut" }, 1.95);

    function skip() {
      if (tl.time() < 1.1) tl.seek(1.1);
      tl.timeScale(2.5);
    }
    function onKey(e) {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") skip();
    }
    el.addEventListener("click", skip);
    skipBtn.addEventListener("click", skip);
    document.addEventListener("keydown", onKey);
  }

  K.preloader = { run: run };
})(window.KRASIS);
