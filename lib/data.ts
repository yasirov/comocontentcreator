// Placeholder / seed content. Once the Sanity Studio has real entries,
// lib/content.ts pulls from there instead - these arrays are only the
// fallback shown before that.

export const services = [
  {
    slug: "hotel-hospitality",
    name: "Hotels & Hospitality",
    summary:
      "Room tours, property walkthroughs, and lifestyle shots that fill your booking site and OTA listings with content guests actually respond to.",
  },
  {
    slug: "restaurant-food",
    name: "Restaurants & Food",
    summary:
      "Dish-by-dish photography, kitchen and service b-roll, and short vertical clips built for menus, delivery apps, and Instagram.",
  },
  {
    slug: "wedding-vendors",
    name: "Wedding Vendors",
    summary:
      "Portfolio-ready photo and video for venues, planners, florists, and other Lake Como wedding vendors who need content that sells the day, not just documents it.",
  },
  {
    slug: "brand-social",
    name: "Brand & Social Retainers",
    summary:
      "A recurring monthly shoot day so your social channels never run dry - planned, shot, and delivered on a schedule.",
  },
];

// Real pricing structure Anton already sends to clients (from
// yasirov.com's content-creator pricing page) - same packaging works for a
// business shoot as it does for an event.
export const pricingPackages = [
  {
    slug: "classic",
    name: "Classic",
    tagline: "Told with care",
    price: "€700",
    features: [
      "1 content creator",
      "Up to 4 hours of coverage",
      "30 photos",
      "1 reel (up to 45 seconds)",
      "1 reel (up to 15 seconds)",
      "RAW materials included",
      "Delivery within 72 hours",
    ],
  },
  {
    slug: "grand",
    name: "Grand",
    tagline: "Remembered in full",
    price: "€1,200",
    features: [
      "1 content creator",
      "Up to 10 hours of coverage",
      "50-70 photos",
      "1 reel (up to 45 seconds)",
      "3 reels (up to 15 seconds)",
      "RAW materials included",
      "Delivery within 72 hours",
    ],
  },
];

export const portfolioItems = [
  {
    slug: "lakefront-hotel-launch",
    title: "Lakefront hotel launch content",
    category: "Hospitality",
    summary:
      "A full-day shoot covering rooms, terrace dining, and arrival experience for a Cernobbio property's new season.",
  },
  {
    slug: "trattoria-menu-refresh",
    title: "Trattoria menu refresh",
    category: "Restaurant",
    summary:
      "Photo and reel set for a family-run restaurant in Como's centro storico, timed to a new seasonal menu.",
  },
  {
    slug: "villa-wedding-venue-reel",
    title: "Villa wedding venue reel",
    category: "Wedding vendor",
    summary:
      "A 45-second showreel and photo set for a Bellagio villa's vendor page and Instagram highlight.",
  },
];

export const faqs = [
  {
    question: "Do you only work with wedding-related businesses?",
    answer:
      "No. Como Content Creator covers hotels, restaurants, shops, and service businesses around Lake Como as well as wedding vendors. If you need photo or video content and you're based on the lake, we can likely help.",
  },
  {
    question: "How is this different from YASIROV Films?",
    answer:
      "YASIROV Films is our destination wedding videography studio. Como Content Creator is a separate, faster-turnaround service focused on marketing content for local businesses - not wedding day coverage.",
  },
  {
    question: "How fast is delivery?",
    answer:
      "Most shoots are delivered within 72 hours. Rush delivery is available on request.",
  },
  {
    question: "Are travel costs included?",
    answer:
      "Transport is included in the package price for shoots taking place on Lake Como itself. Locations further out are quoted separately.",
  },
];
