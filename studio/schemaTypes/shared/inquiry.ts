import { defineField, defineType } from "sanity";

// Same shape as Elezoria's "inquiry" type - stores contact-form submissions.
export default defineType({
  name: "inquiry",
  title: "Inquiry",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "business", title: "Business name", type: "string" }),
    defineField({ name: "message", title: "Message", type: "text" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["new", "replied", "booked", "archived"] },
      initialValue: "new",
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
    }),
  ],
});
