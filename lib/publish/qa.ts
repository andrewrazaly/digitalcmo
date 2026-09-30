import matter from "gray-matter";
import type { PostFrontmatter } from "@/lib/types";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { BANLIST_PHRASES, BANLIST_REGEXES } from "./banlist";
import type { AssembledPost, QaIssue, QaResult } from "./types";

export { assemblePost } from "./serialize";

export const QA_LIMITS = {
  minWords: 750,
  maxWords: 2200,
  minH2: 2,
  minTags: 2,
  maxTags: 6,
  minTitle: 12,
  maxTitle: 110,
  minDescription: 40,
  maxDescription: 220,
} as const;

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TAKEAWAY_RE =
  /(?:^|\n)##\s+(?:key\s+takeaways?|decision\s+checklist|takeaways?|checklist)\b/i;

function wordCount(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function countH2(body: string): number {
  return (body.match(/(?:^|\n)##\s+\S/g) || []).length;
}

function push(issues: QaIssue[], code: string, message: string) {
  issues.push({ code, message });
}

export function runQualityGates(
  post: AssembledPost,
  options: { existingSlugs?: string[] } = {}
): QaResult {
  const issues: QaIssue[] = [];
  const { frontmatter, body } = post;
  const existing =
    options.existingSlugs ?? getAllPosts().map((p) => p.frontmatter.slug);

  if (!frontmatter.title) push(issues, "title_missing", "Title is required.");
  else {
    if (frontmatter.title.length < QA_LIMITS.minTitle) {
      push(issues, "title_short", `Title too short (< ${QA_LIMITS.minTitle}).`);
    }
    if (frontmatter.title.length > QA_LIMITS.maxTitle) {
      push(issues, "title_long", `Title too long (> ${QA_LIMITS.maxTitle}).`);
    }
  }

  if (!frontmatter.description) {
    push(issues, "description_missing", "Description is required.");
  } else {
    if (frontmatter.description.length < QA_LIMITS.minDescription) {
      push(
        issues,
        "description_short",
        `Description too short (< ${QA_LIMITS.minDescription}).`
      );
    }
    if (frontmatter.description.length > QA_LIMITS.maxDescription) {
      push(
        issues,
        "description_long",
        `Description too long (> ${QA_LIMITS.maxDescription}).`
      );
    }
  }

  if (!frontmatter.slug) push(issues, "slug_missing", "Slug is required.");
  else if (!SLUG_RE.test(frontmatter.slug)) {
    push(issues, "slug_invalid", "Slug must be lowercase kebab-case.");
  } else if (existing.includes(frontmatter.slug) || getPostBySlug(frontmatter.slug)) {
    push(issues, "slug_exists", `Slug already exists: ${frontmatter.slug}`);
  }

  if (frontmatter.author !== "Digital CMO") {
    push(issues, "author_invalid", 'Author must be "Digital CMO".');
  }

  if (!Array.isArray(frontmatter.tags) || frontmatter.tags.length < QA_LIMITS.minTags) {
    push(issues, "tags_few", `Need at least ${QA_LIMITS.minTags} tags.`);
  } else if (frontmatter.tags.length > QA_LIMITS.maxTags) {
    push(issues, "tags_many", `At most ${QA_LIMITS.maxTags} tags.`);
  }

  const words = wordCount(body);
  if (words < QA_LIMITS.minWords) {
    push(
      issues,
      "wordcount_low",
      `Body has ${words} words; minimum is ${QA_LIMITS.minWords}.`
    );
  }
  if (words > QA_LIMITS.maxWords) {
    push(
      issues,
      "wordcount_high",
      `Body has ${words} words; maximum is ${QA_LIMITS.maxWords}.`
    );
  }

  const h2 = countH2(body);
  if (h2 < QA_LIMITS.minH2) {
    push(
      issues,
      "h2_few",
      `Need at least ${QA_LIMITS.minH2} H2 sections; found ${h2}.`
    );
  }

  if (!TAKEAWAY_RE.test(body)) {
    push(
      issues,
      "takeaways_missing",
      'Missing required "## Key takeaways" or "## Decision checklist" section.'
    );
  }

  const haystack = `${frontmatter.title}\n${frontmatter.description}\n${body}`.toLowerCase();
  for (const phrase of BANLIST_PHRASES) {
    if (haystack.includes(phrase.toLowerCase())) {
      push(issues, "banlist", `Banned phrase detected: "${phrase}"`);
    }
  }
  for (const re of BANLIST_REGEXES) {
    if (re.test(haystack)) {
      push(issues, "banlist", `Banned pattern detected: ${re}`);
    }
  }

  // Soft CMO-voice heuristics (hard fail if clearly off-brand listicle)
  if (/\b(pros\s*\/\s*cons|pricing plans|affiliate)\b/i.test(body)) {
    push(
      issues,
      "off_brand",
      "Looks like product-review/affiliate content, not CMO strategy."
    );
  }

  return { ok: issues.length === 0, issues };
}

/** Parse MDX fixtures for QA tests. */
export function parseMdxFixture(raw: string): AssembledPost {
  const { data, content } = matter(raw);
  const frontmatter = data as PostFrontmatter;
  return {
    frontmatter: {
      title: String(frontmatter.title || ""),
      description: String(frontmatter.description || ""),
      slug: String(frontmatter.slug || ""),
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags.map(String) : [],
      publishedAt: String(frontmatter.publishedAt || ""),
      updatedAt: String(frontmatter.updatedAt || ""),
      author: String(frontmatter.author || ""),
    },
    body: content.trim() + "\n",
    mdx: raw,
  };
}
