/**
 * Deterministic topic-queue helpers (no AI).
 * Usage: npx tsx scripts/test-topics.ts
 */
import {
  collectDedupKeys,
  countQueued,
  enqueueTopics,
  isDuplicateTopic,
  loadTopicQueue,
  markTopicPublished,
  needsIdeation,
  normalizeTopicKey,
  peekNextTopic,
} from "../lib/topics/queue";
import { MIN_QUEUED_TOPICS } from "../lib/topics/types";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const queue = loadTopicQueue();
assert(queue.topics.length >= 3, "Seed queue should have starter topics");
assert(countQueued(queue) >= MIN_QUEUED_TOPICS, "Seed should satisfy min queued");
assert(!needsIdeation(queue), "Seeded queue should not need ideation");

const next = peekNextTopic(queue);
assert(Boolean(next), "Should peek a queued topic");
assert(
  next!.title.length > 10,
  "Peeked topic should have a real title"
);

const dedup = collectDedupKeys(queue);
assert(
  isDuplicateTopic(next!.title, dedup),
  "Existing queue title should be treated as duplicate"
);
assert(
  isDuplicateTopic("Stop Buying Channels. Start Funding Bets.", dedup) ||
    isDuplicateTopic("stop buying channels start funding bets", dedup),
  "Published sample post title should be in dedup keys"
);

const { added, queue: after } = enqueueTopics(queue, [
  {
    title: next!.title,
    angle: "dup",
    keywords: ["x", "y"],
    source: "ideation",
  },
  {
    title: "A Completely Fresh Channel Portfolio Thesis",
    angle: "New angle on portfolio bets for global CMOs.",
    keywords: ["channel portfolio", "strategy"],
    source: "ideation",
  },
]);

assert(added.length === 1, `Expected 1 new topic, got ${added.length}`);
assert(
  after.topics.some((t) => t.title.includes("Fresh Channel Portfolio")),
  "New topic should be enqueued"
);

const published = markTopicPublished(
  structuredClone(after),
  added[0].id,
  "a-completely-fresh-channel-portfolio-thesis",
  "2026-10-02"
);
assert(
  published.topics.find((t) => t.id === added[0].id)?.status === "published",
  "Topic should mark published"
);

assert(
  normalizeTopicKey("Hello, World!") === "hello world",
  "normalizeTopicKey should strip punctuation"
);

console.log(
  JSON.stringify(
    {
      ok: true,
      seededQueued: countQueued(queue),
      nextTitle: next!.title,
      addedAfterDedup: added.map((t) => t.title),
    },
    null,
    2
  )
);
