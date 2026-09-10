import seo from "./shared/seo";
import author from "./shared/author";
import region from "./shared/region";
import inquiry from "./shared/inquiry";
import portfolioItem from "./portfolioItem";
import service from "./service";
import testimonial from "./testimonial";
import article from "./article";

export const schemaTypes = [
  // shared types (mirrored across all 4 site studios)
  seo,
  author,
  region,
  inquiry,
  // comocontentcreator.com-specific types
  portfolioItem,
  service,
  testimonial,
  article,
];
