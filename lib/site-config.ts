export const siteConfig = {
  name: "Como Content Creator",
  legalName: "YASIROV Films",
  tagline: "Content creation on Lake Como, made simple.",
  description:
    "Photo and video content creation for hotels, restaurants, vendors, and brands on Lake Como. One shoot, ready-to-post content for your website and social channels.",
  url: "https://comocontentcreator.com",
  founders: [
    { name: "Anton Yasirov", role: "Director of Photography & Video" },
    { name: "Sabina Yasirova", role: "Producer & Content Strategist" },
  ],
  instagram: "https://www.instagram.com/comocontentcreator/",
  parentBrand: {
    name: "YASIROV Films",
    url: "https://yasirov.com",
  },
  contactEmail: "hello@comocontentcreator.com",
  location: {
    city: "Como",
    region: "Lombardy",
    country: "Italy",
    areaServed: [
      "Como",
      "Bellagio",
      "Varenna",
      "Menaggio",
      "Cernobbio",
      "Lake Como",
    ],
  },
  nav: [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Journal", href: "/journal" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
