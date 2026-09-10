// Placeholder / seed content. Once the Sanity Studio has real entries,
// lib/content.ts pulls from there instead - these arrays are only the
// fallback shown before that.

// Real pricing structure Anton already uses on yasirov.com's
// content-creator pricing page.
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

// Placeholder quotes - swap for real reviews once Anton sends them.
export const testimonials = [
  {
    quote:
      "We booked a content creator for our wedding day almost as an afterthought - it turned out to be one of our favorite decisions. We had reels up before the reception even ended.",
    name: "Placeholder Name",
    role: "Bride, Lake Como wedding",
  },
  {
    quote:
      "Fast, unobtrusive, and the footage looked like it belonged on a wedding film budget ten times the price.",
    name: "Placeholder Name",
    role: "Groom, Villa wedding",
  },
  {
    quote:
      "Our guests were still talking about the reels days later. Easy to work with and delivered right on time.",
    name: "Placeholder Name",
    role: "Wedding planner",
  },
];

export const faqs = [
  {
    question: "Do you travel for the shoot, and are travel costs included?",
    answer:
      "Transport is included in the price for shoots taking place on Lake Como itself. Locations further out are quoted separately.",
  },
  {
    question: "How long does it take to receive the final content?",
    answer:
      "Delivery is within 72 hours of the shoot for both packages.",
  },
  {
    question: "How is this different from YASIROV Films?",
    answer:
      "YASIROV Films is our full wedding videography studio. Como Content Creator is a lighter, same-day content service focused on fast, vertical, social-ready footage.",
  },
  {
    question: "How do we book the date and how do payments work?",
    answer:
      "Send us your date and coverage option through the contact form below and we'll confirm availability and next steps directly.",
  },
];
