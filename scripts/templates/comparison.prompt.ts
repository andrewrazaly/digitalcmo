export function getComparisonPrompt(
  toolA: string,
  toolB: string,
  slugA: string,
  slugB: string
): string {
  return `You are an expert writer for Digital CMO, a site helping Australian businesses choose SaaS tools.

Write a detailed comparison of ${toolA} vs ${toolB} for Australian businesses.

Requirements:
- Use Australian English (organisation, colour, programme)
- Include AUD pricing where available
- Reference Australian business context: ATO, ABN, GST, BAS, ASIC
- Be balanced—highlight strengths and weaknesses of both
- 2000-2500 words
- Proper heading hierarchy: one H1 (title), H2s for sections, H3s for subsections
- Include a FAQ section at the bottom with 3-5 questions
- Avoid AI buzzwords: "game-changer", "seamlessly", "robust", "leverage"
- Include a comparison table using:
  <ComparisonTable tools={[{slug:"${slugA}",name:"${toolA}",website:"...",category:"..."},{slug:"${slugB}",name:"${toolB}",website:"...",category:"..."}]} features={[{name:"Feature",values:{"${slugA}":true,"${slugB}":false}}]} ratings={{"${slugA}":8,"${slugB}":7}} />

Output valid MDX with this exact frontmatter at the top (replace placeholders):
---
title: "${toolA} vs ${toolB}: Which Is Better for Australian Businesses in 2026?"
description: "Detailed comparison of ${toolA} and ${toolB} for Australian small businesses. Pricing, features, and more."
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

Then write the article body. Use <AffiliateButton toolSlug="..." label="..." /> for CTAs.`;
}
