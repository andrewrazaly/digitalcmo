import Link from "next/link";
import { getAllArticles } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Tools",
  description:
    "Best SaaS tools for Australian businesses. Curated roundups by category.",
};

export default function BestToolsPage() {
  const articles = getAllArticles("best-tools");
  const categories = [...new Set(articles.map((a) => a.category))].sort();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Best Tools</h1>
      <p className="mt-2 text-slate-600">
        Curated roundups of the best SaaS tools by category.
      </p>
      {categories.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">
            By category
          </h2>
          <ul className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <li key={cat}>
                <Link
                  href={`/best-tools/${cat}`}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/best-tools/${article.slug}`}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {article.category}
            </span>
            <h2 className="mt-2 text-lg font-semibold text-slate-900 hover:text-slate-700">
              {article.title}
            </h2>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">
              {article.description}
            </p>
          </Link>
        ))}
      </div>
      {articles.length === 0 && (
        <p className="mt-8 text-slate-600">No roundups yet. Check back soon!</p>
      )}
    </div>
  );
}
