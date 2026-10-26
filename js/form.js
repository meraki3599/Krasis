/*
  form.js — contact form: inline validation, honeypot, then sends via EmailJS (config.emailjs), or a
  Formspree-style config.formEndpoint, or a prefilled mailto: fallback when neither is set. Success replaces the form with a thank-you state.
  Usage: K.form.mount(formEl, successEl)
  Depends on: utils.js, config.js.
*/
(function (K) {
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var rules = {
    name: function (v) { return v.trim().length >= 2 || "Please tell us your name."; },
    email: function (v) { return EMAIL_RE.test(v.trim()) || "Please enter a valid email address."; },
    message: function (v) { return v.trim().length >= 10 || "A few words about the project, please (10+ characters)."; }
  };

  function fieldError(form, name, msg) {
    var input = form.elements[name];
    var wrap = input.closest(".field");
    var err = wrap.querySelector(".field__error");
    if (msg === true || !msg) {
      wrap.classList.remove("is-invalid");
      input.removeAttribute("aria-invalid");
      err.textContent = "";
      return true;
    }
    wrap.classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
    err.textContent = msg;
    return false;
  }

  function validate(form, only) {
    var ok = true, first = null;
    Object.keys(rules).forEach(function (name) {
      if (only && only !== name) return;
      var valid = fieldError(form, name, rules[name](form.elements[name].value));
      if (!valid) { ok = false; first = first || form.elements[name]; }
    });
    return { ok: ok, first: first };
  }

  function collect(form) {
    var needs = K.$$('input[name="needs"]:checked', form).map(function (i) { return i.value; });
    var plan = form.querySelector('input[name="plan"]:checked');
    return {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      brand: form.elements.brand.value.trim(),
      needs: needs.join(", "),
      plan: plan ? plan.value : "",
      budget: form.elements.budget.value.trim(),
      message: form.elements.message.value.trim()
    };
  }

  function mailto(d) {
    var body = [
      "Name: " + d.name,
      "Email: " + d.email,
      "Business / brand: " + (d.brand || "-"),
      "What we need: " + (d.needs || "-"),
      "Plan: " + (d.plan || "-"),
      "Budget and timeline: " + (d.budget || "-"),
      "",
      d.message
    ].join("\n");
    return "mailto:" + K.config.email + "?subject=" + encodeURIComponent("New project enquiry from " + d.name) + "&body=" + encodeURIComponent(body);
  }

  // EmailJS REST API first (no SDK needed), then a Formspree-style endpoint; null means use mailto
  function buildRequest(d) {
    var ej = K.config.emailjs || {};
    if (ej.serviceId && ej.templateId && ej.publicKey) {
      var params = {};
      Object.keys(d).forEach(function (k) { params[k] = d[k] || "-"; });
      params.reply_to = d.email;
      return {
        url: "https://api.emailjs.com/api/v1.0/email/send",
        body: { service_id: ej.serviceId, template_id: ej.templateId, user_id: ej.publicKey, template_params: params }
      };
    }
    if (K.config.formEndpoint) return { url: K.config.formEndpoint, body: d };
    return null;
  }

  function success(form, successEl, note) {
    var noteEl = successEl.querySelector("[data-success-note]");
    if (noteEl) noteEl.textContent = note || "";
    gsap.to(form, {
      opacity: 0, y: -16, duration: 0.5, ease: "kInOut",
      onComplete: function () {
        form.hidden = true;
        successEl.hidden = false;
        gsap.fromTo(successEl, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.2 });
        successEl.focus({ preventScroll: true });
        ScrollTrigger.refresh();
      }
    });
  }

  function mount(form, successEl) {
    var status = form.querySelector("[data-form-status]");
    var submit = form.querySelector('[type="submit"]');

    // Validate a field once the visitor leaves it, then live while they fix it
    Object.keys(rules).forEach(function (name) {
      var input = form.elements[name];
      K.listen(input, "blur", function () { if (input.value) validate(form, name); });
      K.listen(input, "input", function () {
        if (input.closest(".field").classList.contains("is-invalid")) validate(form, name);
      });
    });

    K.listen(form, "submit", function (e) {
      e.preventDefault();
      status.textContent = "";
      if (form.elements.website && form.elements.website.value) {
        // Honeypot filled: pretend success, send nothing
        success(form, successEl);
        return;
      }
      var v = validate(form);
      if (!v.ok) { v.first.focus(); status.textContent = "Please check the highlighted fields."; return; }

      var data = collect(form);
      var request = buildRequest(data);
      if (!request) {
        window.location.href = mailto(data);
        success(form, successEl, "Your email app should have opened with the message ready to send.");
        return;
      }
      submit.disabled = true;
      submit.querySelector("span:not(.btn__dot)").textContent = "Sending";
      fetch(request.url, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(request.body)
      }).then(function (res) {
        if (!res.ok) throw new Error("Bad response");
        success(form, successEl);
      }).catch(function () {
        submit.disabled = false;
        submit.querySelector("span:not(.btn__dot)").textContent = "Send enquiry";
        status.innerHTML = 'Something went wrong sending the form. <a class="link-draw" href="' + K.esc(mailto(data)) + '">Send it by email instead</a>.';
      });
    });
  }

  K.form = { mount: mount };
})(window.KRASIS);
