import { PublicationLink } from "@/components/publication/publication-link";

export default function NotFound() {
  return (
    <article className="not-found-publication">
      <p className="not-found-publication__code">
        Error 404 / missing publication
      </p>
      <h1>Publication not found</h1>
      <p>
        The requested ITL publication is not part of the current research atlas.
        Continue from a known reference point.
      </p>
      <nav aria-label="Not found navigation">
        <ul>
          <li>
            <PublicationLink href="/">Index</PublicationLink>
          </li>
          <li>
            <PublicationLink href="/manifesto">Manifesto</PublicationLink>
          </li>
          <li>
            <PublicationLink href="/glossary">Glossary</PublicationLink>
          </li>
        </ul>
      </nav>
    </article>
  );
}
