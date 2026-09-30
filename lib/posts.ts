import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostFrontmatter } from "./types";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function assertFrontmatter(data: Record<string, unknown>, file: string): PostFrontmatter {
  const required = [
    "title",
    "description",
    "slug",
    "tags",
    "publishedAt",
    "updatedAt",
    "author",
  ] as const;

  for (const key of required) {
    if (data[key] === undefined || data[key] === null || data[key] === "") {
      throw new Error(`Missing frontmatter "${key}" in ${file}`);
    }
  }

  if (!Array.isArray(data.tags)) {
    throw new Error(`Frontmatter "tags" must be an array in ${file}`);
  }

  return {
    title: String(data.title),
    description: String(data.description),
    slug: String(data.slug),
    tags: data.tags.map(String),
    publishedAt: String(data.publishedAt),
    updatedAt: String(data.updatedAt),
    author: String(data.author),
  };
}

function readPostFile(filename: string): Post {
  const fullPath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = assertFrontmatter(data as Record<string, unknown>, filename);
  const stats = readingTime(content);

  return {
    frontmatter,
    content,
    readingTime: stats.text,
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  return files
    .map(readPostFile)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.publishedAt).getTime() -
        new Date(a.frontmatter.publishedAt).getTime()
    );
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.frontmatter.slug === slug);
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.frontmatter.slug);
}
