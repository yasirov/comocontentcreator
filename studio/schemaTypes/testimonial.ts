import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "clientName", title: "Client name", type: "string" }),
    defineField({ name: "role", title: "Role (e.g. Bride, Lake Como wedding)", type: "string" }),
    defineField({ name: "quote", title: "Quote", type: "text", rows: 4 }),
    defineField({ name: "featured", title: "Featured on homepage", type: "boolean", initialValue: false }),
  ],
});
