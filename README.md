# Digital CMO

SaaS tool comparisons and reviews for Australian businesses. Built with Next.js 15, TypeScript, Tailwind CSS, and MDX.

## Quick Start

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run generate` - Generate one article from content-queue.json (requires ANTHROPIC_API_KEY)
- `npm run publish` - Generate articles and push to git (e.g. `npm run publish -- --count 3`)

## Content

- **Compare** - `/compare/[slug]` - Tool A vs Tool B
- **Reviews** - `/reviews/[slug]` - Individual tool reviews
- **Best Tools** - `/best-tools/[category]` - Roundups by category
- **Guides** - `/guides/[slug]` - How-to guides

Content lives in `content/{reviews|compare|best-tools|guides}/*.mdx`.

## Deployment

Deploy to Vercel. Set `ANTHROPIC_API_KEY` for content generation.

## Data

- `data/tools.json` - Tool metadata
- `data/affiliates.json` - Affiliate URL mapping
- `data/content-queue.json` - Article generation queue
