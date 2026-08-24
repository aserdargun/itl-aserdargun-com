import type { Metadata } from "next";
import { Children, type HTMLAttributes } from "react";

import { AssetHierarchy } from "@/components/diagrams/asset-hierarchy";
import { TwinCapsuleDiagram } from "@/components/diagrams/twin-capsule-diagram";
import { PublicationLink } from "@/components/publication/publication-link";
import TwinCapsuleContent from "@/content/concepts/twin-capsule.mdx";
import { CONTENT_META } from "@/lib/content/registry";
import { P101_TWIN } from "@/lib/data/p101";

const contentMeta = CONTENT_META["twin-capsule"];

export const metadata: Metadata = {
  title: contentMeta.title,
  description: contentMeta.description,
};

function P101AssetHierarchy() {
  return (
    <AssetHierarchy
      caption="The registry locates the fictional P-101 machine and its component context without flattening the enterprise-to-component topology."
      levels={P101_TWIN.asset.hierarchy}
      title="P-101 asset hierarchy"
    />
  );
}

function P101CapsuleRecord() {
  return (
    <TwinCapsuleDiagram
      caption={`Capsule record ${P101_TWIN.id}. Every value shown is sourced from the canonical fictional P-101 fixture; the record grants no operational authority.`}
      title="P-101 Twin Capsule"
      twin={P101_TWIN}
    />
  );
}

function P101InlineCode({
  children,
  ...codeProps
}: HTMLAttributes<HTMLElement>) {
  const source = String(children);
  const values: Readonly<Record<string, string>> = {
    "{P101_TWIN.version}": P101_TWIN.version,
    '{P101_TWIN.asset.hierarchy.join(" → ")}':
      P101_TWIN.asset.hierarchy.join(" → "),
    "{P101_TWIN.provenance.assetVersion}": P101_TWIN.provenance.assetVersion,
  };

  return <code {...codeProps}>{values[source] ?? children}</code>;
}

function P101Paragraph({
  children,
  ...paragraphProps
}: HTMLAttributes<HTMLParagraphElement>) {
  const isSourceTable = Children.toArray(children).some(
    (child) =>
      typeof child === "string" && child.trimStart().startsWith("| Record"),
  );

  return isSourceTable ? (
    <P101CapsuleRecord />
  ) : (
    <p {...paragraphProps}>{children}</p>
  );
}

export default function TwinCapsulePage() {
  return (
    <article className="concept-publication twin-capsule-publication">
      <TwinCapsuleContent
        components={{
          code: P101InlineCode,
          p: P101Paragraph,
          pre: P101AssetHierarchy,
        }}
      />
      <nav
        aria-label="Related Twin Capsule publications"
        className="concept-publication__related"
      >
        <p>Continue through the atlas</p>
        <h2>Related publications</h2>
        <ul>
          <li>
            <PublicationLink href="/architecture">Architecture</PublicationLink>
          </li>
          <li>
            <PublicationLink href="/feature-factory">
              Feature Factory
            </PublicationLink>
          </li>
          <li>
            <PublicationLink href="/glossary">Glossary</PublicationLink>
          </li>
        </ul>
      </nav>
    </article>
  );
}
