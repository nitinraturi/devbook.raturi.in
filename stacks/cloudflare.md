---
title: Cloudflare
description: Cloudflare hosting notes - Workers static assets or Pages, security headers, redirects, previews, environments, secrets and domains. Check current docs.
lastVerified: 2026-11-02
---

Check current Cloudflare docs before configuring. Keep the hosting the project already uses unless asked to migrate.

- For new projects, Cloudflare recommends Workers with static assets (`assets.directory`, `not_found_handling: "404-page"` in `wrangler.jsonc`). Existing Pages projects can stay on Pages.
- Pull requests get preview URLs, which are `noindex` and send no analytics.
- With Workers Builds, non-production branches run `npx wrangler preview` by default, which needs a `previews` block in `wrangler.jsonc`, so add `"previews": {}` or branch builds and PR checks fail. Keep `assets` and compatibility settings at the top level, put preview-only variables in `previews.vars` because Previews don't inherit production settings, and never put production routes there.
- Preview URLs are public by default (restrict them with Cloudflare Access), so keep secrets and private data out of preview builds.
- Set the security headers and cache rules from the security and performance instructions in `public/_headers`. Allow third-party hosts only when they are used.
- Use `public/_redirects` for one canonical host, one trailing-slash style and 301s for moved URLs.
- Keep secrets in Cloudflare secrets, not `wrangler.jsonc`, because that file is committed. Set production-only variables only on production.
- For a zone already on Cloudflare, add the custom domain to the Worker or Pages project.
