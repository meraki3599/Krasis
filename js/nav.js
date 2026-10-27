/*
  nav.js — fixed nav bar (hides on scroll down, returns on scroll up) and the full-screen menu overlay
  (clip-path circle from the button, masked link reveals, hover dimming, Esc / link / button to close, focus trap).
  Depends on: GSAP, utils.js, smooth-scroll.js, data/copy.js.
*/
(function (K) {
  var nav, menu, btn, list, isOpen = false, hidden = false, tl;

  function build() {
    list.innerHTML = K.copy.nav.map(function (item, i) {
      return '<li class="menu__item"><a class="menu__link" href="' + K.link(item.route) + '" data-route="' + item.route + '"><small>' + K.pad(i + 1) + "</small>" + item.label + "</a></li>";
    }).join("");
    K.$$(".menu__link", list).forEach(function (a) {
      a.addEventListener("mouseenter", function () { list.classList.add("is-hovering"); });
      a.addEventListener("mouseleave", function () { list.classList.remove("is-hovering"); });
      a.addEventListener("click", function () { close(); });
    });
  }

  function origin() {
    var r = btn.getBoundingClientRect();
    return (r.left + r.width / 2) + "px " + (r.top + r.height / 2) + "px";
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    menu.hidden = false;
    document.body.classList.add("menu-open");
    btn.setAttribute("aria-expanded", "true");
    btn.querySelector(".nav__menu-label").textContent = "Close";
    K.scroll.stop();
    showBar();
    var links = K.$$(".menu__link", menu);
    if (tl) tl.kill();
    if (K.flags.reduced) {
      tl = gsap.timeline().fromTo(menu, { opacity: 0, clipPath: "circle(150% at " + origin() + ")" }, { opacity: 1, duration: 0.4 });
    } else {
      tl = gsap.timeline()
        .fromTo(menu, { clipPath: "circle(0% at " + origin() + ")" }, { clipPath: "circle(150% at " + origin() + ")", duration: 1, ease: "kInOut" })
        .fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.06, ease: "kOut" }, 0.35)
        .fromTo(".menu__foot", { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.7);
    }
    setTimeout(function () { links[0] && links[0].focus({ preventScroll: true }); }, 50);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    document.body.classList.remove("menu-open");
    btn.setAttribute("aria-expanded", "false");
    btn.querySelector(".nav__menu-label").textContent = "Menu";
    K.scroll.start();
    if (tl) tl.kill();
    tl = gsap.timeline({ onComplete: function () { menu.hidden = true; } });
    if (K.flags.reduced) tl.to(menu, { opacity: 0, duration: 0.4 });
    else tl.to(menu, { clipPath: "circle(0% at " + origin() + ")", duration: 0.8, ease: "kInOut" });
    btn.focus({ preventScroll: true });
  }

  function hideBar() {
    if (hidden || isOpen) return;
    hidden = true;
    gsap.to(nav, { yPercent: -110, duration: 0.6, ease: "kInOut" });
  }
  function showBar() {
    if (!hidden) return;
    hidden = false;
    gsap.to(nav, { yPercent: 0, duration: 0.6, ease: "kOut" });
  }

  function setActive(page) {
    K.$$(".menu__link", list).forEach(function (a) {
      var on = (a.getAttribute("data-route") || "home") === page;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }

  function init() {
    nav = document.getElementById("nav");
    menu = document.getElementById("menu");
    btn = nav.querySelector(".nav__menu");
    list = menu.querySelector(".menu__list");
    build();

    btn.addEventListener("click", function () { isOpen ? close() : open(); });
    document.addEventListener("keydown", function (e) {
      if (!isOpen) return;
      if (e.key === "Escape") { close(); return; }
      if (e.key === "Tab") {
        // Trap focus between the menu button and the overlay's focusables
        var f = [btn].concat(K.$$("a, button", menu));
        var i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });

    K.on("scroll", function (s) {
      if (s.y < 120) showBar();
      else if (s.dir > 0) hideBar();
      else showBar();
    });
    K.on("route", function (r) { setActive(r.page); showBar(); });
  }

  K.nav = { init: init, open: open, close: close, show: showBar };
})(window.KRASIS);
