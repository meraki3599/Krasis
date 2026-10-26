/*
  data/copy.js — every piece of written copy on the site, verbatim from the Krasis decks.
  Depends on: config.js (window.KRASIS). Edit text here; views read from KRASIS.copy.
*/
(function (K) {
  var included = [
    "Fully custom website design, made for your brand, no templates",
    "Complete development: clean, fast, and responsive across all devices",
    "Scroll animations & interactions (where applicable)",
    "Mobile optimisation: looks perfect on every screen size",
    "Final source files and full ownership of your website",
    "Launch support: we're with you on go-live day",
    "Post-launch check-in: we follow up to make sure everything's running smoothly"
  ];

  var planBase = [
    "Fully custom website design, made for your brand, no templates",
    "Complete development, clean, fast, and responsive across all devices",
    "Scroll animations & interactions (where applicable)",
    "Mobile optimisation, looks perfect on every screen size",
    "Final source files and full ownership of your website",
    "Launch support, we're with you on go-live day",
    "Post-launch check-in, we follow up to make sure everything's running smoothly"
  ];
  var planExtras = [
    "Updates forever, you can request ANY changes to be made after the launch, forever",
    "Comprehensive walkthrough after the work is done, we will give a complete tour of the website",
    "Priority pass, we will assist you and make your website on priority"
  ];

  K.copy = {
    nav: [
      { label: "Home", href: "#/" },
      { label: "Work", href: "#/work" },
      { label: "Services", href: "#/services" },
      { label: "Process", href: "#/process" },
      { label: "Pricing", href: "#/pricing" },
      { label: "About", href: "#/about" },
      { label: "Contact", href: "#/contact" }
    ],

    hero: {
      lines: ["Get your website", "the right way:", "the", "[logo]", "way"]
    },

    problem: {
      title: "Your website is your first impression. Most businesses are getting it wrong.",
      body: [
        "In today's world, before a customer walks through your door, books your service, or buys your product, they've already Googled you. And what they find in those first few seconds determines whether they stay or leave.",
        "The problem is that most businesses are either stuck with an outdated website, a generic template that looks like a thousand others, or no web presence at all. That costs you credibility. It costs you customers. And it costs you the ability to compete with brands that are showing up better than you online."
      ],
      final: "A bad website doesn't just fail to impress. It actively pushes people away."
    },

    intro: {
      body: "Krasis is a web development studio that builds custom, high-quality websites tailored to your brand. We don't do cookie-cutter templates or rushed builds. Every project we take on is designed from the ground up, built around who you are, what you offer, and the kind of impression you want to leave.",
      listLabel: "We specialise in:",
      services: [
        { n: "01", title: "Custom Website Design & Development", text: "fully built to your brand, not a template" },
        { n: "02", title: "Immersive Scroll Animations & Interactions", text: "websites that move, breathe, and engage" },
        { n: "03", title: "Responsive Builds", text: "flawless across mobile, tablet, and desktop" },
        { n: "04", title: "End-to-End Delivery", text: "from the first conversation to the final launch, we handle everything" }
      ],
      closing: "Whether you're a restaurant, a retail brand, a creative studio, or a growing business, if you care about how you show up online, we're the team for you."
    },

    vision: "At Krasis, we envision a digital landscape where the line between design and experience disappears entirely. A world where visiting a website feels less like browsing a page and more like stepping into a world, one that reflects the soul of the brand behind it. We believe the web is one of the most powerful creative mediums of our time, and we exist to prove that. Our vision is to be the studio that emerging and established brands turn to when they want more than just a website, when they want something that genuinely represents who they are, stops people mid-scroll, and leaves a lasting impression long after the tab is closed.",
    mission: "Krasis was built on a simple belief, that great design and great engineering should never be a luxury. Our mission is to deliver custom, high-quality web experiences that are as thoughtful as they are technically precise. Every project we take on, whether it's an immersive hospitality website with cinematic scroll animations or a clean e-commerce build for a growing brand, is approached with the same level of care and intention. We work closely with our clients, taking the time to understand not just what they do, but why they do it, because that's what makes the difference between a website that exists and a website that works. At Krasis, we don't build templates. We build identities.",
    pullQuote: "We don't build templates. We build identities.",

    work: {
      title: "Our work",
      subtitle: "We have worked with countless brands including brands like:"
    },

    process: {
      title: "Simple process. Zero guesswork.",
      steps: [
        { n: "01", title: "Discovery", text: "We start with a conversation. We learn about your brand, your goals, your audience, and what you need from your website. No jargon, no complicated forms, just a real chat." },
        { n: "02", title: "Proposal & Quote", text: "Based on what we discussed, we put together a clear proposal outlining exactly what we'll build, the timeline, and the cost. No hidden fees, no surprises." },
        { n: "03", title: "Design Phase", text: "We begin designing your website: layouts, colours, typography, and the overall feel. You'll see it take shape and have the chance to give feedback before a single line of code is written." },
        { n: "04", title: "Development", text: "Once the design is approved, we build it. Every interaction, animation, and page, coded cleanly and precisely." },
        { n: "05", title: "Review & Revisions", text: "We walk you through the finished build and make any final adjustments. This is your chance to refine anything before it goes live." },
        { n: "06", title: "Launch & Handover", text: "We launch your website and hand everything over to you: files, access, the works. And if you need anything after, we're still here." }
      ]
    },

    included: {
      title: "Here's exactly what's included.",
      intro: "When you work with Krasis, you're not just getting a website. You're getting a complete, professionally built digital presence, delivered with care and built to last.",
      listLabel: "Every project includes:",
      items: included
    },

    pricing: {
      title: "Transparent pricing. No surprises.",
      plans: [
        { id: "standard", name: "Standard", price: 20000, features: planBase, extras: [], cta: "Start with Standard" },
        { id: "premium", name: "Premium", price: 25000, features: planBase, extras: planExtras, cta: "Go Premium", note: "This is a steal for only ₹5,000 more." }
      ],
      footnote: "*A confirmation payment of ₹5,000 is required before the start of the project. The remaining funds will be transferred after completion."
    },

    why: {
      title: "Why not just use Wix? Or hire a big agency?",
      opening: "It's a fair question. Here's the honest answer.",
      contrasts: [
        "Template builders like Wix or Squarespace are fast and cheap, but they're also limiting, generic, and immediately recognisable as a template. Your brand deserves better than looking like everyone else.",
        "Big agencies, on the other hand, are expensive, slow, and you're rarely their priority. You become a ticket in a system."
      ],
      pivot: "Krasis sits in a different space entirely. We're a boutique studio, small enough to give every client genuine attention, skilled enough to deliver work that competes with anything out there.",
      principles: [
        "Everything is custom. No templates, no shortcuts, no compromise.",
        "You work directly with the people building your site. No account managers, no middlemen.",
        "We care about the details. The animations, the spacing, the way a page feels to scroll through, it all matters to us.",
        "We're builders at heart. We love what we do, and that shows in the work."
      ]
    },

    cta: { title: "Let's build something great together." },

    about: {
      overview: "Krasis is a premium web design and development studio dedicated to creating sophisticated, high-performance websites that elevate businesses and strengthen their digital presence. We combine modern aesthetics with strategic functionality to deliver websites that are visually refined, responsive across all devices, and designed to inspire trust and drive growth. Every project is crafted with precision, attention to detail, and a commitment to excellence, ensuring that each client receives a bespoke digital experience that reflects the quality and ambition of their brand. At Krasis, we believe a website is more than an online presence. It's the foundation of a business's digital identity.",
      mission: "At Krasis, our objective is to empower businesses with exceptional digital experiences through the creation of modern, luxurious, and high-performing websites. We strive to combine timeless design with innovative technology to help brands establish credibility, engage their audience, and achieve sustainable growth. Our commitment is to deliver tailored solutions that not only reflect each client's unique identity but also create a lasting impact in an increasingly competitive digital landscape."
    },

    notFound: "This page doesn't exist. Your next website should."
  };
})(window.KRASIS);
