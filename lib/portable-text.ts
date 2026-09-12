// Shared helpers for Portable Text (Sanity's rich-text block format), used
// wherever a text field supports the "select a word, add a link" backlink
// feature: home page About paragraphs & FAQ answers, and Journal article
// bodies.

export type PortableTextBlock = {
  _key?: string;
  _type: "block";
  style?: string;
  children: { _key?: string; _type: "span"; text: string; marks?: string[] }[];
  markDefs?: { _key: string; _type: "link"; href: string }[];
};

// Wraps a plain string into a minimal valid Portable Text block, so the
// fallback/placeholder copy (used before the Studio document has content)
// can be rendered through the same <RichText> component as real Sanity
// content.
export function toBlock(text: string): PortableTextBlock {
  return {
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text }],
  };
}

export function toBlocks(paragraphs: string[]): PortableTextBlock[] {
  return paragraphs.map(toBlock);
}

// Accepts whatever a field currently holds - real Portable Text blocks, an
// array of plain strings (the shape these fields had before the rich-text
// migration), a single string, or nothing - and always returns valid
// Portable Text. Without this, a document still holding the old plain-text
// shape renders as an "Unknown block type" error on the live site.
export function normalizeRichText(
  value: unknown,
  fallback: PortableTextBlock[] = []
): PortableTextBlock[] {
  if (typeof value === "string") {
    return value.trim() ? [toBlock(value)] : fallback;
  }
  if (!Array.isArray(value) || value.length === 0) return fallback;

  const blocks = value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim() ? toBlock(item) : null;
      }
      if (item && typeof item === "object" && "_type" in item) {
        return item as PortableTextBlock;
      }
      return null;
    })
    .filter((block): block is PortableTextBlock => block !== null);

  return blocks.length ? blocks : fallback;
}

// Flattens Portable Text back down to plain text - used for places that
// can't render rich text (llms.txt, JSON-LD, <meta> descriptions, etc).
export function toPlainText(blocks: PortableTextBlock[] | string): string {
  if (typeof blocks === "string") return blocks;
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((block) =>
      block.children?.map((child) => child.text).join("") ?? ""
    )
    .join(" ")
    .trim();
}
