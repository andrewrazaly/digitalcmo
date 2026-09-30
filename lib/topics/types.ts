export type TopicStatus = "queued" | "published" | "rejected";

export type TopicSource = "seed" | "ideation" | "manual";

export type Topic = {
  id: string;
  title: string;
  angle: string;
  keywords: string[];
  status: TopicStatus;
  source: TopicSource;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  publishedSlug?: string | null;
  rejectReason?: string | null;
};

export type TopicQueue = {
  version: 1;
  updatedAt: string;
  topics: Topic[];
};

export const TOPIC_QUEUE_PATH = "content/topics-queue.json";
export const MIN_QUEUED_TOPICS = 3;
export const IDEATE_BATCH_SIZE = 5;
