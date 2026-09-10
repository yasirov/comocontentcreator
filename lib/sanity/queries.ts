export const homePageQuery = `*[_type == "homePage"][0]{
  _id,
  _type,
  heroTitle,
  heroSubtitle,
  heroButtonLabel,
  aboutEyebrow,
  aboutTitle,
  aboutParagraphs,
  founders,
  pricingEyebrow,
  pricingTitle,
  pricingNote,
  pricingPackages,
  faqEyebrow,
  faqTitle,
  faqs,
  closingTitle,
  contactHeading,
  contactIntro,
  contactPhone,
  contactEmail,
  instagramUrl,
  seo
}`;

export const testimonialsQuery = `*[_type == "testimonial" && featured == true] {
  _id,
  _type,
  clientName,
  role,
  quote
}`;

export const articlesQuery = `*[_type == "article"] | order(publishedAt desc) {
  "slug": slug.current,
  title,
  excerpt,
  publishedAt
}`;
