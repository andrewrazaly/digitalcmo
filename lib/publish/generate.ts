import { generateObject } from "ai";
import { z } from "zod";
import { getAllPosts } from "@/lib/posts";
import { loadBrandBrief } from "./brief";
import type { GeneratedArticle } from "./types";

const articleSchema = z.object({
  title: z
    .string()
    .describe("Punchy executive title; no clickbait; under 100 characters."),
  description: z
    .string()
    .describe("1–2 sentence summary for SEO and listings (40–220 chars)."),
  slug: z
    .string()
    .describe("Lowercase kebab-case slug derived from the title; unique."),
  tags: z
    .array(z.string())
    .min(2)
    .max(6)
    .describe("Lowercase topic tags, e.g. strategy, channels, measurement."),
  body: z
    .string()
    .describe(
      "Full Markdown article body ONLY (no YAML frontmatter). Use ## H2 sections. Include a final ## Decision checklist or ## Key takeaways. Aim 900–1600 words."
    ),
});

export function getPublishModelId(): string {
  return process.env.AI_MODEL?.trim() || "anthropic/claude-sonnet-4.5";
}

function recentTitles(limit = 8): string[] {
  return getAllPosts()
    .slice(0, limit)
    .map((p) => `- ${p.frontmatter.title} (${p.frontmatter.slug})`);
}

export async function generateArticle(options?: {
  topicHint?: string;
  attempt?: number;
  priorIssues?: string[];
}): Promise<GeneratedArticle> {
  const brief = loadBrandBrief();
  const recent = recentTitles();
  const attempt = options?.attempt ?? 1;

  const system = `You are Digital CMO — an autonomous Chief Marketing Officer writing daily strategy essays for a global audience.

Follow the brand brief strictly. Write strategy-forward, actionable, opinionated prose. No SaaS reviews, affiliate roundups, or tool listicles. No hype fluff ("game-changer", "unlock the power", "delve into").

Output must match the schema. Body is Markdown only (no frontmatter). Author will be set to "Digital CMO" by the pipeline.`;

  const user = [
    "## Brand brief",
    brief,
    "",
    "## Recently published (do not repeat topics or slugs)",
    recent.length ? recent.join("\n") : "(none yet)",
    "",
    options?.topicHint
      ? `## Topic hint\n${options.topicHint}`
      : "## Topic selection\nChoose one fresh, high-value Digital CMO topic that fills a gap vs recent posts.",
    "",
    attempt > 1 && options?.priorIssues?.length
      ? `## QA failures from previous attempt — fix all of these\n${options.priorIssues.map((i) => `- ${i}`).join("\n")}`
      : "",
    "",
    "Write one complete essay now.",
  ]
    .filter(Boolean)
    .join("\n");

  const { object } = await generateObject({
    model: getPublishModelId(),
    schema: articleSchema,
    system,
    prompt: user,
    temperature: attempt > 1 ? 0.4 : 0.7,
  });

  return {
    title: object.title,
    description: object.description,
    slug: object.slug.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, ""),
    tags: object.tags.map((t) => t.toLowerCase().trim()),
    body: object.body,
  };
}
