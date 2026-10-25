/*
  hero.js — Home section 01. A faithful vanilla-GSAP port of hero-parallax-react.html:
  a 300vh section whose three rows of logo cards tilt in (rotateX 15→0, rotateZ 20→0, y -700→500,
  opacity 0.2→1 over the first 20% of scroll) while rows slide sideways ±1000px over the full scroll.
  The spring smoothing from Framer Motion is approximated with ScrollTrigger scrub.
  Only the header text changed: the Krasis headline with the supplied logo on its own line.
  Depends on: GSAP, ScrollTrigger, utils.js, reveal.js, ui.js, data/copy.js.
*/
(function (K) {
  var CARD = "assets/logos/krasis-square.png"; // the same image used in hero-parallax-react.html

  function card() {
    return '<div class="hcard"><img src="./' + CARD + '" alt="" width="600" height="600" decoding="async"></div>';
  }
  function row(cls) {
    var html = "";
    for (var i = 0; i < 5; i++) html += card();
    return '<div class="hero__row ' + cls + '">' + html + "</div>";
  }

  function render() {
    var c = K.copy.hero;
    return '<section class="hero" data-hero aria-labelledby="hero-title">' +
      '<div class="bands" aria-hidden="true"><span class="band band--a"></span><span class="band band--b"></span><span class="band band--c"></span></div>' +
      '<div class="dots hero__dots" aria-hidden="true"></div>' +
      '<div class="hero__header container">' +
      '<h1 class="hero__title upper" id="hero-title" data-anim="lines" data-manual data-label="Get your website the right way: the Krasis way">' +
      '<span class="hero__line">' + K.esc(c.lines[0]) + "</span>" +
      '<span class="hero__line">' + K.esc(c.lines[1]) + "</span>" +
      '<span class="hero__line">' + K.esc(c.lines[2]) + "</span>" +
      '<span class="hero__line hero__line--logo">' + K.ui.krasis("hero__logo", { unit: true, alt: "" }) + "</span>" +
      '<span class="hero__line hero__line--way">' + K.esc(c.lines[4]) + "</span>" +
      "</h1></div>" +
      '<div class="hero__stage" aria-hidden="true">' + row("hero__row--a") + row("hero__row--b") + row("hero__row--a") + "</div>" +
      '<div class="hero__fold" aria-hidden="true">' +
      K.ui.plus("plus--accent hero__plus") +
      '<div class="side-label"><span>' + K.esc(c.side.toUpperCase()) + "</span></div>" +
      K.ui.counter(1, 10, "counter--with-plus") +
      '<div class="scroll-cue label"><span>Scroll</span><i></i></div>' +
      "</div>" +
      "</section>";
  }

  function mount(root) {
    var hero = K.$("[data-hero]", root);
    var stage = K.$(".hero__stage", hero);
    var rowsOut = K.$$(".hero__row--a", hero);
    var rowIn = K.$(".hero__row--b", hero);
    var bands = K.$$(".band", hero);

    // Hide the meta until the intro plays
    gsap.set(K.$$(".hero__fold > *", hero), { opacity: 0 });

    // Runs on every screen size (as in the original); only reduced motion opts out
    K.media("(prefers-reduced-motion: no-preference)", function () {
      var k = K.flags.mobile ? 0.55 : 1; // scale pixel travel down on small screens
      var tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.5 }
      });
      tl.fromTo(stage,
        { rotateX: 15, rotateZ: 20, y: -700 * k, opacity: 0.2 },
        { rotateX: 0, rotateZ: 0, y: 500 * k, opacity: 1, duration: 0.2 }, 0)
        .fromTo(rowsOut, { x: 0 }, { x: 1000 * k, duration: 1 }, 0)
        .fromTo(rowIn, { x: 0 }, { x: -1000 * k, duration: 1 }, 0);

      // Bands: very slow parallax (≤10%) plus a velocity skew that springs back
      gsap.to(bands, { yPercent: 10, scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
      var skew = 0;
      var setters = bands.map(function (b) { return gsap.quickSetter(b, "skewX", "deg"); });
      var bases = [-32, 32, -32];
      function tick() {
        var target = Math.max(-3, Math.min(3, (K.scroll.velocity() || 0) * 0.1));
        skew += (target - skew) * 0.08;
        setters.forEach(function (set, i) { set(bases[i] + skew); });
      }
      gsap.ticker.add(tick);
      return function () { gsap.ticker.remove(tick); };
    });

    K.media("(prefers-reduced-motion: reduce)", function () {
      gsap.set(stage, { rotateX: 0, rotateZ: 0, y: 0, opacity: 1 });
    });
  }

  // Called by the router once the preloader wipe or page transition finishes
  function intro(root) {
    var hero = K.$("[data-hero]", root);
    if (!hero) return;
    K.reveal.play(K.$(".hero__title", hero), 0);
    gsap.to(K.$$(".hero__fold > *", hero), { opacity: 1, duration: 1.2, stagger: 0.08, delay: 0.6 });
  }

  K.hero = { render: render, mount: mount, intro: intro };
})(window.KRASIS);
