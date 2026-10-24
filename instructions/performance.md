---
title: Performance and reliability
description: Budgets, Core Web Vitals, front-end loading, back-end efficiency, caching, timeouts, retries, monitoring and deploys for any app, site or service.
sidebar:
  order: 4
---

Load for any app, site or service. Based on web.dev's Core Web Vitals guidance, Lighthouse scoring and Google's *Site Reliability Engineering* book. Pagination is in the REST API instructions, and indexes are in the database instructions.

## Budgets
- Measure before optimising. Set budgets early (page weight, JavaScript size, response time, query count) and enforce them in CI.
- Core Web Vitals at the 75th percentile: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. Aim for LCP ≤ 2.0 s on content sites.
- Lighthouse mobile lab scores: performance 90+ for content sites (85+ for apps), accessibility 95+, and SEO 100 for public sites.
- Set p95 latency targets for API endpoints and track them.

## Front end
- Ship JavaScript only for interactive parts, so content reads without it. Split code by route and lazy-load what first render doesn't need.
- Put the LCP element in the initial HTML. Load an LCP image eagerly with `fetchpriority="high"`, and preload it when it is a CSS background.
- Images use AVIF or WebP, `srcset` and `sizes`, and explicit `width` and `height` (or `aspect-ratio`).
- Self-host and subset fonts with `font-display: swap`. Use at most 3 font files and preload the main one.
- Lazy-load off-screen images and iframes with `loading="lazy"`. Preconnect only to critical third-party origins.
- Keep pages eligible for the back/forward cache: use `pagehide` instead of `unload` handlers, and don't send `Cache-Control: no-store` on normal pages.
- Reserve space for embeds, banners and late content so nothing shifts.
- Keep the main thread free: break up long tasks and debounce input handlers.
- Every third-party script needs a written reason. Load it after the content, and only after consent where required.

## Back end
- Avoid N+1 queries, and select only the columns you need.
- Move slow work (email, uploads, webhooks, LLM calls) out of the request into background jobs.
- Cache with a defined key, lifetime and invalidation. Content-hashed assets get `max-age=31536000, immutable`; HTML revalidates. Serve text with Brotli or gzip over HTTP/2 or HTTP/3.

## Reliability
- Every network call has a timeout. Retry only idempotent operations, with backoff, jitter and a limit, so retries can't duplicate work or overload a struggling service.
- Background jobs are idempotent and have retries and a dead-letter path.
- Keep servers stateless so any instance can serve any request.
- When a dependency fails, degrade gracefully: show cached or partial data with a clear message.
- Track errors with release versions and set up uptime checks before launch. Alert on what users feel (error rate, latency), not on every log line.
- Deploy from CI on `main` with health checks, so a rollback takes minutes. Run migrations as an explicit step.
