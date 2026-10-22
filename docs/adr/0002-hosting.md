# ADR-0002: Hosting on Cloudflare Workers static assets

**Status:** accepted (supersedes the earlier Pages decision in this file, same day) · **Date:** 2026-10-22 · **Decider:** Nitin Raturi

## Context
`stacks/cloudflare.md` notes that Cloudflare and the Astro docs recommend Workers with static assets for new projects. Pages is fine for a pure static site. The devbook is purely static. raturi.in and webtools.raturi.in already deploy with `wrangler deploy` to static-assets Workers.

Running `wrangler deploy` with no config started wrangler's automatic Astro setup. It added the `@astrojs/cloudflare` server adapter and a Worker entrypoint, and gave the Worker a name with dots, which wrangler rejects. That setup was reverted: the site needs no server code.

## Options
1. **Workers static assets** with no Worker script: `wrangler.jsonc` with `assets.directory: "./dist"`, deployed with `wrangler deploy`.
2. **Cloudflare Pages** with git integration.

## Decision
Option 1, to match the owner's other sites and the stack profile's default. The Worker is `devbook-raturi-in`. Its `wrangler.jsonc` runs `npm run build:prod` as the custom build on every deploy, uses `html_handling: "auto-trailing-slash"` and `not_found_handling: "404-page"`, and has no `main` script, no adapter and no bindings.

## Consequences
- `public/_headers` (CSP, security headers, immutable caching for hashed files) applies to static-assets Workers, as verified on the first deploy.
- Analytics is enabled by `build:prod` (`DEVBOOK_ENV=production`) only. Workers Builds branch builds (`WORKERS_CI_BRANCH` other than `main`) are previews: `noindex`, no analytics.
- Trailing-slash redirects from `auto-trailing-slash` are 307, not 301. Canonical tags and the sitemap already use the slash form.
- Starlight's "Last updated" reads git history, so deploy from a full clone. Local deploys are; for Workers Builds, verify.
