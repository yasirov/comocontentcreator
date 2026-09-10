import { defineField, defineType } from "sanity";

export default defineType({
  name: "portfolioItem",
  title: "Portfolio Item",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: ["Hospitality", "Restaurant", "Wedding vendor", "Brand"],
      },
    }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3 }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image" }],
    }),
    defineField({
      name: "video",
      title: "Video URL",
      description: "Link to a hosted reel/showreel (YouTube, Vimeo, etc.)",
      type: "url",
    }),
    defineField({ name: "region", title: "Region", type: "reference", to: [{ type: "region" }] }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    }),
  ],
});
