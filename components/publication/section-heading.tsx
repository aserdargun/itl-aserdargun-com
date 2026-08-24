import type { ReactNode } from "react";

interface SectionHeadingProps {
  readonly children: ReactNode;
  readonly figure?: string;
  readonly label: string;
  readonly level?: 2 | 3;
}

export function SectionHeading({
  children,
  figure,
  label,
  level = 2,
}: SectionHeadingProps) {
  const Heading = level === 3 ? "h3" : "h2";

  return (
    <header className="section-heading">
      <div className="section-heading__meta">
        <p>{label}</p>
        {figure ? <p>{figure}</p> : null}
      </div>
      <Heading>{children}</Heading>
    </header>
  );
}
