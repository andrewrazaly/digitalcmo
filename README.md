# Digital CMO

Auto-publishing **digital marketing** blog built to earn organic traffic and affiliate revenue. Next.js 16, TypeScript, Tailwind CSS, MDX.

## Product aim

- Publish SEO-led comparisons, reviews, roundups, and guides around digital marketing tools
- Compound search traffic through topical clusters (SEO, email, social, PPC, content, analytics)
- Monetise via affiliate links + email capture (newsletter)

## Quick Start

```bash
npm install
npm run dev
```

## Content engine

```bash
# Expand the generation queue with digital marketing ideas
npm run seed-queue

# Generate one article (requires ANTHROPIC_API_KEY)
npm run generate

# Generate N articles and push for Vercel deploy
npm run publish -- --count 3
```

GitHub Action: `.github/workflows/auto-publish.yml` runs daily when `ANTHROPIC_API_KEY` is set as a repo secret.

## Content types

| Path | Purpose |
| --- | --- |
| `/topics` | Digital marketing topic clusters |
| `/compare/[slug]` | Tool A vs Tool B |
| `/reviews/[slug]` | Individual tool reviews |
| `/best-tools/[category]` | Roundups |
| `/guides/[slug]` | How-to playbooks |

MDX lives in `content/{reviews\|compare\|best-tools\|guides}/`.

## Monetisation

- `data/affiliates.json` — affiliate URL map (replace placeholders with real partner links)
- `<AffiliateButton />` in MDX — sponsored outbound CTAs
- Newsletter CTA — wire to Kit / Brevo / ActiveCampaign when ready

## Data

- `data/tools.json` — marketing tool catalogue
- `data/topics.json` — topic cluster definitions
- `data/content-queue.json` — generation queue
- `data/affiliates.json` — monetisation links

## Deployment

Deploy on Vercel. Set:

- `ANTHROPIC_API_KEY` — article generation
- `CRON_SECRET` — optional protection for `/api/cron/status`
