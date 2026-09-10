// One-time setup script: fills the Sanity "Home Page" document with the
// site's current copy, so every block is immediately editable in Studio
// (and clickable in the Presentation live preview) instead of falling
// back to the hardcoded defaults in lib/content.ts.
//
// Usage (run once from the project root):
//   SANITY_WRITE_TOKEN=<a token with Editor access> node scripts/seed-home-page.mjs
//
// Create the token at sanity.io/manage -> project -> API -> Tokens ->
// Add API token -> permission "Editor". Use it only in this one command,
// in your own terminal - never share it or paste it into chat.
//
// Safe to re-run: it replaces the "homePage" document with this same
// content, so running it twice just resets to these defaults. Once you've
// started editing in Studio, don't run this again unless you want to
// discard those edits.

import { createClient } from "@sanity/client";

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error(
    "Missing SANITY_WRITE_TOKEN. Run:\n  SANITY_WRITE_TOKEN=<your token> node scripts/seed-home-page.mjs"
  );
  process.exit(1);
}

const client = createClient({
  projectId: "30xk53w3",
  dataset: "production",
  apiVersion: "2026-01-01",
  token,
  useCdn: false,
});

const homePage = {
  _id: "homePage",
  _type: "homePage",
  heroTitle: "Content creator",
  heroSubtitle:
    "Wedding content creation - the art of instant, vertical storytelling.",
  heroButtonLabel: "Let's Talk",
  aboutEyebrow: "About",
  aboutTitle: "A local crew, a cinema background",
  aboutParagraphs: [
    "Como Content Creator grew out of YASIROV Films, our destination wedding videography studio based on Lake Como. Couples kept asking for something in between a full wedding film and a phone video: content that felt cinematic, but was ready to post the same day.",
    "That's what this is - a lighter, faster service focused purely on vertical, social-ready photo and video from your wedding day, run by the same team behind YASIROV Films.",
  ],
  founders: [
    {
      _key: "anton",
      name: "Anton Yasirov",
      role: "Director of Photography & Video",
      instagram: "https://www.instagram.com/anton_yasirov",
    },
    {
      _key: "sabina",
      name: "Sabina Yasirova",
      role: "Producer & Content Strategist",
      instagram: "https://www.instagram.com/sabina_yasirova",
    },
  ],
  pricingEyebrow: "Our pricing",
  pricingTitle: "Flexible pricing for every stage",
  pricingNote:
    "Transport is included in the price for shoots taking place on Lake Como.",
  pricingPackages: [
    {
      _key: "classic",
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
      _key: "grand",
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
  ],
  faqEyebrow: "FAQs",
  faqTitle: "Have questions?",
  faqs: [
    {
      _key: "travel",
      question: "Do you travel for the shoot, and are travel costs included?",
      answer:
        "Transport is included in the price for shoots taking place on Lake Como itself. Locations further out are quoted separately.",
    },
    {
      _key: "delivery",
      question: "How long does it take to receive the final content?",
      answer: "Delivery is within 72 hours of the shoot for both packages.",
    },
    {
      _key: "difference",
      question: "How is this different from YASIROV Films?",
      answer:
        "YASIROV Films is our full wedding videography studio. Como Content Creator is a lighter, same-day content service focused on fast, vertical, social-ready footage.",
    },
    {
      _key: "booking",
      question: "How do we book the date and how do payments work?",
      answer:
        "Send us your date and coverage option through the contact form below and we'll confirm availability and next steps directly.",
    },
  ],
  closingTitle: "Ready to capture your day?",
  contactHeading: "Contact.",
  contactIntro:
    "Share your project details below. We'll connect with you to explore your vision and discuss how to move from concept to screen.",
  contactPhone: "+39 339 355 0171",
  contactEmail: "comocontentcreator@gmail.com",
  instagramUrl: "https://www.instagram.com/comocontentcreator/",
};

const result = await client.createOrReplace(homePage);
console.log(`Done - "Home Page" document is now live with id: ${result._id}`);
