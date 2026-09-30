import Link from "next/link";
import { getAllArticles } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Tools",
  description:
    "Best digital marketing tools by category—SEO, email, social, AI writing, and more.",
};

export default function BestToolsPage() {
  const articles = getAllArticles("best-tools");

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold tracking-tight text-ink">
        Best Tools
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Curated roundups of the best digital marketing tools by job to be done.
      </p>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/best-tools/${article.slug}`}
            className="group border-b border-line pb-6 transition-colors hover:border-accent"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
              {article.category?.replace(/-/g, " ")}
            </span>
            <h2 className="font-display mt-2 text-xl font-bold text-ink group-hover:text-accent-deep">
              {article.title}
            </h2>
            <p className="mt-2 line-clamp-2 text-sm text-muted">
              {article.description}
            </p>
          </Link>
        ))}
      </div>
      {articles.length === 0 && (
        <p className="mt-8 text-muted">No roundups yet. Check back soon.</p>
      )}
    </div>
  );
}
