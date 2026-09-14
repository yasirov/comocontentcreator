import { defineField, defineType } from "sanity";

export default defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
    }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "image",
      options: { hotspot: true },
      description:
        "Click the photo, then drag the circular crosshair onto the face - the round avatar on the site crops around that point instead of the middle of the frame.",
    }),
    defineField({ name: "bio", title: "Bio", type: "text", rows: 3 }),
  ],
});
