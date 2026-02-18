export function getGuidePrompt(topic: string, slug: string): string {
  return `You are an expert writer for Digital CMO, a site helping Australian businesses choose SaaS tools.

Write a how-to guide: "${topic}" for Australian businesses.

Requirements:
- Use Australian English (organisation, colour, programme)
- Include AUD pricing where relevant
- Reference Australian business context: ATO, ABN, GST, BAS, ASIC
- Be practical and actionable
- 2000-2500 words
- Proper heading hierarchy: one H1 (title), H2s for sections, H3s for subsections
- Include a FAQ section at the bottom with 3-5 questions
- Avoid AI buzzwords: "game-changer", "seamlessly", "robust", "leverage"

Output valid MDX with this exact frontmatter at the top (replace placeholders):
---
title: "${topic}"
description: "How to ${topic.toLowerCase()} for Australian businesses. Step-by-step guide."
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

Then write the article body.`;
}
