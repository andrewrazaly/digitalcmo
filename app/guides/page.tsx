import { ArticleCard } from "@/components/content/ArticleCard";
import { getAllArticles } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "How-to guides and tips for Australian businesses. Choosing software, best practices, and more.",
};

export default function GuidesPage() {
  const articles = getAllArticles("guides");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Guides</h1>
      <p className="mt-2 text-slate-600">
        How-to guides and practical tips for Australian businesses.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
      {articles.length === 0 && (
        <p className="mt-8 text-slate-600">No guides yet. Check back soon!</p>
      )}
    </div>
  );
}
