import type { Metadata } from "next";

export const SITE_DESCRIPTION =
  "An English research publication examining isolated digital-twin experiments, evidence, uncertainty, and human-governed industrial machine intelligence.";

export const SOCIAL_IMAGE = {
  url: "/opengraph.png",
  width: 1200,
  height: 630,
  alt: "Industrial Twin Lab research monograph cover",
} as const;

type PublicationMetadataInput = {
  readonly pathname: string;
  readonly title: string;
  readonly description: string;
};

const trailingSlashPath = (pathname: string): string => {
  const normalized = `/${pathname.replace(/^\/+|\/+$/g, "")}`;
  return normalized === "/" ? normalized : `${normalized}/`;
};

export const publicationMetadata = ({
  pathname,
  title,
  description,
}: PublicationMetadataInput): Metadata => {
  const url = trailingSlashPath(pathname);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: "Industrial Twin Lab",
      title,
      description,
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SOCIAL_IMAGE.url],
    },
  };
};
