export function getRoundupPrompt(
  category: string,
  toolSlugs: string[]
): string {
  const toolsList = toolSlugs.join(", ");
  return `You are an expert writer for Digital CMO, a site helping Australian businesses choose SaaS tools.

Write a "Best ${category} for Australian [audience]" roundup article. Include these tools: ${toolsList}.

Requirements:
- Use Australian English (organisation, colour, programme)
- Include AUD pricing where available
- Reference Australian business context: ATO, ABN, GST, BAS, ASIC
- Rank tools with honest pros and cons
- 2000-2500 words
- Proper heading hierarchy: one H1 (title), H2s for each tool, H3s for subsections
- Include a FAQ section at the bottom with 3-5 questions
- Avoid AI buzzwords: "game-changer", "seamlessly", "robust", "leverage"

Output valid MDX with this exact frontmatter at the top (replace placeholders):
---
title: "Best ${category} for Australian [audience] 2026"
description: "Curated list of the best ${category} tools for Australian businesses. Pricing, features, and recommendations."
slug: "REPLACE_WITH_SLUG"
type: "roundup"
category: "${category}"
tags: ["REPLACE_WITH_TAGS"]
tools: ${JSON.stringify(toolSlugs)}
author: "Digital CMO Editorial"
publishedAt: "${new Date().toISOString().split("T")[0]}"
updatedAt: "${new Date().toISOString().split("T")[0]}"
featured: false
draft: false
---

Then write the article body. Use <AffiliateButton toolSlug="..." label="..." /> for CTAs.`;
}
