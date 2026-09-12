import { defineField, defineType } from "sanity";
import { richTextBlock } from "./shared/richText";

export default defineType({
  name: "article",
  title: "Journal Article",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    }),
    defineField({ name: "author", title: "Author", type: "reference", to: [{ type: "author" }] }),
    defineField({
      name: "region",
      title: "Category / region",
      description: "Used for the filter chips on the Journal page.",
      type: "reference",
      to: [{ type: "region" }],
    }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
    defineField({ name: "coverImage", title: "Cover image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "body",
      title: "Body",
      description: "Select any word or phrase to add a link.",
      type: "array",
      of: [richTextBlock(), { type: "image" }],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
    defineField({ name: "publishedAt", title: "Published at", type: "datetime" }),
  ],
  preview: {
    select: { title: "title", subtitle: "excerpt", media: "coverImage" },
  },
});
