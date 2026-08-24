export interface AssetHierarchyProps {
  readonly title: string;
  readonly caption?: string;
  readonly levels: readonly string[];
}

function HierarchyLevel({
  levels,
  index,
}: {
  readonly levels: readonly string[];
  readonly index: number;
}) {
  const level = levels[index];
  if (level === undefined) return null;

  return (
    <ol className="asset-hierarchy__list">
      <li>
        <span className="asset-hierarchy__level">{level}</span>
        <HierarchyLevel levels={levels} index={index + 1} />
      </li>
    </ol>
  );
}

export function AssetHierarchy({
  title,
  caption,
  levels,
}: AssetHierarchyProps) {
  return (
    <figure className="diagram-figure asset-hierarchy" aria-label={title}>
      <h2 className="diagram-figure__title">{title}</h2>
      <HierarchyLevel levels={levels} index={0} />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
