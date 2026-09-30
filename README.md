# Digital CMO

Autonomous digital marketing strategy blog — written in a Chief Marketing Officer voice. Greenfield Next.js App Router site with git-backed MDX and daily auto-publish.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` → `.env.local` and fill secrets before triggering publish.

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Brand hub |
| `/blog` | Post index |
| `/blog/[slug]` | Article |
| `/about` | Brand / POV |
| `/api/cron/publish` | Secured daily generate → QA → commit job |

## Content

- Posts: `content/posts/*.mdx`
- Brand brief (loaded by the publish job): `content/brand-brief.md`
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

## Auto-publish (Phase 1)

Daily cron (14:00 UTC) hits `GET/POST /api/cron/publish` with `Authorization: Bearer $CRON_SECRET`.

Pipeline:

1. Load `content/brand-brief.md` + recent post titles  
2. Generate one CMO essay via Vercel AI SDK → AI Gateway  
3. Run hard QA gates (frontmatter, slug uniqueness, word count, H2s, takeaways/checklist, banlist, off-brand heuristics)  
4. On QA fail: regenerate once with the failure list; if still failing → skip publish and write a failure log  
5. On pass: commit MDX (+ run log) to `GITHUB_CONTENT_BRANCH` (default `main`) via GitHub Git Data API → Vercel deploys  

Idempotency: skips if a post already exists for today’s UTC date (override with `?force=1`).

### Required secrets / env

| Variable | Required | Purpose |
| --- | --- | --- |
| `CRON_SECRET` | Yes | Authorizes cron + manual triggers |
| `AI_GATEWAY_API_KEY` | Yes locally; optional on Vercel if OIDC works | AI Gateway auth |
| `GITHUB_TOKEN` | Yes (for live publish) | Repo contents / git write |
| `GITHUB_REPO` | Recommended | `owner/repo` (falls back to Vercel git env) |
| `GITHUB_CONTENT_BRANCH` | No (default `main`) | Branch to commit published MDX |
| `AI_MODEL` | No | Gateway model id (default `anthropic/claude-sonnet-4.5`) |
| `PUBLISH_DRY_RUN` | No | `1` writes files locally instead of GitHub |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical origin |

On Vercel: set the same vars in Project → Settings → Environment Variables. Enable Cron for the deployment. Hobby plans support one cron; schedule is in `vercel.json`.

### Trigger locally

```bash
# terminal 1
CRON_SECRET=devsecret AI_GATEWAY_API_KEY=... GITHUB_TOKEN=... PUBLISH_DRY_RUN=1 npm run dev

# terminal 2
CRON_SECRET=devsecret npm run publish:trigger
# or force a second run the same day:
CRON_SECRET=devsecret npm run publish:trigger -- --force --topic "measurement scorecards"
```

### Trigger on Vercel

- Wait for the daily cron, or  
- `curl -X POST -H "Authorization: Bearer $CRON_SECRET" "https://<deployment>/api/cron/publish"`

### QA fixtures

```bash
npm run test:qa
```

## Scripts

- `npm run dev` — development server  
- `npm run build` — production build  
- `npm run start` — serve production build  
- `npm run lint` — ESLint  
- `npm run test:qa` — deterministic quality-gate fixtures  
- `npm run publish:trigger` — call the local/remote cron route  

## Deploy

Always deploy to the existing Vercel project: [andrewrazalys-projects/digitalcmo](https://vercel.com/andrewrazalys-projects/digitalcmo) (Git integration / this repo). Do not create a parallel Vercel project.

Domain can remain the Vercel URL until a custom domain is attached. Cadence: daily. Audience: global.
