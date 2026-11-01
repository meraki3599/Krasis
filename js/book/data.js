/*
  data.js — everything the quote builder sells. Edit prices, names and descriptions here;
  the page, the live total and the emailed quote all read from this file.
  - price: in rupees. unit: small text after the price. qty: makes the item a counter.
  - recurring: billed monthly, shown separately from the one-time total.
  - includedIn: package ids that already include this item (it shows as included, free).
*/
window.QUOTE = {
  deposit: 5000,
  depositNote: "A confirmation payment of ₹5,000 starts your project. The rest is paid after launch.",

  emailjs: { serviceId: "service_Krasis", templateId: "template_2ushekd", publicKey: "VQbaMhEWsr4x7DzRM" },
  contactEmail: "contact@krasis.in",

  packages: [
    {
      id: "standard",
      name: "Standard",
      price: 20000,
      tagline: "A fully custom website, built properly and launched with care.",
      features: [
        "Fully custom website design, made for your brand, no templates",
        "Complete development, clean, fast, and responsive across all devices",
        "Scroll animations & interactions (where applicable)",
        "Mobile optimisation, looks perfect on every screen size",
        "Final source files and full ownership of your website",
        "Launch support, we're with you on go-live day",
        "Post-launch check-in, we follow up to make sure everything's running smoothly"
      ],
      extras: []
    },
    {
      id: "premium",
      name: "Premium",
      price: 25000,
      badge: "Best value",
      tagline: "Everything in Standard, plus care that never ends.",
      note: "This is a steal for only ₹5,000 more.",
      features: [
        "Fully custom website design, made for your brand, no templates",
        "Complete development, clean, fast, and responsive across all devices",
        "Scroll animations & interactions (where applicable)",
        "Mobile optimisation, looks perfect on every screen size",
        "Final source files and full ownership of your website",
        "Launch support, we're with you on go-live day",
        "Post-launch check-in, we follow up to make sure everything's running smoothly"
      ],
      extras: [
        "Updates forever, you can request ANY changes to be made after the launch, forever",
        "Comprehensive walkthrough after the work is done, we will give a complete tour of the website",
        "Priority pass, we will assist you and make your website on priority"
      ]
    }
  ],

  // Premium's extras, sold one by one to Standard customers. Together they cost more than the
  // ₹5,000 upgrade, so adding all three triggers the "switch to Premium" suggestion.
  categories: [
    {
      id: "premium",
      name: "Premium features",
      note: "Free with Premium. On Standard, add the ones you want.",
      items: [
        { id: "updates", name: "Updates forever", desc: "Request any change to your website after launch, forever.", price: 5000, includedIn: ["premium"] },
        { id: "walkthrough", name: "Comprehensive walkthrough", desc: "A complete guided tour of your website once the work is done.", price: 2000, includedIn: ["premium"] },
        { id: "priority", name: "Priority pass", desc: "We assist you and build your website on priority.", price: 3000, includedIn: ["premium"] }
      ]
    },
    {
      id: "pages",
      name: "Pages & content",
      items: [
        { id: "extra-page", name: "Extra pages", desc: "Each package covers up to 5 pages. Add as many more as you need.", price: 2000, unit: "per page", qty: { max: 20 } },
        { id: "blog", name: "Blog or news section", desc: "A listing page and article template you can keep posting to.", price: 4000 },
        { id: "language", name: "Second language", desc: "Your whole site in one more language, with a language switcher.", price: 5000 }
      ]
    },
    {
      id: "design",
      name: "Design & motion",
      items: [
        { id: "logo", name: "Logo design", desc: "A custom logo for your brand, with two rounds of revisions.", price: 5000 },
        { id: "brand-kit", name: "Brand identity kit", desc: "Colours, typography, logo usage and a one-page brand guide.", price: 8000 },
        { id: "hero", name: "Enhanced hero animation", desc: "Every site comes with a hero animation. This takes it further: a custom, more advanced opening sequence built to stop people mid-scroll.", price: 6000 },
        { id: "icons", name: "Custom icons & illustrations", desc: "A matching set drawn for your brand.", price: 4000 }
      ]
    },
    {
      id: "features",
      name: "Features",
      items: [
        { id: "booking", name: "Bookings & reservations", desc: "Customers book a table, slot or appointment online.", price: 5000 },
        { id: "store", name: "Online store", desc: "Product pages, cart and payments for up to 25 products.", price: 12000 },
        { id: "menu", name: "Menu or catalogue", desc: "A filterable menu, catalogue or price list.", price: 3000 },
        { id: "newsletter", name: "Newsletter sign-up", desc: "Collect emails, connected to your mailing tool.", price: 1500 },
        { id: "instagram", name: "Instagram feed", desc: "Your latest posts, live on your site.", price: 2000 }
      ]
    },
    {
      id: "launch",
      name: "Launch & domain",
      items: [
        { id: "seo", name: "SEO setup", desc: "Page titles, sitemap, Google Search Console and structured data.", price: 4000 },
        { id: "domain", name: "Domain & hosting setup", desc: "We register and connect everything. The domain itself is billed at cost.", price: 2000 },
        { id: "email", name: "Business email", desc: "you@yourbrand.com, set up and working.", price: 3000 }
      ]
    }
  ],

  timelines: [
    { id: "standard", name: "Standard", desc: "Our usual schedule, no rush.", pct: 0 },
    { id: "rush", name: "Rush", desc: "We fast-track your build and launch sooner.", pct: 25 }
  ]
};
