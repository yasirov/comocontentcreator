import type { Metadata } from "next";
import { draftMode } from "next/headers";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { VisualEditingClient } from "@/components/VisualEditingClient";
import { organizationSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";

// Font is declared as a system stack in globals.css (--font-sans) rather
// than next/font/google, so the build never depends on reaching
// fonts.googleapis.com. Swap in next/font/google (Inter, matching
// thelakeproposal.com) once there's real network access to verify the
// build with it.

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Photo & Video Content on Lake Como`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  // A "C" mark in two variants: a black letter on white for light mode, a
  // white letter on black for dark. app/icon.svg carries the same switch
  // inline as a fallback for browsers that ignore the media attribute.
  icons: {
    icon: [
      { url: "/icon-light.svg", media: "(prefers-color-scheme: light)", type: "image/svg+xml" },
      { url: "/icon-dark.svg", media: "(prefers-color-scheme: dark)", type: "image/svg+xml" },
    ],
    apple: "/icon-light.svg",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { isEnabled: isPreview } = await draftMode();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <JsonLd data={organizationSchema()} />
        {isPreview && (
          <div className="sticky top-0 z-50 flex items-center justify-center gap-3 bg-accent px-4 py-2 text-xs font-medium text-foreground">
            Preview mode - showing unpublished edits from Sanity.
            <a href="/api/draft-mode/disable" className="underline">
              Exit preview
            </a>
          </div>
        )}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {isPreview && <VisualEditingClient />}
      </body>
    </html>
  );
}
