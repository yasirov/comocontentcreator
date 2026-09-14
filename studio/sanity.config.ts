import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";
import { apiVersion, dataset, projectId } from "./env";

// The live site. The Presentation tool's side-by-side preview loads
// whatever origin is set here.
const SITE_URL = "https://comocontentcreator.com";

export default defineConfig({
  name: "comocontentcreator",
  title: "Como Content Creator",
  projectId,
  dataset,
  apiVersion,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        origin: SITE_URL,
        preview: "/",
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
  ],
  schema: { types: schemaTypes },
  document: {
    // Home Page is a singleton - keep it out of the "new document" menu
    // and don't let anyone duplicate or delete the one copy of it.
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === "global") {
        return prev.filter(
          (template) =>
            template.templateId !== "homePage" &&
            template.templateId !== "seoSettings"
        );
      }
      return prev;
    },
    actions: (prev, { schemaType }) => {
      if (schemaType === "homePage" || schemaType === "seoSettings") {
        return prev.filter(
          ({ action }) => action !== "duplicate" && action !== "delete"
        );
      }
      return prev;
    },
  },
});
