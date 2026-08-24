import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { evaluate } from "@mdx-js/mdx";
import type { MDXComponents } from "mdx/types";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as jsxRuntime from "react/jsx-runtime";

import { ArchitectureAtlas } from "../../components/diagrams/architecture-atlas.tsx";
import { MaturityModel } from "../../components/diagrams/maturity-model.tsx";
import { TechnologyMap } from "../../components/diagrams/technology-map.tsx";
import { GLOSSARY_TERMS } from "../data/glossary.ts";
import { RESEARCH_QUESTIONS } from "../data/research.ts";
import { TECHNOLOGIES } from "../data/technologies.ts";
import {
  CONTENT_META,
  MANIFESTO_PRINCIPLES,
  RESEARCH_DISCLAIMER,
  SYNTHETIC_EVIDENCE_WARNING,
  SYNTHETIC_FIXTURE_DISCLAIMER,
} from "./registry.ts";
import type { ContentMeta } from "./types.ts";

const PUBLICATION_SOURCE_PATHS = {
  manifesto: "content/manifesto.mdx",
  architecture: "content/concepts/architecture.mdx",
  "twin-capsule": "content/concepts/twin-capsule.mdx",
  "experiment-fabric": "content/concepts/experiment-fabric.mdx",
  "feature-factory": "content/concepts/feature-factory.mdx",
  "algorithm-arena": "content/concepts/algorithm-arena.mdx",
  "fault-lab": "content/concepts/fault-lab.mdx",
  "ai-scientist": "content/concepts/ai-scientist.mdx",
  "fleet-intelligence": "content/concepts/fleet-intelligence.mdx",
  research: "content/research.mdx",
  technology: "content/technology.mdx",
  glossary: "content/glossary.mdx",
  about: "content/about.mdx",
} as const satisfies Record<keyof typeof CONTENT_META, string>;

type PublicationId = keyof typeof PUBLICATION_SOURCE_PATHS;

export interface PublicationValidationOptions {
  readonly projectRoot?: string;
  readonly publicationIds?: readonly string[];
  readonly sourceOverrides?: ReadonlyMap<string, string | null>;
}

type EvaluatedPublication = Readonly<{
  contentMeta?: unknown;
  default?: ComponentType<{
    readonly components?: MDXComponents;
  }>;
}>;

const syntheticPublications = new Set<PublicationId>([
  "twin-capsule",
  "experiment-fabric",
  "feature-factory",
  "algorithm-arena",
  "fault-lab",
  "ai-scientist",
  "fleet-intelligence",
]);

const researchPublications = new Set<PublicationId>([
  "research",
  "technology",
  "about",
]);

const metadataKeys = [
  "id",
  "href",
  "title",
  "description",
  "order",
  "status",
  "relatedHrefs",
] as const satisfies readonly (keyof ContentMeta)[];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const displayError = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const countOccurrences = (source: string, token: string): number =>
  source.split(token).length - 1;

const requireRenderedText = (
  id: PublicationId,
  rendered: string,
  text: string,
  description: string,
  errors: string[],
): void => {
  if (!rendered.includes(text)) {
    errors.push(`${id}: rendered publication is missing ${description}.`);
  }
};

const requireRenderedIdOnce = (
  id: PublicationId,
  rendered: string,
  renderedId: string,
  description: string,
  errors: string[],
): void => {
  const count = countOccurrences(rendered, `id="${renderedId}"`);
  if (count !== 1) {
    errors.push(
      `${id}: rendered publication must contain ${description} exactly once; found ${count}.`,
    );
  }
};

const validateMetadataExport = (
  id: PublicationId,
  actual: unknown,
  errors: string[],
): void => {
  if (!isRecord(actual)) {
    errors.push(`${id}: contentMeta export is required.`);
    return;
  }

  const actualKeys = Object.keys(actual).sort();
  const expectedKeys = [...metadataKeys].sort();
  if (
    actualKeys.length !== expectedKeys.length ||
    actualKeys.some((key, index) => key !== expectedKeys[index])
  ) {
    errors.push(
      `${id}: contentMeta must expose exactly ${metadataKeys.join(", ")}.`,
    );
  }

  const expected = CONTENT_META[id];
  for (const key of metadataKeys) {
    if (JSON.stringify(actual[key]) !== JSON.stringify(expected[key])) {
      errors.push(
        `${id}: contentMeta.${key} must be ${JSON.stringify(expected[key])}; received ${JSON.stringify(actual[key])}.`,
      );
    }
  }
};

