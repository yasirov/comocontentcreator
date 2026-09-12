"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { PillButton } from "@/components/PillButton";

export function Header() {
  const [open, setOpen] = useState(false);

  // Locks background scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:py-5">
        <Link
          href="/"
          className="focus-ring rounded-sm py-2 text-[13px] font-semibold tracking-tight whitespace-nowrap sm:text-sm"
        >
          {siteConfig.name.toUpperCase()}
          <sup className="ml-0.5 text-[10px]">®</sup>
        </Link>

        <nav className="hidden gap-8 text-sm md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded-sm py-2 text-foreground/80 transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <PillButton href="/#contact">Contact Us</PillButton>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="focus-ring -mr-2 flex h-11 w-11 items-center justify-center rounded-full md:hidden"
          >
            <span className="relative block h-4 w-5" aria-hidden>
              <span
                className={`absolute left-0 block h-0.5 w-5 rounded-full bg-foreground transition-transform duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0.5"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-0.5 w-5 rounded-full bg-foreground transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 rounded-full bg-foreground transition-transform duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-border bg-surface md:hidden"
      >
        <nav className="mx-auto flex max-w-6xl flex-col px-6 py-2">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="focus-ring rounded-lg py-3.5 text-base font-medium"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="focus-ring rounded-lg py-3.5 text-base font-medium"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
