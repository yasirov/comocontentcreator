import { defineField, defineType } from "sanity";

// Reused from Elezoria - both thelakeproposal.com and comocontentcreator.com
// are also Lake Como-specific, so the same "region" shape applies.
export default defineType({
  name: "region",
  title: "Region",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
    }),
    defineField({ name: "description", title: "Description", type: "text" }),
  ],
});
