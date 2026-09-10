import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "@/lib/sanity/env";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});
