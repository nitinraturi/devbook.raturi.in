---
title: Performance and reliability
description: Budgets, Core Web Vitals, front-end loading, back-end efficiency, caching, timeouts, retries, monitoring and deploys for any app, site or service.
sidebar:
  order: 4
---

## Budgets
- Measure before optimising. Set budgets early (page weight, JavaScript size, response time, query count) and enforce them in CI.
- Core Web Vitals at the 75th percentile: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. Aim for LCP ≤ 2.0 s on content sites.
- Lighthouse mobile lab scores: performance 90+ for content sites (85+ for apps), accessibility 95+, and SEO 100 for public sites.
- Set p95 latency targets for API endpoints and track them.

## Front end
- Ship JavaScript only for interactive parts; content reads without it. Split code by route and lazy-load what is not needed for first render.
- The LCP element is in the initial HTML with `fetchpriority="high"` and is never lazy-loaded.
- Images use AVIF or WebP, `srcset` and `sizes`, and explicit `width` and `height` (or `aspect-ratio`). Lazy-load off-screen images.
- Self-host and subset fonts with `font-display: swap`. Use at most 3 font files and preload the main one.
- Reserve space for embeds, banners and late content so nothing shifts.
- Keep the main thread free: break up long tasks, debounce input handlers, and animate only `transform` and `opacity`.
- Every third-party script needs a written reason. Load it after the content, and only after consent where required.

## Back end
- Avoid N+1 queries. Select only needed columns, index what you filter and sort on, and check query plans of slow queries.
- Paginate every list with a maximum page size.
- Move slow work (email, uploads, webhooks, LLM calls) out of the request into background jobs.
- Cache with a defined key, lifetime and invalidation. Content-hashed assets get `max-age=31536000, immutable`; HTML revalidates. Compress text responses.

## Reliability
- Every network call has a timeout. Retry only idempotent operations, with backoff, jitter and a limit.
- Background jobs are idempotent and have retries and a dead-letter path.
- Keep servers stateless. Rate-limit public and expensive endpoints, and cap request and upload sizes.
- When a dependency fails, degrade gracefully: show cached or partial data with a clear message.
- Track errors with release versions and set up uptime checks before launch. Alert on what users feel (error rate, latency), not on every log line.
- Deploy from CI on `main` with health checks. Rollback takes minutes. Migrations run as an explicit step.
