/*
  squares.js — ambient cluster of outlined, rotated squares on a 2D canvas.
  Squares drift slowly; scroll velocity skews the cluster (max 3°) and it springs back when scrolling stops.
  Counts drop on tablet/mobile; reduced motion draws one static frame. Pauses while off screen.
  Usage: var s = K.squares.mount(containerEl, { count, spread }); s.destroy();
  Depends on: utils.js, smooth-scroll.js.
*/
(function (K) {
  var DEG = Math.PI / 180;

  function mount(container, opts) {
    opts = opts || {};
    var canvas = document.createElement("canvas");
    canvas.className = "squares-canvas";
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, raf = 0, visible = true, t0 = performance.now();
    var skew = 0;

    var base = opts.count || 26;
    var count = K.flags.mobile ? Math.round(base * 0.4) : K.flags.tablet ? Math.round(base * 0.6) : base;
    var squares = [];
    for (var i = 0; i < count; i++) {
      var r = Math.pow(Math.random(), 0.7);
      var a = Math.random() * Math.PI * 2;
      squares.push({
        r: r, a: a,
        size: 18 + Math.pow(Math.random(), 2) * 170,
        rot: Math.random() * 90,
        spin: (Math.random() - 0.5) * 6, // deg per second
        alpha: 0.08 + Math.random() * 0.32,
        phase: Math.random() * Math.PI * 2,
        drift: 6 + Math.random() * 18
      });
    }

    function resize() {
      var rect = container.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      draw(performance.now());
    }

    function draw(now) {
      var t = (now - t0) / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      var cx = w * (opts.cx || 0.5), cy = h * (opts.cy || 0.5);
      var spread = Math.min(w, h) * (opts.spread || 0.42);
      // Shear the whole cluster with scroll velocity (max 3°)
      ctx.translate(cx, cy);
      ctx.transform(1, 0, Math.tan(skew * DEG), 1, 0, 0);
      ctx.lineWidth = 1;
      for (var i = 0; i < squares.length; i++) {
        var s = squares[i];
        var x = Math.cos(s.a) * s.r * spread + Math.sin(t * 0.2 + s.phase) * s.drift;
        var y = Math.sin(s.a) * s.r * spread + Math.cos(t * 0.17 + s.phase) * s.drift;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((s.rot + t * s.spin) * DEG);
        ctx.strokeStyle = "rgba(236,235,230," + s.alpha + ")";
        ctx.strokeRect(-s.size / 2, -s.size / 2, s.size, s.size);
        ctx.restore();
      }
    }

    function loop(now) {
      var v = K.scroll.velocity() || 0;
      var target = Math.max(-3, Math.min(3, v * 0.12));
      skew += (target - skew) * 0.08;
      draw(now);
      raf = requestAnimationFrame(loop);
    }

    var io = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (K.flags.reduced) return;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(container);

    resize();
    window.addEventListener("resize", resize);

    return {
      destroy: function () {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("resize", resize);
        canvas.remove();
      }
    };
  }

  K.squares = { mount: mount };
})(window.KRASIS);
