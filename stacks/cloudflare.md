---
title: Cloudflare
description: Cloudflare hosting notes - Workers static assets or Pages, security headers, redirects, environments, secrets and domains. Verify against current Cloudflare docs.
lastVerified: 2026-10-22
---

Check current Cloudflare docs before configuring. Keep the hosting the project already uses unless asked to migrate.

- For new projects, Cloudflare recommends Workers with static assets (`assets.directory`, `not_found_handling: "404-page"` in `wrangler.jsonc`). Existing Pages projects can stay on Pages.
- Deploy from CI on `main`. Pull requests get preview URLs, which are `noindex` and send no analytics.
- Set security headers in `public/_headers`: CSP with script hashes, HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy` and `frame-ancestors`. Allow third-party hosts only when they are used.
- Cache content-hashed assets with `max-age=31536000, immutable`. HTML stays revalidated.
- Use `public/_redirects` for one canonical host, one trailing-slash style and 301s for moved URLs.
- Keep secrets in Cloudflare secrets, never in `wrangler.jsonc` or the repo. Set production-only variables only on production.
- For a zone already on Cloudflare, add the custom domain to the Worker or Pages project.
