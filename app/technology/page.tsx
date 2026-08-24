import type { Metadata } from "next";
import { Children, type ComponentProps, type ReactNode } from "react";

import { TechnologyMap } from "@/components/diagrams/technology-map";
import { ResearchDisclaimer } from "@/components/publication/research-disclaimer";
import TechnologyContent from "@/content/technology.mdx";
import { CONTENT_META, RESEARCH_DISCLAIMER } from "@/lib/content/registry";

const contentMeta = CONTENT_META.technology;

export const metadata: Metadata = {
  title: contentMeta.title,
  description: contentMeta.description,
};

const textFromChildren = (children: ReactNode) =>
  Children.toArray(children).map(String).join("").trim();

function ResearchBoundary({
  children,
  ...props
}: ComponentProps<"blockquote">) {
  return textFromChildren(children) === RESEARCH_DISCLAIMER ? (
    <ResearchDisclaimer />
  ) : (
    <blockquote {...props}>{children}</blockquote>
  );
}

export default function TechnologyPage() {
  return (
    <article className="concept-publication reference-publication technology-publication">
      <TechnologyContent
        components={{
          TechnologyMap,
          blockquote: ResearchBoundary,
        }}
      />
    </article>
  );
}
