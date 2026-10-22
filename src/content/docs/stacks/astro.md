---
title: Astro
description: Astro stack profile - static output, islands, content collections with schemas, images, view transitions, folder layout and settings for content-driven sites.
lastVerified: 2026-10-22
sidebar:
  order: 1
---

For content-driven sites (marketing, docs, blogs, libraries). At the verification date the latest release on npm was Astro 7.4.1; check the [Astro docs](https://docs.astro.build/) and upgrade guide before starting.

## Rules

### Rendering
- Default to `output: 'static'`; pre-render every page that can be pre-rendered.
- Add on-demand rendering only for routes that need request-time data, through the host's adapter, and record it in an ADR.
- Set `site` to the production URL and choose `trailingSlash` (`'always'` recommended) so canonicals and sitemaps are correct.

### Islands
- Ship zero JavaScript by default. Hydrate only interactive components, with the laziest directive that works: `client:visible` for below-the-fold widgets, `client:idle` for non-urgent ones, `client:load` only when needed immediately.
- Prefer vanilla TS or a small framework (Preact, Svelte, Solid) for islands; avoid a heavy framework for one widget.
- Text content is rendered by `.astro` components, never injected by an island.

### Content
- All structured content in **content collections** with Zod schemas in `src/content.config.ts` (verify the current file name and loader API for your Astro version).
- Use `reference()` for relationships so the build fails on unknown slugs.
- Use controlled enums for categories and statuses.
- Only `published` entries are routed in production builds; drafts are visible locally.
- Derive related lists, tag pages and hubs in one `lib/taxonomy.ts`, not in each page.

### Assets
- Images through `astro:assets` (`<Image>`, `<Picture>`) with explicit dimensions and modern formats.
- Self-host fonts; use Astro's font tooling if available in your version, otherwise `@font-face` with `woff2` and `font-display: swap`.

### Navigation
- View transitions (`<ClientRouter />`) are optional. If used: analytics page views fire on `astro:page-load`, and scripts are written to run on each navigation.

### Security
- Use Astro's built-in CSP support where available (verify for your version) so inline scripts get hashes instead of `'unsafe-inline'`.

### Quality
- `astro check` in CI.
- Sitemap via `@astrojs/sitemap` (Starlight includes it). Exclude noindex pages.

## Typical layout

```
src/
  content.config.ts
  content/<collection>/…
  components/<feature>/…  components/ui/…
  layouts/
  lib/        (seo.ts, schema.ts, taxonomy.ts)
  pages/
  styles/     (tokens.css, base.css)
public/       (_headers, _redirects, robots.txt, favicons)
scripts/      (check-content.ts, check-links.ts)
tests/        (unit/, e2e/)
```

## Checklist
- [ ] `site`, `trailingSlash`, static output set
- [ ] Islands only where interactive, lazily hydrated
- [ ] Collections with schemas and references
- [ ] Images via astro:assets with dimensions
- [ ] `astro check` in CI
