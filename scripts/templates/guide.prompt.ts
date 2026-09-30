export function getGuidePrompt(topic: string, slug: string): string {
  return `You are an expert writer for Digital CMO, an auto-publishing digital marketing blog that ranks for buyer-intent keywords and monetises through affiliate partnerships.

Write a practical how-to guide: "${topic}".

Audience: digital marketers, agency operators, and founders who want traffic and monetisation—not theory.

Requirements:
- Prefer Australian English spelling (organisation, colour, optimise)
- Be practical and actionable with numbered steps where useful
- Mention relevant tools naturally (and use AffiliateButton where a tool CTA fits)
- 2000-2500 words
- Proper heading hierarchy: H2s for sections, H3s for subsections (no H1 in body)
- Include a FAQ section with 3-5 long-tail search questions
- Avoid AI buzzwords: "game-changer", "seamlessly", "robust", "leverage", "unlock", "elevate"
- Tie advice back to measurable outcomes: traffic, leads, conversions, revenue

Output valid MDX with this exact frontmatter at the top (replace placeholders):
---
title: "${topic}"
description: "Practical guide: ${topic}. Steps, tools, and metrics that matter for digital marketers."
slug: "${slug}"
type: "guide"
category: "REPLACE_WITH_CATEGORY"
tags: ["REPLACE_WITH_TAGS"]
author: "Digital CMO Editorial"
publishedAt: "${new Date().toISOString().split("T")[0]}"
updatedAt: "${new Date().toISOString().split("T")[0]}"
featured: false
draft: false
---

Then write the article body. Start with a one-line affiliate disclosure if tools are recommended.`;
}
