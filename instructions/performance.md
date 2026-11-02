---
title: Performance and reliability
description: Core Web Vitals targets, front-end loading, back-end efficiency, caching, timeouts, retries, background jobs, monitoring and deploys for any app or site.
sidebar:
  order: 4
sources:
  - web.dev Core Web Vitals guidance
  - Lighthouse scoring
  - Site Reliability Engineering (Google)
lastVerified: 2026-11-02
---

Load for any app, site or service. Pagination is in the REST API instructions, and indexes are in the database instructions.

## First
- PERF-01: Meet Core Web Vitals at the 75th percentile: LCP ≤ 2.5 s (aim for 2.0 s on content sites), INP ≤ 200 ms, CLS ≤ 0.1.
- PERF-02: Measure before optimising, and enforce budgets (page weight, JavaScript size, Lighthouse scores) in CI rather than by review.
- PERF-03: Ship JavaScript only for interactive parts, so content reads without it. Split code by route and lazy-load what first render doesn't need.
- PERF-04: Every network call has a timeout. Retry only idempotent operations, with backoff, jitter and a limit, so retries can't duplicate work or overload a struggling service.

## Front end
- PERF-05: Put the LCP element in the initial HTML and load its image eagerly with `fetchpriority="high"` (preload it when it is a CSS background). Lazy-load off-screen images and iframes.
- PERF-06: Images use AVIF or WebP, `srcset` and `sizes`, and explicit `width` and `height` (or `aspect-ratio`).
- PERF-07: Self-host and subset fonts with `font-display: swap`. Use at most 3 font files and preload the main one.
- PERF-08: Keep pages eligible for the back/forward cache: use `pagehide` instead of `unload`, and don't send `Cache-Control: no-store` on normal pages.
- PERF-09: Every third-party script needs a written reason. Load it after the content, and only after consent where required. Preconnect only to critical origins.

## Back end
- PERF-10: Avoid N+1 queries, and select only the columns you need.
- PERF-11: Move slow work (email, uploads, webhooks, LLM calls) out of the request into background jobs. Jobs are idempotent, with retries and a dead-letter path.
- PERF-12: Cache with a defined key, lifetime and invalidation. Content-hashed assets get `max-age=31536000, immutable`; HTML revalidates. Serve text with Brotli or gzip.

## Operations
- PERF-13: Track errors with release versions and set up uptime checks before launch. Alert on what users feel (error rate, latency), not on every log line.
- PERF-14: Deploy from CI on `main` with health checks, so a rollback takes minutes. Run migrations as an explicit step.
