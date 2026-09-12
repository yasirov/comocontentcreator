// Sanity's image CDN accepts on-the-fly transform params on any asset URL
// (width/height/fit/format/quality) - appending them here means every
// uploaded image is served already resized and re-encoded (usually WebP),
// instead of the original full-size file, without touching how images are
// uploaded in the Studio.
const AVATAR_PARAMS = "?w=160&h=160&fit=crop&auto=format&q=80";
// No forced square crop here (unlike AVATAR_PARAMS) - the same founder photo
// is shown both as a round avatar and as a tall 4:5 portrait, so the crop
// has to happen in the browser via object-fit, using the hotspot Sabina
// sets in Studio. This just caps the file size.
const FOUNDER_PHOTO_PARAMS = "?w=800&fit=max&auto=format&q=82";
const COVER_PARAMS = "?w=1600&fit=max&auto=format&q=82";

export const homePageQuery = `*[_type == "homePage"][0]{
  _id,
  _type,
  heroTitle,
  heroSubtitle,
  heroButtonLabel,
  "videos": videos[].asset->url,
  aboutEyebrow,
  aboutTitle,
  aboutParagraphs,
  founders[]{
    name,
    role,
    instagram,
    "photo": photo.asset->url + "${FOUNDER_PHOTO_PARAMS}",
    "photoHotspot": photo.hotspot
  },
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
  quote,
  "avatar": avatar.asset->url + "${AVATAR_PARAMS}"
}`;

export const articlesQuery = `*[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
  "slug": slug.current,
  title,
  excerpt,
  publishedAt,
  "coverImage": coverImage.asset->url + "${COVER_PARAMS}",
  "region": region->name,
  author->{
    name,
    role,
    "avatar": avatar.asset->url + "${AVATAR_PARAMS}"
  }
}`;

export const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0]{
  "slug": slug.current,
  title,
  excerpt,
  publishedAt,
  body,
  "coverImage": coverImage.asset->url + "${COVER_PARAMS}",
  "region": region->name,
  author->{
    name,
    role,
    "avatar": avatar.asset->url + "${AVATAR_PARAMS}"
  },
  seo
}`;
