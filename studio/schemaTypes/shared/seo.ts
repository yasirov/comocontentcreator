import { defineField, defineType } from "sanity";

// Shared across all 4 sites' Sanity studios (Elezoria, thelakeproposal.com,
// yasirov.com, comocontentcreator.com) per the unified-schema plan - copy
// this file into each project's schemaTypes/shared/ folder rather than
// sharing one Sanity dataset.
export default defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Meta title", type: "string" }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
    }),
    defineField({ name: "ogImage", title: "Social share image", type: "image" }),
    defineField({
      name: "extraJsonLd",
      title: "Extra structured data for this page (advanced)",
      description:
        "A JSON-LD object or an array of them, added to this page on top of what the site generates. Invalid JSON is ignored rather than printed, so a typo here cannot break the page.",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
