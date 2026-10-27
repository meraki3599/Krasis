/*
  data/seo.js — one entry per page: its address, search-result title and description.
  The router sets these on every page change, and tools/build-pages.js bakes them into each page's
  HTML (krasis.in/about/ etc.) so search engines see them without running JavaScript.
  Depends on: config.js (window.KRASIS).
*/
(function (K) {
  K.seo = {
    home: {
      path: "",
      title: "Krasis | Web Design & Development Studio in Pune",
      description: "Krasis is a boutique web design and development studio in Pune, India. We build custom, cinematic, scroll-driven websites with no templates. Plans from ₹20,000."
    },
    work: {
      path: "work",
      title: "Our Work | Krasis, Web Design Studio in Pune",
      description: "Websites designed and built by Krasis, a Pune web design studio, for 1BHK, 2BHK, Ballr, Home Decor and Luminae."
    },
    services: {
      path: "services",
      title: "Services | Custom Website Design & Development | Krasis",
      description: "Custom website design and development, immersive scroll animations, responsive builds and end-to-end delivery from Krasis, Pune."
    },
    process: {
      path: "process",
      title: "Our Process | Krasis Web Design, Pune",
      description: "Discovery, proposal, design, development, review and launch: how Krasis builds your website. Simple process. Zero guesswork."
    },
    pricing: {
      path: "pricing",
      title: "Website Design Pricing | Krasis, Pune",
      description: "Transparent website pricing from Krasis: Standard ₹20,000 or Premium ₹25,000 for a fully custom, responsive website with scroll animations."
    },
    about: {
      path: "about",
      title: "About Krasis | Premium Web Design Studio in Pune",
      description: "Krasis is a premium web design and development studio in Pune, India, crafting bespoke, high-performance websites that build trust and drive growth."
    },
    contact: {
      path: "contact",
      title: "Contact Krasis | Start Your Website Project",
      description: "Start a website project with Krasis, a web design studio in Pune. Email contactkrasis@gmail.com or send an enquiry and we'll reply within 24 hours."
    },
    notfound: {
      path: null,
      title: "Page not found | Krasis",
      description: "This page doesn't exist. Your next website should."
    }
  };
})(window.KRASIS);
