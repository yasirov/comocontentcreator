import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { RichText } from "@/components/RichText";
import { PillButton } from "@/components/PillButton";
import { getArticle } from "@/lib/content";
import { focalPosition } from "@/lib/image";
import { metadataFrom } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { parseExtraJsonLd } from "@/lib/seo-settings";
import { toPlainText } from "@/lib/portable-text";

// How long a rendered copy of this page may be served from the Cloudflare
// cache before it is rebuilt in the background. Content published in Studio
// is otherwise invisible to visitors until the next deploy: the cache
// header on these pages is a full year, and nothing about a Sanity publish
// tells Cloudflare to drop it. A minute keeps "publish and refresh" honest
// without re-rendering on every request. Draft Mode bypasses this entirely,
// so the Presentation preview stays instant.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return metadataFrom(article.seo, {
    title: article.title,
    description: article.excerpt,
    path: `/journal/${slug}`,
    image: article.coverImage,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { isEnabled: isPreview } = await draftMode();
  const article = await getArticle(slug, isPreview);

  if (!article) notFound();

  const publishedLabel = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <JsonLd data={articleSchema({ ...article, slug })} />
      {parseExtraJsonLd(article.seo?.extraJsonLd).map((data, i) => (
        <JsonLd key={`page-extra-${i}`} data={data} />
      ))}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/journal" },
          { name: article.title, path: `/journal/${slug}` },
        ])}
      />
      <Link href="/journal" className="text-sm text-muted hover:text-foreground">
        ← Journal
      </Link>

      <div className="mt-6 flex items-center gap-3 text-sm text-muted">
        {publishedLabel && <span>{publishedLabel}</span>}
        {article.region && (
          <span className="uppercase tracking-wide text-xs">{article.region}</span>
        )}
      </div>

      <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
        {article.title}
      </h1>

      {article.author && (
        <div className="mt-6 flex items-center gap-3">
          {article.author.avatar ? (
            <Image
              src={article.author.avatar}
              alt={article.author.name}
              width={36}
              height={36}
              className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
              style={{
                objectPosition: focalPosition(article.author.avatarHotspot),
              }}
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-border" aria-hidden />
          )}
          <div className="text-sm">
            <p className="font-medium">{article.author.name}</p>
            {article.author.role && (
              <p className="text-muted">{article.author.role}</p>
            )}
          </div>
        </div>
      )}

      {article.coverImage && (
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl bg-surface">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            priority
            className="object-cover"
            style={{ objectPosition: focalPosition(article.coverHotspot) }}
          />
        </div>
      )}

      {/* Near-black rather than the muted grey used for short intros: a
          full article is a long read and needs the stronger contrast. */}
      <div className="mt-10 text-lg leading-relaxed text-foreground/85 [&_p]:mb-6">
        {article.body?.length ? (
          <RichText value={article.body} />
        ) : (
          <p>{toPlainText(article.excerpt)}</p>
        )}
      </div>

      <div className="mt-14 rounded-3xl bg-surface px-6 py-10 text-center sm:px-10">
        <h2 className="mx-auto max-w-sm text-2xl font-semibold leading-tight">
          Planning a wedding on Lake Como?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted leading-relaxed">
          Tell us your date and we&apos;ll check availability.
        </p>
        <PillButton href="/#contact" className="mt-6 px-5 py-2.5 text-sm">
          Let&apos;s Talk
        </PillButton>
      </div>

      <div className="mt-10">
        <Link
          href="/journal"
          className="text-sm text-muted hover:text-foreground"
        >
          ← All articles
        </Link>
      </div>
    </article>
  );
}
