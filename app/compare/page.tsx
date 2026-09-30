import { ArticleCard } from "@/components/content/ArticleCard";
import { getAllArticles } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare",
  description:
    "Side-by-side digital marketing tool comparisons for SEO, email, social, and ads.",
};

export default function ComparePage() {
  const articles = getAllArticles("compare");

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold tracking-tight text-ink">
        Tool Comparisons
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Head-to-head matchups that answer which marketing tool wins for your
        use case.
      </p>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
      {articles.length === 0 && (
        <p className="mt-8 text-muted">No comparisons yet. Check back soon.</p>
      )}
    </div>
  );
}
