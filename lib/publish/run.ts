import { getAllPosts } from "@/lib/posts";
import { getSiteUrl } from "@/lib/site";
import { generateArticle } from "./generate";
import { publishFiles, todayUtcDate } from "./github";
import { assemblePost, runQualityGates } from "./qa";
import type { PublishRunResult } from "./types";

function hasPostForDate(date: string): boolean {
  return getAllPosts().some((p) => p.frontmatter.publishedAt === date);
}

function logLine(payload: Record<string, unknown>) {
  console.log(JSON.stringify({ scope: "publish", ...payload }));
}

export async function runPublishJob(options?: {
  topicHint?: string;
  force?: boolean;
}): Promise<PublishRunResult> {
  const startedAt = new Date().toISOString();
  const date = todayUtcDate();
  let attempt = 0;

  try {
    if (!options?.force && hasPostForDate(date)) {
      const result: PublishRunResult = {
        status: "skipped",
        reason: `Already published for ${date}`,
        attempt: 0,
        startedAt,
        finishedAt: new Date().toISOString(),
      };
      await writeRunLog(result);
      return result;
    }

    if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
      throw new Error(
        "Missing AI credentials: set AI_GATEWAY_API_KEY (or rely on VERCEL_OIDC_TOKEN on Vercel)."
      );
    }

    let priorIssues: string[] = [];
    let lastQaIssues = undefined;

    while (attempt < 2) {
      attempt += 1;
      logLine({ event: "generate_start", attempt, date });

      const article = await generateArticle({
        topicHint: options?.topicHint,
        attempt,
        priorIssues,
      });

      const post = assemblePost(article, {
        publishedAt: date,
        updatedAt: date,
      });

      const qa = runQualityGates(post);
      if (!qa.ok) {
        lastQaIssues = qa.issues;
        priorIssues = qa.issues.map((i) => `${i.code}: ${i.message}`);
        logLine({
          event: "qa_failed",
          attempt,
          issues: priorIssues,
        });
        continue;
      }

      const postPath = `content/posts/${post.frontmatter.slug}.mdx`;
      const runLogPath = `content/logs/${date}-publish.json`;
      const publishedUrl = `${getSiteUrl()}/blog/${post.frontmatter.slug}`;

      const runPreview: PublishRunResult = {
        status: "published",
        slug: post.frontmatter.slug,
        path: postPath,
        url: publishedUrl,
        attempt,
        startedAt,
        finishedAt: new Date().toISOString(),
      };

      const commit = await publishFiles(
        [
          { path: postPath, content: post.mdx },
          {
            path: runLogPath,
            content:
              JSON.stringify(
                {
                  ...runPreview,
                  status: "published",
                },
                null,
                2
              ) + "\n",
          },
        ],
        `chore(content): auto-publish ${post.frontmatter.slug}`
      );

      const result: PublishRunResult = {
        ...runPreview,
        status: commit.dryRun ? "dry_run" : "published",
        dryRun: commit.dryRun,
        commitSha: commit.sha,
        finishedAt: new Date().toISOString(),
      };

      logLine({
        event: "published",
        slug: result.slug,
        commitSha: result.commitSha,
        dryRun: result.dryRun,
      });

      // If dry-run already wrote the log file via publishFiles, fine.
      // For live publishes, log was included in the commit.
      if (commit.dryRun) {
        await writeRunLog(result);
      }

      return result;
    }

    const failed: PublishRunResult = {
      status: "failed",
      reason: "Quality gates failed after retry",
      attempt,
      qaIssues: lastQaIssues,
      startedAt,
      finishedAt: new Date().toISOString(),
    };

    await persistFailureLog(failed, date);
    return failed;
  } catch (error) {
    const failed: PublishRunResult = {
      status: "failed",
      reason: error instanceof Error ? error.message : String(error),
      attempt,
      startedAt,
      finishedAt: new Date().toISOString(),
    };
    logLine({ event: "error", reason: failed.reason });
    try {
      await persistFailureLog(failed, date);
    } catch (logError) {
      logLine({
        event: "log_write_failed",
        reason:
          logError instanceof Error ? logError.message : String(logError),
      });
    }
    return failed;
  }
}

function canPersistLogs(): boolean {
  return (
    process.env.PUBLISH_DRY_RUN === "1" ||
    process.env.PUBLISH_DRY_RUN === "true" ||
    Boolean(process.env.GITHUB_TOKEN?.trim())
  );
}

async function writeRunLog(result: PublishRunResult) {
  logLine({ event: "run_log", result });
  if (!canPersistLogs()) return;

  const date = todayUtcDate();
  const pathName = `content/logs/${date}-publish.json`;
  try {
    await publishFiles(
      [
        {
          path: pathName,
          content: JSON.stringify(result, null, 2) + "\n",
        },
      ],
      `chore(content): publish run log ${date}`
    );
  } catch (error) {
    logLine({
      event: "run_log_write_failed",
      writeError: error instanceof Error ? error.message : String(error),
    });
  }
}

async function persistFailureLog(result: PublishRunResult, date: string) {
  logLine({ event: "failed", result });
  if (!canPersistLogs()) return;

  const pathName = `content/logs/${date}-publish.json`;
  try {
    await publishFiles(
      [
        {
          path: pathName,
          content: JSON.stringify(result, null, 2) + "\n",
        },
      ],
      `chore(content): publish failure log ${date}`
    );
  } catch (error) {
    logLine({
      event: "failure_log_write_failed",
      reason: error instanceof Error ? error.message : String(error),
    });
  }
}
