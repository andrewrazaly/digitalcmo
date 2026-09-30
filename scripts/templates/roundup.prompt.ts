export function getRoundupPrompt(
  category: string,
  toolSlugs: string[]
): string {
  const toolsList = toolSlugs.join(", ");
  return `You are an expert writer for Digital CMO, an auto-publishing digital marketing blog that ranks for buyer-intent keywords and monetises through affiliate partnerships.

Write a "Best ${category} in 2026" roundup for digital marketers and agencies. Include these tools: ${toolsList}.

Requirements:
- Prefer Australian English spelling (organisation, colour, optimise)
- Include USD pricing and note AUD where useful
- Rank tools with honest pros and cons and a clear "best for" label each
- 2000-2500 words
- Proper heading hierarchy: H2s for each tool, H3s for subsections (no H1 in body)
- Include a FAQ section with 3-5 long-tail questions
- Avoid AI buzzwords: "game-changer", "seamlessly", "robust", "leverage", "unlock", "elevate"
- Optimise for search intent like "best ${category}" and "best ${category} for small business"

Output valid MDX with this exact frontmatter at the top (replace placeholders):
---
title: "Best ${category} for Digital Marketers in 2026"
description: "Curated list of the best ${category} for marketing teams. Pricing, features, and clear picks by use case."
slug: "REPLACE_WITH_SLUG"
type: "roundup"
category: "${category.toLowerCase().replace(/\s+/g, "-")}"
tags: ["REPLACE_WITH_TAGS"]
tools: ${JSON.stringify(toolSlugs)}
author: "Digital CMO Editorial"
publishedAt: "${new Date().toISOString().split("T")[0]}"
updatedAt: "${new Date().toISOString().split("T")[0]}"
featured: false
draft: false
---

Then write the article body. Start with a one-line affiliate disclosure. Use <AffiliateButton toolSlug="..." label="..." /> for CTAs under each tool.`;
}
