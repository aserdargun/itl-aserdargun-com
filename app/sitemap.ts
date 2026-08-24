import type { MetadataRoute } from "next";

import { CONTENT_REGISTRY } from "@/lib/content/registry";

const CANONICAL_ORIGIN = "https://itl.aserdargun.com";

export const dynamic = "force-static";

const canonicalUrl = (path: string) =>
  `${CANONICAL_ORIGIN}${path === "/" ? "/" : `${path}/`}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    ...CONTENT_REGISTRY.map(({ href }) => href),
    "/experiment-fabric/demo",
  ];

  return paths.map((path) => ({ url: canonicalUrl(path) }));
}
