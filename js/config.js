/*
  config.js — site-wide settings. Edit this file, nothing else needs to change.
  Depends on: nothing. Creates window.KRASIS.
*/
window.KRASIS = window.KRASIS || {};

window.KRASIS.config = {
  // Form endpoint (Formspree-style). Leave empty to fall back to a prefilled mailto: link.
  // Example: "https://formspree.io/f/xxxxxxx"
  formEndpoint: "",

  email: "contactkrasis@gmail.com",
  instagram: "krasis0",
  location: "Pune, India",
  replyLine: "We reply within 24 hours", // placeholder, edit freely

  // Analytics placeholder. provider: "plausible" | "ga" | null
  analytics: { provider: null, plausibleDomain: "", gaId: "" },

  // Show dashed "replace me" tags on placeholder content. Set false before launch.
  showPlaceholderTags: true,

  // Preloader runs once per browser (localStorage). Set true to always show it.
  alwaysShowPreloader: false,

  // Canonical site URL (placeholder): also update sitemap.xml and robots.txt when you have a domain
  siteUrl: "https://your-domain.com"
};
