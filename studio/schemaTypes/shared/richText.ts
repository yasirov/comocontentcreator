import { defineArrayMember, defineField } from "sanity";

// Reusable Portable Text config: plain paragraphs/headings plus a "link"
// annotation, so any selected word/phrase in the Studio's rich-text editor
// (About paragraphs, FAQ answers, Journal article bodies) can be turned
// into a link - this is what powers the "add a backlink to any text"
// request, using Sanity's built-in link-toolbar UI (select text -> click
// the link icon).
export const richTextBlock = () =>
  defineArrayMember({
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "H2", value: "h2" },
      { title: "H3", value: "h3" },
      { title: "Quote", value: "blockquote" },
    ],
    marks: {
      decorators: [
        { title: "Bold", value: "strong" },
        { title: "Italic", value: "em" },
      ],
      annotations: [
        defineField({
          name: "link",
          title: "Link",
          type: "object",
          fields: [
            defineField({
              name: "href",
              title: "URL",
              type: "url",
              validation: (Rule) =>
                Rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
            }),
          ],
        }),
      ],
    },
  });