const validateRenderedContract = (
  id: PublicationId,
  rendered: string,
  errors: string[],
): void => {
  if (syntheticPublications.has(id)) {
    requireRenderedText(
      id,
      rendered,
      SYNTHETIC_FIXTURE_DISCLAIMER,
      "the required synthetic disclaimer",
      errors,
    );
  }
  if (researchPublications.has(id)) {
    requireRenderedText(
      id,
      rendered,
      RESEARCH_DISCLAIMER,
      "the required research disclaimer",
      errors,
    );
  }
  if (id === "fault-lab") {
    requireRenderedText(
      id,
      rendered,
      SYNTHETIC_EVIDENCE_WARNING,
      "the required simulation-evidence warning",
      errors,
    );
  }

  if (id === "manifesto") {
    for (const principle of MANIFESTO_PRINCIPLES) {
      const number = String(principle.number).padStart(2, "0");
      requireRenderedIdOnce(
        id,
        rendered,
        `principle-${number}`,
        `manifesto principle ${number}`,
        errors,
      );
      requireRenderedText(
        id,
        rendered,
        `Principle ${number} — ${principle.title}`,
        `manifesto principle ${number} title`,
        errors,
      );
      requireRenderedText(
        id,
        rendered,
        principle.statement,
        `manifesto principle ${number} statement`,
        errors,
      );
    }
  }

  if (id === "research") {
    for (const question of RESEARCH_QUESTIONS) {
      requireRenderedIdOnce(
        id,
        rendered,
        question.id.toLowerCase(),
        `research question "${question.id}"`,
        errors,
      );
      requireRenderedText(
        id,
        rendered,
        question.question,
        `research question "${question.id}"`,
        errors,
      );
    }
  }

  if (id === "glossary") {
    for (const term of GLOSSARY_TERMS) {
      requireRenderedIdOnce(
        id,
        rendered,
        term.id,
        `glossary term "${term.id}"`,
        errors,
      );
      requireRenderedText(
        id,
        rendered,
        term.definition,
        `glossary definition "${term.id}"`,
        errors,
      );
    }
  }

  if (id === "technology") {
    requireRenderedText(
      id,
      rendered,
      "Possible implementation ecosystem — not a prescribed stack.",
      "the required technology framing",
      errors,
    );
    for (const technology of TECHNOLOGIES) {
      requireRenderedIdOnce(
        id,
        rendered,
        technology.id,
        `technology category "${technology.id}"`,
        errors,
      );
      for (const item of technology.items) {
        requireRenderedText(
          id,
          rendered,
          item.name,
          `technology item "${item.id}"`,
          errors,
        );
      }
    }
  }
};

export const validatePublicationModules = async (
  options: PublicationValidationOptions = {},
): Promise<string[]> => {
  const errors: string[] = [];
  const projectRoot = options.projectRoot ?? process.cwd();
  const requestedIds =
    options.publicationIds ?? Object.keys(PUBLICATION_SOURCE_PATHS);

  for (const requestedId of requestedIds) {
    if (!(requestedId in PUBLICATION_SOURCE_PATHS)) {
      errors.push(`Unknown publication module id "${requestedId}".`);
      continue;
    }

    const id = requestedId as PublicationId;
    const sourcePath = PUBLICATION_SOURCE_PATHS[id];
    const filePath = resolve(projectRoot, sourcePath);
    let source: string;

    if (options.sourceOverrides?.has(id)) {
      const override = options.sourceOverrides.get(id);
      if (override === null || override === undefined) {
        errors.push(`${id}: publication file "${sourcePath}" is missing.`);
        continue;
      }
      source = override;
    } else {
      try {
        source = await readFile(filePath, "utf8");
      } catch (error) {
        errors.push(
          `${id}: publication file "${sourcePath}" is missing or unreadable: ${displayError(error)}.`,
        );
        continue;
      }
    }

    let publication: EvaluatedPublication;
    try {
      publication = (await evaluate(source, {
        ...jsxRuntime,
        baseUrl: pathToFileURL(filePath),
      })) as EvaluatedPublication;
    } catch (error) {
      errors.push(
        `${id}: publication "${sourcePath}" does not compile and evaluate: ${displayError(error)}.`,
      );
      continue;
    }

    validateMetadataExport(id, publication.contentMeta, errors);

    if (typeof publication.default !== "function") {
      errors.push(`${id}: default MDX component export is required.`);
      continue;
    }

    try {
      const rendered = renderToStaticMarkup(
        createElement(publication.default, {
          components: { ArchitectureAtlas, MaturityModel, TechnologyMap },
        }),
      );
      validateRenderedContract(id, rendered, errors);
    } catch (error) {
      errors.push(
        `${id}: compiled publication could not render: ${displayError(error)}.`,
      );
    }
  }

  return errors;
};
