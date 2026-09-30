import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/content/ArticleCard";
import { NewsletterCTA } from "@/components/content/NewsletterCTA";
import { getAllArticles } from "@/lib/content";
import { getTopicBySlug, getTopics, matchTopicSlug } from "@/lib/topics";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getTopics().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return {};
  return {
    title: `${topic.name} Resources`,
    description: topic.description,
  };
}

export default async function TopicDetailPage({ params }: Props) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  const articles = getAllArticles().filter((a) => {
    const matched = matchTopicSlug(a.category, a.tags || []);
    return matched === topic.slug;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
        Topic
      </p>
      <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
        {topic.name}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">{topic.description}</p>

      <div className="mt-12 space-y-8">
        {articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard key={`${article.type}-${article.slug}`} article={article} />
          ))
        ) : (
          <p className="text-muted">
            Articles for this topic are in the generation queue. Check back soon.
          </p>
        )}
      </div>

      <div className="mt-16">
        <NewsletterCTA />
      </div>
    </div>
  );
}
