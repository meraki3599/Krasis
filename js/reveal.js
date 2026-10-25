/*
  reveal.js — split-text helper and the declarative reveal system.
  Markup opts in with data-anim:
    lines        word masks, revealed line by line (yPercent 110 → 0, 0.08s per line), once
    scrub-words  word opacity 0.2 → 1 scrubbed to scroll
    fade         opacity + 24px rise, once
    stagger      direct children fade up in sequence, once
    rule-y/rule-x hairline draws (scaleY/scaleX 0 → 1)
    count        number counts up from 0 to data-count (en-IN format)
  Add data-manual to split + hide without a ScrollTrigger (play later with K.reveal.play).
  Depends on: utils.js.
*/
(function (K) {
  var WORD_RE = /(\s+)/;

  // Wrap words (and unsplittable children like <img>) in masks. Keeps <em>/<span> wrappers intact.
  function splitNode(node, mode, out) {
    var kids = Array.prototype.slice.call(node.childNodes);
    kids.forEach(function (child) {
      if (child.nodeType === 3) {
        var frag = document.createDocumentFragment();
        child.textContent.split(WORD_RE).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
          frag.appendChild(wrap(document.createTextNode(part), mode, out));
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) {
        if (child.tagName === "BR") return;
        if (child.hasAttribute("data-unit") || child.tagName === "IMG") {
          var w = wrap(null, mode, out);
          node.replaceChild(w, child);
          (w.firstChild || w).appendChild(child);
        } else {
          splitNode(child, mode, out);
        }
      }
    });
  }

  function wrap(content, mode, out) {
    if (mode === "opacity") {
      var s = document.createElement("span");
      s.className = "wo";
      if (content) s.appendChild(content);
      out.push(s);
      return s;
    }
    var mask = document.createElement("span");
    mask.className = "sw";
    var inner = document.createElement("span");
    inner.className = "si";
    if (content) inner.appendChild(content);
    mask.appendChild(inner);
    out.push(inner);
    return mask;
  }

  // Returns the animatable word elements. Screen readers get the original text once.
  function split(el, mode) {
    if (el._split) return el._split;
    var text = el.textContent.replace(/\s+/g, " ").trim();
    var label = el.getAttribute("data-label") || text;
    var holder = document.createElement("span");
    holder.setAttribute("aria-hidden", "true");
    while (el.firstChild) holder.appendChild(el.firstChild);
    el.appendChild(holder);
    if (label) {
      var sr = document.createElement("span");
      sr.className = "sr-only";
      sr.textContent = label;
      el.insertBefore(sr, holder);
    }
    var out = [];
    splitNode(holder, mode, out);
    el._split = out;
    return out;
  }

  // Group word elements into visual lines by their top offset
  function lineIndexes(words) {
    var tops = [], idx = [];
    words.forEach(function (w) {
      var t = Math.round((w.parentNode.getBoundingClientRect ? w.parentNode : w).getBoundingClientRect().top);
      var i = -1;
      for (var k = 0; k < tops.length; k++) if (Math.abs(tops[k] - t) < 6) { i = k; break; }
      if (i === -1) { tops.push(t); i = tops.length - 1; }
      idx.push(i);
    });
    return idx;
  }

  function playLines(el, delay) {
    var words = el._split || split(el, "words");
    var lines = lineIndexes(words);
    return gsap.to(words, {
      yPercent: 0,
      duration: 1.2,
      ease: "kOut",
      delay: delay || 0,
      stagger: function (i) { return lines[i] * 0.08 + (i * 0.004); }
    });
  }

  var reveal = {
    split: split,
    play: function (el, delay) {
      if (K.flags.reduced) return gsap.to(el, { opacity: 1, duration: 0.6, delay: delay || 0 });
      return playLines(el, delay);
    },
    scan: function (root) {
      var reduced = K.flags.reduced;

      K.$$("[data-anim]", root).forEach(function (el) {
        var type = el.getAttribute("data-anim");
        var manual = el.hasAttribute("data-manual");
        var start = el.getAttribute("data-start") || "top 85%";

        if (type === "lines") {
          if (reduced) {
            gsap.set(el, { opacity: 0 });
            if (!manual) gsap.to(el, { opacity: 1, duration: 0.6, scrollTrigger: { trigger: el, start: start, once: true } });
            return;
          }
          var words = split(el, "words");
          gsap.set(words, { yPercent: 110 });
          if (!manual) {
            ScrollTrigger.create({ trigger: el, start: start, once: true, onEnter: function () { playLines(el); } });
          }
        } else if (type === "scrub-words") {
          if (reduced) return;
          var ws = split(el, "opacity");
          gsap.fromTo(ws, { opacity: 0.2 }, {
            opacity: 1, ease: "none", stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 80%", end: el.getAttribute("data-end") || "bottom 45%", scrub: 0.6 }
          });
        } else if (type === "fade") {
          gsap.fromTo(el, { opacity: 0, y: reduced ? 0 : 24 }, {
            opacity: 1, y: 0, duration: reduced ? 0.6 : 1.2,
            delay: parseFloat(el.getAttribute("data-delay") || 0),
            scrollTrigger: manual ? null : { trigger: el, start: start, once: true }
          });
        } else if (type === "stagger") {
          gsap.fromTo(el.children, { opacity: 0, y: reduced ? 0 : 24 }, {
            opacity: 1, y: 0, duration: reduced ? 0.6 : 1.1, stagger: 0.08,
            scrollTrigger: { trigger: el, start: start, once: true }
          });
        } else if (type === "rule-y" || type === "rule-x") {
          if (reduced) return;
          var prop = type === "rule-y" ? "scaleY" : "scaleX";
          var from = {}; from[prop] = 0;
          var to = { duration: 1.2, ease: "kOut", scrollTrigger: { trigger: el.parentNode, start: start, once: true } };
          to[prop] = 1;
          gsap.fromTo(el, from, to);
        } else if (type === "count") {
          var target = parseFloat(el.getAttribute("data-count"));
          if (reduced) { el.textContent = K.inr(target); return; }
          var obj = { v: 0 };
          el.textContent = "0";
          gsap.to(obj, {
            v: target, duration: 1.6, ease: "kOut",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: function () { el.textContent = K.inr(obj.v); }
          });
        }
      });
    }
  };

  K.reveal = reveal;
})(window.KRASIS);
