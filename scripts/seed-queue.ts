#!/usr/bin/env npx tsx
/**
 * Seed or extend content-queue.json with digital marketing article ideas.
 * Usage:
 *   npm run seed-queue
 *   npm run seed-queue -- --reset
 */
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const QUEUE_PATH = path.join(DATA_DIR, "content-queue.json");
const TOOLS_PATH = path.join(DATA_DIR, "tools.json");

interface Tool {
  slug: string;
  name: string;
  category: string;
}

interface QueueItem {
  type: "review" | "comparison" | "roundup" | "guide";
  slug?: string;
  toolSlug?: string;
  toolSlugs?: string[];
  slugA?: string;
  slugB?: string;
  topic?: string;
  category?: string;
}

const GUIDE_TOPICS: { topic: string; slug: string }[] = [
  {
    topic: "How to Rank Affiliate Content Without Getting Penalised",
    slug: "rank-affiliate-content-safely",
  },
  {
    topic: "LinkedIn Organic Strategy for B2B Digital Agencies",
    slug: "linkedin-organic-strategy-agencies",
  },
  {
    topic: "How to Build a Topic Cluster That Owns a Marketing Niche",
    slug: "topic-cluster-marketing-niche",
  },
  {
    topic: "Retargeting Ads Playbook for Ecommerce Brands",
    slug: "retargeting-ads-ecommerce-playbook",
  },
  {
    topic: "How to Turn Blog Traffic into Email Subscribers",
    slug: "blog-traffic-to-email-subscribers",
  },
  {
    topic: "Programmatic SEO for SaaS Comparison Sites",
    slug: "programmatic-seo-saas-comparisons",
  },
  {
    topic: "WhatsApp and SMS Marketing Compliance for Australian Brands",
    slug: "whatsapp-sms-marketing-australia",
  },
  {
    topic: "How to Price Digital Marketing Retainers in 2026",
    slug: "price-digital-marketing-retainers-2026",
  },
];

function loadTools(): Tool[] {
  if (!fs.existsSync(TOOLS_PATH)) return [];
  return JSON.parse(fs.readFileSync(TOOLS_PATH, "utf-8"));
}

function loadQueue(): QueueItem[] {
  if (!fs.existsSync(QUEUE_PATH)) return [];
  return JSON.parse(fs.readFileSync(QUEUE_PATH, "utf-8"));
}

function existingKeys(queue: QueueItem[]): Set<string> {
  const keys = new Set<string>();
  for (const item of queue) {
    if (item.slug) keys.add(`${item.type}:${item.slug}`);
    else if (item.toolSlug) keys.add(`${item.type}:${item.toolSlug}`);
    else if (item.slugA && item.slugB)
      keys.add(`${item.type}:${item.slugA}-vs-${item.slugB}`);
    else if (item.topic) keys.add(`${item.type}:${item.topic}`);
  }
  return keys;
}

function buildIdeas(tools: Tool[]): QueueItem[] {
  const byCategory = new Map<string, Tool[]>();
  for (const tool of tools) {
    const list = byCategory.get(tool.category) || [];
    list.push(tool);
    byCategory.set(tool.category, list);
  }

  const ideas: QueueItem[] = [];

  for (const tool of tools) {
    ideas.push({
      type: "review",
      toolSlug: tool.slug,
      slug: tool.slug,
    });
  }

  for (const [, catTools] of byCategory) {
    for (let i = 0; i < catTools.length; i++) {
      for (let j = i + 1; j < catTools.length; j++) {
        const a = catTools[i];
        const b = catTools[j];
        ideas.push({
          type: "comparison",
          slugA: a.slug,
          slugB: b.slug,
          slug: `${a.slug}-vs-${b.slug}`,
        });
      }
    }

    if (catTools.length >= 3) {
      ideas.push({
        type: "roundup",
        category: catTools[0].category.replace(/-/g, " "),
        slug: `best-${catTools[0].category}-tools`,
        toolSlugs: catTools.slice(0, 5).map((t) => t.slug),
      });
    }
  }

  for (const g of GUIDE_TOPICS) {
    ideas.push({ type: "guide", topic: g.topic, slug: g.slug });
  }

  return ideas;
}

function main() {
  const reset = process.argv.includes("--reset");
  const tools = loadTools();
  const current = reset ? [] : loadQueue();
  const keys = existingKeys(current);
  const ideas = buildIdeas(tools);

  const additions: QueueItem[] = [];
  for (const idea of ideas) {
    const key = idea.slug
      ? `${idea.type}:${idea.slug}`
      : idea.topic
        ? `${idea.type}:${idea.topic}`
        : null;
    if (!key || keys.has(key)) continue;
    keys.add(key);
    additions.push(idea);
  }

  const next = [...current, ...additions];
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(next, null, 2), "utf-8");
  console.log(
    reset
      ? `Reset queue with ${next.length} digital marketing article ideas.`
      : `Added ${additions.length} ideas. Queue now has ${next.length} items.`
  );
}

main();
