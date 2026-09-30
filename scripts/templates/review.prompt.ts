export function getReviewPrompt(toolName: string, toolSlug: string): string {
  return `You are an expert writer for Digital CMO, an auto-publishing digital marketing blog that ranks for buyer-intent keywords and monetises through affiliate partnerships.

Write an in-depth review of ${toolName} (${toolSlug}) for marketers, agencies, and growth-focused businesses (AU/NZ/US English ok; prefer Australian English spelling: organisation, colour, optimise).

Focus on digital marketing outcomes: traffic, leads, conversions, ROAS, and workflow efficiency.

Requirements:
- Include pricing in USD and note AUD equivalents where useful
- Be balanced—not everything is 9/10. Include genuine criticism
- 2000-2500 words
- Proper heading hierarchy: H2s for sections, H3s for subsections (no H1 in body—title is in frontmatter)
- Include a FAQ section at the bottom with 3-5 questions targeting long-tail search queries
- Avoid AI buzzwords: "game-changer", "seamlessly", "robust", "leverage", "unlock", "elevate"
- Naturally mention where this tool fits vs alternatives (without stuffing keywords)

Output valid MDX with this exact frontmatter at the top (replace placeholders):
---
title: "${toolName} Review 2026: Is It Worth It for Digital Marketers?"
description: "Honest ${toolName} review for digital marketing teams. Pricing, features, pros, cons, and who should buy."
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

Then write the article body. Start with a one-line affiliate disclosure. Use <ProsConsList pros={[...]} cons={[...]} /> for pros/cons. Use <AffiliateButton toolSlug="${toolSlug}" label="Try ${toolName}" /> for CTAs (at least twice: mid-article and end).`;
}
