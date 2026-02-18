import Link from "next/link";
import type { ArticleFrontmatter } from "@/lib/types";

interface ArticleCardProps {
  article: ArticleFrontmatter;
}

const typePaths: Record<string, string> = {
  review: "reviews",
  comparison: "compare",
  roundup: "best-tools",
  guide: "guides",
};

export function ArticleCard({ article }: ArticleCardProps) {
  const basePath = typePaths[article.type] || "reviews";
  const href = basePath === "best-tools"
    ? `/best-tools/${article.slug}`
    : `/${basePath}/${article.slug}`;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <Link href={href} className="block">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {article.category}
        </span>
        <h2 className="mt-2 text-lg font-semibold text-slate-900 hover:text-slate-700">
          {article.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">
          {article.description}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          {new Date(article.publishedAt).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </Link>
    </article>
  );
}
