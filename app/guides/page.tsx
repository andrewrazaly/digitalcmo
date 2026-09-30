import { ArticleCard } from "@/components/content/ArticleCard";
import { getAllArticles } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Digital marketing playbooks for traffic, SEO content systems, email funnels, and monetisation.",
};

export default function GuidesPage() {
  const articles = getAllArticles("guides");

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold tracking-tight text-ink">
        Guides
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Practical playbooks for growing traffic and turning it into revenue.
      </p>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
      {articles.length === 0 && (
        <p className="mt-8 text-muted">No guides yet. Check back soon.</p>
      )}
    </div>
  );
}
