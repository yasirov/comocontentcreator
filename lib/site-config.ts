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
  // Identity of the data controller, shown on /privacy. Italian law expects
  // a VAT number to be displayed, so fill vatNumber in before treating the
  // privacy notice as complete - the page omits the line while it is empty.
  legal: {
    controllerName: "Sabina Yasirova",
    controllerForm: "sole trader (ditta individuale) established in Italy",
    vatNumber: "04300980135",
    taxCode: "YSRSBN93L41Z138E", // Codice Fiscale
    controllerEmail: "info.yasirov@gmail.com",
    controllerPhone: "+39 352 084 2465",
    registeredAddress: "Via Indipendenza 54, 22100 Como (CO), Italy",
    // How long an inquiry that never became a booking is kept.
    inquiryRetentionMonths: 24,
    privacyLastUpdated: "14 September 2026",
  },

  // Google Analytics 4 measurement ID. Not secret (it is public in every
  // page's HTML), so it lives here rather than in an env var. The gtag
  // script only loads after a visitor accepts the cookie banner in
  // components/CookieConsent.tsx - never unconditionally.
  analytics: {
    googleMeasurementId: "G-KS86EVEJCS",
  },

  // Everything lives on one page - these are anchors on Home, except
  // Journal, which is its own blog section/route.
  nav: [
    { label: "About", href: "/#about" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Journal", href: "/journal" },
  ],
} as const;
