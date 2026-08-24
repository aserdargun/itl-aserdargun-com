import Link from "next/link";

import { PublicationLink } from "@/components/publication/publication-link";
import { ResearchDisclaimer } from "@/components/publication/research-disclaimer";
import { SITE_NAVIGATION } from "@/lib/data/navigation";

const REPOSITORY_URL = "https://github.com/aserdargun/itl-aserdargun-com";

export function SiteFooter() {
  return (
    <footer className="site-footer surface-dark">
      <div className="site-footer__inner">
        <div className="site-footer__statement">
          <p className="site-footer__status">Research / Experimental</p>
          <p className="site-footer__title">Industrial Twin Lab / ITL</p>
          <ResearchDisclaimer />
          <PublicationLink href={REPOSITORY_URL} target="_blank">
            GitHub repository
          </PublicationLink>
        </div>

        <nav aria-label="Publication index" className="footer-index">
          <p>Publication index</p>
          <ol>
            <li>
              <Link href="/">
                <span aria-hidden="true">00</span>
                <span>Index</span>
              </Link>
            </li>
            {SITE_NAVIGATION.map((item, index) => (
              <li key={item.id}>
                <a href={item.href}>
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </footer>
  );
}
