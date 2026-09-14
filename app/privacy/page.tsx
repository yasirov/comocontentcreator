import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

// GDPR Article 13 notice for the contact form and the site's analytics.
// Everything here describes what the site actually does today: one form,
// Google Analytics gated behind the cookie banner (components/CookieConsent),
// no advertising or tracking beyond that. If anything else is added, this
// page has to be updated in the same change.
//
// Written from the stack as built: app/api/contact/route.ts emails through
// Resend, saves a backup "inquiry" document to Sanity, and optionally checks
// Cloudflare Turnstile. The identity of the controller lives in
// lib/site-config.ts under `legal`.

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Como Content Creator collects, uses and stores the personal data you send through the contact form, and the rights you have over it.",
};

const { legal, name, url } = siteConfig;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 space-y-4 text-muted leading-relaxed [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-2 [&_a:hover]:text-foreground">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
        Privacy Policy
      </h1>
      <p className="mt-4 text-sm text-muted">
        Last updated {legal.privacyLastUpdated}
      </p>

      <p className="mt-8 text-lg leading-relaxed text-foreground/85">
        This notice explains what happens to the personal data you send us
        through this website, under Regulation (EU) 2016/679 (GDPR) and Italian
        Legislative Decree 196/2003 as amended.
      </p>

      <Section title="Who is responsible for your data">
        <p>
          The data controller is {legal.controllerName}, {legal.controllerForm},
          trading as {name}, at {legal.registeredAddress}. VAT number (P.IVA){" "}
          {legal.vatNumber}, Codice Fiscale {legal.taxCode}.
        </p>
        <p>
          For anything in this notice, including any of the requests described
          below, write to{" "}
          <a href={`mailto:${legal.controllerEmail}`}>{legal.controllerEmail}</a>{" "}
          or call{" "}
          <a href={`tel:${legal.controllerPhone.replace(/\s/g, "")}`}>
            {legal.controllerPhone}
          </a>
          . We have not appointed a Data Protection Officer, as we are not
          required to.
        </p>
      </Section>

      <Section title="What we collect">
        <p>
          Only what you type into the contact form: the names you give, your
          email address, and your message. The form also has three optional
          fields - your wedding or shoot date, which coverage option interests
          you, and any special requests. Nothing else on this site collects
          personal data about you.
        </p>
        <p>
          Our hosting provider records standard technical information for every
          visit, such as IP address, browser type and the pages requested, for
          security and to keep the site running. We do not use this to identify
          or profile visitors.
        </p>
      </Section>

      <Section title="Why we use it, and on what legal basis">
        <p>
          We use what you send to answer your enquiry, check availability for
          your date and discuss a possible booking. The legal basis is Article
          6(1)(b) GDPR: steps taken at your request before entering into a
          contract. The consent checkbox on the form confirms you are sending
          us this information deliberately.
        </p>
        <p>
          If a booking goes ahead, your data is then processed to perform that
          contract and to meet our accounting and tax obligations under Article
          6(1)(c). Spam filtering on the form, including the honeypot field and
          the captcha where enabled, rests on our legitimate interest in keeping
          the form usable under Article 6(1)(f).
        </p>
        <p>
          We do not use your data for marketing, we do not send newsletters, and
          we never sell or rent it to anyone.
        </p>
      </Section>

      <Section title="Who else sees it">
        <p>
          Your enquiry passes through a small number of service providers, each
          acting as a processor on our written instructions and none of them
          permitted to use your data for their own purposes:
        </p>
        <p>
          Cloudflare, Inc. hosts this website and, where the captcha is enabled,
          provides Turnstile. Resend (Plus Five Five, Inc.) delivers the
          notification email to us. Sanity AS stores a backup copy of your
          enquiry in our content system, so a message is not lost if the email
          fails. Google Ireland Limited provides the mailbox the notification
          arrives in and, if you accept the cookie banner below, processes
          analytics data about your visit.
        </p>
        <p>
          Some of these providers are established outside the European Economic
          Area or process data there. Those transfers are covered by the
          European Commission&apos;s Standard Contractual Clauses, together with
          the additional safeguards each provider applies.
        </p>
      </Section>

      <Section title="How long we keep it">
        <p>
          If your enquiry does not lead to a booking, we delete it within{" "}
          {legal.inquiryRetentionMonths} months of your last contact with us.
          Wedding dates are usually discussed a year or more in advance, and
          couples often come back to a conversation months later, which is why
          the period is not shorter.
        </p>
        <p>
          If you do book us, we keep the contract and the related records for as
          long as Italian tax and accounting law requires, which is normally ten
          years from the end of the relevant financial year.
        </p>
      </Section>

      <Section title="Footage and photographs from your wedding">
        <p>
          Video and photographs taken on a shoot are personal data too, both
          yours and your guests&apos;. How that material may be used, including
          whether any of it can appear on our website or social accounts, is
          agreed in writing in the contract for your wedding rather than here.
          Nothing from a wedding is published without the agreement recorded in
          that contract, and you can withdraw that agreement for future use at
          any time by writing to us.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          A banner asks first-time visitors whether we may use Google
          Analytics to understand how the site is used - pages viewed,
          approximate location by country/city, device type and how visitors
          found us. Analytics cookies are set only if you click Accept, and
          your IP address is anonymised before Google processes it. If you
          click Decline, or simply close the banner, no analytics cookie is
          set and nothing is sent to Google. You can change your mind at any
          time by clearing your browser&apos;s cookies for this site, which
          brings the banner back on your next visit.
        </p>
        <p>
          Google Ireland Limited processes analytics data under the same
          Standard Contractual Clauses referenced above. We have not enabled
          Google Signals or advertising features in this property, so
          analytics data is not linked to your Google account or used for ad
          personalisation.
        </p>
        <p>
          Separately, and regardless of your choice above: where the contact
          form captcha is enabled, Cloudflare Turnstile may set a strictly
          necessary cookie to tell a person from a bot. A further cookie
          exists only for our own editors when previewing unpublished
          changes, and is never set for ordinary visitors.
        </p>
      </Section>

      <Section title="Your rights">
        <p>
          You can ask us for a copy of the data we hold about you, to correct it
          if it is wrong, to delete it, to restrict how we use it, or to receive
          it in a portable format. You can object to processing based on
          legitimate interest, and where processing rests on consent you can
          withdraw that consent at any time without affecting what was lawful
          beforehand.
        </p>
        <p>
          Write to{" "}
          <a href={`mailto:${legal.controllerEmail}`}>{legal.controllerEmail}</a>{" "}
          and we will respond within one month. There is no charge.
        </p>
        <p>
          If you believe we have handled your data improperly, you can complain
          to the Italian supervisory authority, the Garante per la protezione
          dei dati personali, at{" "}
          <a
            href="https://www.garanteprivacy.it"
            target="_blank"
            rel="noopener noreferrer"
          >
            garanteprivacy.it
          </a>
          , or to the authority in the EU country where you live.
        </p>
      </Section>

      <Section title="Changes to this notice">
        <p>
          If what we do with your data changes, we will update this page and the
          date at the top of it. The current version is always at{" "}
          <Link href="/privacy">{url}/privacy</Link>.
        </p>
      </Section>

      <div className="mt-14">
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
