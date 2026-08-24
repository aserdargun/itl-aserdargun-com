import { GLOSSARY_TERMS } from "@/lib/data/glossary";
import { SITE_NAVIGATION } from "@/lib/data/navigation";
import { RESEARCH_QUESTIONS } from "@/lib/data/research";
import { TECHNOLOGIES } from "@/lib/data/technologies";

import type {
  ContentDisclosure,
  ContentEntry,
  ContentMeta,
  ManifestoPrinciple,
} from "./types";

export const SYNTHETIC_FIXTURE_DISCLAIMER =
  "Conceptual demonstration — synthetic fixture results.";

export const SYNTHETIC_EVIDENCE_WARNING =
  "Synthetic data is evidence from a model, not evidence from reality.";

export const RESEARCH_DISCLAIMER =
  "Industrial Twin Lab is currently a research and concept-development project. Demonstrations must not be interpreted as validated industrial control or safety systems.";

export const MANIFESTO_PRINCIPLES: readonly ManifestoPrinciple[] = [
  {
    number: 1,
    title: "Twin Before Intervention",
    statement:
      "AI should experiment with a validated digital environment before any recommendation reaches the physical machine.",
  },
  {
    number: 2,
    title: "Physics Before Pure Correlation",
    statement:
      "Where engineering knowledge exists, machine learning should complement physics rather than ignore it.",
  },
  {
    number: 3,
    title: "Evidence Before Deployment",
    statement:
      "A model should not be promoted because its accuracy metric looks good.",
    evidence: [
      "generalization",
      "robustness",
      "stability",
      "uncertainty",
      "operational value",
      "explainability",
      "safe deployment behavior",
    ],
  },
  {
    number: 4,
    title: "Local First",
    statement:
      "Critical industrial data, engineering knowledge, experiments, and inference should be capable of operating locally.",
    note: "Cloud services may be optional extensions, never mandatory foundations.",
  },
  {
    number: 5,
    title: "Isolation by Design",
    statement:
      "The AI experimentation environment must be logically and architecturally isolated from OT control environments.",
  },
  {
    number: 6,
    title: "Human in Command",
    statement: "AI may:",
    evidence: [
      "observe",
      "analyze",
      "hypothesize",
      "simulate",
      "experiment",
      "recommend",
    ],
    note: "but deployment or operational intervention must remain governed by explicit engineering authority.",
  },
  {
    number: 7,
    title: "Models Compete",
    statement: "No algorithm should be assumed to be best.",
    note: "Models should compete under identical experimental conditions.",
  },
  {
    number: 8,
    title: "Features Compete",
    statement:
      "The system must evaluate not only algorithms but also the sensors and engineered features that make predictions possible.",
  },
  {
    number: 9,
    title: "Failure Can Be Simulated",
    statement:
      "Rare industrial failures should be studied through validated synthetic scenarios, fault injection, historical replay, and simulation.",
    note: "Synthetic data must never automatically be treated as ground truth.",
  },
  {
    number: 10,
    title: "Every Experiment Becomes Knowledge",
    statement: "Failed experiments are still valuable.",
    note: "Every experiment should contribute to organizational machine knowledge.",
  },
  {
    number: 11,
    title: "Learn from the Fleet",
    statement:
      "Knowledge learned from one asset should be testable on similar assets.",
    note: "The ultimate goal is not one intelligent machine. It is an intelligent fleet.",
  },
  {
    number: 12,
    title: "Trust Must Be Measurable",
    statement: "Every recommendation should expose:",
    evidence: [
      "evidence",
      "model confidence",
      "uncertainty",
      "data quality",
      "assumptions",
      "limitations",
      "provenance",
    ],
  },
];

const metadata = (
  id: string,
  title: string,
  description: string,
  order: number,
  relatedHrefs: readonly string[],
): ContentMeta => ({
  id,
  href: `/${id}`,
  title,
  description,
  order,
  status: "Research / Experimental",
  relatedHrefs,
});

