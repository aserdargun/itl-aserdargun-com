import { describe, expect, it } from "vitest";

import {
  CONTENT_REGISTRY,
  getContentEntry,
  validateContentEntries,
  validateContentRegistry,
} from "@/lib/content/registry";
import type { ContentEntry } from "@/lib/content/types";
import { GLOSSARY_TERMS } from "@/lib/data/glossary";
import { RESEARCH_QUESTIONS } from "@/lib/data/research";
import { SITE_NAVIGATION } from "@/lib/data/navigation";
import { TECHNOLOGIES } from "@/lib/data/technologies";
import { runContentValidation } from "@/scripts/validate-content";

const replaceEntry = (
  id: string,
  update: (entry: ContentEntry) => ContentEntry,
): ContentEntry[] =>
  CONTENT_REGISTRY.map((entry) => (entry.id === id ? update(entry) : entry));

describe("content registry", () => {
  it("contains exactly one entry for every publication route", () => {
    expect(CONTENT_REGISTRY.map((entry) => entry.href)).toEqual(
      SITE_NAVIGATION.map((item) => item.href),
    );
  });

  it("resolves a publication by a normalized slug", () => {
    expect(getContentEntry("/concepts/architecture/").href).toBe(
      "/architecture",
    );
  });

  it("has no duplicate IDs, missing metadata, or broken references", () => {
    expect(validateContentRegistry()).toEqual([]);
  });

  it("reports duplicate IDs and hrefs", () => {
    const duplicate = {
      ...CONTENT_REGISTRY[1],
      id: CONTENT_REGISTRY[0].id,
      href: CONTENT_REGISTRY[0].href,
    };

    expect(validateContentEntries([...CONTENT_REGISTRY, duplicate])).toEqual(
      expect.arrayContaining([
        expect.stringContaining(`Duplicate content id "${duplicate.id}"`),
        expect.stringContaining(`Duplicate content href "${duplicate.href}"`),
      ]),
    );
  });

  it("rejects extra entries and non-canonical id-to-href mappings", () => {
    const extra = {
      ...CONTENT_REGISTRY[0],
      id: "unknown-publication",
      href: "/unknown-publication",
      order: CONTENT_REGISTRY.length + 1,
    };
    const mismatch = {
      ...CONTENT_REGISTRY[1],
      href: "/about",
    };

    const errors = validateContentEntries([
      ...CONTENT_REGISTRY.slice(0, 1),
      mismatch,
      ...CONTENT_REGISTRY.slice(2),
      extra,
    ]);

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Unknown content id "unknown-publication"'),
        expect.stringContaining('Unknown content href "/unknown-publication"'),
        expect.stringContaining(
          'architecture: canonical href is "/architecture", received "/about"',
        ),
        expect.stringContaining(
          "Content entries must match canonical navigation order",
        ),
      ]),
    );
  });

  it("reports missing metadata and unknown related routes", () => {
    const entries = replaceEntry("architecture", (entry) => ({
      ...entry,
      title: "",
      description: "   ",
      relatedHrefs: [...entry.relatedHrefs, "/unknown-route"],
    }));

    expect(validateContentEntries(entries)).toEqual(
      expect.arrayContaining([
        expect.stringContaining("architecture: title is required"),
        expect.stringContaining("architecture: description is required"),
        expect.stringContaining(
          'architecture: unknown related route "/unknown-route"',
        ),
      ]),
    );
  });

  it("reports omitted status and related-route metadata without crashing", () => {
    const malformed = {
      ...CONTENT_REGISTRY[0],
      status: undefined,
      relatedHrefs: undefined,
    } as unknown as ContentEntry;

    expect(validateContentEntries([malformed])).toEqual(
      expect.arrayContaining([
        expect.stringContaining("manifesto: status is required"),
        expect.stringContaining("manifesto: relatedHrefs is required"),
      ]),
    );
  });

  it("reports glossary, manifesto, and research catalogue gaps", () => {
    const entries = replaceEntry("manifesto", (entry) => ({
      ...entry,
      validation: { ...entry.validation, principleNumbers: [1, 3, 13] },
    })).map((entry) =>
      entry.id === "research"
        ? {
            ...entry,
            validation: {
              ...entry.validation,
              researchQuestionIds: ["RQ-001", "RQ-011"],
            },
          }
        : entry.id === "glossary"
          ? {
              ...entry,
              validation: {
                ...entry.validation,
                glossaryTermIds: GLOSSARY_TERMS.slice(1).map((term) => term.id),
              },
            }
          : entry,
    );

    expect(validateContentEntries(entries)).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          "manifesto: principle numbers must be 01 through 12",
        ),
        expect.stringContaining('research: invalid research id "RQ-011"'),
        expect.stringContaining(
          `research: missing research id "${RESEARCH_QUESTIONS[1].id}"`,
        ),
        expect.stringContaining(
          `glossary: missing glossary term "${GLOSSARY_TERMS[0].id}"`,
        ),
      ]),
    );
  });

  it("reports missing technology catalogue categories", () => {
    const entries = replaceEntry("technology", (entry) => ({
      ...entry,
      validation: {
        ...entry.validation,
        technologyCategoryIds: TECHNOLOGIES.slice(1).map(({ id }) => id),
      },
    }));

    expect(validateContentEntries(entries)).toContain(
      `technology: missing technology category "${TECHNOLOGIES[0].id}".`,
    );
  });

  it("reports duplicate glossary terms and technology categories", () => {
    const entries = replaceEntry("glossary", (entry) => ({
      ...entry,
      validation: {
        ...entry.validation,
        glossaryTermIds: [
          ...(entry.validation.glossaryTermIds ?? []),
          GLOSSARY_TERMS[0].id,
        ],
      },
    })).map((entry) =>
      entry.id === "technology"
        ? {
            ...entry,
            validation: {
              ...entry.validation,
              technologyCategoryIds: [
                ...(entry.validation.technologyCategoryIds ?? []),
                TECHNOLOGIES[0].id,
              ],
            },
          }
        : entry,
    );

    expect(validateContentEntries(entries)).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          `glossary: duplicate glossary term "${GLOSSARY_TERMS[0].id}"`,
        ),
        expect.stringContaining(
          `technology: duplicate technology category "${TECHNOLOGIES[0].id}"`,
        ),
      ]),
    );
  });

  it("reports missing required synthetic and research disclaimers", () => {
    const entries = replaceEntry(
      "fault-lab",
      (entry) =>
        ({
          ...entry,
          validation: undefined,
        }) as unknown as ContentEntry,
    ).map((entry) =>
      entry.id === "about"
        ? {
            ...entry,
            validation: { ...entry.validation, disclosures: [] },
          }
        : entry,
    );

    expect(validateContentEntries(entries)).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          "fault-lab: missing required synthetic disclaimer",
        ),
        expect.stringContaining("about: missing required research disclaimer"),
      ]),
    );
  });

  it("accumulates malformed disclosure metadata instead of throwing", () => {
    const malformed = {
      ...getContentEntry("fault-lab"),
      validation: { disclosures: { synthetic: true } },
    } as unknown as ContentEntry;

    expect(() => validateContentEntries([malformed])).not.toThrow();
    expect(validateContentEntries([malformed])).toEqual(
      expect.arrayContaining([
        expect.stringContaining("fault-lab: disclosures must be an array"),
        expect.stringContaining(
          "fault-lab: missing required synthetic disclaimer",
        ),
      ]),
    );
  });

  it("throws a useful error for an unknown slug", () => {
    expect(() => getContentEntry("not-a-publication")).toThrowError(
      'Unknown content slug "not-a-publication"',
    );
  });

  it("returns a non-zero status and prints every validation error", async () => {
    const output: string[] = [];
    const invalidEntries = [
      ...CONTENT_REGISTRY,
      { ...CONTENT_REGISTRY[0], title: "" },
    ];

    const exitCode = await runContentValidation({
      entries: invalidEntries,
      publicationValidation: { publicationIds: [] },
      writeLine: (line) => output.push(line),
    });

    expect(exitCode).toBe(1);
    expect(output).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Content validation failed"),
        expect.stringContaining("Duplicate content id"),
        expect.stringContaining("title is required"),
      ]),
    );
  });
});
