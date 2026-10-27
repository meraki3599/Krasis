/*
  pages/contact.js — Contact (/contact/, optional ?plan=standard|premium preselects the plan).
  Left: email (copy), Instagram, location, reply line. Right: the underlined form (see form.js).
  Depends on: utils.js, ui.js, form.js, config.js.
*/
(function (K) {
  K.pages = K.pages || {};
  var NEEDS = ["New website", "Redesign", "E-commerce", "Scroll animations", "Not sure"];
  var PLANS = [["standard", "Standard ₹20,000"], ["premium", "Premium ₹25,000"], ["not-sure", "Not sure"]];

  function field(name, label, type, opts) {
    opts = opts || {};
    var input = type === "textarea"
      ? '<textarea id="f-' + name + '" name="' + name + '" rows="4" placeholder=" "' + (opts.required ? " required" : "") + ' aria-describedby="e-' + name + '"></textarea>'
      : '<input id="f-' + name + '" name="' + name + '" type="' + type + '" placeholder=" "' + (opts.auto ? ' autocomplete="' + opts.auto + '"' : "") + (opts.required ? " required" : "") + ' aria-describedby="e-' + name + '">';
    return '<div class="field' + (type === "textarea" ? " field--area" : "") + '">' + input +
      '<label for="f-' + name + '">' + label + (opts.required ? "" : ' <span class="mute">(optional)</span>') + "</label>" +
      '<span class="field__line" aria-hidden="true"></span>' +
      '<span class="field__error" id="e-' + name + '" aria-live="polite"></span></div>';
  }

  K.pages.contact = {
    compactFooter: true, // the page headline already is the footer line
    render: function (params, query) {
      var cfg = K.config;
      var plan = (query && query.plan) || "";
      var chips = NEEDS.map(function (n, i) {
        return '<label class="chip"><input type="checkbox" name="needs" value="' + n + '"><span>' + n + "</span></label>";
      }).join("");
      var plans = PLANS.map(function (p) {
        return '<label class="chip"><input type="radio" name="plan" value="' + p[1] + '"' + (plan === p[0] ? " checked" : "") + "><span>" + p[1] + "</span></label>";
      }).join("");

      return '<section class="page-hero section contact" aria-labelledby="contact-h1">' + K.ui.rule() +
        '<div class="container grid">' +
        '<h1 class="h1 page-hero__title c-1-9" id="contact-h1" data-anim="lines" data-manual>' + K.esc(K.copy.cta.title) + "</h1>" +
        "</div>" +
        '<div class="container grid contact__grid mt-xl">' +
        '<aside class="contact__info c-1-5" data-anim="stagger">' +
        '<div><p class="label">Email</p><button type="button" class="contact__big link-draw" data-copy="' + K.esc(cfg.email) + '" data-cursor="Copy">' + K.esc(cfg.email) + "</button></div>" +
        '<div><p class="label">Instagram</p><a class="contact__big link-draw ig" href="https://www.instagram.com/' + K.esc(cfg.instagram) + '" target="_blank" rel="noopener">' + K.ui.igIcon() + K.esc(cfg.instagram) + "</a></div>" +
        '<div><p class="label">Location</p><p class="contact__big">' + K.esc(cfg.location) + "</p></div>" +
        '<p class="mute">' + K.esc(cfg.replyLine) + "</p>" +
        "</aside>" +
        '<div class="c-6-12">' +
        '<form class="form" novalidate aria-label="Project enquiry">' +
        field("name", "Name", "text", { required: true, auto: "name" }) +
        field("email", "Email", "email", { required: true, auto: "email" }) +
        field("brand", "Business / brand name", "text", { auto: "organization" }) +
        '<fieldset class="chips"><legend class="label">What do you need?</legend><div class="chips__row">' + chips + "</div></fieldset>" +
        '<fieldset class="chips"><legend class="label">Plan</legend><div class="chips__row">' + plans + "</div></fieldset>" +
        field("budget", "Budget and timeline", "text") +
        field("message", "Message", "textarea", { required: true }) +
        // Honeypot: hidden from people, tempting for bots
        '<div class="hp" aria-hidden="true"><label for="f-website">Website</label><input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>' +
        '<div class="form__foot"><button class="btn btn--lg" type="submit" data-magnetic><span class="btn__dot" aria-hidden="true"></span><span>Send enquiry</span>' + K.ui.arrow() + "</button>" +
        '<p class="form__status" data-form-status role="alert"></p></div>' +
        "</form>" +
        '<div class="form-success" hidden tabindex="-1">' +
        '<p class="h1">Thank you. We\'ll be in touch.</p>' +
        '<p class="body mute mt-s" data-success-note></p>' +
        '<div class="form-success__mark mt-l">' + K.ui.krasis() + "</div>" +
        "</div>" +
        "</div></div></section>";
    },
    mount: function (root) {
      K.form.mount(K.$(".form", root), K.$(".form-success", root));
    },
    intro: function (root) { K.reveal.play(K.$(".page-hero__title", root)); }
  };
})(window.KRASIS);
