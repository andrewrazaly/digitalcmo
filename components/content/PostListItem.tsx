import Link from "next/link";
import type { Post } from "@/lib/types";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

export function PostListItem({ post }: { post: Post }) {
  const { frontmatter, readingTime } = post;
  return (
    <article className="post-list-item">
      <div className="post-list-item__meta">
        <time dateTime={frontmatter.publishedAt}>
          {formatDate(frontmatter.publishedAt)}
        </time>
        <span aria-hidden="true">·</span>
        <span>{readingTime}</span>
      </div>
      <h2 className="post-list-item__title">
        <Link href={`/blog/${frontmatter.slug}`}>{frontmatter.title}</Link>
      </h2>
      <p className="post-list-item__desc">{frontmatter.description}</p>
      {frontmatter.tags.length > 0 && (
        <ul className="tag-row" aria-label="Tags">
          {frontmatter.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}
    </article>
  );
}
