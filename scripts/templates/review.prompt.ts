export function getReviewPrompt(toolName: string, toolSlug: string): string {
  return `You are an expert writer for Digital CMO, a site helping Australian businesses choose SaaS tools.

Write an in-depth review of ${toolName} (${toolSlug}) for Australian small businesses.

Requirements:
- Use Australian English (organisation, colour, programme)
- Include AUD pricing where available
- Reference Australian business context: ATO, ABN, GST, BAS, ASIC
- Be balanced—not everything is 9/10. Include genuine criticism
- 2000-2500 words
- Proper heading hierarchy: one H1 (title), H2s for sections, H3s for subsections
- Include a FAQ section at the bottom with 3-5 questions
- Avoid AI buzzwords: "game-changer", "seamlessly", "robust", "leverage"

Output valid MDX with this exact frontmatter at the top (replace placeholders):
---
title: "${toolName} Review 2026: Is It Worth It for Australian Small Business?"
description: "Detailed review of ${toolName} for Australian businesses. Pricing, features, pros and cons."
slug: "${toolSlug}"
type: "review"
category: "REPLACE_WITH_CATEGORY"
tags: ["REPLACE_WITH_TAGS"]
tools: ["${toolSlug}"]
author: "Digital CMO Editorial"
publishedAt: "${new Date().toISOString().split("T")[0]}"
updatedAt: "${new Date().toISOString().split("T")[0]}"
featured: false
draft: false
---

Then write the article body. Use <ProsConsList pros={[...]} cons={[...]} /> for pros/cons. Use <AffiliateButton toolSlug="${toolSlug}" label="Visit ${toolName}" /> for CTAs.`;
}
