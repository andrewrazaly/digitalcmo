#!/usr/bin/env npx tsx
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const CONTENT_DIR = path.join(process.cwd(), "content");
const DATA_DIR = path.join(process.cwd(), "data");

interface QueueItem {
  type: "review" | "comparison" | "roundup" | "guide";
  slug?: string;
  toolSlug?: string;
  toolSlugs?: string[];
  toolA?: string;
  toolB?: string;
  slugA?: string;
  slugB?: string;
  topic?: string;
  category?: string;
}

async function generateWithClaude(prompt: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text in response");
  }
  return textBlock.text;
}

function loadQueue(): QueueItem[] {
  const filePath = path.join(DATA_DIR, "content-queue.json");
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function loadTools(): { slug: string; name: string; category: string }[] {
  const filePath = path.join(DATA_DIR, "tools.json");
  if (!fs.existsSync(filePath)) return [];
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return Array.isArray(data) ? data : [];
}

async function generateReview(item: QueueItem): Promise<string> {
  const { getReviewPrompt } = await import("./templates/review.prompt");
  const toolSlug = item.toolSlug || item.slug || "";
  const tools = loadTools();
  const tool = tools.find((t) => t.slug === toolSlug);
  const toolName = tool?.name || toolSlug;
  const prompt = getReviewPrompt(toolName, toolSlug);
  return generateWithClaude(prompt);
}

async function generateComparison(item: QueueItem): Promise<string> {
  const { getComparisonPrompt } = await import("./templates/comparison.prompt");
  const slugA = item.slugA || "";
  const slugB = item.slugB || "";
  const tools = loadTools();
  const toolA = tools.find((t) => t.slug === slugA)?.name || slugA;
  const toolB = tools.find((t) => t.slug === slugB)?.name || slugB;
  const prompt = getComparisonPrompt(toolA, toolB, slugA, slugB);
  return generateWithClaude(prompt);
}

async function generateRoundup(item: QueueItem): Promise<string> {
  const { getRoundupPrompt } = await import("./templates/roundup.prompt");
  const category = item.category || "tools";
  const toolSlugs = item.toolSlugs || [];
  const prompt = getRoundupPrompt(category, toolSlugs);
  return generateWithClaude(prompt);
}

async function generateGuide(item: QueueItem): Promise<string> {
  const { getGuidePrompt } = await import("./templates/guide.prompt");
  const topic = item.topic || "Choose the right tool";
  const slug = item.slug || topic.toLowerCase().replace(/\s+/g, "-");
  const prompt = getGuidePrompt(topic, slug);
  return generateWithClaude(prompt);
}

function getOutputPath(type: string, slug: string): string {
  const typeDir: Record<string, string> = {
    review: "reviews",
    comparison: "compare",
    roundup: "best-tools",
    guide: "guides",
  };
  const dir = path.join(CONTENT_DIR, typeDir[type] || "reviews");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${slug}.mdx`);
}

function extractSlugFromContent(content: string): string | null {
  const match = content.match(/slug:\s*["']([^"']+)["']/);
  return match ? match[1] : null;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Set ANTHROPIC_API_KEY environment variable");
    process.exit(1);
  }

  const queue = loadQueue();
  if (queue.length === 0) {
    console.log("No items in content-queue.json. Add items to generate articles.");
    process.exit(0);
  }

  const item = queue[0];
  console.log(`Generating ${item.type} article...`);

  let content: string;
  switch (item.type) {
    case "review":
      content = await generateReview(item);
      break;
    case "comparison":
      content = await generateComparison(item);
      break;
    case "roundup":
      content = await generateRoundup(item);
      break;
    case "guide":
      content = await generateGuide(item);
      break;
    default:
      console.error(`Unknown type: ${item.type}`);
      process.exit(1);
  }

  const slug = item.slug || extractSlugFromContent(content);
  if (!slug) {
    console.error("Could not determine slug");
    process.exit(1);
  }

  const outputPath = getOutputPath(item.type, slug);
  fs.writeFileSync(outputPath, content, "utf-8");
  console.log(`Wrote ${outputPath}`);

  // Remove from queue
  const newQueue = queue.slice(1);
  fs.writeFileSync(
    path.join(DATA_DIR, "content-queue.json"),
    JSON.stringify(newQueue, null, 2),
    "utf-8"
  );
  console.log(`Remaining in queue: ${newQueue.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
