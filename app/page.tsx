import Link from "next/link";
import { ArticleCard } from "@/components/content/ArticleCard";
import { NewsletterCTA } from "@/components/content/NewsletterCTA";
import { getAllArticles } from "@/lib/content";
import { getTopics } from "@/lib/topics";

export default function HomePage() {
  const featured = getAllArticles().filter((a) => a.featured).slice(0, 3);
  const recent = getAllArticles().slice(0, 6);
  const topics = getTopics().slice(0, 6);
  const articles = featured.length > 0 ? featured : recent;

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-hero-from via-hero-mid to-hero-to text-white">
        <div className="hero-grid absolute inset-0 opacity-60" aria-hidden />
        <div
          className="animate-pulse-soft absolute -right-20 top-10 h-64 w-64 rounded-full bg-glow/20 blur-3xl"
          aria-hidden
        />
        <div
          className="animate-drift absolute bottom-0 left-1/4 h-40 w-40 rounded-full bg-accent/30 blur-2xl"
          aria-hidden
        />

        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-24 sm:px-6 sm:pb-20">
          <p className="animate-rise font-display text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl">
            Digital CMO
          </p>
          <h1 className="animate-rise-delay mt-6 max-w-2xl font-display text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
            Digital marketing content that ranks—and pays.
          </h1>
          <p className="animate-rise-delay-2 mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            Auto-published comparisons, reviews, and playbooks for SEO, email,
            ads, and growth tools. Built for organic traffic and affiliate
            revenue.
          </p>
          <div className="animate-rise-delay-2 mt-8 flex flex-wrap gap-3">
            <Link
              href="/topics"
              className="rounded-lg bg-glow px-5 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.02]"
            >
              Explore topics
            </Link>
            <Link
              href="/best-tools"
              className="rounded-lg border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              Best marketing tools
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
              Marketing topics that attract buyers
            </h2>
            <p className="mt-2 max-w-2xl text-muted">
              Niche clusters designed for search demand—not generic SaaS noise.
            </p>
          </div>
          <Link
            href="/topics"
            className="hidden text-sm font-semibold text-accent hover:text-accent-deep sm:inline"
          >
            All topics →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="group border-b border-line pb-5 transition-colors hover:border-accent"
            >
              <h3 className="font-display text-xl font-bold text-ink group-hover:text-accent-deep">
                {topic.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {topic.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface/70">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
            Latest from the engine
          </h2>
          <p className="mt-2 text-muted">
            Fresh reviews, comparisons, and guides queued for search.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={`${article.type}-${article.slug}`} article={article} />
            ))}
          </div>
          {articles.length === 0 && (
            <p className="mt-8 text-center text-muted">
              Articles are generating. Check back soon.
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <NewsletterCTA variant="dark" />
      </section>
    </div>
  );
}
