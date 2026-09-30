import type { Metadata } from "next";
import Link from "next/link";
import { getTopics } from "@/lib/topics";

export const metadata: Metadata = {
  title: "Digital Marketing Topics",
  description:
    "Browse Digital CMO topics: SEO, email, social, PPC, content, analytics, and automation.",
};

export default function TopicsPage() {
  const topics = getTopics();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
        Topics
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Digital marketing clusters built to capture search demand and guide
        readers to the right tools.
      </p>
      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/topics/${topic.slug}`}
            className="group border-b border-line pb-6 transition-colors hover:border-accent"
          >
            <h2 className="font-display text-2xl font-bold text-ink group-hover:text-accent-deep">
              {topic.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {topic.description}
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.14em] text-accent">
              {topic.keywords.slice(0, 3).join(" · ")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
