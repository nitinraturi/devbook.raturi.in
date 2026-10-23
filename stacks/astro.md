---
title: Astro
description: Astro stack notes for content sites - static output, minimal islands, typed content collections, image handling and checks. Verify against current Astro docs.
lastVerified: 2026-10-22
---

Check the current Astro docs and upgrade guide for exact APIs before using them.

- Default to `output: 'static'`. Add on-demand rendering only for routes that need request-time data, through the host adapter.
- Set `site` to the production URL and pick one `trailingSlash` style.
- Ship zero JS by default. Hydrate only interactive islands, using the laziest directive that works (`client:visible`, `client:idle`, then `client:load`). Text is rendered by `.astro` components, never by islands.
- Put structured content in content collections with Zod schemas. Use `reference()` for relationships and enums for categories. Route only published entries in production.
- Derive related lists, tags and hubs in one module (for example `src/lib/taxonomy.ts`).
- Images go through `astro:assets` with explicit dimensions. Self-host fonts.
- With view transitions, run scripts and analytics page views on `astro:page-load`.
- Use Astro's CSP support where available so inline scripts get hashes.
- Run `astro check` in CI. Generate the sitemap with `@astrojs/sitemap`, excluding noindex pages.
