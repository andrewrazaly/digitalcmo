# Digital CMO

Autonomous digital marketing strategy blog — written in a Chief Marketing Officer voice. Greenfield Next.js App Router site with git-backed MDX, topic queue ideation, and daily auto-publish.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` → `.env.local` and fill secrets before triggering publish/ideation.

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Brand hub |
| `/blog` | Post index |
| `/blog/[slug]` | Article |
| `/about` | Brand / POV |
| `/api/cron/publish` | Daily: ensure queue → generate → QA → commit |
| `/api/cron/ideate` | Weekly (Mon 13:00 UTC): refill topic queue |

## Content

- Posts: `content/posts/*.mdx`
- Brand brief: `content/brand-brief.md`
- Topic queue: `content/topics-queue.json`
- Run logs: `content/logs/`
- QA fixtures: `content/fixtures/`

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

## Topic queue (Phase 2)

Git-backed JSON at `content/topics-queue.json` (fits MDX + GitHub commit publish; no KV required).

Each topic: `id`, `title`, `angle`, `keywords`, `status` (`queued` | `published` | `rejected`), `source` (`seed` | `ideation` | `manual`).

**How it stays full**

1. Seed topics ship in-repo so day-one publish is never empty.  
2. Daily `/api/cron/publish` calls ideation when queued count &lt; 3, then claims the next FIFO topic as the article brief.  
3. Weekly `/api/cron/ideate` (Monday 13:00 UTC) refills proactively.  
4. Dedup against published titles/slugs and existing queue titles.  
5. Successful publish marks the topic `published` in the same git commit as the MDX. Hard QA failure after retry marks it `rejected` so the next run picks another.

## Auto-publish loop

Daily cron (14:00 UTC) hits `GET/POST /api/cron/publish` with `Authorization: Bearer $CRON_SECRET`.

1. Skip if already published for today’s UTC date (still may refill queue)  
2. Ensure ≥3 queued topics (ideate via AI Gateway if needed)  
3. Claim next topic → generate CMO essay  
4. Hard QA; on fail regenerate once; then reject topic + log  
5. Commit MDX + updated queue + run log to `GITHUB_CONTENT_BRANCH` (default `main`) → Vercel project deploys  

### Required secrets / env

| Variable | Required | Purpose |
| --- | --- | --- |
| `CRON_SECRET` | Yes | Authorizes cron + manual triggers |
| `AI_GATEWAY_API_KEY` | Yes locally; optional on Vercel if OIDC works | AI Gateway auth |
| `GITHUB_TOKEN` | Yes (for live publish) | Repo contents / git write |
| `GITHUB_REPO` | Recommended | `andrewrazaly/digitalcmo` |
| `GITHUB_CONTENT_BRANCH` | No (default `main`) | Branch for published MDX + queue |
| `AI_MODEL` | No | Long-form model (default `anthropic/claude-sonnet-4.5`) |
| `AI_MODEL_IDEATION` | No | Ideation model (falls back to `AI_MODEL`) |
| `PUBLISH_DRY_RUN` | No | `1` writes files locally instead of GitHub |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical origin |

Set these on [andrewrazalys-projects/digitalcmo](https://vercel.com/andrewrazalys-projects/digitalcmo). Do not create a parallel Vercel project.

If the Vercel plan only allows one cron, keep `/api/cron/publish` (it self-refills the queue); `/api/cron/ideate` remains manually triggerable.

### Trigger locally

```bash
# terminal 1
CRON_SECRET=devsecret AI_GATEWAY_API_KEY=... GITHUB_TOKEN=... PUBLISH_DRY_RUN=1 npm run dev

# terminal 2 — ideation only
CRON_SECRET=devsecret npm run ideate:trigger

# terminal 2 — full publish (uses queue)
CRON_SECRET=devsecret npm run publish:trigger
```

### Trigger on Vercel

```bash
curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
  "https://<deployment>/api/cron/ideate"

curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
  "https://<deployment>/api/cron/publish"
```

### Tests

```bash
npm run test:qa
npm run test:topics
```

## Scripts

- `npm run dev` / `build` / `start` / `lint`
- `npm run test:qa` — quality-gate fixtures  
- `npm run test:topics` — topic queue helpers  
- `npm run publish:trigger` — hit publish cron  
- `npm run ideate:trigger` — hit ideation cron  

## Deploy

Always deploy to [andrewrazalys-projects/digitalcmo](https://vercel.com/andrewrazalys-projects/digitalcmo). Custom domain optional later. Cadence: daily publish. Audience: global.
