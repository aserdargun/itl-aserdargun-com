import type { ComponentType } from "react";

export type ContentStatus = "Research / Experimental";

export interface ContentMeta {
  readonly id: string;
  readonly href: string;
  readonly title: string;
  readonly description: string;
  readonly order: number;
  readonly status: ContentStatus;
  readonly relatedHrefs: readonly string[];
}

export type ContentDisclosure = "research" | "synthetic";

export interface ContentValidationEvidence {
  readonly disclosures: readonly ContentDisclosure[];
  readonly glossaryTermIds?: readonly string[];
  readonly principleNumbers?: readonly number[];
  readonly researchQuestionIds?: readonly string[];
  readonly technologyCategoryIds?: readonly string[];
}

export interface ContentEntry extends ContentMeta {
  readonly validation: ContentValidationEvidence;
}

export type ContentModule = Readonly<{
  default: ComponentType;
  contentMeta: ContentMeta;
}>;

export interface ManifestoPrinciple {
  readonly number: number;
  readonly title: string;
  readonly statement: string;
  readonly evidence?: readonly string[];
  readonly note?: string;
}
