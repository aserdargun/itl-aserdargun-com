"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MobileNavigation } from "@/components/publication/mobile-navigation";

const CORE_NAVIGATION = [
  { label: "Index", href: "/" },
  { label: "Manifesto", href: "/manifesto" },
  { label: "Architecture", href: "/architecture" },
  { label: "Research", href: "/research" },
  { label: "About", href: "/about" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const currentPathname =
    !pathname || pathname === "/" ? "/" : pathname.replace(/\/+$/u, "");

  return (
    <header className="site-header surface-dark">
      <div className="site-header__inner">
        <Link aria-label="Industrial Twin Lab" className="site-brand" href="/">
          <span>Industrial Twin Lab</span>
          <span aria-hidden="true"> / ITL</span>
        </Link>

        <nav aria-label="Primary" className="primary-navigation">
          <ul>
            {CORE_NAVIGATION.map((item) => (
              <li key={item.href}>
                <a
                  aria-current={
                    currentPathname === item.href ? "page" : undefined
                  }
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <MobileNavigation />
      </div>
    </header>
  );
}
