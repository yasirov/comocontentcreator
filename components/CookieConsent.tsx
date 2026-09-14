"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

// Gates Google Analytics behind an explicit choice, so the gtag script never
// runs before a visitor has accepted. The choice is stored in localStorage
// (not a cookie itself) and re-asked after 12 months, per the GA setup
// documented in /privacy. No third-party consent-management platform - this
// is the whole banner.

const STORAGE_KEY = "cc-consent";
const REPROMPT_DAYS = 365;

type Consent = { choice: "accepted" | "declined"; ts: number };

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Consent;
    const ageDays = (Date.now() - parsed.ts) / (1000 * 60 * 60 * 24);
    if (ageDays > REPROMPT_DAYS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeConsent(choice: Consent["choice"]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, ts: Date.now() }));
  } catch {
    // Private browsing / storage blocked - the banner will just reappear
    // next visit, which is an acceptable fallback.
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      setVisible(true);
    } else if (existing.choice === "accepted") {
      setAccepted(true);
    }
  }, []);

  const measurementId = siteConfig.analytics.googleMeasurementId;

  return (
    <>
      {accepted && measurementId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${measurementId}', { anonymize_ip: true });`}
          </Script>
        </>
      )}

      {visible && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur px-6 py-5 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
        >
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted leading-relaxed">
              We use Google Analytics to understand how visitors use this
              site. It only runs if you accept. See our{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
                Privacy Policy
              </Link>{" "}
              for details.
            </p>
            <div className="flex flex-shrink-0 gap-3">
              <button
                type="button"
                onClick={() => {
                  writeConsent("declined");
                  setVisible(false);
                }}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-surface"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => {
                  writeConsent("accepted");
                  setAccepted(true);
                  setVisible(false);
                }}
                className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
