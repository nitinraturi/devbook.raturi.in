---
title: Scalability and reliability
description: Stateless services, caching layers, background jobs, timeouts, retries with backoff, graceful degradation, rate limits and capacity planning without premature scale.
sidebar:
  order: 6
---

Build for the load you expect in the next 12 months, with a clear path beyond it. Most early projects fail from bugs and slowness, not from scale.

## Rules

### Architecture
- Application servers **SHOULD** be stateless: sessions, uploads and caches live in shared stores, so instances can be added or replaced.
- Serve static assets and pre-rendered pages from a CDN or edge.
- Slow or failure-prone work (email, image processing, LLM calls, webhooks, reports) **SHOULD** run in background jobs, not in the request.
- Jobs **MUST** be idempotent and safe to retry; they record attempts and send failures to a dead-letter store for inspection.

### Caching
- Cache in layers: CDN/edge for public content, application cache for expensive computations, HTTP caching headers for assets.
- Every cache has a defined key, lifetime and invalidation rule written next to it.
- Content-hashed assets get long immutable caching; HTML gets short or revalidating caching.

### Calling other systems
- Every network call **MUST** have a timeout.
- Retries use exponential backoff with jitter and a maximum attempt count, and only for operations that are safe to repeat.
- Use circuit breakers or fallbacks for dependencies whose failure should not take the whole product down.

### Degrading gracefully
- Decide what the product does when each dependency is down (show cached data, hide the feature, queue the action) and write it in the spec.
- Users see a clear message, never a blank page or raw error.

### Protection
- Rate-limit public endpoints and expensive operations (including LLM calls) per user and per IP.
- Set request size limits and upload limits.

### Capacity
- Know the main limits: database connections, memory per instance, third-party quotas, LLM rate limits and cost.
- Load-test critical paths before launches that may bring a traffic spike.

## Checklist
- [ ] Stateless app tier
- [ ] Background jobs idempotent with retries and dead-letter handling
- [ ] Timeouts on every external call
- [ ] Cache rules documented
- [ ] Degraded behaviour defined per dependency
- [ ] Rate limits and size limits in place
