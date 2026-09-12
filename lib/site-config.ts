export const siteConfig = {
  name: "Como Content Creator",
  tagline: "Content creation on Lake Como, made simple.",
  description:
    "Wedding content creation - the art of instant, vertical storytelling. Photo and video content for your wedding day on Lake Como.",
  url: "https://comocontentcreator.com",
  founders: [
    {
      name: "Sabina Yasirova",
      role: "Content Creator & Producer",
      instagram: "https://www.instagram.com/sabina_yasirova",
    },
  ],
  instagram: "https://www.instagram.com/comocontentcreator/",
  instagramHandle: "@comocontentcreator",
  contactEmail: "comocontentcreator@gmail.com",
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
  // Everything lives on one page - these are anchors on Home, except
  // Journal, which is its own blog section/route.
  nav: [
    { label: "About", href: "/#about" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Journal", href: "/journal" },
  ],
} as const;
