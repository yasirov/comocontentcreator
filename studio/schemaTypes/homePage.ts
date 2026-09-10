import { defineArrayMember, defineField, defineType } from "sanity";
import { richTextBlock } from "./shared/richText";

// Singleton: everything editable on the one-page site, grouped into tabs
// so Anton can find a block without hunting through a flat field list.
// Pin this as a singleton in structure.ts (no "create new" - just one doc).
export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "about", title: "About" },
    { name: "pricing", title: "Pricing" },
    { name: "faq", title: "FAQ" },
    { name: "contact", title: "Contact" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
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
      name: "pricingPackages",
      title: "Packages",
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
