/*
  pages/home.js — Home view (/): ten sections in order. Each section owns its markup and motion.
  Depends on: hero.js, sections/*.js, utils.js.
*/
(function (K) {
  K.pages = K.pages || {};
  var order = ["problem", "intro", "vision", "work", "process", "included", "pricing", "why", "cta"];

  K.pages.home = {
    compactFooter: true,
    render: function () {
      return K.hero.render() + order.map(function (k) { return K.sections[k].render(); }).join("");
    },
    mount: function (root) {
      K.hero.mount(root);
      order.forEach(function (k) { K.sections[k].mount(root); });
    },
    intro: function (root) { K.hero.intro(root); }
  };
})(window.KRASIS);
