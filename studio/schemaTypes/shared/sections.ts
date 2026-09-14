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

export const DEFAULT_SECTION_ORDER: string[] = HOME_SECTIONS.map(
  (section) => section.key
);

// Free text blocks (Home Page -> Text blocks) are movable too. Each one is
// referenced in the order as "text:<_key>", so a block added in Studio shows
// up in the Layout list without any code change.
export const TEXT_BLOCK_PREFIX = "text:";

export const textBlockKey = (blockKey: string) => TEXT_BLOCK_PREFIX + blockKey;

// Makes any saved order usable: drops keys that no longer exist (including
// text blocks that were deleted), de-duplicates, and slots in anything
// added since the order was saved.
export function normalizeSectionOrder(
  value: unknown,
  textKeys: string[] = []
): string[] {
  const known = [...DEFAULT_SECTION_ORDER, ...textKeys.map(textBlockKey)];
  const saved = Array.isArray(value) ? value : [];
  const kept: string[] = [];
  saved.forEach((key) => {
    if (typeof key === "string" && known.includes(key) && !kept.includes(key)) {
      kept.push(key);
    }
  });
  // A section missing from the saved order goes back to its default slot; a
  // new text block goes to the end, where it is easy to find and move.
  DEFAULT_SECTION_ORDER.forEach((key, index) => {
    if (!kept.includes(key)) kept.splice(index, 0, key);
  });
  textKeys.map(textBlockKey).forEach((key) => {
    if (!kept.includes(key)) kept.push(key);
  });
  return kept;
}
