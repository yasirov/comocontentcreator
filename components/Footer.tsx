import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/70 bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-lg">{siteConfig.name}</p>
            <p className="mt-2 max-w-xs text-sm text-muted">
              {siteConfig.tagline}
            </p>
          </div>
          <div className="text-sm">
            <p className="font-medium text-foreground">Serving</p>
            <p className="mt-2 text-muted">
              {siteConfig.location.areaServed.join(", ")}
            </p>
          </div>
          <div className="text-sm">
            <p className="font-medium text-foreground">Connect</p>
            <div className="mt-2 flex flex-col gap-1 text-muted">
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-accent"
              >
                Instagram
              </a>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="transition hover:text-accent"
              >
                {siteConfig.contactEmail}
              </a>
              <a
                href={siteConfig.parentBrand.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-accent"
              >
                A {siteConfig.parentBrand.name} studio
              </a>
            </div>
          </div>
        </div>
        <p className="mt-10 text-xs text-muted">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
