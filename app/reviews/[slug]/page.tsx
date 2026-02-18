import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Sidebar } from "@/components/layout/Sidebar";
import { AuthorBox } from "@/components/content/AuthorBox";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getArticleBySlug,
  getRelatedArticles,
  getAllSlugs,
} from "@/lib/content";
import {
  generateArticleMetadata,
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo";
import { mdxOptions, mdxComponents } from "@/lib/mdx";
import { ArticleCard } from "@/components/content/ArticleCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs("reviews");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug("reviews", slug);
  if (!article) return {};
  return generateArticleMetadata(article.frontmatter, "reviews");
}

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug("reviews", slug);
  if (!article) notFound();

  const { frontmatter, content, headings, readingTime } = article;
  const related = getRelatedArticles(frontmatter, 3);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Reviews", href: "/reviews" },
    { label: frontmatter.title },
  ];

  const articleJsonLd = generateArticleJsonLd(frontmatter, "reviews");
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "https://digitalcmo.com.au" },
    { name: "Reviews", url: "https://digitalcmo.com.au/reviews" },
    { name: frontmatter.title, url: `https://digitalcmo.com.au/reviews/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex gap-8">
          <div className="min-w-0 flex-1">
            <Breadcrumbs items={breadcrumbItems} />
            <article>
              <h1 className="text-3xl font-bold text-slate-900">
                {frontmatter.title}
              </h1>
              <p className="mt-2 text-slate-600">{frontmatter.description}</p>
              <p className="mt-2 text-sm text-slate-500">
                {frontmatter.author} · {readingTime} min read ·{" "}
                {new Date(frontmatter.publishedAt).toLocaleDateString("en-AU")}
              </p>
              <div className="prose mt-8">
                <MDXRemote source={content} options={mdxOptions} components={mdxComponents} />
              </div>
              <AuthorBox author={frontmatter.author} />
            </article>
            {related.length > 0 && (
              <section className="mt-12">
                <h2 className="mb-4 text-xl font-semibold text-slate-900">
                  Related articles
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {related.map((a) => (
                    <ArticleCard key={a.slug} article={a} />
                  ))}
                </div>
              </section>
            )}
          </div>
          <Sidebar headings={headings} />
        </div>
      </div>
    </>
  );
}
