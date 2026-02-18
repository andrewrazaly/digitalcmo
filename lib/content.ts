import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { ArticleFrontmatter, ArticleContent, Heading } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const CONTENT_TYPES = ["reviews", "compare", "best-tools", "guides"] as const;

function getContentPath(type: string): string {
  const typeMap: Record<string, string> = {
    reviews: "reviews",
    compare: "compare",
    "best-tools": "best-tools",
    guides: "guides",
  };
  return path.join(CONTENT_DIR, typeMap[type] || type);
}

function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    headings.push({ id, text, level });
  }
  return headings;
}

export function getAllArticles(type?: string): ArticleFrontmatter[] {
  const types = type ? [type] : CONTENT_TYPES;
  const articles: ArticleFrontmatter[] = [];

  for (const t of types) {
    const dir = getContentPath(t);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (!file.endsWith(".mdx")) continue;
      const filePath = path.join(dir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);
      if (data.draft) continue;
      articles.push({
        ...data,
        slug: data.slug || file.replace(/\.mdx$/, ""),
      } as ArticleFrontmatter);
    }
  }

  return articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getArticleBySlug(
  type: string,
  slug: string
): ArticleContent | null {
  const dir = getContentPath(type);
  const possibleFiles = [`${slug}.mdx`, `${slug}.md`];

  for (const file of possibleFiles) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const headings = extractHeadings(content);
    const stats = readingTime(content);

    return {
      frontmatter: {
        ...data,
        slug: data.slug || slug,
      } as ArticleFrontmatter,
      content,
      headings,
      readingTime: Math.ceil(stats.minutes),
    };
  }
  return null;
}

export function getRelatedArticles(
  article: ArticleFrontmatter,
  limit: number = 3
): ArticleFrontmatter[] {
  const all = getAllArticles().filter(
    (a) => a.slug !== article.slug && a.type !== article.type
  );

  const scored = all.map((a) => {
    let score = 0;
    if (article.category && a.category === article.category) score += 2;
    const sharedTags = (article.tags || []).filter((t) =>
      (a.tags || []).includes(t)
    );
    score += sharedTags.length;
    const sharedTools = (article.tools || []).filter((t) =>
      (a.tools || []).includes(t)
    );
    score += sharedTools.length;
    return { article: a, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.article);
}

export function getAllSlugs(type: string): string[] {
  const dir = getContentPath(type);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

