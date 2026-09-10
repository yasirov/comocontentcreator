export const siteConfig = {
  name: "Como Content Creator",
  legalName: "YASIROV Films",
  tagline: "Content creation on Lake Como, made simple.",
  description:
    "Wedding and business content creation - the art of instant, vertical storytelling. Photo and video for hotels, restaurants, vendors, and brands on Lake Como.",
  url: "https://comocontentcreator.com",
  founders: [
    { name: "Anton Yasirov", role: "Director of Photography & Video", instagram: "https://www.instagram.com/anton_yasirov" },
    { name: "Sabina Yasirova", role: "Producer & Content Strategist", instagram: "https://www.instagram.com/sabina_yasirova" },
  ],
  instagram: "https://www.instagram.com/comocontentcreator/",
  parentBrand: {
    name: "YASIROV Films",
    url: "https://yasirov.com",
  },
  contactEmail: "info@yasirov.com",
  contactPhone: "+39 339 355 0171",
  location: {
    city: "Como",
    region: "Lombardy",
    country: "Italy",
    address: "Via Indipendenza 54, 22100 Como (CO), Italy",
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
