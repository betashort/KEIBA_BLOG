import { Helmet } from "react-helmet-async";
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  toAbsoluteUrl,
} from "../utils/site";

interface MetaTagsProps {
  title: string;
  description?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  path?: string;
  noindex?: boolean;
}

export default function MetaTags({
  title,
  description = SITE_DESCRIPTION,
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
  path,
  noindex = false,
}: MetaTagsProps) {
  const pageTitle = title === SITE_NAME ? SITE_NAME : `${title} | ${SITE_NAME}`;
  const url = path ? toAbsoluteUrl(path) : undefined;
  const imageUrl = toAbsoluteUrl(ogImage);

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex" />}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}
