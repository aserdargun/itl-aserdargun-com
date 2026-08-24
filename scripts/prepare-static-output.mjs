import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = resolve(repositoryRoot, "out");
const root404 = resolve(outputRoot, "404.html");
const document404 = resolve(outputRoot, "404/index.html");
const sourceConfig = resolve(repositoryRoot, "staticwebapp.config.json");
const outputConfig = resolve(outputRoot, "staticwebapp.config.json");
const staticAssetRoot = resolve(outputRoot, "_next/static");
const assetNotFound = resolve(outputRoot, "asset-not-found.txt");

if (!existsSync(document404)) {
  throw new Error("Static export is missing out/404/index.html.");
}

if (!existsSync(root404)) {
  throw new Error("Static export is missing out/404.html.");
}

if (!readFileSync(root404).equals(readFileSync(document404))) {
  throw new Error(
    "Exported 404 files differ; refusing to configure an inconsistent fallback.",
  );
}

mkdirSync(outputRoot, { recursive: true });
writeFileSync(assetNotFound, "Static asset not found.\n");

const contentTypeByExtension = {
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const filesUnder = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });

if (!existsSync(staticAssetRoot)) {
  throw new Error("Static export is missing out/_next/static.");
}

const generatedAssetRoutes = filesUnder(staticAssetRoot)
  .sort()
  .map((file) => {
    const route = `/${relative(outputRoot, file).split(sep).join("/")}`;
    return {
      route,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type":
          contentTypeByExtension[extname(file)] ?? "application/octet-stream",
      },
    };
  });

const config = JSON.parse(readFileSync(sourceConfig, "utf8"));
const nextAssetCatchIndex = config.routes.findIndex(
  ({ route }) => route === "/_next/*",
);

if (nextAssetCatchIndex < 0) {
  throw new Error("SWA configuration is missing the /_next/* asset catch.");
}

config.routes.splice(nextAssetCatchIndex, 0, ...generatedAssetRoutes);
writeFileSync(outputConfig, `${JSON.stringify(config, null, 2)}\n`);

console.log(
  `Prepared static output: retained document 404, isolated asset errors, and preserved ${generatedAssetRoutes.length} hashed Next assets.`,
);
