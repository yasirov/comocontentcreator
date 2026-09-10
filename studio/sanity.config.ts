import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";
import { apiVersion, dataset, projectId } from "./env";

export default defineConfig({
  name: "comocontentcreator",
  title: "Como Content Creator",
  projectId,
  dataset,
  apiVersion,
  basePath: "/studio",
  plugins: [structureTool({ structure })],
  schema: { types: schemaTypes },
  document: {
    // Home Page is a singleton - keep it out of the "new document" menu
    // and don't let anyone duplicate or delete the one copy of it.
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === "global") {
        return prev.filter((template) => template.templateId !== "homePage");
      }
      return prev;
    },
    actions: (prev, { schemaType }) => {
      if (schemaType === "homePage") {
        return prev.filter(
          ({ action }) => action !== "duplicate" && action !== "delete"
        );
      }
      return prev;
    },
  },
});
