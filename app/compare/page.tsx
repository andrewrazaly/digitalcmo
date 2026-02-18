import { ArticleCard } from "@/components/content/ArticleCard";
import { getAllArticles } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare",
  description:
    "Side-by-side SaaS tool comparisons for Australian businesses. Find the best software for your needs.",
};

export default function ComparePage() {
  const articles = getAllArticles("compare");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Tool Comparisons</h1>
      <p className="mt-2 text-slate-600">
        Side-by-side comparisons to help you choose between popular SaaS tools.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
      {articles.length === 0 && (
        <p className="mt-8 text-slate-600">No comparisons yet. Check back soon!</p>
      )}
    </div>
  );
}
