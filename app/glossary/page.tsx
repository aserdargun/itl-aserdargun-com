import GlossaryContent from "@/content/glossary.mdx";
import { CONTENT_META } from "@/lib/content/registry";
import { publicationMetadata } from "@/lib/metadata";

const contentMeta = CONTENT_META.glossary;

export const metadata = publicationMetadata({
  pathname: contentMeta.href,
  title: contentMeta.title,
  description: contentMeta.description,
});

export default function GlossaryPage() {
  return (
    <article className="concept-publication reference-publication glossary-publication">
      <GlossaryContent />
    </article>
  );
}
