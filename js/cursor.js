/*
  cursor.js — custom cursor (fine pointers only) and magnetic buttons.
  States: dot (default), "+" over links/buttons, 64px label over [data-cursor="Label"].
  Depends on: GSAP, utils.js.
*/
(function (K) {
  function initCursor() {
    if (!K.flags.finePointer) return;
    var el = document.getElementById("cursor");
    var label = el.querySelector(".cursor__label");
    document.documentElement.classList.add("has-cursor");

    var xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    var yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });

    window.addEventListener("mousemove", function (e) { xTo(e.clientX); yTo(e.clientY); }, { passive: true });
    document.addEventListener("mouseleave", function () { el.classList.add("is-hidden"); });
    document.addEventListener("mouseenter", function () { el.classList.remove("is-hidden"); });

    var current = null;
    document.addEventListener("mouseover", function (e) {
      var t = e.target;
      var labelled = t.closest && t.closest("[data-cursor]");
      var link = t.closest && t.closest("a, button, [role=button], input[type=radio], input[type=checkbox], label.chip");
      var state = labelled ? "label:" + labelled.getAttribute("data-cursor") : link ? "plus" : "dot";
      if (state === current) return;
      current = state;
      el.classList.remove("is-label", "is-plus", "is-wide");
      if (labelled) {
        var text = labelled.getAttribute("data-cursor");
        label.textContent = text;
        el.classList.add("is-label");
        if (text.length > 6) el.classList.add("is-wide");
      } else if (link) {
        el.classList.add("is-plus");
      }
    });
  }

  // Magnetic pull (max 8px) for [data-magnetic], delegated so new views just work
  function initMagnetic() {
    if (!K.flags.finePointer || K.flags.reduced) return;
    var active = null;
    document.addEventListener("mousemove", function (e) {
      var t = e.target.closest && e.target.closest("[data-magnetic]");
      if (active && active !== t) release(active);
      active = t;
      if (!t) return;
      var r = t.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      gsap.to(t, { x: dx * 8, y: dy * 8, duration: 0.5, ease: "power3.out", overwrite: "auto" });
    }, { passive: true });
    function release(t) { gsap.to(t, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)", overwrite: "auto" }); }
  }

  K.cursor = { init: function () { initCursor(); initMagnetic(); } };
})(window.KRASIS);
