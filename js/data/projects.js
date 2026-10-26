/*
  data/projects.js — every client project. One object per brand; the Home work section,
  the Work index and the case study pages all read from this list.
  Depends on: config.js (window.KRASIS).

  To replace placeholders:
  - logo: drop the file at the path given (PNG or SVG; update the extension here if you use SVG).
  - Every text field marked "placeholder: true" is shown with a dashed tag until you edit it and set the flag to false.
*/
(function (K) {
  function ph(text) { return { text: text, placeholder: true }; }

  K.projects = [
    {
      slug: "1bhk",
      name: "1BHK",
      fullName: "1BHK (Bar Haute Kitchen)",
      logo: "assets/logos/1bhk.png",
      logoFilter: "grayscale(1) brightness(1.5) contrast(1.1)",
      category: "Hospitality",
      type: "Cinematic hospitality website",
      year: ph("2026"),
      timeline: ph("Add timeline"),
      services: ["Design", "Development", "Scroll animation"],
      lead: true,
      brief: ph("Placeholder brief: describe what 1BHK needed, who the audience is and what the old web presence was missing."),
      approach: ph("Placeholder approach: describe the creative direction, the scroll story and the key interactions you built."),
      details: [ph("Detail or result one"), ph("Detail or result two"), ph("Detail or result three")]
    },
    {
      slug: "2bhk",
      name: "2BHK",
      fullName: "2BHK (Bar Haute Kitchen)",
      logo: "assets/logos/2bhk.png",
      logoFilter: "grayscale(1) brightness(1.5) contrast(1.1)",
      category: "Hospitality",
      type: "Cinematic hospitality website",
      year: ph("2026"),
      timeline: ph("Add timeline"),
      services: ["Design", "Development", "Scroll animation"],
      lead: true,
      brief: ph("Placeholder brief: describe what 2BHK needed, who the audience is and what the old web presence was missing."),
      approach: ph("Placeholder approach: describe the creative direction, the scroll story and the key interactions you built."),
      details: [ph("Detail or result one"), ph("Detail or result two"), ph("Detail or result three")]
    },
    {
      slug: "ballr",
      name: "Ballr",
      fullName: "Ballr",
      logo: "assets/logos/ballr.png",
      logoFilter: "grayscale(1) brightness(2.4)",
      category: "Hospitality",
      type: "Cinematic hospitality website",
      year: ph("2026"),
      timeline: ph("Add timeline"),
      services: ["Design", "Development", "Scroll animation"],
      lead: true,
      brief: ph("Placeholder brief: describe what Ballr needed, who the audience is and what the old web presence was missing."),
      approach: ph("Placeholder approach: describe the creative direction, the scroll story and the key interactions you built."),
      details: [ph("Detail or result one"), ph("Detail or result two"), ph("Detail or result three")]
    },
    {
      slug: "home-decor",
      name: "Home Decor",
      fullName: "Home Decor",
      logo: "assets/logos/home-decor.png",
      // The supplied artwork is light-filled with dark outlines; inverting keeps the outlines readable on black.
      logoFilter: "grayscale(1) invert(1) contrast(1.6) brightness(1.5)",
      category: "Retail",
      type: ph("Retail website"),
      year: ph("2026"),
      timeline: ph("Add timeline"),
      services: ["Design", "Development", "Responsive build"],
      brief: ph("Placeholder brief: describe what Home Decor needed, who the audience is and what the old web presence was missing."),
      approach: ph("Placeholder approach: describe the creative direction and the key pages you built."),
      details: [ph("Detail or result one"), ph("Detail or result two"), ph("Detail or result three")]
    },
    {
      slug: "luminae",
      name: "Luminae",
      fullName: "Luminae",
      logo: "assets/logos/luminae.png",
      // The supplied artwork is dark on light; inverting turns it light on the black site
      logoFilter: "grayscale(1) invert(1) brightness(0.92)",
      category: "Retail",
      type: ph("Candle brand website"),
      year: ph("2026"),
      timeline: ph("Add timeline"),
      services: ["Design", "Development"],
      brief: ph("Placeholder brief: describe what Luminae needed, who the audience is and what the old web presence was missing."),
      approach: ph("Placeholder approach: describe the creative direction and the key pages you built."),
      details: [ph("Detail or result one"), ph("Detail or result two"), ph("Detail or result three")]
    }
  ];

  K.projectBySlug = function (slug) {
    for (var i = 0; i < K.projects.length; i++) if (K.projects[i].slug === slug) return K.projects[i];
    return null;
  };
})(window.KRASIS);
