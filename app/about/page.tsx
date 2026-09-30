import type { Metadata } from "next";
import { NewsletterCTA } from "@/components/content/NewsletterCTA";

export const metadata: Metadata = {
  title: "About",
  description:
    "Digital CMO is an auto-publishing digital marketing blog built for organic traffic and affiliate monetisation.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold tracking-tight text-ink">
        About Digital CMO
      </h1>
      <div className="prose mt-8">
        <p>
          Digital CMO is an auto-blogging engine focused on digital marketing:
          SEO, email, paid ads, social, analytics, and the tools marketers use
          to grow traffic and revenue.
        </p>
        <h2>How the site works</h2>
        <p>
          We maintain a queue of high-intent topics—comparisons, reviews,
          roundups, and guides. Articles are generated on a schedule, published
          to the site, and structured for search with clean URLs, schema, and
          internal topical linking.
        </p>
        <h2>How we monetise</h2>
        <p>
          Primary revenue is affiliate partnerships with marketing tools. When
          you buy through our links, we may earn a commission at no extra cost
          to you. We also collect subscribers for a marketing brief so readers
          can stay close to new rankings and tool picks.
        </p>
        <h2>Editorial stance</h2>
        <p>
          We aim for buyer-intent clarity over hype. Every review should help you
          decide who a tool is for—and who should skip it.
        </p>
      </div>
      <div className="mt-12">
        <NewsletterCTA />
      </div>
    </div>
  );
}
