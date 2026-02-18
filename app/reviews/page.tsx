import { ArticleCard } from "@/components/content/ArticleCard";
import { getAllArticles } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "In-depth SaaS tool reviews for Australian businesses. Accounting, CRM, project management, and more.",
};

export default function ReviewsPage() {
  const articles = getAllArticles("reviews");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Tool Reviews</h1>
      <p className="mt-2 text-slate-600">
        In-depth reviews of popular SaaS tools for Australian businesses.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
      {articles.length === 0 && (
        <p className="mt-8 text-slate-600">No reviews yet. Check back soon!</p>
      )}
    </div>
  );
}
