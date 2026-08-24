import type { Metadata } from "next";
import { Children, type ComponentProps, type ReactNode } from "react";

import { ResearchDisclaimer } from "@/components/publication/research-disclaimer";
import AboutContent from "@/content/about.mdx";
import { CONTENT_META, RESEARCH_DISCLAIMER } from "@/lib/content/registry";

const contentMeta = CONTENT_META.about;

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

export default function AboutPage() {
  return (
    <article className="concept-publication reference-publication about-publication">
      <AboutContent components={{ blockquote: ResearchBoundary }} />
    </article>
  );
}
