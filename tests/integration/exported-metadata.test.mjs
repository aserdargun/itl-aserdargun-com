import { existsSync, readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const ORIGIN = "https://itl.aserdargun.com";
const exportedPages = [
  ["/", "out/index.html"],
  ["/manifesto/", "out/manifesto/index.html"],
  ["/architecture/", "out/architecture/index.html"],
  ["/twin-capsule/", "out/twin-capsule/index.html"],
  ["/experiment-fabric/", "out/experiment-fabric/index.html"],
  ["/experiment-fabric/demo/", "out/experiment-fabric/demo/index.html"],
  ["/feature-factory/", "out/feature-factory/index.html"],
  ["/algorithm-arena/", "out/algorithm-arena/index.html"],
  ["/fault-lab/", "out/fault-lab/index.html"],
  ["/ai-scientist/", "out/ai-scientist/index.html"],
  ["/fleet-intelligence/", "out/fleet-intelligence/index.html"],
  ["/research/", "out/research/index.html"],
  ["/technology/", "out/technology/index.html"],
  ["/glossary/", "out/glossary/index.html"],
  ["/about/", "out/about/index.html"],
];

const metadataValues = (html, pattern) =>
  [...html.matchAll(pattern)].map((match) => match[1]);

test("all 15 exported pages have one exact self-canonical and Open Graph URL", () => {
  for (const [route, file] of exportedPages) {
    const html = readFileSync(file, "utf8");
    const expectedUrl = `${ORIGIN}${route}`;

    assert.deepEqual(
      metadataValues(html, /<link rel="canonical" href="([^"]+)"/g),
      [expectedUrl],
      `${route} canonical`,
    );
    assert.deepEqual(
      metadataValues(html, /<meta property="og:url" content="([^"]+)"/g),
      [expectedUrl],
      `${route} og:url`,
    );
  }
});

test("prepared output keeps a document-only custom 404 and the SWA config", () => {
  assert.equal(existsSync("out/404.html"), true);
  assert.equal(existsSync("out/404/index.html"), true);
  assert.deepEqual(
    readFileSync("out/404.html"),
    readFileSync("out/404/index.html"),
  );
  assert.equal(existsSync("out/asset-not-found.txt"), false);

  const config = JSON.parse(
    readFileSync("out/staticwebapp.config.json", "utf8"),
  );
  assert.deepEqual(config.responseOverrides, {
    404: { rewrite: "/404.html" },
  });
  assert.equal(
    config.routes.some(({ route }) => route === "/*"),
    false,
  );
  const nextAssetCatchIndex = config.routes.findIndex(
    ({ route }) => route === "/_next/*",
  );
  const exportedNextAssets = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = `${directory}/${entry.name}`;
      if (entry.isDirectory()) visit(path);
      else exportedNextAssets.push(`/${path.replace(/^out\//, "")}`);
    }
  };
  visit("out/_next/static");

  for (const route of exportedNextAssets) {
    const routeIndex = config.routes.findIndex(
      (candidate) => candidate.route === route,
    );
    assert.ok(routeIndex >= 0, `${route} has an exact preservation rule`);
    assert.ok(
      routeIndex < nextAssetCatchIndex,
      `${route} is preserved before the missing-asset catch`,
    );
    assert.equal(
      config.routes[routeIndex].headers["Cache-Control"],
      "public, max-age=31536000, immutable",
    );
  }
});
