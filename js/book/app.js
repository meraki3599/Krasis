/*
  app.js — Krasis quote builder: renders packages, add-ons and timelines from data.js, keeps a live
  total (rolling odometer digits, chips that fly into the total), animates the page like krasis.in
  (curtain intro, masked line reveals, Lenis smooth scroll), and sends the quote through EmailJS.
*/
(function () {
  const Q = window.QUOTE;
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create("kOut", "0.16, 1, 0.3, 1");
  CustomEase.create("kInOut", "0.76, 0, 0.24, 1");
  gsap.defaults({ ease: "kOut", duration: 1 });

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isSheet = () => matchMedia("(max-width: 1100px)").matches;
  const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
  const pad = (n) => String(n).padStart(2, "0");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const items = {};
  Q.categories.forEach((c) => c.items.forEach((it) => { items[it.id] = Object.assign({ cat: c.id }, it); }));
  const pkgById = (id) => Q.packages.find((p) => p.id === id) || null;

  // ---------- State (remembered in this browser only) ----------
  const STORE = "krasis-quote-v1";
  const makeRef = () => "KQ-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE));
      if (s && typeof s.items === "object") return s;
    } catch (e) { /* storage unavailable */ }
    return null;
  }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* ignore */ } }
  const state = load() || { pkg: null, items: {}, timeline: Q.timelines[0].id, ref: makeRef() };
  if (!pkgById(state.pkg)) state.pkg = null;
  // Pricing-page buttons link here with ?plan=standard|premium to preselect the package
  const planParam = new URLSearchParams(location.search).get("plan");
  if (pkgById(planParam)) state.pkg = planParam;
  Object.keys(state.items).forEach((id) => { if (!items[id]) delete state.items[id]; });

  const included = (it) => !!(state.pkg && it.includedIn && it.includedIn.includes(state.pkg));
  const qtyOf = (id) => state.items[id] || 0;

  function totals() {
    const pkg = pkgById(state.pkg);
    const lines = [];
    let oneOff = pkg ? pkg.price : 0;
    let monthly = 0;
    Object.keys(state.items).forEach((id) => {
      const it = items[id], q = qtyOf(id);
      if (!q || included(it)) return;
      const amount = it.price * q;
      lines.push({ key: id, name: it.name + (it.qty ? " × " + q : ""), amount, recurring: !!it.recurring });
      if (it.recurring) monthly += amount; else oneOff += amount;
    });
    const tl = Q.timelines.find((t) => t.id === state.timeline) || Q.timelines[0];
    let rush = 0;
    if (tl.pct) {
      rush = Math.round((oneOff * tl.pct) / 100 / 100) * 100;
      lines.push({ key: "timeline", name: tl.name + " delivery (+" + tl.pct + "%)", amount: rush });
    }
    return { pkg, lines, total: oneOff + rush, monthly, timeline: tl };
  }

  // ---------- Odometer ----------
  function odo(el, value, instant) {
    const str = typeof value === "number" ? inr(value) : String(value);
    if (el.dataset.v === str) return;
    const sameShape = el.dataset.shape === str.replace(/\d/g, "0");
    if (!sameShape) {
      el.innerHTML = str.split("").map((ch) => /\d/.test(ch)
        ? '<span class="odo__col"><span class="odo__strip">' + "0123456789".split("").map((d) => "<span>" + d + "</span>").join("") + "</span></span>"
        : '<span class="odo__sym">' + esc(ch) + "</span>").join("");
      el.dataset.shape = str.replace(/\d/g, "0");
    }
    el.setAttribute("aria-label", str);
    const digits = str.replace(/\D/g, "").split("").map(Number);
    $$(".odo__strip", el).forEach((strip, i) => {
      const y = -digits[i] * 10;
      if (instant || reduced || !sameShape && !el.dataset.v) gsap.set(strip, { yPercent: y });
      else gsap.to(strip, { yPercent: y, duration: 1.1, delay: i * 0.035, ease: "kOut" });
    });
    el.dataset.v = str;
  }

  // ---------- Render ----------
  const check = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 8.5l3.5 3.5 7.5-8" fill="none" stroke-width="1.5"/></svg>';

  function renderPackages() {
    const std = Q.packages[0];
    $("#packages").innerHTML = Q.packages.map((p, i) => {
      const inherits = i > 0 && p.features.join() === std.features.join();
      const feats = inherits
        ? '<li class="pkg__plus">' + check + "<span>Everything in " + esc(std.name) + ", plus:</span></li>" + p.extras.map((f) => '<li class="is-extra">' + check + "<span>" + esc(f) + "</span></li>").join("")
        : p.features.concat(p.extras).map((f, j) => '<li class="' + (j >= p.features.length ? "is-extra" : "") + '">' + check + "<span>" + esc(f) + "</span></li>").join("");
      return '<label class="pkg" data-pkg="' + p.id + '">' +
        '<input class="sr" type="radio" name="package" value="' + p.id + '">' +
        '<span class="pkg__top"><span class="label">' + pad(i + 1) + " — Package</span>" + (p.badge ? '<span class="pkg__badge">' + esc(p.badge) + "</span>" : "") + "</span>" +
        '<span class="pkg__name">' + esc(p.name) + "</span>" +
        '<span class="pkg__price">' + inr(p.price) + "</span>" +
        '<span class="pkg__tag">' + esc(p.tagline) + "</span>" +
        '<span class="pkg__rule"></span>' +
        '<span class="label pkg__lab">Guaranteed</span>' +
        '<ul class="pkg__feats">' + feats + "</ul>" +
        (p.note ? '<span class="pkg__note serif">' + esc(p.note) + "</span>" : "") +
        '<span class="pkg__cta"><span class="pkg__cta-in"><span class="pkg__cta-off">Choose ' + esc(p.name) + '</span><span class="pkg__cta-on">Selected</span></span></span>' +
        "</label>";
    }).join("");
  }

  function itemHTML(it) {
    const price = '<span class="item__price" data-price>' + inr(it.price) + (it.unit ? "<small>" + esc(it.unit) + "</small>" : "") + "</span>";
    const body = '<span class="item__sw" aria-hidden="true"><i></i></span><span class="item__body"><span class="item__name">' + esc(it.name) + '</span><span class="item__desc">' + esc(it.desc) + "</span></span>";
    if (it.qty) {
      return '<div class="item item--qty" data-item="' + it.id + '" role="group" aria-label="' + esc(it.name) + '">' + body +
        '<span class="item__side"><span class="qty"><button class="qty__btn" type="button" data-dec aria-label="One fewer">−</button><span class="odo" data-qty></span><button class="qty__btn" type="button" data-inc aria-label="One more">+</button></span>' + price + "</span></div>";
    }
    return '<label class="item" data-item="' + it.id + '"><input class="sr" type="checkbox" value="' + it.id + '">' + body +
      '<span class="item__side"><span class="item__inc label">' + esc(it.includedLabel || "Included in Premium") + "</span>" + price + "</span></label>";
  }

  function renderCats() {
    $("#cats").insertAdjacentHTML("beforeend", Q.categories.map((c) =>
      '<button class="cats__btn" type="button" data-cat="' + c.id + '">' + esc(c.name) + '<sup data-count="' + c.id + '"></sup></button>').join(""));
    $("#catBlocks").innerHTML = Q.categories.map((c, i) =>
      '<div class="cat" id="cat-' + c.id + '" data-cat-block="' + c.id + '">' +
      '<div class="cat__head"><span class="label">' + pad(i + 1) + '</span><h3 class="cat__title">' + esc(c.name) + '</h3><span class="label cat__count" data-catcount="' + c.id + '"></span></div>' +
      (c.note ? '<p class="cat__note">' + esc(c.note) + "</p>" : "") +
      c.items.map((id) => itemHTML(items[id.id])).join("") + "</div>").join("");
  }

  function renderTimelines() {
    $("#timelines").innerHTML = Q.timelines.map((t) =>
      '<label class="time" data-time="' + t.id + '"><input class="sr" type="radio" name="timeline" value="' + t.id + '">' +
      '<span class="label">' + (t.pct ? "+" + t.pct + "% of total" : "Included") + "</span>" +
      '<span class="time__name">' + esc(t.name) + '</span><span class="time__desc">' + esc(t.desc) + "</span></label>").join("");
  }

  // ---------- Summary (receipt) ----------
  let featsOpen = false;
  function renderPkgSummary(pkg) {
    const box = $("#sPkg");
    if (!pkg) {
      box.innerHTML = '<p class="summary__empty">Choose a package to start your quote.</p>';
      return;
    }
    const feats = pkg.features.concat(pkg.extras);
    box.innerHTML = '<div class="sp__row"><span class="sp__name">' + esc(pkg.name) + '</span><span class="sp__price">' + inr(pkg.price) + "</span></div>" +
      '<button class="sp__toggle label" type="button" aria-expanded="' + featsOpen + '">' + feats.length + " features guaranteed</button>" +
      '<ul class="sp__feats"' + (featsOpen ? ' style="height:auto"' : "") + ">" + feats.map((f) => "<li>" + esc(f.split(",")[0]) + "</li>").join("") + "</ul>";
  }

  function syncList(lines) {
    const list = $("#sList");
    const existing = {};
    $$("li", list).forEach((li) => { existing[li.dataset.key] = li; });
    const keep = {};
    lines.forEach((ln) => {
      keep[ln.key] = true;
      const text = '<div class="sl__row"><span class="sl__name">' + esc(ln.name) + '</span><span class="sl__price">' + inr(ln.amount) + (ln.recurring ? "/mo" : "") + "</span></div>";
      let li = existing[ln.key];
      if (li) { if (li.dataset.text !== text) { li.innerHTML = text; li.dataset.text = text; } return; }
      li = document.createElement("li");
      li.dataset.key = ln.key; li.dataset.text = text; li.innerHTML = text;
      if (ln.key === "timeline") list.appendChild(li);
      else { const tlLi = list.querySelector('[data-key="timeline"]'); list.insertBefore(li, tlLi); }
      if (!reduced) gsap.fromTo(li, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.7 });
    });
    Object.keys(existing).forEach((k) => {
      if (keep[k]) return;
      const li = existing[k];
      delete li.dataset.key;
      if (reduced) li.remove();
      else gsap.to(li, { height: 0, opacity: 0, duration: 0.5, ease: "kInOut", onComplete: () => li.remove() });
    });
  }

  // ---------- Update everything from state ----------
  function update(opts) {
    opts = opts || {};
    const t = totals();
    $$(".pkg").forEach((el) => {
      const on = el.dataset.pkg === state.pkg;
      el.classList.toggle("is-on", on);
      $("input", el).checked = on;
    });
    $$(".item").forEach((el) => {
      const it = items[el.dataset.item], q = qtyOf(it.id), incl = included(it);
      el.classList.toggle("is-on", q > 0 && !incl);
      el.classList.toggle("is-incl", incl);
      const input = $("input", el);
      if (input) { input.checked = q > 0 || incl; input.disabled = incl; }
      const qn = $("[data-qty]", el);
      if (qn) {
        odo(qn, String(q), opts.instant);
        $("[data-dec]", el).disabled = q <= 0;
        $("[data-inc]", el).disabled = q >= (it.qty.max || 99);
      }
    });
    $$(".time").forEach((el) => {
      const on = el.dataset.time === state.timeline;
      el.classList.toggle("is-on", on);
      $("input", el).checked = on;
    });
    Q.categories.forEach((c) => {
      const n = c.items.filter((it) => qtyOf(it.id) > 0 && !included(items[it.id])).length;
      const inc = c.items.filter((it) => included(items[it.id])).length;
      $('[data-count="' + c.id + '"]').textContent = n ? n : "";
      $('[data-catcount="' + c.id + '"]').textContent = (n ? n + " added" : "") + (n && inc ? " · " : "") + (inc ? inc + " included" : "");
    });

    if (opts.pkgChanged || opts.instant) renderPkgSummary(t.pkg);
    syncList(t.lines);
    odo($("#total"), t.total, opts.instant);
    odo($("#mTotal"), t.total, opts.instant);
    $("#sMonthly").textContent = t.monthly ? "+ " + inr(t.monthly) + " / month" : "";
    $("#resetBtn").disabled = !state.pkg && !Object.keys(state.items).length && state.timeline === Q.timelines[0].id;
    $("#sDeposit").textContent = inr(Q.deposit);
    $("#sFine").textContent = Q.depositNote + " This is an estimate; we confirm your final quote after a quick call.";
    $("#ref").textContent = state.ref;
    save();
  }

  // ---------- Flying chip into the total ----------
  function fly(fromEl, amount) {
    if (reduced || !fromEl) return;
    const target = isSheet() ? $("#mTotal") : $("#total");
    if (!target) return;
    const a = fromEl.getBoundingClientRect(), b = target.getBoundingClientRect();
    if (!b.width) return;
    const chip = document.createElement("span");
    chip.className = "fly";
    chip.textContent = "+" + inr(amount);
    document.body.appendChild(chip);
    const w = chip.offsetWidth, h = chip.offsetHeight;
    const x0 = a.left + a.width / 2 - w / 2, y0 = a.top + a.height / 2 - h / 2;
    const x1 = b.left + Math.min(b.width, 180) / 2 - w / 2, y1 = b.top + b.height / 2 - h / 2;
    gsap.set(chip, { x: x0, y: y0, scale: 0.6, opacity: 0 });
    gsap.timeline({ onComplete: () => chip.remove() })
      .to(chip, { scale: 1, opacity: 1, duration: 0.25, ease: "power2.out" })
      .to(chip, { x: x1, duration: 0.85, ease: "kInOut" }, 0.1)
      .to(chip, { y: Math.min(y0, y1) - 80, duration: 0.42, ease: "power2.out" }, 0.1)
      .to(chip, { y: y1, duration: 0.43, ease: "power2.in" }, 0.52)
      .to(chip, { scale: 0.4, opacity: 0, duration: 0.25, ease: "power2.in" }, 0.85)
      .fromTo(target, { scale: 1 }, { scale: 1.06, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.out", transformOrigin: "left center" }, 0.9);
  }

  // ---------- Events ----------
  function bind() {
    $("#packages").addEventListener("change", (e) => {
      if (e.target.name !== "package") return;
      const first = !state.pkg;
      const hadCount = premiumOnStandard();
      state.pkg = e.target.value;
      update({ pkgChanged: true });
      if (first) fly($(".pkg__price", e.target.closest(".pkg")), pkgById(state.pkg).price);
      if (shouldUpsell(hadCount)) setTimeout(showUpsell, reduced ? 0 : 700);
    });

    $("#catBlocks").addEventListener("change", (e) => {
      const input = e.target;
      if (input.type !== "checkbox") return;
      const it = items[input.value];
      const hadCount = premiumOnStandard();
      state.items[it.id] = input.checked ? 1 : 0;
      if (!state.items[it.id]) delete state.items[it.id];
      update();
      if (input.checked) fly($("[data-price]", input.closest(".item")), it.price);
      if (shouldUpsell(hadCount)) setTimeout(showUpsell, reduced ? 0 : 1100);
    });

    $("#upsellSwitch").addEventListener("click", () => {
      const saving = upsellSaving();
      state.pkg = "premium";
      premiumItems.forEach((it) => { delete state.items[it.id]; });
      update({ pkgChanged: true });
      hideUpsell();
      toast(saving > 0 ? "Switched to Premium. You saved " + inr(saving) + "." : "Switched to Premium. Same price, more included.");
    });
    $("#upsellKeep").addEventListener("click", hideUpsell);
    $("#upsell").addEventListener("click", (e) => { if (e.target.id === "upsell") hideUpsell(); });

    $("#catBlocks").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-inc],[data-dec]");
      if (!btn) return;
      const row = btn.closest(".item"), it = items[row.dataset.item];
      const q = Math.max(0, Math.min(it.qty.max || 99, qtyOf(it.id) + (btn.hasAttribute("data-inc") ? 1 : -1)));
      if (q) state.items[it.id] = q; else delete state.items[it.id];
      update();
      if (btn.hasAttribute("data-inc")) fly(btn, it.price);
    });

    $("#timelines").addEventListener("change", (e) => {
      if (e.target.name !== "timeline") return;
      state.timeline = e.target.value;
      update();
    });

    $("#sPkg").addEventListener("click", (e) => {
      const btn = e.target.closest(".sp__toggle");
      if (!btn) return;
      featsOpen = !featsOpen;
      btn.setAttribute("aria-expanded", featsOpen);
      const ul = $(".sp__feats", $("#sPkg"));
      if (reduced) ul.style.height = featsOpen ? "auto" : "0px";
      else gsap.to(ul, { height: featsOpen ? "auto" : 0, duration: 0.7, ease: "kInOut" });
    });

    // Smooth anchor scrolling (also closes the mobile sheet)
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[data-scroll], .cats__btn");
      if (!a) return;
      e.preventDefault();
      closeSheet();
      const target = a.dataset.cat ? $("#cat-" + a.dataset.cat) : $(a.getAttribute("href"));
      const offset = a.dataset.cat ? -150 : -90;
      if (lenis) lenis.scrollTo(target, { offset, duration: 1.4 });
      else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    });

    $("#sheetOpen").addEventListener("click", openSheet);
    $("#sheetClose").addEventListener("click", closeSheet);
    $("#scrim").addEventListener("click", closeSheet);
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!$("#upsell").hidden) hideUpsell(); else closeSheet();
    });

    // Reset: first click arms the button, a second click within 3 seconds clears the selections
    let armTimer;
    const resetBtn = $("#resetBtn"), resetTxt = $(".hdr__reset-txt", resetBtn);
    const disarm = () => { clearTimeout(armTimer); resetBtn.classList.remove("is-armed"); resetTxt.textContent = "Reset"; };
    resetBtn.addEventListener("click", () => {
      if (!resetBtn.classList.contains("is-armed")) {
        resetBtn.classList.add("is-armed");
        resetTxt.textContent = "Sure?";
        armTimer = setTimeout(disarm, 3000);
        return;
      }
      disarm();
      resetQuote();
    });

    $("#copyBtn").addEventListener("click", () => copy(quoteText()));
    $("#quote").addEventListener("submit", submit);
    $("#againBtn").addEventListener("click", restart);
    ["#f-name", "#f-email"].forEach((s) => $(s).addEventListener("input", () => $(s).closest(".field").classList.contains("is-invalid") && validate()));
  }

  // ---------- "Switch to Premium" suggestion ----------
  // Premium's extras are also sold to Standard customers; once a Standard quote has UPSELL_AT or more
  // of them, Premium costs the same or less, so we say so (again each time another one is added).
  const UPSELL_AT = 2;
  const premiumItems = Object.keys(items).map((id) => items[id]).filter((it) => it.includedIn && it.includedIn.includes("premium"));
  const chosenPremium = () => premiumItems.filter((it) => qtyOf(it.id) > 0);
  const premiumOnStandard = () => (state.pkg === "standard" ? chosenPremium().length : 0);
  const shouldUpsell = (before) => { const now = premiumOnStandard(); return now >= UPSELL_AT && now > before; };
  const standardWithPremium = () => pkgById("standard").price + chosenPremium().reduce((sum, it) => sum + it.price, 0);
  const upsellSaving = () => standardWithPremium() - pkgById("premium").price;
  const listNames = (arr) => arr.length < 2 ? arr.join("") : arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
  let upsellFocus = null;
  function showUpsell() {
    if (premiumOnStandard() < UPSELL_AT) return;
    const saving = upsellSaving();
    if (saving < 0) return;
    const std = pkgById("standard"), prem = pkgById("premium");
    const chosen = chosenPremium(), rest = premiumItems.filter((it) => !chosen.includes(it));
    $("#upsellSave").textContent = saving > 0 ? "save " + inr(saving) + "." : "same price, more included.";
    $("#upsellBody").textContent = (chosen.length === premiumItems.length
      ? "You've added all " + premiumItems.length + " Premium features to " + std.name
      : "You've added " + listNames(chosen.map((it) => it.name)) + " to " + std.name) +
      ", which comes to " + inr(standardWithPremium()) + ". " + prem.name + " includes " +
      (rest.length ? "them, plus " + listNames(rest.map((it) => it.name)) + "," : "every one of them") + " for " + inr(prem.price) + ".";
    $("#upsellSwitchLabel").textContent = "Switch to " + prem.name;
    const box = $("#upsell");
    upsellFocus = document.activeElement;
    closeSheet();
    box.hidden = false;
    if (lenis) lenis.stop();
    if (!reduced) {
      gsap.timeline()
        .fromTo(box, { backgroundColor: "rgba(0,0,0,0)" }, { backgroundColor: "rgba(0,0,0,0.66)", duration: 0.6, ease: "power2.out" })
        .fromTo(".upsell__panel", { clipPath: "inset(100% 0% 0% 0% round 24px)", y: 40 }, { clipPath: "inset(0% 0% 0% 0% round 24px)", y: 0, duration: 0.9, ease: "kInOut" }, 0)
        .from(".upsell__title .line > span", { yPercent: 115, duration: 1.1, stagger: 0.08 }, 0.45)
        .from([".upsell__eyebrow", "#upsellBody", ".upsell__row"], { opacity: 0, y: 20, duration: 0.9, stagger: 0.06 }, 0.6);
    }
    $("#upsellSwitch").focus({ preventScroll: true });
  }
  function hideUpsell() {
    const box = $("#upsell");
    if (box.hidden) return;
    const done = () => {
      box.hidden = true;
      gsap.set([box, ".upsell__panel"], { clearProps: "all" });
      if (lenis) lenis.start();
      if (upsellFocus && upsellFocus.focus) upsellFocus.focus({ preventScroll: true });
    };
    if (reduced) done();
    else gsap.to(".upsell__panel", { opacity: 0, y: 30, duration: 0.4, ease: "power2.in", onComplete: done });
  }

  function openSheet() { document.body.classList.add("sheet-open"); if (lenis) lenis.stop(); }
  function closeSheet() { document.body.classList.remove("sheet-open"); if (lenis) lenis.start(); }

  // ---------- Quote text / copy ----------
  function quoteText(d) {
    const t = totals();
    const out = ["Krasis website quote " + state.ref, ""];
    if (t.pkg) out.push("Package: " + t.pkg.name + " — " + inr(t.pkg.price));
    else out.push("Package: not chosen yet");
    const inc = Object.keys(items).filter((id) => included(items[id])).map((id) => items[id].name);
    if (inc.length) out.push("Included with package: " + inc.join(", "));
    if (t.lines.length) { out.push("", "Add-ons:"); t.lines.forEach((l) => out.push("- " + l.name + ": " + inr(l.amount) + (l.recurring ? " / month" : ""))); }
    out.push("", "One-time total: " + inr(t.total));
    if (t.monthly) out.push("Monthly: " + inr(t.monthly) + " / month");
    out.push("Confirmation payment: " + inr(Q.deposit));
    if (d) {
      out.push("", "Name: " + d.name, "Email: " + d.email);
      if (d.phone) out.push("Phone: " + d.phone);
      if (d.brand) out.push("Business: " + d.brand);
      if (d.notes) out.push("", "Notes:", d.notes);
    }
    return out.join("\n");
  }

  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg; el.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-on"), 2000);
  }
  function copy(text) {
    const done = () => toast("Quote copied");
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
    function fallback() {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { toast("Couldn't copy"); }
      ta.remove();
    }
  }

  // ---------- Submit ----------
  function validate() {
    let first = null;
    const set = (sel, msg) => {
      const f = $(sel).closest(".field");
      f.classList.toggle("is-invalid", !!msg);
      $(".field__err", f).textContent = msg || "";
      if (msg && !first) first = $(sel);
    };
    const name = $("#f-name").value.trim(), email = $("#f-email").value.trim();
    set("#f-name", name ? "" : "Please tell us your name.");
    set("#f-email", !email ? "We need an email to send your quote." : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? "" : "That email doesn't look right.");
    return first;
  }

  function submit(e) {
    e.preventDefault();
    const status = $("#formStatus");
    status.textContent = "";
    if (!state.pkg) {
      status.textContent = "Choose a package first.";
      const pk = $("#packages");
      if (lenis) lenis.scrollTo("#step-1", { offset: -90, duration: 1.2 });
      pk.classList.remove("is-shake"); void pk.offsetWidth; pk.classList.add("is-shake");
      return;
    }
    const bad = validate();
    if (bad) { bad.focus(); status.textContent = "Please check the highlighted fields."; return; }
    if ($("#f-website").value) { showDone($("#f-email").value.trim()); return; } // honeypot

    const d = {
      name: $("#f-name").value.trim(), email: $("#f-email").value.trim(),
      phone: $("#f-phone").value.trim(), brand: $("#f-brand").value.trim(), notes: $("#f-notes").value.trim()
    };
    const t = totals();
    const params = {
      name: d.name,
      email: d.email,
      reply_to: d.email,
      brand: d.brand || "-",
      needs: t.lines.length ? t.lines.map((l) => l.name).join(", ") : "No add-ons",
      plan: t.pkg.name + " (" + inr(t.pkg.price) + ")",
      budget: "Quote " + state.ref + ": " + inr(t.total) + (t.monthly ? " + " + inr(t.monthly) + "/month" : "") + " · " + t.timeline.name + " timeline",
      message: quoteText(d)
    };
    const btn = $("#submitBtn"), label = $(".btn__label", btn);
    btn.disabled = true; label.textContent = "Sending";
    fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service_id: Q.emailjs.serviceId, template_id: Q.emailjs.templateId, user_id: Q.emailjs.publicKey, template_params: params })
    }).then((res) => {
      if (!res.ok) throw new Error("send failed");
      showDone(d.email);
    }).catch(() => {
      btn.disabled = false; label.textContent = "Send my quote";
      const mail = "mailto:" + Q.contactEmail + "?subject=" + encodeURIComponent("Website quote " + state.ref) + "&body=" + encodeURIComponent(quoteText(d));
      status.innerHTML = 'Something went wrong sending your quote. <a href="' + esc(mail) + '">Email it to us instead</a>.';
    });
  }

  function showDone(email) {
    const t = totals();
    $("#doneRef").textContent = "Quote " + state.ref + " · " + inr(t.total);
    $("#doneLead").textContent = "Thank you. We've got your quote and will reply to " + email + " within 24 hours to confirm everything and plan your build.";
    const done = $("#done");
    done.hidden = false;
    if (lenis) lenis.stop();
    if (!reduced) {
      gsap.timeline()
        .fromTo($(".done__panel", done), { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.0, ease: "kInOut" })
        .from($$(".done__title .line > span", done), { yPercent: 115, duration: 1.1, stagger: 0.1 }, 0.55)
        .from([$("#doneRef"), $("#doneLead"), $(".done__row", done)], { opacity: 0, y: 24, duration: 1, stagger: 0.08 }, 0.8);
    }
    done.focus({ preventScroll: true });
  }

  // Clears the package, add-ons and timeline (contact details stay), then returns to step 1
  function resetQuote() {
    state.pkg = null; state.items = {}; state.timeline = Q.timelines[0].id; state.ref = makeRef();
    featsOpen = false;
    closeSheet();
    update({ pkgChanged: true });
    toast("Quote reset");
    const step1 = $("#step-1");
    if (step1.getBoundingClientRect().top < 0) {
      if (lenis) lenis.scrollTo(step1, { offset: -90, duration: 1.4 });
      else step1.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    }
  }

  function restart() {
    state.pkg = null; state.items = {}; state.timeline = Q.timelines[0].id; state.ref = makeRef();
    $("#quote").reset();
    update({ instant: true, pkgChanged: true });
    const done = $("#done");
    const finish = () => { done.hidden = true; if (lenis) { lenis.start(); lenis.scrollTo("#step-1", { offset: -90, immediate: true }); } };
    if (reduced) finish();
    else gsap.to(done, { opacity: 0, duration: 0.5, onComplete: () => { gsap.set(done, { clearProps: "opacity" }); finish(); } });
  }

  // ---------- Motion ----------
  let lenis = null;
  function smooth() {
    if (reduced || typeof Lenis === "undefined") return;
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  function intro() {
    const curtain = $(".curtain");
    const lines = $$(".hero__title .line > span");
    if (reduced) { curtain.remove(); return; }
    gsap.set(lines, { yPercent: 115 });
    gsap.set("[data-hero]", { opacity: 0, y: 24 });
    gsap.timeline({ delay: 0.1 })
      .fromTo(".curtain__logo", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.0, ease: "kInOut" })
      .to(".curtain__logo", { opacity: 0, y: -20, duration: 0.5, ease: "power2.in" }, "+=0.15")
      .to(curtain, { yPercent: -100, duration: 1.1, ease: "kInOut", onComplete: () => curtain.remove() }, "-=0.2")
      .from(".band", { xPercent: 40, opacity: 0, duration: 1.6, stagger: 0.08 }, "-=0.7")
      .to(lines, { yPercent: 0, duration: 1.3, stagger: 0.1 }, "<0.1")
      .to("[data-hero]", { opacity: 1, y: 0, duration: 1.1, stagger: 0.08 }, "<0.35")
      .from(".hdr > *", { opacity: 0, y: -12, duration: 0.9, stagger: 0.06 }, "<");
  }

  function scrollMotion() {
    if (reduced) return;
    // Bands drift slowly as the hero leaves
    gsap.to(".band", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero__inner", { yPercent: -12, opacity: 0.3, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    // Section titles: masked line reveals
    $$(".step__title, .done__title").forEach((title) => {
      if (title.closest(".done")) return;
      gsap.from($$(".line > span", title), { yPercent: 115, duration: 1.3, stagger: 0.1, scrollTrigger: { trigger: title, start: "top 85%" } });
    });
    $$(".step__n, .step__lead").forEach((el) => gsap.from(el, { opacity: 0, y: 20, duration: 1, scrollTrigger: { trigger: el, start: "top 90%" } }));

    // Cards and rows rise in, staggered as they enter
    ScrollTrigger.batch(".pkg, .time, .cat__head, .item, .field, .submit-row", {
      start: "top 92%",
      once: true,
      onEnter: (els) => gsap.from(els, { opacity: 0, y: 40, duration: 1.1, stagger: 0.06, overwrite: true })
    });

    // Pointer tilt on package cards
    if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
      $$(".pkg").forEach((card) => {
        const rx = gsap.quickTo(card, "rotationX", { duration: 0.8, ease: "power3.out" });
        const ry = gsap.quickTo(card, "rotationY", { duration: 0.8, ease: "power3.out" });
        gsap.set(card, { transformPerspective: 1200 });
        card.addEventListener("pointermove", (e) => {
          const r = card.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 6);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 6);
        });
        card.addEventListener("pointerleave", () => { rx(0); ry(0); });
      });
      // Magnetic buttons
      $$(".btn").forEach((b) => {
        const mx = gsap.quickTo(b, "x", { duration: 0.6, ease: "power3.out" });
        const my = gsap.quickTo(b, "y", { duration: 0.6, ease: "power3.out" });
        b.addEventListener("pointermove", (e) => {
          const r = b.getBoundingClientRect();
          mx((e.clientX - r.left - r.width / 2) * 0.18);
          my((e.clientY - r.top - r.height / 2) * 0.3);
        });
        b.addEventListener("pointerleave", () => { mx(0); my(0); });
      });
    }
  }

  function progress() {
    const bar = $("#progBar"), num = $("#stepNum");
    const steps = $$(".step");
    // Step counter and the mobile total bar are derived from which triggers are active right now,
    // so they stay correct after layout refreshes (not only when a trigger toggles)
    const stepSTs = steps.map((s) => ScrollTrigger.create({ trigger: s, start: "top 55%", end: "bottom 55%", onToggle: () => syncUI() }));
    const layoutST = ScrollTrigger.create({ trigger: ".layout", start: "top 70%", end: "bottom 40%", onToggle: () => syncUI() });
    function syncUI() {
      let n = 0;
      stepSTs.forEach((st, i) => { if (st.isActive) n = i + 1; });
      num.textContent = pad(n) + " / " + pad(steps.length);
      document.body.classList.toggle("mbar-on", !!layoutST.isActive);
    }
    ScrollTrigger.addEventListener("refresh", syncUI);
    ScrollTrigger.addEventListener("scrollEnd", syncUI);
    ScrollTrigger.create({
      trigger: ".steps", start: "top 60%", end: "bottom bottom",
      onUpdate: (self) => gsap.set(bar, { scaleX: self.progress })
    });

    // Category pills follow the scroll; the filled pill slides between them
    const ind = $(".cats__ind");
    const moveInd = (btn) => {
      $$(".cats__btn").forEach((b) => b.classList.toggle("is-active", b === btn));
      if (!btn) { gsap.to(ind, { width: 0, duration: 0.4 }); return; }
      gsap.to(ind, { x: btn.offsetLeft, width: btn.offsetWidth, duration: reduced ? 0 : 0.7, ease: "kOut" });
      const nav = $("#cats");
      const want = btn.offsetLeft - nav.clientWidth / 2 + btn.offsetWidth / 2;
      nav.scrollTo({ left: want, behavior: reduced ? "auto" : "smooth" });
    };
    $$(".cat").forEach((block) => {
      ScrollTrigger.create({
        trigger: block, start: "top 45%", end: "bottom 45%",
        onToggle: (self) => { if (self.isActive) moveInd($('.cats__btn[data-cat="' + block.dataset.catBlock + '"]')); }
      });
    });
    ScrollTrigger.create({ trigger: "#catBlocks", start: "top 45%", end: "bottom 45%", onToggle: (self) => { if (!self.isActive) moveInd(null); } });
  }

  // ---------- Boot ----------
  // Always open at the top, so the curtain intro plays on the hero
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  renderPackages();
  renderCats();
  renderTimelines();
  $("#statAddons").textContent = pad(Object.keys(items).length);
  $("#footMail").textContent = Q.contactEmail;
  $("#footMail").href = "mailto:" + Q.contactEmail;
  update({ instant: true, pkgChanged: true });
  bind();
  smooth();
  document.fonts.ready.then(() => {
    intro();
    scrollMotion();
    progress();
    ScrollTrigger.refresh();
  });
})();
