import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@fontsource-variable/inter";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/newsreader/wght-italic.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";

import { SiteFooter } from "@/components/publication/site-footer";
import { SiteHeader } from "@/components/publication/site-header";
import { SITE_DESCRIPTION, SOCIAL_IMAGE } from "@/lib/metadata";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://itl.aserdargun.com"),
  title: { default: "ITL - Industrial Twin", template: "%s · Industrial Twin" },
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ITL - Industrial Twin",
    title: "ITL - Industrial Twin",
    description: SITE_DESCRIPTION,
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "ITL - Industrial Twin",
    description: SITE_DESCRIPTION,
    images: [SOCIAL_IMAGE.url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="surface-dark">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <noscript>
          <div
            style={{
              maxWidth: "52rem",
              margin: "3rem auto",
              padding: "0 1rem",
              fontFamily: "sans-serif",
              lineHeight: 1.6,
            }}
          >
            <h2>Industrial Twin Lab</h2>
            <p>
              An English research publication examining isolated digital-twin
              experiments, evidence, uncertainty, and human-governed industrial
              machine intelligence. The interactive sections need JavaScript;
              the summary below does not.
            </p>
            <p>What this publication covers:</p>
            <ul>
              <li>
                A manifesto that separates simulation, evidence, engineering
                judgment, and control authority.
              </li>
              <li>
                P-101 twin anatomy and typed evidence fixtures drawn from a
                canonical fictional pump.
              </li>
              <li>
                Deterministic synthetic decision experiments with seeded,
                replayable evidence packages.
              </li>
              <li>
                Fault, feature, and fleet-intelligence laboratory walkthroughs.
              </li>
            </ul>
            <p>
              Every experiment output is a synthetic observer output computed
              from authored fixtures. There is no field connection, no OT
              connector, and no control authority over a physical machine.
            </p>
          </div>
        </noscript>
        <div className="publication-shell">
          <SiteHeader />
          <main className="publication-sheet" id="main-content" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
