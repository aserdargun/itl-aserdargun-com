"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { SITE_NAVIGATION } from "@/lib/data/navigation";

const NAVIGATION_ID = "all-sections-navigation";

export function MobileNavigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeNavigation = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNavigation();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeNavigation, isOpen]);

  return (
    <div className="section-disclosure">
      <button
        ref={triggerRef}
        aria-controls={NAVIGATION_ID}
        aria-expanded={isOpen}
        aria-label={`All sections ${SITE_NAVIGATION.length}`}
        className="section-disclosure__trigger"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span className="menu-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span>All sections</span>
        <span aria-hidden="true" className="section-disclosure__count">
          {SITE_NAVIGATION.length}
        </span>
      </button>

      <nav
        aria-label="All sections"
        className="section-disclosure__panel"
        hidden={!isOpen}
        id={NAVIGATION_ID}
      >
        <ol className="section-disclosure__list">
          {SITE_NAVIGATION.map((item, index) => (
            <li key={item.id}>
              <a
                aria-current={pathname === item.href ? "page" : undefined}
                href={item.href}
                onClick={closeNavigation}
              >
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
  );
}
