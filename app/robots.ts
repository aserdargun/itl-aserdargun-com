import type { MetadataRoute } from "next";

const CANONICAL_ORIGIN = "https://itl.aserdargun.com";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${CANONICAL_ORIGIN}/sitemap.xml`,
  };
}
