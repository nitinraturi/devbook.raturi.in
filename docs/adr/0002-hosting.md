# ADR-0002: Hosting on Cloudflare Pages

**Status:** accepted · **Date:** 2026-10-22 · **Decider:** Nitin Raturi

## Context
`stacks/cloudflare.md` notes that Cloudflare and the Astro docs recommend Workers with static assets for new projects, and that Pages is fine for a pure static site with dashboard git integration. The devbook is purely static, and has no planned server routes.

## Options
1. **Cloudflare Pages** with git integration: build `npm run build`, output `dist`. Preview URL per branch, no deploy config in the repo.
2. **Workers static assets:** `wrangler.jsonc` (`assets.directory: "./dist"`, `not_found_handling: "404-page"`), deploy with `npm run build && npx wrangler deploy` from CI. This is the recommended default for new projects and the choice for raturi.in and webtools.raturi.in.

## Decision
Option 1, Cloudflare Pages: the owner's choice for this site. Both products read the same `public/_headers` file, so moving to Workers later needs only a `wrangler.jsonc` and a deploy step (see `DEPLOY.md`).

## Consequences
- `public/_headers` carries the CSP and security headers. The CSP is completed at build time (ADR-0005).
- Preview builds (any branch other than `main`, detected through the Pages `CF_PAGES_BRANCH` build variable) emit `<meta name="robots" content="noindex, nofollow">` and never load analytics.
- `PUBLIC_GA_ID` is set only on the Production environment in the Pages project.
- Starlight's "Last updated" date reads git history. If the Pages build clone turns out to be shallow, all pages show the latest commit date. Verify after the first deploy (`docs/TODO.md`).
