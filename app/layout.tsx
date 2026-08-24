import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@fontsource-variable/inter";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/newsreader/wght-italic.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";

import { SiteFooter } from "@/components/publication/site-footer";
import { SiteHeader } from "@/components/publication/site-header";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://itl.aserdargun.com"),
  title: {
    default: "Industrial Twin Lab",
    template: "%s | Industrial Twin Lab",
  },
  description:
    "An English research publication examining isolated digital-twin experiments, evidence, uncertainty, and human-governed industrial machine intelligence.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Industrial Twin Lab",
    title: "Industrial Twin Lab",
    description:
      "An English research publication examining isolated digital-twin experiments, evidence, uncertainty, and human-governed industrial machine intelligence.",
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 630,
        alt: "Industrial Twin Lab research monograph cover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Industrial Twin Lab",
    description:
      "An English research publication examining isolated digital-twin experiments, evidence, uncertainty, and human-governed industrial machine intelligence.",
    images: ["/opengraph.png"],
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
