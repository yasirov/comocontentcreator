import type { StructureResolver } from "sanity/structure";

// Groups content the way a non-technical editor will actually use it -
// matches the pattern used in the Elezoria studio. "Home Page" is a
// singleton: one document holds every editable block of the one-page site.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Home Page")
        .child(
          S.document().schemaType("homePage").documentId("homePage")
        ),
      S.listItem()
        .title("SEO & AI")
        .child(S.document().schemaType("seoSettings").documentId("seoSettings")),
      S.divider(),
      S.listItem().title("Testimonials").child(
        S.documentTypeList("testimonial").title("Testimonials")
      ),
      S.listItem().title("Journal Articles").child(
        S.documentTypeList("article").title("Journal Articles")
      ),
      S.divider(),
      S.listItem().title("Inquiries").child(
        S.documentTypeList("inquiry").title("Inquiries")
      ),
      S.divider(),
      S.listItem().title("Authors").child(
        S.documentTypeList("author").title("Authors")
      ),
      S.listItem().title("Regions").child(
        S.documentTypeList("region").title("Regions")
      ),
    ]);
