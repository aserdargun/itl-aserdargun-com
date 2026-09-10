import { RESEARCH_DISCLAIMER } from "@/lib/content/registry";

export function ResearchDisclaimer({
  label = "Research disclaimer",
}: {
  readonly label?: string;
}) {
  return (
    <aside aria-label={label} className="research-disclaimer">
      <span className="research-disclaimer__label">Research boundary</span>
      <p>{RESEARCH_DISCLAIMER}</p>
    </aside>
  );
}
