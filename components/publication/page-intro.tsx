import type { ReactNode } from "react";

import type { ContentEntry } from "@/lib/content/types";

interface PageIntroProps {
  readonly entry: ContentEntry;
  readonly eyebrow?: string;
  readonly children?: ReactNode;
}

export function PageIntro({ children, entry, eyebrow }: PageIntroProps) {
  return (
    <header className="page-intro">
      <div className="page-intro__meta">
        <p>
          {eyebrow ?? `Publication ${String(entry.order).padStart(2, "0")}`}
        </p>
        <p>{entry.status}</p>
      </div>
      <h1>{entry.title}</h1>
      <p className="page-intro__description">{entry.description}</p>
      {children ? <div className="page-intro__detail">{children}</div> : null}
    </header>
  );
}