export const CONTENT_META = {
  manifesto: metadata(
    "manifesto",
    "Industrial Twin Lab Manifesto",
    "Twelve principles for isolated, evidence-led industrial machine intelligence.",
    1,
    ["/architecture", "/experiment-fabric", "/research"],
  ),
  architecture: metadata(
    "architecture",
    "Industrial AI Safety Architecture",
    "A zoned path from physical observation to governed engineering decisions.",
    2,
    ["/twin-capsule", "/experiment-fabric", "/ai-scientist"],
  ),
  "twin-capsule": metadata(
    "twin-capsule",
    "Twin Capsule",
    "A versioned, bounded record of machine identity, engineering context, evidence, and uncertainty.",
    3,
    ["/architecture", "/feature-factory", "/glossary"],
  ),
  "experiment-fabric": metadata(
    "experiment-fabric",
    "Experiment Fabric",
    "A reproducible contract connecting hypotheses, configurations, validation, and evidence.",
    4,
    ["/algorithm-arena", "/feature-factory", "/fault-lab"],
  ),
  "feature-factory": metadata(
    "feature-factory",
    "Feature Factory",
    "Engineering transformations that turn P-101 signals into testable, traceable features.",
    5,
    ["/twin-capsule", "/algorithm-arena", "/experiment-fabric"],
  ),
  "algorithm-arena": metadata(
    "algorithm-arena",
    "Algorithm Arena",
    "Fair, constraint-aware comparison of model families under identical experimental conditions.",
    6,
    ["/experiment-fabric", "/feature-factory", "/research"],
  ),
  "fault-lab": metadata(
    "fault-lab",
    "Synthetic Fault Laboratory",
    "Controlled fault scenarios for probing detection limits without mistaking simulation for reality.",
    7,
    ["/twin-capsule", "/experiment-fabric", "/research"],
  ),
  "ai-scientist": metadata(
    "ai-scientist",
    "AI Scientist",
    "A hypothesis-and-experiment orchestrator that remains outside the industrial control loop.",
    8,
    ["/architecture", "/experiment-fabric", "/fleet-intelligence"],
  ),
  "fleet-intelligence": metadata(
    "fleet-intelligence",
    "Fleet Intelligence",
    "Cross-asset validation that tests portability before turning local results into organizational knowledge.",
    9,
    ["/ai-scientist", "/research", "/twin-capsule"],
  ),
  research: metadata(
    "research",
    "Open Research Questions",
    "Ten unresolved questions and a maturity model for disciplined Industrial Twin Lab research.",
    10,
    ["/manifesto", "/technology", "/about"],
  ),
  technology: metadata(
    "technology",
    "Technology Atlas",
    "Candidate implementation categories, explicitly separated from architectural requirements.",
    11,
    ["/architecture", "/research", "/about"],
  ),
  glossary: metadata(
    "glossary",
    "Glossary",
    "Cross-linked definitions for the technical vocabulary of Industrial Twin Lab.",
    12,
    ["/architecture", "/experiment-fabric", "/research"],
  ),
  about: metadata(
    "about",
    "About Industrial Twin Lab",
    "Project status, boundaries, authorship, and the ten-phase research roadmap.",
    13,
    ["/manifesto", "/research", "/technology"],
  ),
} as const satisfies Record<string, ContentMeta>;

const syntheticRequired = new Set([
  "twin-capsule",
  "experiment-fabric",
  "feature-factory",
  "algorithm-arena",
  "fault-lab",
  "ai-scientist",
  "fleet-intelligence",
]);

const researchRequired = new Set(["research", "technology", "about"]);

const disclosuresFor = (id: string): readonly ContentDisclosure[] => [
  ...(syntheticRequired.has(id) ? (["synthetic"] as const) : []),
  ...(researchRequired.has(id) ? (["research"] as const) : []),
];

export const CONTENT_REGISTRY: readonly ContentEntry[] = SITE_NAVIGATION.map(
  ({ id }) => {
    const contentMeta = CONTENT_META[id as keyof typeof CONTENT_META];

    return {
      ...contentMeta,
      validation: {
        disclosures: disclosuresFor(id),
        ...(id === "manifesto"
          ? {
              principleNumbers: MANIFESTO_PRINCIPLES.map(
                ({ number }) => number,
              ),
            }
          : {}),
        ...(id === "research"
          ? {
              researchQuestionIds: RESEARCH_QUESTIONS.map(
                ({ id: rqId }) => rqId,
              ),
            }
          : {}),
        ...(id === "technology"
          ? {
              technologyCategoryIds: TECHNOLOGIES.map(
                ({ id: technologyId }) => technologyId,
              ),
            }
          : {}),
        ...(id === "glossary"
          ? { glossaryTermIds: GLOSSARY_TERMS.map(({ id: termId }) => termId) }
          : {}),
      },
    };
  },
);

const expectedPrinciples = Array.from({ length: 12 }, (_, index) => index + 1);
const expectedResearchIds = RESEARCH_QUESTIONS.map(({ id }) => id);
const expectedGlossaryIds = GLOSSARY_TERMS.map(({ id }) => id);

const duplicates = (values: readonly string[]): string[] => [
  ...new Set(values.filter((value, index) => values.indexOf(value) !== index)),
];

const sameSequence = <T>(left: readonly T[], right: readonly T[]): boolean =>
  left.length === right.length &&
  left.every((value, index) => value === right[index]);

