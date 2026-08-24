import type { Metadata } from "next";
import { Children, type ComponentProps, type ReactNode } from "react";

import { MaturityModel } from "@/components/diagrams/maturity-model";
import { ResearchDisclaimer } from "@/components/publication/research-disclaimer";
import ResearchContent from "@/content/research.mdx";
import { CONTENT_META, RESEARCH_DISCLAIMER } from "@/lib/content/registry";

const contentMeta = CONTENT_META.research;

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

export default function ResearchPage() {
  return (
    <div className="concept-publication reference-publication research-publication">
      <ResearchContent
        components={{
          MaturityModel,
          blockquote: ResearchBoundary,
        }}
      />
    </div>
  );
}
