import type { AnchorHTMLAttributes, ReactNode } from "react";

type PublicationLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  readonly href: string;
  readonly children: ReactNode;
};

const isExternalHref = (href: string) => /^(?:https?:)?\/\//u.test(href);

const secureRel = (rel: string | undefined) => {
  const tokens = new Set(rel?.split(/\s+/u).filter(Boolean));
  tokens.add("noopener");
  tokens.add("noreferrer");
  return [...tokens].join(" ");
};

export function PublicationLink({
  children,
  href,
  rel,
  target,
  ...anchorProps
}: PublicationLinkProps) {
  const external = isExternalHref(href);
  const resolvedRel = external && target === "_blank" ? secureRel(rel) : rel;

  return (
    <a
      className="publication-link"
      href={href}
      rel={resolvedRel}
      target={target}
      {...anchorProps}
    >
      {children}
      {external ? (
        <>
          <span aria-hidden="true" className="publication-link__mark">
            ↗
          </span>
          {target === "_blank" ? (
            <span className="sr-only"> (opens in a new tab)</span>
          ) : null}
        </>
      ) : null}
    </a>
  );
}
