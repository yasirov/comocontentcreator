import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="text-sm font-semibold">
              {siteConfig.name.toUpperCase()}
              <sup className="ml-0.5 text-[10px]">®</sup>
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Navigation</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Follow Us</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                Instagram | {siteConfig.name}
              </a>
              {siteConfig.founders.map((founder) => (
                <a
                  key={founder.name}
                  href={founder.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  Instagram | {founder.name.split(" ")[0]}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Contact Us</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
              <a
                href={`tel:${siteConfig.contactPhone.replace(/\s/g, "")}`}
                className="hover:text-foreground"
              >
                {siteConfig.contactPhone}
              </a>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="hover:text-foreground"
              >
                {siteConfig.contactEmail}
              </a>
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} All rights reserved</p>
          <p>
            A {siteConfig.parentBrand.name} studio ·{" "}
            <a href={siteConfig.parentBrand.url} className="hover:text-foreground">
              {siteConfig.parentBrand.url.replace("https://", "")}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
