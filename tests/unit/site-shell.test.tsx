import { readFileSync } from "node:fs";

import "@testing-library/jest-dom/vitest";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { MobileNavigation } from "@/components/publication/mobile-navigation";
import { PageIntro } from "@/components/publication/page-intro";
import { PublicationLink } from "@/components/publication/publication-link";
import { ResearchDisclaimer } from "@/components/publication/research-disclaimer";
import { SectionHeading } from "@/components/publication/section-heading";
import { SiteFooter } from "@/components/publication/site-footer";
import { SiteHeader } from "@/components/publication/site-header";
import { RESEARCH_DISCLAIMER } from "@/lib/content/registry";
import type { ContentEntry } from "@/lib/content/types";
import { SITE_NAVIGATION } from "@/lib/data/navigation";

const GLOBAL_STYLES = readFileSync("app/globals.css", "utf8").replace(
  '@import "tailwindcss";',
  "",
);

afterEach(cleanup);

describe("SiteHeader", () => {
  it("exposes the project identity and exact core navigation", () => {
    render(<SiteHeader />);

    expect(
      screen.getByRole("link", { name: "Industrial Twin Lab" }),
    ).toHaveAttribute("href", "/");

    const primaryNavigation = screen.getByRole("navigation", {
      name: "Primary",
    });
    expect(
      within(primaryNavigation)
        .getAllByRole("link")
        .map((link) => link.textContent),
    ).toEqual(["Index", "Manifesto", "Architecture", "Research", "About"]);
  });

  it("offers an all-sections disclosure that represents every publication route", () => {
    render(<SiteHeader />);

    fireEvent.click(screen.getByRole("button", { name: "All sections 13" }));

    const allSections = screen.getByRole("navigation", {
      name: "All sections",
    });
    expect(within(allSections).getAllByRole("link")).toHaveLength(
      SITE_NAVIGATION.length,
    );
  });
});

describe("MobileNavigation", () => {
  it("closes on Escape and returns focus to its trigger", () => {
    render(<MobileNavigation />);
    const trigger = screen.getByRole("button", { name: "All sections 13" });

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("closes when a route is selected without trapping later page focus", () => {
    render(
      <div onClick={(event) => event.preventDefault()}>
        <MobileNavigation />
        <button type="button">Underlying page control</button>
      </div>,
    );
    const trigger = screen.getByRole("button", { name: "All sections 13" });

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("link", { name: "Manifesto" }));
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    const pageControl = screen.getByRole("button", {
      name: "Underlying page control",
    });
    pageControl.focus();
    expect(pageControl).toHaveFocus();
  });
});

describe("publication primitives", () => {
  const entry: ContentEntry = {
    id: "research",
    href: "/research",
    title: "Open Research Questions",
    description: "A bounded catalogue of unresolved engineering questions.",
    order: 10,
    status: "Research / Experimental",
    relatedHrefs: ["/manifesto"],
    validation: { disclosures: ["research"] },
  };

  it("renders publication metadata as a semantic page introduction", () => {
    render(<PageIntro entry={entry} eyebrow="Research catalogue" />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      entry.title,
    );
    expect(screen.getByText(entry.description)).toBeInTheDocument();
    expect(screen.getByText("Research catalogue")).toBeInTheDocument();
    expect(screen.getByText("Research / Experimental")).toBeInTheDocument();
  });

  it("pairs section headings with optional figure notation", () => {
    render(
      <SectionHeading label="Safety architecture" figure="Figure 02">
        Governed evidence flow
      </SectionHeading>,
    );

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Governed evidence flow",
    );
    expect(screen.getByText("Figure 02")).toBeInTheDocument();
  });

  it("hardens external links that open a new browsing context", () => {
    render(
      <PublicationLink href="https://example.com/research" target="_blank">
        External research
      </PublicationLink>,
    );

    expect(
      screen.getByRole("link", { name: /External research/ }),
    ).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the canonical research safety disclaimer", () => {
    render(<ResearchDisclaimer />);
    expect(screen.getByText(RESEARCH_DISCLAIMER)).toBeInTheDocument();
  });
});

describe("SiteFooter", () => {
  it("publishes status, safety context, repository provenance, and the route index", () => {
    render(<SiteFooter />);

    expect(screen.getByText("Research / Experimental")).toBeInTheDocument();
    expect(screen.getByText(RESEARCH_DISCLAIMER)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /GitHub repository/ }),
    ).toHaveAttribute(
      "href",
      "https://github.com/aserdargun/itl-aserdargun-com",
    );

    const routeIndex = screen.getByRole("navigation", {
      name: "Publication index",
    });
    expect(within(routeIndex).getAllByRole("link")).toHaveLength(
      SITE_NAVIGATION.length + 1,
    );
  });
});

describe("focus contrast", () => {
  it("restores the light-surface focus token on paper-backed elements", () => {
    const { container } = render(
      <>
        <style>{GLOBAL_STYLES}</style>
        <div className="surface-dark">
          <a className="skip-link" href="#paper-content">
            Skip to paper content
          </a>
          <main className="publication-sheet" id="paper-content">
            <button type="button">Paper control</button>
          </main>
        </div>
      </>,
    );

    const darkSurface = container.querySelector<HTMLElement>(".surface-dark");
    const paper = container.querySelector<HTMLElement>(".publication-sheet");
    const skipLink = screen.getByRole("link", {
      name: "Skip to paper content",
    });

    expect(darkSurface).not.toBeNull();
    expect(paper).not.toBeNull();
    expect(
      getComputedStyle(darkSurface!).getPropertyValue("--color-focus"),
    ).toBe("var(--color-focus-on-dark)");
    expect(getComputedStyle(paper!).getPropertyValue("--color-focus")).toBe(
      "var(--color-focus-on-light)",
    );
    expect(getComputedStyle(skipLink).getPropertyValue("--color-focus")).toBe(
      "var(--color-focus-on-light)",
    );
  });
});
