/*
  grid-lines.js — perspective line grid on a 2D canvas: rays from a vanishing point plus receding floor
  and ceiling lines, with faint "+" markers at intersections.
  setProgress(p): 0 = lines converged into the vanishing point, 1 = fully diverged outward.
  mode "glitch" (404) adds jitter, slice offsets and a breathing converge/diverge loop.
  Usage: var g = K.gridLines.mount(containerEl, { mode }); g.setProgress(0.5); g.destroy();
  Depends on: utils.js.
*/
(function (K) {
  function mount(container, opts) {
    opts = opts || {};
    var glitch = opts.mode === "glitch";
    var canvas = document.createElement("canvas");
    canvas.className = "grid-canvas";
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, progress = opts.progress == null ? 1 : opts.progress, raf = 0;
    var rays = K.flags.mobile ? 14 : 22;
    var depth = K.flags.mobile ? 7 : 10;

    function resize() {
      var r = container.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      draw(performance.now());
    }

    function draw(now) {
      var p = progress;
      var vx = w / 2, vy = h * 0.5;
      var jitter = 0;
      if (glitch) {
        var t = now / 1000;
        p = 0.55 + Math.sin(t * 0.9) * 0.35;
        if (Math.random() < 0.06) jitter = (Math.random() - 0.5) * 30;
        vx += Math.sin(t * 1.7) * 6 + jitter;
      }
      var e = 0.04 + p * 0.96; // how far lines reach from the vanishing point
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.09)";
      ctx.beginPath();

      // Rays to points spread past the bottom and top edges
      var spanX = w * 2.2;
      for (var i = 0; i <= rays; i++) {
        var fx = -spanX / 2 + (spanX * i) / rays + w / 2;
        ctx.moveTo(vx, vy); ctx.lineTo(vx + (fx - vx) * e, vy + (h - vy) * e);
        ctx.moveTo(vx, vy); ctx.lineTo(vx + (fx - vx) * e, vy - vy * e);
      }
      // Receding horizontals (floor + ceiling)
      var ys = [];
      for (var k = 1; k <= depth; k++) {
        var f = Math.pow(k / depth, 2.2) * e;
        var yf = vy + (h - vy) * f, yc = vy - vy * f;
        var half = (spanX / 2) * f;
        ctx.moveTo(vx - half, yf); ctx.lineTo(vx + half, yf);
        ctx.moveTo(vx - half, yc); ctx.lineTo(vx + half, yc);
        ys.push([f, yf, yc]);
      }
      ctx.stroke();

      // "+" markers on a few intersections
      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.beginPath();
      for (var m = 2; m < ys.length; m += 3) {
        for (var j = 2; j < rays; j += 4) {
          var fx2 = -spanX / 2 + (spanX * j) / rays + w / 2;
          var px = vx + (fx2 - vx) * ys[m][0];
          [ys[m][1], ys[m][2]].forEach(function (py) {
            if (px < -10 || px > w + 10) return;
            ctx.moveTo(px - 6, py); ctx.lineTo(px + 6, py);
            ctx.moveTo(px, py - 6); ctx.lineTo(px, py + 6);
          });
        }
      }
      ctx.stroke();

      if (glitch && jitter) {
        // Shift a horizontal slice of what was drawn
        var sy = Math.random() * h, sh = 8 + Math.random() * 40;
        try { ctx.drawImage(canvas, 0, sy * dpr, w * dpr, sh * dpr, jitter, sy, w, sh); } catch (err) { /* ignore */ }
      }
    }

    function loop(now) { draw(now); raf = requestAnimationFrame(loop); }

    resize();
    window.addEventListener("resize", resize);
    if (glitch && !K.flags.reduced) raf = requestAnimationFrame(loop);

    return {
      setProgress: function (p) { progress = p; draw(performance.now()); },
      destroy: function () {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        canvas.remove();
      }
    };
  }

  K.gridLines = { mount: mount };
})(window.KRASIS);
