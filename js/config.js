/*
  config.js — site-wide settings. Edit this file, nothing else needs to change.
  Depends on: nothing. Creates window.KRASIS.
*/
window.KRASIS = window.KRASIS || {};

window.KRASIS.config = {
  // EmailJS (emailjs.com): paste the three IDs from your EmailJS dashboard. These are meant to be public.
  // When all three are filled in, the contact form sends through EmailJS (see README → Contact form).
  emailjs: {
    serviceId: "service_Krasis",      // Email Services → your Gmail service
    templateId: "template_2ushekd",   // Email Templates → your template
    publicKey: "VQbaMhEWsr4x7DzRM"    // Account → General → Public Key
  },

  // Alternative form endpoint (Formspree-style), used only if EmailJS isn't set up.
  // Leave both empty to fall back to a prefilled mailto: link.
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
