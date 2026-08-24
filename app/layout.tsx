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
  title: {
    default: "Industrial Twin Lab",
    template: "%s | Industrial Twin Lab",
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Industrial Twin Lab",
    title: "Industrial Twin Lab",
    description: SITE_DESCRIPTION,
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Industrial Twin Lab",
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
