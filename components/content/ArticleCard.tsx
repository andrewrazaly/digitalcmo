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
  const href =
    basePath === "best-tools"
      ? `/best-tools/${article.slug}`
      : `/${basePath}/${article.slug}`;

  return (
    <article className="group border-b border-line pb-6 transition-colors last:border-0">
      <Link href={href} className="block">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
          {article.category?.replace(/-/g, " ") || article.type}
        </span>
        <h2 className="font-display mt-2 text-xl font-bold tracking-tight text-ink transition-colors group-hover:text-accent-deep">
          {article.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {article.description}
        </p>
        <p className="mt-3 text-xs text-muted/80">
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
