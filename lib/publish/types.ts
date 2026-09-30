import type { PostFrontmatter } from "@/lib/types";

export type GeneratedArticle = {
  title: string;
  description: string;
  slug: string;
  tags: string[];
  body: string;
};

export type AssembledPost = {
  frontmatter: PostFrontmatter;
  body: string;
  mdx: string;
};

export type QaIssue = {
  code: string;
  message: string;
};

export type QaResult = {
  ok: boolean;
  issues: QaIssue[];
};

export type PublishStatus =
  | "published"
  | "skipped"
  | "failed"
  | "dry_run";

export type PublishRunResult = {
  status: PublishStatus;
  reason?: string;
  slug?: string;
  path?: string;
  url?: string;
  attempt: number;
  qaIssues?: QaIssue[];
  commitSha?: string;
  dryRun?: boolean;
  startedAt: string;
  finishedAt: string;
};
