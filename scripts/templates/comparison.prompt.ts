export function getComparisonPrompt(
  toolA: string,
  toolB: string,
  slugA: string,
  slugB: string
): string {
  return `You are an expert writer for Digital CMO, an auto-publishing digital marketing blog that ranks for buyer-intent keywords and monetises through affiliate partnerships.

Write a detailed comparison of ${toolA} vs ${toolB} for digital marketers and agencies.

Focus on: SEO/content/ads/email/social outcomes, pricing value, learning curve, and which buyer persona should pick which tool.

Requirements:
- Prefer Australian English spelling (organisation, colour, optimise)
- Include USD pricing and note AUD where useful
- Be balanced—highlight strengths and weaknesses of both
- 2000-2500 words
- Proper heading hierarchy: H2s for sections, H3s for subsections (no H1 in body)
- Include a FAQ section targeting "X vs Y" long-tail queries
- Avoid AI buzzwords: "game-changer", "seamlessly", "robust", "leverage", "unlock", "elevate"
- Include a comparison table using:
  <ComparisonTable tools={[{slug:"${slugA}",name:"${toolA}",website:"...",category:"..."},{slug:"${slugB}",name:"${toolB}",website:"...",category:"..."}]} features={[{name:"Feature",values:{"${slugA}":true,"${slugB}":false}}]} ratings={{"${slugA}":8,"${slugB}":7}} />

Output valid MDX with this exact frontmatter at the top (replace placeholders):
---
title: "${toolA} vs ${toolB}: Which Digital Marketing Tool Wins in 2026?"
description: "Side-by-side ${toolA} vs ${toolB} comparison for marketers. Pricing, features, and a clear recommendation."
slug: "${slugA}-vs-${slugB}"
type: "comparison"
category: "REPLACE_WITH_CATEGORY"
tags: ["REPLACE_WITH_TAGS"]
tools: ["${slugA}", "${slugB}"]
author: "Digital CMO Editorial"
publishedAt: "${new Date().toISOString().split("T")[0]}"
updatedAt: "${new Date().toISOString().split("T")[0]}"
featured: false
draft: false
---

Then write the article body. Start with a one-line affiliate disclosure. Use <AffiliateButton toolSlug="..." label="..." /> for CTAs.`;
}
