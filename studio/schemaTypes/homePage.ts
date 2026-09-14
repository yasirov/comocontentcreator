import { defineArrayMember, defineField, defineType } from "sanity";
import { richTextBlock } from "./shared/richText";
import { SectionOrderInput } from "../components/SectionOrderInput";
import { DEFAULT_SECTION_ORDER } from "./shared/sections";

// Singleton: everything editable on the one-page site, grouped into tabs
// so Anton can find a block without hunting through a flat field list.
// Pin this as a singleton in structure.ts (no "create new" - just one doc).
export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "layout", title: "Layout" },
    { name: "textBlocks", title: "Text blocks" },
    { name: "hero", title: "Hero" },
    { name: "about", title: "About" },
    { name: "pricing", title: "Pricing" },
    { name: "faq", title: "FAQ" },
    { name: "contact", title: "Contact" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "sectionOrder",
      title: "Order of the blocks on the page",
      description:
        "Use the arrows to move a block up or down. The change shows on the site after the next publish. The hero at the very top always stays first.",
      type: "array",
      group: "layout",
      of: [defineArrayMember({ type: "string" })],
      initialValue: [...DEFAULT_SECTION_ORDER],
      components: { input: SectionOrderInput },
    }),

    defineField({
      name: "textBlocks",
      title: "Free text blocks",
      description:
        "Extra blocks of text you can place anywhere on the page. Add one here, write the heading and the text, then use the Layout tab to move it under the pricing cards, above the FAQ, wherever you want. Use the \u22ee menu on a block to duplicate it.",
      type: "array",
      group: "textBlocks",
      of: [
        defineArrayMember({
          type: "object",
          name: "textBlock",
          fields: [
            defineField({
              name: "title",
              title: "Heading",
              description: "Leave empty for text with no heading above it.",
              type: "string",
            }),
            defineField({
              name: "body",
              title: "Text",
              description: "Select any word or phrase to add a link.",
              type: "array",
              of: [richTextBlock()],
            }),
            defineField({
              name: "size",
              title: "Text size",
              type: "string",
              initialValue: "normal",
              options: {
                list: [
                  { title: "Normal", value: "normal" },
                  { title: "Small (like the summary at the foot of the page)", value: "small" },
                ],
                layout: "radio",
              },
            }),
            defineField({
              name: "background",
              title: "Background",
              type: "string",
              initialValue: "background",
              options: {
                list: [
                  { title: "White", value: "background" },
                  { title: "Grey", value: "surface" },
                ],
                layout: "radio",
              },
            }),
          ],
          preview: {
            select: { title: "title" },
            prepare: ({ title }: { title?: string }) => ({
              title: title || "Text block",
            }),
          },
        }),
      ],
    }),

    defineField({
      name: "heroTitle",
      title: "Hero title",
      type: "string",
      group: "hero",
      initialValue: "Content creator",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero subtitle",
      type: "text",
      rows: 2,
      group: "hero",
      initialValue:
        "Wedding content creation - the art of instant, vertical storytelling.",
    }),
    defineField({
      name: "heroButtonLabel",
      title: "Hero button label",
      type: "string",
      group: "hero",
      initialValue: "Let's Talk",
    }),
    defineField({
      name: "videos",
      title: "Reels (3 vertical video clips shown under the hero)",
      description:
        "Upload up to 3 short vertical (9:16) video files. They autoplay muted and loop on the homepage.",
      type: "array",
      group: "hero",
      validation: (Rule) => Rule.max(3),
      of: [
        defineArrayMember({
          type: "file",
          name: "reel",
          options: { accept: "video/mp4,video/quicktime" },
        }),
      ],
    }),

    defineField({
      name: "aboutEyebrow",
      title: "Eyebrow label",
      type: "string",
      group: "about",
      initialValue: "About",
    }),
    defineField({
      name: "aboutTitle",
      title: "Title",
      type: "string",
      group: "about",
      initialValue: "A local crew, a cinema background",
    }),
    defineField({
      name: "aboutParagraphs",
      title: "Paragraphs",
      description:
        "Select any word or phrase to add a link (e.g. for backlinks/SEO).",
      type: "array",
      of: [richTextBlock()],
      group: "about",
    }),
    defineField({
      name: "founders",
      title: "Founders / team",
      type: "array",
      group: "about",
      of: [
        defineArrayMember({
          type: "object",
          name: "founder",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "role", title: "Role", type: "string" }),
            defineField({
              name: "instagram",
              title: "Instagram URL",
              type: "url",
            }),
            defineField({
              name: "photo",
              title: "Photo",
              type: "image",
              options: { hotspot: true },
              description:
                "Click the photo, then drag the circular crosshair to choose what stays in frame (e.g. center it on the face) - the website follows it automatically, on both the round avatar and the tall portrait.",
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "role", media: "photo" },
          },
        }),
      ],
    }),

    defineField({
      name: "pricingEyebrow",
      title: "Eyebrow label",
      type: "string",
      group: "pricing",
      initialValue: "Our pricing",
    }),
    defineField({
      name: "pricingTitle",
      title: "Title",
      type: "string",
      group: "pricing",
      initialValue: "Flexible pricing for every stage",
    }),
    defineField({
      name: "pricingNote",
      title: "Note under the title",
      type: "text",
      rows: 2,
      group: "pricing",
      initialValue:
        "Transport is included in the price for shoots taking place on Lake Como.",
    }),
    defineField({
      name: "pricingLayout",
      title: "Layout - cards per row",
      description:
        "How many pricing cards sit side by side on each screen size. The cards resize themselves to fit, so 2, 3 or 4 all stay balanced. Leave empty to use the defaults (phone 1, tablet 2, desktop 4). \"Tablet\" covers everything from 640px to 1279px wide, which includes an iPad in landscape; \"Desktop\" starts at 1280px.",
      type: "object",
      group: "pricing",
      options: { columns: 3 },
      fields: [
        defineField({
          name: "mobile",
          title: "Phone",
          type: "number",
          initialValue: 1,
          options: {
            list: [
              { title: "1 card", value: 1 },
              { title: "2 cards", value: 2 },
            ],
            layout: "dropdown",
          },
        }),
        defineField({
          name: "tablet",
          title: "Tablet",
          type: "number",
          initialValue: 2,
          options: {
            list: [
              { title: "1 card", value: 1 },
              { title: "2 cards", value: 2 },
              { title: "3 cards", value: 3 },
            ],
            layout: "dropdown",
          },
        }),
        defineField({
          name: "desktop",
          title: "Desktop",
          type: "number",
          initialValue: 3,
          options: {
            list: [
              { title: "1 card", value: 1 },
              { title: "2 cards", value: 2 },
              { title: "3 cards", value: 3 },
              { title: "4 cards", value: 4 },
            ],
            layout: "dropdown",
          },
        }),
      ],
    }),
    defineField({
      name: "pricingPackages",
      title: "Packages",
      description:
        "Each package is one card. Use the ⋮ menu on a card to duplicate it, then edit the copy - that's how you add a 3rd or 4th card. Drag to reorder.",
      type: "array",
      group: "pricing",
      of: [
        defineArrayMember({
          type: "object",
          name: "pricingPackage",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "tagline", title: "Tagline", type: "string" }),
            defineField({ name: "price", title: "Price", type: "string" }),
            defineField({
              name: "features",
              title: "Features",
              description: "One line per feature.",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "price" },
          },
        }),
      ],
    }),

    defineField({
      name: "faqEyebrow",
      title: "Eyebrow label",
      type: "string",
      group: "faq",
      initialValue: "FAQs",
    }),
    defineField({
      name: "faqTitle",
      title: "Title",
      type: "string",
      group: "faq",
      initialValue: "Have questions?",
    }),
    defineField({
      name: "faqs",
      title: "Questions",
      type: "array",
      group: "faq",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          fields: [
            defineField({ name: "question", title: "Question", type: "string" }),
            defineField({
              name: "answer",
              title: "Answer",
              description: "Select any word or phrase to add a link.",
              type: "array",
              of: [richTextBlock()],
            }),
          ],
          preview: {
            select: { title: "question" },
          },
        }),
      ],
    }),
    defineField({
      name: "closingTitle",
      title: "Closing banner title",
      type: "string",
      group: "faq",
      initialValue: "Ready to capture your day?",
    }),

    defineField({
      name: "contactHeading",
      title: "Heading",
      type: "string",
      group: "contact",
      initialValue: "Contact.",
    }),
    defineField({
      name: "contactIntro",
      title: "Intro text",
      type: "text",
      rows: 3,
      group: "contact",
      initialValue:
        "Share your project details below. We'll connect with you to explore your vision and discuss how to move from concept to screen.",
    }),
    defineField({
      name: "contactPhone",
      title: "Phone",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "contactEmail",
      title: "Email",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      group: "contact",
    }),

    defineField({
      name: "seoIntro",
      title: "Summary paragraphs (shown at the foot of the home page)",
      description:
        "Plain, factual sentences describing what the service is, where it works, what it delivers and what it is not. Google and AI assistants quote this directly, so write it in full sentences rather than marketing fragments, and keep the prices and delivery times in it accurate.",
      type: "array",
      of: [richTextBlock()],
      group: "seo",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home Page" }),
  },
});
