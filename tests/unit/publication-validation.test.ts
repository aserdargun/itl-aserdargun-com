import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { CONTENT_REGISTRY } from "@/lib/content/registry";
import {
  validatePublicationModules,
  type PublicationValidationOptions,
} from "@/lib/content/validate-publications";
import type { ContentEntry } from "@/lib/content/types";
import { runContentValidation } from "@/scripts/validate-content";

const projectRoot = resolve(import.meta.dirname, "../..");
const readPublication = (sourcePath: string) =>
  readFile(resolve(projectRoot, sourcePath), "utf8");

const overrides = (
  values: Readonly<Record<string, string | null>>,
): PublicationValidationOptions => ({
  projectRoot,
  publicationIds: Object.keys(values),
  sourceOverrides: new Map(Object.entries(values)),
});

describe("publication module validation", () => {
  it("compiles, evaluates, and renders every real MDX publication", async () => {
    await expect(validatePublicationModules({ projectRoot })).resolves.toEqual(
      [],
    );
  });

  it("keeps architecture publication and visual on one canonical catalogue", async () => {
    const [publication, page, atlas] = await Promise.all([
      readPublication("content/concepts/architecture.mdx"),
      readPublication("app/architecture/page.tsx"),
      readPublication("components/diagrams/architecture-atlas.tsx"),
    ]);

    expect(publication).toContain(
      'import { ARCHITECTURE_CATALOGUE } from "../../lib/data/architecture.ts";',
    );
    expect(publication).toContain("ARCHITECTURE_CATALOGUE.flow");
    expect(publication).toContain("ARCHITECTURE_CATALOGUE.zones.map");
    expect(publication).toContain('aria-label="Architecture zone catalogue"');
    expect(atlas).toContain("zones={ARCHITECTURE_CATALOGUE.zones}");
    expect(atlas).toContain("steps={ARCHITECTURE_CATALOGUE.flow}");
    expect(page).not.toContain("Children");
    expect(page).not.toMatch(/const\s+(?:architecture)?zones\s*=\s*\[/iu);
    expect(atlas).not.toMatch(/zones=\{\[/u);
    expect(publication).not.toContain("<td>OT Control Zone</td>");
    expect(atlas).not.toContain('title: "OT Control Zone"');
  });

  it("reports a missing expected publication file", async () => {
    const errors = await validatePublicationModules(
      overrides({ manifesto: null }),
    );

    expect(errors).toContain(
      'manifesto: publication file "content/manifesto.mdx" is missing.',
    );
  });

  it("reports actual MDX disclaimer and canonical catalogue hooks removed", async () => {
    const faultSource = await readPublication("content/concepts/fault-lab.mdx");
    const withoutSyntheticDisclosure = faultSource.replace(
      "> {SYNTHETIC_FIXTURE_DISCLAIMER}",
      "",
    );
    expect(withoutSyntheticDisclosure).not.toBe(faultSource);

    const researchWithoutCatalogue = [
      'import { CONTENT_META } from "../lib/content/registry.ts";',
      "export const contentMeta = CONTENT_META.research;",
      "",
      "# Open Research Questions",
      "",
      "The canonical question catalogue is absent.",
    ].join("\n");
    const manifestoWithoutCatalogue = [
      'import { CONTENT_META } from "../lib/content/registry.ts";',
      "export const contentMeta = CONTENT_META.manifesto;",
      "",
      "# Manifesto without the canonical principles",
    ].join("\n");
    const glossaryWithoutCatalogue = [
      'import { CONTENT_META } from "../lib/content/registry.ts";',
      "export const contentMeta = CONTENT_META.glossary;",
      "",
      "# Glossary without the canonical terms",
    ].join("\n");
    const technologyWithoutCatalogue = [
      'import { CONTENT_META, RESEARCH_DISCLAIMER } from "../lib/content/registry.ts";',
      "export const contentMeta = CONTENT_META.technology;",
      "",
      "# Technology without the canonical categories",
      "",
      "> {RESEARCH_DISCLAIMER}",
    ].join("\n");
    const aboutSource = await readPublication("content/about.mdx");
    const withoutResearchDisclosure = aboutSource.replace(
      "> {RESEARCH_DISCLAIMER}",
      "",
    );
    expect(withoutResearchDisclosure).not.toBe(aboutSource);

    const errors = await validatePublicationModules(
      overrides({
        about: withoutResearchDisclosure,
        "fault-lab": withoutSyntheticDisclosure,
        glossary: glossaryWithoutCatalogue,
        manifesto: manifestoWithoutCatalogue,
        research: researchWithoutCatalogue,
        technology: technologyWithoutCatalogue,
      }),
    );

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          "fault-lab: rendered publication is missing the required synthetic disclaimer",
        ),
        expect.stringContaining(
          'research: rendered publication is missing research question "RQ-001"',
        ),
        expect.stringContaining(
          'research: rendered publication is missing research question "RQ-010"',
        ),
        expect.stringContaining(
          "manifesto: rendered publication must contain manifesto principle 01 exactly once; found 0",
        ),
        expect.stringContaining(
          'glossary: rendered publication must contain glossary term "digital-twin" exactly once; found 0',
        ),
        expect.stringContaining(
          'technology: rendered publication must contain technology category "industrial-connectivity" exactly once; found 0',
        ),
        expect.stringContaining(
          "about: rendered publication is missing the required research disclaimer",
        ),
      ]),
    );
  });

  it("reports missing and incorrect actual contentMeta exports", async () => {
    const errors = await validatePublicationModules(
      overrides({
        architecture: [
          'import { CONTENT_META } from "../../lib/content/registry.ts";',
          "export const contentMeta = CONTENT_META.about;",
          "",
          "# Architecture",
        ].join("\n"),
        manifesto: "# Manifesto without metadata",
      }),
    );

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          'architecture: contentMeta.id must be "architecture"',
        ),
        expect.stringContaining(
          'architecture: contentMeta.href must be "/architecture"',
        ),
        expect.stringContaining("manifesto: contentMeta export is required"),
      ]),
    );
  });

  it("prints accumulated registry and publication errors and returns 1", async () => {
    const output: string[] = [];
    const malformedEntries = [
      ...CONTENT_REGISTRY,
      {
        ...CONTENT_REGISTRY[0],
        id: "unknown-publication",
        href: "/unknown-publication",
        validation: { disclosures: 42 },
      } as unknown as ContentEntry,
    ];

    const exitCode = await runContentValidation({
      entries: malformedEntries,
      publicationValidation: overrides({ manifesto: null }),
      writeLine: (line) => output.push(line),
    });

    expect(exitCode).toBe(1);
    expect(output).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Content validation failed"),
        expect.stringContaining('Unknown content id "unknown-publication"'),
        expect.stringContaining("disclosures must be an array"),
        expect.stringContaining("publication file"),
      ]),
    );
  });
});
