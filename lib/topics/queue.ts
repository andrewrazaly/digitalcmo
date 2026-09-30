import fs from "fs";
import path from "path";
import { getAllPosts } from "@/lib/posts";
import {
  MIN_QUEUED_TOPICS,
  TOPIC_QUEUE_PATH,
  type Topic,
  type TopicQueue,
  type TopicSource,
} from "./types";

const ABS_QUEUE_PATH = path.join(process.cwd(), TOPIC_QUEUE_PATH);

export function normalizeTopicKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function emptyQueue(): TopicQueue {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    topics: [],
  };
}

export function loadTopicQueue(): TopicQueue {
  if (!fs.existsSync(ABS_QUEUE_PATH)) {
    return emptyQueue();
  }
  const raw = fs.readFileSync(ABS_QUEUE_PATH, "utf8");
  const parsed = JSON.parse(raw) as TopicQueue;
  if (!parsed || !Array.isArray(parsed.topics)) {
    throw new Error(`Invalid topic queue at ${TOPIC_QUEUE_PATH}`);
  }
  return {
    version: 1,
    updatedAt: parsed.updatedAt || new Date().toISOString(),
    topics: parsed.topics,
  };
}

export function serializeTopicQueue(queue: TopicQueue): string {
  const sorted = {
    version: 1 as const,
    updatedAt: queue.updatedAt,
    topics: queue.topics,
  };
  return JSON.stringify(sorted, null, 2) + "\n";
}

export function countQueued(queue: TopicQueue): number {
  return queue.topics.filter((t) => t.status === "queued").length;
}

export function listQueued(queue: TopicQueue): Topic[] {
  return queue.topics.filter((t) => t.status === "queued");
}

/** Keys we must not enqueue again (published posts + queue titles). */
export function collectDedupKeys(queue: TopicQueue): Set<string> {
  const keys = new Set<string>();
  for (const post of getAllPosts()) {
    keys.add(normalizeTopicKey(post.frontmatter.title));
    keys.add(normalizeTopicKey(post.frontmatter.slug.replace(/-/g, " ")));
  }
  for (const topic of queue.topics) {
    keys.add(normalizeTopicKey(topic.title));
    if (topic.publishedSlug) {
      keys.add(normalizeTopicKey(topic.publishedSlug.replace(/-/g, " ")));
    }
  }
  return keys;
}

export function isDuplicateTopic(
  title: string,
  dedupKeys: Set<string>
): boolean {
  return dedupKeys.has(normalizeTopicKey(title));
}

export function makeTopicId(title: string): string {
  const base = normalizeTopicKey(title)
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 48);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base || "topic"}-${suffix}`;
}

export function enqueueTopics(
  queue: TopicQueue,
  candidates: Array<{
    title: string;
    angle: string;
    keywords: string[];
    source: TopicSource;
  }>
): { queue: TopicQueue; added: Topic[] } {
  const dedup = collectDedupKeys(queue);
  const added: Topic[] = [];
  const now = new Date().toISOString();

  for (const candidate of candidates) {
    const title = candidate.title.trim();
    if (!title) continue;
    if (isDuplicateTopic(title, dedup)) continue;

    const topic: Topic = {
      id: makeTopicId(title),
      title,
      angle: candidate.angle.trim(),
      keywords: candidate.keywords.map((k) => k.trim().toLowerCase()).filter(Boolean),
      status: "queued",
      source: candidate.source,
      createdAt: now,
      updatedAt: now,
      publishedAt: null,
      publishedSlug: null,
    };
    queue.topics.push(topic);
    added.push(topic);
    dedup.add(normalizeTopicKey(title));
  }

  queue.updatedAt = now;
  return { queue, added };
}

/** Peek the next queued topic (FIFO by createdAt). */
export function peekNextTopic(queue: TopicQueue): Topic | undefined {
  return listQueued(queue).sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  )[0];
}

export function markTopicPublished(
  queue: TopicQueue,
  topicId: string,
  publishedSlug: string,
  publishedAt: string
): TopicQueue {
  const now = new Date().toISOString();
  queue.topics = queue.topics.map((t) =>
    t.id === topicId
      ? {
          ...t,
          status: "published" as const,
          publishedAt,
          publishedSlug,
          updatedAt: now,
        }
      : t
  );
  queue.updatedAt = now;
  return queue;
}

export function markTopicRejected(
  queue: TopicQueue,
  topicId: string,
  reason: string
): TopicQueue {
  const now = new Date().toISOString();
  queue.topics = queue.topics.map((t) =>
    t.id === topicId
      ? {
          ...t,
          status: "rejected" as const,
          rejectReason: reason,
          updatedAt: now,
        }
      : t
  );
  queue.updatedAt = now;
  return queue;
}

export function needsIdeation(
  queue: TopicQueue,
  minQueued = MIN_QUEUED_TOPICS
): boolean {
  return countQueued(queue) < minQueued;
}

export function formatTopicHint(topic: Topic): string {
  const keywords =
    topic.keywords.length > 0 ? `Keywords: ${topic.keywords.join(", ")}` : "";
  return [
    `Title direction: ${topic.title}`,
    topic.angle ? `Angle: ${topic.angle}` : "",
    keywords,
    "Write the essay on this topic; refine the title if needed but stay on-brief.",
  ]
    .filter(Boolean)
    .join("\n");
}
