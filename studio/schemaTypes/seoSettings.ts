import { defineArrayMember, defineField, defineType } from "sanity";

// One document holding everything that controls how search engines and AI
// assistants read the site: the business facts behind the structured data,
// the llms.txt file, and the robots.txt rules.
//
// Nothing here is free-form JSON or a raw file, apart from the two clearly
// marked advanced fields. The files are generated from these values, which
// is what keeps them valid: a hand-edited robots.txt with one wrong
// Disallow line removes the site from Google, and hand-written JSON-LD is
// the usual reason rich results stop showing.
export default defineType({
  name: "seoSettings",
  title: "SEO & AI",
  type: "document",
  groups: [
    { name: "business", title: "Business facts" },
    { name: "llms", title: "llms.txt" },
    { name: "robots", title: "robots.txt" },
    { name: "advanced", title: "Advanced" },
  ],
  fields: [
    // ------------------------------------------------ business facts
    defineField({
      name: "schemaType",
      title: "How the business is described to search engines",
      description:
        "Both are valid. ProfessionalService is the better fit for a service that travels to the client; LocalBusiness suits a place people visit.",
      type: "string",
      group: "business",
      initialValue: "ProfessionalService",
      options: {
        list: [
          { title: "ProfessionalService", value: "ProfessionalService" },
          { title: "LocalBusiness", value: "LocalBusiness" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "legalName",
      title: "Legal / trading name",
      type: "string",
      group: "business",
    }),
    defineField({
      name: "businessDescription",
      title: "One-sentence description",
      description:
        "Used in the structured data and as the fallback meta description. Plain and factual: what the service is, where it works.",
      type: "text",
      rows: 3,
      group: "business",
    }),
    defineField({
      name: "priceRange",
      title: "Price range",
      description: "Google's own convention: between one and four euro signs.",
      type: "string",
      group: "business",
      initialValue: "€€",
    }),
    defineField({
      name: "streetAddress",
      title: "Street address",
      type: "string",
      group: "business",
    }),
    defineField({ name: "city", title: "City", type: "string", group: "business" }),
    defineField({ name: "region", title: "Region", type: "string", group: "business" }),
    defineField({
      name: "postalCode",
      title: "Postal code",
      type: "string",
      group: "business",
    }),
    defineField({
      name: "countryCode",
      title: "Country code",
      description: "Two letters, e.g. IT.",
      type: "string",
      group: "business",
      initialValue: "IT",
    }),
    defineField({
      name: "areaServed",
      title: "Places served",
      description:
        "One per line. These are the place names an assistant matches against when someone asks for a content creator in a particular town.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "business",
    }),
    defineField({
      name: "sameAs",
      title: "Profiles elsewhere",
      description:
        "Full URLs: Instagram, YouTube, a Google Business Profile, a directory listing. This is how search engines confirm that all of these are the same business.",
      type: "array",
      of: [defineArrayMember({ type: "url" })],
      group: "business",
    }),
    defineField({
      name: "knowsAbout",
      title: "What this business is about",
      description:
        "One phrase per line, in the words people actually search and ask assistants. Keeps the studio from being read as a wedding videographer, which is a different service.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "business",
    }),

    // ------------------------------------------------ llms.txt
    defineField({
      name: "llmsSummary",
      title: "Summary line",
      description:
        "The first thing an assistant reads. One sentence: what this is, for whom, where.",
      type: "text",
      rows: 2,
      group: "llms",
    }),
    defineField({
      name: "llmsBoundary",
      title: "What this service is, and what it is not",
      description:
        "The most useful paragraph in the file. Assistants confuse adjacent services constantly; spelling out the boundary is what stops this studio being described as a wedding videographer.",
      type: "text",
      rows: 6,
      group: "llms",
    }),
    defineField({
      name: "llmsInclude",
      title: "Sections generated automatically",
      description:
        "These are built from the live content, so they cannot go out of date.",
      type: "object",
      group: "llms",
      options: { columns: 2 },
      fields: [
        defineField({ name: "pricing", title: "Pricing", type: "boolean", initialValue: true }),
        defineField({ name: "faq", title: "FAQ", type: "boolean", initialValue: true }),
        defineField({ name: "articles", title: "Journal articles", type: "boolean", initialValue: true }),
        defineField({ name: "contact", title: "Contact details", type: "boolean", initialValue: true }),
      ],
    }),
    defineField({
      name: "llmsSections",
      title: "Extra sections",
      description:
        "Anything else worth stating plainly: booking process, travel rules, languages spoken, what is not offered.",
      type: "array",
      group: "llms",
      of: [
        defineArrayMember({
          type: "object",
          name: "llmsSection",
          fields: [
            defineField({ name: "title", title: "Heading", type: "string" }),
            defineField({ name: "body", title: "Text", type: "text", rows: 5 }),
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        }),
      ],
    }),

    // ------------------------------------------------ robots.txt
    defineField({
      name: "allowSearchEngines",
      title: "Allow normal search engines (Google, Bing)",
      description:
        "Turning this off removes the site from search. Only for a site that is not ready to be found.",
      type: "boolean",
      group: "robots",
      initialValue: true,
    }),
    defineField({
      name: "allowAiAnswerBots",
      title: "Allow AI assistants to read and cite the site",
      description:
        "OAI-SearchBot, Claude-SearchBot, PerplexityBot and the live-fetch agents. These are the ones that put the studio into an answer with a link. Keep this on.",
      type: "boolean",
      group: "robots",
      initialValue: true,
    }),
    defineField({
      name: "allowAiTrainingBots",
      title: "Allow AI companies to use the site for training",
      description:
        "GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, meta-externalagent, CCBot. Separate from the setting above: blocking these does not remove the site from AI answers, but models are less likely to know the studio unprompted.",
      type: "boolean",
      group: "robots",
      initialValue: true,
    }),
    defineField({
      name: "blockedBots",
      title: "Block these crawlers by name",
      description:
        "One user-agent per line, e.g. Bytespider. For scrapers worth refusing outright.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "robots",
    }),
    defineField({
      name: "disallowPaths",
      title: "Hide these paths from all crawlers",
      description:
        "One path per line, starting with a slash, e.g. /api/. Anything that does not start with a slash is ignored rather than written into the file.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "robots",
    }),

    // ------------------------------------------------ advanced
    defineField({
      name: "extraJsonLd",
      title: "Extra structured data for every page",
      description:
        "Advanced. A single JSON-LD object or an array of them, added to every page on top of what the site generates. Invalid JSON is ignored rather than printed, so a typo here cannot break the pages.",
      type: "text",
      rows: 8,
      group: "advanced",
    }),
    defineField({
      name: "verification",
      title: "Site verification codes",
      type: "object",
      group: "advanced",
      fields: [
        defineField({ name: "google", title: "Google Search Console", type: "string" }),
        defineField({ name: "bing", title: "Bing Webmaster Tools", type: "string" }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "SEO & AI" }) },
});
