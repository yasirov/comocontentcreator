import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "@/lib/sanity/env";

// Public reads: published content only, cached via Sanity's CDN.
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

// Used only while Draft Mode is on (the "Presentation" tool / click-to-edit
// preview in Sanity Studio). Reads unpublished drafts and stega-encodes
// every string it returns so the on-page overlay knows which element maps
// to which field. Needs SANITY_API_READ_TOKEN (a Viewer-scope token set as
// a secret, never committed) - without it, this silently falls back to
// published content only.
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "drafts",
  token: process.env.SANITY_API_READ_TOKEN,
  stega: {
    enabled: true,
    studioUrl: "https://comocontentcreator.sanity.studio",
  },
});

export function getSanityClient(preview: boolean) {
  return preview ? previewClient : sanityClient;
}

// Server-only, write-scoped client used solely by the /api/contact route to
// save a backup copy of each contact-form submission as an "inquiry"
// document in Sanity. Needs SANITY_API_WRITE_TOKEN (an Editor-scope token,
// separate from the read-only SANITY_API_READ_TOKEN above) set as a
// Cloudflare secret - if it's missing, saving the inquiry is skipped and
// only the email is sent.
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
