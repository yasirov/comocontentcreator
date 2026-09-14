// Sanity's image CDN accepts on-the-fly transform params on any asset URL
// (width/height/fit/format/quality) - appending them here means every
// uploaded image is served already resized and re-encoded (usually WebP),
// instead of the original full-size file, without touching how images are
// uploaded in the Studio.
// No forced square crop: the round avatar is cropped in the browser via
// object-fit plus the hotspot the author sets in Studio, the same way the
// founder photos work. A server-side "fit=crop" would centre on the middle
// of the frame and cut the top of a head off before the browser ever sees
// it. 320px wide covers the 36px avatar on a 3x retina screen.
const AVATAR_PARAMS = "?w=320&fit=max&auto=format&q=80";
// No forced square crop here (unlike AVATAR_PARAMS) - the same founder photo
// is shown both as a round avatar and as a tall 4:5 portrait, so the crop
// has to happen in the browser via object-fit, using the hotspot Sabina
// sets in Studio. This just caps the file size.
const FOUNDER_PHOTO_PARAMS = "?w=800&fit=max&auto=format&q=82";
const COVER_PARAMS = "?w=1600&fit=max&auto=format&q=82";
// Social share images: 1200x630 is what Facebook, LinkedIn, WhatsApp and
// X all crop to, so the CDN does the crop once rather than every scraper
// guessing at it.
const OG_IMAGE_PARAMS = "?w=1200&h=630&fit=crop&auto=format&q=80";
// Images placed inside an article body. The column is 768px wide at most,
// so 1600px is already generous on a retina screen - what matters is that
// the original (often a 4-6 MB, 6000px camera file) never reaches the
// browser untouched. "auto=format" re-encodes to WebP/AVIF where supported.
const BODY_IMAGE_PARAMS = "?w=1600&fit=max&auto=format&q=82";

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
  pricingLayout,
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
  seoIntro,
  sectionOrder,
  textBlocks[]{ _key, title, body, size, background },
  "seo": seo{ title, description, noIndex, "ogImage": ogImage.asset->url + "${OG_IMAGE_PARAMS}" }
}`;

export const testimonialsQuery = `*[_type == "testimonial" && featured == true] {
  _id,
  _type,
  clientName,
  role,
  quote,
  "avatar": avatar.asset->url + "${AVATAR_PARAMS}",
  "avatarHotspot": avatar.hotspot
}`;

export const articlesQuery = `*[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
  "slug": slug.current,
  title,
  excerpt,
  publishedAt,
  "coverImage": coverImage.asset->url + "${COVER_PARAMS}",
  "coverHotspot": coverImage.hotspot,
  "region": region->name,
  author->{
    name,
    role,
    "avatar": avatar.asset->url + "${AVATAR_PARAMS}",
    "avatarHotspot": avatar.hotspot
  }
}`;

export const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0]{
  "slug": slug.current,
  title,
  excerpt,
  publishedAt,
  // Image blocks inside the body carry only an asset reference. Resolving
  // the URL here (with the transform params above) is what stops the
  // original camera file being served straight to the browser.
  body[]{
    ...,
    _type == "image" => {
      ...,
      "url": asset->url + "${BODY_IMAGE_PARAMS}",
      "dimensions": asset->metadata.dimensions
    }
  },
  "coverImage": coverImage.asset->url + "${COVER_PARAMS}",
  "coverHotspot": coverImage.hotspot,
  "region": region->name,
  author->{
    name,
    role,
    "avatar": avatar.asset->url + "${AVATAR_PARAMS}",
    "avatarHotspot": avatar.hotspot
  },
  "seo": seo{ title, description, noIndex, "ogImage": ogImage.asset->url + "${OG_IMAGE_PARAMS}" }
}`;
