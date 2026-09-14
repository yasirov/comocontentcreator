import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Four columns only from 1024px up. At 768px each column was 150px
            wide and the email address is 206px, so the footer pushed the
            whole page 32px wider than the screen and every page scrolled
            sideways on a tablet. */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm font-semibold">
              {siteConfig.name.toUpperCase()}
              <sup className="ml-0.5 text-[10px]">®</sup>
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Navigation</p>
            <div className="mt-2 flex flex-col text-sm text-muted">
              <Link href="/" className="inline-block py-1.5 hover:text-foreground">
                Home
              </Link>
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-block py-1.5 hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/privacy"
                className="inline-block py-1.5 hover:text-foreground"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Follow Us</p>
            <div className="mt-2 flex flex-col text-sm text-muted">
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-1.5 hover:text-foreground"
              >
                {siteConfig.instagramHandle}
              </a>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Contact Us</p>
            <div className="mt-2 flex flex-col text-sm text-muted">
              <a
                href={`tel:${siteConfig.contactPhone.replace(/\s/g, "")}`}
                className="inline-block py-1.5 hover:text-foreground"
              >
                {siteConfig.contactPhone}
              </a>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="inline-block break-words py-1.5 hover:text-foreground"
              >
                {siteConfig.contactEmail}
              </a>
            </div>
          </div>
        </div>
        <div className="mt-14 border-t border-border pt-6 text-xs text-muted">
          <p>© {new Date().getFullYear()} All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
