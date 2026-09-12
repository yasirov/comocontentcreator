import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "30xk53w3",
    dataset: "production",
  },
  // Pins the deployed Studio to comocontentcreator.sanity.studio so
  // `npx sanity deploy` stops asking for the hostname every time.
  studioHost: "comocontentcreator",
});
