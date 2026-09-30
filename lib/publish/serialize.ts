import type { PostFrontmatter } from "@/lib/types";
import type { AssembledPost, GeneratedArticle } from "./types";

function yamlEscape(value: string): string {
  if (/[:#{}[\],&*?|>!%@`]/.test(value) || value.includes("\n") || value.includes('"')) {
    return JSON.stringify(value);
  }
  return value.includes(" ") ? JSON.stringify(value) : value;
}

export function serializeMdx(frontmatter: PostFrontmatter, body: string): string {
  const tags = frontmatter.tags.map((t) => `  - ${t}`).join("\n");
  const fm = [
    "---",
    `title: ${yamlEscape(frontmatter.title)}`,
    `description: ${yamlEscape(frontmatter.description)}`,
    `slug: ${yamlEscape(frontmatter.slug)}`,
    "tags:",
    tags,
    `publishedAt: ${JSON.stringify(frontmatter.publishedAt)}`,
    `updatedAt: ${JSON.stringify(frontmatter.updatedAt)}`,
    `author: ${JSON.stringify(frontmatter.author)}`,
    "---",
    "",
  ].join("\n");

  const normalized = body.replace(/\r\n/g, "\n").trimEnd() + "\n";
  return fm + normalized;
}

export function assemblePost(
  article: GeneratedArticle,
  dates: { publishedAt: string; updatedAt: string }
): AssembledPost {
  const frontmatter: PostFrontmatter = {
    title: article.title.trim(),
    description: article.description.trim(),
    slug: article.slug.trim().toLowerCase(),
    tags: article.tags.map((t) => t.trim().toLowerCase()).filter(Boolean),
    publishedAt: dates.publishedAt,
    updatedAt: dates.updatedAt,
    author: "Digital CMO",
  };

  const body = article.body.replace(/^\uFEFF/, "").trim() + "\n";
  const mdx = serializeMdx(frontmatter, body);
  return { frontmatter, body, mdx };
}
