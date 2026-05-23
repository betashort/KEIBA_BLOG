import { Helmet } from "react-helmet-async";
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "../utils/site";

interface MetaTagsProps {
  title: string;
  description?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  path?: string;
  noindex?: boolean;
}

function toAbsoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "";
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
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
  const url =
    path && typeof window !== "undefined"
      ? toAbsoluteUrl(path)
      : typeof window !== "undefined"
        ? window.location.href
        : "";
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
