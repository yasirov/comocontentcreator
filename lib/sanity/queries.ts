export const servicesQuery = `*[_type == "service"] | order(order asc) {
  "slug": slug.current,
  name,
  summary
}`;

export const portfolioItemsQuery = `*[_type == "portfolioItem"] | order(publishedAt desc) {
  "slug": slug.current,
  title,
  category,
  summary,
  "coverImageUrl": coverImage.asset->url
}`;

export const testimonialsQuery = `*[_type == "testimonial" && featured == true] {
  clientName,
  quote
}`;

export const articlesQuery = `*[_type == "article"] | order(publishedAt desc) {
  "slug": slug.current,
  title,
  excerpt,
  publishedAt
}`;