export const validateContentEntries = (
  entries: readonly ContentEntry[],
): string[] => {
  const errors: string[] = [];
  const routeSet = new Set(
    entries
      .map(({ href }) => href)
      .filter((href): href is string => typeof href === "string"),
  );

  for (const id of duplicates(entries.map(({ id }) => id))) {
    errors.push(`Duplicate content id "${id}".`);
  }

  for (const href of duplicates(entries.map(({ href }) => href))) {
    errors.push(`Duplicate content href "${href}".`);
  }

  for (const entry of entries) {
    const label =
      typeof entry.id === "string" && entry.id.trim()
        ? entry.id
        : "Content entry";
    const validation = entry.validation ?? { disclosures: [] };

    if (typeof entry.id !== "string" || !entry.id.trim()) {
      errors.push("Content entry id is required.");
    }
    if (typeof entry.href !== "string" || !entry.href.trim()) {
      errors.push(`${label}: href is required.`);
    }
    if (typeof entry.title !== "string" || !entry.title.trim()) {
      errors.push(`${label}: title is required.`);
    }
    if (typeof entry.description !== "string" || !entry.description.trim()) {
      errors.push(`${label}: description is required.`);
    }
    if (entry.status !== "Research / Experimental") {
      errors.push(
        `${label}: status is required and must be "Research / Experimental".`,
      );
    }
    if (!Number.isInteger(entry.order) || entry.order < 1) {
      errors.push(`${label}: order must be a positive integer.`);
    }

    const relatedHrefs = Array.isArray(entry.relatedHrefs)
      ? entry.relatedHrefs
      : [];
    if (!Array.isArray(entry.relatedHrefs)) {
      errors.push(`${label}: relatedHrefs is required.`);
    }
    for (const relatedHref of relatedHrefs) {
      if (typeof relatedHref !== "string" || !routeSet.has(relatedHref)) {
        errors.push(`${label}: unknown related route "${relatedHref}".`);
      }
    }

    if (
      entry.id === "manifesto" &&
      !sameSequence(validation.principleNumbers ?? [], expectedPrinciples)
    ) {
      errors.push(
        `${entry.id}: principle numbers must be 01 through 12 in sequence.`,
      );
    }

    if (entry.id === "research") {
      const actualIds = validation.researchQuestionIds ?? [];
      for (const id of actualIds) {
        if (!/^RQ-00[1-9]$/.test(id) && id !== "RQ-010") {
          errors.push(
            `${entry.id}: invalid research id "${id}"; expected RQ-001 through RQ-010.`,
          );
        }
      }
      for (const id of expectedResearchIds) {
        if (!actualIds.includes(id))
          errors.push(`${entry.id}: missing research id "${id}".`);
      }
      for (const id of duplicates(actualIds)) {
        errors.push(`${entry.id}: duplicate research id "${id}".`);
      }
    }

    if (entry.id === "glossary") {
      const actualIds = validation.glossaryTermIds ?? [];
      for (const id of expectedGlossaryIds) {
        if (!actualIds.includes(id))
          errors.push(`${entry.id}: missing glossary term "${id}".`);
      }
      for (const id of actualIds) {
        if (!expectedGlossaryIds.includes(id))
          errors.push(`${entry.id}: unknown glossary term "${id}".`);
      }
    }

    if (entry.id === "technology") {
      const actualIds = validation.technologyCategoryIds ?? [];
      for (const { id } of TECHNOLOGIES) {
        if (!actualIds.includes(id)) {
          errors.push(`${entry.id}: missing technology category "${id}".`);
        }
      }
      for (const id of actualIds) {
        if (!TECHNOLOGIES.some((technology) => technology.id === id)) {
          errors.push(`${entry.id}: unknown technology category "${id}".`);
        }
      }
    }

    for (const disclosure of disclosuresFor(entry.id)) {
      if (!validation.disclosures.includes(disclosure)) {
        errors.push(`${entry.id}: missing required ${disclosure} disclaimer.`);
      }
    }
  }

  for (const term of GLOSSARY_TERMS) {
    for (const relatedHref of term.relatedHrefs) {
      if (!routeSet.has(relatedHref)) {
        errors.push(
          `Glossary term "${term.id}" has unknown related route "${relatedHref}".`,
        );
      }
    }
  }

  for (const navigationItem of SITE_NAVIGATION) {
    if (!entries.some(({ href }) => href === navigationItem.href)) {
      errors.push(`Missing publication route "${navigationItem.href}".`);
    }
  }

  return errors;
};

export const validateContentRegistry = (): string[] =>
  validateContentEntries(CONTENT_REGISTRY);

export const getContentEntry = (slug: string): ContentEntry => {
  const normalized = slug
    .trim()
    .split(/[?#]/, 1)[0]
    .replace(/^\/+|\/+$/g, "")
    .replace(/^concepts\//, "")
    .split("/")
    .at(-1);
  const entry = CONTENT_REGISTRY.find(
    ({ id, href }) => id === normalized || href === `/${normalized}`,
  );

  if (!entry) throw new Error(`Unknown content slug "${slug}".`);

  return entry;
};
