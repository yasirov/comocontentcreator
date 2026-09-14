// The movable blocks of the home page, in the order they ship in.
//
// This list is the Studio half of the pair; the site half lives in
// lib/content.ts (SECTION_KEYS). Keep the keys identical in both - a key
// that exists on only one side is ignored rather than breaking the page,
// but the block then can't be moved.
//
// The hero is deliberately absent: it is the top of the page by
// definition, and nothing sensible happens if it moves.
export const HOME_SECTIONS = [
  { key: "about", title: "About", hint: "The story and the team photo" },
  { key: "pricing", title: "Pricing", hint: "The package cards" },
  {
    key: "reviews",
    title: "Reviews",
    hint: "Client quotes - hidden while there are none",
  },
  { key: "faq", title: "FAQ", hint: "The 'Have questions?' accordion" },
  {
    key: "seo",
    title: "About Como Content Creator",
    hint: "The summary paragraphs (SEO tab)",
  },
  {
    key: "closing",
    title: "Closing banner",
    hint: "The dark 'Ready to capture your day?' banner",
  },
  { key: "contact", title: "Contact", hint: "The form and contact details" },
] as const;

export type HomeSectionKey = (typeof HOME_SECTIONS)[number]["key"];

export const DEFAULT_SECTION_ORDER: HomeSectionKey[] = HOME_SECTIONS.map(
  (section) => section.key
);

// Makes any saved order usable: drops keys that no longer exist,
// de-duplicates, and slots in sections added since the order was saved.
export function normalizeSectionOrder(value: unknown): HomeSectionKey[] {
  const saved = Array.isArray(value) ? value : [];
  const kept: HomeSectionKey[] = [];
  saved.forEach((key) => {
    if (
      typeof key === "string" &&
      (DEFAULT_SECTION_ORDER as string[]).includes(key) &&
      !kept.includes(key as HomeSectionKey)
    ) {
      kept.push(key as HomeSectionKey);
    }
  });
  DEFAULT_SECTION_ORDER.forEach((key, index) => {
    if (!kept.includes(key)) kept.splice(index, 0, key);
  });
  return kept;
}
