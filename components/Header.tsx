import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { PillButton } from "@/components/PillButton";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          {siteConfig.name.toUpperCase()}
          <sup className="ml-0.5 text-[10px]">®</sup>
        </Link>
        <nav className="hidden gap-8 text-sm md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground/80 transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <PillButton href="/contact">Contact Us</PillButton>
      </div>
    </header>
  );
}
