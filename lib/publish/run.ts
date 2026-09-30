import { getAllPosts } from "@/lib/posts";
import { getSiteUrl } from "@/lib/site";
import { runIdeation } from "@/lib/topics/ideate";
import {
  formatTopicHint,
  loadTopicQueue,
  markTopicPublished,
  markTopicRejected,
  needsIdeation,
  peekNextTopic,
  serializeTopicQueue,
} from "@/lib/topics/queue";
import { TOPIC_QUEUE_PATH } from "@/lib/topics/types";
import { generateArticle } from "./generate";
import { publishFiles, todayUtcDate, type CommitFile } from "./github";
import { assemblePost, runQualityGates } from "./qa";
import type { PublishRunResult } from "./types";

function hasPostForDate(date: string): boolean {
  return getAllPosts().some((p) => p.frontmatter.publishedAt === date);
}

function logLine(payload: Record<string, unknown>) {
  console.log(JSON.stringify({ scope: "publish", ...payload }));
}

function requireAiCredentials() {
  if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
    throw new Error(
      "Missing AI credentials: set AI_GATEWAY_API_KEY (or rely on VERCEL_OIDC_TOKEN on Vercel)."
    );
  }
}

/**
 * Ensure the topic queue has enough queued items. Returns updated queue JSON
 * when ideation ran (caller should persist).
 */
async function ensureQueueFilled(): Promise<{
  queueJson?: string;
  ideationAdded: number;
  topicHint?: string;
  topicId?: string;
}> {
  let queue = loadTopicQueue();
  let queueJson: string | undefined;
  let ideationAdded = 0;

  if (needsIdeation(queue)) {
    logLine({ event: "ideation_start", queued: queue.topics.filter((t) => t.status === "queued").length });
    const ideation = await runIdeation({ force: false });
    queue = ideation.queue;
    queueJson = ideation.queueJson;
    ideationAdded = ideation.addedCount;
    logLine({
      event: "ideation_done",
      added: ideationAdded,
      queued: ideation.queuedCount,
      skipped: ideation.skipped,
    });
  }

  const next = peekNextTopic(queue);
  if (!next) {
    // Last resort: force ideation even if somehow empty after run
    const forced = await runIdeation({ force: true });
    queue = forced.queue;
    queueJson = forced.queueJson;
    ideationAdded += forced.addedCount;
  }

  const topic = peekNextTopic(queue);
  if (!topic) {
    throw new Error("Topic queue empty after ideation; cannot publish.");
  }

  return {
    queueJson,
    ideationAdded,
    topicHint: formatTopicHint(topic),
    topicId: topic.id,
  };
}

export async function runPublishJob(options?: {
  topicHint?: string;
  force?: boolean;
}): Promise<PublishRunResult> {
  const startedAt = new Date().toISOString();
  const date = todayUtcDate();
  let attempt = 0;
  let claimedTopicId: string | undefined;
  let pendingQueueJson: string | undefined;

  try {
    if (!options?.force && hasPostForDate(date)) {
      // Still refill the queue on skip days so the pipeline stays warm.
      let ideationNote: string | undefined;
      try {
        requireAiCredentials();
        if (needsIdeation(loadTopicQueue())) {
          const ideation = await runIdeation({ force: false });
          if (!ideation.skipped && ideation.addedCount >= 0) {
            await publishFiles(
              [{ path: TOPIC_QUEUE_PATH, content: ideation.queueJson }],
              `chore(content): refill topic queue (${ideation.addedCount} added)`
            );
            ideationNote = `Refilled queue (+${ideation.addedCount})`;
          }
        }
      } catch (error) {
        logLine({
          event: "skip_day_ideation_failed",
          reason: error instanceof Error ? error.message : String(error),
        });
      }

      const result: PublishRunResult = {
        status: "skipped",
        reason: [
          `Already published for ${date}`,
          ideationNote,
        ]
          .filter(Boolean)
          .join(" — "),
        attempt: 0,
        startedAt,
        finishedAt: new Date().toISOString(),
      };
      await writeRunLog(result);
      return result;
    }

    requireAiCredentials();

    let topicHint = options?.topicHint;
    if (!topicHint) {
      const ensured = await ensureQueueFilled();
      topicHint = ensured.topicHint;
      claimedTopicId = ensured.topicId;
      pendingQueueJson = ensured.queueJson;
    }

    let priorIssues: string[] = [];
    let lastQaIssues = undefined;

    while (attempt < 2) {
      attempt += 1;
      logLine({ event: "generate_start", attempt, date, topicId: claimedTopicId });

      const article = await generateArticle({
        topicHint,
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

      let queue = loadTopicQueue();
      if (pendingQueueJson) {
        queue = JSON.parse(pendingQueueJson);
      }
      if (claimedTopicId) {
        queue = markTopicPublished(
          queue,
          claimedTopicId,
          post.frontmatter.slug,
          date
        );
      }
      const queueJson = serializeTopicQueue(queue);

      const runPreview: PublishRunResult = {
        status: "published",
        slug: post.frontmatter.slug,
        path: postPath,
        url: publishedUrl,
        attempt,
        startedAt,
        finishedAt: new Date().toISOString(),
      };

      const files: CommitFile[] = [
        { path: postPath, content: post.mdx },
        { path: TOPIC_QUEUE_PATH, content: queueJson },
        {
          path: runLogPath,
          content:
            JSON.stringify(
              {
                ...runPreview,
                topicId: claimedTopicId,
                status: "published",
              },
              null,
              2
            ) + "\n",
        },
      ];

      const commit = await publishFiles(
        files,
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
        topicId: claimedTopicId,
        commitSha: result.commitSha,
        dryRun: result.dryRun,
      });

      return result;
    }

    // Reject the claimed topic after hard QA failure so the next run picks another.
    if (claimedTopicId) {
      let queue = loadTopicQueue();
      if (pendingQueueJson) queue = JSON.parse(pendingQueueJson);
      queue = markTopicRejected(
        queue,
        claimedTopicId,
        "Quality gates failed after retry"
      );
      try {
        await publishFiles(
          [{ path: TOPIC_QUEUE_PATH, content: serializeTopicQueue(queue) }],
          `chore(content): reject topic ${claimedTopicId}`
        );
      } catch (error) {
        logLine({
          event: "reject_persist_failed",
          reason: error instanceof Error ? error.message : String(error),
        });
      }
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
