import type { StructureResolver } from "sanity/structure";

// Groups content the way a non-technical editor will actually use it -
// matches the pattern used in the Elezoria studio.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem().title("Portfolio Items").child(
        S.documentTypeList("portfolioItem").title("Portfolio Items")
      ),
      S.listItem().title("Services").child(
        S.documentTypeList("service").title("Services")
      ),
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
