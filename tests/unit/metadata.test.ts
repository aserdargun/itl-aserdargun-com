import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { metadata } from "@/app/layout";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { CONTENT_REGISTRY, RESEARCH_DISCLAIMER } from "@/lib/content/registry";

const CANONICAL_ORIGIN = "https://itl.aserdargun.com";
const canonicalUrl = (path: string) =>
  `${CANONICAL_ORIGIN}${path === "/" ? "/" : `${path}/`}`;

describe("publication metadata", () => {
  it("publishes the index, every registry publication, and the demo exactly once", () => {
    const expectedUrls = [
      canonicalUrl("/"),
      ...CONTENT_REGISTRY.map(({ href }) => canonicalUrl(href)),
      canonicalUrl("/experiment-fabric/demo"),
    ];
    const urls = sitemap().map(({ url }) => url);

    expect(urls).toEqual(expectedUrls);
    expect(urls).toHaveLength(15);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.every((url) => url.endsWith("/"))).toBe(true);
  });

  it("allows public crawling and points at the exact canonical sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: `${CANONICAL_ORIGIN}/sitemap.xml`,
    });
  });

  it("defines truthful global canonical, icon, Open Graph, and Twitter fields", () => {
    expect(metadata.metadataBase?.toString()).toBe(`${CANONICAL_ORIGIN}/`);
    expect(metadata.alternates).toEqual({ canonical: "/" });
    expect(metadata.icons).toEqual({ icon: "/favicon.svg" });
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      locale: "en_US",
      url: "/",
      siteName: "Industrial Twin Lab",
      title: "Industrial Twin Lab",
      images: [
        {
          url: "/opengraph.png",
          width: 1200,
          height: 630,
          alt: "Industrial Twin Lab research monograph cover",
        },
      ],
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Industrial Twin Lab",
      images: ["/opengraph.png"],
    });

    const serialized = JSON.stringify({
      description: metadata.description,
      openGraph: metadata.openGraph,
      twitter: metadata.twitter,
    }).toLowerCase();
    for (const prohibitedClaim of [
      "production-ready",
      "adopted by",
      "customers",
      "saas",
      "autonomous control",
    ]) {
      expect(serialized).not.toContain(prohibitedClaim);
    }
  });

  it("ships an SVG favicon and an exact 1200 by 630 PNG social image", () => {
    const favicon = readFileSync("public/favicon.svg", "utf8");
    expect(favicon).toContain("<svg");
    expect(favicon).toContain("#292a27");
    expect(favicon).toContain("#e9e4d8");
    expect(favicon).toContain("#df5b2f");
    expect(favicon).not.toMatch(/data:image|<image/i);

    const png = readFileSync("public/opengraph.png");
    expect(png.subarray(1, 4).toString()).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  });
});

describe("Azure Static Web Apps contract", () => {
  const config = JSON.parse(
    readFileSync("staticwebapp.config.json", "utf8"),
  ) as {
    navigationFallback: { rewrite: string; exclude: string[] };
    globalHeaders: Record<string, string>;
    routes: Array<{
      route: string;
      headers?: Record<string, string>;
    }>;
  };

  it("falls unknown documents back to the exported 404 without masking assets", () => {
    expect(config.navigationFallback.rewrite).toBe("/404.html");
    expect(config.navigationFallback.exclude).toEqual(
      expect.arrayContaining([
        "/_next/*",
        "/*.{css,js,json,png,jpg,jpeg,gif,svg,ico,webp,avif,woff,woff2,txt,xml,webmanifest,map,pdf,wasm}",
      ]),
    );
  });

  it("sets narrow self-hosted security headers", () => {
    expect(config.globalHeaders).toMatchObject({
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy":
        "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
    });
    const csp = config.globalHeaders["Content-Security-Policy"];
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("font-src 'self'");
    expect(csp).toContain("script-src 'self' 'unsafe-inline'");
    expect(csp).toContain("style-src 'self' 'unsafe-inline'");
    expect(csp).not.toMatch(/https?:|\*/);
  });

  it("keeps HTML revalidated and hashed Next assets immutable", () => {
    const staticRoute = config.routes.find(
      ({ route }) => route === "/_next/static/*",
    );
    const documentRoute = config.routes.find(({ route }) => route === "/*");
    expect(staticRoute?.headers?.["Cache-Control"]).toBe(
      "public, max-age=31536000, immutable",
    );
    expect(documentRoute?.headers?.["Cache-Control"]).toBe(
      "public, max-age=0, must-revalidate",
    );
  });
});

describe("README lifecycle contract", () => {
  it("uses the package scripts for Run, Validate, and Stop", () => {
    const readme = readFileSync("README.md", "utf8");
    const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
      scripts: Record<string, string>;
    };

    const documentedCommand = (heading: string) =>
      readme.match(
        new RegExp("### " + heading + "\\n\\n```bash\\n([^\\n]+)\\n```"),
      )?.[1];

    expect(documentedCommand("Setup")).toBe("npm ci");
    expect(documentedCommand("Run")).toBe("npm run dev:codex");
    expect(documentedCommand("Validate")).toBe("npm run validate:codex");
    expect(documentedCommand("Stop")).toBe("npm run stop:codex");
    expect(pkg.scripts["dev:codex"]).toBe(
      "next dev --hostname 127.0.0.1 --port 4173",
    );
    expect(pkg.scripts["validate:codex"]).toContain("npm run build");
    expect(pkg.scripts["stop:codex"]).toBe("node scripts/stop-dev.mjs 4173");
    expect(readme).toContain(RESEARCH_DISCLAIMER);
    expect(readme).toContain("127.0.0.1:4173");
    expect(readme).toContain("https://itl.aserdargun.com");
  });
});
