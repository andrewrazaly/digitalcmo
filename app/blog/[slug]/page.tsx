import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/content/MDXContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import { buildArticleJsonLd, buildArticleMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return buildArticleMetadata(post.frontmatter);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { frontmatter, content, readingTime } = post;

  return (
    <article className="site-shell">
      <JsonLd data={buildArticleJsonLd(frontmatter)} />
      <header className="article-header">
        <div className="article-meta">
          <time dateTime={frontmatter.publishedAt}>
            {formatDate(frontmatter.publishedAt)}
          </time>
          <span aria-hidden="true">·</span>
          <span>{readingTime}</span>
          <span aria-hidden="true">·</span>
          <span>{frontmatter.author}</span>
        </div>
        <h1>{frontmatter.title}</h1>
        <p className="lede">{frontmatter.description}</p>
        {frontmatter.tags.length > 0 && (
          <ul className="tag-row" aria-label="Tags">
            {frontmatter.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
      </header>
      <div className="article-body">
        <MDXContent source={content} />
      </div>
    </article>
  );
}
