import type { Metadata } from "next";

import { ArchitectureAtlas } from "@/components/diagrams/architecture-atlas";
import ArchitectureContent from "@/content/concepts/architecture.mdx";
import { CONTENT_META } from "@/lib/content/registry";

const contentMeta = CONTENT_META.architecture;

export const metadata: Metadata = {
  title: contentMeta.title,
  description: contentMeta.description,
};

export default function ArchitecturePage() {
  return (
    <article className="concept-publication architecture-publication">
      <ArchitectureContent components={{ ArchitectureAtlas }} />
      <section className="concept-publication__direction">
        <p>Research direction / not deployed</p>
        <h2>Digital Triplet: research direction only</h2>
        <p>
          Physical Machine + Digital Twin + AI Scientist describes a research
          direction, not a deployed autonomous capability. It grants no control
          authority and remains subject to the same validation boundary and
          human engineering decision.
        </p>
      </section>
    </article>
  );
}
