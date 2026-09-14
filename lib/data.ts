// Placeholder / seed content. Once the Sanity Studio's "Home Page" document
// has real entries, lib/content.ts pulls from there instead - everything
// below is only the fallback shown before that (or if a field is left
// blank in the Studio).

export const aboutParagraphsPlain = [
  "Sabina founded Como Content Creator after a few years on Lake Como's wedding docks, terraces and villa gardens, watching first dances and first looks through a phone screen rather than a cinema camera. That closeness is the whole idea behind the studio: content shot from inside the moment, not from across the room.",
  "She leads a small team of trusted creators who shoot alongside her on larger or multi-camera days, so every wedding gets the same fast, vertical, social-ready style regardless of package.",
  "Every wedding here moves fast - boats, light, guests, weather - and the team moves with it, catching the parts a traditional film crew has to plan around: the walk to the ceremony, the reaction shots, the reel-ready seconds that would otherwise only live in someone's memory.",
  "The goal is simple: footage that feels like being there, ready to share before the reception is even over.",
];

// Pricing structure - four tiers scaling by hours, number of operators/
// cameras, and reel count. "Reel" here means the short vertical clip (up to
// 15 sec) filmed throughout the day; each package also includes one longer
// Highlight Reel (up to 1 minute) cut after the event.
export const pricingPackages = [
  {
    slug: "basic",
    name: "Basic",
    tagline: "Told with care",
    price: "€1,200",
    features: [
      "1 content creator, phone-shot",
      "Up to 6 hours of coverage",
      "2 Reels (up to 15 seconds each)",
      "1 Highlight Reel (up to 1 minute)",
      "Delivery within 48 hours",
    ],
  },
  {
    slug: "extended",
    name: "Extended",
    tagline: "More of the day, captured",
    price: "€1,700",
    features: [
      "1 content creator, phone-shot",
      "Up to 8 hours of coverage",
      "3 Reels (up to 15 seconds each)",
      "1 Highlight Reel (up to 1 minute)",
      "Delivery within 48 hours",
    ],
  },
  {
    slug: "hybrid",
    name: "Hybrid",
    tagline: "Camera and phone, one vertical style",
    price: "€2,000",
    features: [
      "1 content creator, camera + phone",
      "Up to 10 hours of coverage",
      "5 Reels (up to 15 seconds each)",
      "1 Highlight Reel (up to 1 minute)",
      "Delivery within 72 hours",
    ],
  },
  {
    slug: "premium",
    name: "Premium",
    tagline: "Remembered in full",
    price: "€2,500",
    features: [
      "2 cameras, 2 content creators",
      "Up to 10 hours of coverage",
      "7 Reels (up to 15 seconds each)",
      "1 Highlight Reel (up to 1 minute)",
      "Delivery within 72 hours",
    ],
  },
];

// Placeholder quotes, kept only as a shape reference. They are NOT shown on
// the site: lib/content.ts returns an empty list when Sanity has no
// testimonials, and the Reviews section hides itself rather than publishing
// invented reviews. Add real ones in Studio and the section appears.
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

export const faqsPlain = [
  {
    question: "Do you travel for the shoot, and are travel costs included?",
    answer:
      "Travel and accommodation are included in the price only for shoots taking place on Lake Como itself. Locations further out are quoted separately.",
  },
  {
    question: "How long does it take to receive the final content?",
    answer:
      "Basic and Extended (phone-shot) deliver within 48 hours. Hybrid and Premium (camera-shot) deliver within 72 hours, to allow for the extra footage and editing.",
  },
  {
    question: "What makes wedding-day content creation different?",
    answer:
      "It's a lighter, same-day service focused on fast, vertical, social-ready footage - shot alongside your main photographer and videographer, not instead of them.",
  },
  {
    question: "How do we book the date and how do payments work?",
    answer:
      "Send us your date and coverage option through the contact form below and we'll confirm availability and next steps directly.",
  },
];