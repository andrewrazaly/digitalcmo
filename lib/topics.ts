import fs from "fs";
import path from "path";

export interface Topic {
  slug: string;
  name: string;
  description: string;
  keywords: string[];
}

let topicsCache: Topic[] | null = null;

export function getTopics(): Topic[] {
  if (topicsCache) return topicsCache;
  const filePath = path.join(process.cwd(), "data", "topics.json");
  if (!fs.existsSync(filePath)) {
    topicsCache = [];
    return topicsCache;
  }
  topicsCache = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Topic[];
  return topicsCache;
}

export function getTopicBySlug(slug: string): Topic | null {
  return getTopics().find((t) => t.slug === slug) || null;
}

/** Map article category / tags loosely onto a topic slug. */
export function matchTopicSlug(category?: string, tags: string[] = []): string | null {
  const topics = getTopics();
  const haystack = [category || "", ...tags].join(" ").toLowerCase();

  for (const topic of topics) {
    if (haystack.includes(topic.slug.replace(/-/g, " ")) || haystack.includes(topic.slug)) {
      return topic.slug;
    }
    for (const kw of topic.keywords) {
      if (haystack.includes(kw.toLowerCase())) return topic.slug;
    }
  }

  const aliases: Record<string, string> = {
    seo: "seo",
    "email-marketing": "email-marketing",
    "social-media": "social-media",
    ppc: "ppc",
    analytics: "analytics",
    "marketing-automation": "marketing-automation",
    crm: "marketing-automation",
    design: "design",
    "content-ai": "content-marketing",
    "content-ops": "content-marketing",
    cms: "content-marketing",
  };

  if (category && aliases[category]) return aliases[category];
  return null;
}
