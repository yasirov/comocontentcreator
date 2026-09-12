import seo from "./shared/seo";
import author from "./shared/author";
import region from "./shared/region";
import inquiry from "./shared/inquiry";
import homePage from "./homePage";
import testimonial from "./testimonial";
import article from "./article";

export const schemaTypes = [
  // shared types (mirrored across all 4 site studios)
  seo,
  author,
  region,
  inquiry,
  // comocontentcreator.com-specific types
  homePage,
  testimonial,
  article,
];
