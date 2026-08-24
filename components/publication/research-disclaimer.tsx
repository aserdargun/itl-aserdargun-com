import { RESEARCH_DISCLAIMER } from "@/lib/content/registry";

export function ResearchDisclaimer() {
  return (
    <aside aria-label="Research disclaimer" className="research-disclaimer">
      <span className="research-disclaimer__label">Research boundary</span>
      <p>{RESEARCH_DISCLAIMER}</p>
    </aside>
  );
}
