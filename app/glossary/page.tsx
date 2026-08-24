import type { Metadata } from "next";

import GlossaryContent from "@/content/glossary.mdx";
import { CONTENT_META } from "@/lib/content/registry";

const contentMeta = CONTENT_META.glossary;

export const metadata: Metadata = {
  title: contentMeta.title,
  description: contentMeta.description,
};

export default function GlossaryPage() {
  return (
    <article className="concept-publication reference-publication glossary-publication">
      <GlossaryContent />
    </article>
  );
}
