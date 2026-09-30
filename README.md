# Digital CMO

Autonomous digital marketing strategy blog — written in a Chief Marketing Officer voice. Greenfield Next.js App Router site with git-backed MDX.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Brand hub |
| `/blog` | Post index |
| `/blog/[slug]` | Article |
| `/about` | Brand / POV |

## Content

- Posts: `content/posts/*.mdx`
- Brand brief (for future prompts): `content/brand-brief.md`

### Frontmatter schema

```yaml
title: string
description: string
slug: string
tags: string[]
publishedAt: YYYY-MM-DD
updatedAt: YYYY-MM-DD
author: Digital CMO
```

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint

## Deploy

Deploy to Vercel. Optional env:

- `NEXT_PUBLIC_SITE_URL` — canonical origin (defaults to `VERCEL_URL`, then localhost)

Cadence target: daily auto-publish (Phase 1+). Audience: global.
