import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { RichText } from "@/components/RichText";
import { getArticle } from "@/lib/content";
import { toPlainText } from "@/lib/portable-text";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
  };
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
              className="h-9 w-9 rounded-full object-cover"
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
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-10 text-lg leading-relaxed text-muted">
        {article.body?.length ? (
          <RichText value={article.body} />
        ) : (
          <p>{toPlainText(article.excerpt)}</p>
        )}
      </div>
    </article>
  );
}
