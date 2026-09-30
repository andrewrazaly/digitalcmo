import { generateObject } from "ai";
import { z } from "zod";
import { getAllPosts } from "@/lib/posts";
import { loadBrandBrief } from "@/lib/publish/brief";
import { getPublishModelId } from "@/lib/publish/generate";
import {
  collectDedupKeys,
  countQueued,
  enqueueTopics,
  loadTopicQueue,
  needsIdeation,
  serializeTopicQueue,
} from "./queue";
import {
  IDEATE_BATCH_SIZE,
  MIN_QUEUED_TOPICS,
  TOPIC_QUEUE_PATH,
  type TopicQueue,
} from "./types";

const ideationSchema = z.object({
  topics: z
    .array(
      z.object({
        title: z
          .string()
          .describe("Working title for a Digital CMO strategy essay."),
        angle: z
          .string()
          .describe(
            "1–2 sentence strategic angle / thesis the essay should argue."
          ),
        keywords: z
          .array(z.string())
          .min(2)
          .max(6)
          .describe("Lowercase topic keywords for gap tracking."),
      })
    )
    .min(3)
    .max(5),
});

/** Gap keywords the brief cares about — used to nudge coverage. */
export const STRATEGY_GAP_KEYWORDS = [
  "channel portfolio",
  "content systems",
  "measurement scorecard",
  "brand positioning",
  "agency operating model",
  "demand generation",
  "editorial ops",
  "attribution honesty",
  "ai in marketing ops",
  "team design",
  "pipeline quality",
  "owned distribution",
];

export function getIdeationModelId(): string {
  return (
    process.env.AI_MODEL_IDEATION?.trim() ||
    process.env.AI_MODEL?.trim() ||
    getPublishModelId()
  );
}

function coverageGaps(queue: TopicQueue): string[] {
  const corpus = [
    ...getAllPosts().flatMap((p) => [
      p.frontmatter.title,
      ...p.frontmatter.tags,
    ]),
    ...queue.topics.flatMap((t) => [t.title, ...t.keywords, t.angle]),
  ]
    .join(" ")
    .toLowerCase();

  return STRATEGY_GAP_KEYWORDS.filter((kw) => !corpus.includes(kw.toLowerCase()));
}

export type IdeationResult = {
  queue: TopicQueue;
  queueJson: string;
  addedCount: number;
  queuedCount: number;
  skipped: boolean;
  reason?: string;
};

export async function runIdeation(options?: {
  force?: boolean;
  minQueued?: number;
  batchSize?: number;
}): Promise<IdeationResult> {
  const minQueued = options?.minQueued ?? MIN_QUEUED_TOPICS;
  const batchSize = options?.batchSize ?? IDEATE_BATCH_SIZE;
  const queue = loadTopicQueue();

  if (!options?.force && !needsIdeation(queue, minQueued)) {
    return {
      queue,
      queueJson: serializeTopicQueue(queue),
      addedCount: 0,
      queuedCount: countQueued(queue),
      skipped: true,
      reason: `Queue already has ${countQueued(queue)} queued topics (min ${minQueued}).`,
    };
  }

  if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
    throw new Error(
      "Missing AI credentials: set AI_GATEWAY_API_KEY (or rely on VERCEL_OIDC_TOKEN on Vercel)."
    );
  }

  const brief = loadBrandBrief();
  const recent = getAllPosts()
    .slice(0, 12)
    .map((p) => `- ${p.frontmatter.title} [${p.frontmatter.tags.join(", ")}]`);
  const queued = queue.topics
    .filter((t) => t.status === "queued")
    .map((t) => `- ${t.title}`);
  const gaps = coverageGaps(queue);
  const dedupSample = [...collectDedupKeys(queue)].slice(0, 40);

  const { object } = await generateObject({
    model: getIdeationModelId(),
    schema: ideationSchema,
    system: `You are the ideation engine for Digital CMO, an autonomous CMO-voice strategy blog for a global audience.

Propose distinct essay topics that fill coverage gaps. Strategy-forward only — no SaaS reviews, affiliate roundups, or tool listicles. Titles should sound like executive memos, not clickbait.`,
    prompt: [
      "## Brand brief",
      brief,
      "",
      "## Recently published",
      recent.length ? recent.join("\n") : "(none)",
      "",
      "## Already queued",
      queued.length ? queued.join("\n") : "(empty)",
      "",
      "## Likely coverage gaps",
      gaps.length ? gaps.map((g) => `- ${g}`).join("\n") : "- (broad strategy still welcome)",
      "",
      "## Do not duplicate these titles/slugs",
      dedupSample.map((k) => `- ${k}`).join("\n") || "(none)",
      "",
      `Propose ${Math.min(5, Math.max(3, batchSize))} high-value topics.`,
    ].join("\n"),
    temperature: 0.8,
  });

  const { queue: next, added } = enqueueTopics(
    queue,
    object.topics.map((t) => ({
      title: t.title,
      angle: t.angle,
      keywords: t.keywords,
      source: "ideation" as const,
    }))
  );

  return {
    queue: next,
    queueJson: serializeTopicQueue(next),
    addedCount: added.length,
    queuedCount: countQueued(next),
    skipped: false,
  };
}

export { TOPIC_QUEUE_PATH };
