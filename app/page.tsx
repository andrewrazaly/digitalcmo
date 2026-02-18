import Link from "next/link";
import { ArticleCard } from "@/components/content/ArticleCard";
import { getAllArticles } from "@/lib/content";

export default function HomePage() {
  const featured = getAllArticles().filter((a) => a.featured).slice(0, 3);
  const recent = getAllArticles().slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <section className="mb-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          SaaS Tool Comparisons & Reviews for Australian Businesses
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          We compare and review the best accounting, CRM, project management,
          and e-commerce tools to help you choose the right software for your
          business.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="mb-6 text-xl font-semibold text-slate-900">
          Browse by category
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/compare"
            className="rounded-lg border border-slate-200 bg-white p-6 text-center transition-shadow hover:shadow-md"
          >
            <span className="text-2xl">⚖️</span>
            <h3 className="mt-2 font-semibold text-slate-900">Compare</h3>
            <p className="mt-1 text-sm text-slate-600">
              Side-by-side tool comparisons
            </p>
          </Link>
          <Link
            href="/reviews"
            className="rounded-lg border border-slate-200 bg-white p-6 text-center transition-shadow hover:shadow-md"
          >
            <span className="text-2xl">📝</span>
            <h3 className="mt-2 font-semibold text-slate-900">Reviews</h3>
            <p className="mt-1 text-sm text-slate-600">
              In-depth tool reviews
            </p>
          </Link>
          <Link
            href="/best-tools"
            className="rounded-lg border border-slate-200 bg-white p-6 text-center transition-shadow hover:shadow-md"
          >
            <span className="text-2xl">🏆</span>
            <h3 className="mt-2 font-semibold text-slate-900">Best Tools</h3>
            <p className="mt-1 text-sm text-slate-600">
              Curated roundups by category
            </p>
          </Link>
          <Link
            href="/guides"
            className="rounded-lg border border-slate-200 bg-white p-6 text-center transition-shadow hover:shadow-md"
          >
            <span className="text-2xl">📚</span>
            <h3 className="mt-2 font-semibold text-slate-900">Guides</h3>
            <p className="mt-1 text-sm text-slate-600">
              How-to guides and tips
            </p>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-semibold text-slate-900">
          Latest articles
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(featured.length > 0 ? featured : recent).map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
        {recent.length === 0 && (
          <p className="text-center text-slate-600">
            No articles yet. Check back soon!
          </p>
        )}
      </section>
    </div>
  );
}
