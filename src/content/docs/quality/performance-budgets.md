---
title: Performance budgets
description: Default Core Web Vitals and Lighthouse targets, byte budgets for HTML, CSS, JS, fonts and images, loading techniques, and how to enforce budgets in CI.
lastVerified: 2026-10-22
sidebar:
  order: 2
---

Budgets are set before building and enforced by CI, so performance does not erode one commit at a time. Projects may tighten these; loosening needs an ADR.

## Field targets (real users, 75th percentile)

Google's published "good" thresholds for [Core Web Vitals](https://web.dev/articles/vitals): **LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1**. The devbook default aims tighter so field data has headroom.

## Default budgets

| Metric (mobile, throttled lab run) | Content site | Web app |
|---|---|---|
| LCP | ≤ 2.0 s | ≤ 2.5 s |
| CLS | ≤ 0.05 | ≤ 0.1 |
| Total blocking time | ≤ 150 ms | ≤ 200 ms |
| Lighthouse Performance | ≥ 90 | ≥ 85 |
| Lighthouse Accessibility | ≥ 95 (aim 100) | ≥ 95 |
| Lighthouse Best Practices | ≥ 95 | ≥ 95 |
| Lighthouse SEO (public pages) | 100 | n/a |
| HTML per page (gzip) | ≤ 60 KB | — |
| CSS per page (gzip) | ≤ 30 KB | ≤ 60 KB |
| JS before interaction (gzip) | ≤ 20 KB without interactive islands | ≤ 170 KB initial route |
| Web fonts | ≤ 3 files, ≤ 1 preloaded | same |
| Hero / LCP image | ≤ 120 KB, AVIF or WebP | same |

Lighthouse scores are a proxy. Field data from real users decides.

## Techniques

- Render HTML on the server or at build time; ship JavaScript only for interactive parts.
- Lazy-load heavy components when visible or on interaction.
- The LCP element is in the initial HTML, not injected by script; give LCP images `fetchpriority="high"` and never lazy-load them.
- Set `width` and `height` (or `aspect-ratio`) on all images, video and embeds to prevent layout shift.
- Responsive images (`srcset`, `sizes`) in modern formats.
- Self-host fonts, subset them, use `font-display: swap`, and adjust fallback metrics to limit shift.
- Avoid third-party scripts; each one needs a written reason. Load analytics after the main content.
- Content-hashed static assets with long immutable cache headers.
- Pause animation and rendering loops when off-screen or the tab is hidden; respect `prefers-reduced-motion`.

## Enforcement

- Lighthouse CI (or equivalent) runs on PRs for representative pages and fails on budget breaches.
- Bundle-size checks fail the build when JS or CSS budgets are exceeded.
- Field metrics are collected (see [observability](/engineering/observability/)) and reviewed monthly.

## Checklist
- [ ] Budgets recorded in the project (copied or tightened)
- [ ] LCP element server-rendered with dimensions
- [ ] No unapproved third-party scripts
- [ ] CI budget checks on
